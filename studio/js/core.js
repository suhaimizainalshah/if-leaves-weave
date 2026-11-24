/* If Leaves Weave tools core: storage, history, canvas viewport, exports and small UI helpers. No server needed. */
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, parent) { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function h(tag, attrs = {}, ...kids) { const e = document.createElement(tag); for (const k in attrs) { const v = attrs[k]; if (v == null || v === false) continue; if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else if (k === "html") e.innerHTML = v; else e.setAttribute(k, v === true ? "" : v); } for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c)); return e; }

/* ---------- Storage: IndexedDB, falling back to localStorage ---------- */
const Store = (() => {
  let db = null; const NAME = "ifleavesweave", ST = "docs";
  // copy documents saved before the rename (database "folio-studio") the first time, so nothing is lost
  const migrate = () => new Promise(res => { try { let fresh = false; const r = indexedDB.open("folio-studio"); r.onupgradeneeded = () => { fresh = true; r.transaction.abort(); }; r.onerror = () => { if (fresh) indexedDB.deleteDatabase("folio-studio"); res([]); };
    r.onsuccess = () => { const old = r.result; if (!old.objectStoreNames.contains(ST)) { old.close(); return res([]); } const q = old.transaction(ST).objectStore(ST).getAll(); q.onsuccess = () => { old.close(); res(q.result || []); }; q.onerror = () => { old.close(); res([]); }; }; } catch { res([]); } });
  const open = () => new Promise(res => { try { const r = indexedDB.open(NAME, 1); let created = false; r.onupgradeneeded = () => { created = true; r.result.createObjectStore(ST, { keyPath: "id" }); };
    r.onsuccess = async () => { db = r.result; if (created) { const olds = await migrate(); if (olds.length) await new Promise(done => { const t = db.transaction(ST, "readwrite"); olds.forEach(d => t.objectStore(ST).put(d)); t.oncomplete = done; t.onerror = done; }); } res(true); }; r.onerror = () => res(false); } catch { res(false); } });
  const tx = (mode, fn) => new Promise((res, rej) => { const t = db.transaction(ST, mode), s = t.objectStore(ST), out = fn(s); t.oncomplete = () => res(out?.result ?? out); t.onerror = () => rej(t.error); });
  const lsAll = () => { try { return JSON.parse(localStorage.getItem("ifleavesweave-docs") || "[]"); } catch { return []; } };
  return {
    ready: open(),
    async all() { await this.ready; if (!db) return lsAll(); return new Promise(res => { const r = db.transaction(ST).objectStore(ST).getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); }); },
    async put(doc) { await this.ready; if (!db) { const a = lsAll().filter(d => d.id !== doc.id); a.push(doc); try { localStorage.setItem("ifleavesweave-docs", JSON.stringify(a)); } catch { toast("Storage is full. Export your work to keep it safe.", 6000); } return; } return tx("readwrite", s => s.put(doc)); },
    async del(id) { await this.ready; if (!db) { localStorage.setItem("ifleavesweave-docs", JSON.stringify(lsAll().filter(d => d.id !== id))); return; } return tx("readwrite", s => s.delete(id)); },
  };
})();

/* ---------- History: snapshot undo/redo per document ---------- */
function History(getState, setState, onChange) {
  let past = [], future = [], last = JSON.stringify(getState()), pending = null;
  const api = {
    commit() { const now = JSON.stringify(getState()); if (now === last) return; past.push(last); if (past.length > 120) past.shift(); future = []; last = now; onChange?.(); },
    soon() { clearTimeout(pending); pending = setTimeout(() => api.commit(), 400); },
    undo() { api.commit(); if (!past.length) return false; future.push(last); last = past.pop(); setState(JSON.parse(last)); onChange?.(); return true; },
    redo() { if (!future.length) return false; past.push(last); last = future.pop(); setState(JSON.parse(last)); onChange?.(); return true; },
    reset() { past = []; future = []; last = JSON.stringify(getState()); },
    get canUndo() { return past.length > 0; }, get canRedo() { return future.length > 0; },
  };
  return api;
}

