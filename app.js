import * as pdfjsLib from "./vendor/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.mjs", import.meta.url).href;
const { PDFDocument, StandardFonts, rgb, degrees, LineCapStyle, BlendMode } = window.PDFLib;

/* ============ Helpers ============ */
const $ = s => document.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const uid = (() => { let n = 0; return p => p + (++n).toString(36); })();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const kb = n => (n < 1048576 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1048576).toFixed(1) + " MB");
const hexRgb = h => { const n = parseInt(h.slice(1), 16); return rgb((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); };
const dpr = () => Math.min(2, devicePixelRatio || 1);
function toast(m, ms = 2800) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms); }
function busy(msg, pct) { const b = $("#busy"); if (msg === false) { b.hidden = true; return; } b.hidden = false; $("#busyMsg").textContent = msg; $("#busyBar").style.width = (pct ?? 0) + "%"; }
const tick = () => new Promise(r => setTimeout(r, 0));
function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
const safeName = () => ($("#docName").value.trim() || "document").replace(/[\\/:*?"<>|]+/g, "-").replace(/\.pdf$/i, "");

/* ============ Anonymous counters (no cookies, no personal data) ============ */
const COUNTER = { on: true, ns: "ifleavesweave", keys: { visits: "Visits", opens: "Files opened", downloads: "PDFs downloaded", splits: "Splits", compress: "Compressions", images: "Image exports", convert: "Word and PowerPoint exports", redact: "Redacted downloads", forms: "Forms filled", requests: "Signing requests created", signed: "Documents signed", board_visits: "Boards: visits", board_created: "Boards: boards made", whiteboard_visits: "Canvas: visits", whiteboard_created: "Canvas: whiteboards made", mindmap_visits: "Maps: visits", mindmap_created: "Maps: maps made", sociogram_visits: "Sociogram: visits", sociogram_created: "Sociogram: sociograms made", genogram_visits: "Genogram: visits", genogram_created: "Genogram: genograms made", prototype_visits: "Prototype: visits", prototype_created: "Prototype: prototypes made", send_to_pdf: "Sent to If Leaves Weave PDF from other tools", home_visits: "Home page: visits", autoredact: "Find and redact: used", redaction_report: "Redaction reports made", word_to_pdf: "Word files converted to PDF", pptx_to_pdf: "PowerPoint files converted to PDF", flipbook_entry: "Arrived at the flipbook maker from a link", compare: "Comparisons", bates: "Bates numbering", flipbook: "Flipbooks (single file)", flipbook_site: "Flipbooks (website folder)", ocr: "Text recognition (OCR)", read_aloud: "Read aloud", paper_pages: "Paper pages added", voice_notes: "Voice notes saved" } };
const canCount = COUNTER.on && !navigator.globalPrivacyControl && navigator.doNotTrack !== "1" && /^https?:/.test(location.protocol);
const noCount = () => { try { return localStorage.getItem("ifleavesweave-nocount") === "1"; } catch { return false; } };
function count(key) { if (noCount()) return; if (!canCount) return; try { fetch(`https://abacus.jasoncameron.dev/hit/${COUNTER.ns}/${key}`, { keepalive: true }).catch(() => {}); } catch {} }
try { if (location.hash !== "#stats" && !sessionStorage.getItem("ifleavesweave-visit")) { sessionStorage.setItem("ifleavesweave-visit", "1"); count("visits"); } } catch {}
async function showStats() {
  const d = $("#statsDlg"), list = $("#statsList"); d.showModal();
  if (!/^https?:/.test(location.protocol)) { list.textContent = "Counts work once the site is online."; return; }
  // totals include counts recorded under the old name (folio-pdf-editor), so history carries on
  const get = async (ns, k) => { try { const r = await fetch(`https://abacus.jasoncameron.dev/get/${ns}/${k}`); return r.ok ? (await r.json()).value || 0 : 0; } catch { return null; } };
  const rows = await Promise.all(Object.entries(COUNTER.keys).map(async ([k, l]) => { const [a, b] = await Promise.all([get(COUNTER.ns, k), get("folio-pdf-editor", k)]); return [l, a == null && b == null ? "–" : (a || 0) + (b || 0)]; }));
  list.innerHTML = rows.map(([l, v]) => `<div><span>${l}</span><b>${typeof v === "number" ? v.toLocaleString() : v}</b></div>`).join("");
}
$("#statsClose").onclick = () => { $("#statsDlg").close(); history.replaceState(null, "", location.pathname); };
addEventListener("hashchange", () => { if (location.hash === "#stats") showStats(); });
if (location.hash === "#stats") setTimeout(showStats, 50);

/* ============ State ============ */
const sources = [];           // {kind:'pdf'|'image'|'blank', name, bytes, pdf, info:[{w,h,rot}], jpg?, w?, h?}
let pages = [];               // {id, src, index, rot, annots:[]}
const sel = new Set();
let hist = [], fut = [], view = "empty", tool = "pages", pendingTool = null, lastClicked = null;

function commit() { hist.push(structuredClone(pages)); if (hist.length > 60) hist.shift(); fut = []; syncHist(); }
let typingCommitted = false;
function commitOnce() { if (!typingCommitted) { commit(); typingCommitted = true; } }
function undo() { if (!hist.length) return; fut.push(structuredClone(pages)); pages = hist.pop(); afterHistory(); }
function redo() { if (!fut.length) return; hist.push(structuredClone(pages)); pages = fut.pop(); afterHistory(); }
function afterHistory() { for (const id of [...sel]) if (!pages.some(p => p.id === id)) sel.delete(id); E.selA = null; E.editing = null; if (E.pi >= pages.length) E.pi = pages.length - 1; syncHist(); refresh(); }
function syncHist() { $("#undoBtn").disabled = !hist.length; $("#redoBtn").disabled = !fut.length; }

const info = p => { const s = sources[p.src]; return s.kind === "pdf" ? s.info[p.index] : { w: s.w, h: s.h, rot: 0 }; };
function dims(p) { const i = info(p), R = ((i.rot + p.rot) % 360 + 360) % 360; return R % 180 ? { R, w: i.h, h: i.w } : { R, w: i.w, h: i.h }; }

/* ============ Loading ============ */
const fileIn = $("#fileIn");
function pick(accept = "application/pdf,image/*,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation", then = null) { pendingTool = then; fileIn.accept = accept; fileIn.value = ""; fileIn.click(); }
fileIn.onchange = () => addFiles([...fileIn.files]);

/* ============ What is this file really? Signature check on open ============
   Reads the first bytes of each file to find its real format, whatever its name says, and refuses programs
   disguised as documents (for example invoice.pdf.exe renamed to invoice.pdf). A lightweight alternative to an
   AI file-type model: for the formats this app opens, these signatures are exact. */
async function sniff(f) {
  const u = new Uint8Array(await f.slice(0, 65536).arrayBuffer()), t = new TextDecoder("latin1").decode(u.subarray(0, 65536)), at = (o, ...b) => b.every((x, i) => u[o + i] === x);
  if (t.slice(0, 1024).includes("%PDF-")) return "pdf";
  if (at(0, 0xFF, 0xD8, 0xFF)) return "jpeg";
  if (at(0, 0x89, 0x50, 0x4E, 0x47)) return "png";
  if (t.startsWith("GIF8")) return "gif";
  if (t.startsWith("RIFF") && t.slice(8, 12) === "WEBP") return "webp";
  if (t.startsWith("BM")) return "bmp";
  if (t.slice(4, 8) === "ftyp") return /^(heic|heix|mif1|msf1|hevc)/.test(t.slice(8, 12)) ? "heic" : /^avif/.test(t.slice(8, 12)) ? "avif" : "video";
  if (at(0, 0x50, 0x4B, 0x03, 0x04)) return t.includes("word/") ? "docx" : t.includes("xl/") ? "xlsx" : t.includes("ppt/") ? "pptx" : "zip";
  if (at(0, 0xD0, 0xCF, 0x11, 0xE0)) return "ole"; // old .doc, .xls, .ppt
  if (t.startsWith("MZ") || at(0, 0x7F, 0x45, 0x4C, 0x46) || at(0, 0xCF, 0xFA, 0xED, 0xFE) || at(0, 0xCA, 0xFE, 0xBA, 0xBE)) return "program";
  if (/^\s*(<!doctype html|<html|<script|<svg)/i.test(t.slice(0, 512))) return /^\s*<svg/i.test(t.slice(0, 512)) ? "svg" : "html";
  if (t.startsWith("#!")) return "program";
  return "unknown";
}
const IMAGE_KINDS = new Set(["jpeg", "png", "gif", "webp", "bmp", "avif"]);

/* ============ Word to PDF, on this device ============
   mammoth (BSD-2-Clause) reads the .docx; jsPDF (MIT) with html2canvas (MIT) lays it out on A4 as real, selectable
   text. Loaded only when a Word file is opened. Layout is simplified: text, headings, lists, tables and images come
   through; text boxes, columns, headers and footers do not. Standard PDF fonts cover Latin scripts only. */
const W2P_LIBS = ["vendor/mammoth.browser.min.js", "vendor/html2canvas.min.js", "vendor/jspdf.umd.min.js"];
const loadVendor = src => new Promise((res, rej) => { if (document.querySelector(`script[data-src="${src}"]`)) return res(); const sc = document.createElement("script"); sc.src = src; sc.dataset.src = src; sc.onload = res; sc.onerror = () => rej(new Error("load " + src)); document.head.append(sc); });
async function wordToPdf(f) {
  for (const s2 of W2P_LIBS) await loadVendor(s2);
  const result = await window.mammoth.convertToHtml({ arrayBuffer: await f.arrayBuffer() }, { styleMap: ["p[style-name='Title'] => h1.title:fresh", "p[style-name='Subtitle'] => p.subtitle:fresh"], convertImage: window.mammoth.images.imgElement(img => img.read("base64").then(d => ({ src: `data:${img.contentType};base64,${d}` }))) });
  // laid out in view but beneath the app (html2canvas captures nothing positioned off screen)
  const box = document.createElement("div"); box.className = "w2p"; box.setAttribute("aria-hidden", "true"); box.innerHTML = result.value;
  box.querySelectorAll("a[href]").forEach(a => { if (!/^(https?:|mailto:|#)/i.test(a.getAttribute("href"))) a.removeAttribute("href"); }); // no javascript: links
  box.querySelectorAll("script, iframe, object, embed").forEach(n => n.remove());
  document.body.append(box);
  const nonLatin = /[^\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F\u20AC\u2122\s]/.test(box.textContent);
  try {
    const doc = new window.jspdf.jsPDF({ unit: "pt", format: "a4" });
    await doc.html(box, { margin: [56, 56, 56, 56], autoPaging: "text", width: 483, windowWidth: 680, html2canvas: { scale: 0.71, useCORS: false, logging: false } });
    doc.setProperties({ title: f.name.replace(/\.docx$/i, ""), creator: "If Leaves Weave" });
    return { bytes: new Uint8Array(doc.output("arraybuffer")), warnings: result.messages.filter(m => m.type === "warning").length, nonLatin };
  } finally { box.remove(); }
}

/* ============ PowerPoint to PDF, on this device ============
   A .pptx is a ZIP of XML. Each slide is drawn on a canvas (text boxes, shapes, pictures and backgrounds, with placeholder
   positions taken from the slide layout when a slide doesn't set them), then becomes a PDF page with an invisible,
   searchable text layer. Simplified: theme colours, charts, SmartArt, tables, gradients and animations are not drawn. */
const EMU = 12700; // EMUs per point
async function pptxToPdf(f) {
  const zip = await JSZip.loadAsync(await f.arrayBuffer()), read = p => zip.file(p)?.async("string"), xml = t => new DOMParser().parseFromString(t, "application/xml");
  const ns = { p: "http://schemas.openxmlformats.org/presentationml/2006/main", a: "http://schemas.openxmlformats.org/drawingml/2006/main", r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships" };
  const q = (el, pre, name) => el ? [...el.getElementsByTagNameNS(ns[pre], name)] : [], q1 = (el, pre, name) => q(el, pre, name)[0] || null;
  const kids = (el, pre, name) => el ? [...el.children].filter(c => c.namespaceURI === ns[pre] && c.localName === name) : [];
  const pres = xml(await read("ppt/presentation.xml")), sz = q1(pres, "p", "sldSz"), cx = +sz.getAttribute("cx"), cy = +sz.getAttribute("cy");
  const rels = async path => { const dir = path.replace(/[^/]+$/, ""), t = await read(dir + "_rels/" + path.split("/").pop() + ".rels"); const m = {}; if (t) for (const r of q(xml(t), "", "Relationship").length ? q(xml(t), "", "Relationship") : [...xml(t).getElementsByTagName("Relationship")]) m[r.getAttribute("Id")] = new URL(r.getAttribute("Target"), "http://x/" + dir).pathname.slice(1); return m; };
  const presRels = await rels("ppt/presentation.xml"), order = q(pres, "p", "sldId").map(s => presRels[s.getAttributeNS(ns.r, "id")]).filter(Boolean);
  const W = 1920, H = Math.round(1920 * cy / cx), k = W / cx, ptPx = W / (cx / EMU);
  const color = el => { const c = q1(el, "a", "srgbClr"); return c ? "#" + c.getAttribute("val") : null; };
  const xfrm = sp => { const x = q1(sp, "a", "xfrm"), off = q1(x, "a", "off"), ext = q1(x, "a", "ext"); return off && ext ? { x: +off.getAttribute("x"), y: +off.getAttribute("y"), w: +ext.getAttribute("cx"), h: +ext.getAttribute("cy") } : null; };
  const phKey = sp => { const ph = q1(sp, "p", "ph"); return ph ? (ph.getAttribute("type") || "body") + ":" + (ph.getAttribute("idx") || "") : null; };
  const doc = await PDFDocument.create(), font = await doc.embedFont(StandardFonts.Helvetica); doc.setTitle(f.name.replace(/\.pptx$/i, "")); doc.setCreator("If Leaves Weave");
  const safe = t => [...t].map(ch => { try { font.encodeText(ch); return ch; } catch { return ""; } }).join("");
  for (const sp of order) {
    const sx = xml(await read(sp)), sRels = await rels(sp), layoutPath = Object.values(sRels).find(v => /slideLayout/.test(v)), layout = layoutPath ? xml(await read(layoutPath)) : null;
    // placeholder positions: from the slide layout, and failing that from the slide master the layout is based on
    const lay = {}, addFrom = d => { if (d) q(d, "p", "sp").forEach(s2 => { const kk = phKey(s2), x = xfrm(s2); if (kk && x) { lay[kk] ||= x; lay[kk.split(":")[0] + ":"] ||= x; } }); };
    let styleSize = { title: 0, body: 0, other: 0 };
    addFrom(layout); if (layoutPath) { const lr = await rels(layoutPath), mp = Object.values(lr).find(v => /slideMaster/.test(v)); if (mp) { const md = xml(await read(mp)); addFrom(md);
      const sz = st => +q1(q1(q1(md, "p", st), "a", "lvl1pPr"), "a", "defRPr")?.getAttribute("sz") / 100 || 0; styleSize = { title: sz("titleStyle"), body: sz("bodyStyle"), other: sz("otherStyle") }; } }
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"), texts = [];
    g.fillStyle = color(q1(q1(sx, "p", "bg"), "a", "solidFill")) || color(q1(q1(layout, "p", "bg"), "a", "solidFill")) || "#ffffff"; g.fillRect(0, 0, W, H);
    const tree = q1(sx, "p", "spTree");
    const drawShape = async (el, ox = 0, oy = 0, sxk = 1, syk = 1) => {
      if (el.localName === "grpSp") { const gx = q1(q1(el, "p", "grpSpPr"), "a", "xfrm"), off = q1(gx, "a", "off"), ext = q1(gx, "a", "ext"), co = q1(gx, "a", "chOff"), ce = q1(gx, "a", "chExt");
        const fx = ext && ce ? +ext.getAttribute("cx") / (+ce.getAttribute("cx") || 1) : 1, fy = ext && ce ? +ext.getAttribute("cy") / (+ce.getAttribute("cy") || 1) : 1;
        const nox = off ? ox + (+off.getAttribute("x") - (co ? +co.getAttribute("x") * fx : 0)) * sxk : ox, noy = off ? oy + (+off.getAttribute("y") - (co ? +co.getAttribute("y") * fy : 0)) * syk : oy;
        for (const ch of [...el.children]) if (["sp", "pic", "grpSp"].includes(ch.localName)) await drawShape(ch, nox, noy, sxk * fx, syk * fy); return; }
      // a body placeholder in the slide may be typed "body" or only numbered; titles may be "title" or "ctrTitle"
      const spPr = kids(el, "p", "spPr")[0], key = phKey(el), kind = key?.split(":")[0]; let b = xfrm(spPr) || (key && (lay[key] || lay[kind + ":"] || (kind === "ctrTitle" && lay["title:"]) || (kind === "subTitle" && lay["body:"]) || (kind === "body" && lay["body:1"]))); if (!b) return;
      b = { x: ox + b.x * sxk, y: oy + b.y * syk, w: b.w * sxk, h: b.h * syk }; const X = b.x * k, Y = b.y * k, Wd = b.w * k, Ht = b.h * k;
      if (el.localName === "pic") { const id = q1(el, "a", "blip")?.getAttributeNS(ns.r, "embed"), path = sRels[id]; if (path && zip.file(path)) { const blob = new Blob([await zip.file(path).async("uint8array")]); try { const bmp = await createImageBitmap(blob); g.drawImage(bmp, X, Y, Wd, Ht); } catch {} } return; }
      const geom = q1(spPr, "a", "prstGeom")?.getAttribute("prst") || "rect", fill = color(kids(spPr, "a", "solidFill")[0]);
      if (fill && !q1(spPr, "a", "noFill")) { g.fillStyle = fill; g.beginPath(); geom === "ellipse" ? g.ellipse(X + Wd / 2, Y + Ht / 2, Wd / 2, Ht / 2, 0, 0, Math.PI * 2) : g.roundRect(X, Y, Wd, Ht, geom === "roundRect" ? Math.min(Wd, Ht) * .16 : 0); g.fill(); }
      const ln = kids(spPr, "a", "ln")[0]; if (ln && color(ln) && !q1(ln, "a", "noFill")) { g.strokeStyle = color(ln); g.lineWidth = Math.max(1, (+ln.getAttribute("w") || 12700) * k); g.strokeRect(X, Y, Wd, Ht); }
      const body = kids(el, "p", "txBody")[0]; if (!body) return; const bp = q1(body, "a", "bodyPr"), anchor = bp?.getAttribute("anchor") || (key?.startsWith("ctrTitle") || key?.startsWith("title") || (!key && q1(el, "p", "cNvSpPr")?.getAttribute("txBox") !== "1") ? "ctr" : "t");
      const inL = (+(bp?.getAttribute("lIns") ?? 91440)) * k, inT = (+(bp?.getAttribute("tIns") ?? 45720)) * k, maxW = Wd - inL * 2, lines = [];
      // text boxes start top-left; other shapes centre their text, as PowerPoint does
      const isTitle = key && /^(title|ctrTitle)/.test(key), isBox = q1(el, "p", "cNvSpPr")?.getAttribute("txBox") === "1", shapeText = !key && !isBox;
      const defSize = isTitle ? (styleSize.title || 40) * (key.startsWith("ctrTitle") ? 1.1 : 1) : key?.startsWith("subTitle") ? (styleSize.body || 24) * .75 : key ? (styleSize.body || 22) : (styleSize.other || 18);
      for (const para of q(body, "a", "p")) { const pPr = q1(para, "a", "pPr"), algn = pPr?.getAttribute("algn") || (key?.startsWith("ctrTitle") || key?.startsWith("subTitle") || shapeText ? "ctr" : "l");
        const runs = q(para, "a", "r").map(r => { const rp = q1(r, "a", "rPr"); return { t: q1(r, "a", "t")?.textContent || "", size: (+(rp?.getAttribute("sz")) / 100 || defSize), bold: rp?.getAttribute("b") === "1" || isTitle, color: color(rp) || "#000000" }; });
        const bullet = q1(pPr, "a", "buChar") || (key && /^body/.test(key) && runs.length && !q1(pPr, "a", "buNone")); const text = (bullet ? "• " : "") + runs.map(r => r.t).join(""), r0 = runs[0] || { size: defSize, bold: isTitle, color: "#000000" };
        const px = r0.size * ptPx; g.font = `${r0.bold ? 700 : 400} ${px}px Helvetica, Arial, sans-serif`;
        let line = ""; const words = text.split(/(\s+)/); for (const w of words) { const t2 = line + w; if (g.measureText(t2).width > maxW && line.trim()) { lines.push({ s: line.trimEnd(), px, bold: r0.bold, color: r0.color, algn }); line = w.trimStart(); } else line = t2; }
        lines.push({ s: line, px, bold: r0.bold, color: r0.color, algn }); }
      const total = lines.reduce((a, l) => a + l.px * 1.2, 0); let y = anchor === "ctr" ? Y + (Ht - total) / 2 : anchor === "b" ? Y + Ht - inT - total : Y + inT;
      g.textBaseline = "top"; for (const l of lines) { g.font = `${l.bold ? 700 : 400} ${l.px}px Helvetica, Arial, sans-serif`; g.fillStyle = l.color; const lw = g.measureText(l.s).width, tx = l.algn === "ctr" ? X + (Wd - lw) / 2 : l.algn === "r" ? X + Wd - inL - lw : X + inL; g.fillText(l.s, tx, y); if (l.s.trim()) texts.push({ s: l.s, x: tx / W, y: (y + l.px * .85) / H, size: l.px / W }); y += l.px * 1.2; }
    };
    for (const el of [...(tree?.children || [])]) if (["sp", "pic", "grpSp"].includes(el.localName)) await drawShape(el);
    const jpg = await doc.embedJpg(await (await new Promise(r => c.toBlob(r, "image/jpeg", .9))).arrayBuffer()), pw = cx / EMU, ph = cy / EMU, page = doc.addPage([pw, ph]);
    page.drawImage(jpg, { x: 0, y: 0, width: pw, height: ph });
    for (const t of texts) { const v = safe(t.s); if (v) page.drawText(v, { x: t.x * pw, y: ph - t.y * ph, size: t.size * pw, font, opacity: 0 }); } // searchable, invisible
  }
  return { bytes: await doc.save(), slides: order.length };
}

async function addFiles(files, insertAt = null) {
  // check what each file really is, whatever its name says
  const checked = [], notes = [];
  for (const f of files) {
    const kind = await sniff(f).catch(() => "unknown");
    if (kind === "program" || kind === "html") { toast(`“${f.name}” isn’t a document: it looks like ${kind === "program" ? "a program" : "a web page"}, so it wasn’t opened. Files that hide what they are can be harmful.`, 6500); continue; }
    if (kind === "pdf" || IMAGE_KINDS.has(kind) || kind === "docx" || kind === "pptx") { if ((kind === "pdf") !== /\.pdf$/i.test(f.name) && !(IMAGE_KINDS.has(kind) && /\.(jpe?g|png|gif|webp|bmp|avif)$/i.test(f.name)) && !(kind === "docx" && /\.docx$/i.test(f.name)) && !(kind === "pptx" && /\.pptx$/i.test(f.name))) notes.push(`“${f.name}” is really a ${kind === "docx" ? "Word document" : kind === "pptx" ? "PowerPoint file" : kind.toUpperCase() + (kind === "pdf" ? "" : " image")}, so it was opened as one.`); checked.push({ f, kind }); continue; }
    if (kind === "ole") { toast(`“${f.name}” is an older Word, Excel or PowerPoint file. Save it as .docx or .pptx, then open it here.`, 6000); continue; }
    if (kind === "heic") { toast(`“${f.name}” is a HEIC photo, which this browser may not open. Export it as JPEG first.`, 5000); continue; }
    toast(`“${f.name}” isn’t a PDF, Word document or image, so it wasn’t opened.`, 4500);
  }
  if (!checked.length) return;
  const added = [];
  for (let i = 0; i < checked.length; i++) {
    const { f, kind } = checked[i]; busy(`Opening ${f.name}`, (i / checked.length) * 100); await tick();
    try {
      if (IMAGE_KINDS.has(kind)) added.push(...await loadImage(f.type.startsWith("image/") ? f : new File([f], f.name, { type: "image/" + kind })));
      else if (kind === "pptx") {
        busy(`Turning ${f.name} into PDF pages`, (i / checked.length) * 100); const pp = await pptxToPdf(f);
        added.push(...await loadPdf(new File([pp.bytes], f.name.replace(/\.pptx$/i, "") + ".pdf", { type: "application/pdf" }))); count("pptx_to_pdf");
        notes.push(`“${f.name}” was converted from PowerPoint (${pp.slides} slide${pp.slides === 1 ? "" : "s"}) with a simplified look: charts, SmartArt, tables, theme colours and animations aren’t drawn. Check the pages before sharing.`);
      }
      else if (kind === "docx") {
        busy(`Turning ${f.name} into PDF pages`, (i / checked.length) * 100); const w = await wordToPdf(f);
        added.push(...await loadPdf(new File([w.bytes], f.name.replace(/\.docx$/i, "") + ".pdf", { type: "application/pdf" }))); count("word_to_pdf");
        notes.push(w.nonLatin ? `“${f.name}” was converted, but some characters (such as Arabic or Chinese) may not display: for those, save as PDF from Word instead.` : `“${f.name}” was converted from Word with a simplified layout${w.warnings ? "; some formatting, such as text boxes or columns, may differ" : ""}. Check the pages before sharing.`);
      }
      else added.push(...await loadPdf(f));
    } catch (err) {
      console.error(err);
      toast(err && err.name === "PasswordException" ? `“${f.name}” is password-protected. Remove the password, then open it here.` : `Couldn’t open “${f.name}”. It may be damaged.`, 4200);
    }
  }
  busy(false);
  if (!added.length) return;
  commit();
  const at = insertAt ?? (sel.size ? Math.max(...pages.map((p, i) => (sel.has(p.id) ? i : -1))) + 1 : pages.length);
  pages.splice(at, 0, ...added);
  const wasEmpty = view === "empty";
  if (wasEmpty) { $("#docName").value = files[0].name.replace(/\.[^.]+$/, ""); showApp(); }
  const reqSrc = wasEmpty ? sources[added[0].src] : null;
  if (reqSrc && reqSrc.req) { hist = []; syncHist(); startSigning(added[0].src); return; }
  refresh();
  toast([`${added.length} page${added.length > 1 ? "s" : ""} added.`, ...notes].join(" "), notes.length ? 7000 : 2800);
  if (pendingTool) { const t = pendingTool; pendingTool = null; selectTool(t.tool || t); if (t.sign) startSign(); }
}
async function loadPdf(f) {
  const bytes = new Uint8Array(await f.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  const inf = [];
  for (let i = 1; i <= pdf.numPages; i++) { const pg = await pdf.getPage(i), v = pg.view; inf.push({ w: v[2] - v[0], h: v[3] - v[1], rot: pg.rotate || 0 }); }
  let req = null;
  try { const att = await pdf.getAttachments(); const hit = att && Object.values(att).find(a => a.filename === REQ_FILE); if (hit) { req = JSON.parse(new TextDecoder().decode(hit.content)); if (!["ifleavesweave", "folio"].includes(req.app) || req.type !== "signature-request") req = null; } } catch { req = null; }
  const fields = await readFormFields(bytes);
  const src = sources.push({ kind: "pdf", name: f.name, bytes, pdf, info: inf, req, fields, formValues: {} }) - 1;
  if (fields.length) toast(`This PDF has ${fields.length} fillable field${fields.length > 1 ? "s" : ""}. Open Fill form to complete them.`, 4200);
  count("opens");
  const n = req ? Math.min(req.baseCount, inf.length) : inf.length;
  return inf.slice(0, n).map((_, index) => ({ id: uid("p"), src, index, rot: 0, annots: [] }));
}
async function loadImage(f) {
  const bmp = await createImageBitmap(f, { imageOrientation: "from-image" }).catch(async () => { const i = new Image(); i.src = URL.createObjectURL(f); await i.decode(); return i; });
  const W = bmp.width, H = bmp.height, k = Math.min(1, 3000 / Math.max(W, H)), c = document.createElement("canvas");
  c.width = Math.round(W * k); c.height = Math.round(H * k);
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(bmp, 0, 0, c.width, c.height);
  const jpg = new Uint8Array(await (await new Promise(r => c.toBlob(r, "image/jpeg", .92))).arrayBuffer());
  const pt = Math.min(1, 842 / (Math.max(W, H) * .75)), w = W * .75 * pt, h = H * .75 * pt;
  const src = sources.push({ kind: "image", name: f.name, jpg, w, h, canvas: c }) - 1; count("opens");
  return [{ id: uid("p"), src, index: 0, rot: 0, annots: [] }];
}
function blankPage() {
  let src = sources.findIndex(s => s.kind === "blank");
  if (src < 0) src = sources.push({ kind: "blank", name: "Blank", w: 595.28, h: 841.89 }) - 1;
  return { id: uid("p"), src, index: 0, rot: 0, annots: [] };
}

/* drag & drop + paste */
const stage = $("#stage");
addEventListener("dragover", e => { if ([...e.dataTransfer.types].includes("Files")) { e.preventDefault(); stage.classList.add("drag"); } });
addEventListener("dragleave", e => { if (!e.relatedTarget) stage.classList.remove("drag"); });
addEventListener("drop", e => { if (![...e.dataTransfer.types].includes("Files")) return; e.preventDefault(); stage.classList.remove("drag"); addFiles([...e.dataTransfer.files]); });
addEventListener("paste", e => { if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return; const fs = [...(e.clipboardData?.files || [])]; if (fs.length) addFiles(fs); });

/* ============ Rendering pages ============ */
const thumbCache = new Map();
let renderChain = Promise.resolve();
function renderPageCanvas(p, targetW) {
  const job = renderChain.then(() => drawPage(p, targetW));
  renderChain = job.catch(() => {});
  return job;
}
async function drawPage(p, targetW) {
  const s = sources[p.src], d = dims(p), c = document.createElement("canvas");
  const scale = targetW / d.w; c.width = Math.max(1, Math.round(d.w * scale)); c.height = Math.max(1, Math.round(d.h * scale));
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
  if (s.kind === "pdf") {
    const pg = await s.pdf.getPage(p.index + 1);
    const vp = pg.getViewport({ scale, rotation: d.R });
    await pg.render({ canvasContext: x, viewport: vp }).promise;
  } else if (s.kind === "image") {
    x.save(); x.translate(c.width / 2, c.height / 2); x.rotate(d.R * Math.PI / 180);
    const iw = (d.R % 180 ? c.height : c.width), ih = (d.R % 180 ? c.width : c.height);
    x.drawImage(s.canvas, -iw / 2, -ih / 2, iw, ih); x.restore();
  }
  return c;
}
async function thumb(p, w) {
  const d = dims(p), key = `${p.src}:${p.index}:${d.R}:${w}`;
  if (!thumbCache.has(key)) thumbCache.set(key, renderPageCanvas(p, w));
  return thumbCache.get(key);
}

/* annotations drawn onto a canvas (thumbnails) */
const imgEls = new Map();
function imgEl(src) { if (!imgEls.has(src)) { const i = new Image(); i.src = src; i.onload = () => scheduleGrid(); imgEls.set(src, i); } return imgEls.get(src); }
const CSSFONT = { Helvetica: "Helvetica, Arial, sans-serif", Times: "'Times New Roman', Times, serif", Courier: "'Courier New', Courier, monospace" };
const BASE = { Helvetica: .945, Times: .937, Courier: .866 };
function paintAnnots(x, p, W, H) {
  const d = dims(p), k = W / d.w;
  for (const a of p.annots) {
    if (a.type === "text") { x.fillStyle = a.color; x.font = `${a.italic ? "italic " : ""}${a.bold ? 700 : 400} ${a.size * k}px ${CSSFONT[a.font]}`; a.text.split("\n").forEach((l, i) => x.fillText(l, a.x * W, a.y * H + (i * 1.2 + BASE[a.font]) * a.size * k)); }
    else if (a.type === "img") { const i = imgEl(a.src); if (i.complete) x.drawImage(i, a.x * W, a.y * H, a.w * W, a.h * H); }
    else if (a.type === "rect") { x.globalAlpha = a.kind === "hl" ? .45 : 1; x.fillStyle = a.color; x.fillRect(a.x * W, a.y * H, a.w * W, a.h * H); x.globalAlpha = 1; }
    else if (a.type === "pen") { x.strokeStyle = a.color; x.lineWidth = a.width * k; x.lineCap = x.lineJoin = "round"; x.beginPath(); a.pts.forEach(([u, v], i) => (i ? x.lineTo(u * W, v * H) : x.moveTo(u * W, v * H))); x.stroke(); }
    else if (a.type === "field") { x.setLineDash([4, 3]); x.strokeStyle = signerColor(a.signer); x.lineWidth = 1.5; x.strokeRect(a.x * W, a.y * H, a.w * W, a.h * H); x.setLineDash([]); }
    else if (a.type === "mark") { x.strokeStyle = a.color; x.lineWidth = Math.max(1, a.w * W * .14); x.lineCap = x.lineJoin = "round"; x.beginPath(); MARKS[a.glyph].forEach(seg => seg.forEach(([u, v], i) => (i ? x.lineTo((a.x + u * a.w) * W, (a.y + v * a.h) * H) : x.moveTo((a.x + u * a.w) * W, (a.y + v * a.h) * H)))); x.stroke(); }
  }
}
const MARKS = { tick: [[[.12, .55], [.4, .85], [.9, .15]]], cross: [[[.15, .15], [.85, .85]], [[.85, .15], [.15, .85]]] };

/* ============ App shell ============ */
function showApp() { $("#rail").hidden = false; $("#side").hidden = false; $("#work").classList.remove("bare"); $("#docName").hidden = false; $("#closeBtn").hidden = false; $("#dlBtn").disabled = false; setView("grid"); }
function setView(v) { view = v; $("#empty").hidden = v !== "empty"; $("#gridView").hidden = v !== "grid"; $("#editView").hidden = v !== "edit"; }
function refresh() {
  if (view === "empty") return;
  if (!pages.length) { resetAll(); return; }
  if (view === "grid") scheduleGrid(); else renderEditor();
  syncSelPanel(); if (tool === "split") syncSplit();
}
function selectTool(t) {
  if (!pages.length) return;
  if (E.editing) endEdit();
  tool = t;
  $$(".tool").forEach(b => b.setAttribute("aria-selected", b.dataset.tool === t));
  $$(".pane").forEach(p => (p.hidden = p.dataset.pane !== t));
  if (t === "edit") { if (view !== "edit") openEditor(sel.size ? pages.findIndex(p => sel.has(p.id)) : 0); }
  else if (view !== "grid" && t !== "request") { setView("grid"); scheduleGrid(); }
  if (t === "request") syncRequest();
  if (t === "split") syncSplit();
  if (t === "compress") measureNow();
  if (t === "form") renderForm();
  stage.scrollTop = 0;
}
$$(".tool").forEach(b => (b.onclick = () => selectTool(b.dataset.tool)));
function resetAll() { SIGN = null; $(".app").classList.remove("signing"); pages = []; sel.clear(); hist = []; fut = []; syncHist(); thumbCache.clear(); setView("empty"); $("#rail").hidden = $("#side").hidden = true; $("#work").classList.add("bare"); $("#docName").hidden = $("#closeBtn").hidden = true; $("#dlBtn").disabled = true; tool = "pages"; $$(".tool").forEach(b => b.setAttribute("aria-selected", b.dataset.tool === "pages")); $$(".pane").forEach(p => (p.hidden = p.dataset.pane !== "pages")); }
$("#closeBtn").onclick = () => goHome();
function goHome() {
  if (pages.length && (hist.length || (SIGN && Object.keys(SIGN.values).length)) && !confirm("Close this document and go back to the start? Changes you haven’t downloaded will be lost.")) return;
  if (pages.length) resetAll();
  if (location.hash) history.replaceState(null, "", location.pathname);
  $("#openBtn").focus();
}
$("#homeLink").addEventListener("click", e => { e.preventDefault(); goHome(); });
addEventListener("beforeunload", e => { if (pages.length && hist.length) { e.preventDefault(); e.returnValue = ""; } });

/* ============ Grid ============ */
const grid = $("#pages");
let gridQueued = false, thumbW = 170;
function scheduleGrid() { if (gridQueued) return; gridQueued = true; requestAnimationFrame(() => { gridQueued = false; if (view === "grid") renderGrid(); }); }
function renderGrid() {
  $("#pageCount").textContent = `${pages.length} page${pages.length === 1 ? "" : "s"}${sel.size ? `, ${sel.size} selected` : ""}`;
  grid.classList.toggle("selecting", sel.size > 0);
  const numOn = $("#numOn").checked, wmOn = $("#wmOn").checked, wm = esc($("#wmText").value);
  grid.innerHTML = pages.map((p, i) => `
    <div class="pg${sel.has(p.id) ? " sel" : ""}" data-id="${p.id}" draggable="true">
      <div class="paper" tabindex="0" role="checkbox" aria-checked="${sel.has(p.id)}" aria-label="Page ${i + 1}"><div class="ph"></div>
        ${numOn ? `<span class="ov-num">${numLabel(i, pages.length) ?? ""}</span>` : ""}${wmOn && wm ? `<span class="ov-wm"><span>${wm}</span></span>` : ""}
      </div>
      <span class="tick" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L19 7"/></svg></span>
      <div class="acts">
        <button data-a="rotr" title="Rotate" aria-label="Rotate page ${i + 1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4v6h-6"/><path d="M20.5 10A8.5 8.5 0 1 0 18 16.5"/></svg></button>
        <button data-a="edit" title="Edit page" aria-label="Edit page ${i + 1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg></button>
        <button data-a="del" title="Delete page" aria-label="Delete page ${i + 1}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg></button>
      </div>
      ${p.annots.length ? `<span class="badge">Edited</span>` : ""}
      <span class="num">${i + 1}</span>
    </div>`).join("");
  const w = Math.round(thumbW * dpr());
  pages.forEach(p => thumb(p, w).then(c => {
    const el = grid.querySelector(`.pg[data-id="${p.id}"] .ph`); if (!el) return;
    const out = document.createElement("canvas"); out.width = c.width; out.height = c.height;
    const x = out.getContext("2d"); x.drawImage(c, 0, 0); paintAnnots(x, p, c.width, c.height);
    out.style.width = "100%"; el.replaceWith(out);
  }).catch(console.error));
}
grid.addEventListener("click", e => {
  const pg = e.target.closest(".pg"); if (!pg) return; const id = pg.dataset.id, i = pages.findIndex(p => p.id === id);
  const act = e.target.closest("[data-a]");
  if (act) {
    if (act.dataset.a === "rotr") { commit(); pages[i].rot = (pages[i].rot + 90) % 360; refresh(); }
    if (act.dataset.a === "del") { if (pages.length === 1) return toast("A PDF needs at least one page."); commit(); pages.splice(i, 1); sel.delete(id); refresh(); toast("Page deleted. Undo brings it back."); }
    if (act.dataset.a === "edit") { tool = "edit"; selectToolUI("edit"); openEditor(i); }
    return;
  }
  if (e.shiftKey && lastClicked) { const a = pages.findIndex(p => p.id === lastClicked); const [lo, hi] = [Math.min(a, i), Math.max(a, i)]; for (let k = lo; k <= hi; k++) sel.add(pages[k].id); }
  else if (sel.has(id)) sel.delete(id); else sel.add(id);
  lastClicked = id; scheduleGrid(); syncSelPanel();
});
grid.addEventListener("dblclick", e => { const pg = e.target.closest(".pg"); if (pg && !e.target.closest("[data-a]")) { selectToolUI("edit"); tool = "edit"; openEditor(pages.findIndex(p => p.id === pg.dataset.id)); } });
grid.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && e.target.classList.contains("paper")) { e.preventDefault(); e.target.click(); } });
function selectToolUI(t) { $$(".tool").forEach(b => b.setAttribute("aria-selected", b.dataset.tool === t)); $$(".pane").forEach(p => (p.hidden = p.dataset.pane !== t)); }

/* drag reorder */
let dragId = null;
grid.addEventListener("dragstart", e => { const pg = e.target.closest(".pg"); if (!pg) return; dragId = pg.dataset.id; e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", dragId); requestAnimationFrame(() => { const ids = sel.has(dragId) ? sel : new Set([dragId]); ids.forEach(id => grid.querySelector(`.pg[data-id="${id}"]`)?.classList.add("dragging")); }); });
grid.addEventListener("dragover", e => { if (!dragId) return; e.preventDefault(); e.stopPropagation(); $$(".drop-before,.drop-after", grid).forEach(x => x.classList.remove("drop-before", "drop-after")); const pg = e.target.closest(".pg"); if (!pg || pg.dataset.id === dragId) return; const r = pg.getBoundingClientRect(); pg.classList.add(e.clientX < r.left + r.width / 2 ? "drop-before" : "drop-after"); });
grid.addEventListener("drop", e => {
  if (!dragId) return; e.preventDefault(); e.stopPropagation();
  const pg = e.target.closest(".pg"), after = pg?.classList.contains("drop-after"), target = pg?.dataset.id;
  const ids = sel.has(dragId) ? pages.filter(p => sel.has(p.id)).map(p => p.id) : [dragId];
  if (target && !ids.includes(target)) { commit(); const moving = pages.filter(p => ids.includes(p.id)); pages = pages.filter(p => !ids.includes(p.id)); let at = pages.findIndex(p => p.id === target) + (after ? 1 : 0); pages.splice(at, 0, ...moving); }
  dragId = null; refresh();
});
grid.addEventListener("dragend", () => { dragId = null; scheduleGrid(); });

/* selection panel */
function syncSelPanel() {
  const n = sel.size; $("#selLabel").textContent = n ? `${n} page${n > 1 ? "s" : ""} selected` : "Nothing selected. Click pages to select them.";
  $$("#selActs [data-sa]").forEach(b => (b.disabled = !n || (b.dataset.sa === "edit" && n !== 1)));
}
$("#selActs").onclick = async e => {
  const b = e.target.closest("[data-sa]"); if (!b || b.disabled) return; const a = b.dataset.sa, idx = pages.map((p, i) => (sel.has(p.id) ? i : -1)).filter(i => i >= 0);
  if (a === "clear") { sel.clear(); return refresh(); }
  if (a === "edit") { tool = "edit"; selectToolUI("edit"); return openEditor(idx[0]); }
  if (a === "extract") return exportPdf(idx.map(i => pages[i]), `${safeName()}-pages.pdf`);
  if (a === "del" && idx.length === pages.length) return toast("Keep at least one page. Select fewer pages to delete.");
  commit();
  if (a === "rotl" || a === "rotr") idx.forEach(i => (pages[i].rot = (pages[i].rot + (a === "rotr" ? 90 : 270)) % 360));
  if (a === "del") { pages = pages.filter(p => !sel.has(p.id)); sel.clear(); toast(`${idx.length} page${idx.length > 1 ? "s" : ""} deleted. Undo brings them back.`); }
  if (a === "dup") { const copies = []; for (let k = idx.length - 1; k >= 0; k--) { const c = structuredClone(pages[idx[k]]); c.id = uid("p"); c.annots.forEach(an => (an.id = uid("a"))); pages.splice(idx[k] + 1, 0, c); copies.push(c.id); } }
  if (a === "up" && idx[0] > 0) idx.forEach(i => ([pages[i - 1], pages[i]] = [pages[i], pages[i - 1]]));
  if (a === "down" && idx[idx.length - 1] < pages.length - 1) [...idx].reverse().forEach(i => ([pages[i + 1], pages[i]] = [pages[i], pages[i + 1]]));
  refresh();
};
$("#selAll").onclick = () => { if (sel.size === pages.length) sel.clear(); else pages.forEach(p => sel.add(p.id)); refresh(); };
$("#addBlank").onclick = () => { commit(); const at = sel.size ? Math.max(...pages.map((p, i) => (sel.has(p.id) ? i : -1))) + 1 : pages.length; pages.splice(at, 0, blankPage()); refresh(); toast("Blank page added"); };
$("#addMore").onclick = () => pick(); $("#addBtn").onclick = () => pick(); $("#openBtn").onclick = () => FLIP_MODE ? pick("application/pdf", "flip") : pick();
$("#thumbSize").onclick = e => { const b = e.target.closest("[data-ts]"); if (!b) return; thumbW = +b.dataset.ts; grid.style.setProperty("--thumb", thumbW + "px"); $$("#thumbSize .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); scheduleGrid(); };

/* ============ Editor ============ */
const E = { pi: 0, tool: "select", selA: null, editing: null, zoom: 1, cssW: 0 };
const D = { text: { font: "Helvetica", size: 12, color: "#111111", bold: false, italic: false }, pen: { color: "#1F3FBF", width: 2 }, hl: "#FFE066" };
const sheet = $("#sheet"), pcv = $("#pageCanvas"), layer = $("#layer"), estage = $("#estage");
let pageRenderToken = 0;
function openEditor(i) { E.pi = clamp(i, 0, pages.length - 1); E.selA = null; E.editing = null; setView("edit"); const pane = SIGN ? "signing" : tool === "request" ? "request" : "edit"; $$(".pane").forEach(p => (p.hidden = p.dataset.pane !== pane)); setETool("select"); renderEditor(); renderSigs(); }
const curPage = () => pages[E.pi];
async function renderEditor() {
  const p = curPage(); if (!p) return; const d = dims(p);
  $("#pgLabel").textContent = `${E.pi + 1} / ${pages.length}`; $("#prevPg").disabled = E.pi === 0; $("#nextPg").disabled = E.pi === pages.length - 1;
  const aw = estage.clientWidth - 40, ah = stage.clientHeight - $("#ebar").offsetHeight - 110;
  const fit = Math.max(120, Math.min(aw, ah * d.w / d.h)); E.cssW = Math.round(fit * E.zoom);
  const cssH = Math.round(E.cssW * d.h / d.w);
  sheet.style.width = E.cssW + "px"; sheet.style.height = cssH + "px";
  $("#zoomFit").textContent = E.zoom === 1 ? "Fit" : Math.round(E.zoom * 100) + "%";
  renderLayer();
  const token = ++pageRenderToken, c = await renderPageCanvas(p, Math.round(E.cssW * dpr()));
  if (token !== pageRenderToken) return;
  pcv.width = c.width; pcv.height = c.height; pcv.getContext("2d").drawImage(c, 0, 0);
}
function renderLayer() {
  const p = curPage(); if (!p) return; const d = dims(p), k = E.cssW / d.w;
  const editingEl = E.editing && layer.querySelector(`[data-id="${E.editing}"]`);
  const pens = p.annots.filter(a => a.type === "pen");
  let html = `<svg class="ink" viewBox="0 0 ${d.w} ${d.h}" preserveAspectRatio="none">${pens.map(a => `<path data-id="${a.id}" class="${a.id === E.selA ? "sel" : ""}" d="${a.pts.map(([u, v], i) => `${i ? "L" : "M"}${(u * d.w).toFixed(2)} ${(v * d.h).toFixed(2)}`).join("")}" fill="none" stroke="${a.color}" stroke-width="${a.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}</svg>`;
  for (const a of p.annots) {
    if (a.type === "pen") continue;
    const s = a.id === E.selA ? " sel" : "", pos = `left:${a.x * 100}%;top:${a.y * 100}%;`;
    if (a.type === "text") { if (a.id === E.editing && editingEl) { html += "<!--keep-->"; continue; } html += `<div class="an text${s}" data-id="${a.id}" style="${pos}font:${a.italic ? "italic " : ""}${a.bold ? 700 : 400} ${a.size * k}px ${CSSFONT[a.font]};color:${a.color}">${esc(a.text)}<span class="rs" contenteditable="false"></span></div>`; }
    else { const box = `${pos}width:${a.w * 100}%;height:${a.h * 100}%;`;
      if (a.type === "img") html += `<div class="an img${s}" data-id="${a.id}" style="${box}"><img src="${a.src}" alt=""><span class="rs"></span></div>`;
      if (a.type === "rect") html += `<div class="an rect${s}" data-id="${a.id}" style="${box}background:${a.color};${a.kind === "hl" ? "opacity:.45;mix-blend-mode:multiply" : ""}"><span class="rs"></span></div>`;
      if (a.type === "field") html += fieldHTML(a, s, box);
      if (a.type === "mark") html += `<div class="an mark${s}" data-id="${a.id}" style="${box}"><svg viewBox="0 0 100 100"><path d="${MARKS[a.glyph].map(seg => seg.map(([u, v], i) => `${i ? "L" : "M"}${u * 100} ${v * 100}`).join("")).join("")}" fill="none" stroke="${a.color}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="rs"></span></div>`;
    }
  }
  if (editingEl) {
    const keep = editingEl, hadFocus = document.activeElement === keep; keep.onblur = null; layer.innerHTML = html;
    const ph = [...layer.childNodes].find(n => n.nodeType === 8); ph ? ph.replaceWith(keep) : layer.appendChild(keep);
    keep.style.fontSize = (p.annots.find(a => a.id === E.editing).size * k) + "px";
    keep.onblur = () => setTimeout(() => { if (E.editing === keep.dataset.id && document.activeElement !== keep) endEdit(); }, 0);
    if (hadFocus) { keep.focus(); const r = document.createRange(); r.selectNodeContents(keep); r.collapse(false); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r); }
  }
  else layer.innerHTML = html;
  layer.className = "layer" + ({ pen: " draw", highlight: " draw", whiteout: " draw", redact: " draw", text: " text", tick: " place", cross: " place" }[E.tool] || (E.tool.startsWith("field:") ? " place" : ""));
  if (SIGN) $$(".fv", layer).forEach(el => { let f = parseFloat(getComputedStyle(el).fontSize); while (el.scrollWidth > el.parentElement.clientWidth - 4 && f > 6) { f -= .5; el.style.fontSize = f + "px"; } });
  if (!skipProps) renderProps();
}
let resizeT; addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (view === "edit") renderEditor(); }, 150); });
function setETool(t) {
  if (E.editing) endEdit();
  if (t === "image") { $("#imgIn").value = ""; $("#imgIn").click(); t = "select"; }
  if (t === "sign") { startSign(); t = "select"; }
  E.tool = t; $$(".etool[data-et]").forEach(b => b.setAttribute("aria-pressed", b.dataset.et === t));
  if (t.startsWith("field:")) { $("#propHint").textContent = `Click on the page where ${signerName(REQ.cur)} should add their ${FIELD_LABEL[t.slice(6)].toLowerCase()}.`; layer.className = "layer place"; return; }
  const hints = { select: "Click something on the page to move, resize or change it.", text: "Click where you want to type.", tick: "Click to place a tick.", cross: "Click to place a cross.", highlight: "Drag over the area to highlight.", whiteout: "Drag over anything you want to cover.", redact: "Drag over text or images to remove them for good. Redacted pages are saved as images, so nothing underneath can be recovered.", pen: "Draw freely on the page." };
  $("#propHint").textContent = hints[t] || ""; renderLayer();
}
$("#ebar").addEventListener("click", e => { const b = e.target.closest("[data-et]"); if (b) setETool(b.dataset.et); });
$("#prevPg").onclick = () => { if (E.pi > 0) { endEdit(); E.pi--; E.selA = null; renderEditor(); } };
$("#nextPg").onclick = () => { if (E.pi < pages.length - 1) { endEdit(); E.pi++; E.selA = null; renderEditor(); } };
$("#zoomIn").onclick = () => { E.zoom = clamp(+(E.zoom * 1.25).toFixed(2), .5, 4); renderEditor(); };
$("#zoomOut").onclick = () => { E.zoom = clamp(+(E.zoom / 1.25).toFixed(2), .5, 4); renderEditor(); };
$("#zoomFit").onclick = () => { E.zoom = 1; renderEditor(); };
$("#dateBtn").onclick = () => { const p = curPage(), d = dims(p); commit(); const a = { id: uid("a"), type: "text", ...D.text, text: new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }), x: .4, y: .5 - D.text.size / d.h / 2 }; p.annots.push(a); E.selA = a.id; setETool("select"); toast("Date added. Drag it into place."); };

const findA = id => curPage().annots.find(a => a.id === id);
function norm(e) { const r = layer.getBoundingClientRect(); return [clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)]; }
let act = null;
layer.addEventListener("pointerdown", e => {
  if (SIGN) { const f = e.target.closest(".an.field.mine"); if (f) { e.preventDefault(); fillField(f.dataset.id); } return; }
  const p = curPage(), d = dims(p), [u, v] = norm(e);
  if (E.tool.startsWith("field:") && !e.target.closest(".an")) {
    e.preventDefault(); const kind = E.tool.slice(6), [fw, fh] = FIELD_SIZE[kind], w = fw / d.w, h = fh / d.h; commit();
    const a = { id: uid("a"), type: "field", kind, signer: REQ.cur, x: clamp(u - w / 2, 0, 1 - w), y: clamp(v - h / 2, 0, 1 - h), w, h };
    p.annots.push(a); E.selA = a.id; setETool("select"); syncCounts(); toast(`${FIELD_LABEL[kind]} field added for ${signerName(a.signer)}`); return;
  }
  const anEl = e.target.closest(".an"), pathEl = e.target.closest("path[data-id]");
  if (["pen", "highlight", "whiteout", "redact"].includes(E.tool)) {
    e.preventDefault(); layer.setPointerCapture(e.pointerId);
    if (E.tool === "pen") { act = { kind: "pen", pts: [[u, v]] }; const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("fill", "none"); path.setAttribute("stroke", D.pen.color); path.setAttribute("stroke-width", D.pen.width); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round"); layer.querySelector("svg.ink").appendChild(path); act.el = path; }
    else { const r = document.createElement("div"); r.className = "drawrect"; layer.appendChild(r); act = { kind: "rect", u, v, el: r }; }
    return;
  }
  if (anEl || pathEl) {
    const id = (anEl || pathEl).dataset.id, a = findA(id);
    if (anEl && anEl.classList.contains("editing")) return;
    e.preventDefault();
    if (E.editing) endEdit();
    if (a.type === "text" && E.selA === id && !e.target.classList.contains("rs")) { beginEdit(id); return; }
    E.selA = id; layer.setPointerCapture(e.pointerId);
    act = { kind: e.target.classList.contains("rs") ? "resize" : "move", id, sx: u, sy: v, orig: structuredClone(a), moved: false, el: anEl || pathEl, startW: anEl ? anEl.offsetWidth : 0 };
    $$(".an.sel,path.sel", layer).forEach(x => x.classList.remove("sel")); (anEl || pathEl).classList.add("sel"); renderProps();
    return;
  }
  if (E.editing) { endEdit(); return; }
  if (E.tool === "text") {
    e.preventDefault(); commit();
    const a = { id: uid("a"), type: "text", ...D.text, text: "", x: u, y: clamp(v - D.text.size * .6 / d.h, 0, 1) };
    p.annots.push(a); E.selA = a.id; renderLayer(); beginEdit(a.id); return;
  }
  if (E.tool === "tick" || E.tool === "cross") {
    commit(); const s = 16, w = s / d.w, h = s / d.h;
    const a = { id: uid("a"), type: "mark", glyph: E.tool, x: clamp(u - w / 2, 0, 1 - w), y: clamp(v - h / 2, 0, 1 - h), w, h, color: "#111111" };
    p.annots.push(a); E.selA = a.id; renderLayer(); return;
  }
  if (E.selA) { E.selA = null; renderLayer(); }
});
layer.addEventListener("pointermove", e => {
  if (!act) return; const [u, v] = norm(e), p = curPage(), d = dims(p);
  if (act.kind === "pen") { act.pts.push([u, v]); act.el.setAttribute("d", act.pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * d.w).toFixed(2)} ${(y * d.h).toFixed(2)}`).join("")); return; }
  if (act.kind === "rect") { const x = Math.min(u, act.u), y = Math.min(v, act.v); Object.assign(act.el.style, { left: x * 100 + "%", top: y * 100 + "%", width: Math.abs(u - act.u) * 100 + "%", height: Math.abs(v - act.v) * 100 + "%" }); act.box = [x, y, Math.abs(u - act.u), Math.abs(v - act.v)]; return; }
  const a = findA(act.id), dx = u - act.sx, dy = v - act.sy;
  if (!act.moved) { if (Math.abs(dx) + Math.abs(dy) < .002) return; commit(); act.moved = true; }
  if (act.kind === "move") {
    if (a.type === "pen") { a.pts = act.orig.pts.map(([x, y]) => [x + dx, y + dy]); act.el.setAttribute("d", a.pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * d.w).toFixed(2)} ${(y * d.h).toFixed(2)}`).join("")); }
    else { a.x = act.orig.x + dx; a.y = act.orig.y + dy; act.el.style.left = a.x * 100 + "%"; act.el.style.top = a.y * 100 + "%"; }
  } else {
    if (a.type === "text") { const k = E.cssW / d.w, nw = Math.max(8, act.startW + dx * E.cssW); a.size = clamp(+(act.orig.size * nw / act.startW).toFixed(1), 4, 200); act.el.style.fontSize = a.size * k + "px"; }
    else { a.w = Math.max(.01, act.orig.w + dx); a.h = a.type === "rect" || a.type === "field" ? Math.max(.005, act.orig.h + dy) : a.w * act.orig.h / act.orig.w; act.el.style.width = a.w * 100 + "%"; act.el.style.height = a.h * 100 + "%"; }
  }
});
const endAct = () => {
  if (!act) return; const p = curPage();
  if (act.kind === "pen" && act.pts.length > 1) { commit(); p.annots.push({ id: uid("a"), type: "pen", pts: act.pts.map(([x, y]) => [+x.toFixed(5), +y.toFixed(5)]), color: D.pen.color, width: D.pen.width }); }
  if (act.kind === "rect" && act.box && act.box[2] > .005 && act.box[3] > .003) { commit(); const [x, y, w, h] = act.box, hl = E.tool === "highlight", rd = E.tool === "redact"; const a = { id: uid("a"), type: "rect", kind: hl ? "hl" : rd ? "rd" : "wo", x, y, w, h, color: hl ? D.hl : rd ? "#000000" : "#FFFFFF" }; p.annots.push(a); E.selA = a.id; }
  if (act.kind === "move" || act.kind === "resize") { if (act.moved) renderLayer(); }
  else renderLayer();
  act = null;
};
layer.addEventListener("pointerup", endAct); layer.addEventListener("pointercancel", endAct);

