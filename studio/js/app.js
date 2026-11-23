/* If Leaves Weave tools app shell: home screen, documents rail, top bar, autosave, undo and file import or export. */
"use strict";
const App = (() => {
  let docs = [], current = null, inst = null, hist = null, saveT = 0;
  const body = $("#body"), topbar = $("#topbar"), TOOL = window.IFLEAVES_TOOL || "board", T = TYPES[TOOL];
  $("#searchIc").innerHTML = ICONS.search;
  try { const th = localStorage.getItem("ifleavesweave-theme"); if (th) document.documentElement.dataset.theme = th; } catch {}
  document.title = T.family;
  try { if (!sessionStorage.getItem("ifleavesweave-visit-" + TOOL)) { sessionStorage.setItem("ifleavesweave-visit-" + TOOL, "1"); count(`${TOOL}_visits`); } } catch {}
  /* ---------- the If Leaves Weave family switcher ---------- */
  const FAMILY = [["home.html", "All tools", "The If Leaves Weave home page", ICONS.home], ["index.html", "If Leaves Weave PDF", "Edit, sign, convert and redact PDFs", IC('<path d="M7 3h8l5 5v13H7z"/><path d="M15 3v5h5"/><path d="M10 14h7M10 17h5"/>')], ...Object.entries(TYPES).map(([k, t]) => [t.page, t.family, t.blurb, ICONS[t.icon], k])];
  $("#brandName").textContent = T.family.replace("If Leaves Weave ", ""); $("#famBtn").onclick = e => {
    $$(".pop").forEach(p => p.remove()); const p = h("div", { class: "pop", role: "menu", "aria-label": "If Leaves Weave tools" });
    FAMILY.forEach(([href, name, blurb, icon, k]) => { const a = h("a", { class: "famlink", href, role: "menuitem", "aria-current": k === TOOL ? "page" : null }); a.innerHTML = `${icon}<span>${esc(name)}<small>${esc(blurb)}</small></span>`; p.append(a); });
    document.body.append(p); const r = e.currentTarget.getBoundingClientRect(); p.style.top = `${r.bottom + 6}px`; p.style.left = `${r.left}px`; p.querySelector("a")?.focus();
    setTimeout(() => { const off = ev => { if (!p.contains(ev.target)) { p.remove(); removeEventListener("pointerdown", off, true); } }; addEventListener("pointerdown", off, true); });
    p.addEventListener("keydown", ev => { const as = [...p.querySelectorAll("a")], i = as.indexOf(document.activeElement); if (ev.key === "Escape") { p.remove(); e.currentTarget?.focus?.(); } if (ev.key === "ArrowDown") { ev.preventDefault(); as[(i + 1) % as.length].focus(); } if (ev.key === "ArrowUp") { ev.preventDefault(); as[(i - 1 + as.length) % as.length].focus(); } });
  };

  /* ---------- documents ---------- */
  const sorted = () => [...docs].sort((a, b) => b.updated - a.updated);
  function renderRail() {
    const q = $("#search").value.trim().toLowerCase(), list = $("#doclist"); list.innerHTML = "";
    const groups = [TOOL].map(t => [t, sorted().filter(d => d.type === t && (!q || d.title.toLowerCase().includes(q)))]).filter(([, l]) => l.length);
    if (!groups.length) list.append(h("p", { class: "note", style: "padding:.6rem" }, q ? "No matches." : "Nothing here yet. Choose New to start."));
    for (const [t, l] of groups) { list.append(h("h3", {}, `Your ${TYPES[t].name.toLowerCase()}s`.replace("mind and concept maps", "maps").replace("Your mind and concept maps", "Your maps"))); l.forEach(d => {
      const row = h("div", { class: "docrow" + (current?.id === d.id ? " on" : "") });
      const b = h("button", { "aria-current": String(current?.id === d.id), onclick: () => open(d.id), title: `${d.title} (F2 to rename, Delete to remove)` }); b.innerHTML = ICONS[TYPES[d.type].icon] + `<span>${esc(d.title)}</span>`;
      b.addEventListener("keydown", e => { if (e.key === "F2") { e.preventDefault(); renameDoc(d); } else if (e.key === "Delete") { e.preventDefault(); deleteDoc(d); } });
      const m = h("button", { class: "docmenu", "aria-label": `Actions for ${d.title}`, title: "Rename, duplicate, download or delete", onclick: e => { e.stopPropagation(); docMenu(e.currentTarget, d); } }); m.innerHTML = DOTS;
      row.append(b, m); list.append(row); }); }
  }
  async function persist(doc) { doc.updated = Date.now(); await Store.put(doc); renderRail(); }
  function changed() { if (!current) return; hist?.soon(); clearTimeout(saveT); saveT = setTimeout(() => persist(current), 500); syncUndo(); }
  async function create(type, tpl) {
    const M = Modules[type], data = tpl ? tpl.data() : M.blank(), doc = { id: uid(), type, title: tpl?.title || `Untitled ${TYPES[type].name.toLowerCase()}`, created: Date.now(), updated: Date.now(), data };
    docs.push(doc); await persist(doc); open(doc.id); toast(tpl ? `${tpl.title} created` : `${TYPES[type].name} created`); count(`${type}_created`);
  }
  function close() { if (inst) { inst.destroy?.(); inst = null; } if (current) persist(current); current = null; hist = null; }
  function open(id) {
    const doc = docs.find(d => d.id === id); if (!doc) return; if (doc.type !== TOOL) { location.href = `${TYPES[doc.type].page}#${id}`; return; } close(); current = doc; history.replaceState(null, "", "#" + id);
    body.innerHTML = ""; body.className = "body"; const stage = h("div", { class: "stage" }), insp = h("aside", { class: "insp", "aria-label": "Details" }); body.append(stage, insp);
    renderTop(doc);
    const ctx = { doc, stage, insp, body, changed, toast, setView: el => { const s = $("#viewSlot"); s.innerHTML = ""; if (el) s.append(el); }, setTools: el => { const s = $("#toolSlot"); s.innerHTML = ""; if (el) s.append(el); }, openInspector: () => body.classList.add("insp-open"), noInspector: on => body.classList.toggle("no-insp", on) };
    inst = Modules[doc.type].mount(ctx);
    hist = History(() => doc.data, d => { doc.data = d; inst.reload?.(d); persist(doc); }, syncUndo);
    renderRail(); syncUndo(); $("#app").classList.remove("rail-open");
  }
  function syncUndo() { const u = $("#undoBtn"), r = $("#redoBtn"); if (u) u.disabled = !hist?.canUndo; if (r) r.disabled = !hist?.canRedo; }
  function renderTop(doc) {
    topbar.innerHTML = "";
    const railT = h("button", { class: "icon rail-toggle", "aria-label": "Show documents", onclick: () => $("#app").classList.toggle("rail-open") }); railT.innerHTML = ICONS.menu; topbar.append(railT);
    if (!doc) { topbar.append(h("strong", { style: "padding:0 .4rem" }, `${T.family.replace("If Leaves Weave ", "")} home`), h("span", { class: "spacer" })); const all = h("a", { class: "btn", href: "home.html" }); all.innerHTML = ICONS.home + "All tools"; topbar.append(all); return; }
    const homeB = h("button", { class: "btn tool-home", title: `${T.family.replace("If Leaves Weave ", "")} home: templates and recent work`, onclick: home }); homeB.innerHTML = ICONS.home + `<span class="hide-s">${esc(T.family.replace("If Leaves Weave ", ""))}</span>`; topbar.append(homeB);
    const ic = h("span", { class: "icon", style: "color:var(--accent)", "aria-hidden": "true" }); ic.innerHTML = ICONS[TYPES[doc.type].icon];
    const title = h("input", { class: "title", value: doc.title, "aria-label": "Document name", size: Math.max(8, doc.title.length) });
    title.addEventListener("input", () => { title.size = Math.max(8, title.value.length); }); title.addEventListener("change", () => { doc.title = title.value.trim() || doc.title; title.value = doc.title; persist(doc); }); title.addEventListener("keydown", e => { if (e.key === "Enter") title.blur(); });
    const undo = h("button", { class: "icon", id: "undoBtn", "aria-label": "Undo (Ctrl+Z)", title: "Undo (Ctrl+Z)", onclick: () => hist?.undo() }); undo.innerHTML = ICONS.undo;
    const redo = h("button", { class: "icon", id: "redoBtn", "aria-label": "Redo (Ctrl+Shift+Z)", title: "Redo (Ctrl+Shift+Z)", onclick: () => hist?.redo() }); redo.innerHTML = ICONS.redo;
    const exp = h("button", { class: "btn", "aria-haspopup": "true", onclick: e => exportMenu(e.currentTarget) }); exp.innerHTML = ICONS.download + `<span class="hide-s">Export</span>`;
    const more = h("button", { class: "icon docactions", "aria-label": "Document actions", title: "Document actions: rename, duplicate, download or delete", onclick: e => moreMenu(e.currentTarget) }); more.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`;
    const det = h("button", { class: "icon insp-toggle", "aria-label": "Show or hide details", title: "Details", onclick: () => body.classList.toggle("insp-open") }); det.innerHTML = IC('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>');
    topbar.append(ic, title, h("span", { class: "sep hide-s" }), h("span", { id: "viewSlot" }), h("span", { class: "spacer" }), h("span", { id: "toolSlot", class: "row" }), undo, redo, h("span", { class: "sep" }), exp, det, more);
  }
  function popMenu(anchor, items) {
    $$(".pop").forEach(p => p.remove()); const p = h("div", { class: "pop", role: "menu" });
    items.forEach(it => { if (it === "-") return p.append(h("hr")); const b = h("button", { role: "menuitem", onclick: () => { p.remove(); it.run(); } }); b.innerHTML = (it.icon ? ICONS[it.icon] : "") + `<span>${esc(it.label)}</span>`; p.append(b); });
    document.body.append(p); const r = anchor.getBoundingClientRect(), w = p.offsetWidth, ht = p.offsetHeight;
    // open below the button, or above it when there is no room below, and always inside the window
    const below = r.bottom + 6, above = r.top - ht - 6, top = below + ht <= innerHeight - 8 ? below : above >= 8 ? above : Math.max(8, innerHeight - ht - 8);
    p.style.top = `${top}px`; p.style.left = `${Math.max(8, Math.min(r.right - w, innerWidth - w - 8))}px`; if (ht > innerHeight - 16) { p.style.maxHeight = `${innerHeight - 16}px`; p.style.overflowY = "auto"; } p.querySelector("button")?.focus();
    setTimeout(() => { const off = e => { if (!p.contains(e.target)) { p.remove(); removeEventListener("pointerdown", off, true); } }; addEventListener("pointerdown", off, true); });
    p.addEventListener("keydown", e => { if (e.key === "Escape") { p.remove(); anchor.focus(); } const bs = [...p.querySelectorAll("button")], i = bs.indexOf(document.activeElement); if (e.key === "ArrowDown") { e.preventDefault(); bs[(i + 1) % bs.length].focus(); } if (e.key === "ArrowUp") { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); } });
  }
  function exportMenu(anchor) {
    const toPdf = inst?.canvas ? [{ label: "Send to If Leaves Weave PDF (annotate, sign or redact)", icon: "download", run: async () => { const { svg, world } = inst.canvas(); toast("Preparing the page…"); const b = await pngBlob(svg, world, 2); if (!b) return toast("Couldn’t prepare the page. Try exporting an image instead."); await handoffToPdf(b, `${fileSafe(current.title)}.png`); count("send_to_pdf"); if (current) await Store.put(current); location.href = "index.html#handoff"; } }] : [];
    const items = [...toPdf, ...(inst?.exports?.() || []), "-", { label: "If Leaves Weave file (to share or keep)", icon: "download", run: () => download(new Blob([JSON.stringify({ kind: "ifleavesweave-doc", v: 1, doc: current }, null, 1)], { type: "application/json" }), `${fileSafe(current.title)}.ifleavesweave.json`) }];
    popMenu(anchor, items);
  }
  /* ---------- Document actions: the same menu from the sidebar, the home screen and the top bar ---------- */
  const DOTS = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
  async function renameDoc(doc) {
    const body = h("div"); body.innerHTML = `<label class="field"><span>Name</span><input id="rnIn" value="${esc(doc.title)}" maxlength="120"></label>`;
    setTimeout(() => { const i = body.querySelector("#rnIn"); i?.focus(); i?.select(); i?.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); i.closest("dialog, .dialog")?.querySelector(".primary, [data-v=ok]")?.click(); } }); }, 30);
    const r = await dialog({ title: "Rename", body, actions: [{ label: "Cancel", value: "" }, { label: "Rename", primary: true, value: "ok" }] });
    if (r?.value !== "ok") return; const v = (body.querySelector("#rnIn").value || "").trim(); if (!v || v === doc.title) return;
    doc.title = v.slice(0, 120); await persist(doc); if (current?.id === doc.id) { const t = topbar.querySelector(".title"); if (t) { t.value = doc.title; t.size = Math.max(8, doc.title.length); } } else if (!current) home(); toast("Renamed");
  }
  async function duplicateDoc(doc) { const c = JSON.parse(JSON.stringify(doc)); c.id = uid(); c.title += " (copy)"; c.created = c.updated = Date.now(); docs.push(c); await persist(c); open(c.id); toast("Duplicated"); }
  function downloadDoc(doc) { download(new Blob([JSON.stringify({ kind: "ifleavesweave-doc", v: 1, doc }, null, 1)], { type: "application/json" }), `${fileSafe(doc.title)}.ifleavesweave.json`); }
  async function deleteDoc(doc) {
    if (!(await confirmIt("Delete this document?", `“${doc.title}” will be removed from this browser. You can undo this for a few seconds.`))) return;
    const wasOpen = current?.id === doc.id, copy = JSON.parse(JSON.stringify(doc));
    if (wasOpen) close(); docs = docs.filter(d => d.id !== doc.id); await Store.del(doc.id); if (wasOpen || !current) home(); else renderRail();
    toastAction(`Deleted “${copy.title}”`, "Undo", async () => { docs.push(copy); await Store.put(copy); if (!current) home(); else renderRail(); toast("Restored"); });
  }
  function docMenu(anchor, doc) {
    popMenu(anchor, [
      { label: "Rename", icon: "edit", run: () => renameDoc(doc) },
      { label: "Duplicate", icon: "copy", run: () => duplicateDoc(doc) },
      { label: "Download as a file", icon: "download", run: () => downloadDoc(doc) },
      "-",
      { label: "Delete", icon: "trash", run: () => deleteDoc(doc) },
    ]);
  }
  function moreMenu(anchor) { if (current) docMenu(anchor, current); }
  function oldMoreMenu(anchor) {
    popMenu(anchor, [
      { label: "Duplicate", icon: "copy", run: async () => { const c = JSON.parse(JSON.stringify(current)); c.id = uid(); c.title += " (copy)"; docs.push(c); await persist(c); open(c.id); toast("Duplicated"); } },
      { label: "Delete", icon: "trash", run: async () => { if (!(await confirmIt("Delete this document?", `“${current.title}” will be removed from this browser. Export it first if you want to keep a copy.`))) return; const id = current.id; close(); docs = docs.filter(d => d.id !== id); await Store.del(id); home(); toast("Deleted"); } },
    ]);
  }

  /* ---------- home ---------- */
  const STARTS = [
    ["board", "Plan a project", "Tasks, owners and deadlines in Kanban, Table and Timeline views", "project"],
    ["board", "Run a sprint", "Backlog, in progress, review and done, with priorities", "sprint"],
    ["whiteboard", "Brainstorm together", "Sticky notes, shapes and arrows on an endless canvas", null],
    ["whiteboard", "Retrospective", "What went well, what to improve, and actions", "retro"],
    ["mindmap", "Mind map", "Branch ideas quickly with the keyboard", null],
    ["mindmap", "Concept map for teaching", "Concepts joined by labelled relationships", "concept"],
    ["sociogram", "Classroom sociogram", "Who would pupils like to work with? See groups, stars and isolated pupils", "class"],
    ["genogram", "Family genogram", "Three generations with standard symbols for casework", "family"],
    ["prototype", "Prototype an app", "Clickable screens from a short description", "app"],
  ];
  const HERO = {
    board: ["Plan the work and see who’s doing what.", "One set of cards in Kanban, Table and Timeline views, with owners, due dates, priorities and checklists."],
    whiteboard: ["Think out loud on an endless canvas.", "Sticky notes, shapes, connectors, frames and a pen, for brainstorms, retrospectives and plans."],
    mindmap: ["Branch out ideas, then connect the concepts.", "Mind maps you build with the keyboard, and concept maps with linking phrases and cross-links, for teaching and thinking."],
    sociogram: ["See how a group really connects.", "Enter who chose whom and get a clear map, with accurate network measures explained in plain English."],
    genogram: ["Map a family’s structure and relationships.", "Standard genogram symbols, relationship lines and households, laid out for you, with a privacy mode for sharing."],
    prototype: ["Sketch an app, then tap through it.", "Describe a screen to start it, link screens together, play them like a user and export a clickable prototype."],
  };
  function home() {
    close(); history.replaceState(null, "", location.pathname); renderTop(null); body.className = "body no-insp"; body.innerHTML = "";
    const el = h("div", { class: "home", id: "home" }), mine = sorted().filter(d => d.type === TOOL), starts = STARTS.map((s, i) => [...s, i]).filter(s => s[0] === TOOL);
    el.innerHTML = `<section class="hero"><svg class="contours" viewBox="0 0 520 420" aria-hidden="true">${contours()}</svg>
      <p class="eyebrow-name">${esc(T.family)}</p><h1>${esc(HERO[TOOL][0])}</h1>
      <p>${esc(HERO[TOOL][1])} It runs in your browser, works offline and keeps everything on this device.</p>
      <div class="row">${starts[0] ? `<button class="btn primary" data-start="${starts[0][4]}">${esc(starts[0][1])}</button>` : ""}<button class="btn" data-new="${TOOL}">Start blank</button><button class="btn" data-tour>How it works</button></div></section>
      <section class="section"><h2>Start with</h2><div class="starts"><button class="start" data-new="${TOOL}">${ICONS.plus}<b>Blank ${esc(T.name.toLowerCase())}</b><small>Start from nothing</small></button>${starts.map(([t, n, d, , i]) => `<button class="start" data-start="${i}">${ICONS[TYPES[t].icon]}<b>${esc(n)}</b><small>${esc(d)}</small></button>`).join("")}</div></section>
      <section class="section"><h2>Other If Leaves Weave tools</h2><div class="recent">${FAMILY.filter(f => f[4] !== TOOL && f[0] !== "home.html").map(([href, name, blurb, icon]) => `<a class="famcard" href="${href}">${icon}<span><b>${esc(name)}</b><small>${esc(blurb)}</small></span></a>`).join("")}</div></section>
      ${mine.length ? `<section class="section"><h2>Recent</h2><div class="recent">${mine.slice(0, 8).map(d => `<div class="recentrow"><button data-open="${d.id}">${ICONS[TYPES[d.type].icon]}<span><b>${esc(d.title)}</b><small>${TYPES[d.type].name}, ${new Date(d.updated).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</small></span></button><button class="docmenu" data-docmenu="${d.id}" aria-label="Actions for ${esc(d.title)}" title="Rename, duplicate, download or delete">${DOTS}</button></div>`).join("")}</div></section>` : ""}
      <p class="privacy">${ICONS.lock}<span>Private by design: no account, no server and no tracking. Your work is saved in this browser only. Use Back up to keep a copy, especially for sensitive work such as genograms.</span></p>`;
    el.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; if (b.dataset.start != null) { const [t, , , tpl] = STARTS[+b.dataset.start]; create(t, tpl ? Modules[t].templates?.[tpl] : null); } if (b.dataset.new) create(b.dataset.new); if (b.dataset.docmenu) { const d = docs.find(x => x.id === b.dataset.docmenu); if (d) docMenu(b, d); return; } if (b.dataset.open) open(b.dataset.open); if (b.hasAttribute("data-tour")) tour(); });
    body.append(el); renderRail();
  }
  function contours() { let s = ""; const cols = ["var(--accent)", "var(--accent)", "var(--mari)", "var(--accent)", "var(--line)"]; for (let i = 0; i < 9; i++) { const r = 40 + i * 26, k = .18 + i * .02; s += `<path d="${blob(300, 200, r, k, i)}" fill="none" stroke="${cols[i % cols.length]}" stroke-opacity="${i === 4 ? .9 : .28}" stroke-width="${i === 4 ? 2 : 1.3}"/>`; } return s; }
  function blob(cx, cy, r, k, seed) { const pts = []; for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2, rr = r * (1 + k * Math.sin(t * 3 + seed * .7) * .5 + k * Math.cos(t * 2 - seed) * .35); pts.push([cx + Math.cos(t) * rr * 1.25, cy + Math.sin(t) * rr * .85]); } let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 0; i < pts.length; i++) { const p0 = pts[i], p1 = pts[(i + 1) % pts.length], m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]; d += ` Q${p0[0]},${p0[1]} ${m[0]},${m[1]}`; } return d + "Z"; }
  function tour() { dialog({ title: `How ${T.family} works`, wide: true, body: `<p>${esc(T.family)} is part of the If Leaves Weave family of free, private tools. Choose <b>New</b> to start; everything saves automatically in this browser and nothing is uploaded.</p><ul>${FAMILY.map(f => `<li><b>${f[1]}:</b> ${f[2]}.</li>`).join("")}</ul><p><b>Moving around canvases:</b> drag empty space, or hold <span class="kbd">Space</span> and drag; scroll to move; <span class="kbd">Ctrl</span> + scroll or pinch to zoom. <b>Undo</b> with <span class="kbd">Ctrl</span>+<span class="kbd">Z</span>.</p><p><b>Keeping your work:</b> <b>Back up</b> saves every document to one file; <b>Open file</b> restores it on any device. Export as images, share as If Leaves Weave files, or use <b>Send to If Leaves Weave PDF</b> to annotate, sign or redact a drawing as a PDF.</p>` }); }

  /* ---------- new, import, export, theme, keyboard ---------- */
  $("#newBtn").onclick = e => { const tpls = Object.entries(Modules[TOOL].templates || {}); if (!tpls.length) return create(TOOL); popMenu(e.currentTarget, [{ label: `Blank ${T.name.toLowerCase()}`, icon: "plus", run: () => create(TOOL) }, ...tpls.map(([, tp]) => ({ label: tp.title, icon: T.icon, run: () => create(TOOL, tp) }))]); };
  $("#homeBtn").onclick = () => { if (current) persist(current); location.href = "home.html"; }; $("#search").addEventListener("input", renderRail);
  $("#exportAll").onclick = () => { download(new Blob([JSON.stringify({ kind: "ifleavesweave-backup", v: 1, saved: new Date().toISOString(), docs }, null, 1)], { type: "application/json" }), `ifleavesweave-backup-${new Date().toISOString().slice(0, 10)}.json`); toast("Backup saved. Keep it somewhere safe."); };
  $("#importBtn").onclick = () => $("#fileIn").click();
  $("#fileIn").onchange = async () => { const f = $("#fileIn").files[0]; $("#fileIn").value = ""; if (!f) return; try { const d = JSON.parse(await f.text()); const incoming = /backup$/.test(d.kind || "") ? d.docs : /-doc$/.test(d.kind || "") ? [d.doc] : null; if (!incoming) throw 0; let n = 0; for (const doc of incoming) { if (!Modules[doc.type]) continue; if (docs.some(x => x.id === doc.id)) doc.id = uid(); docs.push(doc); await Store.put(doc); n++; } renderRail(); toast(`Opened ${n} document${n === 1 ? "" : "s"}`); if (n === 1) open(incoming[0].id); } catch { toast("That isn’t a If Leaves Weave tools file."); } };
  $("#themeBtn").onclick = () => { const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), nx = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = nx; try { localStorage.setItem("ifleavesweave-theme", nx); } catch {} };
  addEventListener("keydown", e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable, mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "z" && !typing && hist) { e.preventDefault(); e.shiftKey ? hist.redo() : hist.undo(); }
    if (mod && e.key.toLowerCase() === "y" && !typing && hist) { e.preventDefault(); hist.redo(); }
  });
  addEventListener("pagehide", () => { if (current) Store.put(current); });
  window.popMenu = popMenu;
  /* A document passed in a link, such as an action board from AI Benar: #import=<gzip, base64url>.
     The "#" part never reaches a server. It is checked, saved here, then removed from the address bar. */
  async function importFromLink() {
    const m = /^#import=([A-Za-z0-9_-]{16,})$/.exec(location.hash); if (!m) return false; history.replaceState(null, "", location.pathname);
    try {
      if (m[1].length > 3e6) throw 0; let b64 = m[1].replace(/-/g, "+").replace(/_/g, "/"); b64 += "=".repeat((4 - b64.length % 4) % 4);
      const bin = atob(b64), bytes = Uint8Array.from(bin, c => c.charCodeAt(0)), text = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text(), d = JSON.parse(text);
      const doc = d?.doc; if (!/-doc$/.test(d?.kind || "") || !doc || doc.type !== TOOL || !Modules[doc.type] || typeof doc.data !== "object") throw 0;
      if (doc.type === "board" && (!Array.isArray(doc.data.columns) || !Array.isArray(doc.data.cards) || !doc.data.columns.length)) throw 0;
      doc.id = uid(); doc.title = String(doc.title || "Imported").slice(0, 120); doc.created = doc.updated = Date.now(); docs.push(doc); await Store.put(doc); open(doc.id);
      toast(d.from === "ai-benar" ? `Action board made from the AI Benar audit: ${doc.data.cards?.length || 0} actions` : "Document opened from the link", 5000); count(`${TOOL}_imported`); return true;
    } catch { toast("That link didn’t contain a document this tool can open."); return false; }
  }
  addEventListener("hashchange", () => { if (location.hash.startsWith("#import=")) importFromLink(); });
  (async () => { docs = await Store.all(); if (await importFromLink()) return; const id = location.hash.slice(1); if (id && docs.some(d => d.id === id)) open(id); else home(); })();
  return { open, home, create, changed, popMenu, get current() { return current; } };
})();
