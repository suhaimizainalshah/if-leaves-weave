/* If Leaves Weave: small shared helpers for the standalone tools. Everything is kept in this browser. */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const store = { get(k, d) { try { const v = localStorage.getItem("ilw-" + k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem("ilw-" + k, JSON.stringify(v)); } catch { toast("This browser’s storage is full: download a copy to keep your work."); } } };
function toast(t, ms = 2600) { let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); } el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, ms); }
function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const csvCell = v => { let s = String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };  // also guards against spreadsheet formula injection
const toCSV = rows => "\ufeff" + rows.map(r => r.map(csvCell).join(",")).join("\r\n");
function parseCSV(t) { const rows = []; let row = [], f = "", q = false; t = t.replace(/^\ufeff/, "");
  for (let i = 0; i < t.length; i++) { const c = t[i]; if (q) { if (c === '"' && t[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true; else if (c === "," || c === "\t") { row.push(f); f = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; } else f += c; }
  if (f || row.length) { row.push(f); rows.push(row); } return rows.filter(r => r.some(x => x.trim())); }
async function svgToPng(svg, scale = 2) { const s = new XMLSerializer().serializeToString(svg), img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  await img.decode(); const vb = svg.viewBox.baseVal, w = vb?.width || svg.clientWidth, h = vb?.height || svg.clientHeight, c = document.createElement("canvas"); c.width = w * scale; c.height = h * scale;
  const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); return new Promise(r => c.toBlob(r, "image/png")); }
function openJSON(kind, cb) { const i = document.createElement("input"); i.type = "file"; i.accept = ".json,application/json"; i.onchange = async () => { try { const j = JSON.parse(await i.files[0].text()); if (j.kind !== kind) throw 0; cb(j); } catch { toast("That isn’t a file from this tool."); } }; i.click(); }