function beginEdit(id) {
  const el = layer.querySelector(`.an[data-id="${id}"]`); if (!el) return;
  E.editing = id; E.selA = id; typingCommitted = false;
  el.querySelector(".rs")?.remove();
  el.classList.add("editing", "sel");
  try { el.contentEditable = "plaintext-only"; } catch { el.contentEditable = "true"; }
  if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
  el.focus();
  const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  el.oninput = () => { commitOnce(); const a = findA(id); if (a) a.text = el.innerText.replace(/\n$/, ""); };
  el.onblur = () => setTimeout(() => { if (E.editing === id && document.activeElement !== el) endEdit(); }, 0);
  el.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); el.blur(); } };
  renderProps();
}
function endEdit() {
  const id = E.editing; if (!id) return; E.editing = null; typingCommitted = false;
  const p = curPage(), a = p && p.annots.find(x => x.id === id);
  if (a && !a.text.trim()) { p.annots = p.annots.filter(x => x !== a); if (E.selA === id) E.selA = null; }
  renderLayer();
}

/* properties panel */
const COLORS = ["#111111", "#1F3FBF", "#C2362B", "#1E7B4C"], HLS = ["#FFE066", "#9BEA8F", "#FFB3C7", "#9FD3FF"];
function swatches(list, cur, key) { return `<div class="chips">${list.map(c => `<button class="swatch" data-${key}="${c}" aria-pressed="${c.toLowerCase() === (cur || "").toLowerCase()}" style="background:${c}" aria-label="Colour ${c}"></button>`).join("")}<input type="color" data-${key}c value="${cur}" style="width:38px;height:32px;border:0;background:none;padding:0" aria-label="Custom colour"></div>`; }
function renderProps() {
  const box = $("#props"), a = E.selA && curPage() ? findA(E.selA) : null;
  $("#sigGroup").hidden = !!a;
  if (!a) {
    $("#propTitle").textContent = "Edit and sign";
    if (E.tool === "pen") box.innerHTML = `<div class="group"><span class="lbl">Pen colour</span>${swatches(COLORS, D.pen.color, "pc")}</div><div class="field"><label for="penW">Thickness</label><input type="range" id="penW" min="0.5" max="10" step="0.5" value="${D.pen.width}"></div>`;
    else if (E.tool === "highlight") box.innerHTML = `<div class="group"><span class="lbl">Highlighter colour</span>${swatches(HLS, D.hl, "hc")}</div>`;
    else if (E.tool === "text") box.innerHTML = textProps(D.text);
    else box.innerHTML = "";
    return;
  }
  if (a.type === "field") { $("#propTitle").textContent = `${FIELD_LABEL[a.kind]} field`; box.innerHTML = `<div class="group"><span class="lbl">For</span><select id="fSigner">${REQ.signers.map(g => `<option value="${g.id}"${g.id === a.signer ? " selected" : ""}>${esc(g.name || "Unnamed signer")}</option>`).join("")}</select></div><div class="row2"><button class="btn" id="aDup">Duplicate</button><button class="btn danger" id="aDel">Delete</button></div>`; return; }
  const names = { text: "Text", img: "Image", rect: a.kind === "hl" ? "Highlight" : a.kind === "rd" ? "Redaction" : "Whiteout", pen: "Drawing", mark: a.glyph === "tick" ? "Tick" : "Cross" };
  $("#propTitle").textContent = names[a.type];
  let h = "";
  if (a.type === "text") h = textProps(a);
  if (a.type === "rect") h = a.kind === "rd" ? `<p class="note">Everything under this box is removed when you download. The page is saved as an image, so its other text can’t be selected.</p>` : `<div class="group"><span class="lbl">Colour</span>${swatches(a.kind === "hl" ? HLS : ["#FFFFFF", "#111111"], a.color, "rc")}</div>`;
  if (a.type === "pen") h = `<div class="group"><span class="lbl">Colour</span>${swatches(COLORS, a.color, "pc")}</div><div class="field"><label for="penW">Thickness</label><input type="range" id="penW" min="0.5" max="10" step="0.5" value="${a.width}"></div>`;
  if (a.type === "mark") h = `<div class="group"><span class="lbl">Colour</span>${swatches(COLORS, a.color, "mc")}</div>`;
  h += `<div class="row2"><button class="btn" id="aDup">Duplicate</button><button class="btn danger" id="aDel">Delete</button></div>`;
  box.innerHTML = h;
}
function textProps(t) {
  return `<div class="row2"><div class="field"><label for="tFont">Font</label><select id="tFont">${["Helvetica", "Times", "Courier"].map(f => `<option${f === t.font ? " selected" : ""}>${f}</option>`).join("")}</select></div>
  <div class="field"><label for="tSize">Size (pt)</label><input type="number" id="tSize" min="4" max="200" step="1" value="${t.size}"></div></div>
  <div class="chips"><button class="chip" id="tB" aria-pressed="${t.bold}" style="font-weight:800">Bold</button><button class="chip" id="tI" aria-pressed="${t.italic}" style="font-style:italic">Italic</button></div>
  <div class="group"><span class="lbl">Colour</span>${swatches(COLORS, t.color, "tc")}</div>`;
}
$("#props").addEventListener("click", e => {
  const a = E.selA ? findA(E.selA) : null, b = e.target.closest("button"); if (!b) return;
  if (b.id === "aDel") { commit(); curPage().annots = curPage().annots.filter(x => x !== a); E.selA = null; E.editing = null; renderLayer(); return; }
  if (b.id === "aDup") { commit(); const c = structuredClone(a); c.id = uid("a"); if (c.type === "pen") c.pts = c.pts.map(([x, y]) => [x + .02, y + .02]); else { c.x += .02; c.y += .02; } curPage().annots.push(c); E.selA = c.id; renderLayer(); return; }
  if (b.id === "tB" || b.id === "tI") { const k = b.id === "tB" ? "bold" : "italic"; if (a) commit(); const t = a || D.text; t[k] = !t[k]; if (a) { D.text[k] = t[k]; } refreshAfterProp(); return; }
  const c = b.dataset.tc || b.dataset.pc || b.dataset.hc || b.dataset.rc || b.dataset.mc;
  if (c) { applyColor(b.dataset, c, a); }
});
$("#props").addEventListener("input", e => {
  const a = E.selA ? findA(E.selA) : null, t = e.target;
  if (t.id === "fSigner" && a) { commit(); a.signer = t.value; renderLayer(); syncCounts(); return; }
  if (t.id === "tFont" || t.id === "tSize") { if (a) commitOnce(); const o = a || D.text; if (t.id === "tFont") o.font = t.value; else o.size = clamp(+t.value || 12, 4, 200); D.text[t.id === "tFont" ? "font" : "size"] = o[t.id === "tFont" ? "font" : "size"]; refreshAfterProp(true); }
  if (t.id === "penW") { if (a) { commitOnce(); a.width = +t.value; } D.pen.width = +t.value; refreshAfterProp(true); }
  const ds = Object.keys(t.dataset).find(k => k.endsWith("c") && k.length === 3);
  if (ds) { commitOnce(); applyColor({ [ds.slice(0, 2)]: t.value }, t.value, a, true); }
});
$("#props").addEventListener("change", () => (typingCommitted = false));
function applyColor(ds, c, a, live) {
  if (a) { if (!live) commit(); a.color = c; }
  if (ds.tc) D.text.color = c; if (ds.pc) D.pen.color = c; if (ds.hc || (a && a.kind === "hl")) D.hl = c;
  refreshAfterProp(live);
}
let skipProps = false;
function refreshAfterProp(live) {
  if (E.editing) { const el = layer.querySelector(`.an[data-id="${E.editing}"]`), a = findA(E.editing), k = E.cssW / dims(curPage()).w; if (el && a) { el.style.font = `${a.italic ? "italic " : ""}${a.bold ? 700 : 400} ${a.size * k}px ${CSSFONT[a.font]}`; el.style.color = a.color; } }
  skipProps = !!live; renderLayer(); skipProps = false;
}