/* ---------- Canvas viewport: pan and zoom an SVG world ---------- */
function Viewport(svg, world, view, onChange) {
  const apply = () => { world.setAttribute("transform", `translate(${view.x},${view.y}) scale(${view.z})`); onChange?.(view); };
  const toWorld = (cx, cy) => { const r = svg.getBoundingClientRect(); return { x: (cx - r.left - view.x) / view.z, y: (cy - r.top - view.y) / view.z }; };
  const zoomAt = (cx, cy, f) => { const r = svg.getBoundingClientRect(), px = cx - r.left, py = cy - r.top, nz = clamp(view.z * f, .1, 5); view.x = px - (px - view.x) * nz / view.z; view.y = py - (py - view.y) * nz / view.z; view.z = nz; apply(); };
  let pan = null, space = false; const pts = new Map(); let pinch = null;
  svg.addEventListener("wheel", e => { e.preventDefault(); if (e.ctrlKey || e.metaKey) zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * .01)); else if (e.shiftKey) { view.x -= e.deltaY; apply(); } else { view.x -= e.deltaX; view.y -= e.deltaY; apply(); } }, { passive: false });
  svg.addEventListener("pointerdown", e => {
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; pan = null; return; }
    const bg = e.target === svg || e.target.dataset?.bg === "1";
    if (e.button === 1 || space || (bg && api.panOnBackground())) { pan = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; svg.setPointerCapture(e.pointerId); svg.classList.add("panning"); e.stopPropagation(); }
  }, true);
  svg.addEventListener("pointermove", e => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); zoomAt(pinch.cx, pinch.cy, d / pinch.d); pinch.d = d; return; }
    if (pan) { view.x = pan.vx + e.clientX - pan.x; view.y = pan.vy + e.clientY - pan.y; apply(); }
  });
  const end = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (pan) { pan = null; svg.classList.remove("panning"); } };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
  addEventListener("keydown", e => { if (e.code === "Space" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { space = true; svg.classList.add("can-pan"); } });
  addEventListener("keyup", e => { if (e.code === "Space") { space = false; svg.classList.remove("can-pan"); } });
  const api = {
    view, apply, toWorld, zoomAt, panOnBackground: () => true,
    zoomBy(f) { const r = svg.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, f); },
    fit(b, pad = 60) { if (!b || !isFinite(b.x)) return; const r = svg.getBoundingClientRect(); const z = clamp(Math.min((r.width - pad * 2) / Math.max(b.w, 1), (r.height - pad * 2) / Math.max(b.h, 1)), .15, 1.6); view.z = z; view.x = (r.width - b.w * z) / 2 - b.x * z; view.y = (r.height - b.h * z) / 2 - b.y * z; apply(); },
  };
  world.setAttribute("transform", `translate(${view.x},${view.y}) scale(${view.z})`); setTimeout(() => onChange?.(view), 0); // let the module finish building its zoom controls first
  return api;
}
function bboxOf(rects) { if (!rects.length) return null; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const r of rects) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + (r.w || 0)); y1 = Math.max(y1, r.y + (r.h || 0)); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; }

