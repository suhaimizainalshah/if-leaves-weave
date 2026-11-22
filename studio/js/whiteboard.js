/* Whiteboard: an endless canvas with sticky notes, text, shapes, frames, images, freehand pen and connectors. */
"use strict";
(() => {
  const DEF = { sticky: [180, 140], text: [220, 40], rect: [180, 110], ellipse: [170, 120], diamond: [170, 130], frame: [520, 380] };
  const TOOLS = [["select", "Select (V)", "v", IC('<path d="M5 3l14 8-6 1.5L10 19z"/>')], ["hand", "Move around (H)", "h", IC('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-6a1.5 1.5 0 0 1 3 0v6m0-4.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7h-.5A5.5 5.5 0 0 1 5 16l-1.6-3.2a1.4 1.4 0 0 1 2.4-1.4L8 14"/>')], "|",
    ["sticky", "Sticky note (S)", "s", IC('<path d="M4 4h16v10l-6 6H4z"/><path d="M14 20v-6h6"/>')], ["text", "Text (T)", "t", IC('<path d="M5 6V4h14v2M12 4v16M9 20h6"/>')], ["rect", "Rectangle (R)", "r", IC('<rect x="4" y="6" width="16" height="12" rx="2"/>')], ["ellipse", "Ellipse (O)", "o", IC('<ellipse cx="12" cy="12" rx="9" ry="6.5"/>')], ["diamond", "Diamond (D)", "d", IC('<path d="M12 3l9 9-9 9-9-9z"/>')], ["link", "Connector (C)", "c", IC('<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 16.5 17 7.5"/>')], ["pen", "Pen (P)", "p", IC('<path d="M4 20c2-1 3-4 6-7l6-6 2 2-6 6c-3 3-6 4-7 6z"/>')], ["frame", "Frame (F)", "f", IC('<path d="M7 3v18M17 3v18M3 7h18M3 17h18"/>')], ["image", "Image (I)", "i", IC('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>')]];
  function blank() { return { items: [], links: [], view: { x: 80, y: 60, z: 1 } }; }
  const S = (x, y, text, color = PALETTE[0], w = 170, hh = 130) => ({ id: uid(), kind: "sticky", x, y, w, h: hh, text, color });
  const templates = {
    retro: { title: "Team retrospective", data: () => { const d = blank(); [["What went well", "#BDE5C8"], ["What to improve", "#F7C6D0"], ["Actions", "#B9DCF5"]].forEach(([t, c], i) => { const x = i * 560; d.items.push({ id: uid(), kind: "frame", x, y: 0, w: 520, h: 560, text: t, color: "#FFFFFF" }); d.items.push(S(x + 30, 70, "Add a note: double-click to edit", c), S(x + 220, 70, "", c)); }); return d; } },
    swot: { title: "SWOT analysis", data: () => { const d = blank(); [["Strengths", "#BDE5C8", 0, 0], ["Weaknesses", "#F7C6D0", 1, 0], ["Opportunities", "#B9DCF5", 0, 1], ["Threats", "#FFD2A8", 1, 1]].forEach(([t, c, i, j]) => { d.items.push({ id: uid(), kind: "frame", x: i * 480, y: j * 420, w: 450, h: 390, text: t, color: "#FFFFFF" }); d.items.push(S(i * 480 + 30, j * 420 + 70, "", c)); }); return d; } },
  };
  function mount(ctx) {
    let D = ctx.doc.data, tool = "select", sel = new Set(), selLink = null, drag = null, editing = null, linkFrom = null, imgAt = null;
    D.view ||= { x: 80, y: 60, z: 1 };
    const svg = svgEl("svg", { class: "canvas dotgrid", role: "application", "aria-label": "Whiteboard. Use the toolbar to add notes and shapes." }), defs = svgEl("defs", {}, svg), world = svgEl("g", {}, svg);
    defs.innerHTML = `<marker id="wbArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>`;
    ctx.stage.append(svg);
    const vp = Viewport(svg, world, D.view, v => { zl.textContent = Math.round(v.z * 100) + "%"; svg.style.backgroundSize = `${22 * v.z}px ${22 * v.z}px`; svg.style.backgroundPosition = `${v.x}px ${v.y}px`; });
    vp.panOnBackground = () => tool === "hand";
    const tb = h("div", { class: "toolbar", role: "toolbar", "aria-label": "Tools" });
    TOOLS.forEach(t => { if (t === "|") return tb.append(h("span", { class: "sep" })); const b = h("button", { class: "icon", "aria-label": t[1], title: t[1], "data-tool": t[0], onclick: () => setTool(t[0]) }); b.innerHTML = t[3]; tb.append(b); });
    const zb = h("div", { class: "zoombar" }), zl = h("span", {}, "100%"); [["zout", .8, "Zoom out"], [null], ["zin", 1.25, "Zoom in"], ["fit", 0, "Fit to screen"]].forEach(([ic, f, lbl]) => { if (!ic) return zb.append(zl); const b = h("button", { class: "icon", "aria-label": lbl, title: lbl, onclick: () => f ? vp.zoomBy(f) : fit() }); b.innerHTML = ICONS[ic]; zb.append(b); });
    const hud = h("div", { class: "hud" }); ctx.stage.append(tb, zb, hud);
    const fileIn = h("input", { type: "file", accept: "image/*", hidden: true }); ctx.stage.append(fileIn);
    const item = id => D.items.find(i => i.id === id);
    function setTool(t) { tool = t; tb.querySelectorAll("[data-tool]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tool === t))); svg.style.cursor = t === "hand" ? "grab" : t === "select" ? "default" : "crosshair"; hud.textContent = { select: "Click to select, drag to move. Drag empty space to select several.", hand: "Drag to move around.", sticky: "Click to place a sticky note.", text: "Click to add text.", rect: "Click or drag to draw a rectangle.", ellipse: "Click or drag to draw an ellipse.", diamond: "Click or drag to draw a diamond.", link: "Drag from one item to another to connect them.", pen: "Draw freely. Choose Select when you’re done.", frame: "Drag to draw a frame that groups things.", image: "Click where the image should go." }[t]; linkFrom = null; if (t === "image") { /* waits for a click */ } }
    function fit() { const b = bboxOf(D.items.map(i => i.kind === "pen" ? penBox(i) : i)); if (b) vp.fit(b); else { D.view.x = 80; D.view.y = 60; D.view.z = 1; vp.apply(); } }
    const penBox = i => { const xs = i.points.map(p => p[0]), ys = i.points.map(p => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
    const inkFor = fill => { const n = parseInt((fill || "#ffffff").slice(1), 16), l = (.2126 * (n >> 16 & 255) + .7152 * (n >> 8 & 255) + .0722 * (n & 255)) / 255; return l > .55 ? "#1E2A2F" : "#FFFFFF"; };
    function edgePoint(it, tx, ty) { // where a line from the item's centre towards (tx,ty) leaves its outline
      const cx = it.x + it.w / 2, cy = it.y + it.h / 2, dx = tx - cx, dy = ty - cy; if (!dx && !dy) return [cx, cy];
      if (it.kind === "ellipse") { const a = it.w / 2, b = it.h / 2, t = 1 / Math.sqrt((dx * dx) / (a * a) + (dy * dy) / (b * b)); return [cx + dx * t, cy + dy * t]; }
      if (it.kind === "diamond") { const t = 1 / (Math.abs(dx) / (it.w / 2) + Math.abs(dy) / (it.h / 2)); return [cx + dx * t, cy + dy * t]; }
      const t = Math.min(Math.abs((it.w / 2) / (dx || 1e-9)), Math.abs((it.h / 2) / (dy || 1e-9))); return [cx + dx * t, cy + dy * t];
    }
    function render() {
      world.innerHTML = "";
      const order = [...D.items].sort((a, b) => (a.kind === "frame" ? 0 : 1) - (b.kind === "frame" ? 0 : 1));
      for (const it of order) {
        const g = svgEl("g", { "data-id": it.id, class: "wb-item" + (sel.has(it.id) ? " sel" : ""), tabindex: 0 }, world);
        if (it.kind === "pen") { svgEl("path", { d: "M" + it.points.map(p => p.join(",")).join(" L"), fill: "none", stroke: it.color || "#1E2A2F", "stroke-width": it.size || 3, "stroke-linecap": "round", "stroke-linejoin": "round" }, g); if (sel.has(it.id)) { const b = penBox(it); svgEl("rect", { x: b.x - 6, y: b.y - 6, width: b.w + 12, height: b.h + 12, class: "selbox ui-only" }, g); } continue; }
        const fill = it.color || "#FFFFFF", ink = it.ink || inkFor(fill);
        if (it.kind === "frame") { svgEl("rect", { x: it.x, y: it.y, width: it.w, height: it.h, rx: 14, fill, stroke: "#C9D2CF", "stroke-width": 1.5, class: "frame" }, g); const t = svgEl("text", { x: it.x + 18, y: it.y + 32, "font-size": 18, "font-weight": 700, fill: "#1E2A2F" }, g); t.textContent = it.text || "Frame"; }
        else if (it.kind === "sticky") { svgEl("rect", { x: it.x + 2, y: it.y + 4, width: it.w, height: it.h, rx: 4, fill: "rgba(30,42,47,.12)" }, g); svgEl("rect", { x: it.x, y: it.y, width: it.w, height: it.h, rx: 4, fill }, g); svgText(g, it.text || "", it.x + it.w / 2, it.y + it.h / 2, { size: it.size || 15, maxW: it.w - 20, fill: ink, maxLines: Math.floor((it.h - 16) / ((it.size || 15) * 1.3)) }); }
        else if (it.kind === "text") { svgText(g, it.text || "Text", it.x, it.y + it.h / 2, { size: it.size || 20, weight: it.bold ? 700 : 500, maxW: it.w, anchor: "start", fill: it.ink || "#1E2A2F" }); svgEl("rect", { x: it.x, y: it.y, width: it.w, height: it.h, fill: "transparent" }, g); }
        else if (it.kind === "image") { svgEl("image", { href: it.src, x: it.x, y: it.y, width: it.w, height: it.h, preserveAspectRatio: "xMidYMid slice" }, g); }
        else { const st = { fill, stroke: it.stroke || "#1E2A2F", "stroke-width": 1.6 }; if (it.kind === "rect") svgEl("rect", { x: it.x, y: it.y, width: it.w, height: it.h, rx: 10, ...st }, g); if (it.kind === "ellipse") svgEl("ellipse", { cx: it.x + it.w / 2, cy: it.y + it.h / 2, rx: it.w / 2, ry: it.h / 2, ...st }, g); if (it.kind === "diamond") svgEl("path", { d: `M${it.x + it.w / 2},${it.y} L${it.x + it.w},${it.y + it.h / 2} L${it.x + it.w / 2},${it.y + it.h} L${it.x},${it.y + it.h / 2}Z`, ...st }, g); svgText(g, it.text || "", it.x + it.w / 2, it.y + it.h / 2, { size: it.size || 15, maxW: it.w * (it.kind === "rect" ? .86 : .66), fill: ink }); }
        if (sel.has(it.id)) { svgEl("rect", { x: it.x - 5, y: it.y - 5, width: it.w + 10, height: it.h + 10, class: "selbox ui-only" }, g); if (sel.size === 1) svgEl("rect", { x: it.x + it.w - 3, y: it.y + it.h - 3, width: 12, height: 12, rx: 3, class: "handle ui-only", "data-handle": "se" }, g); }
      }
      for (const l of D.links) {
        const a = item(l.from), b = item(l.to); if (!a || !b) continue;
        const [x1, y1] = edgePoint(a, b.x + b.w / 2, b.y + b.h / 2), [x2, y2] = edgePoint(b, a.x + a.w / 2, a.y + a.h / 2), g = svgEl("g", { class: "wb-link" + (selLink === l.id ? " sel" : ""), "data-link": l.id, style: `color:${l.color || "#1E2A2F"}` }, world);
        let d = `M${x1},${y1} L${x2},${y2}`; if (l.curve) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -(y2 - y1) * .25, ny = (x2 - x1) * .25; d = `M${x1},${y1} Q${mx + nx},${my + ny} ${x2},${y2}`; }
        svgEl("path", { d, fill: "none", stroke: "transparent", "stroke-width": 14 }, g); svgEl("path", { d, fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-dasharray": l.dashed ? "7 6" : null, "marker-end": l.arrow === false ? null : "url(#wbArrow)", "marker-start": l.both ? "url(#wbArrow)" : null }, g);
        if (l.label) { const mx = (x1 + x2) / 2 + (l.curve ? -(y2 - y1) * .125 : 0), my = (y1 + y2) / 2 + (l.curve ? (x2 - x1) * .125 : 0), w = Math.min(220, wrapLines(l.label, 200, 13)[0].length * 7.4 + 18); svgEl("rect", { x: mx - w / 2, y: my - 12, width: w, height: 24, rx: 12, fill: "#FFFFFF", stroke: "#DDE3E1" }, g); svgText(g, l.label, mx, my, { size: 13, maxW: 200, fill: "#1E2A2F", maxLines: 1 }); }
      }
      if (drag?.marquee) { const m = drag.marquee; svgEl("rect", { x: Math.min(m.x0, m.x1), y: Math.min(m.y0, m.y1), width: Math.abs(m.x1 - m.x0), height: Math.abs(m.y1 - m.y0), class: "marquee ui-only" }, world); }
      if (drag?.preview) { const p = drag.preview; svgEl("rect", { x: Math.min(p.x0, p.x1), y: Math.min(p.y0, p.y1), width: Math.abs(p.x1 - p.x0), height: Math.abs(p.y1 - p.y0), class: "marquee ui-only" }, world); }
      if (drag?.linkLine) { const l = drag.linkLine; svgEl("path", { d: `M${l.x0},${l.y0} L${l.x1},${l.y1}`, stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "6 5", fill: "none", class: "ui-only" }, world); }
      renderInsp();
    }
    function hit(e) { const g = e.target.closest?.("[data-id]"); return g ? item(g.dataset.id) : null; }
    function add(kind, x, y, w, hh, extra = {}) { const [dw, dh] = DEF[kind] || [160, 100], it = { id: uid(), kind, x: Math.round(x - (w ? 0 : dw / 2)), y: Math.round(y - (hh ? 0 : dh / 2)), w: w || dw, h: hh || dh, text: kind === "frame" ? "Frame" : "", color: kind === "sticky" ? PALETTE[0] : kind === "frame" ? "#FFFFFF" : kind === "text" ? null : "#FFFFFF", ...extra }; D.items.push(it); sel = new Set([it.id]); selLink = null; ctx.changed(); render(); return it; }
    svg.addEventListener("dblclick", e => { const it = hit(e); if (it && it.kind !== "pen" && it.kind !== "image") editText(it); else if (!it && tool === "select") { const p = vp.toWorld(e.clientX, e.clientY), s = add("sticky", p.x, p.y); editText(s); } });
    svg.addEventListener("pointerdown", e => {
      if (e.button !== 0 || editing) return; const p = vp.toWorld(e.clientX, e.clientY), it = hit(e), lk = e.target.closest?.("[data-link]");
      if (tool === "hand") return;
      if (tool === "pen") { const pen = { id: uid(), kind: "pen", points: [[Math.round(p.x), Math.round(p.y)]], color: "#1E2A2F", size: 3 }; D.items.push(pen); drag = { pen }; svg.setPointerCapture(e.pointerId); return; }
      if (tool === "image") { imgAt = p; fileIn.click(); setTool("select"); return; }
      if (tool === "link") { if (it) { drag = { linkFrom: it, linkLine: { x0: it.x + it.w / 2, y0: it.y + it.h / 2, x1: p.x, y1: p.y } }; svg.setPointerCapture(e.pointerId); } return; }
      if (["sticky", "text", "rect", "ellipse", "diamond", "frame"].includes(tool)) { drag = { create: tool, preview: { x0: p.x, y0: p.y, x1: p.x, y1: p.y } }; svg.setPointerCapture(e.pointerId); return; }
      // select tool
      if (e.target.dataset?.handle === "se") { const s = item([...sel][0]); drag = { resize: s, w: s.w, h: s.h, x: p.x, y: p.y }; svg.setPointerCapture(e.pointerId); return; }
      if (lk && !it) { selLink = lk.dataset.link; sel.clear(); render(); return; }
      if (it) { if (e.shiftKey) sel.has(it.id) ? sel.delete(it.id) : sel.add(it.id); else if (!sel.has(it.id)) sel = new Set([it.id]); selLink = null;
        const moving = [...sel].map(item).filter(Boolean); if (it.kind === "frame" && !e.shiftKey) D.items.forEach(o => { if (o !== it && o.kind !== "frame" && o.x >= it.x && o.y >= it.y && o.x + (o.w || 0) <= it.x + it.w && o.y + (o.h || 0) <= it.y + it.h && !moving.includes(o)) moving.push(o); });
        drag = { move: moving.map(o => ({ o, x: o.x, y: o.y, pts: o.points?.map(q => [...q]) })), sx: p.x, sy: p.y, moved: false }; svg.setPointerCapture(e.pointerId); render(); return; }
      sel.clear(); selLink = null; drag = { marquee: { x0: p.x, y0: p.y, x1: p.x, y1: p.y } }; svg.setPointerCapture(e.pointerId); render();
    });
    svg.addEventListener("pointermove", e => {
      if (!drag) return; const p = vp.toWorld(e.clientX, e.clientY);
      if (drag.pen) { drag.pen.points.push([Math.round(p.x), Math.round(p.y)]); render(); return; }
      if (drag.linkLine) { drag.linkLine.x1 = p.x; drag.linkLine.y1 = p.y; render(); return; }
      if (drag.preview) { drag.preview.x1 = p.x; drag.preview.y1 = p.y; render(); return; }
      if (drag.resize) { drag.resize.w = Math.max(40, Math.round(drag.w + p.x - drag.x)); drag.resize.h = Math.max(30, Math.round(drag.h + p.y - drag.y)); render(); return; }
      if (drag.move) { const dx = Math.round(p.x - drag.sx), dy = Math.round(p.y - drag.sy); if (dx || dy) drag.moved = true; drag.move.forEach(m => { if (m.pts) m.o.points = m.pts.map(([a, b]) => [a + dx, b + dy]); else { m.o.x = m.x + dx; m.o.y = m.y + dy; } }); render(); return; }
      if (drag.marquee) { drag.marquee.x1 = p.x; drag.marquee.y1 = p.y; const m = drag.marquee, x0 = Math.min(m.x0, m.x1), x1 = Math.max(m.x0, m.x1), y0 = Math.min(m.y0, m.y1), y1 = Math.max(m.y0, m.y1); sel = new Set(D.items.filter(i => { const b = i.kind === "pen" ? penBox(i) : i; return b.x >= x0 && b.y >= y0 && b.x + b.w <= x1 && b.y + b.h <= y1; }).map(i => i.id)); render(); }
    });
    svg.addEventListener("pointerup", e => {
      if (!drag) return; const d = drag; drag = null;
      if (d.pen) { if (d.pen.points.length < 2) D.items = D.items.filter(i => i !== d.pen); ctx.changed(); render(); return; }
      if (d.linkLine) { const under = document.elementFromPoint(e.clientX, e.clientY), target = under ? hit({ target: under }) : null; if (target && target !== d.linkFrom) { const l = { id: uid(), from: d.linkFrom.id, to: target.id, label: "" }; D.links.push(l); selLink = l.id; sel.clear(); ctx.changed(); } render(); return; }
      if (d.create) { const pr = d.preview, w = Math.abs(pr.x1 - pr.x0), hh = Math.abs(pr.y1 - pr.y0), it = w > 20 && hh > 20 ? add(d.create, Math.min(pr.x0, pr.x1), Math.min(pr.y0, pr.y1), w, hh) : add(d.create, pr.x0, pr.y0); setTool("select"); if (["sticky", "text", "rect", "ellipse", "diamond"].includes(it.kind)) editText(it); return; }
      if (d.resize || d.move?.length && d.move && drag !== d) { if (d.resize || d.moved) ctx.changed(); }
      render();
    });
    function editText(it) {
      if (editing) return; const r = svg.getBoundingClientRect(), z = D.view.z, sr = ctx.stage.getBoundingClientRect();
      const ta = h("textarea", { class: "wb-edit", "aria-label": "Text", spellcheck: "true" }); ta.value = it.text || "";
      const fs = (it.size || (it.kind === "text" ? 20 : 15)) * z; Object.assign(ta.style, { left: r.left - sr.left + D.view.x + it.x * z + "px", top: r.top - sr.top + D.view.y + it.y * z + "px", width: it.w * z + "px", height: it.h * z + "px", fontSize: fs + "px", textAlign: it.kind === "text" ? "left" : "center", background: it.kind === "text" ? "rgba(255,255,255,.9)" : it.color || "#fff", color: it.ink || inkFor(it.color || "#ffffff") });
      ctx.stage.append(ta); editing = it; ta.focus(); ta.select();
      const done = keep => { if (!editing) return; editing = null; /* mark finished first: removing the box fires blur */ if (keep) { it.text = ta.value; if (it.kind === "text" && !it.text.trim()) D.items = D.items.filter(x => x !== it); ctx.changed(); } ta.remove(); render(); };
      ta.onblur = () => done(true); ta.onkeydown = e => { if (e.key === "Escape") { e.preventDefault(); done(true); } if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) done(true); e.stopPropagation(); };
    }
    fileIn.onchange = () => { const f = fileIn.files[0]; fileIn.value = ""; if (!f) return; const fr = new FileReader(); fr.onload = async () => { const img = new Image(); img.src = fr.result; await img.decode().catch(() => {}); let w = img.naturalWidth || 300, hh = img.naturalHeight || 200; const s = Math.min(1, 420 / Math.max(w, hh)); w = Math.round(w * s); hh = Math.round(hh * s); const src = await shrink(img, 1400); const p = imgAt || vp.toWorld(innerWidth / 2, innerHeight / 2); add("image", p.x - w / 2, p.y - hh / 2, w, hh, { src }); toast("Image added"); }; fr.readAsDataURL(f); };
    const shrink = (img, max) => { const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = h("canvas"); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", .85); };
    function renderInsp() {
      const I = ctx.insp, items = [...sel].map(item).filter(Boolean), l = D.links.find(x => x.id === selLink);
      if (l) { I.innerHTML = `<h2>Connector</h2><label class="field"><span>Label</span><input id="lLabel" value="${esc(l.label)}" placeholder="For example: leads to"></label><label class="check"><input type="checkbox" id="lArrow" ${l.arrow === false ? "" : "checked"}>Arrow at the end</label><label class="check"><input type="checkbox" id="lBoth" ${l.both ? "checked" : ""}>Arrow at both ends</label><label class="check"><input type="checkbox" id="lDash" ${l.dashed ? "checked" : ""}>Dashed</label><label class="check"><input type="checkbox" id="lCurve" ${l.curve ? "checked" : ""}>Curved</label><h3>Colour</h3><div class="swatches">${INKS.map(c => `<button data-lc="${c}" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${(l.color || INKS[0]) === c}"></button>`).join("")}</div><button class="btn danger" id="lDel" style="margin-top:1rem">${ICONS.trash}Delete connector</button>`;
        I.querySelector("#lLabel").oninput = e => { l.label = e.target.value; ctx.changed(); render(); I.querySelector("#lLabel").focus(); }; ["lArrow", "lBoth", "lDash", "lCurve"].forEach(id => I.querySelector("#" + id).onchange = e => { ({ lArrow: () => l.arrow = e.target.checked, lBoth: () => l.both = e.target.checked, lDash: () => l.dashed = e.target.checked, lCurve: () => l.curve = e.target.checked })[id](); ctx.changed(); render(); });
        I.querySelectorAll("[data-lc]").forEach(b => b.onclick = () => { l.color = b.dataset.lc; ctx.changed(); render(); }); I.querySelector("#lDel").onclick = () => { D.links = D.links.filter(x => x !== l); selLink = null; ctx.changed(); render(); }; return; }
      if (!items.length) { I.innerHTML = `<h2>Whiteboard</h2><p class="hint">Pick a tool below, or double-click anywhere to add a sticky note.</p><h3>Shortcuts</h3><p class="note"><span class="kbd">S</span> note, <span class="kbd">T</span> text, <span class="kbd">R</span> rectangle, <span class="kbd">C</span> connector, <span class="kbd">P</span> pen, <span class="kbd">V</span> select. Hold <span class="kbd">Space</span> and drag to move around. <span class="kbd">Ctrl</span>+<span class="kbd">D</span> duplicates, <span class="kbd">Delete</span> removes.</p><p class="note">${D.items.length} item${D.items.length === 1 ? "" : "s"}, ${D.links.length} connector${D.links.length === 1 ? "" : "s"}.</p>`; return; }
      const one = items.length === 1 ? items[0] : null, fills = one?.kind === "text" ? INKS : PALETTE;
      I.innerHTML = `<h2>${one ? { sticky: "Sticky note", text: "Text", rect: "Rectangle", ellipse: "Ellipse", diamond: "Diamond", frame: "Frame", image: "Image", pen: "Drawing" }[one.kind] : `${items.length} items`}</h2>
        ${one && !["pen", "image"].includes(one.kind) ? `<label class="field"><span>Text</span><textarea id="iText">${esc(one.text)}</textarea></label>` : ""}
        ${!one || !["image"].includes(one.kind) ? `<h3>${one?.kind === "text" || one?.kind === "pen" ? "Colour" : "Fill"}</h3><div class="swatches">${(one?.kind === "pen" ? INKS : fills).map(c => `<button data-fill="${c}" style="background:${c}" aria-label="Colour ${c}" aria-pressed="${(one?.kind === "pen" || one?.kind === "text" ? (one.color || one.ink) : one?.color) === c}"></button>`).join("")}</div>` : ""}
        ${one && ["sticky", "text", "rect", "ellipse", "diamond"].includes(one.kind) ? `<h3>Text size</h3><div class="chips">${[13, 15, 20, 28, 40].map(s => `<button class="chip" data-size="${s}" aria-pressed="${(one.size || (one.kind === "text" ? 20 : 15)) === s}">${s}</button>`).join("")}</div>` : ""}
        ${items.length > 1 ? `<h3>Align</h3><div class="chips"><button class="chip" data-al="left">Left</button><button class="chip" data-al="cx">Centre</button><button class="chip" data-al="top">Top</button><button class="chip" data-al="cy">Middle</button><button class="chip" data-al="dist">Spread out</button></div>` : ""}
        <h3>Arrange</h3><div class="chips"><button class="chip" data-ar="front">Bring to front</button><button class="chip" data-ar="back">Send to back</button><button class="chip" data-ar="dup">Duplicate</button></div>
        <button class="btn danger" id="iDel" style="margin-top:1rem">${ICONS.trash}Delete</button>`;
      I.querySelector("#iText")?.addEventListener("input", e => { one.text = e.target.value; ctx.changed(); const pos = e.target.selectionStart; render(); const t = I.querySelector("#iText"); t.focus(); t.setSelectionRange(pos, pos); });
      I.querySelectorAll("[data-fill]").forEach(b => b.onclick = () => { items.forEach(o => { if (o.kind === "text") o.ink = b.dataset.fill; else o.color = b.dataset.fill; }); ctx.changed(); render(); });
      I.querySelectorAll("[data-size]").forEach(b => b.onclick = () => { one.size = +b.dataset.size; ctx.changed(); render(); });
      I.querySelectorAll("[data-al]").forEach(b => b.onclick = () => { const a = b.dataset.al, bx = bboxOf(items.filter(o => o.kind !== "pen")); if (a === "dist") { const s = [...items].sort((p, q) => p.x - q.x), tot = s.reduce((n, o) => n + o.w, 0), gap = (bx.w - tot) / Math.max(1, s.length - 1); let x = bx.x; s.forEach(o => { o.x = Math.round(x); x += o.w + gap; }); } else items.forEach(o => { if (a === "left") o.x = bx.x; if (a === "cx") o.x = Math.round(bx.x + bx.w / 2 - o.w / 2); if (a === "top") o.y = bx.y; if (a === "cy") o.y = Math.round(bx.y + bx.h / 2 - o.h / 2); }); ctx.changed(); render(); });
      I.querySelectorAll("[data-ar]").forEach(b => b.onclick = () => { const a = b.dataset.ar; if (a === "dup") return dup(); D.items = D.items.filter(o => !sel.has(o.id)); a === "front" ? D.items.push(...items) : D.items.unshift(...items); ctx.changed(); render(); });
      I.querySelector("#iDel").onclick = del;
    }
    function del() { if (selLink) { D.links = D.links.filter(l => l.id !== selLink); selLink = null; } else { D.items = D.items.filter(o => !sel.has(o.id)); D.links = D.links.filter(l => !sel.has(l.from) && !sel.has(l.to)); sel.clear(); } ctx.changed(); render(); }
    function dup() { const copies = [...sel].map(item).filter(Boolean).map(o => ({ ...JSON.parse(JSON.stringify(o)), id: uid(), x: (o.x || 0) + 24, y: (o.y || 0) + 24, points: o.points?.map(([a, b]) => [a + 24, b + 24]) })); D.items.push(...copies); sel = new Set(copies.map(c => c.id)); ctx.changed(); render(); }
    const keys = e => {
      if (editing || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
      if ((e.key === "Delete" || e.key === "Backspace") && (sel.size || selLink)) { e.preventDefault(); del(); }
      else if (mod && k === "d") { e.preventDefault(); dup(); } else if (mod && k === "a") { e.preventDefault(); sel = new Set(D.items.map(i => i.id)); render(); }
      else if (e.key === "Escape") { sel.clear(); selLink = null; setTool("select"); render(); }
      else if (e.key === "Enter" && sel.size === 1) { const it = item([...sel][0]); if (it.kind !== "pen" && it.kind !== "image") { e.preventDefault(); editText(it); } }
      else if (e.key.startsWith("Arrow") && sel.size) { e.preventDefault(); const s = e.shiftKey ? 20 : 2, [dx, dy] = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key]; [...sel].map(item).forEach(o => { if (o.points) o.points = o.points.map(([a, b]) => [a + dx, b + dy]); else { o.x += dx; o.y += dy; } }); ctx.changed(); render(); }
      else if (!mod && !e.altKey) { const t = TOOLS.find(x => x !== "|" && x[2] === k); if (t) setTool(t[0]); }
    };
    addEventListener("keydown", keys); setTool("select"); render(); if (!D.items.length) { D.view.z = 1; vp.apply(); } else setTimeout(fit, 0);
    return {
      reload(d) { D = d; D.view ||= { x: 80, y: 60, z: 1 }; vp.view.x = D.view.x; vp.view.y = D.view.y; vp.view.z = D.view.z; sel = new Set([...sel].filter(item)); render(); },
      destroy() { removeEventListener("keydown", keys); },
      canvas: () => ({ svg, world }),
      exports: () => [{ label: "Image (PNG)", icon: "download", run: () => { sel.clear(); selLink = null; render(); exportPNG(svg, world, ctx.doc.title); } }, { label: "Vector (SVG)", icon: "download", run: () => { sel.clear(); render(); exportSVG(svg, world, ctx.doc.title); } }],
    };
  }
  Modules.whiteboard = { blank, templates, mount };
})();