/* images */
$("#imgIn").onchange = async () => {
  const f = $("#imgIn").files[0]; if (!f) return;
  const url = await normalizeImage(f, 1800); placeImage(url, .4, "Image added. Drag a corner to resize.");
};
async function normalizeImage(f, max, makeTransparent = false) {
  const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height)), c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  const x = c.getContext("2d"); x.drawImage(bmp, 0, 0, c.width, c.height);
  if (makeTransparent) { const d = x.getImageData(0, 0, c.width, c.height), a = d.data; for (let i = 0; i < a.length; i += 4) { const l = (a[i] + a[i + 1] + a[i + 2]) / 3; if (l > 200) a[i + 3] = Math.max(0, 255 - (l - 200) * 4.6); } x.putImageData(d, 0, 0); return trimCanvas(c).toDataURL("image/png"); }
  const alpha = f.type === "image/png" || f.type === "image/webp" || f.type === "image/gif";
  return alpha ? c.toDataURL("image/png") : c.toDataURL("image/jpeg", .9);
}
function placeImage(url, wFrac, msg) {
  const i = new Image(); i.onload = () => {
    const p = curPage(), d = dims(p); commit();
    let w = wFrac, h = w * d.w * (i.height / i.width) / d.h; if (h > .5) { h = .5; w = h * d.h * (i.width / i.height) / d.w; }
    const a = { id: uid("a"), type: "img", src: url, x: (1 - w) / 2, y: (1 - h) / 2, w, h }; p.annots.push(a); E.selA = a.id; setETool("select"); toast(msg);
  }; i.src = url;
}