/* ---------- Exports ---------- */
function download(blob, name) { const a = h("a", { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); }
const fileSafe = s => (s || "ifleavesweave").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "ifleavesweave";
// Standalone SVG of the current drawing, with styles inlined so it looks the same anywhere
function svgSnapshot(svg, world, pad = 40) {
  const b = world.getBBox(), clone = world.cloneNode(true); clone.removeAttribute("transform"); clone.querySelectorAll(".ui-only").forEach(n => n.remove());
  const out = document.createElementNS(SVGNS, "svg"); out.setAttribute("xmlns", SVGNS); out.setAttribute("viewBox", `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`); out.setAttribute("width", Math.round(b.width + pad * 2)); out.setAttribute("height", Math.round(b.height + pad * 2));
  const style = document.createElementNS(SVGNS, "style"); style.textContent = SVG_EXPORT_CSS; out.append(style);
  svgEl("rect", { x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2, fill: "#ffffff" }, out); out.append(clone); return out;
}
const SVG_EXPORT_CSS = `text{font-family:"Hanken Grotesk","Segoe UI",system-ui,-apple-system,sans-serif}foreignObject div{font-family:"Hanken Grotesk",system-ui,sans-serif}`;
async function exportSVG(svg, world, name) { const s = svgSnapshot(svg, world); download(new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" }), `${fileSafe(name)}.svg`); }
async function pngBlob(svg, world, scale = 2) {
  const s = svgSnapshot(svg, world), w = +s.getAttribute("width"), hgt = +s.getAttribute("height"), url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(s)], { type: "image/svg+xml" }));
  const img = new Image(); img.src = url; await img.decode().catch(() => {}); const k = Math.min(scale, 8000 / Math.max(w, hgt)), c = h("canvas"); c.width = Math.round(w * k); c.height = Math.round(hgt * k); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.scale(k, k); x.drawImage(img, 0, 0); URL.revokeObjectURL(url);
  return new Promise(r => { try { c.toBlob(b => r(b), "image/png"); } catch { r(null); } });
}
async function exportPNG(svg, world, name, scale = 2) { const b = await pngBlob(svg, world, scale); b ? download(b, `${fileSafe(name)}.png`) : toast("Couldn’t make the image. Try SVG instead."); }
/* ---------- Hand a picture to If Leaves Weave PDF (same site, kept on this device) ---------- */
function handoffToPdf(blob, name) {
  return new Promise(res => { const r = indexedDB.open("ifleavesweave-handoff", 1); r.onupgradeneeded = () => r.result.createObjectStore("files"); r.onsuccess = () => { const t = r.result.transaction("files", "readwrite"); t.objectStore("files").put({ blob, name }, "latest"); t.oncomplete = () => res(true); t.onerror = () => res(false); }; r.onerror = () => res(false); });
}
/* ---------- Anonymous usage counts (shared with If Leaves Weave PDF; respects Do Not Track, GPC and the owner switch) ---------- */
const COUNT_NS = "ifleavesweave";
function count(key) { try { if (!/^https?:$/.test(location.protocol) || navigator.doNotTrack === "1" || navigator.globalPrivacyControl || localStorage.getItem("ifleavesweave-nocount") === "1") return; fetch(`https://abacus.jasoncameron.dev/hit/${COUNT_NS}/${key}`, { keepalive: true }).catch(() => {}); } catch {} }

