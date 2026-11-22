/* If Leaves Weave extras: compare two versions, Bates numbering and stamps, flipbook, and text recognition (OCR).
   Everything runs in the browser. Text recognition downloads its engine and language data the first time. */
const ready = window.IfLeavesWeave ? Promise.resolve() : new Promise(r => addEventListener("ifleavesweave-ready", r, { once: true }));
await ready;
const F = window.IfLeavesWeave, { pdfjsLib, PDFDocument, StandardFonts, rgb, degrees, busy, toast, download, count, esc } = F;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const chips = (id, attr, cb) => $(id).addEventListener("click", e => { const b = e.target.closest(`[data-${attr}]`); if (!b) return; $$(`${id} [data-${attr}]`).forEach(x => x.setAttribute("aria-pressed", x === b)); cb(b.dataset[attr]); });
const readFile = f => f.arrayBuffer().then(b => new Uint8Array(b));

/* Map a point given in "as displayed" page coordinates to the page’s own coordinates, for rotated pages */
function placer(page) {
  const { width: W, height: H } = page.getSize(), R = ((page.getRotation().angle % 360) + 360) % 360;
  const vw = R % 180 ? H : W, vh = R % 180 ? W : H;
  const map = (vx, vy) => R === 90 ? [W - vy, vx] : R === 180 ? [W - vx, H - vy] : R === 270 ? [vy, H - vx] : [vx, vy];
  return { vw, vh, map, rot: degrees(R) };
}

/* ============ 1. Compare two versions ============ */
let cmpA = "open", fileA = null, fileB = null;
chips("#cmpASrc", "ca", v => { cmpA = v; if (v === "file") pickCmp("A"); else { fileA = null; $("#cmpAName").textContent = "Uses the document you have open."; } syncCmp(); });
function pickCmp(which) { const inp = $("#cmpIn"); inp.dataset.which = which; inp.value = ""; inp.click(); }
$("#cmpBPick").onclick = () => pickCmp("B");
$("#cmpIn").onchange = async () => { const f = $("#cmpIn").files[0]; if (!f) return; const bytes = await readFile(f); if ($("#cmpIn").dataset.which === "A") { fileA = { name: f.name, bytes }; $("#cmpAName").textContent = f.name; } else { fileB = { name: f.name, bytes }; $("#cmpBName").textContent = f.name; } syncCmp(); };
function syncCmp() { $("#cmpRun").disabled = !fileB || (cmpA === "file" && !fileA) || (cmpA === "open" && !F.hasDoc()); }
const normWord = w => w.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-");
async function wordsOf(bytes) {
  const doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise, out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const pg = await doc.getPage(i), tc = await pg.getTextContent();
    for (const it of tc.items) {
      if (!it.str || !it.str.trim()) continue; const [a, b, c, d, e, f] = it.transform, fh = Math.hypot(c, d) || Math.hypot(a, b) || 10, len = it.str.length; let pos = 0;
      for (const part of it.str.split(/(\s+)/)) { if (part.trim()) out.push({ t: part, k: normWord(part), page: i - 1, x: e + it.width * pos / len, w: it.width * part.length / len, y: f - fh * .25, h: fh * 1.2 }); pos += part.length; }
    }
    if (i % 5 === 0) busy(`Reading page ${i} of ${doc.numPages}`, i / doc.numPages * 50);
  }
  doc.destroy(); return out;
}
// Myers difference algorithm on words, after trimming the common start and end
function diff(A, B) {
  let s = 0; while (s < A.length && s < B.length && A[s] === B[s]) s++;
  let ea = A.length, eb = B.length; while (ea > s && eb > s && A[ea - 1] === B[eb - 1]) { ea--; eb--; }
  const a = A.slice(s, ea), b = B.slice(s, eb), N = a.length, M = b.length, MAX = N + M, off = MAX + 1, trace = [];
  let v = new Int32Array(2 * MAX + 3), D = -1;
  outer: for (let d = 0; d <= MAX; d++) {
    if (d > 3000) return null;
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && v[off + k - 1] < v[off + k + 1])) ? v[off + k + 1] : v[off + k - 1] + 1, y = x - k;
      while (x < N && y < M && a[x] === b[y]) { x++; y++; }
      v[off + k] = x; if (x >= N && y >= M) { D = d; trace.push(v.slice()); break outer; }
    }
  }
  const ops = []; let x = N, y = M;
  for (let d = D; d > 0; d--) {
    const pv = trace[d], k = x - y, prevK = (k === -d || (k !== d && pv[off + k - 1] < pv[off + k + 1])) ? k + 1 : k - 1, px = pv[off + prevK], py = px - prevK;
    while (x > px && y > py) { ops.push(["=", s + x - 1, s + y - 1]); x--; y--; }
    if (x === px) ops.push(["+", -1, s + y - 1]); else ops.push(["-", s + x - 1, -1]);
    x = px; y = py;
  }
  while (x > 0 && y > 0) { ops.push(["=", s + x - 1, s + y - 1]); x--; y--; }
  ops.reverse(); return ops;
}
function blocksOf(ops) { const out = []; let cur = null; for (const [t, i, j] of ops) { if (t === "=") { cur = null; continue; } if (!cur) out.push(cur = { del: [], ins: [] }); (t === "-" ? cur.del : cur.ins).push(t === "-" ? i : j); } return out; }
let lastCmp = null;
$("#cmpRun").onclick = async () => {
  try {
    busy("Reading both documents", 5); await F.tick();
    const aBytes = cmpA === "open" ? await F.buildPdf(undefined, { decorate: false }) : fileA.bytes, bBytes = fileB.bytes;
    const wa = await wordsOf(aBytes), wb = await wordsOf(bBytes);
    if (!wa.length || !wb.length) { busy(false); return toast("One of the files has no readable text. If it’s a scan, use “Read text” on it first.", 5000); }
    busy("Comparing", 70); await F.tick();
    const ops = diff(wa.map(w => w.k), wb.map(w => w.k)); busy(false);
    if (!ops) return toast("These documents are too different to compare word by word.", 4500);
    const blocks = blocksOf(ops); lastCmp = { aBytes, bBytes, wa, wb, blocks }; showCmp(); count("compare");
  } catch (err) { console.error(err); busy(false); toast("Couldn’t compare these files."); }
};
function showCmp() {
  const { wa, wb, blocks } = lastCmp, added = blocks.reduce((n, b) => n + b.ins.length, 0), removed = blocks.reduce((n, b) => n + b.del.length, 0);
  const text = (ws, idx) => esc(idx.map(i => ws[i].t).join(" ")), pg = b => (b.ins.length ? wb[b.ins[0]].page : wa[b.del[0]].page) + 1;
  $("#cmpOut").innerHTML = !blocks.length ? `<p class="note"><b>No differences in the text.</b> The wording of both versions is identical. (Layout, images and formatting aren’t compared.)</p>` : `
    <div class="stat"><span>Changes</span><b>${blocks.length}</b></div><div class="stat"><span>Words added</span><b style="color:#1E7B4C">${added}</b></div><div class="stat"><span>Words removed</span><b style="color:#C2362B">${removed}</b></div>
    <button class="btn primary" id="cmpDlB">Download revised version, changes highlighted</button><button class="btn" id="cmpDlA">Download original, removals highlighted</button><button class="btn" id="cmpDlR">Download a change report</button>
    <div style="display:grid;gap:.45rem;max-height:46vh;overflow:auto">${blocks.slice(0, 300).map(b => `<div style="border:1px solid var(--line);border-radius:8px;padding:.5rem .6rem;font-size:.86rem"><b>Page ${pg(b)}</b><br>${b.del.length ? `<del style="color:#C2362B">${text(wa, b.del)}</del> ` : ""}${b.ins.length ? `<ins style="color:#1E7B4C;text-decoration:none;background:#D9F5E3">${text(wb, b.ins)}</ins>` : ""}</div>`).join("")}${blocks.length > 300 ? `<p class="note">Showing the first 300 changes. The downloads include all of them.</p>` : ""}</div>`;
  if (!blocks.length) return;
  $("#cmpDlB").onclick = () => markup(lastCmp.bBytes, wb, blocks.flatMap(b => b.ins), [.12, .7, .35], "revised-highlighted");
  $("#cmpDlA").onclick = () => markup(lastCmp.aBytes, wa, blocks.flatMap(b => b.del), [.85, .2, .15], "original-removals");
  $("#cmpDlR").onclick = () => { const lines = [`Comparison of “${cmpA === "open" ? F.safeName() : fileA.name}” (original) and “${fileB.name}” (revised)`, `${blocks.length} changes: ${added} words added, ${removed} words removed.`, ""]; blocks.forEach((b, i) => { lines.push(`${i + 1}. Page ${pg(b)}`); if (b.del.length) lines.push(`   Removed: ${b.del.map(j => wa[j].t).join(" ")}`); if (b.ins.length) lines.push(`   Added:   ${b.ins.map(j => wb[j].t).join(" ")}`); lines.push(""); }); download(new Blob([lines.join("\n")], { type: "text/plain" }), `${F.safeName()}-changes.txt`); };
}
async function markup(bytes, words, idxs, [r, g, b], suffix) {
  try {
    busy("Marking up", 50); const doc = await PDFDocument.load(bytes, { ignoreEncryption: true }), pagesL = doc.getPages();
    for (const i of idxs) { const w = words[i], p = pagesL[w.page]; if (!p) continue; p.drawRectangle({ x: w.x - 1, y: w.y, width: w.w + 2, height: w.h, color: rgb(r, g, b), opacity: .28 }); if (suffix === "original-removals") p.drawLine({ start: { x: w.x, y: w.y + w.h * .45 }, end: { x: w.x + w.w, y: w.y + w.h * .45 }, thickness: Math.max(.6, w.h * .06), color: rgb(r, g, b) }); }
    const out = await doc.save(); busy(false); download(new Blob([out], { type: "application/pdf" }), `${F.safeName()}-${suffix}.pdf`); toast("Marked-up copy saved");
  } catch (err) { console.error(err); busy(false); toast("Couldn’t mark up this file. It may be protected."); }
}
$$('.tool[data-tool="compare"]').forEach(b => b.addEventListener("click", syncCmp));

