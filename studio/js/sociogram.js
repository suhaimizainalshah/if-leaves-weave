/* Sociogram: enter people and their choices, see the network, and get accurate measures in plain English. */
"use strict";
(() => {
  const COMM = ["#0E7C7B", "#2F6DB5", "#B86E00", "#7A4FC2", "#C2413A", "#3F7D3A", "#A23E7A", "#5E6B70", "#1E2A2F"];
  const STATUS_COL = { Popular: "#2F7D4F", Rejected: "#C2413A", Neglected: "#8A9497", Controversial: "#B86E00", Average: "#2F6DB5", "Not classified": "#B7C0C3" };
  function blank() { return { people: [], ties: [], layout: "force", sizeBy: "in", colorBy: "community", showNeg: true, allowNeg: false, maxChoices: 3, question: "Who would you most like to work with?", pos: {}, view: { x: 0, y: 0, z: 1 }, tab: "people" }; }
  const templates = { class: { title: "Class sociogram", data: () => { const d = blank(), names = ["Aisha", "Ben", "Chen", "Divya", "Ethan", "Farah", "Gabriel", "Hana", "Irfan", "Jia Wen", "Kumar", "Lily"]; d.people = names.map((n, i) => ({ id: uid(), name: n, group: i % 2 ? "Group B" : "Group A" })); const id = n => d.people.find(p => p.name === n).id; [["Aisha", "Hana"], ["Hana", "Aisha"], ["Aisha", "Farah"], ["Farah", "Aisha"], ["Farah", "Hana"], ["Hana", "Farah"], ["Ben", "Ethan"], ["Ethan", "Ben"], ["Ben", "Gabriel"], ["Gabriel", "Ethan"], ["Ethan", "Gabriel"], ["Chen", "Jia Wen"], ["Jia Wen", "Chen"], ["Chen", "Kumar"], ["Kumar", "Chen"], ["Divya", "Aisha"], ["Divya", "Chen"], ["Irfan", "Ben"], ["Irfan", "Kumar"], ["Lily", "Aisha"], ["Lily", "Hana"], ["Kumar", "Irfan"], ["Gabriel", "Aisha"], ["Jia Wen", "Lily"]].forEach(([a, b]) => d.ties.push({ id: uid(), from: id(a), to: id(b), type: "positive" })); d.tab = "insights"; return d; } } };
  function mount(ctx) {
    let D = ctx.doc.data, A = null, pos = {}, rings = null, sel = null, selTie = null, drag = null;
    D.view ||= { x: 0, y: 0, z: 1 }; D.pos ||= {};
    const svg = svgEl("svg", { class: "canvas dotgrid", role: "img", "aria-label": "Sociogram" }), world = svgEl("g", {}, svg);
    svgEl("defs", {}, svg).innerHTML = ["pos", "neg", "sel"].map(k => `<marker id="sg-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="${k === "neg" ? "#C2413A" : k === "sel" ? "#E9A23B" : "#5E6B70"}"/></marker>`).join("");
    ctx.stage.append(svg);
    const vp = Viewport(svg, world, D.view, v => { zl.textContent = Math.round(v.z * 100) + "%"; svg.style.backgroundSize = `${22 * v.z}px ${22 * v.z}px`; svg.style.backgroundPosition = `${v.x}px ${v.y}px`; });
    const zb = h("div", { class: "zoombar" }), zl = h("span", {}, "100%"); [["zout", .8, "Zoom out"], [null], ["zin", 1.25, "Zoom in"], ["fit", 0, "Fit to screen"]].forEach(([ic, f, lbl]) => { if (!ic) return zb.append(zl); const b = h("button", { class: "icon", "aria-label": lbl, title: lbl, onclick: () => f ? vp.zoomBy(f) : fit() }); b.innerHTML = ICONS[ic]; zb.append(b); });
    const legend = h("div", { class: "sg-legend" }), hud = h("div", { class: "hud" }); ctx.stage.append(zb, legend, hud);
    const seg = h("div", { class: "seg", role: "group", "aria-label": "Layout" }); [["force", "Network"], ["target", "Target"], ["circle", "Circle"]].forEach(([v, n]) => seg.append(h("button", { "aria-pressed": String(D.layout === v), onclick: () => { D.layout = v; D.pos = {}; ctx.changed(); compute(); render(); setTimeout(fit, 0); } }, n))); ctx.setView(seg);
    const person = id => D.people.find(p => p.id === id), per = id => A?.per.find(p => p.id === id);
    function compute() {
      A = SNA.analyse(D.people, D.ties.filter(t => D.allowNeg || t.type !== "negative"));
      if (D.layout === "target") { const t = SNA.targetLayout(D.people, A); pos = t.pos; rings = t.rings; } else { pos = D.layout === "circle" ? SNA.circleLayout(D.people, A) : SNA.forceLayout(D.people, D.ties.filter(t => t.type !== "negative")); rings = null; }
      for (const id in D.pos) if (pos[id]) pos[id] = { ...D.pos[id] };
    }
    const radius = p => { const P = per(p.id); if (!P) return 20; const v = D.sizeBy === "in" ? P.inDeg / Math.max(1, ...A.per.map(x => x.inDeg)) : D.sizeBy === "between" ? P.betweenness / Math.max(1e-9, ...A.per.map(x => x.betweenness)) : D.sizeBy === "pagerank" ? P.pagerank / Math.max(1e-9, ...A.per.map(x => x.pagerank)) : .4; return 16 + v * 18; };
    const groups = () => [...new Set(D.people.map(p => p.group).filter(Boolean))];
    const colour = p => { const P = per(p.id); if (D.colorBy === "group") { const g = groups(); return p.group ? COMM[g.indexOf(p.group) % COMM.length] : "#8A9497"; } if (D.colorBy === "status" && A.hasNeg) return STATUS_COL[P?.status] || "#B7C0C3"; return COMM[(P?.community ?? 0) % COMM.length]; };
    function render() {
      seg.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(["force", "target", "circle"][i] === D.layout)));
      world.innerHTML = ""; if (!D.people.length) { hud.textContent = "Add people in the panel to start."; legend.innerHTML = ""; renderInsp(); return; }
      hud.textContent = sel ? "Drag from a person to another to add a choice." : "Drag people to rearrange. Drag from one person to another (hold Shift) to add a choice.";
      if (rings) rings.forEach((r, i) => { svgEl("circle", { cx: r.c, cy: r.c, r: r.r, fill: i === 0 ? "rgba(14,124,123,.06)" : "none", stroke: "#C9D2CF", "stroke-dasharray": "4 6" }, world); });
      const tieG = svgEl("g", {}, world), nodeG = svgEl("g", {}, world), done = new Set();
      for (const t of D.ties) {
        if (t.type === "negative" && (!D.allowNeg || !D.showNeg)) continue; const a = pos[t.from], b = pos[t.to], pa = person(t.from), pb = person(t.to); if (!a || !b || !pa || !pb) continue;
        const mutual = D.ties.some(u => u.from === t.to && u.to === t.from && u.type === t.type); if (mutual && done.has(t.to + t.from + t.type)) continue; done.add(t.from + t.to + t.type);
        const ra = radius(pa), rb = radius(pb), dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, x1 = a.x + ux * ra, y1 = a.y + uy * ra, x2 = b.x - ux * (rb + 3), y2 = b.y - uy * (rb + 3);
        const neg = t.type === "negative", isSel = selTie === t.id || (sel && (t.from === sel || t.to === sel)), g = svgEl("g", { class: "sg-tie", "data-tie": t.id }, tieG);
        svgEl("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 12 }, g);
        svgEl("line", { x1, y1, x2, y2, stroke: neg ? "#C2413A" : isSel ? "#E9A23B" : mutual ? "#1E2A2F" : "#8A9497", "stroke-width": mutual ? 3 : 1.6, "stroke-dasharray": neg ? "6 5" : null, "marker-end": mutual ? null : `url(#sg-${neg ? "neg" : isSel ? "sel" : "pos"})`, opacity: sel && !isSel ? .25 : 1 }, g);
      }
      for (const p of D.people) {
        const P = pos[p.id]; if (!P) continue; const r = radius(p), c = colour(p), st = per(p.id), g = svgEl("g", { class: "sg-node", "data-id": p.id, tabindex: 0, role: "button", "aria-label": `${p.name}, chosen by ${st?.inDeg ?? 0}` }, nodeG), dim = sel && sel !== p.id && !D.ties.some(t => (t.from === sel && t.to === p.id) || (t.to === sel && t.from === p.id));
        if (sel === p.id) svgEl("circle", { cx: P.x, cy: P.y, r: r + 6, fill: "none", stroke: "#E9A23B", "stroke-width": 3 }, g);
        svgEl("circle", { cx: P.x, cy: P.y, r, fill: c, stroke: "#FFFFFF", "stroke-width": 2.5, opacity: dim ? .3 : 1 }, g);
        if (st?.unchosen) svgEl("circle", { cx: P.x, cy: P.y, r: r + 3, fill: "none", stroke: "#C2413A", "stroke-width": 1.6, "stroke-dasharray": "3 3", opacity: dim ? .3 : 1 }, g);
        const init = svgEl("text", { x: P.x, y: P.y + 4.5, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#FFFFFF", opacity: dim ? .4 : 1 }, g); init.textContent = st?.inDeg ?? 0;
        const lbl = svgEl("text", { x: P.x, y: P.y + r + 16, "text-anchor": "middle", "font-size": 13, "font-weight": 600, fill: "#1E2A2F", opacity: dim ? .35 : 1, class: "sg-name" }, g); lbl.textContent = p.name;
      }
      if (drag?.tie) { const a = pos[drag.from]; svgEl("line", { x1: a.x, y1: a.y, x2: drag.x, y2: drag.y, stroke: "#E9A23B", "stroke-width": 2, "stroke-dasharray": "5 4", class: "ui-only" }, world); }
      renderLegend(); renderInsp();
    }
    function renderLegend() {
      let items = ""; if (D.colorBy === "community") items = [...new Set(A.per.map(p => p.community))].sort((a, b) => a - b).map(c => `<span><i style="background:${COMM[c % COMM.length]}"></i>Group ${c + 1} (${A.per.filter(p => p.community === c).length})</span>`).join("");
      else if (D.colorBy === "group") items = groups().map((g, i) => `<span><i style="background:${COMM[i % COMM.length]}"></i>${esc(g)}</span>`).join("") || "<span>No groups entered</span>";
      else items = Object.entries(STATUS_COL).filter(([s]) => A.per.some(p => p.status === s)).map(([s, c]) => `<span><i style="background:${c}"></i>${s}</span>`).join("");
      legend.innerHTML = `${items}<span class="sep"></span><span><b class="ln mut"></b>Mutual</span><span><b class="ln one"></b>One-way</span>${D.allowNeg && D.showNeg ? `<span><b class="ln neg"></b>Avoid</span>` : ""}<span><b class="ring"></b>Not chosen</span><span>Number = times chosen</span>`;
    }
    function fit() { const pts = Object.values(pos); if (!pts.length) return; const b = bboxOf(pts.map(p => ({ x: p.x - 40, y: p.y - 40, w: 80, h: 100 }))); vp.fit(b, 50); }
    /* ---------- canvas interaction ---------- */
    svg.addEventListener("pointerdown", e => {
      const n = e.target.closest?.("[data-id]"), t = e.target.closest?.("[data-tie]"); const p = vp.toWorld(e.clientX, e.clientY);
      if (n) { const id = n.dataset.id; if (e.shiftKey || e.altKey) drag = { tie: true, from: id, x: p.x, y: p.y }; else { drag = { move: id, sx: p.x, sy: p.y, ox: pos[id].x, oy: pos[id].y, moved: false }; sel = id; selTie = null; D.tab = D.tab === "people" ? "insights" : D.tab; } svg.setPointerCapture(e.pointerId); render(); e.stopPropagation(); return; }
      if (t) { selTie = t.dataset.tie; sel = null; render(); return; }
      if (sel || selTie) { sel = null; selTie = null; render(); }
    }, true);
    svg.addEventListener("pointermove", e => { if (!drag) return; const p = vp.toWorld(e.clientX, e.clientY); if (drag.tie) { drag.x = p.x; drag.y = p.y; render(); return; } if (drag.move) { if (Math.hypot(p.x - drag.sx, p.y - drag.sy) > 3) drag.moved = true; if (!drag.moved) return; pos[drag.move] = { x: drag.ox + p.x - drag.sx, y: drag.oy + p.y - drag.sy }; render(); } });
    svg.addEventListener("pointerup", e => { if (!drag) return; const d = drag; drag = null; if (d.tie) { const n = document.elementFromPoint(e.clientX, e.clientY)?.closest?.("[data-id]"); if (n && n.dataset.id !== d.from) addTie(d.from, n.dataset.id, "positive"); render(); return; } if (d.move && d.moved) { D.pos[d.move] = pos[d.move]; ctx.changed(); } });
    function addTie(a, b, type) { const ex = D.ties.find(t => t.from === a && t.to === b); if (ex) { ex.type = type; } else { const n = D.ties.filter(t => t.from === a && t.type === "positive").length; D.ties.push({ id: uid(), from: a, to: b, type }); if (type === "positive" && D.maxChoices && n >= D.maxChoices) toast(`${person(a).name} now has more than ${D.maxChoices} choices.`); } ctx.changed(); compute(); render(); }
    /* ---------- inspector ---------- */
    const pct = v => Math.round(v * 100) + "%", n2 = v => (Math.round(v * 100) / 100).toFixed(2);
    function renderInsp() {
      const I = ctx.insp, tabs = `<div class="seg wide" role="tablist">${[["people", "People"], ["choices", "Choices"], ["insights", "Insights"], ["settings", "Settings"]].map(([v, n]) => `<button role="tab" data-tab="${v}" aria-pressed="${D.tab === v}">${n}</button>`).join("")}</div>`;
      let body = "";
      if (selTie) { const t = D.ties.find(x => x.id === selTie); if (!t) { selTie = null; return renderInsp(); } body = `<h3>Choice</h3><p><b>${esc(person(t.from)?.name)}</b> ${t.type === "negative" ? "would rather not work with" : "chose"} <b>${esc(person(t.to)?.name)}</b>.</p>${D.allowNeg ? `<div class="chips"><button class="chip" data-tt="positive" aria-pressed="${t.type === "positive"}">Chose</button><button class="chip" data-tt="negative" aria-pressed="${t.type === "negative"}">Avoid</button></div>` : ""}<button class="btn danger" id="tDel" style="margin-top:.8rem">${ICONS.trash}Remove choice</button>`; }
      else if (D.tab === "people") body = peoplePane(); else if (D.tab === "choices") body = choicesPane(); else if (D.tab === "insights") body = insightsPane(); else body = settingsPane();
      I.innerHTML = `<h2>Sociogram</h2>${tabs}<div class="sg-pane">${body}</div>`; bind(I);
    }
    function peoplePane() {
      return `<div class="gen"><b>Got answers from a Google Form?</b><p class="note">Copy the rows from the response spreadsheet (name, up to 3 people to work with, and up to 3 to avoid) and paste them in.</p><button class="btn primary block" id="pPaste">Paste responses</button></div>
        <p class="hint">Or add everyone in the group, one name per line. Add a group (such as class or house) after a comma if you like.</p>
        <label class="field"><span>Add people</span><textarea id="pAdd" rows="5" placeholder="Aisha, Group A\nBen, Group B\nChen"></textarea></label><button class="btn primary block" id="pGo">${ICONS.plus}Add to the sociogram</button>
        <h3>${D.people.length} ${D.people.length === 1 ? "person" : "people"}</h3><div class="plist">${D.people.map(p => `<div class="prow" data-p="${p.id}"><input value="${esc(p.name)}" data-pf="name" aria-label="Name"><input value="${esc(p.group || "")}" data-pf="group" placeholder="Group" aria-label="Group"><button class="icon sm" data-pdel="${p.id}" aria-label="Remove ${esc(p.name)}">✕</button></div>`).join("")}</div>
        ${D.people.length ? `<button class="btn block" data-tab="choices" style="margin-top:.6rem">Next: enter choices</button>` : ""}`;
    }
    function choicesPane() {
      if (!D.people.length) return `<p class="hint">Add people first.</p>`;
      const who = sel && person(sel) ? person(sel) : D.people[0];
      return `<label class="field"><span>Question asked</span><input id="cQ" value="${esc(D.question)}"></label>
        <label class="field"><span>Choices made by</span><select id="cWho">${D.people.map(p => `<option value="${p.id}" ${p.id === who.id ? "selected" : ""}>${esc(p.name)} (${D.ties.filter(t => t.from === p.id && t.type === "positive").length})</option>`).join("")}</select></label>
        <p class="note">Tap the people ${esc(who.name)} chose${D.allowNeg ? `. Tap again to mark someone to avoid; a third tap clears it` : ""}. Suggested limit: ${D.maxChoices || "none"}.</p>
        <div class="chips nom">${D.people.filter(p => p.id !== who.id).map(p => { const t = D.ties.find(x => x.from === who.id && x.to === p.id), st = t ? t.type : ""; return `<button class="chip nomc ${st}" data-nom="${p.id}" aria-pressed="${!!t}">${st === "negative" ? "✕ " : st ? "✓ " : ""}${esc(p.name)}</button>`; }).join("")}</div>
        <div class="row" style="margin-top:.8rem"><button class="btn" id="cPrev">Previous person</button><button class="btn primary" id="cNext">Next person</button></div>
        <p class="note">${D.people.filter(p => !D.ties.some(t => t.from === p.id)).length} people have no choices entered yet.</p>`;
    }
    function insightsPane() {
      if (D.people.length < 2) return `<p class="hint">Add at least two people and their choices to see insights.</p>`;
      if (sel && per(sel)) { const P = per(sel), p = person(sel), choseMe = D.ties.filter(t => t.to === sel && t.type === "positive").map(t => person(t.from)?.name), iChose = D.ties.filter(t => t.from === sel && t.type === "positive").map(t => person(t.to)?.name);
        return `<h3>${esc(p.name)}</h3>${p.responded === false ? `<p class="note">Didn’t fill in the form: only choices received are shown.</p>` : ""}<div class="stats"><div><b>${P.inDeg}</b><span>chose them</span></div><div><b>${P.outDeg}</b><span>they chose</span></div><div><b>${P.mutual}</b><span>mutual</span></div></div>
          <p class="note"><b>Chosen by:</b> ${choseMe.length ? esc(choseMe.join(", ")) : "no one yet"}.<br><b>Chose:</b> ${iChose.length ? esc(iChose.join(", ")) : "no one"}.</p>
          ${P.status ? `<p><span class="badge" style="background:${STATUS_COL[P.status]}">${P.status}</span></p>` : ""}
          <table class="mtab"><tr><th scope="row" title="Share of shortest paths between others that pass through this person">Bridging (betweenness)</th><td>${n2(P.betweenness)}</td></tr><tr><th scope="row" title="How easily they reach everyone else through choices">Reach (harmonic closeness)</th><td>${n2(P.closeness)}</td></tr><tr><th scope="row" title="Connected to well-connected people">Eigenvector</th><td>${n2(P.eigenvector)}</td></tr><tr><th scope="row" title="Influence through being chosen by people who are themselves chosen">PageRank</th><td>${(P.pagerank * 100).toFixed(1)}%</td></tr><tr><th scope="row" title="How many of their contacts are connected to each other">Clustering</th><td>${n2(P.clustering)}</td></tr><tr><th scope="row">Community</th><td>Group ${P.community + 1}</td></tr></table>
          <button class="btn block" id="clearSel">Back to the whole group</button>`; }
      const by = (k, n = 3) => [...A.per].sort((a, b) => b[k] - a[k]).filter(p => p[k] > 0).slice(0, n);
      const noReply = D.people.filter(p => p.responded === false), noReplyIds = new Set(noReply.map(p => p.id));
      const stars = A.per.filter(p => p.star), unchosen = A.per.filter(p => p.unchosen), isolates = A.per.filter(p => p.isolate && !noReplyIds.has(p.id)), bridges = by("betweenness", 3), name = id => esc(person(id)?.name);
      return `<div class="stats"><div><b>${A.n}</b><span>people</span></div><div><b>${A.ties}</b><span>choices</span></div><div><b>${A.communities}</b><span>groups</span></div></div>
        <ul class="insights">
          <li><b>Most chosen:</b> ${stars.length ? stars.map(p => `${esc(p.name)} (${p.inDeg})`).join(", ") : by("inDeg").map(p => `${esc(p.name)} (${p.inDeg})`).join(", ") || "none yet"}.</li>
          <li class="${unchosen.length ? "flag" : ""}"><b>Not chosen by anyone:</b> ${unchosen.length ? unchosen.map(p => esc(p.name)).join(", ") : "everyone was chosen at least once"}.${unchosen.length ? " Worth a quiet check-in." : ""}</li>
          ${isolates.length ? `<li class="flag"><b>Not connected at all:</b> ${isolates.map(p => esc(p.name)).join(", ")} chose no one and were not chosen.</li>` : ""}
          ${noReply.length ? `<li><b>Didn’t fill in the form:</b> ${noReply.map(p => esc(p.name)).join(", ")}. They were named by others, so their measures are based only on choices they received.</li>` : ""}
          <li><b>Mutual pairs:</b> ${A.mutualPairs.length}${A.mutualPairs.length ? `: ${A.mutualPairs.slice(0, 6).map(([a, b]) => `${name(a)} and ${name(b)}`).join("; ")}${A.mutualPairs.length > 6 ? "; and more" : ""}` : ""}.</li>
          <li><b>Close-knit groups</b> (everyone chose each other): ${A.cliques.length ? A.cliques.slice(0, 4).map(c => c.map(name).join(", ")).join("; ") : "none of three or more"}.</li>
          <li><b>Bridges between groups:</b> ${bridges.length ? bridges.map(p => esc(p.name)).join(", ") : "none"}. They link people who would otherwise be apart.</li>
          <li><b>Communities found:</b> ${A.communities} (modularity ${n2(A.modularity)}; above about 0.3 suggests clear subgroups).</li>
          <li><b>Mutual choices:</b> ${pct(A.reciprocity)} of choices were returned. <b>Density:</b> ${pct(A.density)} of all possible choices were made.</li>
          ${A.hasNeg ? `<li><b>Sociometric status</b> (Coie, Dodge and Coppotelli, 1982): ${Object.keys(STATUS_COL).map(s => [s, A.per.filter(p => p.status === s)]).filter(([, l]) => l.length).map(([s, l]) => `${s}: ${l.map(p => esc(p.name)).join(", ")}`).join(". ")}.</li>` : ""}
        </ul>
        <p class="note">Select a person on the map for their full measures. Measures use standard methods: Brandes betweenness, harmonic closeness, eigenvector centrality, PageRank and Louvain communities.</p>
        <p class="note">Use sociograms to support pupils, not to label them. Keep the results private, and follow your school or organisation’s guidance on consent.</p>`;
    }
    function settingsPane() {
      return `<h3>Size people by</h3><div class="chips">${[["in", "Times chosen"], ["between", "Bridging"], ["pagerank", "Influence"], ["equal", "Same size"]].map(([v, n]) => `<button class="chip" data-size="${v}" aria-pressed="${D.sizeBy === v}">${n}</button>`).join("")}</div>
        <h3>Colour by</h3><div class="chips">${[["community", "Communities found"], ["group", "Groups entered"], ["status", "Sociometric status"]].map(([v, n]) => `<button class="chip" data-color="${v}" aria-pressed="${D.colorBy === v}" ${v === "status" && !A?.hasNeg ? "disabled title='Needs avoid choices'" : ""}>${n}</button>`).join("")}</div>
        <label class="field"><span>Suggested choices per person</span><input type="number" id="sMax" min="0" max="20" value="${D.maxChoices}"></label>
        <label class="check"><input type="checkbox" id="sNeg" ${D.allowNeg ? "checked" : ""}> Also record “would rather not work with” choices</label>
        <p class="note">This enables sociometric status (popular, rejected, neglected, controversial, average). Asking for negative choices is sensitive, so only do so where your setting’s guidance allows it.</p>
        ${D.allowNeg ? `<label class="check"><input type="checkbox" id="sShowNeg" ${D.showNeg ? "checked" : ""}> Show avoid choices on the map</label>` : ""}
        <h3>Layout</h3><button class="btn block" id="sRe">Rearrange automatically</button>
        <h3>Data</h3><div class="row"><button class="btn" id="sImp">Import CSV</button></div><p class="note">CSV columns: from, to, and optionally type (positive or negative). Names not yet listed are added.</p>`;
    }
    function bind(I) {
      I.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { D.tab = b.dataset.tab; selTie = null; if (D.tab !== "choices") sel = null; ctx.changed(); render(); }); // switching tabs shows the whole group
      I.querySelector("#pPaste")?.addEventListener("click", pasteResponses);
      I.querySelector("#pGo")?.addEventListener("click", () => { const lines = I.querySelector("#pAdd").value.split("\n").map(l => l.trim()).filter(Boolean); let n = 0; lines.forEach(l => { const [name, group] = l.split(/\s*[,\t]\s*/); if (name && !D.people.some(p => p.name.toLowerCase() === name.toLowerCase())) { D.people.push({ id: uid(), name, group: group || "" }); n++; } }); if (!n) return toast("Type at least one new name."); D.pos = {}; ctx.changed(); compute(); render(); setTimeout(fit, 0); toast(`Added ${n} ${n === 1 ? "person" : "people"}`); });
      I.querySelectorAll(".prow").forEach(r => r.querySelectorAll("[data-pf]").forEach(inp => inp.onchange = () => { person(r.dataset.p)[inp.dataset.pf] = inp.value.trim(); ctx.changed(); compute(); render(); }));
      I.querySelectorAll("[data-pdel]").forEach(b => b.onclick = () => { const id = b.dataset.pdel; D.people = D.people.filter(p => p.id !== id); D.ties = D.ties.filter(t => t.from !== id && t.to !== id); delete D.pos[id]; if (sel === id) sel = null; ctx.changed(); compute(); render(); });
      I.querySelector("#cQ")?.addEventListener("change", e => { D.question = e.target.value; ctx.changed(); });
      I.querySelector("#cWho")?.addEventListener("change", e => { sel = e.target.value; render(); });
      I.querySelectorAll("[data-nom]").forEach(b => b.onclick = () => { const who = I.querySelector("#cWho").value, to = b.dataset.nom, t = D.ties.find(x => x.from === who && x.to === to); if (!t) addTie(who, to, "positive"); else if (t.type === "positive" && D.allowNeg) { t.type = "negative"; ctx.changed(); compute(); } else { D.ties = D.ties.filter(x => x !== t); ctx.changed(); compute(); } sel = who; render(); });
      const step = d => { const ids = D.people.map(p => p.id), i = ids.indexOf(I.querySelector("#cWho").value); sel = ids[(i + d + ids.length) % ids.length]; render(); }; I.querySelector("#cNext")?.addEventListener("click", () => step(1)); I.querySelector("#cPrev")?.addEventListener("click", () => step(-1));
      I.querySelector("#clearSel")?.addEventListener("click", () => { sel = null; render(); });
      I.querySelectorAll("[data-size]").forEach(b => b.onclick = () => { D.sizeBy = b.dataset.size; ctx.changed(); render(); }); I.querySelectorAll("[data-color]").forEach(b => b.onclick = () => { D.colorBy = b.dataset.color; ctx.changed(); render(); });
      I.querySelector("#sMax")?.addEventListener("change", e => { D.maxChoices = Math.max(0, +e.target.value || 0); ctx.changed(); });
      I.querySelector("#sNeg")?.addEventListener("change", e => { D.allowNeg = e.target.checked; if (!D.allowNeg && D.colorBy === "status") D.colorBy = "community"; ctx.changed(); compute(); render(); });
      I.querySelector("#sShowNeg")?.addEventListener("change", e => { D.showNeg = e.target.checked; ctx.changed(); render(); });
      I.querySelector("#sRe")?.addEventListener("click", () => { D.pos = {}; ctx.changed(); compute(); render(); setTimeout(fit, 0); });
      I.querySelector("#sImp")?.addEventListener("click", importCsv);
      I.querySelectorAll("[data-tt]").forEach(b => b.onclick = () => { D.ties.find(x => x.id === selTie).type = b.dataset.tt; ctx.changed(); compute(); render(); });
      I.querySelector("#tDel")?.addEventListener("click", () => { D.ties = D.ties.filter(x => x.id !== selTie); selTie = null; ctx.changed(); compute(); render(); });
    }
    /* ---------- paste responses from a Google Form or any spreadsheet ---------- */
    const norm = t => String(t || "").normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().replace(/\s+/g, " ").replace(/^[\s.,;:'"()-]+|[\s.,;:'"()-]+$/g, "").toLowerCase();
    const lev = (a, b) => { if (Math.abs(a.length - b.length) > 2) return 9; const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
    function parseTable(text) {
      text = text.replace(/\r\n?/g, "\n").replace(/\n+$/, ""); if (!text.trim()) return [];
      if (text.includes("\t")) return text.split("\n").map(l => l.split("\t").map(c => c.replace(/^"|"$/g, "").trim()));
      const rows = []; let row = [], cell = "", q = false; for (let i = 0; i < text.length; i++) { const c = text[i]; if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; } else if (c === '"') q = true; else if (c === ",") { row.push(cell.trim()); cell = ""; } else if (c === "\n") { row.push(cell.trim()); rows.push(row); row = []; cell = ""; } else cell += c; } row.push(cell.trim()); rows.push(row); return rows;
    }
    const looksStamp = v => /\d/.test(v) && /[\/:\-.]/.test(v) && /^[\d\s\/:\-.,APMapm]+$/.test(v) && v.length >= 6, looksMail = v => /@/.test(v);
    function detect(rows) {
      const head = rows[0] || [], n = Math.max(...rows.map(r => r.length)), hasHeader = head.some(c => /name|timestamp|choice|work with|prefer|avoid|rather not|email|first|second|third|1st|2nd|3rd|partner|friend|pick/i.test(c));
      const roles = Array(n).fill("ignore"), data = hasHeader ? rows.slice(1) : rows;
      if (hasHeader) {
        head.forEach((h, i) => { const x = String(h || "").toLowerCase(); if (/timestamp|^time$|date|email|e-mail|score|class|form/.test(x) && !/name/.test(x)) roles[i] = /class|form/.test(x) ? "group" : "ignore"; else if (/not|avoid|rather|least|don.?t|dislike/.test(x)) roles[i] = "avoid"; else if (/name/.test(x) && !/choice|work|want|with|pick|friend|partner|1st|2nd|3rd|first|second|third/.test(x) && !roles.includes("name")) roles[i] = "name"; else if (/choice|work|want|with|pick|friend|partner|1st|2nd|3rd|first|second|third|person/.test(x)) roles[i] = "want"; });
        if (!roles.includes("name")) { const i = roles.findIndex((r, k) => r === "ignore" && !data.every(row => looksStamp(row[k] || "") || looksMail(row[k] || ""))); if (i >= 0) roles[i] = "name"; }
      } else {
        const free = [...Array(n).keys()].filter(k => !data.slice(0, 8).every(row => !row[k] || looksStamp(row[k]) || looksMail(row[k])));
        free.forEach((k, j) => roles[k] = j === 0 ? "name" : j <= 3 ? "want" : j <= 6 ? "avoid" : "ignore");
      }
      return { roles, hasHeader, n };
    }
    function analysePaste(rows, roles, hasHeader) {
      const data = (hasHeader ? rows.slice(1) : rows).filter(r => r.some(c => c && c.trim())), nameCol = roles.indexOf("name"), groupCol = roles.indexOf("group");
      if (nameCol < 0) return { error: "Choose which column holds each pupil’s name." };
      const byNorm = new Map(); D.people.forEach(p => byNorm.set(norm(p.name), { name: p.name, existing: p.id }));
      const respondents = new Map(); let dups = 0;
      data.forEach(r => { const nm = (r[nameCol] || "").trim().replace(/\s+/g, " "); if (!nm) return; const k = norm(nm); if (respondents.has(k)) dups++; respondents.set(k, { name: nm, row: r }); if (!byNorm.has(k)) byNorm.set(k, { name: nm }); });
      const keys = [...byNorm.keys()], firstTok = k => k.split(" ")[0];
      const resolve = raw => { const k = norm(raw); if (!k) return null; if (byNorm.has(k)) return k;
        const a = keys.filter(x => firstTok(x) === k || (k.length >= 3 && x.startsWith(k + " "))); if (a.length === 1) return a[0];
        const b = keys.filter(x => k.length >= 3 && (x.startsWith(k) || k.startsWith(x)) && Math.abs(x.length - k.length) <= 3); if (b.length === 1) return b[0];
        const lim = k.length >= 6 ? 2 : 1, c = keys.map(x => [x, lev(k, x)]).filter(([, d]) => d <= lim).sort((p, q) => p[1] - q[1]); if (c.length && (c.length === 1 || c[0][1] < c[1][1])) return c[0][0];
        // a one-word answer with a small typo in the first name, such as "Aishah" for "Aisha Rahman"
        if (!k.includes(" ") && k.length >= 4) { const f = keys.map(x => [x, lev(k, firstTok(x))]).filter(([x, d]) => d <= 1 && x.includes(" ")).sort((p, q) => p[1] - q[1]); if (f.length === 1 || (f.length > 1 && f[0][1] < f[1][1])) return f[0][0]; }
        return null; };
      const suggest = raw => { const k = norm(raw); let best = null, bd = 9; for (const x of keys) { const d = Math.min(lev(k, x), lev(k, firstTok(x)) + (x.includes(" ") ? .5 : 0)); if (d < bd) { bd = d; best = x; } } return bd <= 2 ? best : null; };
      const choices = [], unmatched = new Map(); let selfs = 0, conflicts = 0;
      for (const [k, { row }] of respondents) { const seen = new Map(); roles.forEach((role, i) => { if (role !== "want" && role !== "avoid") return; const raw = (row[i] || "").trim(); if (!raw) return; const t = resolve(raw); if (!t) { unmatched.set(norm(raw), { raw, count: (unmatched.get(norm(raw))?.count || 0) + 1 }); choices.push({ from: k, raw, type: role === "want" ? "positive" : "negative", rank: roles.slice(0, i + 1).filter(x => x === role).length }); return; } if (t === k) { selfs++; return; } if (seen.has(t)) { if (seen.get(t) !== role) conflicts++; return; } seen.set(t, role); choices.push({ from: k, to: t, type: role === "want" ? "positive" : "negative", rank: roles.slice(0, i + 1).filter(x => x === role).length }); }); }
      return { respondents, byNorm, choices, unmatched, dups, selfs, conflicts, groupCol, suggest, wants: choices.filter(c => c.type === "positive").length, avoids: choices.filter(c => c.type === "negative").length };
    }
    async function pasteResponses() {
      let rows = [], det = null, res = null; const body = h("div", { class: "paste-imp" });
      body.innerHTML = `<p class="note">In the form’s response spreadsheet, select the rows (with or without the header row) and copy them, then paste here. Expected order: <b>name</b>, then up to <b>3 people to work with</b>, then up to <b>3 to avoid</b> (optional). A timestamp or email column is skipped automatically.</p>
        <label class="field"><span>Paste responses</span><textarea id="ppT" rows="7" placeholder="Timestamp&#9;Your name&#9;Choice 1&#9;Choice 2&#9;Choice 3&#9;Prefer not 1&#9;Prefer not 2&#9;Prefer not 3"></textarea></label>
        <div id="ppPrev"></div>`;
      const ta = body.querySelector("#ppT"), prev = body.querySelector("#ppPrev");
      const show = () => { if (!rows.length) { prev.innerHTML = ""; return; } res = analysePaste(rows, det.roles, det.hasHeader);
        const opts = r => ["ignore", "name", "want", "avoid", "group"].map(v => `<option value="${v}" ${r === v ? "selected" : ""}>${{ ignore: "Skip", name: "Pupil’s name", want: "Wants to work with", avoid: "Prefer not", group: "Group or class" }[v]}</option>`).join("");
        const sample = (det.hasHeader ? rows.slice(1) : rows).slice(0, 3);
        prev.innerHTML = `<h3>Columns</h3><div class="pp-tbl"><table><thead><tr>${Array.from({ length: det.n }, (_, i) => `<th><select data-col="${i}" aria-label="Column ${i + 1}">${opts(det.roles[i])}</select>${det.hasHeader ? `<small>${esc(rows[0][i] || "")}</small>` : ""}</th>`).join("")}</tr></thead><tbody>${sample.map(r => `<tr>${Array.from({ length: det.n }, (_, i) => `<td>${esc(r[i] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
          <label class="check"><input type="checkbox" id="ppHead" ${det.hasHeader ? "checked" : ""}> The first row is a header</label>
          ${res.error ? `<p class="note warn">${res.error}</p>` : `<div class="stats"><div><b>${res.respondents.size}</b><span>responses</span></div><div><b>${res.wants}</b><span>want choices</span></div><div><b>${res.avoids}</b><span>avoid choices</span></div></div>
          <ul class="insights">${res.dups ? `<li>${res.dups} pupil${res.dups > 1 ? "s" : ""} submitted more than once: the latest answers are used.</li>` : ""}${res.selfs ? `<li>${res.selfs} choice${res.selfs > 1 ? "s" : ""} of oneself ignored.</li>` : ""}${res.conflicts ? `<li>${res.conflicts} name${res.conflicts > 1 ? "s" : ""} appeared in both lists for the same pupil: the first answer is kept.</li>` : ""}${res.avoids ? "" : `<li>No “prefer not” answers: the sociogram uses positive choices only, which is fine.</li>`}${(() => { const extra = [...new Set(res.choices.filter(c => c.to && !res.respondents.has(c.to)).map(c => res.byNorm.get(c.to).name))]; return extra.length ? `<li>Named but didn’t respond: ${extra.map(esc).join(", ")}. They’ll be added and marked.</li>` : ""; })()}</ul>
          ${res.unmatched.size ? `<h3>Names to check (${res.unmatched.size})</h3><p class="note">These didn’t match anyone. Link each to the right pupil, or add them as a new person.</p>${[...res.unmatched.values()].map(u => { const g = res.suggest(u.raw); return `<label class="row2 pp-un"><span>“${esc(u.raw)}”${u.count > 1 ? ` (×${u.count})` : ""}${g ? `<small class="note"> looks like ${esc(res.byNorm.get(g).name)}</small>` : ""}</span><select data-un="${esc(norm(u.raw))}"><option value="__new" ${g ? "" : "selected"}>Add as a new person (didn’t respond)</option><option value="__skip">Ignore this name</option>${[...res.byNorm.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([k, v]) => `<option value="${esc(k)}" ${k === g ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></label>`; }).join("")}` : ""}
          ${D.people.length ? `<label class="check"><input type="checkbox" id="ppRep" checked> Replace the people and choices already here</label>` : ""}`}`;
        prev.querySelectorAll("[data-col]").forEach(sel => sel.onchange = () => { if (sel.value === "name") det.roles = det.roles.map(r => r === "name" ? "ignore" : r); det.roles[+sel.dataset.col] = sel.value; show(); });
        prev.querySelector("#ppHead").onchange = e => { det.hasHeader = e.target.checked; show(); };
      };
      ta.addEventListener("input", () => { rows = parseTable(ta.value); det = rows.length ? detect(rows) : null; show(); });
      const r = await dialog({ title: "Paste responses from a form", body, wide: true, actions: [{ label: "Cancel", value: "" }, { label: "Make the sociogram", primary: true, value: "ok" }] });
      if (r.value !== "ok") return; if (!res || res.error || !res.respondents.size) return toast("Nothing to import yet. Paste the response rows first.");
      const map = {}; prev.querySelectorAll("[data-un]").forEach(s2 => map[s2.dataset.un] = s2.value);
      if (prev.querySelector("#ppRep")?.checked) { D.people = []; D.ties = []; D.pos = {}; }
      const idOf = new Map(D.people.map(p => [norm(p.name), p.id])), ensure = (k, name, responded) => { let id = idOf.get(k); if (!id) { id = uid(); D.people.push({ id, name, group: "", responded }); idOf.set(k, id); } const p = person(id); if (responded) p.responded = true; else if (p.responded == null) p.responded = false; return id; };
      for (const [k, v] of res.respondents) { const id = ensure(k, v.name, true); if (res.groupCol >= 0 && v.row[res.groupCol]) person(id).group = v.row[res.groupCol].trim(); }
      let added = 0;
      for (const c of res.choices) { let to = c.to; if (!to) { const m = map[norm(c.raw)] || "__new"; if (m === "__skip") continue; to = m === "__new" ? norm(c.raw) : m; if (!res.byNorm.has(to)) res.byNorm.set(to, { name: c.raw }); }
        if (to === c.from) continue; const a = ensure(c.from, res.byNorm.get(c.from).name, true), b = ensure(to, res.byNorm.get(to).name, res.respondents.has(to)); if (D.ties.some(t => t.from === a && t.to === b)) continue; D.ties.push({ id: uid(), from: a, to: b, type: c.type, rank: c.rank }); added++; }
      if (res.avoids && !D.allowNeg) { D.allowNeg = true; toast("“Prefer not” answers were recorded. Handle them sensitively, and keep the results private.", 6500); }
      D.pos = {}; D.tab = "insights"; sel = null; ctx.changed(); compute(); render(); setTimeout(fit, 0);
      if (!res.avoids) toast(`Sociogram made from ${res.respondents.size} responses and ${added} choices.`);
    }
    async function importCsv() { const f = h("input", { type: "file", accept: ".csv,text/csv" }); f.onchange = async () => { const txt = await f.files[0].text(), rows = txt.split(/\r?\n/).map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, ""))).filter(r => r.length >= 2 && r[0]); if (/^(from|source)$/i.test(rows[0][0])) rows.shift(); const idOf = n => { let p = D.people.find(x => x.name.toLowerCase() === n.toLowerCase()); if (!p) { p = { id: uid(), name: n, group: "" }; D.people.push(p); } return p.id; }; let k = 0; rows.forEach(([a, b, t]) => { const ia = idOf(a), ib = idOf(b), type = /neg|avoid|^-/i.test(t || "") ? "negative" : "positive"; if (ia !== ib && !D.ties.some(x => x.from === ia && x.to === ib)) { D.ties.push({ id: uid(), from: ia, to: ib, type }); k++; } }); if (D.ties.some(t => t.type === "negative")) D.allowNeg = true; D.pos = {}; ctx.changed(); compute(); render(); setTimeout(fit, 0); toast(`Imported ${k} choices`); }; f.click(); }
    const csv = rows => new Blob(["\ufeff" + rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n")], { type: "text/csv" });
    const keys = e => { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if ((e.key === "Delete" || e.key === "Backspace") && selTie) { D.ties = D.ties.filter(x => x.id !== selTie); selTie = null; ctx.changed(); compute(); render(); } if (e.key === "Escape") { sel = null; selTie = null; render(); } };
    addEventListener("keydown", keys); compute(); render(); setTimeout(fit, 0);
    return {
      reload(d) { D = d; D.pos ||= {}; compute(); render(); },
      destroy() { removeEventListener("keydown", keys); },
      canvas: () => ({ svg, world }),
      exports: () => [{ label: "Image (PNG)", icon: "download", run: () => { const s = sel; sel = null; render(); exportPNG(svg, world, ctx.doc.title); sel = s; render(); } }, { label: "Vector (SVG)", icon: "download", run: () => exportSVG(svg, world, ctx.doc.title) },
        { label: "Measures for each person (CSV)", icon: "download", run: () => download(csv([["Name", "Group", "Chosen by", "Chose", "Mutual", "Avoided by", "Betweenness", "Harmonic closeness", "Eigenvector", "PageRank", "Clustering", "Community", "Sociometric status", "Not chosen"], ...A.per.map(p => [p.name, person(p.id)?.group, p.inDeg, p.outDeg, p.mutual, p.negIn, n2(p.betweenness), n2(p.closeness), n2(p.eigenvector), p.pagerank.toFixed(4), n2(p.clustering), p.community + 1, p.status || "", p.unchosen ? "yes" : ""])]), `${fileSafe(ctx.doc.title)}-measures.csv`) },
        { label: "Choices (CSV)", icon: "download", run: () => download(csv([["from", "to", "type"], ...D.ties.map(t => [person(t.from)?.name, person(t.to)?.name, t.type])]), `${fileSafe(ctx.doc.title)}-choices.csv`) }],
    };
  }
  Modules.sociogram = { blank, templates, mount };
})();