/* ---------- UI helpers ---------- */
/* A message with one action, such as Undo after deleting. The action stays available for ms milliseconds. */
function toastAction(msg, label, fn, ms = 8000) {
  const t = $("#toast"); t.innerHTML = ""; const span = document.createElement("span"); span.textContent = msg; const b = document.createElement("button"); b.type = "button"; b.className = "toast-act"; b.textContent = label;
  b.onclick = () => { clearTimeout(toast.t); t.classList.remove("show"); fn(); }; t.append(span, b); t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms); setTimeout(() => b.focus({ preventScroll: true }), 50);
}
function toast(msg, ms = 3200) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms); }
function dialog({ title, body, actions = [{ label: "Close" }], wide = false }) {
  return new Promise(res => {
    const d = h("dialog", { class: "dlg" + (wide ? " wide" : ""), "aria-labelledby": "dlgT" });
    d.append(h("header", {}, h("h2", { id: "dlgT" }, title), h("button", { class: "icon", "aria-label": "Close", onclick: () => d.close("") }, "✕")));
    const content = h("div", { class: "dlg-body" }); typeof body === "string" ? content.innerHTML = body : content.append(body); d.append(content);
    const row = h("div", { class: "dlg-actions" }); actions.forEach(a => row.append(h("button", { class: "btn" + (a.primary ? " primary" : "") + (a.danger ? " danger" : ""), onclick: () => d.close(a.value ?? a.label) }, a.label))); d.append(row);
    d.addEventListener("close", () => { res({ value: d.returnValue, el: content }); d.remove(); }); document.body.append(d); d.showModal(); setTimeout(() => (content.querySelector("input,textarea,select") || row.querySelector(".primary"))?.focus(), 30);
  });
}
async function ask(title, label, value = "") { const r = await dialog({ title, body: `<label class="field"><span>${esc(label)}</span><input type="text" value="${esc(value)}"></label>`, actions: [{ label: "Cancel", value: "" }, { label: "OK", primary: true, value: "ok" }] }); return r.value === "ok" ? r.el.querySelector("input").value.trim() : null; }
async function confirmIt(title, text, yes = "Delete") { const r = await dialog({ title, body: `<p>${esc(text)}</p>`, actions: [{ label: "Cancel", value: "" }, { label: yes, danger: true, value: "yes" }] }); return r.value === "yes"; }
const PALETTE = ["#FFE08A", "#BDE5C8", "#B9DCF5", "#F7C6D0", "#D9CCF5", "#FFD2A8", "#E3E8E6", "#FFFFFF"];
const INKS = ["#1E2A2F", "#0E7C7B", "#2F6DB5", "#7A4FC2", "#C2413A", "#B86E00", "#3F7D3A", "#8A9497"];
// Inline icons (simple strokes, currentColor)
const IC = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICONS = {
  maths: IC('<path d="M18 5H7l6 7-6 7h11"/>'),
  cite: IC('<path d="M7 7h4v4c0 3-2 5-4 6"/><path d="M14 7h4v4c0 3-2 5-4 6"/>'),
  mark: IC('<path d="M5 13l4 4L19 7"/><path d="M4 20h7"/>'),
  edit: IC('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>'),
  copy: IC('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
  board: IC('<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>'),
  whiteboard: IC('<path d="M4 18c3-6 6-9 9-9s3 4 7 2"/><rect x="3" y="3" width="18" height="18" rx="3"/>'),
  mindmap: IC('<circle cx="12" cy="12" r="3"/><circle cx="4.5" cy="6" r="2"/><circle cx="19.5" cy="6" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="18.5" r="2"/><path d="M9.6 10.4 6.2 7.3M14.4 10.4l3.4-3.1M9.8 14 6.6 17.6M14.3 13.9l3.2 3.2"/>'),
  sociogram: IC('<circle cx="6" cy="7" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="12" cy="17" r="2.3"/><circle cx="19.5" cy="16" r="1.6"/><path d="m8.2 7.2 7.5-.9M7.3 9 10.8 15M16.9 8l-3.8 7M14.3 16.7l3.6-.6"/>'),
  genogram: IC('<rect x="3" y="3" width="6" height="6" rx=".6"/><circle cx="18" cy="6" r="3"/><path d="M6 9v3h12V9M12 12v4"/><rect x="9" y="16" width="6" height="5" rx=".6"/>'),
  prototype: IC('<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M9 6h6M9 10h6M9 14h3"/><path d="M11 19h2"/>'),
  plus: IC('<path d="M12 5v14M5 12h14"/>'), undo: IC('<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'), redo: IC('<path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>'),
  download: IC('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'), fit: IC('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'), zin: IC('<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-4-4"/>'), zout: IC('<circle cx="11" cy="11" r="7"/><path d="M8 11h6M20 20l-4-4"/>'),
  trash: IC('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'), menu: IC('<path d="M4 6h16M4 12h16M4 18h16"/>'), search: IC('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'), lock: IC('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  play: IC('<path d="M7 4v16l13-8z"/>'), home: IC('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>'), copy: IC('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
};
const TYPES = {
  board: { name: "Board", family: "If Leaves Weave Boards", page: "boards.html", blurb: "Plan work in Kanban, Table and Timeline views", icon: "board" },
  whiteboard: { name: "Whiteboard", family: "If Leaves Weave Canvas", page: "canvas.html", blurb: "Sticky notes, shapes and connectors on an endless canvas", icon: "whiteboard" },
  mindmap: { name: "Mind and concept map", family: "If Leaves Weave Maps", page: "maps.html", blurb: "Branch ideas fast, then link concepts with labelled relationships", icon: "mindmap" },
  sociogram: { name: "Sociogram", family: "If Leaves Weave Sociogram", page: "sociogram.html", blurb: "Map who connects with whom, with accurate network measures", icon: "sociogram" },
  maths: { name: "Maths", family: "If Leaves Weave Maths", page: "maths.html", blurb: "Write maths without code, solve and graph it, and copy it as an image, LaTeX or MathML", icon: "maths" },
  cite: { name: "Cite", family: "If Leaves Weave Cite", page: "cite.html", blurb: "Turn titles, DOIs or a PDF’s reference list into APA, Harvard, MLA, Chicago, IEEE or Vancouver", icon: "cite" },
  questions: { name: "Question bank", family: "If Leaves Weave Question bank", page: "questions.html", blurb: "Turn question papers and answer keys into a question bank spreadsheet", icon: "mark" },
  marking: { name: "Mark", family: "If Leaves Weave Mark", page: "marking.html", blurb: "Mark work with ticks, comments, marks and audio feedback", icon: "mark" },
  genogram: { name: "Genogram", family: "If Leaves Weave Genogram", page: "genogram.html", blurb: "Family structure and relationships with standard symbols", icon: "genogram" },
  prototype: { name: "Prototype", family: "If Leaves Weave Prototype", page: "prototype.html", blurb: "Clickable app screens you can play and export", icon: "prototype" },
};
const Modules = {};
/* ---------- Text wrapping for SVG (real <text>, so image exports work in every browser) ---------- */
const FONT_STACK = '"Hanken Grotesk","Segoe UI",system-ui,-apple-system,sans-serif';
const _mctx = document.createElement("canvas").getContext("2d");
function wrapLines(text, maxW, size = 14, weight = 500) {
  _mctx.font = `${weight} ${size}px ${FONT_STACK}`; const out = [];
  for (const para of String(text ?? "").split("\n")) {
    const words = para.split(/(\s+)/).filter(w => w.length); let line = "";
    if (!words.length) { out.push(""); continue; }
    for (const w of words) { const test = line + w; if (_mctx.measureText(test.trimEnd()).width <= maxW || !line.trim()) { if (!line.trim() && _mctx.measureText(w).width > maxW) { let chunk = ""; for (const ch of w) { if (_mctx.measureText(chunk + ch).width > maxW && chunk) { out.push(chunk); chunk = ""; } chunk += ch; } line = chunk; } else line = test; } else { out.push(line.trimEnd()); line = w.trimStart(); } }
    out.push(line.trimEnd());
  }
  return out;
}
function svgText(parent, text, x, y, { size = 14, weight = 500, maxW = 200, anchor = "middle", lineH = 1.3, fill = "currentColor", maxLines = 99, valign = "middle", cls } = {}) {
  let lines = wrapLines(text, maxW, size, weight); if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S{0,3}$/, "") + "…"; }
  const t = svgEl("text", { x, "text-anchor": anchor, "font-size": size, "font-weight": weight, fill, class: cls }, parent), total = lines.length * size * lineH;
  const top = valign === "middle" ? y - total / 2 + size * .82 : valign === "top" ? y + size * .82 : y - total + size * .82;
  lines.forEach((l, i) => { const ts = svgEl("tspan", { x, y: top + i * size * lineH }, t); ts.textContent = l || " "; });
  return { el: t, height: total, lines: lines.length };
}