/* ============ 2. Bates numbering and stamps ============ */
let batesPos = "br";
chips("#btPos", "bp", v => { batesPos = v; previewBates(); });
const batesLabel = n => `${$("#btPrefix").value}${String(n).padStart(Math.max(1, +$("#btDigits").value || 6), "0")}${$("#btSuffix").value}`;
function previewBates() { const s = +$("#btStart").value || 0; $("#btPreview").textContent = `First page: ${batesLabel(s)}. Next: ${batesLabel(s + 1)}.`; }
["#btPrefix", "#btSuffix", "#btStart", "#btDigits"].forEach(id => $(id).addEventListener("input", previewBates)); previewBates();
async function stampBates(bytes, start) {
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true }), font = await doc.embedFont(StandardFonts.HelveticaBold), reg = await doc.embedFont(StandardFonts.Helvetica);
  const size = Math.max(5, +$("#btSize").value || 9), stamp = ($("#btStamp").value || "").trim(), box = $("#btBox").checked, margin = 18; let n = start;
  const clean = t => t.replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "");
  for (const page of doc.getPages()) {
    const P = placer(page), label = clean(batesLabel(n)), lw = font.widthOfTextAtSize(label, size), top = batesPos === "tr";
    let vx = batesPos === "bl" ? margin : batesPos === "bc" ? (P.vw - lw) / 2 : P.vw - margin - lw, vy = top ? P.vh - margin - size : margin;
    const draw = (txt, f, sz, x, y) => { const w = f.widthOfTextAtSize(txt, sz); if (box) { const [bx, by] = P.map(x - 3, y - 3); page.drawRectangle({ x: bx, y: by, width: w + 6, height: sz + 5, color: rgb(1, 1, 1), rotate: P.rot, opacity: .92 }); } const [ux, uy] = P.map(x, y); page.drawText(txt, { x: ux, y: uy, size: sz, font: f, color: rgb(.07, .07, .07), rotate: P.rot }); };
    draw(label, font, size, vx, vy);
    if (stamp) { const st = clean(stamp), sw = reg.widthOfTextAtSize(st, size); const sx = batesPos === "bl" ? P.vw - margin - sw : batesPos === "bc" ? (P.vw - sw) / 2 : margin, sy = batesPos === "bc" ? vy + size + 6 : vy; draw(st, reg, size, sx, sy); }
    n++;
  }
  return { bytes: await doc.save(), first: start, last: n - 1, pages: n - start };
}
$("#btOne").onclick = async () => {
  if (!F.hasDoc()) return toast("Open a PDF first.");
  try { busy("Numbering", 40); const r = await stampBates(await F.buildPdf(), +$("#btStart").value || 0); busy(false); download(new Blob([r.bytes], { type: "application/pdf" }), `${batesLabel(r.first)}-${batesLabel(r.last)}.pdf`); toast(`Numbered ${r.pages} pages: ${batesLabel(r.first)} to ${batesLabel(r.last)}`); count("bates"); }
  catch (err) { console.error(err); busy(false); toast("Couldn’t number this PDF."); }
};
$("#btMany").onclick = () => { $("#batesIn").value = ""; $("#batesIn").click(); };
$("#batesIn").onchange = async () => {
  const files = [...$("#batesIn").files].filter(f => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); if (!files.length) return;
  try {
    const zip = new JSZip(), index = [["File", "First number", "Last number", "Pages"]]; let n = +$("#btStart").value || 0;
    for (let i = 0; i < files.length; i++) { busy(`Numbering ${files[i].name}`, i / files.length * 100); const r = await stampBates(await readFile(files[i]), n); zip.file(`${batesLabel(r.first)}-${batesLabel(r.last)} ${files[i].name}`, r.bytes); index.push([files[i].name, batesLabel(r.first), batesLabel(r.last), r.pages]); n = r.last + 1; }
    zip.file("index.csv", index.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n"));
    busy("Zipping", 100); const blob = await zip.generateAsync({ type: "blob" }); busy(false); download(blob, `bates-${batesLabel(+$("#btStart").value || 0)}-${batesLabel(n - 1)}.zip`);
    toast(`Numbered ${files.length} files, ${batesLabel(+$("#btStart").value || 0)} to ${batesLabel(n - 1)}`, 4000); $("#btStart").value = n; previewBates(); count("bates");
  } catch (err) { console.error(err); busy(false); toast("One of those PDFs couldn’t be numbered. It may be protected."); }
};

/* ============ 3. Flipbook ============ */
let fbWidth = 1300;
chips("#fbQ", "fq", v => fbWidth = +v);
const canWebp = (() => { try { const c = document.createElement("canvas"); c.width = c.height = 2; return c.toDataURL("image/webp").startsWith("data:image/webp"); } catch { return false; } })();
$("#fbGo").onclick = async () => {
  if (!F.hasDoc()) return toast("Open a PDF first.");
  try {
    busy("Preparing pages", 0); const bytes = await F.buildPdf(), doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise, imgs = [], texts = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const pg = await doc.getPage(i), base = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: fbWidth / base.width }), c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); await pg.render({ canvasContext: x, viewport: vp }).promise;
      imgs.push({ src: canWebp ? c.toDataURL("image/webp", .8) : c.toDataURL("image/jpeg", .82), w: c.width, h: c.height });
      try { const tc = await pg.getTextContent(); texts.push(tc.items.map(t => t.str + (t.hasEOL ? " " : "")).join("").replace(/\s+/g, " ").trim()); } catch { texts.push(""); }
      c.width = c.height = 0; busy(`Page ${i} of ${doc.numPages}`, i / doc.numPages * 100);
    }
    doc.destroy(); const title = ($("#fbTitle").value || F.safeName()).trim();
    const pdf = $("#fbPdf").checked && $("#fbSite").checked ? "file" : $("#fbPdf").checked ? "data:application/pdf;base64," + await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(",")[1]); fr.readAsDataURL(new Blob([bytes], { type: "application/pdf" })); }) : null;
    if ($("#fbSite").checked) {
      // a website folder: small index.html, one image per page, a 1200×630 preview card for link sharing
      busy("Building the website folder", 95); const zip = new JSZip(), ext = canWebp ? "webp" : "jpg", files = imgs.map((im, i) => ({ ...im, path: `pages/${String(i + 1).padStart(3, "0")}.${ext}` }));
      files.forEach(f => zip.file(f.path, f.src.split(",")[1], { base64: true }));
      zip.file("preview.jpg", (await previewCard(imgs[0].src, title, $("#fbBg").value)).split(",")[1], { base64: true });
      if (pdf) zip.file(`${F.safeName()}.pdf`, bytes);
      const html = flipHtml(title, files.map(f => ({ src: f.path, w: f.w, h: f.h })), texts, $("#fbBg").value, $("#fbCover").checked, pdf ? `${F.safeName()}.pdf` : null, `${F.safeName()}.pdf`, { base: $("#fbUrl").value.trim(), preview: "preview.jpg" });
      zip.file("index.html", html); zip.file(".nojekyll", "");
      download(await zip.generateAsync({ type: "blob" }), `${F.safeName()}-flipbook-site.zip`); busy(false);
      toast($("#fbUrl").value.trim() ? "Website folder saved. Put its contents at that address, and link previews will show your cover." : "Website folder saved. Add the web address next time so LinkedIn and others can show a preview image.", 7000); count("flipbook_site"); return;
    }
    const html = flipHtml(title, imgs, texts, $("#fbBg").value, $("#fbCover").checked, pdf, `${F.safeName()}.pdf`), mb = html.length / 1048576;
    download(new Blob([html], { type: "text/html" }), `${F.safeName()}-flipbook.html`); busy(false);
    toast(`Flipbook saved (${mb.toFixed(1)} MB).${mb > 16 ? " That’s large for phones: try “Balanced” or “Smaller file”." : " Open it in any browser, or put it on a website."}`, 6000); count("flipbook");
  } catch (err) { console.error(err); busy(false); toast("Couldn’t make a flipbook from this PDF."); }
};
// A 1200×630 preview card for link sharing (LinkedIn, WhatsApp, Slack and others)
async function previewCard(coverSrc, title, bg) {
  const c = document.createElement("canvas"); c.width = 1200; c.height = 630; const x = c.getContext("2d"), ink = inkFor(bg);
  x.fillStyle = bg; x.fillRect(0, 0, 1200, 630);
  const img = new Image(); img.src = coverSrc; await img.decode(); const h = 540, w = h * img.naturalWidth / img.naturalHeight;
  x.save(); x.shadowColor = "rgba(0,0,0,.35)"; x.shadowBlur = 30; x.shadowOffsetY = 12; x.fillStyle = "#fff"; x.fillRect(60, 45, w, h); x.restore(); x.drawImage(img, 60, 45, w, h);
  const tx = 60 + w + 56, maxW = 1200 - tx - 60; x.fillStyle = ink.fg; x.font = "700 46px system-ui, -apple-system, Segoe UI, sans-serif";
  const words = title.split(/\s+/), lines = []; let line = ""; for (const wd of words) { const tst = line ? line + " " + wd : wd; if (x.measureText(tst).width > maxW && line) { lines.push(line); line = wd; } else line = tst; } if (line) lines.push(line);
  const shown = lines.slice(0, 6); let y = 315 - (shown.length * 58) / 2 + 40; shown.forEach(l => { x.fillText(l, tx, y); y += 58; });
  x.font = "600 24px system-ui, -apple-system, Segoe UI, sans-serif"; x.globalAlpha = .8; x.fillText("Read the flipbook  →", tx, Math.min(585, y + 30)); x.globalAlpha = 1;
  return c.toDataURL("image/jpeg", .9);
}
// Readable header text on any background colour
function inkFor(hex) { const n = parseInt(hex.replace("#", ""), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255, l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; return l > .6 ? { fg: "#16191D", btn: "rgba(0,0,0,.08)", hov: "rgba(0,0,0,.16)" } : { fg: "#FFFFFF", btn: "rgba(255,255,255,.14)", hov: "rgba(255,255,255,.26)" }; }
const FLIP_JS = [
"var panel=document.getElementById('panel'),D=window.FLIP,P=D.pages,T=D.texts||[],book=document.getElementById('book'),main=document.getElementById('main'),spreads=[],s=0,busy=false,queued=0,zoomed=false;",
"function two(){return innerWidth>900&&innerWidth/innerHeight>1.1}",
"function build(){spreads=[];if(two()){var i=0;if(D.cover){spreads.push([null,0]);i=1}for(;i<P.length;i+=2)spreads.push([i,i+1<P.length?i+1:null])}else P.forEach(function(_,i){spreads.push([i])})}",
"function size(){var w2=two(),avW=innerWidth-(zoomed?40:140),avH=innerHeight-80,w=Math.min(avW/(w2?2:1),avH/D.ratio);if(zoomed)w=Math.max(w*2,Math.min(innerWidth-40,1400)/(w2?2:1));book.style.setProperty('--w',w+'px')}",
"function esc(t){return String(t).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}",
"function pg(i){if(i==null)return '<div class=\"pg empty\" aria-hidden=\"true\"></div>';return '<div class=\"pg\" role=\"img\" aria-label=\"Page '+(i+1)+'\" style=\"background-image:url('+P[i]+')\"><span class=\"sr\">'+esc(T[i]||'')+'</span></div>'}",
"function show(){book.innerHTML=spreads[s].map(pg).join('');size();var sp=spreads[s].filter(function(x){return x!=null}).map(function(x){return x+1});document.getElementById('count').textContent=(sp.length>1?sp.join('–'):sp[0])+' / '+P.length;document.getElementById('prev').disabled=s===0;document.getElementById('next').disabled=s===spreads.length-1;try{history.replaceState(null,'','#page-'+sp[0])}catch(e){}}",
"function go(t){if(t<0||t>=spreads.length||t===s)return;s=t;show()}",
"function turn(dir){if(busy){queued=dir;return}var t=s+dir;if(t<0||t>=spreads.length)return;if(zoomed||matchMedia('(prefers-reduced-motion:reduce)').matches){s=t;return show()}",
" busy=true;var w2=two(),cur=spreads[s],nxt=spreads[t],leaf=document.createElement('div');leaf.className='leaf';var W=parseFloat(getComputedStyle(book).getPropertyValue('--w'));",
" var front=dir>0?(w2?cur[1]:cur[0]):cur[0],back=dir>0?nxt[0]:(w2?nxt[1]:nxt[0]);",
" leaf.innerHTML='<div class=\"front\"'+(front!=null?' style=\"background-image:url('+P[front]+')\"':'')+'></div><div class=\"back\"'+(back!=null?' style=\"background-image:url('+P[back]+')\"':'')+'></div>';",
" leaf.style.setProperty('--w',W+'px');leaf.style.left=(w2&&dir>0?W:0)+'px';leaf.style.transformOrigin=(dir>0?'left':'right')+' center';",
" var pages=book.children;if(w2){if(dir>0)pages[1].outerHTML=pg(nxt[1]);else pages[0].outerHTML=pg(nxt[0])}else pages[0].outerHTML=pg(nxt[0]);",
" book.appendChild(leaf);requestAnimationFrame(function(){requestAnimationFrame(function(){leaf.style.transform='rotateY('+(dir>0?-180:180)+'deg)'})});",
" var done=false,fin=function(){if(done)return;done=true;s=t;busy=false;show();if(queued){var q=queued;queued=0;turn(q)}};leaf.addEventListener('transitionend',fin,{once:true});setTimeout(fin,900)}",
"function pageFromHash(){var m=/^#page-(\\d+)$/.exec(location.hash);if(!m)return false;var n=Math.max(1,Math.min(P.length,+m[1]))-1;for(var i=0;i<spreads.length;i++)if(spreads[i].indexOf(n)>=0){if(i!==s){s=i;show()}return true}return false}",
"document.getElementById('next').onclick=function(){turn(1)};document.getElementById('prev').onclick=function(){turn(-1)};",
"addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){closePanel();document.getElementById('search').focus();return}if(/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();turn(1)}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();turn(-1)}if(e.key==='Home')go(0);if(e.key==='End')go(spreads.length-1);if(e.key==='Escape'){closePanel();if(zoomed)toggleZoom()}});",
"var sx=null;addEventListener('touchstart',function(e){sx=zoomed?null:e.touches[0].clientX},{passive:true});addEventListener('touchend',function(e){if(sx==null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)turn(d<0?1:-1);sx=null});",
"book.addEventListener('click',function(e){if(zoomed)return;var r=book.getBoundingClientRect(),x=e.clientX-r.left;if(x>r.width*.6)turn(1);else if(x<r.width*.4)turn(-1)});",
"function toggleZoom(){zoomed=!zoomed;document.body.classList.toggle('zoomed',zoomed);var z=document.getElementById('zoom');z.setAttribute('aria-pressed',zoomed);z.textContent=zoomed?'Zoom out':'Zoom';size();if(zoomed)main.scrollTo({left:(main.scrollWidth-main.clientWidth)/2,top:0})}",
"document.getElementById('zoom').onclick=toggleZoom;",
"var fs=document.getElementById('fs');if(!document.documentElement.requestFullscreen)fs.hidden=true;else fs.onclick=function(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()};",
"function closePanel(){panel.hidden=true}",
"function openPages(){panel.innerHTML='<div class=\"ph\"><b>Go to a page</b><button id=\"pclose\" aria-label=\"Close\">✕</button></div><div class=\"grid\">'+P.map(function(src,i){return '<button class=\"th\" data-p=\"'+i+'\" aria-label=\"Page '+(i+1)+'\"><span style=\"background-image:url('+src+')\"></span>'+(i+1)+'</button>'}).join('')+'</div>';panel.hidden=false;bindPanel()}",
"function openSearch(){panel.innerHTML='<div class=\"ph\"><input id=\"q\" type=\"search\" placeholder=\"Find in this book\" aria-label=\"Find in this book\"><button id=\"pclose\" aria-label=\"Close\">✕</button></div><div id=\"res\" class=\"res\" aria-live=\"polite\"></div>';panel.hidden=false;bindPanel();var q=document.getElementById('q');q.focus();q.oninput=function(){var v=q.value.trim().toLowerCase(),out=[];if(v.length>1)T.forEach(function(t,i){var k=t.toLowerCase().indexOf(v);if(k>=0)out.push('<button class=\"hit\" data-p=\"'+i+'\"><b>Page '+(i+1)+'</b> '+esc(t.slice(Math.max(0,k-50),k))+'<mark>'+esc(t.substr(k,v.length))+'</mark>'+esc(t.slice(k+v.length,k+v.length+70))+'</button>')});document.getElementById('res').innerHTML=v.length>1?(out.length?out.join(''):'<p>No matches.</p>'):''}}",
"function bindPanel(){document.getElementById('pclose').onclick=closePanel;panel.onclick=function(e){var b=e.target.closest('[data-p]');if(!b)return;var n=+b.dataset.p;for(var i=0;i<spreads.length;i++)if(spreads[i].indexOf(n)>=0)go(i);closePanel()}}",
"document.getElementById('count').onclick=openPages;var sb=document.getElementById('search');if(T.some(function(t){return t}))sb.onclick=openSearch;else sb.hidden=true;",
"var last=two();addEventListener('resize',function(){if(two()!==last){last=two();var page=spreads[s].find(function(x){return x!=null});build();s=Math.max(0,spreads.findIndex(function(sp){return sp.indexOf(page)>=0}));show()}else size()});",
"addEventListener('hashchange',pageFromHash);build();var start=/^#page-(\\d+)$/.exec(location.hash);if(start){s=-1;if(!pageFromHash()){s=0;show()}}else show();"
].join("\n");
function flipHtml(title, imgs, texts, bg, cover, pdf, pdfName, site = {}) {
  const ratio = (imgs[0].h / imgs[0].w).toFixed(4), t = esc(title), ink = inkFor(bg), data = JSON.stringify({ pages: imgs.map(i => i.src), texts, cover, ratio: +ratio }).replace(/</g, "\\u003c");
  const desc = esc(site.description || (texts.find(x => x && x.length > 60) || "").slice(0, 160)), base = site.base ? site.base.replace(/\/?$/, "/") : "";
  const og = site.preview ? `<meta property="og:image" content="${esc(base + site.preview)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${t}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(base + site.preview)}">` : "";
  const canon = base ? `<link rel="canonical" href="${esc(base)}"><meta property="og:url" content="${esc(base)}">` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t}</title>
<meta name="description" content="${desc}"><meta property="og:title" content="${t}"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${desc}">${og}${canon}
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%;background:${bg};color:${ink.fg};font:15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}
[hidden]{display:none!important}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
header{display:flex;align-items:center;gap:.5rem;padding:.55rem .9rem;background:rgba(0,0,0,.18)}header h1{font-size:1rem;margin:0;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
button,a.btn{font:inherit;color:${ink.fg};background:${ink.btn};border:0;border-radius:8px;height:36px;min-width:36px;padding:0 .75rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;white-space:nowrap}
button:hover,a.btn:hover{background:${ink.hov}}button:disabled{opacity:.35;cursor:default}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #F6C744;outline-offset:2px}
#count{font-variant-numeric:tabular-nums}
main{position:absolute;inset:52px 0 0;display:grid;place-items:center;perspective:2400px;overflow:hidden}
body.zoomed main{overflow:auto;place-items:start center;padding:20px}
.book{position:relative;display:flex;box-shadow:0 30px 60px -25px rgba(0,0,0,.6)}
.pg{position:relative;background:#fff center/contain no-repeat;width:var(--w);height:calc(var(--w)*${ratio})}.pg.empty{background:transparent}
.book .pg:first-child:not(:last-child):not(.empty){box-shadow:inset -18px 0 22px -16px rgba(0,0,0,.35)}.book .pg+.pg{box-shadow:inset 18px 0 22px -16px rgba(0,0,0,.35)}
.leaf{position:absolute;top:0;width:var(--w);height:calc(var(--w)*${ratio});transform-style:preserve-3d;transition:transform .7s cubic-bezier(.4,.1,.2,1);z-index:5}
.leaf>div{position:absolute;inset:0;background:#fff center/contain no-repeat;backface-visibility:hidden}.leaf .back{transform:rotateY(180deg)}
.nav{position:fixed;top:50%;transform:translateY(-50%);width:50px;height:50px;border-radius:50%;font-size:1.6rem;z-index:9;justify-content:center;padding:0}.prev{left:12px}.next{right:12px}
#panel{position:fixed;top:56px;right:12px;width:min(420px,calc(100vw - 24px));max-height:calc(100vh - 72px);overflow:auto;background:#fff;color:#16191D;border-radius:14px;box-shadow:0 20px 50px -20px rgba(0,0,0,.6);z-index:20;padding:.6rem}
#panel button{color:#16191D;background:#EDF0F3}.ph{display:flex;gap:.5rem;align-items:center;justify-content:space-between;margin-bottom:.5rem}.ph input{flex:1;font:inherit;padding:.5rem .6rem;border:2px solid #DDE1E6;border-radius:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:.5rem}.th{flex-direction:column;height:auto!important;padding:.35rem!important;gap:.25rem;font-size:.8rem}.th span{display:block;width:100%;aspect-ratio:1/${ratio};background:#fff center/contain no-repeat;border-radius:4px}
.res{display:grid;gap:.35rem}.hit{display:block!important;height:auto!important;text-align:left;padding:.5rem .6rem!important;font-size:.85rem;line-height:1.4;white-space:normal!important}mark{background:#F6C744}
@media (max-width:600px){header h1{font-size:.9rem}.hide-s{display:none}.nav{width:42px;height:42px;top:auto;bottom:14px;transform:none}}
@media (prefers-reduced-motion:reduce){.leaf{transition:none}}
</style></head><body>
<header><h1>${t}</h1><button id="count" title="Go to a page" aria-label="Go to a page"></button><button id="search" aria-label="Find in this book">Find</button><button id="zoom" aria-pressed="false">Zoom</button>${pdf ? `<a class="btn hide-s" href="${pdf}" download="${esc(pdfName || "document.pdf")}">Download PDF</a>` : ""}<button id="fs" class="hide-s">Full screen</button></header>
<main id="main"><div class="book" id="book" aria-live="polite"></div></main>
<button class="nav prev" id="prev" aria-label="Previous page">‹</button><button class="nav next" id="next" aria-label="Next page">›</button>
<div id="panel" hidden role="dialog" aria-label="Pages"></div>
<script>window.FLIP=${data};<\/script><script>${FLIP_JS}<\/script></body></html>`;
}

/* ============ 4. Text recognition (OCR) ============ */
const TESS = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
let tessLoad = null;
const loadTess = () => tessLoad ||= new Promise((res, rej) => { const s = document.createElement("script"); s.src = TESS; s.onload = res; s.onerror = () => { tessLoad = null; rej(new Error("load")); }; document.head.appendChild(s); });
function wordsFrom(data) {
  if (data.words?.length) return data.words;
  const out = []; for (const b of data.blocks || []) for (const p of b.paragraphs || []) for (const l of p.lines || []) for (const w of l.words || []) out.push(w); return out;
}
async function recognise(asPdf) {
  if (!F.hasDoc()) return toast("Open a PDF or image first.");
  const lang = $("#ocrLang").value, latin = !["ara", "chi_sim"].includes(lang);
  if (asPdf && !latin) return toast("For Arabic and Chinese, use “Get the text as a file”. Searchable PDFs support Latin-script languages for now.", 5000);
  const bar = $("#ocrBar"), wrap = $("#ocrBarWrap"); let worker = null;
  try {
    busy("Getting text recognition ready (first time only)", 3); await loadTess();
    worker = await window.Tesseract.createWorker(lang, 1, { logger: m => { if (m.status === "loading language traineddata" || m.status === "loading tesseract core") busy(`Downloading ${m.status.includes("core") ? "the engine" : "language data"}…`, Math.round((m.progress || 0) * 100)); } });
    const bytes = await F.buildPdf(), doc = await pdfjsLib.getDocument({ data: bytes.slice() }).promise, out = asPdf ? await PDFDocument.load(bytes, { ignoreEncryption: true }) : null;
    const font = out ? await out.embedFont(StandardFonts.Helvetica) : null, texts = []; let done = 0, skipped = 0;
    wrap.hidden = false;
    for (let i = 1; i <= doc.numPages; i++) {
      const pg = await doc.getPage(i);
      if ($("#ocrSkip").checked) { const tc = await pg.getTextContent(); if (tc.items.some(it => it.str && it.str.trim())) { skipped++; texts.push(`--- Page ${i} (already had text) ---\n${tc.items.map(it => it.str).join(" ")}`); continue; } }
      busy(`Reading page ${i} of ${doc.numPages}`, (i - 1) / doc.numPages * 100); bar.style.width = `${(i - 1) / doc.numPages * 100}%`;
      const base = pg.getViewport({ scale: 1 }), scale = Math.min(3, 2200 / Math.max(base.width, base.height)), vp = pg.getViewport({ scale }), c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); await pg.render({ canvasContext: x, viewport: vp }).promise;
      const { data } = await worker.recognize(c, {}, { text: true, blocks: true }); texts.push(`--- Page ${i} ---\n${(data.text || "").trim()}`);
      if (out) {
        const page = out.getPage(i - 1), P = placer(page), k = P.vw / c.width;
        for (const w of wordsFrom(data)) {
          const txt = (w.text || "").replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "").trim(); if (!txt || (w.confidence ?? 100) < 35) continue;
          const bw = (w.bbox.x1 - w.bbox.x0) * k, bh = (w.bbox.y1 - w.bbox.y0) * k; let size = Math.max(2, bh * .92); const tw = font.widthOfTextAtSize(txt, size); if (tw > bw && tw > 0) size *= bw / tw;
          const vx = w.bbox.x0 * k, vy = P.vh - w.bbox.y1 * k + bh * .18, [ux, uy] = P.map(vx, vy);
          page.drawText(txt, { x: ux, y: uy, size, font, opacity: 0, rotate: P.rot });
        }
      }
      done++; c.width = c.height = 0;
    }
    doc.destroy(); await worker.terminate(); worker = null; bar.style.width = "100%"; busy(false);
    if (!done && skipped) { wrap.hidden = true; return toast("Every page already has text, so there was nothing to recognise. Untick “Skip pages that already have text” to read them anyway.", 5500); }
    if (out) { download(new Blob([await out.save()], { type: "application/pdf" }), `${F.safeName()}-searchable.pdf`); toast(`Done: ${done} page${done > 1 ? "s" : ""} made searchable${skipped ? `, ${skipped} already had text` : ""}`, 4000); }
    else { download(new Blob([texts.join("\n\n")], { type: "text/plain;charset=utf-8" }), `${F.safeName()}-text.txt`); toast("Text saved"); }
    count("ocr"); setTimeout(() => (wrap.hidden = true), 1500);
  } catch (err) { console.error(err); busy(false); wrap.hidden = true; try { await worker?.terminate(); } catch {} toast(err.message === "load" ? "Text recognition needs an internet connection the first time, to download the engine." : "Couldn’t read the text on these pages.", 5000); }
}
$("#ocrPdf").onclick = () => recognise(true);
$("#ocrTxt").onclick = () => recognise(false);

/* ============ 5. Classroom tools (Kami-style): read aloud, paper pages, voice notes ============ */
// Read aloud with the browser's own speech voices
const synth = window.speechSynthesis;
function fillVoices() { if (!synth) return; const vs = synth.getVoices(), sel = $("#raVoice"), prev = sel.value; sel.innerHTML = vs.map((v, i) => `<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join("") || "<option>Default voice</option>"; const en = vs.findIndex(v => /^en(-|_)GB/i.test(v.lang)); sel.value = prev || String(en >= 0 ? en : 0); }
if (synth) { fillVoices(); synth.onvoiceschanged = fillVoices; } else { $("#raPlay").disabled = true; $("#raNow").textContent = "This browser can’t read aloud."; }
let raQueue = [], raStop = false;
$("#raPlay").onclick = async () => {
  if (!synth) return; if (synth.paused) return synth.resume(); if (!F.hasDoc()) return toast("Open a PDF first.");
  synth.cancel(); raStop = false; busy("Getting the text", 30);
  try {
    const doc = await pdfjsLib.getDocument({ data: (await F.buildPdf(undefined, { decorate: false })).slice() }).promise, from = Math.max(1, Math.min(doc.numPages, +$("#raFrom").value || 1)); raQueue = [];
    for (let i = from; i <= doc.numPages; i++) { const tc = await (await doc.getPage(i)).getTextContent(), text = tc.items.map(t => t.str + (t.hasEOL ? " " : "")).join("").replace(/\s+/g, " ").trim(); (text.match(/[^.!?]+[.!?]*\s*/g) || []).forEach(s => s.trim() && raQueue.push({ page: i, s: s.trim() })); }
    doc.destroy(); busy(false);
    if (!raQueue.length) return toast("No readable text. If this is a scan, use “Read text” first.", 4500);
    const voice = synth.getVoices()[+$("#raVoice").value], rate = +$("#raRate").value;
    const speakNext = () => { if (raStop || !raQueue.length) { $("#raNow").textContent = raStop ? "" : "Finished reading."; return; } const { page, s } = raQueue.shift(), u = new SpeechSynthesisUtterance(s); if (voice) u.voice = voice; u.rate = rate; u.onend = speakNext; u.onerror = speakNext; $("#raNow").innerHTML = `<b>Page ${page}:</b> ${esc(s)}`; synth.speak(u); };
    speakNext(); count("read_aloud");
  } catch (err) { console.error(err); busy(false); toast("Couldn’t read this document aloud."); }
};
$("#raPause").onclick = () => synth?.speaking && (synth.paused ? synth.resume() : synth.pause());
$("#raStop").onclick = () => { raStop = true; raQueue = []; synth?.cancel(); $("#raNow").textContent = ""; };

// Paper pages drawn as real vector lines, so they print crisply
$("#ppAdd").onclick = async () => {
  const type = $("#ppType").value, [W, H] = $("#ppSize").value === "letter" ? [612, 792] : [595.28, 841.89], n = Math.max(1, Math.min(30, +$("#ppCount").value || 1)), mm = 72 / 25.4;
  const doc = await PDFDocument.create(), light = rgb(.62, .74, .86), mid = rgb(.45, .58, .72), red = rgb(.86, .45, .45), m = 15 * mm;
  for (let k = 0; k < n; k++) {
    const p = doc.addPage([W, H]), line = (x1, y1, x2, y2, c = light, w = .6, dash) => p.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, color: c, thickness: w, dashArray: dash });
    if (type === "lined" || type === "narrow") { const gap = (type === "lined" ? 8.7 : 7.1) * mm; for (let y = H - 30 * mm; y > m; y -= gap) line(m, y, W - m, y); line(m + 18 * mm, H - m, m + 18 * mm, m, red, .8); }
    if (type === "handwriting") { const gap = 22 * mm; for (let y = H - 30 * mm; y > m + 10 * mm; y -= gap) { line(m, y, W - m, y, mid, .8); line(m, y - 5 * mm, W - m, y - 5 * mm, light, .5, [3, 3]); line(m, y - 10 * mm, W - m, y - 10 * mm, mid, .8); line(m, y - 14 * mm, W - m, y - 14 * mm, light, .4); } }
    if (type === "grid" || type === "graph") { const step = type === "grid" ? 5 * mm : 2 * mm; let i = 0; for (let x = m; x <= W - m + .1; x += step, i++) line(x, m, x, H - m, type === "graph" && i % 5 === 0 ? mid : light, type === "graph" && i % 5 === 0 ? .7 : .35); i = 0; for (let y = m; y <= H - m + .1; y += step, i++) line(m, y, W - m, y, type === "graph" && i % 5 === 0 ? mid : light, type === "graph" && i % 5 === 0 ? .7 : .35); }
    if (type === "dots") for (let x = m; x <= W - m; x += 5 * mm) for (let y = m; y <= H - m; y += 5 * mm) p.drawCircle({ x, y, size: .7, color: mid });
    if (type === "iso") { const s = 6 * mm, h = s * Math.sqrt(3) / 2; let r = 0; for (let y = m; y <= H - m; y += h, r++) for (let x = m + (r % 2 ? s / 2 : 0); x <= W - m; x += s) p.drawCircle({ x, y, size: .7, color: mid }); }
    if (type === "cornell") { line(m, H - 35 * mm, W - m, H - 35 * mm, mid, 1); line(m + 55 * mm, H - 35 * mm, m + 55 * mm, 55 * mm, mid, 1); line(m, 55 * mm, W - m, 55 * mm, mid, 1); for (let y = H - 35 * mm - 8 * mm; y > 55 * mm; y -= 8 * mm) line(m + 55 * mm, y, W - m, y); const f = await doc.embedFont(StandardFonts.Helvetica); [["Cues and questions", m + 2, H - 41 * mm], ["Notes", m + 57 * mm, H - 41 * mm], ["Summary", m + 2, 50 * mm]].forEach(([t, x, y]) => p.drawText(t, { x, y, size: 9, font: f, color: mid })); }
    if (type === "music") { for (let top = H - 30 * mm; top > m + 12 * mm; top -= 26 * mm) for (let i = 0; i < 5; i++) line(m, top - i * 2.2 * mm, W - m, top - i * 2.2 * mm, rgb(.35, .38, .42), .6); }
  }
  const file = new File([await doc.save()], `${type}-paper.pdf`, { type: "application/pdf" });
  if (F.hasDoc()) await F.addFiles([file], F.insertIndex()); else await F.addFiles([file]);
  toast(`Added ${n} page${n > 1 ? "s" : ""} of ${$("#ppType").selectedOptions[0].textContent.toLowerCase()}`); count("paper_pages");
};

// Voice notes, stored inside the PDF as attachments
const notes = []; let rec = null, chunks = [];
$("#vnRec").onclick = async () => {
  try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); chunks = []; rec = new MediaRecorder(stream); rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); const type = (rec.mimeType || "audio/webm").split(";")[0], blob = new Blob(chunks, { type }); notes.push({ blob, type, name: `voice-note-${notes.length + 1}.${type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm"}`, url: URL.createObjectURL(blob) }); showNotes(); };
    rec.start(); $("#vnRec").disabled = true; $("#vnStop").disabled = false; $("#vnRec").textContent = "Recording…"; }
  catch { toast("Allow microphone access to record a voice note."); }
};
$("#vnStop").onclick = () => { rec?.stop(); $("#vnRec").disabled = false; $("#vnStop").disabled = true; $("#vnRec").textContent = "Record another"; };
function showNotes() { $("#vnList").innerHTML = notes.map((n, i) => `<div style="display:grid;grid-template-columns:1fr auto;gap:.4rem;align-items:center"><audio controls src="${n.url}" style="width:100%"></audio><button class="btn" data-vndel="${i}" aria-label="Remove voice note ${i + 1}">✕</button></div>`).join(""); $("#vnSave").disabled = !notes.length; }
$("#vnList").addEventListener("click", e => { const b = e.target.closest("[data-vndel]"); if (!b) return; notes.splice(+b.dataset.vndel, 1); showNotes(); });
$("#vnSave").onclick = async () => {
  if (!F.hasDoc()) return toast("Open a PDF first.");
  try { busy("Adding voice notes", 50); const doc = await PDFDocument.load(await F.buildPdf(), { ignoreEncryption: true });
    for (const n of notes) await doc.attach(new Uint8Array(await n.blob.arrayBuffer()), n.name, { mimeType: n.type, description: "Voice note", creationDate: new Date() });
    if ($("#vnLabel").checked) { const p = doc.getPage(0), P = placer(p), f = await doc.embedFont(StandardFonts.HelveticaBold), t = `${notes.length} voice note${notes.length > 1 ? "s" : ""} attached: open the attachments panel to listen`, sz = 8, w = f.widthOfTextAtSize(t, sz), [x, y] = P.map(P.vw - w - 22, P.vh - 22); p.drawRectangle({ x: x - 4, y: y - 4, width: w + 8, height: sz + 8, color: rgb(1, .96, .75), rotate: P.rot }); p.drawText(t, { x, y, size: sz, font: f, color: rgb(.25, .2, .05), rotate: P.rot }); }
    download(new Blob([await doc.save()], { type: "application/pdf" }), `${F.safeName()}-with-voice-notes.pdf`); busy(false); toast("Saved with voice notes"); count("voice_notes"); }
  catch (err) { console.error(err); busy(false); toast("Couldn’t add the voice notes to this PDF."); }
};
