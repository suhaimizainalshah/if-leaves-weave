/* Mind and concept maps. Mind maps branch fast with the keyboard; concept maps add linking phrases on branches
   (propositions in the Novak style) and labelled cross-links between any two concepts. */
"use strict";
(() => {
  const BRANCH = ["#0E7C7B", "#2F6DB5", "#B86E00", "#7A4FC2", "#C2413A", "#3F7D3A", "#A23E7A", "#5E6B70"];
  const N = (text, children = [], extra = {}) => ({ id: uid(), text, children, collapsed: false, note: "", tags: [], url: "", done: false, color: null, rel: "", ...extra });
  function blank() { return { root: N("Central idea", [N("First idea"), N("Second idea"), N("Third idea")]), links: [], layout: "both", mode: "mind", view: { x: 0, y: 0, z: 1 }, outline: false }; }
  const templates = {
    concept: { title: "Concept map: photosynthesis", data: () => { const leaf = N("Leaves", [N("Chlorophyll", [], { rel: "contain" })], { rel: "happens in" }), d = { root: N("Photosynthesis", [leaf, N("Sunlight", [N("Light energy", [], { rel: "provides" })], { rel: "needs" }), N("Carbon dioxide", [], { rel: "uses" }), N("Glucose", [N("Energy for growth", [], { rel: "gives" })], { rel: "produces" }), N("Oxygen", [], { rel: "releases" })]), links: [], layout: "down", mode: "concept", view: { x: 0, y: 0, z: 1 } }; d.links.push({ id: uid(), from: d.root.children[1].children[0].id, to: d.root.children[3].id, label: "is stored as energy in" }); return d; } },
  };
  function mount(ctx) {
    let D = ctx.doc.data, sel = D.root.id, editing = null, linking = null, drag = null, pos = new Map();
    D.view ||= { x: 0, y: 0, z: 1 }; D.links ||= [];
    const svg = svgEl("svg", { class: "canvas dotgrid", role: "application", "aria-label": "Map. Tab adds a child, Enter adds a sibling, arrows move between ideas." }), world = svgEl("g", {}, svg);
    svgEl("defs", {}, svg).innerHTML = `<marker id="mmArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>`;
    const outline = h("div", { class: "outline", hidden: true }); ctx.stage.append(svg, outline);
    const vp = Viewport(svg, world, D.view, v => { zl.textContent = Math.round(v.z * 100) + "%"; svg.style.backgroundSize = `${22 * v.z}px ${22 * v.z}px`; svg.style.backgroundPosition = `${v.x}px ${v.y}px`; });
    const zb = h("div", { class: "zoombar" }), zl = h("span", {}, "100%"); [["zout", .8, "Zoom out"], [null], ["zin", 1.25, "Zoom in"], ["fit", 0, "Fit to screen"]].forEach(([ic, f, lbl]) => { if (!ic) return zb.append(zl); const b = h("button", { class: "icon", "aria-label": lbl, title: lbl, onclick: () => f ? vp.zoomBy(f) : fit() }); b.innerHTML = ICONS[ic]; zb.append(b); });
    const hud = h("div", { class: "hud" }); ctx.stage.append(zb, hud);
    const seg = h("div", { class: "row" }); ctx.setView(seg);
    function renderSeg() { seg.innerHTML = ""; const s1 = h("div", { class: "seg", role: "group", "aria-label": "View" }); [["map", "Map"], ["outline", "Outline"]].forEach(([v, n]) => s1.append(h("button", { "aria-pressed": String(!!D.outline === (v === "outline")), onclick: () => { D.outline = v === "outline"; ctx.changed(); render(); } }, n))); const s2 = h("div", { class: "seg hide-s", role: "group", "aria-label": "Kind of map" }); [["mind", "Mind map"], ["concept", "Concept map"]].forEach(([v, n]) => s2.append(h("button", { "aria-pressed": String(D.mode === v), onclick: () => { D.mode = v; if (v === "concept" && D.layout === "both") D.layout = "down"; ctx.changed(); render(); } }, n))); seg.append(s1, s2); }
    /* ---------- tree helpers ---------- */
    const walk = (n, fn, parent = null, depth = 0, branch = null) => { fn(n, parent, depth, branch); if (!n.collapsed || n === D.root) n.children.forEach(c => walk(c, fn, n, depth + 1, depth === 0 ? c : branch)); };
    const all = () => { const out = []; const rec = (n, p) => { out.push([n, p]); n.children.forEach(c => rec(c, n)); }; rec(D.root, null); return out; };
    const find = id => all().find(([n]) => n.id === id) || [null, null];
    const colorOf = (n, branch) => n.color || (branch ? (branch.color || BRANCH[D.root.children.indexOf(branch) % BRANCH.length]) : "#1E2A2F");
    /* ---------- layout ---------- */
    function measure(n, depth) { const size = depth === 0 ? 20 : depth === 1 ? 16 : 14, weight = depth < 2 ? 700 : 500, maxW = depth === 0 ? 240 : 200, lines = wrapLines(n.text || " ", maxW, size, weight); _mctx.font = `${weight} ${size}px ${FONT_STACK}`; const w = Math.max(depth === 0 ? 140 : 60, ...lines.map(l => _mctx.measureText(l).width)) + (depth === 0 ? 44 : 28), hh = lines.length * size * 1.3 + (depth === 0 ? 30 : 18) + (n.tags?.length || n.note || n.url ? 14 : 0); return { w, h: hh, size, weight, maxW }; }
    function layout() {
      pos = new Map(); const GX = D.mode === "concept" ? 90 : 60, GY = D.mode === "concept" ? 34 : 18, m = new Map(); walk(D.root, (n, p, d) => m.set(n.id, measure(n, d)));
      const kids = n => (n.collapsed && n !== D.root) ? [] : n.children;
      if (D.layout === "down") {
        const sw = new Map(), widthOf = n => { const k = kids(n); const w = k.length ? Math.max(m.get(n.id).w, k.reduce((s, c) => s + widthOf(c), 0) + (k.length - 1) * 36) : m.get(n.id).w; sw.set(n.id, w); return w; }; widthOf(D.root);
        const place = (n, x, y) => { const me = m.get(n.id); pos.set(n.id, { x: x + sw.get(n.id) / 2 - me.w / 2, y, ...me }); let cx = x; const ny = y + me.h + GX; kids(n).forEach(c => { place(c, cx, ny); cx += sw.get(c.id) + 36; }); }; place(D.root, 0, 0); return;
      }
      const sh = new Map(), hOf = n => { const k = kids(n); const v = k.length ? Math.max(m.get(n.id).h, k.reduce((s, c) => s + hOf(c), 0) + (k.length - 1) * GY) : m.get(n.id).h; sh.set(n.id, v); return v; };
      const side = (n, x, y, dir) => { const me = m.get(n.id); pos.set(n.id, { x: dir > 0 ? x : x - me.w, y: y + sh.get(n.id) / 2 - me.h / 2, ...me, dir }); let cy = y; const nx = dir > 0 ? x + me.w + GX : x - me.w - GX; kids(n).forEach(c => { side(c, nx, cy, dir); cy += sh.get(c.id) + GY; }); };
      const r = m.get(D.root.id); pos.set(D.root.id, { x: -r.w / 2, y: -r.h / 2, ...r }); D.root.children.forEach(hOf);
      let right = D.root.children, left = [];
      if (D.layout === "both" && D.root.children.length > 1) { const tot = D.root.children.reduce((s, c) => s + sh.get(c.id), 0); let acc = 0; right = []; for (const c of D.root.children) { (acc < tot / 2 ? right : left).push(c); acc += sh.get(c.id); } }
      const stack = (list, dir) => { const total = list.reduce((s, c) => s + sh.get(c.id), 0) + Math.max(0, list.length - 1) * GY * 2; let y = -total / 2; list.forEach(c => { side(c, dir > 0 ? r.w / 2 + GX + 10 : -r.w / 2 - GX - 10, y, dir); y += sh.get(c.id) + GY * 2; }); };
      stack(right, 1); stack(left, -1);
    }
    /* ---------- render ---------- */
    function render() {
      renderSeg(); svg.hidden = !!D.outline; zb.hidden = hud.hidden = !!D.outline; outline.hidden = !D.outline; if (D.outline) { renderOutline(); renderInsp(); return; }
      layout(); world.innerHTML = ""; const edges = svgEl("g", {}, world), labels = svgEl("g", {}, world), nodes = svgEl("g", {}, world), cross = svgEl("g", {}, world);
      walk(D.root, (n, p, depth, branch) => {
        const P = pos.get(n.id); if (!P) return; const col = colorOf(n, branch);
        if (p) { const Q = pos.get(p.id); let d, mx, my;
          if (D.layout === "down") { const x1 = Q.x + Q.w / 2, y1 = Q.y + Q.h, x2 = P.x + P.w / 2, y2 = P.y; d = `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`; mx = (x1 + x2) / 2; my = (y1 + y2) / 2; }
          else { const dir = P.dir || 1, x1 = dir > 0 ? Q.x + Q.w : Q.x, y1 = Q.y + Q.h / 2, x2 = dir > 0 ? P.x : P.x + P.w, y2 = P.y + P.h / 2, c = (x2 - x1) * .5; d = `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`; mx = (x1 + x2) / 2; my = (y1 + y2) / 2; }
          svgEl("path", { d, fill: "none", stroke: col, "stroke-width": depth === 1 ? 3 : 2, "stroke-opacity": .85, "stroke-linecap": "round", "marker-end": D.mode === "concept" ? "url(#mmArrow)" : null, style: `color:${col}` }, edges);
          if (D.mode === "concept" && n.rel) { _mctx.font = `500 12.5px ${FONT_STACK}`; const w = Math.min(180, _mctx.measureText(n.rel).width + 16); svgEl("rect", { x: mx - w / 2, y: my - 11, width: w, height: 22, rx: 11, fill: "#FFFFFF", stroke: "#DDE3E1" }, labels); svgText(labels, n.rel, mx, my, { size: 12.5, maxW: 170, fill: "#5E6B70", maxLines: 1 }); }
        }
        const g = svgEl("g", { class: "mm-node" + (sel === n.id ? " sel" : "") + (linking ? " linkable" : ""), "data-id": n.id }, nodes), root = depth === 0, fill = root ? "#1E2A2F" : depth === 1 ? col : "#FFFFFF", ink = root || depth === 1 ? "#FFFFFF" : "#1E2A2F";
        svgEl("rect", { x: P.x, y: P.y, width: P.w, height: P.h, rx: root ? 18 : 10, fill, stroke: depth > 1 ? col : "none", "stroke-width": 1.6, opacity: n.done ? .55 : 1 }, g);
        const extra = n.tags?.length || n.note || n.url; svgText(g, (n.done ? "✓ " : "") + (n.text || " "), P.x + P.w / 2, P.y + (P.h - (extra ? 14 : 0)) / 2, { size: P.size, weight: P.weight, maxW: P.maxW, fill: ink });
        if (extra) { const bits = [n.note ? "Notes" : "", n.url ? "Link" : "", ...(n.tags || []).map(t => "#" + t)].filter(Boolean).join("  "); const t = svgEl("text", { x: P.x + P.w / 2, y: P.y + P.h - 9, "text-anchor": "middle", "font-size": 10.5, "font-weight": 600, fill: ink, opacity: .75 }, g); t.textContent = bits.length > 40 ? bits.slice(0, 39) + "…" : bits; }
        if (n.children.length && !root) { const cx = D.layout === "down" ? P.x + P.w / 2 : (P.dir || 1) > 0 ? P.x + P.w + 9 : P.x - 9, cy = D.layout === "down" ? P.y + P.h + 9 : P.y + P.h / 2, tg = svgEl("g", { class: "mm-tog ui-only", "data-tog": n.id }, g); svgEl("circle", { cx, cy, r: 8.5, fill: "#FFFFFF", stroke: col, "stroke-width": 1.5 }, tg); const t = svgEl("text", { x: cx, y: cy + 3.6, "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: col }, tg); t.textContent = n.collapsed ? n.children.length : "−"; }
        if (sel === n.id) svgEl("rect", { x: P.x - 4, y: P.y - 4, width: P.w + 8, height: P.h + 8, rx: root ? 21 : 13, class: "selbox ui-only" }, g);
      });
      for (const l of D.links) { const A = pos.get(l.from), B = pos.get(l.to); if (!A || !B) continue; const ax = A.x + A.w / 2, ay = A.y + A.h / 2, bx = B.x + B.w / 2, by = B.y + B.h / 2, mx = (ax + bx) / 2 + (by - ay) * .2, my = (ay + by) / 2 - (bx - ax) * .2;
        const g = svgEl("g", { class: "mm-cross", "data-link": l.id }, cross); const end = edge(B, mx, my), start = edge(A, mx, my); const d = `M${start[0]},${start[1]} Q${mx},${my} ${end[0]},${end[1]}`; svgEl("path", { d, fill: "none", stroke: "transparent", "stroke-width": 14 }, g); svgEl("path", { d, fill: "none", stroke: "#7A4FC2", "stroke-width": 1.8, "stroke-dasharray": "6 5", "marker-end": "url(#mmArrow)", style: "color:#7A4FC2" }, g);
        if (l.label) { const lx = (start[0] + 2 * mx + end[0]) / 4, ly = (start[1] + 2 * my + end[1]) / 4; _mctx.font = `500 12.5px ${FONT_STACK}`; const w = Math.min(200, _mctx.measureText(l.label).width + 16); svgEl("rect", { x: lx - w / 2, y: ly - 11, width: w, height: 22, rx: 11, fill: "#F4EFFF", stroke: "#CDBDF0" }, g); svgText(g, l.label, lx, ly, { size: 12.5, maxW: 190, fill: "#5A3C9A", maxLines: 1 }); } }
      if (drag?.target) { const T = pos.get(drag.target); if (T) svgEl("rect", { x: T.x - 6, y: T.y - 6, width: T.w + 12, height: T.h + 12, rx: 14, fill: "none", stroke: "#E9A23B", "stroke-width": 3, class: "ui-only" }, world); }
      hud.textContent = linking ? "Click the concept to link to, or press Esc." : D.mode === "concept" ? "Tab adds a concept. Select a concept to give its branch a linking phrase." : "Tab adds a child, Enter a sibling. Arrows move, Space folds a branch.";
      renderInsp();
    }
    const edge = (P, tx, ty) => { const cx = P.x + P.w / 2, cy = P.y + P.h / 2, dx = tx - cx, dy = ty - cy, t = Math.min(Math.abs(P.w / 2 / (dx || 1e-9)), Math.abs(P.h / 2 / (dy || 1e-9))); return [cx + dx * t, cy + dy * t]; };
    function fit() { if (!pos.size) layout(); const b = bboxOf([...pos.values()]); if (b) vp.fit(b, 70); }
    /* ---------- editing ---------- */
    function addChild(id) { const [n] = find(id); if (!n) return; n.collapsed = false; const c = N(D.mode === "concept" ? "New concept" : "New idea", [], { rel: D.mode === "concept" ? "relates to" : "" }); n.children.push(c); sel = c.id; ctx.changed(); render(); edit(c.id); }
    function addSibling(id) { const [n, p] = find(id); if (!p) return addChild(id); const c = N(D.mode === "concept" ? "New concept" : "New idea", [], { rel: D.mode === "concept" ? "relates to" : "" }); p.children.splice(p.children.indexOf(n) + 1, 0, c); sel = c.id; ctx.changed(); render(); edit(c.id); }
    function remove(id) { const [n, p] = find(id); if (!p) return toast("The central idea can’t be deleted."); const i = p.children.indexOf(n); p.children.splice(i, 1); const gone = new Set(); const rec = x => { gone.add(x.id); x.children.forEach(rec); }; rec(n); D.links = D.links.filter(l => !gone.has(l.from) && !gone.has(l.to)); sel = (p.children[i] || p.children[i - 1] || p).id; ctx.changed(); render(); }
    function edit(id) {
      if (D.outline) return; const P = pos.get(id), [n] = find(id); if (!P || !n) return; const r = svg.getBoundingClientRect(), sr = ctx.stage.getBoundingClientRect(), z = D.view.z;
      const inp = h("textarea", { class: "mm-edit", "aria-label": "Idea" }); inp.value = n.text; Object.assign(inp.style, { left: r.left - sr.left + D.view.x + P.x * z + "px", top: r.top - sr.top + D.view.y + P.y * z + "px", width: Math.max(140, P.w) * z + "px", height: P.h * z + "px", fontSize: P.size * z + "px", fontWeight: P.weight });
      ctx.stage.append(inp); editing = id; inp.focus(); inp.select();
      const done = () => { if (editing !== id) return; editing = null; /* mark finished first: removing the box fires blur */ n.text = inp.value.trim() || n.text; inp.remove(); ctx.changed(); render(); };
      inp.onblur = done; inp.onkeydown = e => { e.stopPropagation(); if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); done(); addSibling(id); } else if (e.key === "Tab") { e.preventDefault(); done(); addChild(id); } else if (e.key === "Escape") { e.preventDefault(); done(); } };
    }
    function move(dir) {
      const [n, p] = find(sel); if (!n) return; const P = pos.get(n.id);
      if (D.layout === "down") { if (dir === "up" && p) sel = p.id; else if (dir === "down" && n.children.length && !n.collapsed) sel = n.children[0].id; else if ((dir === "left" || dir === "right") && p) { const i = p.children.indexOf(n) + (dir === "left" ? -1 : 1); if (p.children[i]) sel = p.children[i].id; } }
      else { const out = (P?.dir || 1) > 0 ? "right" : "left";
        if (n === D.root) { const side = D.root.children.filter(c => (pos.get(c.id)?.dir || 1) === (dir === "left" ? -1 : 1)); if (side[0]) sel = side[0].id; }
        else if (dir === out && n.children.length && !n.collapsed) sel = n.children[0].id; else if ((dir === "left" || dir === "right") && dir !== out && p) sel = p.id;
        else if ((dir === "up" || dir === "down") && p) { const i = p.children.indexOf(n) + (dir === "up" ? -1 : 1); if (p.children[i]) sel = p.children[i].id; } }
      render(); scrollIntoView();
    }
    function scrollIntoView() { const P = pos.get(sel); if (!P) return; const r = svg.getBoundingClientRect(), z = D.view.z, x = D.view.x + P.x * z, y = D.view.y + P.y * z; if (x < 20 || y < 20 || x + P.w * z > r.width - 20 || y + P.h * z > r.height - 60) { D.view.x += r.width / 2 - (x + P.w * z / 2); D.view.y += r.height / 2 - (y + P.h * z / 2); vp.apply(); } }
    svg.addEventListener("pointerdown", e => {
      const tog = e.target.closest?.("[data-tog]"); if (tog) { const [n] = find(tog.dataset.tog); n.collapsed = !n.collapsed; ctx.changed(); render(); e.stopPropagation(); return; }
      const g = e.target.closest?.("[data-id]"), lk = e.target.closest?.("[data-link]");
      if (linking && g) { if (g.dataset.id !== linking) { const l = { id: uid(), from: linking, to: g.dataset.id, label: D.mode === "concept" ? "is related to" : "" }; D.links.push(l); ctx.changed(); toast("Linked. Add a linking phrase in the panel."); selLinkId = l.id; } linking = null; render(); return; }
      if (lk && !g) { selLinkId = lk.dataset.link; sel = null; render(); return; }
      if (g) { sel = g.dataset.id; selLinkId = null; if (g.dataset.id !== D.root.id) { drag = { id: g.dataset.id, x: e.clientX, y: e.clientY, moved: false }; svg.setPointerCapture(e.pointerId); } render(); }
    });
    svg.addEventListener("pointermove", e => { if (!drag) return; if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return; drag.moved = true; const p = vp.toWorld(e.clientX, e.clientY); let t = null; for (const [id, P] of pos) if (id !== drag.id && p.x > P.x && p.x < P.x + P.w && p.y > P.y && p.y < P.y + P.h) t = id; const desc = new Set(); const rec = n => { desc.add(n.id); n.children.forEach(rec); }; rec(find(drag.id)[0]); drag.target = t && !desc.has(t) ? t : null; svg.style.cursor = "grabbing"; render(); });
    svg.addEventListener("pointerup", () => { if (drag?.moved && drag.target) { const [n, p] = find(drag.id), [t] = find(drag.target); p.children.splice(p.children.indexOf(n), 1); t.children.push(n); t.collapsed = false; ctx.changed(); toast(`Moved under “${t.text}”`); } drag = null; svg.style.cursor = ""; render(); });
    svg.addEventListener("dblclick", e => { const g = e.target.closest?.("[data-id]"); if (g) edit(g.dataset.id); });
    let selLinkId = null;
    const keys = e => {
      if (editing || D.outline || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if (e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") { linking = null; render(); return; }
      if (selLinkId && (e.key === "Delete" || e.key === "Backspace")) { D.links = D.links.filter(l => l.id !== selLinkId); selLinkId = null; ctx.changed(); render(); return; }
      if (!sel) return; const map = { Tab: () => addChild(sel), Enter: () => addSibling(sel), Delete: () => remove(sel), Backspace: () => remove(sel), F2: () => edit(sel), " ": () => { const [n] = find(sel); if (n.children.length && n !== D.root) { n.collapsed = !n.collapsed; ctx.changed(); render(); } }, ArrowLeft: () => move("left"), ArrowRight: () => move("right"), ArrowUp: () => move("up"), ArrowDown: () => move("down") };
      if (map[e.key]) { e.preventDefault(); map[e.key](); } else if (e.key.length === 1 && !e.altKey) { const [n] = find(sel); n.text = ""; edit(sel); }
    };
    /* ---------- outline view ---------- */
    function renderOutline() {
      outline.innerHTML = `<div class="ol-head"><p class="note">Edit as an indented list. <span class="kbd">Enter</span> adds a line, <span class="kbd">Tab</span> indents, <span class="kbd">Shift</span>+<span class="kbd">Tab</span> outdents.</p><button class="btn" id="olPaste">Paste an outline</button></div><ul class="ol"></ul>`;
      const ul = outline.querySelector(".ol"), rows = []; const rec = (n, d) => { rows.push([n, d]); n.children.forEach(c => rec(c, d + 1)); }; rec(D.root, 0);
      rows.forEach(([n, d]) => { const li = h("li", { style: `padding-left:${d * 22}px`, "data-id": n.id }); const inp = h("input", { value: n.text, "aria-label": `Level ${d + 1}`, class: d === 0 ? "root" : "" }); inp.oninput = () => { n.text = inp.value; ctx.changed(); }; inp.onkeydown = e => olKey(e, n); li.append(h("span", { class: "bul", "aria-hidden": "true" }, d === 0 ? "◆" : "•"), inp); ul.append(li); });
      outline.querySelector("#olPaste").onclick = pasteOutline;
      const f = outline.querySelector(`[data-id="${sel}"] input`); f?.focus();
    }
    function olKey(e, n) {
      const [, p] = find(n.id);
      if (e.key === "Enter") { e.preventDefault(); const c = N(""); if (p) p.children.splice(p.children.indexOf(n) + 1, 0, c); else n.children.unshift(c); sel = c.id; ctx.changed(); renderOutline(); }
      else if (e.key === "Tab" && !e.shiftKey && p) { e.preventDefault(); const i = p.children.indexOf(n); if (i > 0) { p.children.splice(i, 1); p.children[i - 1].children.push(n); p.children[i - 1].collapsed = false; sel = n.id; ctx.changed(); renderOutline(); } }
      else if (e.key === "Tab" && e.shiftKey && p) { e.preventDefault(); const [, gp] = find(p.id); if (gp) { p.children.splice(p.children.indexOf(n), 1); gp.children.splice(gp.children.indexOf(p) + 1, 0, n); sel = n.id; ctx.changed(); renderOutline(); } }
      else if (e.key === "Backspace" && !e.target.value && p) { e.preventDefault(); const rows = all().map(([x]) => x), i = rows.indexOf(n); p.children.splice(p.children.indexOf(n), 1, ...n.children); sel = rows[i - 1]?.id || D.root.id; ctx.changed(); renderOutline(); }
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); const rows = all().map(([x]) => x), i = rows.indexOf(n) + (e.key === "ArrowUp" ? -1 : 1); if (rows[i]) { sel = rows[i].id; outline.querySelector(`[data-id="${sel}"] input`)?.focus(); } }
    }
    async function pasteOutline() {
      const r = await dialog({ title: "Build from an outline", body: `<p class="note">Paste a list where indentation (spaces, tabs, or bullets like - and *) shows the levels. The first line becomes the central idea.</p><label class="field"><span>Outline</span><textarea rows="10" placeholder="Climate action\n  Energy\n    Solar\n    Wind\n  Transport\n    Cycling"></textarea></label>`, actions: [{ label: "Cancel", value: "" }, { label: "Replace map", primary: true, value: "ok" }] });
      if (r.value !== "ok") return; const lines = r.el.querySelector("textarea").value.split("\n").filter(l => l.trim()); if (!lines.length) return;
      const parse = l => { const m = l.match(/^(\s*)([-*•+]|\d+[.)])?\s*(.*)$/); return { ind: m[1].replace(/\t/g, "    ").length, text: m[3].trim() }; };
      const items = lines.map(parse), root = N(items[0].text), stack = [{ ind: -1, n: root }];
      items.slice(1).forEach(it => { while (stack.length > 1 && stack[stack.length - 1].ind >= it.ind) stack.pop(); const c = N(it.text); stack[stack.length - 1].n.children.push(c); stack.push({ ind: it.ind, n: c }); });
      D.root = root; D.links = []; sel = root.id; ctx.changed(); render(); toast("Map built from your outline");
    }
    /* ---------- inspector ---------- */
    function renderInsp() {
      const I = ctx.insp, l = D.links.find(x => x.id === selLinkId);
      if (l) { const a = find(l.from)[0], b = find(l.to)[0]; I.innerHTML = `<h2>Cross-link</h2><p class="hint">From “${esc(a?.text)}” to “${esc(b?.text)}”.</p><label class="field"><span>Linking phrase</span><input id="xl" value="${esc(l.label)}" placeholder="For example: leads to"></label><p class="note">Read it as a sentence: ${esc(a?.text)} <b>${esc(l.label || "…")}</b> ${esc(b?.text)}.</p><button class="btn danger" id="xd">${ICONS.trash}Delete link</button>`; I.querySelector("#xl").oninput = e => { l.label = e.target.value; ctx.changed(); render(); I.querySelector("#xl").focus(); }; I.querySelector("#xd").onclick = () => { D.links = D.links.filter(x => x !== l); selLinkId = null; ctx.changed(); render(); }; return; }
      const [n, p] = find(sel);
      const layoutChips = `<h3>Layout</h3><div class="chips">${[["both", "Balanced"], ["right", "To the right"], ["down", "Top down"]].map(([v, t]) => `<button class="chip" data-lay="${v}" aria-pressed="${D.layout === v}">${t}</button>`).join("")}</div>`;
      if (!n) { I.innerHTML = `<h2>Map</h2>${layoutChips}`; bindLayout(I); return; }
      const count = (() => { let c = 0; const rec = x => { c++; x.children.forEach(rec); }; rec(D.root); return c; })();
      I.innerHTML = `<h2>${n === D.root ? "Central idea" : D.mode === "concept" ? "Concept" : "Idea"}</h2>
        <label class="field"><span>Text</span><textarea id="nT" rows="2">${esc(n.text)}</textarea></label>
        ${D.mode === "concept" && p ? `<label class="field"><span>Linking phrase from “${esc(p.text)}”</span><input id="nR" value="${esc(n.rel)}" placeholder="For example: includes, causes, is a type of"></label><p class="note">Reads as: ${esc(p.text)} <b>${esc(n.rel || "…")}</b> ${esc(n.text)}.</p>` : ""}
        <div class="row"><button class="btn" id="nC">${ICONS.plus}Child</button>${p ? `<button class="btn" id="nS">${ICONS.plus}Sibling</button>` : ""}<button class="btn" id="nL" title="Link to any other concept">Cross-link</button></div>
        <h3>Details</h3><label class="field"><span>Notes</span><textarea id="nN" placeholder="Evidence, examples, sources or questions">${esc(n.note)}</textarea></label>
        <label class="field"><span>Tags (comma separated)</span><input id="nG" value="${esc((n.tags || []).join(", "))}" placeholder="evidence, priority"></label>
        <label class="field"><span>Web link</span><input id="nU" type="url" value="${esc(n.url)}" placeholder="https://">${n.url ? `<a href="${esc(n.url)}" target="_blank" rel="noopener" class="note">Open link</a>` : ""}</label>
        <label class="check"><input type="checkbox" id="nD" ${n.done ? "checked" : ""}> Mark as done</label>
        ${n !== D.root ? `<h3>Colour</h3><div class="swatches"><button data-col="" aria-label="Branch colour" aria-pressed="${!n.color}" style="background:conic-gradient(${BRANCH.join(",")})"></button>${BRANCH.map(c => `<button data-col="${c}" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${n.color === c}"></button>`).join("")}</div>` : ""}
        ${layoutChips}
        ${n !== D.root ? `<button class="btn danger" id="nX" style="margin-top:1rem">${ICONS.trash}Delete with its branch</button>` : ""}
        <p class="note">${count} ideas, ${D.links.length} cross-link${D.links.length === 1 ? "" : "s"}.</p>`;
      const upd = (f, v) => { n[f] = v; ctx.changed(); render(); };
      I.querySelector("#nT").oninput = e => { n.text = e.target.value; ctx.changed(); render(); refocus("#nT", e.target.selectionStart); };
      I.querySelector("#nR")?.addEventListener("input", e => { n.rel = e.target.value; ctx.changed(); render(); refocus("#nR", e.target.selectionStart); });
      I.querySelector("#nN").oninput = e => { n.note = e.target.value; ctx.changed(); }; I.querySelector("#nN").onchange = () => render();
      I.querySelector("#nG").onchange = e => upd("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean)); I.querySelector("#nU").onchange = e => upd("url", e.target.value.trim()); I.querySelector("#nD").onchange = e => upd("done", e.target.checked);
      I.querySelector("#nC").onclick = () => addChild(n.id); I.querySelector("#nS")?.addEventListener("click", () => addSibling(n.id)); I.querySelector("#nL").onclick = () => { linking = n.id; render(); };
      I.querySelectorAll("[data-col]").forEach(b => b.onclick = () => upd("color", b.dataset.col || null)); I.querySelector("#nX")?.addEventListener("click", () => remove(n.id)); bindLayout(I);
    }
    const refocus = (sel2, pos2) => { const el = ctx.insp.querySelector(sel2); if (el) { el.focus(); el.setSelectionRange(pos2, pos2); } };
    const bindLayout = I => I.querySelectorAll("[data-lay]").forEach(b => b.onclick = () => { D.layout = b.dataset.lay; ctx.changed(); render(); setTimeout(fit, 0); });
    const toMd = () => { const out = []; const rec = (n, d) => { out.push(`${"  ".repeat(d)}- ${n.text}${n.rel && d ? ` _(${n.rel})_` : ""}${n.note ? `\n${"  ".repeat(d + 1)}> ${n.note.replace(/\n/g, " ")}` : ""}`); n.children.forEach(c => rec(c, d + 1)); }; rec(D.root, 0); if (D.links.length) { out.push("", "Cross-links:"); D.links.forEach(l => out.push(`- ${find(l.from)[0]?.text} ${l.label || "→"} ${find(l.to)[0]?.text}`)); } return `# ${D.root.text}\n\n${out.join("\n")}\n`; };
    addEventListener("keydown", keys); render(); setTimeout(fit, 0);
    return {
      reload(d) { D = d; D.links ||= []; if (!find(sel)[0]) sel = D.root.id; render(); },
      destroy() { removeEventListener("keydown", keys); },
      canvas: () => ({ svg, world }),
      exports: () => [{ label: "Image (PNG)", icon: "download", run: () => { const s = sel; sel = null; render(); exportPNG(svg, world, ctx.doc.title); sel = s; render(); } }, { label: "Vector (SVG)", icon: "download", run: () => { const s = sel; sel = null; render(); exportSVG(svg, world, ctx.doc.title); sel = s; render(); } }, { label: "Outline (Markdown)", icon: "download", run: () => download(new Blob([toMd()], { type: "text/markdown" }), `${fileSafe(ctx.doc.title)}.md`) }],
    };
  }
  Modules.mindmap = { blank, templates, mount };
})();
