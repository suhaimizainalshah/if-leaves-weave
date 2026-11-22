/* Prototype: phone screens built from UI parts, linked into a clickable flow. Describe a screen to start it,
   play it like a user, and export a working HTML prototype. */
"use strict";
(() => {
  const SW = 390, SH = 844;
  const KINDS = { header: ["App bar", 56], heading: ["Heading", 44], text: ["Text", 60], button: ["Button", 48], input: ["Text field", 66], search: ["Search", 44], image: ["Image", 180], card: ["Card", 96], list: ["List", 168], chips: ["Chips", 36], toggle: ["Toggle", 44], checkbox: ["Checkbox", 32], avatar: ["Avatar", 56], tabbar: ["Tab bar", 64] };
  const DEFTXT = { header: "Title", heading: "Heading", text: "Add a short description here.", button: "Continue", input: "Label|Placeholder", search: "Search", image: "Image", card: "Card title|Supporting text", list: "First item\nSecond item\nThird item", chips: "All|Popular|New", toggle: "Notifications", checkbox: "I agree to the terms", avatar: "Alex Tan|Member since 2024", tabbar: "Home|Search|Saved|Profile" };
  function blank() { const s = { id: uid(), name: "Home", x: 0, y: 0, bg: "#FFFFFF" }; return { screens: [s], items: [], start: s.id, accent: "#0E7C7B", flows: true, view: { x: 60, y: 40, z: .8 } }; }
  /* ---------- describe a screen: offline, rule-based generator ---------- */
  function generate(desc) {
    const d = desc.toLowerCase(), out = [], add = (kind, text, extra = {}) => out.push({ kind, text: text ?? DEFTXT[kind], ...extra }), has = (...w) => w.some(x => d.includes(x));
    const titleMatch = desc.match(/^(.{3,40}?)(?: screen| page| with|[:,.]|$)/i), title = titleMatch ? titleMatch[1].replace(/^(a|an|the)\s+/i, "").replace(/^./, c => c.toUpperCase()) : "Screen";
    if (has("sign in", "login", "log in", "sign-in")) { add("header", "Sign in", { back: true }); add("heading", "Welcome back"); add("text", "Sign in to carry on where you left off."); add("input", "Email|you@example.com"); add("input", "Password|••••••••"); add("checkbox", "Remember me"); add("button", "Sign in"); add("button", "Create an account", { variant: "secondary" }); }
    else if (has("sign up", "register", "create account", "signup")) { add("header", "Create account", { back: true }); add("heading", "Join in a minute"); add("input", "Full name|Your name"); add("input", "Email|you@example.com"); add("input", "Password|At least 8 characters"); add("checkbox", "I agree to the terms"); add("button", "Create account"); }
    else if (has("onboarding", "welcome", "intro")) { add("image", "Welcome illustration", { h: 300 }); add("heading", "Plan, track and share"); add("text", "Everything your team needs, in one simple app."); add("button", "Get started"); add("button", "I already have an account", { variant: "secondary" }); }
    else if (has("dashboard", "overview", "home")) { add("header", title); add("avatar", "Hello, Alex|Here’s your day"); add("chips", "Today|This week|This month"); add("card", "Tasks due|3 today, 5 this week"); add("card", "Progress|68% of goals complete"); add("list", "Team meeting at 10:00\nReview the budget\nCall the supplier"); add("tabbar"); }
    else if (has("profile", "account")) { add("header", "Profile", { back: true }); add("avatar", "Alex Tan|alex@example.com"); add("list", "Personal details\nPayment methods\nNotifications\nHelp and support"); add("button", "Edit profile", { variant: "secondary" }); add("tabbar", "Home|Search|Saved|Profile"); }
    else if (has("setting")) { add("header", "Settings", { back: true }); add("toggle", "Notifications"); add("toggle", "Dark mode"); add("toggle", "Location"); add("list", "Language\nPrivacy\nAbout"); add("button", "Sign out", { variant: "secondary" }); }
    else if (has("checkout", "payment", "cart", "basket")) { add("header", "Checkout", { back: true }); add("card", "Order summary|2 items, S$48.00"); add("input", "Card number|1234 5678 9012 3456"); add("input", "Name on card|Alex Tan"); add("checkbox", "Save this card"); add("button", "Pay S$48.00"); }
    else if (has("chat", "message", "inbox")) { add("header", "Messages", { back: true }); add("search", "Search messages"); add("list", "Mei Ling: See you at 7!\nDev team: Release is live\nAunty Lim: Thank you"); add("input", "|Type a message"); add("tabbar"); }
    else if (has("detail", "product", "item", "event")) { add("header", title, { back: true }); add("image", "Photo", { h: 220 }); add("heading", "Item name"); add("text", "A clear, short description that helps people decide."); add("chips", "Popular|In stock|Free delivery"); add("button", "Add to cart"); }
    else if (has("search", "explore", "browse")) { add("header", "Explore"); add("search", "Search"); add("chips", "All|Nearby|Top rated"); add("card", "Result one|A short description"); add("card", "Result two|A short description"); add("tabbar", "Home|Explore|Saved|Profile"); }
    else if (has("list", "feed", "list of")) { add("header", title); add("search"); add("list", "First item\nSecond item\nThird item\nFourth item"); add("button", "Add new"); add("tabbar"); }
    else if (has("form", "contact", "booking", "book", "feedback", "survey")) { add("header", title, { back: true }); add("heading", title); add("input", "Name|Your name"); add("input", "Email|you@example.com"); add("input", "Message|How can we help?", { h: 110 }); add("button", "Send"); }
    else { add("header", title); add("heading", title); add("text", "Describe what this screen is for."); add("button", "Continue"); }
    // explicit extras the person mentioned
    if (has("tab bar", "bottom nav", "navigation bar") && !out.some(o => o.kind === "tabbar")) add("tabbar");
    if (has("search bar", "search field") && !out.some(o => o.kind === "search")) out.splice(1, 0, { kind: "search", text: "Search" });
    if (has("image", "photo", "picture", "banner") && !out.some(o => o.kind === "image")) out.splice(1, 0, { kind: "image", text: "Image", h: 180 });
    const btn = desc.match(/(?:a|an|the)\s+["“]?([\w\s]{2,24}?)["”]?\s+button/i); if (btn && !/sign in|continue/i.test(btn[1])) { const b = out.find(o => o.kind === "button"); if (b) b.text = btn[1].trim().replace(/^./, c => c.toUpperCase()); else add("button", btn[1].trim()); }
    // lay out top to bottom
    let y = 44; const items = []; const tab = out.find(o => o.kind === "tabbar");
    out.filter(o => o !== tab).forEach(o => { const hh = o.h || KINDS[o.kind][1], full = ["header", "tabbar", "image"].includes(o.kind) && o.kind !== "image" ? true : o.kind === "image" && !o.inset; items.push({ id: uid(), kind: o.kind, text: o.text, x: o.kind === "header" ? 0 : 20, y, w: o.kind === "header" ? SW : SW - 40, h: hh, variant: o.variant || "primary", back: !!o.back, link: null }); y += hh + (o.kind === "header" ? 12 : 14); void full; });
    if (tab) items.push({ id: uid(), kind: "tabbar", text: tab.text, x: 0, y: SH - 64 - 20, w: SW, h: 64, link: null });
    return { title, items };
  }
  const templates = { app: { title: "App prototype", data: () => { const d = blank(); d.screens = []; d.items = []; ["Onboarding welcome screen", "Sign in screen", "Home dashboard", "Profile"].forEach((txt, i) => { const g = generate(txt), s = { id: uid(), name: ["Welcome", "Sign in", "Home", "Profile"][i], x: i * (SW + 120), y: 0, bg: "#FFFFFF" }; d.screens.push(s); g.items.forEach(it => d.items.push({ ...it, screen: s.id })); }); d.start = d.screens[0].id; const link = (si, kind, to, nth = 0) => { const it = d.items.filter(x => x.screen === d.screens[si].id && x.kind === kind)[nth]; if (it) it.link = d.screens[to].id; }; link(0, "button", 1); link(1, "button", 2); link(2, "avatar", 3); link(3, "header", 2); return d; } } };
  /* ---------- HTML for a part (shared by the canvas, play mode and export) ---------- */
  function partHTML(it, accent) {
    const t = String(it.text ?? ""), parts = t.split("|"), e = esc, st = `left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px`;
    const inner = {
      header: `<div class="pp-header">${it.back ? `<span class="pp-back">‹</span>` : "<span></span>"}<b>${e(t)}</b><span></span></div>`,
      heading: `<div class="pp-heading">${e(t)}</div>`, text: `<div class="pp-text">${e(t)}</div>`,
      button: `<div class="pp-button ${it.variant || "primary"}">${e(t)}</div>`,
      input: `<div class="pp-input">${parts[0] ? `<label>${e(parts[0])}</label>` : ""}<div class="pp-field">${e(parts[1] ?? "")}</div></div>`,
      search: `<div class="pp-search"><span>⌕</span>${e(t)}</div>`,
      image: `<div class="pp-image"><svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/></svg><span>${e(t)}</span></div>`,
      card: `<div class="pp-card"><b>${e(parts[0])}</b><span>${e(parts[1] ?? "")}</span></div>`,
      list: `<div class="pp-list">${t.split("\n").filter(Boolean).map(r => `<div>${e(r)}<span>›</span></div>`).join("")}</div>`,
      chips: `<div class="pp-chips">${parts.map((c, i) => `<span class="${i === 0 ? "on" : ""}">${e(c)}</span>`).join("")}</div>`,
      toggle: `<div class="pp-toggle">${e(t)}<i></i></div>`, checkbox: `<div class="pp-check"><i></i>${e(t)}</div>`,
      avatar: `<div class="pp-avatar"><i>${e((parts[0] || "?").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase())}</i><span><b>${e(parts[0])}</b><small>${e(parts[1] ?? "")}</small></span></div>`,
      tabbar: `<div class="pp-tabbar">${parts.map((c, i) => `<span class="${i === 0 ? "on" : ""}"><i></i>${e(c)}</span>`).join("")}</div>`,
    }[it.kind] || "";
    return `<div class="pp-part" data-pid="${it.id}" style="${st};--acc:${accent}">${inner}</div>`;
  }
  const PART_CSS = `.pp-screen{position:relative;width:${SW}px;height:${SH}px;overflow:hidden;font-family:"Instrument Sans",system-ui,-apple-system,sans-serif;color:#1B1F24}
.pp-part{position:absolute;box-sizing:border-box}.pp-part>*{box-sizing:border-box;height:100%;width:100%}
.pp-header{display:grid;grid-template-columns:40px 1fr 40px;align-items:center;padding:0 8px;border-bottom:1px solid #E7EAEC;background:#fff;font-size:17px}.pp-header b{text-align:center;font-weight:700}.pp-back{font-size:30px;line-height:1;color:var(--acc)}
.pp-heading{font-size:26px;font-weight:700;line-height:1.15;letter-spacing:-.01em}.pp-text{font-size:15px;line-height:1.45;color:#5A646E}
.pp-button{display:flex;align-items:center;justify-content:center;border-radius:12px;font-weight:700;font-size:16px}.pp-button.primary{background:var(--acc);color:#fff}.pp-button.secondary{border:1.6px solid var(--acc);color:var(--acc);background:#fff}.pp-button.ghost{color:var(--acc)}
.pp-input label{display:block;font-size:13px;font-weight:600;color:#5A646E;margin-bottom:5px}.pp-field{height:calc(100% - 23px);min-height:40px;border:1.5px solid #D5DADF;border-radius:10px;padding:10px 12px;color:#99A2AA;font-size:15px;background:#fff}
.pp-search{display:flex;align-items:center;gap:8px;border-radius:999px;background:#F0F2F4;padding:0 16px;color:#8A939B;font-size:15px}.pp-search span{font-size:20px}
.pp-image{display:grid;place-content:center;justify-items:center;gap:4px;border-radius:14px;background:linear-gradient(135deg,#E7EEF0,#D6E2E5);color:#7E8C91;font-size:13px}
.pp-card{display:flex;flex-direction:column;justify-content:center;gap:4px;padding:14px 16px;border-radius:14px;background:#fff;border:1px solid #E3E7EA;box-shadow:0 6px 16px -12px rgba(0,0,0,.35)}.pp-card b{font-size:16px}.pp-card span{font-size:14px;color:#5A646E}
.pp-list{border-radius:14px;border:1px solid #E3E7EA;background:#fff;overflow:hidden;display:flex;flex-direction:column}.pp-list div{flex:1;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #EEF0F2;font-size:15px}.pp-list div:last-child{border-bottom:0}.pp-list span{color:#A9B1B8;font-size:20px}
.pp-chips{display:flex;gap:8px;align-items:center;overflow:hidden}.pp-chips span{padding:7px 14px;border-radius:999px;background:#F0F2F4;font-size:14px;font-weight:600;white-space:nowrap}.pp-chips span.on{background:var(--acc);color:#fff}
.pp-toggle{display:flex;align-items:center;justify-content:space-between;font-size:15px}.pp-toggle i{width:46px;height:28px;border-radius:999px;background:var(--acc);position:relative}.pp-toggle i::after{content:"";position:absolute;right:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff}
.pp-check{display:flex;align-items:center;gap:10px;font-size:15px}.pp-check i{width:22px;height:22px;border-radius:6px;border:1.8px solid var(--acc)}
.pp-avatar{display:flex;align-items:center;gap:12px}.pp-avatar i{flex-shrink:0;width:48px;height:48px;border-radius:50%;background:var(--acc);color:#fff;display:grid;place-items:center;font-style:normal;font-weight:700}.pp-avatar span{display:flex;flex-direction:column}.pp-avatar b{font-size:16px}.pp-avatar small{font-size:13px;color:#5A646E}
.pp-tabbar{display:flex;justify-content:space-around;align-items:center;border-top:1px solid #E7EAEC;background:#fff;font-size:11.5px;font-weight:600;color:#8A939B}.pp-tabbar span{display:flex;flex-direction:column;align-items:center;gap:4px}.pp-tabbar i{width:22px;height:22px;border-radius:7px;background:#D5DADF}.pp-tabbar .on{color:var(--acc)}.pp-tabbar .on i{background:var(--acc)}`;
  function screenHTML(D, s) { return `<div class="pp-screen" style="background:${s.bg}">${D.items.filter(i => i.screen === s.id).map(i => partHTML(i, D.accent)).join("")}</div>`; }
  function mount(ctx) {
    let D = ctx.doc.data, selItem = null, selScreen = D.screens[0]?.id, drag = null;
    D.view ||= { x: 60, y: 40, z: .8 };
    if (!document.getElementById("ppCss")) document.head.append(h("style", { id: "ppCss" }, PART_CSS));
    const svg = svgEl("svg", { class: "canvas dotgrid", role: "application", "aria-label": "Prototype screens" }), world = svgEl("g", {}, svg), flowG = svgEl("g", {}, svg); world.append(flowG); ctx.stage.append(svg);
    svgEl("defs", {}, svg).innerHTML = `<marker id="ppArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#E9A23B"/></marker>`;
    const vp = Viewport(svg, world, D.view, v => { zl.textContent = Math.round(v.z * 100) + "%"; svg.style.backgroundSize = `${22 * v.z}px ${22 * v.z}px`; svg.style.backgroundPosition = `${v.x}px ${v.y}px`; });
    const zb = h("div", { class: "zoombar" }), zl = h("span", {}, "80%"); [["zout", .8, "Zoom out"], [null], ["zin", 1.25, "Zoom in"], ["fit", 0, "Fit to screen"]].forEach(([ic, f, lbl]) => { if (!ic) return zb.append(zl); const b = h("button", { class: "icon", "aria-label": lbl, title: lbl, onclick: () => f ? vp.zoomBy(f) : fit() }); b.innerHTML = ICONS[ic]; zb.append(b); });
    ctx.stage.append(zb);
    const tools = h("div", { class: "row" }), playB = h("button", { class: "btn primary", onclick: () => play() }); playB.innerHTML = ICONS.play + "Play"; const addS = h("button", { class: "btn hide-s", onclick: () => addScreen() }); addS.innerHTML = ICONS.plus + "Screen"; tools.append(addS, playB); ctx.setTools(tools);
    const screen = id => D.screens.find(s => s.id === id), item = id => D.items.find(i => i.id === id);
    function addScreen(name = `Screen ${D.screens.length + 1}`, items = []) { const last = D.screens.reduce((m, s) => Math.max(m, s.x), -SW - 120), s = { id: uid(), name, x: last + SW + 120, y: 0, bg: "#FFFFFF" }; D.screens.push(s); items.forEach(it => D.items.push({ ...it, id: uid(), screen: s.id })); selScreen = s.id; selItem = null; ctx.changed(); render(); return s; }
    function render() {
      world.innerHTML = ""; const fl = svgEl("g", {}, world);
      for (const s of D.screens) {
        const g = svgEl("g", { class: "pp-scr" + (selScreen === s.id && !selItem ? " sel" : ""), "data-screen": s.id }, world);
        const lbl = svgEl("text", { x: s.x, y: s.y - 14, "font-size": 15, "font-weight": 700, fill: "#1E2A2F", class: "pp-title", "data-stitle": s.id }, g); lbl.textContent = (D.start === s.id ? "▶ " : "") + s.name;
        svgEl("rect", { x: s.x - 1, y: s.y - 1, width: SW + 2, height: SH + 2, rx: 30, fill: "#1E2A2F", opacity: selScreen === s.id ? 1 : .12 }, g);
        const fo = svgEl("foreignObject", { x: s.x, y: s.y, width: SW, height: SH, "clip-path": `inset(0 round 29px)` }, g); fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:${SW}px;height:${SH}px;border-radius:29px;overflow:hidden">${screenHTML(D, s)}</div>`;
        const ov = svgEl("g", {}, g);
        D.items.filter(i => i.screen === s.id).forEach(it => { const r = svgEl("rect", { x: s.x + it.x, y: s.y + it.y, width: it.w, height: it.h, fill: "transparent", class: "pp-hit" + (selItem === it.id ? " sel" : ""), "data-item": it.id }, ov); if (it.link) svgEl("circle", { cx: s.x + it.x + it.w - 8, cy: s.y + it.y + 8, r: 5, fill: "#E9A23B", class: "ui-only" }, ov); void r; if (selItem === it.id) { svgEl("rect", { x: s.x + it.x - 2, y: s.y + it.y - 2, width: it.w + 4, height: it.h + 4, class: "selbox ui-only" }, ov); svgEl("rect", { x: s.x + it.x + it.w - 6, y: s.y + it.y + it.h - 6, width: 12, height: 12, rx: 3, class: "handle ui-only", "data-handle": it.id }, ov); } });
      }
      if (D.flows) for (const it of D.items) { if (!it.link) continue; const s = screen(it.screen), t = screen(it.link); if (!s || !t || s === t) continue; const x1 = s.x + it.x + it.w, y1 = s.y + it.y + it.h / 2, back = t.x < s.x, x2 = back ? t.x + SW : t.x, y2 = t.y + 60, c = Math.max(60, Math.abs(x2 - x1) * .4); svgEl("path", { d: `M${x1},${y1} C${x1 + c},${y1} ${x2 + (back ? c : -c)},${y2} ${x2},${y2}`, fill: "none", stroke: "#E9A23B", "stroke-width": 2.5, "marker-end": "url(#ppArrow)", class: "ui-only flow" }, fl); }
      renderInsp();
    }
    function fit() { const b = bboxOf(D.screens.map(s => ({ x: s.x, y: s.y - 30, w: SW, h: SH + 30 }))); if (b) vp.fit(b, 50); }
    svg.addEventListener("pointerdown", e => {
      const p = vp.toWorld(e.clientX, e.clientY), hd = e.target.dataset?.handle, it = e.target.dataset?.item, st = e.target.closest?.("[data-stitle]"), sc = e.target.closest?.("[data-screen]");
      if (hd) { const i = item(hd); drag = { resize: i, w: i.w, h: i.h, x: p.x, y: p.y }; svg.setPointerCapture(e.pointerId); e.stopPropagation(); return; }
      if (it) { selItem = it; selScreen = item(it).screen; const i = item(it); drag = { move: i, x: p.x, y: p.y, ox: i.x, oy: i.y, moved: false }; svg.setPointerCapture(e.pointerId); render(); e.stopPropagation(); return; }
      if (st) { const s = screen(st.dataset.stitle); selScreen = s.id; selItem = null; drag = { screen: s, x: p.x, y: p.y, ox: s.x, oy: s.y, moved: false }; svg.setPointerCapture(e.pointerId); render(); e.stopPropagation(); return; }
      if (sc) { selScreen = sc.dataset.screen; selItem = null; render(); e.stopPropagation(); return; }
      if (selItem) { selItem = null; render(); }
    }, true);
    svg.addEventListener("pointermove", e => { if (!drag) return; const p = vp.toWorld(e.clientX, e.clientY), dx = p.x - drag.x, dy = p.y - drag.y; if (drag.resize) { drag.resize.w = Math.max(24, Math.min(SW - drag.resize.x, Math.round(drag.w + dx))); drag.resize.h = Math.max(20, Math.round(drag.h + dy)); render(); return; } if (Math.hypot(dx, dy) > 3) drag.moved = true; if (!drag.moved) return; if (drag.move) { const snap = v => Math.round(v / 4) * 4; drag.move.x = clamp(snap(drag.ox + dx), -drag.move.w + 20, SW - 20); drag.move.y = clamp(snap(drag.oy + dy), 0, SH - 20); } if (drag.screen) { drag.screen.x = Math.round(drag.ox + dx); drag.screen.y = Math.round(drag.oy + dy); } render(); });
    svg.addEventListener("pointerup", () => { if (drag && (drag.moved || drag.resize)) ctx.changed(); drag = null; });
    svg.addEventListener("dblclick", e => { const it = e.target.dataset?.item; if (it) { selItem = it; render(); ctx.insp.querySelector("#iTx")?.focus(); } });
    /* ---------- inspector ---------- */
    function renderInsp() {
      const I = ctx.insp, it = item(selItem), s = screen(selScreen);
      if (it) {
        const k = it.kind, multiLine = k === "list", hint = { input: "Label|Placeholder", card: "Title|Subtitle", avatar: "Name|Detail", chips: "Separate chips with |", tabbar: "Separate tabs with |", list: "One item per line" }[k];
        I.innerHTML = `<h2>${KINDS[k][0]}</h2><label class="field"><span>Text${hint ? ` (${hint})` : ""}</span>${multiLine ? `<textarea id="iTx" rows="5">${esc(it.text)}</textarea>` : `<input id="iTx" value="${esc(it.text)}">`}</label>
          ${k === "button" ? `<div class="chips">${["primary", "secondary", "ghost"].map(v => `<button class="chip" data-var="${v}" aria-pressed="${(it.variant || "primary") === v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join("")}</div>` : ""}
          ${k === "header" ? `<label class="check"><input type="checkbox" id="iBack" ${it.back ? "checked" : ""}> Show a back arrow</label>` : ""}
          <label class="field"><span>When tapped, go to</span><select id="iLink"><option value="">Nothing</option>${D.screens.filter(x => x.id !== it.screen).map(x => `<option value="${x.id}" ${it.link === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}<option value="__back" ${it.link === "__back" ? "selected" : ""}>Previous screen</option></select></label>
          <div class="row2"><label class="field"><span>X</span><input type="number" id="iX" value="${it.x}"></label><label class="field"><span>Y</span><input type="number" id="iY" value="${it.y}"></label></div><div class="row2"><label class="field"><span>Width</span><input type="number" id="iW" value="${it.w}"></label><label class="field"><span>Height</span><input type="number" id="iH" value="${it.h}"></label></div>
          <div class="chips"><button class="chip" id="iFull">Full width</button><button class="chip" id="iDup">Duplicate</button></div>
          <button class="btn danger block" id="iDel" style="margin-top:.8rem">${ICONS.trash}Delete</button>`;
        const tx = I.querySelector("#iTx"); tx.oninput = () => { it.text = tx.value; ctx.changed(); const pos = tx.selectionStart; render(); const t2 = ctx.insp.querySelector("#iTx"); t2.focus(); t2.setSelectionRange(pos, pos); };
        I.querySelectorAll("[data-var]").forEach(b => b.onclick = () => { it.variant = b.dataset.var; ctx.changed(); render(); }); I.querySelector("#iBack")?.addEventListener("change", e => { it.back = e.target.checked; ctx.changed(); render(); });
        I.querySelector("#iLink").onchange = e => { it.link = e.target.value || null; ctx.changed(); render(); if (it.link) toast("Linked. Press Play to try it."); };
        [["iX", "x"], ["iY", "y"], ["iW", "w"], ["iH", "h"]].forEach(([id, f]) => I.querySelector("#" + id).onchange = e => { it[f] = Math.round(+e.target.value || 0); ctx.changed(); render(); });
        I.querySelector("#iFull").onclick = () => { it.x = ["header", "tabbar"].includes(it.kind) ? 0 : 20; it.w = ["header", "tabbar"].includes(it.kind) ? SW : SW - 40; ctx.changed(); render(); };
        I.querySelector("#iDup").onclick = () => { const c = { ...it, id: uid(), y: it.y + it.h + 12 }; D.items.push(c); selItem = c.id; ctx.changed(); render(); };
        I.querySelector("#iDel").onclick = () => { D.items = D.items.filter(x => x !== it); selItem = null; ctx.changed(); render(); };
        return;
      }
      I.innerHTML = `<h2>Prototype</h2><div class="gen"><label class="field"><span>Describe a screen</span><textarea id="gDesc" rows="3" placeholder="For example: Sign-in screen with email, password and a sign in button"></textarea></label><div class="row"><button class="btn primary" id="gNew">Make a new screen</button>${s ? `<button class="btn" id="gRep">Replace “${esc(s.name)}”</button>` : ""}</div><p class="note">List several screens separated by semicolons, such as “welcome; sign in; dashboard”, and they’re linked in order.</p></div>
        ${s ? `<h3>Screen</h3><label class="field"><span>Name</span><input id="sN" value="${esc(s.name)}"></label><div class="row2"><label class="field"><span>Background</span><input type="color" id="sBg" value="${s.bg}"></label><label class="field"><span>&nbsp;</span><button class="btn" id="sStart" ${D.start === s.id ? "disabled" : ""}>${D.start === s.id ? "Starting screen" : "Start here"}</button></label></div>
        <h3>Add to this screen</h3><div class="parts">${Object.entries(KINDS).map(([k, [n]]) => `<button class="chip" data-add="${k}">${n}</button>`).join("")}</div>
        <div class="row" style="margin-top:.8rem"><button class="btn" id="sDup">Duplicate screen</button><button class="btn danger" id="sDel" ${D.screens.length < 2 ? "disabled" : ""}>Delete screen</button></div>` : ""}
        <h3>Prototype</h3><label class="field"><span>Brand colour</span><input type="color" id="pAcc" value="${D.accent}"></label><label class="check"><input type="checkbox" id="pFlow" ${D.flows ? "checked" : ""}> Show flow arrows</label>`;
      I.querySelector("#gNew").onclick = () => makeFromText(false); I.querySelector("#gRep")?.addEventListener("click", () => makeFromText(true));
      I.querySelector("#sN")?.addEventListener("change", e => { s.name = e.target.value.trim() || s.name; ctx.changed(); render(); }); I.querySelector("#sBg")?.addEventListener("input", e => { s.bg = e.target.value; ctx.changed(); render(); });
      I.querySelector("#sStart")?.addEventListener("click", () => { D.start = s.id; ctx.changed(); render(); });
      I.querySelectorAll("[data-add]").forEach(b => b.onclick = () => { const k = b.dataset.add, existing = D.items.filter(i => i.screen === s.id && i.kind !== "tabbar"), y = existing.reduce((m, i) => Math.max(m, i.y + i.h), 32) + 14, full = ["header", "tabbar"].includes(k), it = { id: uid(), screen: s.id, kind: k, text: DEFTXT[k], x: full ? 0 : 20, y: k === "tabbar" ? SH - 84 : k === "header" ? 44 : Math.min(y, SH - 120), w: full ? SW : SW - 40, h: KINDS[k][1], variant: "primary", link: null }; D.items.push(it); selItem = it.id; ctx.changed(); render(); });
      I.querySelector("#sDup")?.addEventListener("click", () => { const items = D.items.filter(i => i.screen === s.id).map(i => ({ ...i })); addScreen(s.name + " copy", items); });
      I.querySelector("#sDel")?.addEventListener("click", async () => { if (!(await confirmIt("Delete this screen?", `“${s.name}” and its parts will be deleted. You can undo with Ctrl+Z.`))) return; D.items = D.items.filter(i => i.screen !== s.id); D.items.forEach(i => { if (i.link === s.id) i.link = null; }); D.screens = D.screens.filter(x => x !== s); if (D.start === s.id) D.start = D.screens[0].id; selScreen = D.screens[0].id; ctx.changed(); render(); });
      I.querySelector("#pAcc").oninput = e => { D.accent = e.target.value; ctx.changed(); render(); }; I.querySelector("#pFlow").onchange = e => { D.flows = e.target.checked; ctx.changed(); render(); };
    }
    function makeFromText(replace) {
      const raw = ctx.insp.querySelector("#gDesc").value.trim(); if (!raw) return toast("Describe the screen first, for example: profile with a photo and settings.");
      const descs = raw.split(/;|\n/).map(x => x.trim()).filter(Boolean); let made = [];
      // a brand-new prototype's empty starting screen is reused, so Play opens on real content
      const onlyEmpty = D.screens.length === 1 && !D.items.some(x => x.screen === D.screens[0].id);
      if (onlyEmpty) { replace = true; selScreen = D.screens[0].id; }
      descs.forEach((dsc, i) => { const g = generate(dsc); if (replace && i === 0) { const s = screen(selScreen); D.items = D.items.filter(x => x.screen !== s.id); g.items.forEach(it => D.items.push({ ...it, screen: s.id })); s.name = g.title; made.push(s); } else made.push(addScreen(g.title, g.items)); });
      for (let i = 0; i < made.length - 1; i++) { const b = D.items.find(x => x.screen === made[i].id && x.kind === "button") || D.items.find(x => x.screen === made[i].id && ["card", "list", "avatar"].includes(x.kind)); if (b) b.link = made[i + 1].id; }
      if (onlyEmpty) D.start = made[0].id;
      ctx.changed(); render(); setTimeout(fit, 0); toast(made.length > 1 ? `Made ${made.length} linked screens. Press Play to try them.` : `Made “${made[0].name}”. Edit any part, or press Play.`);
    }
    /* ---------- play ---------- */
    function play() {
      const stack = [D.start || D.screens[0].id], d = h("dialog", { class: "play", "aria-label": "Play prototype" });
      d.innerHTML = `<header><b id="plT"></b><span class="row"><button class="btn" id="plBack">Back</button><button class="btn" id="plRe">Restart</button><button class="btn" id="plX">Close</button></span></header><div class="pl-stage"><div class="device"><div id="plScr"></div></div></div><p class="note" style="text-align:center">Tap the highlighted areas. Tapping anywhere else shows what you can tap.</p>`;
      document.body.append(d); d.showModal();
      const show = () => { const s = screen(stack[stack.length - 1]); d.querySelector("#plT").textContent = s.name; const box = d.querySelector("#plScr"); box.innerHTML = screenHTML(D, s); const k = Math.min(1, (innerHeight - 170) / SH, (innerWidth - 40) / SW); box.parentElement.style.transform = `scale(${k})`; box.parentElement.parentElement.style.height = SH * k + 20 + "px"; box.querySelectorAll("[data-pid]").forEach(el => { const it = item(el.dataset.pid); if (it?.link) el.classList.add("live"); }); d.querySelector("#plBack").disabled = stack.length < 2; };
      d.querySelector("#plScr").addEventListener("click", e => { const el = e.target.closest("[data-pid]"), it = el && item(el.dataset.pid); if (it?.link) { if (it.link === "__back") { if (stack.length > 1) stack.pop(); } else stack.push(it.link); show(); } else { d.querySelectorAll(".live").forEach(x => { x.classList.remove("flash"); void x.offsetWidth; x.classList.add("flash"); }); } });
      d.querySelector("#plBack").onclick = () => { if (stack.length > 1) stack.pop(); show(); }; d.querySelector("#plRe").onclick = () => { stack.length = 1; show(); }; d.querySelector("#plX").onclick = () => d.close(); d.addEventListener("close", () => d.remove()); show();
    }
    function exportHTML() {
      const data = JSON.stringify({ screens: D.screens.map(s => ({ id: s.id, name: s.name, html: screenHTML(D, s) })), links: Object.fromEntries(D.items.filter(i => i.link).map(i => [i.id, i.link])), start: D.start || D.screens[0].id }).replace(/</g, "\\u003c");
      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(ctx.doc.title)}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#E9EDEC;font-family:system-ui,sans-serif}.wrap{display:grid;gap:10px;justify-items:center;padding:16px}.top{display:flex;gap:8px;align-items:center}.top b{min-width:140px;text-align:center}button{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid #C9D2CF;background:#fff;cursor:pointer}.device{width:${SW}px;height:${SH}px;border-radius:34px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(0,0,0,.5);border:8px solid #1E2A2F;transform-origin:top center}.live{cursor:pointer}.live.flash{animation:fl .7s}@keyframes fl{0%,100%{box-shadow:none}50%{box-shadow:0 0 0 3px rgba(233,162,59,.9) inset;background:rgba(233,162,59,.18)}}${PART_CSS}</style></head><body><div class="wrap"><div class="top"><button id="b">Back</button><b id="t"></b><button id="r">Restart</button></div><div class="device"><div id="s"></div></div></div><script>const P=${data};const st=[P.start];const S=id=>P.screens.find(s=>s.id===id);function show(){const s=S(st[st.length-1]);document.getElementById("t").textContent=s.name;const box=document.getElementById("s");box.innerHTML=s.html;box.querySelectorAll("[data-pid]").forEach(el=>{if(P.links[el.dataset.pid])el.classList.add("live")});const k=Math.min(1,(innerHeight-90)/${SH},(innerWidth-30)/${SW});box.parentElement.style.transform="scale("+k+")";box.parentElement.parentElement.style.height=(${SH}*k+60)+"px"}document.getElementById("s").onclick=e=>{const el=e.target.closest("[data-pid]"),to=el&&P.links[el.dataset.pid];if(to){if(to==="__back"){if(st.length>1)st.pop()}else st.push(to);show()}else document.querySelectorAll(".live").forEach(x=>{x.classList.remove("flash");void x.offsetWidth;x.classList.add("flash")})};document.getElementById("b").onclick=()=>{if(st.length>1)st.pop();show()};document.getElementById("r").onclick=()=>{st.length=1;show()};addEventListener("resize",show);show();<\/script></body></html>`;
      download(new Blob([html], { type: "text/html" }), `${fileSafe(ctx.doc.title)}-clickable.html`); toast("Clickable prototype saved. Open it in any browser, or share it.");
    }
    const keys = e => { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.querySelector("dialog[open]")) return; const it = item(selItem); if (!it) return; if (e.key === "Delete" || e.key === "Backspace") { D.items = D.items.filter(x => x !== it); selItem = null; ctx.changed(); render(); } else if (e.key.startsWith("Arrow")) { e.preventDefault(); const s = e.shiftKey ? 10 : 1; if (e.key === "ArrowLeft") it.x -= s; if (e.key === "ArrowRight") it.x += s; if (e.key === "ArrowUp") it.y -= s; if (e.key === "ArrowDown") it.y += s; ctx.changed(); render(); } else if (e.key === "Escape") { selItem = null; render(); } };
    addEventListener("keydown", keys); render(); setTimeout(fit, 0);
    return {
      reload(d) { D = d; if (!screen(selScreen)) selScreen = D.screens[0]?.id; if (selItem && !item(selItem)) selItem = null; render(); },
      destroy() { removeEventListener("keydown", keys); },
      canvas: () => ({ svg, world }),
      exports: () => [{ label: "Clickable prototype (HTML)", icon: "download", run: exportHTML }, { label: "Image of the screens (PNG)", icon: "download", run: () => { selItem = null; render(); exportPNG(svg, world, ctx.doc.title).catch(() => toast("Images of prototypes need Chrome or Edge. The HTML export works everywhere.")); } }],
    };
  }
  Modules.prototype = { blank, templates, mount, generate };
})();
