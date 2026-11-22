/* Genogram: standard symbols and lines (after McGoldrick, Gerson & Petry), households, privacy mode and auto-layout. */
"use strict";
(() => {
  const S = 46, W = 132, GH = 200; // symbol size, horizontal slot, generation height
  const UNION = { married: "Married", cohabiting: "Living together", engaged: "Engaged", separated: "Separated", divorced: "Divorced", widowed: "Widowed" };
  const CHILD = { bio: "Biological", adopted: "Adopted", foster: "Foster" };
  const BOND = { close: ["Close", "#2F7D4F"], fused: ["Very close or fused", "#2F7D4F"], distant: ["Distant", "#5E6B70"], conflict: ["Conflict", "#B86E00"], closeConflict: ["Close but conflictual", "#B86E00"], cutoff: ["Cut off", "#5E6B70"], hostile: ["Hostile", "#C2413A"], abuse: ["Abuse or violence", "#C2413A"], caring: ["Caring or support", "#2F6DB5"] };
  const HALO = { stroke: "#FFFFFF", "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round" };
  const P = (name, sex, birth, extra = {}) => ({ id: uid(), name, sex, kind: "person", birth: birth ? String(birth) : "", death: "", deceased: false, index: false, occupation: "", notes: "", health: false, substance: false, nonFamily: false, x: null, y: null, ...extra });
  function blank() { const me = P("Client", "F", "1990", { index: true }); return { persons: [me], unions: [], children: [], bonds: [], households: [], privacy: false, showAges: true, view: { x: 0, y: 0, z: 1 } }; }
  const templates = { family: { title: "Family genogram", data: () => {
    const d = blank(); d.persons = []; const add = (...a) => { const p = P(...a); d.persons.push(p); return p; };
    const gf = add("Tan Ah Kow", "M", 1938, { deceased: true, death: "2015", health: true, notes: "Heart disease" }), gm = add("Lim Siew Lan", "F", 1942), ff = add("Abdul Rahman", "M", 1945), fm = add("Siti Aminah", "F", 1948);
    const father = add("Tan Wei Ming", "M", 1965, { occupation: "Taxi driver", substance: true }), mother = add("Nur Aisyah", "F", 1968, { occupation: "Cleaner" }), aunt = add("Tan Mei Ling", "F", 1970), step = add("Jason Lee", "M", 1966);
    const client = add("Tan Hui Min", "F", 1993, { index: true, occupation: "Student" }), bro = add("Tan Jun Jie", "M", 1996), twin1 = add("Nurul", "F", 2004), twin2 = add("Nadia", "F", 2004), helper = add("Maria (helper)", "F", 1985, { nonFamily: true, occupation: "Domestic helper" });
    const u = (a, b, type, start, end = "") => { const x = { id: uid(), a: a.id, b: b.id, type, start: String(start), end: String(end) }; d.unions.push(x); return x; };
    const u1 = u(gf, gm, "married", 1962), u2 = u(ff, fm, "married", 1964), u3 = u(father, mother, "divorced", 1992, 2001), u4 = u(mother, step, "married", 2003);
    const ch = (un, c, type = "bio", twin = null, identical = false) => d.children.push({ id: uid(), union: un.id, child: c.id, type, twin, identical });
    ch(u1, father); ch(u1, aunt); ch(u2, mother); ch(u3, client); ch(u3, bro); const tw = uid(); ch(u4, twin1, "bio", tw, true); ch(u4, twin2, "bio", tw, true);
    d.bonds.push({ id: uid(), a: client.id, b: gm.id, kind: "close" }, { id: uid(), a: father.id, b: mother.id, kind: "hostile" }, { id: uid(), a: client.id, b: father.id, kind: "distant" }, { id: uid(), a: bro.id, b: step.id, kind: "conflict" });
    d.households.push({ id: uid(), name: "Living together (HDB flat)", members: [mother.id, step.id, client.id, bro.id, twin1.id, twin2.id, helper.id] });
    return d; } } };
  function mount(ctx) {
    let D = ctx.doc.data, sel = null, multi = new Set(), selBond = null, selUnion = null, pos = {}, pending = null, drag = null;
    D.view ||= { x: 0, y: 0, z: 1 };
    const svg = svgEl("svg", { class: "canvas dotgrid", role: "img", "aria-label": "Genogram" }), world = svgEl("g", {}, svg); ctx.stage.append(svg);
    svgEl("defs", {}, svg).innerHTML = `<marker id="gnArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker>`;
    const vp = Viewport(svg, world, D.view, v => { zl.textContent = Math.round(v.z * 100) + "%"; svg.style.backgroundSize = `${22 * v.z}px ${22 * v.z}px`; svg.style.backgroundPosition = `${v.x}px ${v.y}px`; });
    const zb = h("div", { class: "zoombar" }), zl = h("span", {}, "100%"); [["zout", .8, "Zoom out"], [null], ["zin", 1.25, "Zoom in"], ["fit", 0, "Fit to screen"]].forEach(([ic, f, lbl]) => { if (!ic) return zb.append(zl); const b = h("button", { class: "icon", "aria-label": lbl, title: lbl, onclick: () => f ? vp.zoomBy(f) : fit() }); b.innerHTML = ICONS[ic]; zb.append(b); });
    const hud = h("div", { class: "hud" }); ctx.stage.append(zb, hud);
    const tools = h("div", { class: "row" }); const priv = h("button", { class: "btn", "aria-pressed": String(!!D.privacy), title: "Show initials only, for screen-sharing or printing" }); priv.innerHTML = ICONS.lock + `<span class="hide-s">Privacy</span>`; priv.onclick = () => { D.privacy = !D.privacy; priv.setAttribute("aria-pressed", String(D.privacy)); ctx.changed(); render(); toast(D.privacy ? "Privacy mode on: initials only" : "Privacy mode off"); }; tools.append(priv); ctx.setTools(tools);
    const person = id => D.persons.find(p => p.id === id), unionsOf = id => D.unions.filter(u => u.a === id || u.b === id), childLinks = uid2 => D.children.filter(c => c.union === uid2), parentLink = id => D.children.find(c => c.child === id);
    const yr = s => parseInt(s, 10), age = p => { const b = yr(p.birth); if (!b) return null; const e = p.deceased ? yr(p.death) : new Date().getFullYear(); return e ? e - b : null; };
    const display = p => D.privacy ? (p.name || "?").split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join("") : p.name;
    /* ---------- layout: generations in rows, partners side by side, children in birth order ---------- */
    function autoLayout() {
      const g = new Map(D.persons.map(p => [p.id, 0]));
      for (let it = 0; it < 60; it++) { let ch = false;
        for (const c of D.children) { const u = D.unions.find(x => x.id === c.union); if (!u) continue; const pg = Math.max(g.get(u.a) ?? 0, u.b ? g.get(u.b) ?? 0 : 0) + 1; if ((g.get(c.child) ?? 0) < pg) { g.set(c.child, pg); ch = true; } }
        for (const u of D.unions) { if (!u.b) continue; const m = Math.max(g.get(u.a), g.get(u.b)); if (g.get(u.a) !== m || g.get(u.b) !== m) { g.set(u.a, m); g.set(u.b, m); ch = true; } }
        if (!ch) break; }
      // which displayed family each person belongs to, so families that marry into each other sit side by side
      const fam = new Map(); let fi = 0; const spread = (id, idx) => { if (fam.has(id)) return; fam.set(id, idx); for (const u of unionsOf(id)) { const o = u.a === id ? u.b : u.a; if (o && !parentLink(o)) spread(o, idx); for (const c of childLinks(u.id)) spread(c.child, idx); } };
      [...D.persons].sort((a, b) => g.get(a.id) - g.get(b.id) || (yr(a.birth) || 9999) - (yr(b.birth) || 9999)).forEach(p => { if (!parentLink(p.id) && !fam.has(p.id) && !unionsOf(p.id).some(u => { const o = u.a === p.id ? u.b : u.a; return o && parentLink(o); })) spread(p.id, fi++); });
      D.persons.forEach(p => { if (!fam.has(p.id)) spread(p.id, fi++); });
      const outside = id => unionsOf(id).map(u => u.a === id ? u.b : u.a).filter(o => o && parentLink(o) && fam.get(o) !== fam.get(id)).map(o => fam.get(o));
      const placed = new Set(), slot = new Map(), byBirth = (a, b) => (yr(person(a.child)?.birth) || 9999) - (yr(person(b.child)?.birth) || 9999);
      const spousesOf = id => unionsOf(id).map(u => u.a === id ? u.b : u.a).filter(x => x && !parentLink(x) && !placed.has(x));
      const widthOf = (id, seen = new Set()) => { if (seen.has(id)) return 1; seen.add(id); const sp = spousesOf(id), own = 1 + sp.length; let kids = 0; for (const u of unionsOf(id)) for (const c of childLinks(u.id)) kids += widthOf(c.child, seen); return Math.max(own, kids); };
      const place = (id, x) => { if (placed.has(id)) return; const w = widthOf(id), sp = spousesOf(id); placed.add(id); sp.forEach(s => placed.add(s));
        // children of all this person's unions, left to right
        let cx = x; const kidsAll = []; for (const u of unionsOf(id)) for (const c of [...childLinks(u.id)].sort(byBirth)) kidsAll.push(c.child);
        const lean = k => { const o = outside(k), me = fam.get(k); return o.some(f => f > me) ? 1 : o.some(f => f < me) ? -1 : 0; }; kidsAll.sort((a, b) => lean(a) - lean(b));
        const kidsW = kidsAll.reduce((s, k) => s + widthOf(k), 0), start = x + (w - kidsW) / 2; cx = start;
        for (const k of kidsAll) { const kw = widthOf(k); place(k, cx); cx += kw; }
        const group = [id, ...sp], person0 = person(id), out = outside(id), me = fam.get(id), males = group.filter(i => person(i)?.sex === "M");
        // a partner from a family shown to the left: keep other partners on the right, and the reverse; otherwise male on the left by convention
        const order = out.some(f => f < me) ? [id, ...sp] : out.some(f => f > me) ? [...sp, id] : person0.sex === "F" && sp.length === 1 && person(sp[0]).sex === "M" ? [sp[0], id] : group;
        const gx = x + (w - order.length) / 2; order.forEach((pid, i) => slot.set(pid, gx + i)); void males;
      };
      let x = 0; const roots = [...D.persons].sort((a, b) => g.get(a.id) - g.get(b.id) || (yr(a.birth) || 9999) - (yr(b.birth) || 9999));
      for (const p of roots) { if (placed.has(p.id) || parentLink(p.id)) continue; const pu = unionsOf(p.id).map(u => u.a === p.id ? u.b : u.a).filter(Boolean); if (pu.some(s => parentLink(s) && !placed.has(s))) continue; place(p.id, x); x += widthOf(p.id) + .6; }
      for (const p of D.persons) if (!placed.has(p.id)) { place(p.id, x); x += 1.6; }
      // people with no family links who live in a household (such as a helper) sit in that household's row, beside its members
      const loose = D.persons.filter(p => !parentLink(p.id) && !unionsOf(p.id).length);
      for (const p of loose) { const hh = D.households.find(x => x.members.includes(p.id)); if (!hh) continue; const others = hh.members.filter(m => m !== p.id && !loose.some(l => l.id === m)); if (!others.length) continue;
        const counts = new Map(); others.forEach(m => counts.set(g.get(m), (counts.get(g.get(m)) || 0) + 1)); const row = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
        g.set(p.id, row); const taken = new Set(D.persons.filter(q => q.id !== p.id && g.get(q.id) === row).map(q => Math.round(slot.get(q.id) * 10))); let sl = Math.max(...others.filter(m => g.get(m) === row).map(m => slot.get(m))) + 1; while (taken.has(Math.round(sl * 10))) sl += 1; slot.set(p.id, sl); }
      pos = {}; for (const p of D.persons) pos[p.id] = { x: (slot.get(p.id) ?? 0) * W, y: (g.get(p.id) ?? 0) * GH };
    }
    function positions() { autoLayout(); for (const p of D.persons) if (p.x != null) pos[p.id] = { x: p.x, y: p.y }; }
    /* ---------- drawing ---------- */
    const line = (parent, x1, y1, x2, y2, st = {}) => svgEl("line", { x1, y1, x2, y2, stroke: "#1E2A2F", "stroke-width": 1.8, ...st }, parent);
    function symbol(g, p, x, y) {
      const small = p.kind !== "person", s = small ? S * .45 : S, half = s / 2, stroke = p.nonFamily ? { "stroke-dasharray": "5 4" } : {}, base = { fill: "#FFFFFF", stroke: "#1E2A2F", "stroke-width": 2, ...stroke };
      const clipId = "gc" + p.id; let shape;
      if (p.kind === "pregnancy") { shape = `M${x},${y - half} L${x + half},${y + half} L${x - half},${y + half}Z`; svgEl("path", { d: shape, ...base }, g); return; }
      if (p.kind === "miscarriage") { svgEl("circle", { cx: x, cy: y, r: half * .8, fill: "#1E2A2F" }, g); return; }
      if (p.kind === "abortion") { line(g, x - half, y - half, x + half, y + half, { "stroke-width": 2.4 }); line(g, x - half, y + half, x + half, y - half, { "stroke-width": 2.4 }); return; }
      const draw = (attrs, cls) => p.sex === "M" || p.sex === "U" ? svgEl("rect", { x: x - half, y: y - half, width: s, height: s, ...attrs, class: cls }, g) : p.sex === "F" ? svgEl("circle", { cx: x, cy: y, r: half, ...attrs, class: cls }, g) : svgEl("path", { d: `M${x},${y - half * 1.15} L${x + half * 1.15},${y} L${x},${y + half * 1.15} L${x - half * 1.15},${y}Z`, ...attrs, class: cls }, g);
      if (p.index) draw({ fill: "none", stroke: "#1E2A2F", "stroke-width": 2, transform: `translate(${x},${y}) scale(1.22) translate(${-x},${-y})` });
      const cp = svgEl("clipPath", { id: clipId }, g); draw({}, null).remove(); const c2 = p.sex === "M" || p.sex === "U" ? svgEl("rect", { x: x - half, y: y - half, width: s, height: s }, cp) : p.sex === "F" ? svgEl("circle", { cx: x, cy: y, r: half }, cp) : svgEl("path", { d: `M${x},${y - half * 1.15} L${x + half * 1.15},${y} L${x},${y + half * 1.15} L${x - half * 1.15},${y}Z` }, cp); void c2;
      draw(base);
      if (p.health) svgEl("rect", { x: x - half * 1.2, y: y - half * 1.2, width: half * 1.2, height: s * 1.2, fill: "#1E2A2F", "clip-path": `url(#${clipId})` }, g);
      if (p.substance) svgEl("rect", { x: x - half * 1.2, y, width: s * 1.2, height: half * 1.2, fill: "#1E2A2F", "clip-path": `url(#${clipId})`, opacity: p.health ? .75 : 1 }, g);
      if (p.sex === "U" && p.kind === "person") { const t = svgEl("text", { x, y: y + 6, "text-anchor": "middle", "font-size": 18, "font-weight": 700, fill: "#1E2A2F" }, g); t.textContent = "?"; }
      const a = age(p); if (D.showAges && a != null && !p.health && !p.substance && p.kind === "person") { const t = svgEl("text", { x, y: y + 5, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: "#1E2A2F" }, g); t.textContent = a; }
      if (p.deceased || p.kind === "stillbirth") { line(g, x - half * 1.15, y - half * 1.15, x + half * 1.15, y + half * 1.15, { "stroke-width": 2 }); line(g, x - half * 1.15, y + half * 1.15, x + half * 1.15, y - half * 1.15, { "stroke-width": 2 }); }
    }
    function render() {
      positions(); world.innerHTML = ""; const L = { households: svgEl("g", {}, world), unions: svgEl("g", {}, world), bonds: svgEl("g", {}, world), people: svgEl("g", {}, world) }, used = new Set();
      // households
      for (const hh of D.households) {
        const pts = hh.members.map(id => pos[id]).filter(Boolean); if (!pts.length) continue; used.add("household");
        const rows = new Map(); pts.forEach(p => { const k = Math.round(p.y / 10); if (!rows.has(k)) rows.set(k, []); rows.get(k).push(p); });
        const boxes = []; [...rows.values()].forEach(r => { r.sort((a, b) => a.x - b.x); let cur = [r[0]]; for (let i = 1; i < r.length; i++) { if (r[i].x - r[i - 1].x > W * 1.6) { boxes.push(cur); cur = []; } cur.push(r[i]); } boxes.push(cur); });
        const rects = boxes.map(c => bboxOf(c.map(p => ({ x: p.x - 58, y: p.y - 44, w: 116, h: 112 })))).sort((a, b) => a.y - b.y || a.x - b.x);
        const st = { fill: "rgba(14,124,123,.05)", stroke: "#0E7C7B", "stroke-width": 1.6, "stroke-dasharray": "3 6", "stroke-linecap": "round" };
        rects.forEach(r => svgEl("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 24, ...st }, L.households));
        for (let i = 1; i < rects.length; i++) { const a = rects[i - 1], c = rects[i]; let d;
          if (Math.abs(a.y - c.y) < 20) { const [l, r] = a.x < c.x ? [a, c] : [c, a]; d = `M${l.x + l.w},${l.y + l.h / 2} L${r.x},${r.y + r.h / 2}`; } // same row: join side to side
          else { const ax = Math.max(a.x + 20, Math.min(a.x + a.w - 20, c.x + c.w / 2)), cx2 = Math.max(c.x + 20, Math.min(c.x + c.w - 20, ax)); d = `M${ax},${a.y + a.h} L${cx2},${c.y}`; }
          svgEl("path", { d, fill: "none", ...st, "stroke-width": 1.6 }, L.households); }
        const t = svgEl("text", { x: rects[0].x + 14, y: rects[0].y - 8, "font-size": 12.5, "font-weight": 600, fill: "#0E7C7B" }, L.households); t.textContent = hh.name || "Household";
      }
      // unions and children
      for (const u of D.unions) {
        const A = pos[u.a], B = u.b ? pos[u.b] : null; if (!A) continue; const g = svgEl("g", { class: "gn-union" + (selUnion === u.id ? " sel" : ""), "data-union": u.id }, L.unions), yb = Math.max(A.y, B?.y ?? A.y) + S / 2 + 64;
        let mid;
        if (B) { const dash = u.type === "cohabiting" || u.type === "engaged" ? "8 6" : null; line(g, A.x, A.y + S / 2, A.x, yb); line(g, B.x, B.y + S / 2, B.x, yb); line(g, A.x, yb, B.x, yb, { "stroke-dasharray": dash, stroke: selUnion === u.id ? "#E9A23B" : "#1E2A2F", "stroke-width": selUnion === u.id ? 3 : 1.8 }); svgEl("line", { x1: A.x, y1: yb, x2: B.x, y2: yb, stroke: "transparent", "stroke-width": 14 }, g); mid = (A.x + B.x) / 2;
          const slashes = u.type === "separated" ? 1 : u.type === "divorced" ? 2 : 0; for (let i = 0; i < slashes; i++) { const sx = mid - 8 + i * 9; line(g, sx - 6, yb + 10, sx + 6, yb - 10, { "stroke-width": 2 }); }
          const lab = [u.start ? (u.type === "cohabiting" ? "lt. " : u.type === "engaged" ? "e. " : "m. ") + u.start : "", u.end ? (u.type === "divorced" ? "d. " : u.type === "separated" ? "s. " : "") + u.end : ""].filter(Boolean).join("  "); if (lab) { const t = svgEl("text", { x: mid, y: yb + 16, "text-anchor": "middle", "font-size": 11.5, fill: "#5E6B70", "font-weight": 600, ...HALO }, g); t.textContent = lab; }
          used.add("u-" + u.type);
        } else mid = A.x;
        const kids = childLinks(u.id).map(c => ({ c, p: pos[c.child] })).filter(k => k.p).sort((a, b) => a.p.x - b.p.x); if (!kids.length) continue;
        const sy = Math.min(...kids.map(k => k.p.y)) - S / 2 - 34, startY = B ? yb : A.y + S / 2; line(g, mid, startY, mid, sy);
        const twins = new Map(); kids.forEach(k => { if (k.c.twin) { if (!twins.has(k.c.twin)) twins.set(k.c.twin, []); twins.get(k.c.twin).push(k); } });
        const xs = kids.map(k => k.c.twin ? twins.get(k.c.twin).reduce((s, t) => s + t.p.x, 0) / twins.get(k.c.twin).length : k.p.x); line(g, Math.min(mid, ...xs), sy, Math.max(mid, ...xs), sy);
        for (const k of kids) { const dash = k.c.type === "adopted" ? "7 5" : k.c.type === "foster" ? "2 4" : null, top = k.p.y - S / 2; if (k.c.twin) { const grp = twins.get(k.c.twin), tx = grp.reduce((s, t) => s + t.p.x, 0) / grp.length; line(g, tx, sy, k.p.x, top, { "stroke-dasharray": dash }); } else line(g, k.p.x, sy, k.p.x, top, { "stroke-dasharray": dash }); used.add("c-" + k.c.type); }
        for (const [, grp] of twins) { if (grp.length < 2) continue; used.add("twins"); if (grp[0].c.identical) { used.add("identical"); const tx = grp.reduce((s, t) => s + t.p.x, 0) / grp.length, f = .45, y2 = sy + (grp[0].p.y - S / 2 - sy) * f; line(g, tx + (grp[0].p.x - tx) * f, y2, tx + (grp[grp.length - 1].p.x - tx) * f, y2); } }
      }
      // emotional relationships
      for (const b of D.bonds) { const A = pos[b.a], B = pos[b.b]; if (!A || !B) continue; used.add("b-" + b.kind); drawBond(L.bonds, b, A, B); }
      // people
      for (const p of D.persons) {
        const Q = pos[p.id], g = svgEl("g", { class: "gn-person" + (sel === p.id || multi.has(p.id) ? " sel" : "") + (pending ? " pick" : ""), "data-id": p.id, tabindex: 0, role: "button", "aria-label": `${p.name}${p.deceased ? ", died" : ""}` }, L.people);
        if (sel === p.id || multi.has(p.id)) svgEl("rect", { x: Q.x - S / 2 - 10, y: Q.y - S / 2 - 10, width: S + 20, height: S + 20, rx: 12, fill: "rgba(233,162,59,.18)", stroke: "#E9A23B", "stroke-width": 2, class: "ui-only" }, g);
        svgEl("rect", { x: Q.x - W / 2 + 8, y: Q.y - S / 2 - 8, width: W - 16, height: S + 62, fill: "transparent" }, g);
        symbol(g, p, Q.x, Q.y);
        const nm = svgEl("text", { x: Q.x, y: Q.y + S / 2 + 18, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#1E2A2F", ...HALO }, g); nm.textContent = display(p).length > 18 ? display(p).slice(0, 17) + "…" : display(p);
        const yrs = [p.birth ? (D.privacy ? "" : "b. " + p.birth) : "", p.deceased && p.death ? "d. " + p.death : ""].filter(Boolean).join("  "); if (yrs) { const t = svgEl("text", { x: Q.x, y: Q.y + S / 2 + 33, "text-anchor": "middle", "font-size": 11.5, fill: "#5E6B70", ...HALO }, g); t.textContent = yrs; }
        if (p.occupation && !D.privacy) { const t = svgEl("text", { x: Q.x, y: Q.y + S / 2 + (yrs ? 47 : 33), "text-anchor": "middle", "font-size": 11, fill: "#5E6B70", "font-style": "italic", ...HALO }, g); t.textContent = p.occupation.length > 20 ? p.occupation.slice(0, 19) + "…" : p.occupation; }
        used.add("s-" + (p.kind === "person" ? p.sex : p.kind)); if (p.deceased) used.add("deceased"); if (p.index) used.add("index"); if (p.health) used.add("health"); if (p.substance) used.add("substance"); if (p.nonFamily) used.add("nonfamily");
      }
      legend(used); hud.textContent = pending ? pending.msg : D.persons.length < 2 ? "Select the client, then use the panel to add family members." : "Click a person to edit or add relatives. Drag to fine-tune; Tidy layout puts everyone back.";
      renderInsp();
    }
    function drawBond(parent, b, A, B) {
      const [name, col] = BOND[b.kind] || BOND.close, g = svgEl("g", { class: "gn-bond" + (selBond === b.id ? " sel" : ""), "data-bond": b.id }, parent), dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, nx = -uy, ny = ux, r = S / 2 + 6, x1 = A.x + ux * r, y1 = A.y + uy * r, x2 = B.x - ux * r, y2 = B.y - uy * r, st = { stroke: selBond === b.id ? "#E9A23B" : col, "stroke-width": 1.8, fill: "none" };
      svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 14 }, g);
      const par = (n, gap = 4) => { for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * gap; svgEl("line", { x1: x1 + nx * o, y1: y1 + ny * o, x2: x2 + nx * o, y2: y2 + ny * o, ...st }, g); } };
      const zig = (o = 0, amp = 6) => { const L2 = Math.hypot(x2 - x1, y2 - y1), n = Math.max(4, Math.floor(L2 / 12)); let dd = `M${x1 + nx * o},${y1 + ny * o}`; for (let i = 1; i <= n; i++) { const t = i / n, s = i === n ? 0 : (i % 2 ? amp : -amp); dd += ` L${x1 + (x2 - x1) * t + nx * (s + o)},${y1 + (y2 - y1) * t + ny * (s + o)}`; } svgEl("path", { d: dd, ...st }, g); };
      if (b.kind === "close") par(2, 5); else if (b.kind === "fused") par(3, 5); else if (b.kind === "distant") svgEl("line", { x1, y1, x2, y2, ...st, "stroke-dasharray": "2 6", "stroke-linecap": "round", "stroke-width": 2.4 }, g);
      else if (b.kind === "conflict" || b.kind === "hostile") zig(0, b.kind === "hostile" ? 8 : 6); else if (b.kind === "closeConflict") { par(2, 12); zig(0, 5); }
      else if (b.kind === "cutoff") { svgEl("line", { x1, y1, x2, y2, ...st }, g); const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; [-5, 5].forEach(o => svgEl("line", { x1: mx + ux * o - nx * 9, y1: my + uy * o - ny * 9, x2: mx + ux * o + nx * 9, y2: my + uy * o + ny * 9, ...st, "stroke-width": 2.4 }, g)); }
      else if (b.kind === "abuse") { zig(0, 7); svgEl("line", { x1: x2 - ux * 2, y1: y2 - uy * 2, x2, y2, ...st, "marker-end": "url(#gnArrow)" }, g); }
      else if (b.kind === "caring") svgEl("line", { x1, y1, x2, y2, ...st, "stroke-width": 2.2, "marker-end": "url(#gnArrow)" }, g);
      svgEl("title", {}, g).textContent = `${name}: ${person(b.a)?.name} and ${person(b.b)?.name}`;
    }
    function legend(used) {
      let L = $("#gnLegend", ctx.stage); if (!L) { L = h("div", { class: "gn-legend", id: "gnLegend" }); ctx.stage.append(L); }
      const sw = (svgInner, label) => `<span><svg viewBox="0 0 40 24" aria-hidden="true">${svgInner}</svg>${label}</span>`;
      const items = [];
      if (used.has("s-M")) items.push(sw('<rect x="12" y="4" width="16" height="16" fill="#fff" stroke="#1E2A2F" stroke-width="2"/>', "Male")); if (used.has("s-F")) items.push(sw('<circle cx="20" cy="12" r="8" fill="#fff" stroke="#1E2A2F" stroke-width="2"/>', "Female")); if (used.has("s-X")) items.push(sw('<path d="M20 2 30 12 20 22 10 12Z" fill="#fff" stroke="#1E2A2F" stroke-width="2"/>', "Another gender")); if (used.has("s-U")) items.push(sw('<rect x="12" y="4" width="16" height="16" fill="#fff" stroke="#1E2A2F" stroke-width="2"/><text x="20" y="17" text-anchor="middle" font-size="12" font-weight="700">?</text>', "Unknown"));
      if (used.has("index")) items.push(sw('<circle cx="20" cy="12" r="10" fill="none" stroke="#1E2A2F" stroke-width="1.6"/><circle cx="20" cy="12" r="7" fill="#fff" stroke="#1E2A2F" stroke-width="2"/>', "Index person")); if (used.has("deceased")) items.push(sw('<rect x="12" y="4" width="16" height="16" fill="#fff" stroke="#1E2A2F" stroke-width="2"/><path d="M10 2 30 22M10 22 30 2" stroke="#1E2A2F" stroke-width="2"/>', "Died"));
      if (used.has("s-pregnancy")) items.push(sw('<path d="M20 4 28 20 12 20Z" fill="#fff" stroke="#1E2A2F" stroke-width="2"/>', "Pregnancy")); if (used.has("s-miscarriage")) items.push(sw('<circle cx="20" cy="12" r="5" fill="#1E2A2F"/>', "Miscarriage")); if (used.has("s-abortion")) items.push(sw('<path d="M14 6 26 18M14 18 26 6" stroke="#1E2A2F" stroke-width="2.4"/>', "Abortion")); if (used.has("s-stillbirth")) items.push(sw('<rect x="15" y="7" width="10" height="10" fill="#fff" stroke="#1E2A2F" stroke-width="2"/><path d="M13 5 27 19M13 19 27 5" stroke="#1E2A2F" stroke-width="2"/>', "Stillbirth"));
      if (used.has("health")) items.push(sw('<rect x="12" y="4" width="16" height="16" fill="#fff" stroke="#1E2A2F" stroke-width="2"/><rect x="12" y="4" width="8" height="16" fill="#1E2A2F"/>', "Health condition")); if (used.has("substance")) items.push(sw('<rect x="12" y="4" width="16" height="16" fill="#fff" stroke="#1E2A2F" stroke-width="2"/><rect x="12" y="12" width="16" height="8" fill="#1E2A2F"/>', "Substance use")); if (used.has("nonfamily")) items.push(sw('<circle cx="20" cy="12" r="8" fill="#fff" stroke="#1E2A2F" stroke-width="2" stroke-dasharray="4 3"/>', "Not family, lives in household"));
      Object.entries(UNION).forEach(([k, n]) => { if (!used.has("u-" + k)) return; const dash = k === "cohabiting" || k === "engaged" ? ' stroke-dasharray="6 4"' : "", sl = k === "separated" ? '<path d="M17 18 23 6" stroke="#1E2A2F" stroke-width="2"/>' : k === "divorced" ? '<path d="M14 18 20 6M19 18 25 6" stroke="#1E2A2F" stroke-width="2"/>' : ""; items.push(sw(`<path d="M4 12H36"${dash} stroke="#1E2A2F" stroke-width="2"/>${sl}`, n)); });
      Object.entries(CHILD).forEach(([k, n]) => { if (!used.has("c-" + k) || k === "bio") return; items.push(sw(`<path d="M20 2V22" stroke="#1E2A2F" stroke-width="2" stroke-dasharray="${k === "adopted" ? "6 4" : "2 3"}"/>`, n + " child")); });
      if (used.has("identical")) items.push(sw('<path d="M20 2 10 22M20 2 30 22M14 14H26" stroke="#1E2A2F" stroke-width="2"/>', "Identical twins")); else if (used.has("twins")) items.push(sw('<path d="M20 2 10 22M20 2 30 22" stroke="#1E2A2F" stroke-width="2"/>', "Twins"));
      Object.entries(BOND).forEach(([k, [n, c]]) => { if (!used.has("b-" + k)) return; const inner = { close: `<path d="M4 9H36M4 15H36" stroke="${c}" stroke-width="2"/>`, fused: `<path d="M4 7H36M4 12H36M4 17H36" stroke="${c}" stroke-width="2"/>`, distant: `<path d="M4 12H36" stroke="${c}" stroke-width="2.4" stroke-dasharray="2 5" stroke-linecap="round"/>`, conflict: `<path d="M4 12 8 7 12 17 16 7 20 17 24 7 28 17 32 7 36 12" fill="none" stroke="${c}" stroke-width="2"/>`, closeConflict: `<path d="M4 6H36M4 18H36" stroke="${c}" stroke-width="2"/><path d="M4 12 8 9 12 15 16 9 20 15 24 9 28 15 32 9 36 12" fill="none" stroke="${c}" stroke-width="2"/>`, cutoff: `<path d="M4 12H36M17 5V19M23 5V19" stroke="${c}" stroke-width="2"/>`, hostile: `<path d="M4 12 8 5 12 19 16 5 20 19 24 5 28 19 32 5 36 12" fill="none" stroke="${c}" stroke-width="2"/>`, abuse: `<path d="M4 12 8 7 12 17 16 7 20 17 24 7 28 12H34" fill="none" stroke="${c}" stroke-width="2"/><path d="M30 8 36 12 30 16" fill="none" stroke="${c}" stroke-width="2"/>`, caring: `<path d="M4 12H34" stroke="${c}" stroke-width="2"/><path d="M30 8 36 12 30 16" fill="none" stroke="${c}" stroke-width="2"/>` }[k]; items.push(sw(inner, n)); });
      if (used.has("household")) items.push(sw('<rect x="4" y="4" width="32" height="16" rx="7" fill="none" stroke="#0E7C7B" stroke-width="1.8" stroke-dasharray="2 4" stroke-linecap="round"/>', "Household"));
      L.innerHTML = items.length ? `<b>Key</b>${items.join("")}` : ""; L.hidden = !items.length;
    }
    function fit() { positions(); const b = bboxOf(Object.values(pos).map(p => ({ x: p.x - 70, y: p.y - 60, w: 140, h: 150 }))); if (b) vp.fit(b, 50); }
    /* ---------- relatives ---------- */
    function addPartner(id, type = "married") { const me = person(id), p = P("Partner", me.sex === "M" ? "F" : me.sex === "F" ? "M" : "U", ""); D.persons.push(p); D.unions.push({ id: uid(), a: me.sex === "F" ? p.id : id, b: me.sex === "F" ? id : p.id, type, start: "", end: "" }); sel = p.id; ctx.changed(); render(); toast("Partner added. Type their name in the panel."); }
    function addChild(id, unionId) { let u = unionId ? D.unions.find(x => x.id === unionId) : unionsOf(id)[0]; if (!u) { u = { id: uid(), a: id, b: null, type: "married", start: "", end: "" }; D.unions.push(u); } const c = P("Child", "U", ""); D.persons.push(c); D.children.push({ id: uid(), union: u.id, child: c.id, type: "bio", twin: null, identical: false }); sel = c.id; ctx.changed(); render(); }
    function addParents(id) { if (parentLink(id)) return toast("This person already has parents shown."); const f = P("Father", "M", ""), m = P("Mother", "F", ""), u = { id: uid(), a: f.id, b: m.id, type: "married", start: "", end: "" }; D.persons.push(f, m); D.unions.push(u); D.children.push({ id: uid(), union: u.id, child: id, type: "bio", twin: null, identical: false }); sel = f.id; ctx.changed(); render(); }
    function addSibling(id) { let pl = parentLink(id); if (!pl) { addParents(id); pl = parentLink(id); } const s = P("Sibling", "U", ""); D.persons.push(s); D.children.push({ id: uid(), union: pl.union, child: s.id, type: "bio", twin: null, identical: false }); sel = s.id; ctx.changed(); render(); }
    function removePerson(id) { const p = person(id); D.persons = D.persons.filter(x => x !== p); D.children = D.children.filter(c => c.child !== id); const gone = D.unions.filter(u => u.a === id || u.b === id); gone.forEach(u => { if (u.a === id && u.b) { u.a = u.b; u.b = null; } else if (u.b === id) u.b = null; else D.unions = D.unions.filter(x => x !== u); }); D.unions = D.unions.filter(u => u.a && (u.b || D.children.some(c => c.union === u.id))); D.children = D.children.filter(c => D.unions.some(u => u.id === c.union)); D.bonds = D.bonds.filter(b => b.a !== id && b.b !== id); D.households.forEach(hh => hh.members = hh.members.filter(m => m !== id)); D.households = D.households.filter(hh => hh.members.length); sel = null; ctx.changed(); render(); }
    /* ---------- interaction ---------- */
    svg.addEventListener("pointerdown", e => {
      const n = e.target.closest?.("[data-id]"), b = e.target.closest?.("[data-bond]"), u = e.target.closest?.("[data-union]");
      if (n) { const id = n.dataset.id; if (pending) { pending.done(id); pending = null; render(); e.stopPropagation(); return; } if (e.shiftKey) { multi.has(id) ? multi.delete(id) : multi.add(id); if (sel) multi.add(sel); sel = null; } else { sel = id; multi.clear(); } selBond = selUnion = null; const p = vp.toWorld(e.clientX, e.clientY); drag = { id, sx: p.x, sy: p.y, ox: pos[id].x, oy: pos[id].y, moved: false }; svg.setPointerCapture(e.pointerId); render(); e.stopPropagation(); return; }
      if (b) { selBond = b.dataset.bond; sel = selUnion = null; multi.clear(); render(); return; }
      if (u) { selUnion = u.dataset.union; sel = selBond = null; multi.clear(); render(); return; }
      if (pending) { pending = null; render(); }
    }, true);
    svg.addEventListener("pointermove", e => { if (!drag) return; const p = vp.toWorld(e.clientX, e.clientY); if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) < 4) return; drag.moved = true; const pr = person(drag.id); pr.x = Math.round((drag.ox + p.x - drag.sx) / 10) * 10; pr.y = Math.round((drag.oy + p.y - drag.sy) / 10) * 10; render(); });
    svg.addEventListener("pointerup", () => { if (drag?.moved) ctx.changed(); drag = null; });
    /* ---------- inspector ---------- */
    function renderInsp() {
      const I = ctx.insp, sx = (v, cur) => `<option value="${v}" ${cur === v ? "selected" : ""}>`;
      if (multi.size > 1) { I.innerHTML = `<h2>${multi.size} people</h2><p class="hint">Group them to show who lives together.</p><label class="field"><span>Household name</span><input id="hhName" value="Living together"></label><button class="btn primary block" id="hhGo">Show as a household</button>`; I.querySelector("#hhGo").onclick = () => { D.households.push({ id: uid(), name: I.querySelector("#hhName").value.trim(), members: [...multi] }); multi.clear(); ctx.changed(); render(); toast("Household added"); }; return; }
      if (selBond) { const b = D.bonds.find(x => x.id === selBond); I.innerHTML = `<h2>Relationship</h2><p class="hint">${esc(person(b.a)?.name)} and ${esc(person(b.b)?.name)}</p><label class="field"><span>Kind</span><select id="bk">${Object.entries(BOND).map(([k, [n]]) => `<option value="${k}" ${b.kind === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>${b.kind === "abuse" || b.kind === "caring" ? `<button class="btn" id="bRev">Swap direction</button>` : ""}<button class="btn danger block" id="bDel" style="margin-top:.8rem">${ICONS.trash}Remove</button>`; I.querySelector("#bk").onchange = e => { b.kind = e.target.value; ctx.changed(); render(); }; I.querySelector("#bRev")?.addEventListener("click", () => { [b.a, b.b] = [b.b, b.a]; ctx.changed(); render(); }); I.querySelector("#bDel").onclick = () => { D.bonds = D.bonds.filter(x => x !== b); selBond = null; ctx.changed(); render(); }; return; }
      if (selUnion) { const u = D.unions.find(x => x.id === selUnion); I.innerHTML = `<h2>Couple</h2><p class="hint">${esc(person(u.a)?.name)}${u.b ? " and " + esc(person(u.b)?.name) : ""}</p><label class="field"><span>Relationship</span><select id="uT">${Object.entries(UNION).map(([k, n]) => `<option value="${k}" ${u.type === k ? "selected" : ""}>${n}</option>`).join("")}</select></label><div class="row2"><label class="field"><span>From (year)</span><input id="uS" value="${esc(u.start)}" inputmode="numeric"></label><label class="field"><span>Ended (year)</span><input id="uE" value="${esc(u.end)}" inputmode="numeric"></label></div><button class="btn" id="uC">${ICONS.plus}Add a child</button><h3>Children</h3>${childLinks(u.id).map(c => `<div class="row2"><span>${esc(person(c.child)?.name)}</span><select data-ct="${c.id}">${Object.entries(CHILD).map(([k, n]) => `<option value="${k}" ${c.type === k ? "selected" : ""}>${n}</option>`).join("")}</select></div>`).join("") || `<p class="note">None yet.</p>`}<button class="btn danger block" id="uDel" style="margin-top:.8rem">${ICONS.trash}Remove this couple line</button>`;
        I.querySelector("#uT").onchange = e => { u.type = e.target.value; ctx.changed(); render(); }; I.querySelector("#uS").onchange = e => { u.start = e.target.value.trim(); ctx.changed(); render(); }; I.querySelector("#uE").onchange = e => { u.end = e.target.value.trim(); ctx.changed(); render(); }; I.querySelector("#uC").onclick = () => addChild(u.a, u.id); I.querySelectorAll("[data-ct]").forEach(s => s.onchange = () => { D.children.find(c => c.id === s.dataset.ct).type = s.value; ctx.changed(); render(); }); I.querySelector("#uDel").onclick = () => { D.children = D.children.filter(c => c.union !== u.id); D.unions = D.unions.filter(x => x !== u); selUnion = null; ctx.changed(); render(); }; return; }
      const p = person(sel);
      if (!p) { I.innerHTML = `<h2>Genogram</h2><p class="hint">Click a person to edit them or add relatives. Click a couple’s line to set marriage, separation or divorce. Shift-click several people to show a household.</p><button class="btn block" id="gAdd">${ICONS.plus}Add an unconnected person</button><h3>Display</h3><label class="check"><input type="checkbox" id="gAge" ${D.showAges ? "checked" : ""}> Show ages inside symbols</label><label class="check"><input type="checkbox" id="gPriv" ${D.privacy ? "checked" : ""}> Privacy mode: initials only, no birth years or jobs</label><button class="btn block" id="gTidy">Tidy layout</button><p class="note">Symbols follow widely used genogram conventions (McGoldrick, Gerson and Petry). Check your agency’s own guidance too. Genograms hold sensitive information: keep this browser and any exported files secure, and follow your consent and data protection practice (for example the PDPA in Singapore).</p>`; I.querySelector("#gAdd").onclick = () => { const n = P("Person", "U", ""); D.persons.push(n); sel = n.id; ctx.changed(); render(); }; I.querySelector("#gAge").onchange = e => { D.showAges = e.target.checked; ctx.changed(); render(); }; I.querySelector("#gPriv").onchange = e => { D.privacy = e.target.checked; priv.setAttribute("aria-pressed", String(D.privacy)); ctx.changed(); render(); }; I.querySelector("#gTidy").onclick = tidy; return; }
      const pl = parentLink(p.id);
      I.innerHTML = `<h2>Person</h2><label class="field"><span>Name</span><input id="pN" value="${esc(p.name)}"></label>
        <div class="row2"><label class="field"><span>Shown as</span><select id="pK">${sx("person", p.kind)}Person</option>${sx("pregnancy", p.kind)}Pregnancy</option>${sx("miscarriage", p.kind)}Miscarriage</option>${sx("stillbirth", p.kind)}Stillbirth</option>${sx("abortion", p.kind)}Abortion</option></select></label><label class="field"><span>Sex or gender</span><select id="pS">${sx("M", p.sex)}Male</option>${sx("F", p.sex)}Female</option>${sx("X", p.sex)}Another gender</option>${sx("U", p.sex)}Unknown</option></select></label></div>
        <div class="row2"><label class="field"><span>Born (year)</span><input id="pB" value="${esc(p.birth)}" inputmode="numeric" placeholder="1985"></label><label class="field"><span>Died (year)</span><input id="pD" value="${esc(p.death)}" inputmode="numeric" ${p.deceased ? "" : "disabled"}></label></div>
        <label class="check"><input type="checkbox" id="pDc" ${p.deceased ? "checked" : ""}> Has died</label><label class="check"><input type="checkbox" id="pI" ${p.index ? "checked" : ""}> Index person (the client)</label>
        <label class="field"><span>Occupation or role</span><input id="pO" value="${esc(p.occupation)}"></label>
        <label class="check"><input type="checkbox" id="pH" ${p.health ? "checked" : ""}> Physical or mental health condition</label><label class="check"><input type="checkbox" id="pSu" ${p.substance ? "checked" : ""}> Substance use</label><label class="check"><input type="checkbox" id="pNf" ${p.nonFamily ? "checked" : ""}> Not family, but lives in the household (for example a domestic helper)</label>
        <label class="field"><span>Notes</span><textarea id="pNt" placeholder="Key events, culture, languages, faith, caregiving roles">${esc(p.notes)}</textarea></label>
        <h3>Add relatives</h3><div class="chips"><button class="chip" id="aP">Partner</button><button class="chip" id="aC">Child</button>${pl ? "" : `<button class="chip" id="aPa">Parents</button>`}<button class="chip" id="aS">Sibling</button></div>
        ${pl ? `<div class="row2" style="margin-top:.5rem"><label class="field"><span>Relationship to parents</span><select id="pCt">${Object.entries(CHILD).map(([k, n]) => `<option value="${k}" ${pl.type === k ? "selected" : ""}>${n}</option>`).join("")}</select></label><label class="field"><span>Twin of</span><select id="pTw"><option value="">Not a twin</option>${childLinks(pl.union).filter(c => c.child !== p.id).map(c => `<option value="${c.child}" ${pl.twin && c.twin === pl.twin ? "selected" : ""}>${esc(person(c.child)?.name)}</option>`).join("")}</select></label></div>${pl.twin ? `<label class="check"><input type="checkbox" id="pId" ${pl.identical ? "checked" : ""}> Identical twins</label>` : ""}` : ""}
        <h3>Relationship lines</h3><label class="field"><span>Add a line to another person</span><select id="bNew"><option value="">Choose a kind…</option>${Object.entries(BOND).map(([k, [n]]) => `<option value="${k}">${n}</option>`).join("")}</select></label>
        <button class="btn danger block" id="pX" style="margin-top:.8rem">${ICONS.trash}Remove person</button>`;
      const set = (k, v, re = true) => { p[k] = v; ctx.changed(); if (re) render(); };
      I.querySelector("#pN").oninput = e => { p.name = e.target.value; ctx.changed(); render(); const el = ctx.insp.querySelector("#pN"); el.focus(); el.setSelectionRange(el.value.length, el.value.length); };
      I.querySelector("#pK").onchange = e => set("kind", e.target.value); I.querySelector("#pS").onchange = e => set("sex", e.target.value); I.querySelector("#pB").onchange = e => set("birth", e.target.value.trim()); I.querySelector("#pD").onchange = e => set("death", e.target.value.trim());
      I.querySelector("#pDc").onchange = e => set("deceased", e.target.checked); I.querySelector("#pI").onchange = e => { if (e.target.checked) D.persons.forEach(x => x.index = false); set("index", e.target.checked); };
      I.querySelector("#pO").onchange = e => set("occupation", e.target.value.trim()); I.querySelector("#pH").onchange = e => set("health", e.target.checked); I.querySelector("#pSu").onchange = e => set("substance", e.target.checked); I.querySelector("#pNf").onchange = e => set("nonFamily", e.target.checked); I.querySelector("#pNt").oninput = e => set("notes", e.target.value, false);
      I.querySelector("#aP").onclick = () => addPartner(p.id); I.querySelector("#aC").onclick = () => addChild(p.id); I.querySelector("#aPa")?.addEventListener("click", () => addParents(p.id)); I.querySelector("#aS").onclick = () => addSibling(p.id);
      I.querySelector("#pCt")?.addEventListener("change", e => { pl.type = e.target.value; ctx.changed(); render(); });
      I.querySelector("#pTw")?.addEventListener("change", e => { const other = childLinks(pl.union).find(c => c.child === e.target.value); if (!other) { pl.twin = null; pl.identical = false; } else { const g = other.twin || uid(); other.twin = g; pl.twin = g; } ctx.changed(); render(); });
      I.querySelector("#pId")?.addEventListener("change", e => { childLinks(pl.union).filter(c => c.twin === pl.twin).forEach(c => c.identical = e.target.checked); ctx.changed(); render(); });
      I.querySelector("#bNew").onchange = e => { const kind = e.target.value; if (!kind) return; pending = { msg: `Click the other person for “${BOND[kind][0]}”. Press Esc to cancel.`, done: other => { if (other !== p.id) { D.bonds.push({ id: uid(), a: p.id, b: other, kind }); ctx.changed(); toast("Relationship line added"); } } }; render(); };
      I.querySelector("#pX").onclick = async () => { if (await confirmIt("Remove this person?", `${p.name} and their lines will be removed. You can undo with Ctrl+Z.`, "Remove")) removePerson(p.id); };
    }
    function tidy() { D.persons.forEach(p => { p.x = null; p.y = null; }); ctx.changed(); render(); setTimeout(fit, 0); toast("Layout tidied"); }
    const keys = e => { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if (e.key === "Escape") { pending = null; sel = null; multi.clear(); selBond = selUnion = null; render(); } if ((e.key === "Delete" || e.key === "Backspace") && selBond) { D.bonds = D.bonds.filter(x => x.id !== selBond); selBond = null; ctx.changed(); render(); } };
    addEventListener("keydown", keys); render(); setTimeout(fit, 0);
    return {
      reload(d) { D = d; if (sel && !person(sel)) sel = null; render(); },
      destroy() { removeEventListener("keydown", keys); },
      canvas: () => ({ svg, world }),
      exports: () => [{ label: "Image (PNG)", icon: "download", run: () => { const s = sel; sel = null; render(); exportPNG(svg, world, ctx.doc.title); sel = s; render(); } }, { label: "Vector (SVG)", icon: "download", run: () => { const s = sel; sel = null; render(); exportSVG(svg, world, ctx.doc.title); sel = s; render(); } },
        { label: "Summary (text)", icon: "download", run: () => { const lines = [`Genogram: ${ctx.doc.title}`, `Prepared ${new Date().toLocaleDateString()}`, "", "People:"]; D.persons.forEach(p => lines.push(`- ${display(p)}${p.index ? " (index person)" : ""}: ${({ M: "male", F: "female", X: "another gender", U: "unknown" })[p.sex]}${p.birth && !D.privacy ? `, born ${p.birth}` : ""}${p.deceased ? `, died ${p.death || ""}` : ""}${p.nonFamily ? ", lives in the household (not family)" : ""}${p.health ? ", health condition" : ""}${p.substance ? ", substance use" : ""}${p.notes && !D.privacy ? `. Notes: ${p.notes}` : ""}`)); lines.push("", "Couples:"); D.unions.filter(u => u.b).forEach(u => lines.push(`- ${display(person(u.a))} and ${display(person(u.b))}: ${UNION[u.type].toLowerCase()}${u.start ? ` from ${u.start}` : ""}${u.end ? ` to ${u.end}` : ""}`)); lines.push("", "Relationships:"); D.bonds.forEach(b => lines.push(`- ${display(person(b.a))} and ${display(person(b.b))}: ${BOND[b.kind][0].toLowerCase()}`)); D.households.forEach(hh => lines.push("", `${hh.name}: ${hh.members.map(id => display(person(id))).join(", ")}`)); download(new Blob([lines.join("\n")], { type: "text/plain" }), `${fileSafe(ctx.doc.title)}-summary.txt`); } }],
    };
  }
  Modules.genogram = { blank, templates, mount };
})();