/* ============ Signatures ============ */
const SIG_KEY = "ifleavesweave.signatures";
const loadSigs = () => { try { return JSON.parse(localStorage.getItem(SIG_KEY)) || []; } catch { return []; } };
const saveSigs = s => { try { localStorage.setItem(SIG_KEY, JSON.stringify(s.slice(0, 6))); } catch {} };
function renderSigs() { const s = loadSigs(); $("#sigs").innerHTML = s.map((u, i) => `<button data-sig="${i}" title="Add this signature"><img src="${u}" alt="Saved signature ${i + 1}"><span class="del" data-sdel="${i}" role="button" aria-label="Remove signature">×</span></button>`).join(""); $("#newSig").textContent = s.length ? "Create another signature" : "Create a signature"; }
$("#sigs").onclick = e => { const d = e.target.closest("[data-sdel]"); if (d) { const s = loadSigs(); s.splice(+d.dataset.sdel, 1); saveSigs(s); renderSigs(); return; } const b = e.target.closest("[data-sig]"); if (b) placeImage(loadSigs()[+b.dataset.sig], .28, "Signature added. Drag it onto the line."); };
function startSign() { const s = loadSigs(); if (s.length && view === "edit") { toast("Pick one of your signatures, or create a new one."); $("#sigGroup").hidden = false; return; } openSigDlg(); }
$("#newSig").onclick = () => openSigDlg();
const sigDlg = $("#sigDlg"), pad = $("#pad"); let sigTab = "draw", ink = "#111111", padDirty = false, uploaded = null, typedFont = "Caveat";
let sigTarget = null;
function openSigDlg(target = null, prefill = "", title = "Create your signature") {
  sigTarget = target; $("#sigTitle").textContent = title; $("#sigUse").textContent = target ? "Use this" : "Add to page";
  const saved = target ? loadSigs() : []; $("#sigSaved").hidden = !saved.length;
  $("#sigSavedList").innerHTML = saved.map((u, i) => `<button type="button" data-use="${i}"><img src="${u}" alt="Saved signature ${i + 1}"></button>`).join("");
  if (prefill) $("#typedName").value = prefill;
  sigDlg.showModal(); setSigTab(prefill && title.startsWith("Add your initials") ? "type" : "draw"); sizePad();
}
$("#sigSavedList").onclick = e => { const b = e.target.closest("[data-use]"); if (!b || !sigTarget) return; const url = loadSigs()[+b.dataset.use], cb = sigTarget; sigTarget = null; sigDlg.close(); cb(url); };
sigDlg.addEventListener("close", () => { if (sigTarget && !sigDlg.returnValue) {} });
function sizePad() { const r = pad.getBoundingClientRect(), k = dpr(); pad.width = r.width * k; pad.height = r.height * k; const x = pad.getContext("2d"); x.scale(k, k); x.lineCap = x.lineJoin = "round"; padDirty = false; }
function setSigTab(t) { sigTab = t; $$("#sigDlg [data-st]").forEach(b => b.setAttribute("aria-selected", b.dataset.st === t)); $$("#sigDlg [data-sp]").forEach(p => (p.hidden = p.dataset.sp !== t)); if (t === "draw") requestAnimationFrame(sizePad); if (t === "type") renderTyped(); }
$$("#sigDlg [data-st]").forEach(b => (b.onclick = () => setSigTab(b.dataset.st)));
$$("#sigDlg [data-close]").forEach(b => (b.onclick = () => { sigTarget = null; sigDlg.close(); }));
let padLast = null;
pad.addEventListener("pointerdown", e => { pad.setPointerCapture(e.pointerId); const r = pad.getBoundingClientRect(); padLast = [e.clientX - r.left, e.clientY - r.top, e.pressure || .5]; padDirty = true; });
pad.addEventListener("pointermove", e => { if (!padLast) return; const r = pad.getBoundingClientRect(), p = [e.clientX - r.left, e.clientY - r.top, e.pressure || .5], x = pad.getContext("2d"); x.strokeStyle = ink; x.lineWidth = 1.6 + (p[2] || .5) * 2.4; x.beginPath(); x.moveTo(padLast[0], padLast[1]); x.lineTo(p[0], p[1]); x.stroke(); padLast = p; });
pad.addEventListener("pointerup", () => (padLast = null));
$("#padClear").onclick = sizePad;
$("#inkColors").onclick = e => { const b = e.target.closest("[data-ink]"); if (!b) return; ink = b.dataset.ink; $$("#inkColors .swatch").forEach(s => s.setAttribute("aria-pressed", s === b)); renderTyped(); };
function renderTyped() { const n = esc($("#typedName").value || "Your name"); $("#typedOpts").innerHTML = ["Caveat", "Dancing Script", "Great Vibes"].map(f => `<button data-tf="${f}" aria-pressed="${f === typedFont}" style="font-family:'${f}',cursive;color:${ink}">${n}</button>`).join(""); }
$("#typedName").oninput = renderTyped;
$("#typedOpts").onclick = e => { const b = e.target.closest("[data-tf]"); if (b) { typedFont = b.dataset.tf; renderTyped(); } };
$("#sigUpload").onclick = () => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = async () => { if (!i.files[0]) return; uploaded = await normalizeImage(i.files[0], 1200, true); $("#sigPreview").src = uploaded; $("#sigPreview").hidden = false; }; i.click(); };
function trimCanvas(c) {
  const x = c.getContext("2d"), d = x.getImageData(0, 0, c.width, c.height).data; let t = c.height, l = c.width, r = 0, b = 0;
  for (let y = 0; y < c.height; y++) for (let X = 0; X < c.width; X++) if (d[(y * c.width + X) * 4 + 3] > 10) { if (X < l) l = X; if (X > r) r = X; if (y < t) t = y; if (y > b) b = y; }
  if (r < l) return c; const m = 6, o = document.createElement("canvas"); o.width = r - l + 1 + m * 2; o.height = b - t + 1 + m * 2; o.getContext("2d").drawImage(c, l - m, t - m, o.width, o.height, 0, 0, o.width, o.height); return o;
}
$("#sigUse").onclick = async () => {
  let url = null;
  if (sigTab === "draw") { if (!padDirty) return toast("Draw your signature in the box first."); url = trimCanvas(pad).toDataURL("image/png"); }
  if (sigTab === "type") { const name = $("#typedName").value.trim(); if (!name) return toast("Type your name first."); await document.fonts.load(`80px "${typedFont}"`).catch(() => {}); const c = document.createElement("canvas"), x = c.getContext("2d"); x.font = `80px "${typedFont}", cursive`; c.width = Math.ceil(x.measureText(name).width) + 40; c.height = 140; x.font = `80px "${typedFont}", cursive`; x.fillStyle = ink; x.textBaseline = "middle"; x.fillText(name, 20, 72); url = trimCanvas(c).toDataURL("image/png"); }
  if (sigTab === "upload") { if (!uploaded) return toast("Choose a photo of your signature first."); url = uploaded; }
  if ($("#sigRemember").checked) { const s = loadSigs(); s.unshift(url); saveSigs(s); }
  sigDlg.close(); renderSigs();
  if (sigTarget) { const cb = sigTarget; sigTarget = null; cb(url); return; }
  if (view !== "edit") { selectToolUI("edit"); tool = "edit"; openEditor(0); }
  placeImage(url, .28, "Signature added. Drag it onto the line.");
};

