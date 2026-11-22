/* Board: one set of cards, three views (Kanban, Table, Timeline). */
"use strict";
(() => {
  const PRI = { low: ["Low", "#8A9497"], medium: ["Medium", "#2F6DB5"], high: ["High", "#B86E00"], urgent: ["Urgent", "#C2413A"] };
  const COLS = ["#8A9497", "#2F6DB5", "#B86E00", "#2F7D4F", "#7A4FC2", "#C2413A"];
  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d + "T00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  const daysBetween = (a, b) => Math.round((new Date(b + "T00:00") - new Date(a + "T00:00")) / 864e5);
  const fmtD = d => d ? new Date(d + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";
  const initials = n => (n || "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  function blank(cols = ["To do", "In progress", "Done"]) { return { view: "kanban", columns: cols.map((n, i) => ({ id: uid(), name: n, color: COLS[i % COLS.length] })), cards: [], labels: [{ id: uid(), name: "Design", color: "#7A4FC2" }, { id: uid(), name: "Research", color: "#2F6DB5" }, { id: uid(), name: "Admin", color: "#B86E00" }], people: [] }; }
  function sample(cols, items, people) { const d = blank(cols); d.people = people; items.forEach(([title, ci, owner, s, e, pri, li]) => d.cards.push({ id: uid(), col: d.columns[ci].id, title, desc: "", labels: li != null ? [d.labels[li].id] : [], owner, start: s == null ? "" : addDays(today(), s), due: e == null ? "" : addDays(today(), e), priority: pri, checklist: [], created: Date.now() })); return d; }
  const templates = {
    project: { title: "Project plan", data: () => sample(["To do", "In progress", "Done"], [["Agree goals and success measures", 2, "Aisha", -10, -6, "high", 1], ["Map stakeholders", 1, "Ben", -4, 3, "medium", 1], ["Draft the plan", 1, "Aisha", -2, 6, "high", 2], ["Design the first version", 0, "Chen", 5, 14, "medium", 0], ["Book the launch venue", 0, "Ben", 8, 12, "low", 2]], ["Aisha", "Ben", "Chen"]) },
    sprint: { title: "Sprint board", data: () => sample(["Backlog", "Ready", "In progress", "Review", "Done"], [["Sign-in with email", 3, "Dev", -6, 1, "high", 0], ["Dashboard empty state", 2, "Mei", -3, 3, "medium", 0], ["Usage analytics", 1, "Dev", 2, 7, "medium", 1], ["Accessibility review", 0, "Mei", 6, 10, "high", 1], ["Release notes", 0, "Sam", 9, 11, "low", 2]], ["Dev", "Mei", "Sam"]) },
  };
  function mount(ctx) {
    let D = ctx.doc.data, sel = null, q = "", fLabel = "", fOwner = "", sortKey = null, sortDir = 1;
    const wrap = h("div", { class: "board-wrap" }), bar = h("div", { class: "board-bar" }), area = h("div", { class: "board-area" }); wrap.append(bar, area); ctx.stage.append(wrap);
    const seg = h("div", { class: "seg", role: "group", "aria-label": "View" }); [["kanban", "Kanban"], ["table", "Table"], ["timeline", "Timeline"]].forEach(([v, n]) => seg.append(h("button", { "aria-pressed": String(D.view === v), onclick: () => { D.view = v; ctx.changed(); render(); } }, n))); ctx.setView(seg);
    const col = id => D.columns.find(c => c.id === id), card = id => D.cards.find(c => c.id === id), label = id => D.labels.find(l => l.id === id);
    const visible = () => D.cards.filter(c => (!q || (c.title + " " + c.desc + " " + (c.owner || "")).toLowerCase().includes(q)) && (!fLabel || c.labels.includes(fLabel)) && (!fOwner || c.owner === fOwner));
    const progress = c => c.checklist.length ? Math.round(c.checklist.filter(x => x.done).length / c.checklist.length * 100) : null;
    function renderBar() {
      bar.innerHTML = `<label class="search sm">${ICONS.search}<input type="search" placeholder="Filter cards" value="${esc(q)}" aria-label="Filter cards"></label>
        <select aria-label="Filter by label"><option value="">All labels</option>${D.labels.map(l => `<option value="${l.id}" ${fLabel === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select>
        <select aria-label="Filter by owner"><option value="">Everyone</option>${[...new Set(D.cards.map(c => c.owner).filter(Boolean))].map(o => `<option ${fOwner === o ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>
        <span class="spacer"></span><button class="btn" data-act="col">${ICONS.plus}Column</button><button class="btn primary" data-act="card">${ICONS.plus}Card</button>`;
      const [inp, s1, s2] = bar.querySelectorAll("input,select"); inp.oninput = () => { q = inp.value.toLowerCase(); renderArea(); }; s1.onchange = () => { fLabel = s1.value; renderArea(); }; s2.onchange = () => { fOwner = s2.value; renderArea(); };
      bar.querySelector('[data-act="col"]').onclick = async () => { const n = await ask("New column", "Name", "New column"); if (!n) return; D.columns.push({ id: uid(), name: n, color: COLS[D.columns.length % COLS.length] }); ctx.changed(); render(); };
      bar.querySelector('[data-act="card"]').onclick = () => addCard(D.columns[0].id);
    }
    function addCard(colId, title = "New card") { const c = { id: uid(), col: colId, title, desc: "", labels: [], owner: "", start: "", due: "", priority: "medium", checklist: [], created: Date.now() }; D.cards.push(c); sel = c.id; ctx.changed(); render(); ctx.openInspector(); setTimeout(() => ctx.insp.querySelector("#cTitle")?.select(), 30); }
    function cardFace(c) {
      const p = progress(c), over = c.due && c.due < today() && col(c.col) !== D.columns[D.columns.length - 1];
      return `<div class="lbls">${c.labels.map(id => label(id)).filter(Boolean).map(l => `<i style="background:${l.color}" title="${esc(l.name)}"></i>`).join("")}</div><b>${esc(c.title)}</b>
        <div class="meta">${c.priority && c.priority !== "medium" ? `<span class="pri" style="color:${PRI[c.priority][1]}">● ${PRI[c.priority][0]}</span>` : ""}${c.due ? `<span class="${over ? "over" : ""}">${over ? "Overdue " : ""}${fmtD(c.due)}</span>` : ""}${p != null ? `<span>✓ ${c.checklist.filter(x => x.done).length}/${c.checklist.length}</span>` : ""}${c.owner ? `<span class="av" title="${esc(c.owner)}">${esc(initials(c.owner))}</span>` : ""}</div>`;
    }
    function renderKanban() {
      area.className = "board-area kanban"; area.innerHTML = ""; const vis = new Set(visible().map(c => c.id));
      D.columns.forEach(cl => {
        const list = D.cards.filter(c => c.col === cl.id && vis.has(c.id)), colEl = h("section", { class: "kcol", "data-col": cl.id, "aria-label": cl.name });
        colEl.innerHTML = `<header><i style="background:${cl.color}"></i><input value="${esc(cl.name)}" aria-label="Column name"><span class="n">${list.length}</span><button class="icon sm" aria-label="Column options">⋯</button></header><div class="kcards"></div><button class="addc">${ICONS.plus}Add a card</button>`;
        const cards = colEl.querySelector(".kcards");
        list.forEach(c => { const el = h("article", { class: "kcard" + (sel === c.id ? " sel" : ""), draggable: "true", tabindex: "0", "data-id": c.id, "aria-label": c.title }); el.innerHTML = cardFace(c); el.onclick = () => select(c.id); el.onkeydown = e => { if (e.key === "Enter") select(c.id); }; el.ondragstart = e => { e.dataTransfer.setData("text/plain", c.id); el.classList.add("dragging"); }; el.ondragend = () => el.classList.remove("dragging"); cards.append(el); });
        colEl.ondragover = e => { e.preventDefault(); colEl.classList.add("over"); const after = [...cards.children].find(x => e.clientY < x.getBoundingClientRect().top + x.offsetHeight / 2); cards.querySelector(".ph")?.remove(); const ph = h("div", { class: "ph" }); after ? cards.insertBefore(ph, after) : cards.append(ph); };
        colEl.ondragleave = e => { if (!colEl.contains(e.relatedTarget)) { colEl.classList.remove("over"); cards.querySelector(".ph")?.remove(); } };
        colEl.ondrop = e => { e.preventDefault(); colEl.classList.remove("over"); const id = e.dataTransfer.getData("text/plain"), c = card(id); if (!c) return; const ph = cards.querySelector(".ph"), beforeId = ph?.nextElementSibling?.dataset.id; ph?.remove(); D.cards = D.cards.filter(x => x !== c); c.col = cl.id; const bi = beforeId ? D.cards.findIndex(x => x.id === beforeId) : -1; bi >= 0 ? D.cards.splice(bi, 0, c) : D.cards.push(c); ctx.changed(); render(); };
        colEl.querySelector("input").onchange = e => { cl.name = e.target.value.trim() || cl.name; ctx.changed(); };
        colEl.querySelector(".addc").onclick = () => addCard(cl.id);
        colEl.querySelector(".icon").onclick = e => popMenu(e.currentTarget, [
          { label: "Move left", run: () => { const i = D.columns.indexOf(cl); if (i > 0) { [D.columns[i - 1], D.columns[i]] = [D.columns[i], D.columns[i - 1]]; ctx.changed(); render(); } } },
          { label: "Move right", run: () => { const i = D.columns.indexOf(cl); if (i < D.columns.length - 1) { [D.columns[i + 1], D.columns[i]] = [D.columns[i], D.columns[i + 1]]; ctx.changed(); render(); } } },
          { label: "Change colour", run: () => { cl.color = COLS[(COLS.indexOf(cl.color) + 1) % COLS.length]; ctx.changed(); render(); } },
          { label: "Delete column", icon: "trash", run: async () => { if (D.columns.length < 2) return toast("A board needs at least one column."); const n = D.cards.filter(c => c.col === cl.id).length; if (n && !(await confirmIt("Delete this column?", `Its ${n} card${n > 1 ? "s" : ""} will move to the first remaining column.`, "Delete column"))) return; D.columns = D.columns.filter(x => x !== cl); D.cards.forEach(c => { if (c.col === cl.id) c.col = D.columns[0].id; }); ctx.changed(); render(); } },
        ]);
        area.append(colEl);
      });
    }
    function renderTable() {
      area.className = "board-area table"; const vis = visible(), keyVal = (c, k) => k === "status" ? D.columns.indexOf(col(c.col)) : k === "priority" ? Object.keys(PRI).indexOf(c.priority) : k === "progress" ? progress(c) ?? -1 : (c[k] || "");
      const rows = sortKey ? [...vis].sort((a, b) => (keyVal(a, sortKey) > keyVal(b, sortKey) ? 1 : keyVal(a, sortKey) < keyVal(b, sortKey) ? -1 : 0) * sortDir) : vis;
      const th = (k, n) => `<th><button data-sort="${k}" aria-label="Sort by ${n}">${n}${sortKey === k ? (sortDir > 0 ? " ↑" : " ↓") : ""}</button></th>`;
      let html = `<table class="tbl"><thead><tr>${th("title", "Card")}${th("status", "Status")}${th("owner", "Owner")}${th("priority", "Priority")}${th("start", "Start")}${th("due", "Due")}${th("progress", "Progress")}</tr></thead>`;
      const groups = sortKey ? [[null, rows]] : D.columns.map(cl => [cl, rows.filter(c => c.col === cl.id)]);
      for (const [cl, list] of groups) {
        html += `<tbody>${cl ? `<tr class="grp"><td colspan="7" style="--c:${cl.color}"><b>${esc(cl.name)}</b> <span>${list.length}</span></td></tr>` : ""}`;
        html += list.map(c => { const p = progress(c); return `<tr data-id="${c.id}" class="${sel === c.id ? "sel" : ""}" style="--c:${col(c.col)?.color}"><td><input value="${esc(c.title)}" data-f="title" aria-label="Card name"></td><td><select data-f="col" aria-label="Status" class="pill" style="--c:${col(c.col)?.color}">${D.columns.map(x => `<option value="${x.id}" ${x.id === c.col ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></td><td><input value="${esc(c.owner)}" data-f="owner" list="ppl" aria-label="Owner" placeholder="—"></td><td><select data-f="priority" aria-label="Priority">${Object.entries(PRI).map(([k, [n]]) => `<option value="${k}" ${c.priority === k ? "selected" : ""}>${n}</option>`).join("")}</select></td><td><input type="date" value="${c.start}" data-f="start" aria-label="Start"></td><td><input type="date" value="${c.due}" data-f="due" aria-label="Due"></td><td>${p == null ? `<span class="muted">—</span>` : `<span class="bar"><i style="width:${p}%"></i></span> ${p}%`}</td></tr>`; }).join("");
        if (cl) html += `<tr class="add"><td colspan="7"><button data-add="${cl.id}">${ICONS.plus}Add a card to ${esc(cl.name)}</button></td></tr>`;
        html += `</tbody>`;
      }
      area.innerHTML = html + `</table><datalist id="ppl">${[...new Set([...D.people, ...D.cards.map(c => c.owner).filter(Boolean)])].map(p => `<option value="${esc(p)}">`).join("")}</datalist>`;
      area.querySelectorAll("[data-sort]").forEach(b => b.onclick = () => { const k = b.dataset.sort; if (sortKey === k) { sortDir = -sortDir; if (sortDir > 0) sortKey = null; } else { sortKey = k; sortDir = 1; } renderTable(); });
      area.querySelectorAll("[data-add]").forEach(b => b.onclick = () => addCard(b.dataset.add));
      area.querySelectorAll("tr[data-id]").forEach(tr => { const c = card(tr.dataset.id); tr.onclick = e => { if (!e.target.closest("input,select")) select(c.id); }; tr.querySelectorAll("[data-f]").forEach(inp => inp.onchange = () => { c[inp.dataset.f] = inp.value; ctx.changed(); render(); }); });
    }
    function renderTimeline() {
      area.className = "board-area timeline"; const list = visible().filter(c => c.start || c.due);
      if (!list.length) { area.innerHTML = `<div class="emptyv"><b>Nothing on the timeline yet</b><p>Give cards a start or due date, in the card details or the Table view.</p></div>`; return; }
      const dates = list.flatMap(c => [c.start, c.due].filter(Boolean)).concat(today()).sort(), from = addDays(dates[0], -3), to = addDays(dates[dates.length - 1], 5), days = daysBetween(from, to) + 1, W = 30;
      let head = ""; for (let i = 0; i < days; i++) { const d = addDays(from, i), dt = new Date(d + "T00:00"); head += `<div class="tday ${dt.getDay() % 6 === 0 ? "wk" : ""} ${d === today() ? "now" : ""}" style="left:${i * W}px">${dt.getDate() === 1 || i === 0 ? `<b>${dt.toLocaleDateString(undefined, { month: "short" })}</b>` : ""}${dt.getDate()}</div>`; }
      const rows = list.map((c, r) => { const s = c.start || c.due, e = c.due || c.start, x = daysBetween(from, s) * W, w = (daysBetween(s, e) + 1) * W, ms = !c.start || !c.due || s === e; return `<div class="trow" style="top:${r * 40 + 36}px"><div class="tbar ${ms && !c.start ? "ms" : ""} ${sel === c.id ? "sel" : ""}" data-id="${c.id}" style="left:${x}px;width:${Math.max(W, w)}px;--c:${col(c.col)?.color}" tabindex="0" aria-label="${esc(c.title)}, ${fmtD(s)} to ${fmtD(e)}"><span>${esc(c.title)}</span><i class="grip" aria-hidden="true"></i></div></div>`; }).join("");
      area.innerHTML = `<div class="tl" style="width:${days * W}px;height:${list.length * 40 + 60}px"><div class="thead">${head}</div><div class="tnow" style="left:${daysBetween(from, today()) * W + W / 2}px"></div>${rows}</div><p class="note tl-note">Drag a bar to move it, or drag its right edge to change the due date.</p>`;
      area.querySelectorAll(".tbar").forEach(b => {
        const c = card(b.dataset.id); let drag = null;
        b.onpointerdown = e => { drag = { x: e.clientX, mode: e.target.classList.contains("grip") ? "end" : "move", s: c.start, d: c.due, moved: false }; b.setPointerCapture(e.pointerId); };
        b.onpointermove = e => { if (!drag) return; const n = Math.round((e.clientX - drag.x) / W); if (!n && !drag.moved) return; drag.moved = true; if (drag.mode === "move") { if (drag.s) c.start = addDays(drag.s, n); if (drag.d) c.due = addDays(drag.d, n); } else { c.due = addDays(drag.d || drag.s, n); if (c.start && c.due < c.start) c.due = c.start; } const s = c.start || c.due, en = c.due || c.start; b.style.left = daysBetween(from, s) * W + "px"; b.style.width = Math.max(W, (daysBetween(s, en) + 1) * W) + "px"; };
        b.onpointerup = () => { if (drag?.moved) { ctx.changed(); toast(`${c.title}: ${fmtD(c.start || c.due)} to ${fmtD(c.due || c.start)}`); } else select(c.id); drag = null; };
      });
      setTimeout(() => { const now = area.querySelector(".tnow"); if (now) area.scrollLeft = Math.max(0, now.offsetLeft - 200); }, 0);
    }
    function select(id) { sel = id; renderArea(); renderInsp(); ctx.openInspector(); }
    function renderInsp() {
      const c = card(sel), I = ctx.insp;
      if (!c) { const n = D.cards.length, done = D.cards.filter(x => x.col === D.columns[D.columns.length - 1]?.id).length, over = D.cards.filter(x => x.due && x.due < today() && x.col !== D.columns[D.columns.length - 1]?.id).length; I.innerHTML = `<h2>Board</h2><p class="hint">Select a card to see its details.</p><div class="stats"><div><b>${n}</b><span>cards</span></div><div><b>${done}</b><span>in ${esc(D.columns[D.columns.length - 1]?.name || "the last column")}</span></div><div><b class="${over ? "over" : ""}">${over}</b><span>overdue</span></div></div><h3>Labels</h3><div class="chips">${D.labels.map(l => `<span class="chip" style="border-color:${l.color}"><i class="dot" style="background:${l.color}"></i>${esc(l.name)}</span>`).join("")}<button class="chip" id="addLabel">＋ Label</button></div><p class="note">Tip: the last column counts as done.</p>`; I.querySelector("#addLabel").onclick = addLabel; return; }
      I.innerHTML = `<h2>Card</h2><label class="field"><span>Name</span><input id="cTitle" value="${esc(c.title)}"></label>
        <div class="row2"><label class="field"><span>Status</span><select id="cCol">${D.columns.map(x => `<option value="${x.id}" ${x.id === c.col ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><label class="field"><span>Owner</span><input id="cOwner" list="pplI" value="${esc(c.owner)}" placeholder="Name"></label></div>
        <datalist id="pplI">${[...new Set([...D.people, ...D.cards.map(x => x.owner).filter(Boolean)])].map(p => `<option value="${esc(p)}">`).join("")}</datalist>
        <div class="row2"><label class="field"><span>Start</span><input type="date" id="cStart" value="${c.start}"></label><label class="field"><span>Due</span><input type="date" id="cDue" value="${c.due}"></label></div>
        <span class="field"><span>Priority</span></span><div class="chips">${Object.entries(PRI).map(([k, [n]]) => `<button class="chip" data-pri="${k}" aria-pressed="${c.priority === k}">${n}</button>`).join("")}</div>
        <span class="field"><span>Labels</span></span><div class="chips">${D.labels.map(l => `<button class="chip" data-lbl="${l.id}" aria-pressed="${c.labels.includes(l.id)}"><i class="dot" style="background:${l.color}"></i>${esc(l.name)}</button>`).join("")}<button class="chip" id="addLabel">＋</button></div>
        <label class="field"><span>Description</span><textarea id="cDesc" placeholder="Add details, links or notes">${esc(c.desc)}</textarea></label>
        <span class="field"><span>Checklist ${c.checklist.length ? `(${c.checklist.filter(x => x.done).length}/${c.checklist.length})` : ""}</span></span>
        <div class="checklist">${c.checklist.map(x => `<label class="check"><input type="checkbox" data-ck="${x.id}" ${x.done ? "checked" : ""}><span>${esc(x.t)}</span><button class="icon sm" data-ckdel="${x.id}" aria-label="Remove item">✕</button></label>`).join("")}</div>
        <div class="row"><input id="ckNew" placeholder="Add an item and press Enter" style="flex:1" class="inp"></div>
        <div class="row" style="margin-top:1rem"><button class="btn danger" id="cDel">${ICONS.trash}Delete card</button><button class="btn" id="cClose">Close</button></div>`;
      const set = (k, v) => { c[k] = v; ctx.changed(); renderArea(); };
      I.querySelector("#cTitle").oninput = e => set("title", e.target.value); I.querySelector("#cCol").onchange = e => set("col", e.target.value); I.querySelector("#cOwner").onchange = e => set("owner", e.target.value.trim()); I.querySelector("#cStart").onchange = e => set("start", e.target.value); I.querySelector("#cDue").onchange = e => set("due", e.target.value); I.querySelector("#cDesc").oninput = e => { c.desc = e.target.value; ctx.changed(); };
      I.querySelectorAll("[data-pri]").forEach(b => b.onclick = () => { set("priority", b.dataset.pri); renderInsp(); });
      I.querySelectorAll("[data-lbl]").forEach(b => b.onclick = () => { const id = b.dataset.lbl; c.labels = c.labels.includes(id) ? c.labels.filter(x => x !== id) : [...c.labels, id]; ctx.changed(); renderArea(); renderInsp(); });
      I.querySelector("#addLabel").onclick = addLabel;
      I.querySelectorAll("[data-ck]").forEach(b => b.onchange = () => { c.checklist.find(x => x.id === b.dataset.ck).done = b.checked; ctx.changed(); renderArea(); renderInsp(); });
      I.querySelectorAll("[data-ckdel]").forEach(b => b.onclick = e => { e.preventDefault(); c.checklist = c.checklist.filter(x => x.id !== b.dataset.ckdel); ctx.changed(); renderArea(); renderInsp(); });
      I.querySelector("#ckNew").onkeydown = e => { if (e.key === "Enter" && e.target.value.trim()) { c.checklist.push({ id: uid(), t: e.target.value.trim(), done: false }); ctx.changed(); renderArea(); renderInsp(); I.querySelector("#ckNew").focus(); } };
      I.querySelector("#cDel").onclick = async () => { if (!(await confirmIt("Delete this card?", `“${c.title}” will be deleted. You can undo with Ctrl+Z.`))) return; D.cards = D.cards.filter(x => x !== c); sel = null; ctx.changed(); render(); };
      I.querySelector("#cClose").onclick = () => { sel = null; render(); ctx.body.classList.remove("insp-open"); };
    }
    async function addLabel() { const n = await ask("New label", "Name"); if (!n) return; D.labels.push({ id: uid(), name: n, color: INKS[(D.labels.length + 1) % INKS.length] }); ctx.changed(); renderBar(); renderInsp(); }
    function renderArea() { ({ kanban: renderKanban, table: renderTable, timeline: renderTimeline })[D.view](); }
    function render() { seg.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(["kanban", "table", "timeline"][i] === D.view))); renderBar(); renderArea(); renderInsp(); }
    const keys = e => { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if ((e.key === "Delete" || e.key === "Backspace") && sel) { const c = card(sel); if (!c) return; D.cards = D.cards.filter(x => x !== c); sel = null; ctx.changed(); render(); toast("Card deleted. Undo with Ctrl+Z."); } if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey) addCard(D.columns[0].id); };
    addEventListener("keydown", keys); render();
    return {
      reload(d) { D = d; if (sel && !card(sel)) sel = null; render(); },
      destroy() { removeEventListener("keydown", keys); },
      exports: () => [{ label: "Spreadsheet (CSV)", icon: "download", run: () => { const rows = [["Card", "Status", "Owner", "Priority", "Start", "Due", "Labels", "Checklist done", "Description"], ...D.cards.map(c => [c.title, col(c.col)?.name, c.owner, PRI[c.priority]?.[0], c.start, c.due, c.labels.map(id => label(id)?.name).filter(Boolean).join("; "), c.checklist.length ? `${c.checklist.filter(x => x.done).length}/${c.checklist.length}` : "", c.desc])]; download(new Blob(["\ufeff" + rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n")], { type: "text/csv" }), `${fileSafe(ctx.doc.title)}.csv`); } }],
    };
  }
  Modules.board = { blank: () => blank(), templates, mount };
})();