/* ============ Page numbers / watermark settings ============ */
const chipGroup = (id, attr, cb) => $(id).addEventListener("click", e => { const b = e.target.closest(`[data-${attr}]`); if (!b) return; $$(`${id} .chip`).forEach(c => c.setAttribute("aria-pressed", c === b)); cb && cb(b.dataset[attr]); scheduleGrid(); });
let numPos = "center", wmAngle = 45, splitMode = "each", cmpLevel = "balanced", imgFmt = "jpg", imgDpi = 150;
chipGroup("#numPos", "np", v => (numPos = v)); chipGroup("#wmAngle", "wa", v => (wmAngle = +v));
chipGroup("#splitMode", "sm", v => { splitMode = v; syncSplit(); }); chipGroup("#cmpLevel", "cl", v => { cmpLevel = v; $("#cmpAfterRow").hidden = true; });
chipGroup("#imgFmt", "if", v => (imgFmt = v)); chipGroup("#imgDpi", "id", v => (imgDpi = +v));
let cvFmt = "docx", docxMode = "text";
chipGroup("#cvFmt", "cf", v => { cvFmt = v; $("#cvDocx").hidden = v !== "docx"; $("#cvPptx").hidden = v !== "pptx"; $("#cvImg").hidden = v !== "img"; });
chipGroup("#cvDocxMode", "dm", v => { docxMode = v; $("#cvDocxNote").textContent = v === "text" ? "Text, headings and paragraphs you can edit in Word. Complex layouts and images are simplified." : "Each page placed in Word as a picture: looks identical, but the text isn’t editable."; });
["#numOn", "#numFmt", "#numStart", "#numSkip", "#wmOn", "#wmText"].forEach(id => $(id).addEventListener("input", scheduleGrid));
function numLabel(i, total) {
  const skip = +$("#numSkip").value; if (i < skip) return null;
  const n = i - skip + (+$("#numStart").value || 0), N = total - skip + (+$("#numStart").value || 0) - 1;
  return { n: `${n}`, pn: `Page ${n}`, nof: `${n} of ${N}`, pnof: `Page ${n} of ${N}` }[$("#numFmt").value];
}

/* ============ Build PDF ============ */
function mapper(box, R) {
  const { x: bx, y: by, width: w, height: h } = box;
  return (u, v) => R === 90 ? [bx + v * w, by + u * h] : R === 180 ? [bx + w * (1 - u), by + v * h] : R === 270 ? [bx + w * (1 - v), by + h * (1 - u)] : [bx + u * w, by + h - v * h];
}
const FONTKEY = (f, b, i) => ({ Helvetica: ["Helvetica", "HelveticaBold", "HelveticaOblique", "HelveticaBoldOblique"], Times: ["TimesRoman", "TimesRomanBold", "TimesRomanItalic", "TimesRomanBoldItalic"], Courier: ["Courier", "CourierBold", "CourierOblique", "CourierBoldOblique"] }[f][(b ? 1 : 0) + (i ? 2 : 0)]);
const dataBytes = url => Uint8Array.from(atob(url.split(",")[1]), c => c.charCodeAt(0));

async function buildPdf(list = pages, { decorate = true, onProgress } = {}) {
  const out = await PDFDocument.create(), fonts = {}, imgs = new Map(), libs = new Map();
  const font = async k => (fonts[k] ||= await out.embedFont(StandardFonts[k]));
  const embed = async url => { if (!imgs.has(url)) imgs.set(url, url.startsWith("data:image/png") ? await out.embedPng(dataBytes(url)) : await out.embedJpg(dataBytes(url))); return imgs.get(url); };
  const numOn = decorate && $("#numOn").checked, wmOn = decorate && $("#wmOn").checked && $("#wmText").value.trim();
  for (let i = 0; i < list.length; i++) {
    const p = list[i], s = sources[p.src], d = dims(p); let page, box;
    if (s.kind === "pdf") {
      if (!libs.has(p.src)) libs.set(p.src, await fillForm(await PDFDocument.load(s.bytes, { ignoreEncryption: true }), s));
      [page] = await out.copyPages(libs.get(p.src), [p.index]); out.addPage(page);
      page.setRotation(degrees(d.R)); box = page.getCropBox();
    } else {
      page = out.addPage([s.w, s.h]); box = { x: 0, y: 0, width: s.w, height: s.h };
      if (s.kind === "image") { const im = imgs.get(s.name + p.src) || await out.embedJpg(s.jpg); imgs.set(s.name + p.src, im); page.drawImage(im, { x: 0, y: 0, width: s.w, height: s.h }); }
      if (d.R) page.setRotation(degrees(d.R));
    }
    const M = mapper(box, d.R), rot = degrees(d.R);
    for (const a of p.annots) {
      if (a.type === "field") continue;
      if (a.type === "text") {
        const f = await font(FONTKEY(a.font, a.bold, a.italic)), lines = a.text.split("\n"), col = hexRgb(a.color);
        try {
          lines.forEach(l => f.encodeText(l));
          lines.forEach((l, k) => { const [x, y] = M(a.x, a.y + (k * 1.2 + BASE[a.font]) * a.size / d.h); page.drawText(l, { x, y, size: a.size, font: f, color: col, rotate: rot }); });
        } catch {
          const url = rasterText(a), w = a._w, h = a._h, im = await embed(url), [x, y] = M(a.x, a.y + h / d.h);
          page.drawImage(im, { x, y, width: w, height: h, rotate: rot });
        }
      } else if (a.type === "img") { const im = await embed(a.src), [x, y] = M(a.x, a.y + a.h); page.drawImage(im, { x, y, width: a.w * d.w, height: a.h * d.h, rotate: rot }); }
      else if (a.type === "rect") { const [x, y] = M(a.x, a.y + a.h); page.drawRectangle({ x, y, width: a.w * d.w, height: a.h * d.h, rotate: rot, color: hexRgb(a.color), ...(a.kind === "hl" ? { opacity: .45, blendMode: BlendMode.Multiply } : {}) }); }
      else if (a.type === "pen") { for (let k = 1; k < a.pts.length; k++) { const [x1, y1] = M(...a.pts[k - 1]), [x2, y2] = M(...a.pts[k]); page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: a.width, color: hexRgb(a.color), lineCap: LineCapStyle.Round }); } }
      else if (a.type === "mark") { const th = Math.max(.8, a.w * d.w * .14); for (const seg of MARKS[a.glyph]) for (let k = 1; k < seg.length; k++) { const [x1, y1] = M(a.x + seg[k - 1][0] * a.w, a.y + seg[k - 1][1] * a.h), [x2, y2] = M(a.x + seg[k][0] * a.w, a.y + seg[k][1] * a.h); page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: th, color: hexRgb(a.color), lineCap: LineCapStyle.Round }); } }
    }
    if (numOn) { const label = numLabel(i, list.length); if (label) { const f = await font("Helvetica"), sz = 10, tw = f.widthOfTextAtSize(label, sz), m = 28; const ux = numPos === "left" ? m : numPos === "right" ? d.w - m - tw : (d.w - tw) / 2; const [x, y] = M(ux / d.w, 1 - (m - 6) / d.h); page.drawText(label, { x, y, size: sz, font: f, color: rgb(.25, .25, .25), rotate: rot }); } }
    if (wmOn) {
      const f = await font("HelveticaBold"), txt = $("#wmText").value.trim(), ang = wmAngle * Math.PI / 180;
      let sz = Math.min(d.w, d.h) / 6; const tw0 = f.widthOfTextAtSize(txt, sz), diag = (wmAngle ? Math.hypot(d.w, d.h) : d.w) * .75; if (tw0 > diag) sz *= diag / tw0;
      try { f.encodeText(txt); const tw = f.widthOfTextAtSize(txt, sz), dir = [Math.cos(ang), -Math.sin(ang)], up = [-Math.sin(ang), -Math.cos(ang)];
        const ax = d.w / 2 - tw / 2 * dir[0] - sz * .35 * up[0], ay = d.h / 2 - tw / 2 * dir[1] - sz * .35 * up[1], [x, y] = M(ax / d.w, ay / d.h);
        page.drawText(txt, { x, y, size: sz, font: f, color: rgb(.45, .5, .55), opacity: +$("#wmOpacity").value / 100, rotate: degrees(d.R + wmAngle) }); } catch { /* unsupported characters: skip */ }
    }
    onProgress && onProgress((i + 1) / list.length);
    if (i % 5 === 4) await tick();
  }
  const meta = k => ($("#m" + k)?.value || "").trim();
  out.setTitle(meta("Title") || safeName()); out.setProducer("If Leaves Weave"); out.setCreator("If Leaves Weave");
  if (meta("Author")) out.setAuthor(meta("Author")); if (meta("Subject")) out.setSubject(meta("Subject"));
  if (meta("Keywords")) out.setKeywords(meta("Keywords").split(",").map(k => k.trim()).filter(Boolean));
  let bytes = await out.save();
  const red = list.map((p, i) => (p.annots.some(a => a.type === "rect" && a.kind === "rd") ? i : -1)).filter(i => i >= 0);
  if (red.length) bytes = await flattenRedacted(bytes, red);
  return bytes;
}
function rasterText(a) {
  const k = 4, c = document.createElement("canvas"), x = c.getContext("2d"), f = `${a.italic ? "italic " : ""}${a.bold ? 700 : 400} ${a.size * k}px ${CSSFONT[a.font]}`;
  x.font = f; const lines = a.text.split("\n"), w = Math.max(...lines.map(l => x.measureText(l).width)) + 4, h = lines.length * a.size * 1.2 * k;
  c.width = Math.ceil(w); c.height = Math.ceil(h); x.font = f; x.fillStyle = a.color; lines.forEach((l, i) => x.fillText(l, 0, (i * 1.2 + BASE[a.font]) * a.size * k));
  a._w = c.width / k; a._h = c.height / k; return c.toDataURL("image/png");
}

async function exportPdf(list = pages, name = `${safeName()}.pdf`) {
  if (E.editing) endEdit();
  try { busy("Preparing your PDF", 0); const bytes = await buildPdf(list, { onProgress: f => busy("Preparing your PDF", f * 100) }); busy(false); download(new Blob([bytes], { type: "application/pdf" }), name); count("downloads");
    if (list.some(p => p.annots.some(a => a.kind === "rd"))) { const h = await crypto.subtle.digest("SHA-256", bytes); lastRedaction = { name, at: new Date(), size: bytes.length, hash: [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join(""), pages: list.map((p, i) => p.annots.some(a => a.kind === "rd") ? i + 1 : 0).filter(Boolean), total: list.length }; syncReport(); } toast(`Downloaded ${name} (${kb(bytes.length)})`); }
  catch (err) { console.error(err); busy(false); toast("Couldn’t build the PDF. One of the files may be damaged or protected.", 4500); }
}
$("#dlBtn").onclick = () => exportPdf();
$("#dlBtn").setAttribute("aria-label", "Download PDF");
if (matchMedia("(pointer: coarse)").matches) $("#pagesHint").textContent = "Tap pages to select them, then move, rotate or delete.";

/* ============ Split ============ */
function parseRanges(str, max) {
  const out = []; for (const part of str.split(/[,;]+/)) { const m = part.trim().match(/^(\d+)\s*(?:-\s*(\d+))?$/); if (!m) { if (part.trim()) return null; continue; } let a = +m[1], b = m[2] ? +m[2] : a; if (a > b) [a, b] = [b, a]; if (a < 1 || b > max) return null; out.push([a, b]); }
  return out.length ? out : null;
}
function splitGroups() {
  const n = pages.length;
  if (splitMode === "each") return pages.map((_, i) => [i]);
  if (splitMode === "every") { const k = Math.max(1, +$("#splitN").value || 1), g = []; for (let i = 0; i < n; i += k) g.push([...Array(Math.min(k, n - i)).keys()].map(j => i + j)); return g; }
  const r = parseRanges($("#splitR").value, n); return r && r.map(([a, b]) => [...Array(b - a + 1).keys()].map(j => a - 1 + j));
}
function syncSplit() { $("#splitEvery").hidden = splitMode !== "every"; $("#splitRanges").hidden = splitMode !== "ranges"; const g = splitGroups(); $("#splitInfo").textContent = g ? `Makes ${g.length} file${g.length > 1 ? "s" : ""}${g.length > 1 ? ", downloaded together as a ZIP" : ""}.` : `Enter ranges between 1 and ${pages.length}, like 1-3, 5.`; $("#splitGo").disabled = !g; }
["#splitN", "#splitR"].forEach(id => $(id).addEventListener("input", syncSplit));
$("#splitGo").onclick = async () => {
  const g = splitGroups(); if (!g) return; const base = safeName();
  try {
    if (g.length === 1) return exportPdf(g[0].map(i => pages[i]), `${base}-part-1.pdf`);
    const zip = new JSZip();
    for (let k = 0; k < g.length; k++) { busy(`Making file ${k + 1} of ${g.length}`, k / g.length * 100); const b = await buildPdf(g[k].map(i => pages[i])); const lab = g[k].length === 1 ? `page-${g[k][0] + 1}` : `pages-${g[k][0] + 1}-${g[k][g[k].length - 1] + 1}`; zip.file(`${base}-${lab}.pdf`, b); }
    busy("Zipping", 100); const blob = await zip.generateAsync({ type: "blob" }); busy(false); download(blob, `${base}-split.zip`); count("splits"); toast(`${g.length} PDFs downloaded in one ZIP`);
  } catch (err) { console.error(err); busy(false); toast("Couldn’t split this PDF."); }
};

/* ============ Render built PDF (compress / images) ============ */
async function renderBuilt(bytes, idxs, dpi, type, q, each) {
  const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
  for (let k = 0; k < idxs.length; k++) {
    const pg = await doc.getPage(idxs[k] + 1), vp = pg.getViewport({ scale: dpi / 72 }), c = document.createElement("canvas");
    c.width = Math.round(vp.width); c.height = Math.round(vp.height); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: x, viewport: vp }).promise;
    const blob = await new Promise(r => c.toBlob(r, type, q)); const base = pg.getViewport({ scale: 1 });
    await each(blob, k, base.width, base.height); c.width = c.height = 0;
  }
  doc.destroy();
}
let nowSize = 0;
async function measureNow() { $("#cmpNow").textContent = "Measuring…"; try { const b = await buildPdf(); nowSize = b.length; $("#cmpNow").textContent = kb(nowSize); } catch { $("#cmpNow").textContent = "–"; } }
$("#cmpGo").onclick = async () => {
  const L = { strong: [96, .5], balanced: [130, .66], light: [170, .8] }[cmpLevel];
  try {
    busy("Compressing", 0); const bytes = await buildPdf(); nowSize = bytes.length; $("#cmpNow").textContent = kb(nowSize);
    const out = await PDFDocument.create(), n = pages.length;
    await renderBuilt(bytes, [...Array(n).keys()], L[0], "image/jpeg", L[1], async (blob, k, w, h) => { const im = await out.embedJpg(new Uint8Array(await blob.arrayBuffer())); out.addPage([w, h]).drawImage(im, { x: 0, y: 0, width: w, height: h }); busy(`Compressing page ${k + 1} of ${n}`, (k + 1) / n * 100); });
    out.setTitle(safeName()); out.setProducer("If Leaves Weave"); const res = await out.save(); busy(false);
    $("#cmpAfterRow").hidden = false; $("#cmpAfter").textContent = `${kb(res.length)} (${Math.round((1 - res.length / nowSize) * 100)}% smaller)`;
    if (res.length >= nowSize) { $("#cmpAfter").textContent = kb(res.length); return toast("This PDF is already compact. Compressing would make it bigger, so nothing was downloaded.", 5000); }
    download(new Blob([res], { type: "application/pdf" }), `${safeName()}-compressed.pdf`); count("compress"); toast(`Saved ${kb(nowSize - res.length)}`);
  } catch (err) { console.error(err); busy(false); toast("Couldn’t compress this PDF."); }
};
async function exportImages() {
  const only = $("#imgSelOnly").checked && sel.size, idxs = pages.map((p, i) => (!only || sel.has(p.id) ? i : -1)).filter(i => i >= 0);
  const type = imgFmt === "png" ? "image/png" : "image/jpeg", base = safeName(), files = [];
  try {
    busy("Making images", 0); const bytes = await buildPdf();
    await renderBuilt(bytes, idxs, imgDpi, type, .9, async (blob, k) => { files.push([`${base}-page-${idxs[k] + 1}.${imgFmt}`, blob]); busy(`Page ${k + 1} of ${idxs.length}`, (k + 1) / idxs.length * 100); });
    if (files.length === 1) { busy(false); download(files[0][1], files[0][0]); }
    else { const zip = new JSZip(); files.forEach(([n, b]) => zip.file(n, b)); busy("Zipping", 100); const blob = await zip.generateAsync({ type: "blob" }); busy(false); download(blob, `${base}-images.zip`); }
    count("images"); toast(`${files.length} image${files.length > 1 ? "s" : ""} saved`);
  } catch (err) { console.error(err); busy(false); toast("Couldn’t make images from this PDF."); }
}

/* ============ Empty state tasks ============ */
const TASKS = [
  ["Merge PDFs", "pages", "M8 3h8l4 4v8M4 9h8l4 4v8H4z", true],
  ["Word to PDF", "pages", "M7 3h8l5 5v13H7zM10 12l1.5 5 1.5-4 1.5 4 1.5-5", "docx"],
  ["PowerPoint to PDF", "pages", "M4 5h16v11H4zM9 20h6M12 16v4M8 9h5", "pptx"],
  ["Mark work", "pages", "M5 13l4 4L19 7", "mark"],
  ["Question bank", "pages", "M9 9a3 3 0 1 1 4 2.8c-.7.4-1 1-1 1.7V15M12 18h.01", "qbank"],
  ["Split a PDF", "split", "M6 3v18M18 3v18M6 12h12"],
  ["Sign a PDF", { tool: "edit", sign: true }, "M3 17c3-6 5-10 6-7s-2 8 1 8 4-6 6-6 1 4 3 4 2-1 2-1"],
  ["Fill in and edit", "edit", "M4 20h4L19 9l-4-4L4 16z"],
  ["Compress", "compress", "M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"],
  ["Images to PDF", "pages", "M3 4h18v16H3zM21 16l-5-5-9 9", "image/*"],
  ["PDF to Word or PowerPoint", "convert", "M4 7h11l-3-3M20 17H9l3 3"],
  ["Get others to sign", { tool: "request" }, "M3 7l9 6 9-6M3 5h18v14H3z"],
  ["Compare two versions", "compare", "M8 3H4v18h4M16 3h4v18h-4M12 3v18"],
  ["Number documents (Bates)", "bates", "M4 6h16M4 12h10M4 18h6M17 15l3 3-3 3"],
  ["Make a flipbook", "flip", "M12 6c-3-2-6-2-9 0v13c3-2 6-2 9 0 3-2 6-2 9 0V6c-3-2-6-2-9 0zM12 6v13"],
  ["Make a scan searchable", "ocr", "M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 12h8"],
  ["Read aloud, paper and voice notes", "class", "M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM8 7h6M8 11h8"],
];
$("#tasks").innerHTML = TASKS.map(([n, , d], i) => `<button class="task" data-task="${i}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>${n}</button>`).join("");
$("#tasks").onclick = e => { const b = e.target.closest("[data-task]"); if (!b) return; const [, t, , extra] = TASKS[+b.dataset.task]; if (extra === "mark") { location.href = "marking.html"; return; } if (extra === "qbank") { location.href = "questions.html"; return; } pick(extra === "image/*" ? "image/*" : extra === "docx" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : extra === "pptx" ? ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" : "application/pdf,image/*,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation", t); };
$("#tray").addEventListener("click", e => { if (e.target === e.currentTarget) pick(); });
$("#numOn").addEventListener("change", () => { if ($("#numOn").checked) toast("Page numbers will be added when you download"); });

/* ============ Keyboard ============ */
addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable, mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "z" && !typing) { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if (mod && e.key.toLowerCase() === "y" && !typing) { e.preventDefault(); redo(); return; }
  if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); if (pages.length) exportPdf(); return; }
  if (typing) return;
  if (SIGN) { if (e.key === "Enter" && document.activeElement.classList?.contains("mine")) { e.preventDefault(); fillField(document.activeElement.dataset.id); } return; }
  if (view === "edit") {
    if ((e.key === "Delete" || e.key === "Backspace") && E.selA) { e.preventDefault(); commit(); curPage().annots = curPage().annots.filter(a => a.id !== E.selA); E.selA = null; renderLayer(); }
    else if (e.key === "Escape") { E.selA = null; setETool("select"); }
    else if (e.key.toLowerCase() === "v") setETool("select"); else if (e.key.toLowerCase() === "t") setETool("text");
    else if (E.selA && e.key.startsWith("Arrow")) { const a = findA(E.selA), s = e.shiftKey ? .01 : .002, [dx, dy] = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key]; e.preventDefault(); commitOnce(); if (a.type === "pen") a.pts = a.pts.map(([x, y]) => [x + dx, y + dy]); else { a.x += dx; a.y += dy; } renderLayer(); }
    else if (e.key === "PageDown") $("#nextPg").click(); else if (e.key === "PageUp") $("#prevPg").click();
  } else if (view === "grid") {
    if ((e.key === "Delete" || e.key === "Backspace") && sel.size) { e.preventDefault(); $('[data-sa="del"]').click(); }
    if (mod && e.key.toLowerCase() === "a") { e.preventDefault(); pages.forEach(p => sel.add(p.id)); refresh(); }
  }
});
addEventListener("keyup", e => { if (e.key.startsWith("Arrow")) typingCommitted = false; });

/* ============ Signature requests ============ */
const REQ_FILE = "ifleavesweave-signing.json";
const SIGNER_COLORS = ["#2453D6", "#C2410C", "#0F766E", "#7C3AED", "#BE185D"];
const FIELD_LABEL = { sign: "Signature", initials: "Initials", date: "Date signed", name: "Full name", text: "Text" };
const FIELD_SIZE = { sign: [170, 46], initials: [64, 38], date: [110, 22], name: [170, 22], text: [170, 22] };
const REQ = { signers: [{ id: "s1", name: "", email: "", color: SIGNER_COLORS[0] }], cur: "s1" };
let SIGN = null;
const signerOf = id => (SIGN ? SIGN.req.signers : REQ.signers).find(g => g.id === id);
const signerName = id => signerOf(id)?.name || "the signer";
const signerColor = id => signerOf(id)?.color || "#888";
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const allFields = () => pages.flatMap((p, i) => p.annots.filter(a => a.type === "field").map(a => ({ a, i })));

function fieldHTML(a, s, box) {
  const col = signerColor(a.signer); let cls = "", label, inner = "", attrs = "";
  if (SIGN) {
    const mine = a.signer === SIGN.me, v = SIGN.values[a.id];
    cls = mine ? (v ? " mine done" : " mine") : " other";
    label = mine ? (v ? "" : `${FIELD_LABEL[a.kind]}${a.kind === "sign" || a.kind === "initials" ? ": click to sign" : ""}`) : `For ${esc(signerName(a.signer))}`;
    if (v) inner = v.img ? `<img src="${v.img}" alt="">` : `<span class="fv">${esc(v.text)}</span>`;
    if (mine) attrs = ` tabindex="0" role="button" aria-label="${FIELD_LABEL[a.kind]} field${v ? ", filled. Press Enter to change" : ", required. Press Enter to fill in"}"`;
  } else label = `${FIELD_LABEL[a.kind]}<br>${esc(signerName(a.signer))}`;
  return `<div class="an field${cls}${s}" data-id="${a.id}" style="${box}--fc:${col}"${attrs}>${label ? `<span class="fl">${label}</span>` : ""}${inner}${SIGN ? "" : '<span class="rs"></span>'}</div>`;
}

/* --- sender: build the request --- */
function syncRequest() { renderSigners(); syncCounts(); }
function renderSigners() {
  $("#signers").innerHTML = REQ.signers.map((g, i) => `
    <div class="signer" data-sid="${g.id}"><span class="dot" style="background:${g.color}" aria-hidden="true"></span><strong>Signer ${i + 1}</strong>
      ${REQ.signers.length > 1 ? `<button class="ib" data-rm="${g.id}" aria-label="Remove signer ${i + 1}" title="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>` : "<span></span>"}
      <div class="two"><label class="sr" for="sn_${g.id}">Signer ${i + 1} name</label><input type="text" id="sn_${g.id}" data-k="name" placeholder="Full name" value="${esc(g.name)}" autocomplete="off">
      <label class="sr" for="se_${g.id}">Signer ${i + 1} email</label><input type="text" id="se_${g.id}" data-k="email" inputmode="email" placeholder="Email address" value="${esc(g.email)}" autocomplete="off"></div></div>`).join("");
  $("#addSigner").hidden = REQ.signers.length >= SIGNER_COLORS.length;
}
function syncCounts() {
  if (!REQ.signers.some(g => g.id === REQ.cur)) REQ.cur = REQ.signers[0].id;
  renderWho();
  const counts = REQ.signers.map(g => [g, allFields().filter(f => f.a.signer === g.id).length]);
  $("#fieldCount").textContent = counts.map(([g, n]) => `${g.name || "Unnamed signer"}: ${n} field${n === 1 ? "" : "s"}`).join(". ") + ".";
}
function renderWho() { $("#whoFor").innerHTML = REQ.signers.map((g, i) => `<button class="chip" role="radio" data-who="${g.id}" aria-pressed="${g.id === REQ.cur}"><i style="background:${g.color}"></i>${esc(g.name || `Signer ${i + 1}`)}</button>`).join(""); }
$("#signers").addEventListener("input", e => { const row = e.target.closest("[data-sid]"); if (!row) return; const g = REQ.signers.find(x => x.id === row.dataset.sid); g[e.target.dataset.k] = e.target.value.trim(); renderWho(); if (view === "edit") renderLayer(); else scheduleGrid(); });
$("#signers").addEventListener("change", () => syncCounts());
$("#signers").addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (!b) return; if (allFields().some(f => f.a.signer === b.dataset.rm) && !confirm("Remove this signer and their fields?")) return; commit(); pages.forEach(p => (p.annots = p.annots.filter(a => !(a.type === "field" && a.signer === b.dataset.rm)))); REQ.signers = REQ.signers.filter(g => g.id !== b.dataset.rm); syncRequest(); refresh(); });
$("#addSigner").onclick = () => { const used = REQ.signers.map(g => g.color), id = uid("s"); REQ.signers.push({ id, name: "", email: "", color: SIGNER_COLORS.find(c => !used.includes(c)) }); REQ.cur = id; syncRequest(); $(`#sn_${id}`).focus(); };
$("#whoFor").addEventListener("click", e => { const b = e.target.closest("[data-who]"); if (b) { REQ.cur = b.dataset.who; renderWho(); } });
$("#fieldBtns").addEventListener("click", e => { const b = e.target.closest("[data-fk]"); if (!b) return; if (view !== "edit") openEditor(sel.size ? pages.findIndex(p => sel.has(p.id)) : 0); setETool("field:" + b.dataset.fk); if (innerWidth <= 900) $("#estage").scrollIntoView({ behavior: "smooth" }); });
async function sha256(bytes) { const h = await crypto.subtle.digest("SHA-256", bytes); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join(""); }
let lastMail = "";
$("#reqCreate").onclick = async () => {
  const err = $("#reqErr"); err.textContent = "";
  const bad = REQ.signers.find(g => !g.name); if (bad) { err.textContent = "Add a name for every signer."; $(`#sn_${bad.id}`).focus(); return; }
  const badE = REQ.signers.find(g => g.email && !validEmail(g.email)); if (badE) { err.textContent = `Check the email address for ${badE.name}.`; $(`#se_${badE.id}`).focus(); return; }
  const none = REQ.signers.find(g => !allFields().some(f => f.a.signer === g.id)); if (none) { err.textContent = `Add at least one field for ${none.name}.`; return; }
  if ($("#meEmail").value && !validEmail($("#meEmail").value.trim())) { err.textContent = "Check your own email address."; $("#meEmail").focus(); return; }
  if (E.editing) endEdit();
  try {
    busy("Preparing the signing file", 10);
    const base = await buildPdf(pages, { onProgress: f => busy("Preparing the signing file", 10 + f * 70) }), hash = await sha256(base);
    const sender = { name: $("#meName").value.trim(), email: $("#meEmail").value.trim() };
    const req = { app: "ifleavesweave", type: "signature-request", v: 1, id: (crypto.randomUUID ? crypto.randomUUID() : uid("doc") + Date.now()), title: safeName(), created: new Date().toISOString(), sender, message: $("#reqMsg").value.trim(), baseCount: pages.length, hash,
      signers: REQ.signers.map(({ id, name, email, color }) => ({ id, name, email, color })),
      fields: allFields().map(({ a, i }) => ({ id: a.id, page: i, kind: a.kind, signer: a.signer, x: a.x, y: a.y, w: a.w, h: a.h })), values: {},
      events: [{ type: "created", by: sender.name || "Sender", email: sender.email, at: new Date().toISOString() }] };
    const doc = await PDFDocument.load(base);
    await doc.attach(new TextEncoder().encode(JSON.stringify(req)), REQ_FILE, { mimeType: "application/json", description: "If Leaves Weave signature request", creationDate: new Date(), modificationDate: new Date() });
    const out = await doc.save(); busy(false);
    const fname = `${safeName()}-for-signing.pdf`; download(new Blob([out], { type: "application/pdf" }), fname); count("requests");
    const site = location.origin + location.pathname, to = req.signers.filter(g => g.email).map(g => g.email).join(",");
    lastMail = `${req.message ? req.message + "\n\n" : ""}How to sign:\n1. Save the attached PDF (${fname}).\n2. Open ${site} and choose the file.\n3. Follow the steps, then email the signed PDF back${sender.email ? ` to ${sender.email}` : ""}.\n\nNothing is uploaded: the file stays on your device.${sender.name ? `\n\nThanks,\n${sender.name}` : ""}`;
    $("#reqMail").href = `mailto:${to}?subject=${encodeURIComponent("Please sign: " + req.title)}&body=${encodeURIComponent(lastMail)}`;
    $("#reqSend").hidden = false; $("#rq1").classList.add("done"); $("#rq2").classList.add("done");
    toast("Signing file downloaded. Now email it to your signers.", 4200); $("#reqMail").focus();
  } catch (e) { console.error(e); busy(false); err.textContent = "Couldn’t create the signing file. Try again, or check the PDF isn’t protected."; }
};
$("#reqCopy").onclick = async () => { try { await navigator.clipboard.writeText(lastMail); toast("Message copied"); } catch { toast("Couldn’t copy. Select the text in your email instead."); } };

/* --- signer: guided signing --- */
function startSigning(srcIndex) {
  const s = sources[srcIndex], req = s.req;
  SIGN = { src: srcIndex, req, me: null, values: {} };
  $(".app").classList.add("signing");
  pages.forEach((p, i) => { p.annots = req.fields.filter(f => f.page === i && !(req.values[f.id] && req.values[f.id].baked)).map(f => ({ ...f, type: "field" })); });
  const pending = req.signers.filter(g => req.fields.some(f => f.signer === g.id && !(req.values[f.id] && req.values[f.id].baked)));
  const when = new Date(req.created).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  $("#reqInfo").innerHTML = `<p><strong>${esc(req.title)}</strong></p><p class="note">${req.sender.name ? `From ${esc(req.sender.name)}${req.sender.email ? ` (${esc(req.sender.email)})` : ""}, ` : ""}sent ${when}</p>${req.message ? `<blockquote>${esc(req.message)}</blockquote>` : ""}`;
  $("#signDone").hidden = true; $("#myFields").hidden = true; $("#consent").checked = false;
  if (!pending.length) { $("#whoAmI").hidden = true; showDone(true); }
  else {
    $("#whoAmI").hidden = false;
    $("#whoList").innerHTML = pending.map(g => `<button class="signer" role="radio" aria-checked="false" data-me="${g.id}" style="text-align:left;background:var(--panel);cursor:pointer"><span class="dot" style="background:${g.color}"></span><span><strong>${esc(g.name)}</strong>${g.email ? `<br><span class="note">${esc(g.email)}</span>` : ""}</span><span></span></button>`).join("");
    if (pending.length === 1) chooseMe(pending[0].id);
  }
  tool = "edit"; openEditor(0);
  toast(`Signature request from ${req.sender.name || "the sender"}`, 3500);
}
$("#whoList").addEventListener("click", e => { const b = e.target.closest("[data-me]"); if (b) chooseMe(b.dataset.me); });
function myFields() { return pages.flatMap((p, i) => p.annots.filter(a => a.type === "field" && a.signer === SIGN.me).map(a => ({ a, i }))); }
function chooseMe(id) {
  SIGN.me = id; $$("#whoList [data-me]").forEach(b => { b.setAttribute("aria-checked", b.dataset.me === id); b.style.borderColor = b.dataset.me === id ? "var(--blue)" : ""; });
  $("#myFields").hidden = false; syncSigning(); renderLayer(); setTimeout(nextField, 50);
}
function syncSigning() {
  const f = myFields(), done = f.filter(x => SIGN.values[x.a.id]).length;
  $("#progressL").textContent = `${done} of ${f.length} field${f.length === 1 ? "" : "s"} done`; $("#sigBar").style.width = (f.length ? done / f.length * 100 : 0) + "%";
  $("#flist").innerHTML = f.map(({ a, i }) => `<li><button class="${SIGN.values[a.id] ? "done" : ""}" data-go="${a.id}"><span class="st" aria-hidden="true">${SIGN.values[a.id] ? "✓" : ""}</span>${FIELD_LABEL[a.kind]}<span class="note" style="margin-left:auto">Page ${i + 1}</span></button></li>`).join("");
  $("#nextField").hidden = done === f.length; $("#finishSign").disabled = !(done === f.length && $("#consent").checked);
}
$("#consent").addEventListener("change", syncSigning);
$("#flist").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) goField(b.dataset.go, true); });
$("#nextField").onclick = nextField;
function nextField() { const f = myFields().find(x => !SIGN.values[x.a.id]); if (f) goField(f.a.id, false); }
async function goField(id, fill) {
  const pi = pages.findIndex(p => p.annots.some(a => a.id === id)); if (pi < 0) return;
  if (pi !== E.pi) { E.pi = pi; await renderEditor(); }
  const el = layer.querySelector(`[data-id="${id}"]`); if (el) { el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }); el.focus({ preventScroll: true }); }
  if (fill) fillField(id);
}
const fieldDlg = $("#fieldDlg");
function askText(title, label, value) { return new Promise(res => { $("#fdTitle").textContent = title; $("#fdLabel").textContent = label; $("#fdInput").value = value || ""; fieldDlg.returnValue = ""; fieldDlg.showModal(); $("#fdInput").select(); fieldDlg.addEventListener("close", () => res(fieldDlg.returnValue === "ok" ? $("#fdInput").value.trim() : null), { once: true }); }); }
async function fillField(id) {
  const a = pages.flatMap(p => p.annots).find(x => x.id === id); if (!a || a.signer !== SIGN.me) return;
  const me = signerOf(SIGN.me), set = v => { SIGN.values[id] = v; renderLayer(); syncSigning(); setTimeout(() => { const next = myFields().find(x => !SIGN.values[x.a.id]); if (next) goField(next.a.id, false); else $("#consent").focus(); }, 60); };
  if (a.kind === "sign") openSigDlg(url => set({ img: url }), me.name, "Add your signature");
  else if (a.kind === "initials") openSigDlg(url => set({ img: url }), me.name.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join(""), "Add your initials");
  else if (a.kind === "date") set({ text: new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) });
  else if (a.kind === "name") { const v = await askText("Your full name", "Full name", SIGN.values[id]?.text || me.name); if (v) set({ text: v }); }
  else { const v = await askText("Fill in this field", "Text", SIGN.values[id]?.text); if (v) set({ text: v }); }
}
$("#exitSign").onclick = () => { if (!confirm("Open this as an ordinary PDF? The signing steps will close.")) return; SIGN = null; $(".app").classList.remove("signing"); pages.forEach(p => (p.annots = [])); tool = "pages"; selectToolUI("pages"); setView("grid"); refresh(); };

function safeText(f, t) { return [...t].map(ch => { try { f.encodeText(ch); return ch; } catch { return "?"; } }).join(""); }
$("#finishSign").onclick = async () => {
  const req = structuredClone(SIGN.req), me = req.signers.find(g => g.id === SIGN.me), src = sources[SIGN.src];
  try {
    busy("Adding your signature", 20);
    const lib = await PDFDocument.load(src.bytes, { ignoreEncryption: true }), out = await PDFDocument.create();
    const copied = await out.copyPages(lib, [...Array(req.baseCount).keys()]); copied.forEach(pg => out.addPage(pg));
    const helv = await out.embedFont(StandardFonts.Helvetica), bold = await out.embedFont(StandardFonts.HelveticaBold), imgs = new Map();
    for (const f of req.fields) {
      const v = SIGN.values[f.id]; if (!v || f.signer !== SIGN.me) continue;
      const page = out.getPage(f.page), R = page.getRotation().angle % 360, box = page.getCropBox(), dw = R % 180 ? box.height : box.width, dh = R % 180 ? box.width : box.height, M = mapper(box, R), rot = degrees(R);
      const bw = f.w * dw, bh = f.h * dh;
      if (v.img) {
        if (!imgs.has(v.img)) imgs.set(v.img, await out.embedPng(dataBytes(v.img)));
        const im = imgs.get(v.img), k = Math.min(bw / im.width, bh / im.height), iw = im.width * k, ih = im.height * k, ox = (bw - iw) / 2 / dw, oy = (bh - ih) / 2 / dh;
        const [x, y] = M(f.x + ox, f.y + oy + ih / dh); page.drawImage(im, { x, y, width: iw, height: ih, rotate: rot });
      } else {
        let text = v.text, fnt = helv, size = clamp(bh * .62, 7, 14);
        try { size = Math.max(6, Math.min(size, (bw - 4) / helv.widthOfTextAtSize(text, 1))); } catch {}
        try { helv.encodeText(text); } catch { const url = rasterText({ text, font: "Helvetica", size, color: "#111111", bold: false, italic: false }); const im = await out.embedPng(dataBytes(url)); const [x, y] = M(f.x, f.y + (bh / 2 + im.height / 8 / 2) / dh); page.drawImage(im, { x, y, width: im.width / 4, height: im.height / 4, rotate: rot }); req.values[f.id] = { by: SIGN.me, at: new Date().toISOString(), baked: true }; continue; }
        const [x, y] = M(f.x + 2 / dw, f.y + (bh / 2 + size * .35) / dh); page.drawText(text, { x, y, size, font: fnt, color: rgb(.07, .07, .07), rotate: rot });
      }
      req.values[f.id] = { by: SIGN.me, at: new Date().toISOString(), baked: true };
    }
    const at = new Date(), mine = req.fields.filter(f => f.signer === SIGN.me).length;
    req.events.push({ type: "signed", by: me.name, email: me.email, at: at.toISOString(), fields: mine, device: navigator.userAgent.replace(/\s+/g, " ").slice(0, 120) });
    const left = req.signers.filter(g => req.fields.some(f => f.signer === g.id && !(req.values[f.id] && req.values[f.id].baked)));
    busy("Writing the signing record", 70);
    // signing record page
    const pg = out.addPage([595.28, 841.89]); let y = 780; const L = 56, line = (t, o = {}) => { pg.drawText(safeText(o.font || helv, t), { x: o.x ?? L, y, size: o.size || 10.5, font: o.font || helv, color: o.color || rgb(.15, .17, .2) }); y -= o.gap || 16; };
    line("Signing record", { font: bold, size: 20, gap: 30 });
    line(`Document: ${req.title}`, { font: bold, size: 12, gap: 20 });
    line(`Document ID: ${req.id}`); line("Original file fingerprint (SHA-256):"); line(req.hash.slice(0, 32), { x: L + 12 }); line(req.hash.slice(32), { x: L + 12, gap: 22 });
    line(left.length ? `Status: waiting for ${left.map(g => g.name).join(", ")}` : "Status: completed, all signers have signed", { font: bold, gap: 26 });
    line("Events", { font: bold, size: 12, gap: 20 });
    for (const ev of req.events) {
      const d = new Date(ev.at), local = d.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
      line(`${ev.type === "created" ? "Sent for signing by" : "Signed by"} ${ev.by}${ev.email ? ` <${ev.email}>` : ""}`, { font: bold });
      line(`${local}  (UTC ${d.toISOString().replace("T", " ").slice(0, 16)})${ev.fields ? `,  ${ev.fields} field${ev.fields > 1 ? "s" : ""}` : ""}`, { color: rgb(.35, .38, .42), gap: 20 });
      if (y < 140) break;
    }
    y = 110;
    ["Signatures were added with If Leaves Weave in each signer’s own web browser. The file never passed through a server.", "If Leaves Weave records the names and email addresses that signers chose; it does not verify identity.", "Keep this page with the document as a record of who signed and when."].forEach(t => line(t, { size: 8.5, color: rgb(.4, .43, .47), gap: 12 }));
    await out.attach(new TextEncoder().encode(JSON.stringify(req)), REQ_FILE, { mimeType: "application/json", description: "If Leaves Weave signature request", creationDate: new Date(req.created), modificationDate: at });
    out.setTitle(req.title); out.setProducer("If Leaves Weave");
    const bytes = await out.save(); busy(false);
    const fname = `${req.title}-signed${left.length ? `-by-${me.name.split(/\s+/)[0].toLowerCase()}` : ""}.pdf`;
    download(new Blob([bytes], { type: "application/pdf" }), fname); count("signed");
    SIGN.req = req; SIGN.doneFile = fname; SIGN.left = left; showDone(false);
  } catch (e) { console.error(e); busy(false); toast("Couldn’t finish signing. Please try again.", 4500); }
};
function showDone(already) {
  const req = SIGN.req, left = SIGN.left || [], box = $("#signDone");
  $("#myFields").hidden = true; $("#whoAmI").hidden = true; box.hidden = false;
  if (already) { box.innerHTML = `<p><strong>Everyone has already signed this document.</strong></p><p class="note">The last page is the signing record.</p>`; return; }
  const to = [req.sender.email, ...left.map(g => g.email)].filter(Boolean).join(","), site = location.origin + location.pathname;
  const body = left.length ? `I’ve signed ${req.title}. The signed file is attached.\n\n${left.map(g => g.name).join(", ")}: please open ${site}, choose the attached file and add your signature.` : `I’ve signed ${req.title}. Everyone has now signed; the signed file is attached.`;
  box.innerHTML = `<p><strong>Signed and downloaded</strong></p><p class="note">Saved as ${esc(SIGN.doneFile)}. ${left.length ? `Next: ${esc(left.map(g => g.name).join(", "))}.` : "Everyone has signed."}</p>
    <a class="btn primary" href="mailto:${to}?subject=${encodeURIComponent((left.length ? "Signed, your turn: " : "Signed: ") + req.title)}&body=${encodeURIComponent(body)}">Email the signed file</a><p class="note">Attach the file you just downloaded.</p>`;
  box.querySelector("a").focus();
}

/* ============ Form filling ============ */
async function readFormFields(bytes) {
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true }), form = doc.getForm(), L = window.PDFLib;
    return form.getFields().map(f => {
      const name = f.getName(), t = f instanceof L.PDFTextField ? "text" : f instanceof L.PDFCheckBox ? "check" : f instanceof L.PDFDropdown ? "select" : f instanceof L.PDFRadioGroup ? "radio" : f instanceof L.PDFOptionList ? "select" : null;
      if (!t) return null;
      let value = "", options = [];
      try {
        if (t === "text") value = f.getText() || "";
        if (t === "check") value = f.isChecked();
        if (t === "select") { options = f.getOptions(); value = (f.getSelected() || [])[0] || ""; }
        if (t === "radio") { options = f.getOptions(); value = f.getSelected() || ""; }
      } catch {}
      return { name, type: t, options, value, multiline: t === "text" && (() => { try { return f.isMultiline(); } catch { return false; } })() };
    }).filter(Boolean);
  } catch { return []; }
}
const prettyName = n => n.replace(/[_.\-]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ").trim().replace(/^./, c => c.toUpperCase());
function renderForm() {
  const srcs = [...new Set(pages.map(p => p.src))].map(i => [i, sources[i]]).filter(([, s]) => s.kind === "pdf" && s.fields?.length);
  $("#flatWrap").hidden = !srcs.length;
  if (!srcs.length) { $("#formFields").innerHTML = `<p class="note">This PDF has no fillable fields. Use <strong>Edit and sign</strong>, then <strong>Text</strong>, to type anywhere on the page.</p>`; return; }
  $("#formFields").innerHTML = srcs.map(([i, s]) => `${srcs.length > 1 ? `<span class="lbl">${esc(s.name)}</span>` : ""}` + s.fields.map((f, k) => {
    const id = `ff_${i}_${k}`, v = f.name in s.formValues ? s.formValues[f.name] : f.value, label = esc(prettyName(f.name));
    if (f.type === "check") return `<label class="check"><input type="checkbox" id="${id}" data-src="${i}" data-name="${esc(f.name)}" ${v ? "checked" : ""}>${label}</label>`;
    if (f.type === "select" || f.type === "radio") return `<div class="field"><label for="${id}">${label}</label><select id="${id}" data-src="${i}" data-name="${esc(f.name)}"><option value="">Choose…</option>${f.options.map(o => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></div>`;
    return `<div class="field"><label for="${id}">${label}</label>${f.multiline ? `<textarea id="${id}" rows="3" data-src="${i}" data-name="${esc(f.name)}">${esc(v)}</textarea>` : `<input type="text" id="${id}" data-src="${i}" data-name="${esc(f.name)}" value="${esc(v)}">`}</div>`;
  }).join("")).join("");
}
$("#formFields").addEventListener("input", e => { const el = e.target, s = sources[+el.dataset.src]; if (!s) return; s.formValues[el.dataset.name] = el.type === "checkbox" ? el.checked : el.value; });
async function fillForm(doc, s) {
  if (!s.formValues || !Object.keys(s.formValues).length) return doc;
  try {
    const form = doc.getForm(), L = window.PDFLib;
    for (const [name, v] of Object.entries(s.formValues)) {
      let f; try { f = form.getField(name); } catch { continue; }
      try {
        if (f instanceof L.PDFTextField) f.setText(String(v));
        else if (f instanceof L.PDFCheckBox) v ? f.check() : f.uncheck();
        else if ((f instanceof L.PDFDropdown || f instanceof L.PDFOptionList || f instanceof L.PDFRadioGroup) && v) f.select(v);
      } catch (err) { console.warn("Field", name, err); }
    }
    try { form.updateFieldAppearances(await doc.embedFont(StandardFonts.Helvetica)); } catch {}
    if ($("#formFlat").checked) form.flatten();
    count("forms");
  } catch (err) { console.warn(err); }
  return doc;
}

/* ============ True redaction ============ */
async function flattenRedacted(bytes, idxs) {
  const src = await PDFDocument.load(bytes), out = await PDFDocument.create(), doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  const set = new Set(idxs);
  for (let i = 0; i < src.getPageCount(); i++) {
    if (!set.has(i)) { const [pg] = await out.copyPages(src, [i]); out.addPage(pg); continue; }
    const pg = await doc.getPage(i + 1), vp = pg.getViewport({ scale: 200 / 72 }), base = pg.getViewport({ scale: 1 }), c = document.createElement("canvas");
    c.width = Math.round(vp.width); c.height = Math.round(vp.height); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: x, viewport: vp }).promise;
    const jpg = await (await new Promise(r => c.toBlob(r, "image/jpeg", .9))).arrayBuffer(), im = await out.embedJpg(new Uint8Array(jpg));
    out.addPage([base.width, base.height]).drawImage(im, { x: 0, y: 0, width: base.width, height: base.height }); c.width = c.height = 0;
  }
  doc.destroy();
  ["Title", "Author", "Subject"].forEach(k => { try { const v = src["get" + k](); if (v) out["set" + k](v); } catch {} });
  out.setProducer("If Leaves Weave"); count("redact");
  return out.save();
}



/* ============ Arriving at #flipbook (for example from a flipbook made with If Leaves Weave): go straight to the flipbook maker ============ */
const FLIP_MODE = location.hash === "#flipbook";
if (FLIP_MODE) {
  pendingTool = "flip"; // also when a PDF is dropped onto the page
  const h = document.querySelector("#tray h1"), p = h?.nextElementSibling;
  if (h) h.textContent = "Make a flipbook from a PDF";
  if (p) p.textContent = "Choose a PDF and it becomes a page-turning flipbook you can preview, then download as one file to open anywhere. It’s made on this device: nothing is uploaded.";
  const b = document.getElementById("openBtn"); if (b) { b.lastChild.textContent = " Choose a PDF"; setTimeout(() => b.focus(), 50); }
  document.title = "Make a flipbook from a PDF | If Leaves Weave";
  setTimeout(() => document.querySelector('[data-task="' + TASKS.findIndex(t => t[1] === "flip") + '"]')?.classList.add("task-hl"), 0);
  try { if (!sessionStorage.getItem("ifleavesweave-flipentry")) { sessionStorage.setItem("ifleavesweave-flipentry", "1"); count("flipbook_entry"); } } catch {}
}

/* ============ Find and redact: personal details found in the page text ============ */
const AR_PATTERNS = {
  nric: { label: "NRIC or FIN", re: /\b[STFGM][0-9X*•]{7}[A-Z]\b/gi },
  mykad: { label: "MyKad", re: /\b\d{6}-\d{2}-\d{4}\b/g },
  ukni: { label: "National Insurance", re: /\b(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z] ?\d{2} ?\d{2} ?\d{2} ?[A-D]\b/gi },
  phone: { label: "Phone", re: /(?<!\d[\s-]?)(?:\+\d{1,3}[\s-]?)?(?:\(\d{1,4}\)[\s-]?)?\b(?:[3689]\d{3}[\s-]?\d{4}|0\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4})\b(?![\s-]?\d)/g }, // not part of a longer run of digits
  email: { label: "Email", re: /\b[\w.%+-]+@[\w-]+(?:\.[\w-]+)+\b/gi },
  card: { label: "Card", re: /\b(?:\d[ -]?){12,18}\d\b/g, check: v => luhn(v.replace(/\D/g, "")) },
  long: { label: "Long number", re: /\b\d(?:[\d-]{6,}\d)\b/g, check: v => v.replace(/\D/g, "").length >= 8 },
  date: { label: "Date", re: /\b(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]* \d{4})\b/gi },
  postal: { label: "Postal code", re: /\b(?:Singapore|S)\s?\(?\d{6}\)?(?![\dA-Z])/gi }, // not the start of an NRIC such as S1234567D
};
function luhn(d) { if (d.length < 13 || d.length > 19) return false; let s = 0, alt = false; for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; } return s % 10 === 0; }
let arFound = []; const AR_CTX = document.createElement("canvas").getContext("2d");
async function arFind() {
  if (!pages.length) return toast("Open a PDF first.");
  const kinds = [...document.querySelectorAll("[data-ar]")].filter(c => c.checked).map(c => c.dataset.ar), words = (document.getElementById("arWords").value || "").split(/[\n,]+/).map(w => w.trim()).filter(Boolean);
  if (!kinds.length && !words.length) return toast("Choose at least one kind of detail, or type words to find.");
  busy("Reading the text", 0); arFound = []; let textChars = 0;
  try {
    const bytes = await buildPdf(), doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
    const wordRes = words.map(w => ({ label: "Your words", re: new RegExp(`(?<![\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")}(?![\\p{L}\\p{N}])`, "giu") }));
    for (let pi = 0; pi < doc.numPages; pi++) {
      const pg = await doc.getPage(pi + 1), vp = pg.getViewport({ scale: 1 }), tc = await pg.getTextContent();
      // group text pieces into lines, keeping where each character came from
      const lines = []; let cur = null;
      for (const it of tc.items) { if (!("str" in it)) continue; const y = it.transform[5]; if (!cur || Math.abs(y - cur.y) > Math.max(2, Math.hypot(it.transform[2], it.transform[3]) * .5)) { cur = { y, text: "", map: [] }; lines.push(cur); } else if (cur.text && !/\s$/.test(cur.text) && it.str && !/^\s/.test(it.str)) { const last = cur.items?.[cur.items.length - 1]; const gap = last ? it.transform[4] - (last.transform[4] + last.width) : 0; if (gap > 1) { cur.text += " "; cur.map.push(null); } }
        (cur.items ||= []).push(it); for (let k = 0; k < it.str.length; k++) { cur.text += it.str[k]; cur.map.push([it, k]); } textChars += it.str.trim().length; if (it.hasEOL) cur = null; }
      // where characters a..b sit inside a piece of text: measured with a font of the same style (letters differ in width), plus a safety margin so a box never falls short
      const box = (it, a, b) => { const [A, B, C, Dd, E, F] = it.transform, len = Math.max(1, it.str.length), sc = Math.hypot(A, B) || 1, ux = A / sc, uy = B / sc, hgt = Math.hypot(C, Dd) || it.height || 10, vx = C / hgt, vy = Dd / hgt, w = it.width || 0;
        const fam = tc.styles?.[it.fontName]?.fontFamily || "sans-serif"; AR_CTX.font = `40px ${fam}`; const full = AR_CTX.measureText(it.str).width || 1, at = i => w * AR_CTX.measureText(it.str.slice(0, i)).width / full, pad = Math.max(w / len * .7, hgt * .25);
        const s0 = Math.max(0, at(a) - pad), s1 = Math.min(w + pad, at(b) + pad);
        const pts = [[s0, -.25], [s1, -.25], [s0, 1.05], [s1, 1.05]].map(([s, t]) => vp.convertToViewportPoint(E + ux * s + vx * hgt * t, F + uy * s + vy * hgt * t)); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const x0 = Math.min(...xs) - 1, y0 = Math.min(...ys) - 1, x1 = Math.max(...xs) + 1, y1 = Math.max(...ys) + 1; return { x: Math.max(0, x0 / vp.width), y: Math.max(0, y0 / vp.height), w: Math.min(1, (x1 - x0) / vp.width), h: Math.min(1, (y1 - y0) / vp.height) }; };
      for (const ln of lines) {
        const pats = [...kinds.map(k => ({ k, ...AR_PATTERNS[k] })), ...wordRes.map(r => ({ k: "words", ...r }))];
        for (const p of pats) { p.re.lastIndex = 0; let m; while ((m = p.re.exec(ln.text))) { if (!m[0].trim() || (p.check && !p.check(m[0]))) { if (!m[0]) p.re.lastIndex++; continue; }
          // one box per text piece the match runs across
          const segs = new Map(); for (let ci = m.index; ci < m.index + m[0].length; ci++) { const at = ln.map[ci]; if (!at) continue; const [it, k] = at; const s = segs.get(it) || [k, k]; s[0] = Math.min(s[0], k); s[1] = Math.max(s[1], k); segs.set(it, s); }
          const boxes = [...segs.entries()].map(([it, [a, b]]) => box(it, a, b + 1));
          if (boxes.length && !arFound.some(f => f.page === pi && f.text === m[0] && Math.abs(f.boxes[0].x - boxes[0].x) < .002 && Math.abs(f.boxes[0].y - boxes[0].y) < .002)) arFound.push({ id: arFound.length, page: pi, kind: p.label, text: m[0], boxes, on: true }); } }
      }
      busy(`Page ${pi + 1} of ${doc.numPages}`, (pi + 1) / doc.numPages * 100);
    }
    doc.destroy();
  } catch (e) { console.error(e); busy(false); return toast("Couldn’t read the text of this PDF."); }
  busy(false); arRender(textChars);
}
const arMask = t => t.length <= 4 ? "••••" : t.slice(0, 2) + "•".repeat(Math.max(2, t.length - 4)) + t.slice(-2);
function arRender(textChars) {
  const out = document.getElementById("arOut");
  if (!textChars) { out.innerHTML = `<p class="note warn">This PDF has no readable text: it may be a scan. Use <b>Read text</b> first to make it searchable, then try again.</p>`; return; }
  if (!arFound.length) { out.innerHTML = `<p class="note">Nothing found for the details you chose. Check the pages yourself too: no automatic search catches everything.</p>`; return; }
  const groups = {}; arFound.forEach(f => (groups[f.kind] ||= []).push(f));
  out.innerHTML = `<p class="note"><b>${arFound.length}</b> found. Untick anything that should stay visible.</p><div class="ar-list">${Object.entries(groups).map(([k, l]) => `<h3>${esc(k)} (${l.length})</h3>${l.map(f => `<label class="check ar-item"><input type="checkbox" data-arf="${f.id}" ${f.on ? "checked" : ""}><span><b>${esc(arMask(f.text))}</b> <small>page ${f.page + 1}</small></span><button class="ghost" data-arshow="${f.id}" title="Show where it is" type="button">Show</button></label>`).join("")}`).join("")}</div>
    <button class="btn primary" id="arMark">Mark ${arFound.filter(f => f.on).length} for redaction</button><p class="note">Text is shown partly hidden here for privacy. After marking, check every page, then download: marked pages are flattened so the text is gone for good.</p>`;
  out.querySelectorAll("[data-arf]").forEach(c => c.onchange = () => { arFound[+c.dataset.arf].on = c.checked; document.getElementById("arMark").textContent = `Mark ${arFound.filter(f => f.on).length} for redaction`; });
  out.querySelectorAll("[data-arshow]").forEach(b => b.onclick = () => { const f = arFound[+b.dataset.arshow]; openEditor(f.page); toast(`Page ${f.page + 1}: ${f.kind}`); });
  document.getElementById("arMark").onclick = () => { const chosen = arFound.filter(f => f.on); if (!chosen.length) return toast("Nothing is ticked."); commit(); let n = 0;
    chosen.forEach(f => f.boxes.forEach(bx => { pages[f.page].annots.push({ id: uid("a"), type: "rect", kind: "rd", x: +bx.x.toFixed(5), y: +bx.y.toFixed(5), w: +bx.w.toFixed(5), h: +bx.h.toFixed(5), color: "#000000", src: "auto", what: f.kind, item: f.id }); n++; }));
    renderGrid(); try { renderLayer(); } catch {} count("autoredact"); toast(`${chosen.length} item${chosen.length > 1 ? "s" : ""} marked. Check each page, then download to remove them permanently.`, 6000); out.innerHTML = `<p class="note">Marked ${chosen.length} item${chosen.length > 1 ? "s" : ""} (${n} box${n > 1 ? "es" : ""}). Undo removes them. Run Find again after changes.</p>`; };
}
document.getElementById("arFind")?.addEventListener("click", arFind);


/* ============ Redaction report: what was removed, where and when, without the removed values ============ */
let lastRedaction = null;
function syncReport() { const st = document.getElementById("rrState"); if (!st) return; st.textContent = lastRedaction ? `Ready: covers ${lastRedaction.name}, downloaded ${lastRedaction.at.toLocaleString()}.` : "Download the redacted PDF first, so the report can include its fingerprint."; }
function redactionReport() {
  const boxes = pages.flatMap((p, i) => p.annots.filter(a => a.type === "rect" && a.kind === "rd").map(a => ({ ...a, page: i + 1 })));
  if (!boxes.length) return toast("There are no redactions in this document yet.");
  const auto = boxes.filter(b => b.src === "auto"), manual = boxes.length - auto.length, byKind = {};
  // count each found item once (a detail across two text pieces has two boxes)
  const seen = new Set(); auto.forEach(b => { const k = `${b.what}|${b.item}|${b.page}`; if (seen.has(k)) return; seen.add(k); (byKind[b.what] ||= {})[b.page] = ((byKind[b.what] ||= {})[b.page] || 0) + 1; });
  const by = (document.getElementById("rrBy")?.value || "").trim(), why = (document.getElementById("rrWhy")?.value || "").trim(), L = lastRedaction, now = new Date();
  const lines = ["REDACTION REPORT", "=".repeat(16), "",
    `Document: ${L?.name || `${safeName()}.pdf (not downloaded yet)`}`, `Report made: ${now.toLocaleString()}`, by ? `Redacted by: ${by}` : "", why ? `Reason: ${why}` : "", "",
    L ? `Redacted PDF downloaded: ${L.at.toLocaleString()} (${kb(L.size)})` : "Redacted PDF: not downloaded yet, so no fingerprint is recorded.",
    L ? `SHA-256 fingerprint of the redacted PDF: ${L.hash}` : "",
    L ? `Pages flattened, so their text was permanently removed: ${L.pages.join(", ")} of ${L.total}` : "", "",
    `Redaction boxes: ${boxes.length} (${auto.length} placed by Find and redact, ${manual} drawn by hand)`,
    ...(Object.keys(byKind).length ? ["", "Found by Find and redact:", ...Object.entries(byKind).map(([k, pg]) => `  ${k}: ${Object.values(pg).reduce((a, b) => a + b, 0)} (page ${Object.keys(pg).join(", ")})`)] : []),
    "", "Not recorded: the redacted values themselves. This report can be kept or shared without revealing them.",
    "To check a file against this report: calculate its SHA-256 fingerprint (for example, certutil -hashfile file.pdf SHA256 on Windows, or shasum -a 256 file.pdf on Mac). It must match exactly.",
    "Automatic searches can miss details, such as names in images, so each page should also be checked by a person.",
    "", "Made with If Leaves Weave PDF, entirely on this device. A record to support your process, not legal advice."].filter((l, i, a) => l !== "" || a[i - 1] !== "");
  download(new Blob([lines.join("\n") + "\n"], { type: "text/plain" }), `${(L?.name || safeName()).replace(/\.pdf$/i, "")}-redaction-report.txt`); count("redaction_report"); toast("Redaction report saved");
}
document.getElementById("rrDl")?.addEventListener("click", redactionReport);

/* ============ Convert to Word and PowerPoint ============ */
const loaded = {};
function loadScript(src) { return (loaded[src] ||= new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => { delete loaded[src]; rej(new Error("load " + src)); }; document.head.appendChild(s); })); }
const convIdxs = () => { const only = $("#imgSelOnly").checked && sel.size; return pages.map((p, i) => (!only || sel.has(p.id) ? i : -1)).filter(i => i >= 0); };
async function pageText(pg) {
  const tc = await pg.getTextContent(), vp = pg.getViewport({ scale: 1 }), items = [];
  for (const it of tc.items) {
    if (!it.str || !it.str.trim()) continue;
    const [a, b, , , e, f] = it.transform, size = Math.hypot(a, b) || it.height || 10, [x, y] = vp.convertToViewportPoint(e, f);
    const font = (tc.styles[it.fontName]?.fontFamily || "") + " " + it.fontName;
    items.push({ str: it.str, x, y, w: it.width, size, bold: /bold|black|heavy|semibold/i.test(font) });
  }
  items.sort((p, q) => Math.abs(p.y - q.y) > Math.min(p.size, q.size) * .5 ? p.y - q.y : p.x - q.x);
  const lines = [];
  for (const it of items) {
    const ln = lines[lines.length - 1];
    if (ln && Math.abs(ln.y - it.y) <= Math.min(ln.size, it.size) * .5) { const gap = it.x - ln.end; ln.text += (gap > ln.size * .2 && !/\s$/.test(ln.text) ? " " : "") + it.str; ln.end = it.x + it.w; ln.bold = ln.bold && it.bold; ln.size = Math.max(ln.size, it.size); }
    else lines.push({ text: it.str, y: it.y, x: it.x, end: it.x + it.w, size: it.size, bold: it.bold });
  }
  const sizes = lines.map(l => l.size).sort((p, q) => p - q), body = sizes[Math.floor(sizes.length / 2)] || 11, paras = [];
  for (const ln of lines) {
    const pr = paras[paras.length - 1], heading = ln.size > body * 1.25;
    const joins = pr && !pr.heading && !heading && Math.abs(pr.size - ln.size) < 1 && ln.y - pr.lastY < ln.size * 1.75 && !/^[•\-–·▪●]\s?/.test(ln.text.trim());
    if (joins) { pr.text += (pr.text.endsWith("-") ? "" : " ") + ln.text.trim(); pr.lastY = ln.y; }
    else paras.push({ text: ln.text.trim(), size: ln.size, heading, bold: ln.bold, lastY: ln.y, bullet: /^[•\-–·▪●]\s?/.test(ln.text.trim()) });
  }
  return { paras, body, w: vp.width, h: vp.height, plain: lines.map(l => l.text).join("\n") };
}
async function renderPageJpeg(pg, dpi = 150) {
  const vp = pg.getViewport({ scale: dpi / 72 }), c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); await pg.render({ canvasContext: x, viewport: vp }).promise;
  const url = c.toDataURL("image/jpeg", .88); c.width = c.height = 0; return url;
}
async function exportDocx() {
  await loadScript(new URL("./vendor/docx.umd.min.js", import.meta.url).href);
  const D = window.docx, idxs = convIdxs(), bytes = await buildPdf(), doc = await pdfjsLib.getDocument({ data: bytes }).promise, sections = [];
  let textFound = 0;
  for (let k = 0; k < idxs.length; k++) {
    busy(`Converting page ${k + 1} of ${idxs.length}`, k / idxs.length * 100);
    const pg = await doc.getPage(idxs[k] + 1), vp = pg.getViewport({ scale: 1 }), size = { width: Math.round(vp.width * 20), height: Math.round(vp.height * 20), orientation: vp.width > vp.height ? D.PageOrientation.LANDSCAPE : D.PageOrientation.PORTRAIT };
    if (docxMode === "image") {
      const url = await renderPageJpeg(pg, 150), data = Uint8Array.from(atob(url.split(",")[1]), ch => ch.charCodeAt(0));
      sections.push({ properties: { page: { size, margin: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 } } }, children: [new D.Paragraph({ children: [new D.ImageRun({ type: "jpg", data, transformation: { width: Math.round(vp.width * 96 / 72) - 2, height: Math.round(vp.height * 96 / 72) - 2 } })] })] });
    } else {
      const t = await pageText(pg); textFound += t.paras.length;
      const children = t.paras.map(p => p.heading
        ? new D.Paragraph({ heading: p.size > t.body * 1.7 ? D.HeadingLevel.HEADING_1 : D.HeadingLevel.HEADING_2, children: [new D.TextRun({ text: p.text })] })
        : new D.Paragraph({ spacing: { after: 120 }, ...(p.bullet ? { bullet: { level: 0 } } : {}), children: [new D.TextRun({ text: p.bullet ? p.text.replace(/^[•\-–·▪●]\s?/, "") : p.text, bold: p.bold, size: Math.round(Math.min(Math.max(p.size, 8), 16) * 2) })] }));
      sections.push({ properties: { page: { size, margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } }, children: children.length ? children : [new D.Paragraph({ children: [new D.TextRun({ text: `[Page ${idxs[k] + 1} has no selectable text]`, italics: true, color: "888888" })] })] });
    }
  }
  doc.destroy();
  if (docxMode === "text" && !textFound) { busy(false); return toast("No text found. This looks like a scanned PDF, so choose “Exact look” instead.", 5000); }
  busy("Writing the Word file", 95);
  const blob = await D.Packer.toBlob(new D.Document({ creator: "If Leaves Weave", title: safeName(), styles: { default: { document: { run: { font: "Calibri", size: 22 } } } }, sections }));
  busy(false); download(blob, `${safeName()}.docx`); count("convert"); toast("Word document downloaded");
}
async function exportPptx() {
  await loadScript(new URL("./vendor/pptxgen.bundle.js", import.meta.url).href);
  const idxs = convIdxs(), bytes = await buildPdf(), doc = await pdfjsLib.getDocument({ data: bytes }).promise, pptx = new window.PptxGenJS();
  const first = (await doc.getPage(idxs[0] + 1)).getViewport({ scale: 1 }), W = first.width / 72, H = first.height / 72;
  pptx.defineLayout({ name: "PDF", width: W, height: H }); pptx.layout = "PDF"; pptx.title = safeName(); pptx.company = "If Leaves Weave";
  for (let k = 0; k < idxs.length; k++) {
    busy(`Making slide ${k + 1} of ${idxs.length}`, k / idxs.length * 100);
    const pg = await doc.getPage(idxs[k] + 1), vp = pg.getViewport({ scale: 1 }), url = await renderPageJpeg(pg, 150), slide = pptx.addSlide();
    const r = Math.min(W / (vp.width / 72), H / (vp.height / 72)), w = vp.width / 72 * r, h = vp.height / 72 * r;
    slide.addImage({ data: url, x: (W - w) / 2, y: (H - h) / 2, w, h });
    if ($("#cvNotes").checked) { const t = await pageText(pg); if (t.plain.trim()) slide.addNotes(t.plain); }
  }
  doc.destroy(); busy("Writing the PowerPoint file", 95);
  const blob = await pptx.write({ outputType: "blob" });
  busy(false); download(blob, `${safeName()}.pptx`); count("convert"); toast("PowerPoint file downloaded");
}
$("#cvGo").onclick = async () => {
  if (E.editing) endEdit();
  if (!convIdxs().length) return toast("Select at least one page, or untick “Only selected pages”.");
  try { if (cvFmt === "img") await exportImages(); else if (cvFmt === "pptx") await exportPptx(); else await exportDocx(); }
  catch (err) { console.error(err); busy(false); toast("Couldn’t convert this PDF. Try again, or choose “Exact look”.", 4500); }
};


/* ============ Shared with extras.js (compare, Bates, flipbook, text recognition) ============ */
window.IfLeavesWeave = { pdfjsLib, PDFDocument, StandardFonts, rgb, degrees, buildPdf, renderBuilt, busy, toast, download, count, safeName, kb, esc, tick, addFiles, hasDoc: () => pages.length > 0, insertIndex: () => sel.size ? Math.max(...pages.map((p, i) => (sel.has(p.id) ? i : -1))) + 1 : pages.length };
window.dispatchEvent(new Event("ifleavesweave-ready"));


/* ---------- Pictures sent from other If Leaves Weave tools (kept on this device) ---------- */
(async () => {
  if (location.hash !== "#handoff") return;
  const got = await new Promise(res => { try { const r = indexedDB.open("ifleavesweave-handoff", 1); r.onupgradeneeded = () => r.result.createObjectStore("files"); r.onsuccess = () => { const db = r.result, t = db.transaction("files", "readwrite"), st = t.objectStore("files"), g = st.get("latest"); g.onsuccess = () => { const v = g.result; st.delete("latest"); res(v || null); }; g.onerror = () => res(null); }; r.onerror = () => res(null); } catch { res(null); } });
  history.replaceState(null, "", location.pathname);
  if (!got?.blob) return;
  await addFiles([new File([got.blob], got.name || "drawing.png", { type: got.blob.type || "image/png" })]);
  if (typeof toast === "function") toast("Opened from another If Leaves Weave tool. Add notes, sign it or redact it, then download the PDF.", 6000);
})();
