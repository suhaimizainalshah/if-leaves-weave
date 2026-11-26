/* Wall: a wall of posts that other people can add to, without accounts or a server.
   - Collect posts: share a contribute link. People write a post on it and get a short post code, which they send you by email
     or chat. You paste the codes here; with approval switched on, each one waits until you approve it.
   - Share: a link that carries the wall itself, so anyone can see it and save their own copy.
   Nothing is stored online: the wall lives in this browser, and the links and codes carry the data. */
"use strict";
(() => {
  const C = WallCode, LAYOUTS = [["wall", "Wall"], ["columns", "Columns"], ["stream", "Stream"], ["grid", "Grid"]];
  const sec = (name) => ({ id: uid(), name });
  function blank(sections = ["Ideas"], layout = "wall", description = "") {
    return { key: uid() + uid(), layout, description, sections: sections.map(sec), posts: [], reaction: "like", approve: true, allowImages: false };
  }
  const tpl = (title, sections, layout, description, posts = []) => ({ title, data: () => { const d = blank(sections, layout, description);
    posts.forEach(([si, t, b]) => d.posts.push({ id: uid(), section: d.sections[si].id, title: t, body: b, link: "", image: "", color: "", author: "", created: Date.now(), status: "approved", pinned: false, hidden: false, reactions: 0, comments: [] })); return d; } });
  const templates = {
    brainstorm: tpl("Brainstorm", ["Ideas"], "wall", "Add one idea per post. Short is fine."),
    exit: tpl("Exit ticket", ["What I learned", "What I'm unsure about", "A question I have"], "columns", "Before you go: one post in each column."),
    kwl: tpl("KWL chart", ["What I know", "What I want to know", "What I learned"], "columns", "Fill in the first two columns now, and the last one at the end."),
    icebreaker: tpl("Icebreaker", ["Introductions"], "stream", "Say hello: your first name, and one thing you are looking forward to."),
    resources: tpl("Resource wall", ["Reading", "Videos", "Tools"], "grid", "Useful links, with a line on why each one helps."),
  };
  const fmtAgo = t => { const s = Math.round((Date.now() - t) / 1000); if (s < 60) return "just now"; if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`; return new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" }); };
  const domain = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

  function mount(ctx) {
    let D = ctx.doc.data, openComments = new Set();
    const fix = () => { D.key ||= uid() + uid(); D.layout ||= "wall"; D.sections = Array.isArray(D.sections) && D.sections.length ? D.sections : [sec("Ideas")];
      D.posts = Array.isArray(D.posts) ? D.posts : []; D.reaction ||= "like"; if (D.approve == null) D.approve = true; D.description ??= "";
      D.posts.forEach(p => { p.status ||= "approved"; p.comments ||= []; p.reactions ||= 0; if (!D.sections.some(s => s.id === p.section)) p.section = D.sections[0].id; }); };
    fix();
    const wrap = h("div", { class: "wall-wrap" }), bar = h("div", { class: "wall-bar" }), area = h("div", { class: "wall-area" }); wrap.append(bar, area); ctx.stage.append(wrap);
    const save = () => { ctx.changed(); render(); };
    const section = id => D.sections.find(s => s.id === id) || D.sections[0];
    const pending = () => D.posts.filter(p => p.status === "pending");
    const shown = () => D.posts.filter(p => p.status === "approved");
    const ordered = list => [...list].sort((a, b) => (b.pinned - a.pinned) || (D.layout === "stream" ? b.created - a.created : 0));

    /* ---------- the bar ---------- */
    function renderBar() {
      bar.innerHTML = "";
      const seg = h("div", { class: "seg", role: "group", "aria-label": "Layout" });
      LAYOUTS.forEach(([v, n]) => seg.append(h("button", { "aria-pressed": String(D.layout === v), onclick: () => { D.layout = v; save(); } }, n)));
      const n = pending().length;
      bar.append(seg, h("span", { class: "spacer" }),
        h("button", { class: "btn", onclick: collect, title: "A link where others write a post and get a code to send you" }, "Collect posts"),
        h("button", { class: "btn" + (n ? " attn" : ""), onclick: addCodes }, n ? `Add from codes · ${n} waiting` : "Add from codes"),
        h("button", { class: "btn", onclick: share }, "Share"), h("button", { class: "btn", onclick: present, disabled: !shown().length }, "Present"),
        h("button", { class: "btn primary", onclick: () => edit(null, D.sections[0].id), html: ICONS.plus + "Post" }));
    }
    /* ---------- one post ---------- */
    function postEl(p, { waiting = false } = {}) {
      const [sym, , many] = C.REACTIONS[D.reaction] || C.REACTIONS.like;
      const el = h("article", { class: "wpost" + (p.pinned ? " pinned" : "") + (p.hidden ? " hidden-post" : ""), style: p.color ? `--pc:${p.color}` : null, "data-id": p.id,
        draggable: !waiting && D.layout === "columns" ? "true" : null, "aria-label": p.title || (p.body || "").slice(0, 60) || "Post" });
      const top = h("div", { class: "wpost-top" });
      if (p.pinned) top.append(h("span", { class: "chip", title: "Pinned" }, "Pinned"));
      if (p.hidden) top.append(h("span", { class: "chip" }, "Hidden from shared links"));
      if (D.layout !== "columns" && D.sections.length > 1) top.append(h("span", { class: "chip soft" }, section(p.section).name));
      if (!waiting) top.append(h("button", { class: "icon wmenu", "aria-label": "Post options", onclick: e => menu(e.currentTarget, p) }, "⋯"));
      el.append(top);
      if (p.title) el.append(h("h3", {}, p.title));
      if (p.image) el.append(h("img", { src: p.image, alt: p.title ? `Picture: ${p.title}` : "Picture added to this post", loading: "lazy" }));
      if (p.body) el.append(h("p", { class: "wbody" }, p.body));
      if (p.link) el.append(h("a", { class: "wlink", href: p.link, target: "_blank", rel: "noopener noreferrer nofollow" }, "↗ " + (domain(p.link) || "Link")));
      const foot = h("div", { class: "wpost-foot" }, h("span", { class: "who" }, (p.author || "Anonymous") + " · " + fmtAgo(p.created)));
      if (waiting) {
        foot.append(h("button", { class: "btn sm primary", onclick: () => { p.status = "approved"; save(); ctx.toast("Approved"); } }, "Approve"),
                    h("button", { class: "btn sm", onclick: () => { D.posts = D.posts.filter(x => x !== p); save(); ctx.toast("Post removed"); } }, "Remove"));
      } else {
        if (D.reaction !== "none") foot.append(h("button", { class: "react", "aria-label": `${C.REACTIONS[D.reaction][1]}: ${p.reactions} ${many}`, onclick: () => { p.reactions++; save(); } }, `${sym} ${p.reactions || ""}`.trim()));
        foot.append(h("button", { class: "react", "aria-expanded": String(openComments.has(p.id)), onclick: () => { openComments.has(p.id) ? openComments.delete(p.id) : openComments.add(p.id); render(); } },
          `💬 ${p.comments.length || ""}`.trim()));
      }
      el.append(foot);
      if (openComments.has(p.id) && !waiting) {
        const box = h("div", { class: "wcomments" });
        p.comments.forEach((c, i) => box.append(h("p", {}, h("b", {}, (c.author || "Anonymous") + ": "), c.text,
          h("button", { class: "icon xs", "aria-label": "Delete comment", onclick: () => { p.comments.splice(i, 1); save(); } }, "✕"))));
        const inp = h("input", { type: "text", maxlength: "600", placeholder: "Add a comment", "aria-label": "Add a comment" });
        const add = () => { const t = inp.value.trim(); if (!t) return; p.comments.push({ author: "", text: t, created: Date.now() }); save(); };
        inp.addEventListener("keydown", e => { if (e.key === "Enter") add(); });
        box.append(h("div", { class: "row" }, inp, h("button", { class: "btn sm", onclick: add }, "Add")));
        el.append(box);
      }
      if (el.draggable) el.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", p.id); el.classList.add("dragging"); });
      el.addEventListener("dragend", () => el.classList.remove("dragging"));
      return el;
    }
    function menu(anchor, p) {
      const items = [{ label: "Edit", icon: "edit", run: () => edit(p) }, { label: p.pinned ? "Unpin" : "Pin to the top", icon: "plus", run: () => { p.pinned = !p.pinned; save(); } },
        { label: p.hidden ? "Show in shared links" : "Hide from shared links", icon: "copy", run: () => { p.hidden = !p.hidden; save(); } }];
      D.sections.filter(s => s.id !== p.section).forEach(s => items.push({ label: `Move to “${s.name}”`, icon: "redo", run: () => { p.section = s.id; save(); } }));
      items.push({ label: "Delete", icon: "trash", run: () => { const i = D.posts.indexOf(p); D.posts.splice(i, 1); save(); ctx.toast("Post deleted"); } });
      popMenu(anchor, items);
    }
    /* ---------- layouts ---------- */
    function renderArea() {
      area.innerHTML = ""; area.className = "wall-area lay-" + D.layout;
      area.append(h("div", { class: "wall-head" }, h("h2", {}, ctx.doc.title), D.description ? h("p", {}, D.description) : null));
      const waiting = pending();
      if (waiting.length) {
        const tray = h("section", { class: "wtray", "aria-label": "Waiting for your approval" }, h("div", { class: "row" }, h("b", {}, `Waiting for your approval (${waiting.length})`),
          h("button", { class: "btn sm", onclick: () => { waiting.forEach(p => p.status = "approved"); save(); ctx.toast(`${waiting.length} approved`); } }, "Approve all")));
        const g = h("div", { class: "wgrid" }); waiting.forEach(p => g.append(postEl(p, { waiting: true }))); tray.append(g); area.append(tray);
      }
      const posts = ordered(shown());
      if (!posts.length && !waiting.length) {
        area.append(h("div", { class: "wempty" }, h("p", {}, "No posts yet."), h("p", { class: "muted" }, "Add one yourself, or choose Collect posts to invite others: they write a post and send you a code.")));
        if (D.layout !== "columns") return;
      }
      if (D.layout === "columns") {
        const row = h("div", { class: "wcols" });
        D.sections.forEach(s => {
          const col = h("section", { class: "wcol", "aria-label": s.name }, h("header", {}, h("b", {}, s.name), h("span", { class: "muted" }, String(posts.filter(p => p.section === s.id).length))));
          posts.filter(p => p.section === s.id).forEach(p => col.append(postEl(p)));
          col.append(h("button", { class: "btn ghost addhere", onclick: () => edit(null, s.id), html: ICONS.plus + "Post" }));
          col.addEventListener("dragover", e => { e.preventDefault(); col.classList.add("over"); });
          col.addEventListener("dragleave", () => col.classList.remove("over"));
          col.addEventListener("drop", e => { e.preventDefault(); col.classList.remove("over"); const p = D.posts.find(x => x.id === e.dataTransfer.getData("text/plain"));
            if (!p) return; p.section = s.id; const after = [...col.querySelectorAll(".wpost")].find(n => e.clientY < n.getBoundingClientRect().top + n.offsetHeight / 2);
            D.posts.splice(D.posts.indexOf(p), 1); const at = after ? D.posts.findIndex(x => x.id === after.dataset.id) : -1; at < 0 ? D.posts.push(p) : D.posts.splice(at, 0, p); save(); });
          row.append(col);
        });
        area.append(row);
      } else {
        const g = h("div", { class: D.layout === "wall" ? "wmasonry" : D.layout === "grid" ? "wgrid" : "wstream" }); posts.forEach(p => g.append(postEl(p))); area.append(g);
      }
    }
    /* ---------- settings ---------- */
    function renderInsp() {
      const I = ctx.insp; I.innerHTML = "";
      const desc = h("textarea", { rows: "3", maxlength: "1000", placeholder: "What should people post about?" }, D.description);
      desc.onchange = () => { D.description = desc.value.trim(); save(); };
      const react = h("select", {}, ...[["like", "♥ Like"], ["star", "★ Star"], ["vote", "▲ Vote"], ["none", "No reactions"]].map(([v, n]) => h("option", { value: v, selected: D.reaction === v ? "" : null }, n)));
      react.onchange = () => { D.reaction = react.value; save(); };
      const tick = (label, key, note) => { const c = h("input", { type: "checkbox", checked: D[key] ? "" : null }); c.onchange = () => { D[key] = c.checked; save(); };
        return h("label", { class: "check" }, c, h("span", {}, label, note ? h("small", { class: "muted" }, " " + note) : null)); };
      const secs = h("div", { class: "wsecs" });
      D.sections.forEach((s, i) => {
        const inp = h("input", { type: "text", value: s.name, maxlength: "80", "aria-label": `Section ${i + 1} name` }); inp.onchange = () => { s.name = inp.value.trim() || s.name; save(); };
        const up = h("button", { class: "icon xs", "aria-label": `Move ${s.name} up`, disabled: i === 0 ? "" : null, onclick: () => { D.sections.splice(i - 1, 0, D.sections.splice(i, 1)[0]); save(); } }, "↑");
        const del = h("button", { class: "icon xs", "aria-label": `Delete section ${s.name}`, disabled: D.sections.length < 2 ? "" : null, onclick: () => {
          const to = D.sections.find(x => x !== s); D.posts.forEach(p => { if (p.section === s.id) p.section = to.id; }); D.sections = D.sections.filter(x => x !== s); save(); ctx.toast(`Its posts moved to “${to.name}”`); } }, "✕");
        secs.append(h("div", { class: "row" }, inp, up, del));
      });
      I.append(h("h3", {}, "Wall"), h("label", { class: "field" }, h("span", {}, "Prompt for contributors"), desc), h("label", { class: "field" }, h("span", {}, "Reactions"), react),
        tick("Approve posts from codes before they appear", "approve"), tick("Contributors may add a picture", "allowImages", "(makes codes much longer)"),
        h("h3", {}, "Sections"), secs, h("button", { class: "btn sm", onclick: () => { D.sections.push(sec(`Section ${D.sections.length + 1}`)); save(); }, html: ICONS.plus + "Section" }),
        h("p", { class: "muted small" }, `${shown().length} posts shown, ${pending().length} waiting.`));
    }
    function render() { renderBar(); renderArea(); renderInsp(); }

    /* ---------- add or edit a post ---------- */
    async function edit(p, sectionId) {
      const isNew = !p; p = p || { id: uid(), section: sectionId || D.sections[0].id, title: "", body: "", link: "", image: "", color: "", author: "", created: Date.now(), status: "approved", pinned: false, hidden: false, reactions: 0, comments: [] };
      let image = p.image, color = p.color;
      const f = h("div", { class: "wform" });
      const sel = h("select", {}, ...D.sections.map(s => h("option", { value: s.id, selected: s.id === p.section ? "" : null }, s.name)));
      const title = h("input", { type: "text", maxlength: "120", value: p.title }), body = h("textarea", { rows: "5", maxlength: "2000" }, p.body);
      const link = h("input", { type: "url", maxlength: "500", value: p.link, placeholder: "https://" }), author = h("input", { type: "text", maxlength: "60", value: p.author, placeholder: "Leave empty to post anonymously" });
      const pic = h("input", { type: "file", accept: "image/*" }), prev = h("div", { class: "wprev" });
      const showPrev = () => { prev.innerHTML = ""; if (image) prev.append(h("img", { src: image, alt: "Picture preview" }), h("button", { class: "btn sm", type: "button", onclick: () => { image = ""; showPrev(); } }, "Remove picture")); };
      pic.onchange = async () => { try { image = await C.shrinkImage(pic.files[0], 1200, 0.82); showPrev(); } catch (e) { ctx.toast(e.message || "That picture could not be used."); } };
      const sw = h("div", { class: "swatches", role: "radiogroup", "aria-label": "Colour" });
      const paint = () => sw.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b.dataset.c === color)));
      ["", ...C.COLOURS].forEach(c => sw.append(h("button", { type: "button", role: "radio", "data-c": c, style: c ? `background:${c}` : null, "aria-label": c ? `Colour ${c}` : "No colour", onclick: () => { color = c; paint(); } }, c ? "" : "—")));
      paint(); showPrev();
      const field = (label, el) => h("label", { class: "field" }, h("span", {}, label), el);
      f.append(D.sections.length > 1 ? field("Section", sel) : "", field("Title", title), field("Message", body), field("Link", link), field("Picture", pic), prev, field("Name", author), h("div", { class: "field" }, h("span", {}, "Colour"), sw));
      const r = await dialog({ title: isNew ? "New post" : "Edit post", body: f, wide: true, actions: [{ label: "Cancel", value: "" }, { label: isNew ? "Add post" : "Save", value: "ok", primary: true }] });
      if (r.value !== "ok") return;
      if (!title.value.trim() && !body.value.trim() && !image && !link.value.trim()) return ctx.toast("A post needs a title, a message, a link or a picture.");
      if (link.value.trim() && !C.url(link.value)) return ctx.toast("The link must start with http:// or https://");
      Object.assign(p, { section: sel.value || p.section, title: title.value.trim(), body: body.value.trim(), link: C.url(link.value), image, color, author: author.value.trim() });
      if (isNew) D.posts.push(p); save();
    }

    /* ---------- collect posts: a contribute link, then codes back ---------- */
    const invite = () => ({ k: D.key, t: ctx.doc.title, d: D.description, s: D.sections.map(s => ({ id: s.id, n: s.name })), i: !!D.allowImages });
    async function collect() {
      const link = new URL("wall-link.html", location.href).href + "#c=" + await C.pack(invite());
      const inp = h("input", { type: "text", readonly: "", value: link, "aria-label": "Contribute link" });
      const body = h("div", {}, h("p", {}, "1. Share this link. 2. People open it, write a post, and get a short post code. 3. They send you the code by email or chat. 4. You choose Add from codes and paste it."),
        h("div", { class: "row" }, inp, h("button", { class: "btn primary", onclick: async () => { await navigator.clipboard.writeText(link); ctx.toast("Link copied"); } }, "Copy link"),
          h("a", { class: "btn", href: link, target: "_blank", rel: "noopener" }, "Try it")),
        h("p", { class: "muted small" }, "The link holds only this wall's title, prompt and section names. Nothing is stored online, and nobody can see the wall through this link."),
        h("p", { class: "muted small" }, D.approve ? "Posts from codes wait for your approval before they appear." : "Posts from codes appear straight away. You can switch approval on in the settings."),
        h("button", { class: "btn sm", onclick: async () => { const ok = await dialog({ title: "Stop accepting the old link?", body: "<p>Codes written on the old link will be refused. You will get a new link to share.</p>", actions: [{ label: "Cancel", value: "" }, { label: "Make a new link", value: "ok", danger: true }] });
          if (ok.value === "ok") { D.key = uid() + uid(); save(); document.querySelector("dialog.dlg")?.close(""); collect(); } } }, "Stop accepting the old link"));
      inp.addEventListener("focus", () => inp.select());
      await dialog({ title: "Collect posts", body, wide: true });
    }
    async function addCodes() {
      const ta = h("textarea", { rows: "6", placeholder: "Paste one code or many, or a whole email. Every code in it is found." }), files = h("input", { type: "file", multiple: "", accept: ".txt,.ilwpost,text/plain" });
      const other = h("input", { type: "checkbox" });
      const r = await dialog({ title: "Add posts from codes", wide: true, body: h("div", {}, h("label", { class: "field" }, h("span", {}, "Post codes"), ta), h("label", { class: "field" }, h("span", {}, "Or open post files"), files),
        h("label", { class: "check" }, other, h("span", {}, "Also accept codes written for a different wall"))), actions: [{ label: "Cancel", value: "" }, { label: "Add posts", value: "ok", primary: true }] });
      if (r.value !== "ok") return;
      let text = ta.value; for (const f of files.files || []) text += "\n" + await f.text();
      const { posts, problems } = await C.readCodes(text);
      let added = 0, dup = 0, elsewhere = 0;
      for (const msg of posts) {
        if (!msg || msg.k !== D.key) { elsewhere++; if (!other.checked) continue; }
        const p = C.cleanPost(msg.p); if (D.posts.some(x => x.id === p.id)) { dup++; continue; }
        if (!D.sections.some(s => s.id === p.section)) p.section = D.sections[0].id;
        if (!D.allowImages) p.image = "";
        D.posts.push({ ...p, status: D.approve ? "pending" : "approved", pinned: false, hidden: false, reactions: 0, comments: [], from: "code" }); added++;
      }
      save();
      const parts = [];
      parts.push(added ? `Added ${added} post${added === 1 ? "" : "s"}${D.approve ? ", waiting for your approval" : ""}.` : "No new posts were added.");
      if (dup) parts.push(`${dup} already here.`);
      if (elsewhere && !other.checked) parts.push(`${elsewhere} written for a different wall (not added).`);
      if (problems.length) parts.push(`${problems.length} code${problems.length === 1 ? " was" : "s were"} damaged when copied: ask for ${problems.length === 1 ? "it" : "them"} again.`);
      if (!posts.length && !problems.length) parts.push("No post codes were found in what you pasted.");
      ctx.toast(parts.join(" "), 7000);
    }
    /* ---------- share: the wall itself in a link ---------- */
    async function share() {
      const vis = ordered(shown()).filter(p => !p.hidden);
      const base = { v: 1, t: ctx.doc.title, d: D.description, l: D.layout, r: D.reaction, s: D.sections.map(s => ({ id: s.id, n: s.name })) };
      const posts = keepPics => vis.map(p => ({ id: p.id, section: p.section, title: p.title, body: p.body, link: p.link, image: keepPics ? p.image : "", color: p.color, author: p.author, created: p.created, pinned: p.pinned, r: p.reactions, c: p.comments.map(c => ({ a: c.author, t: c.text })) }));
      const viewers = h("input", { type: "checkbox" });
      const make = async () => { let packed = await C.pack({ ...base, p: posts(true), c: viewers.checked ? invite() : undefined }), pics = true;
        if (packed.length > 60000) { packed = await C.pack({ ...base, p: posts(false), c: viewers.checked ? invite() : undefined }); pics = false; }
        return { link: new URL("wall-link.html", location.href).href + "#v=" + packed, pics }; };
      let cur = await make();
      const inp = h("input", { type: "text", readonly: "", value: cur.link, "aria-label": "Share link" }), note = h("p", { class: "muted small" });
      const describe = () => { note.textContent = `${vis.length} post${vis.length === 1 ? "" : "s"} in the link${cur.pics ? "" : ", without pictures (they made the link too long)"}. ` +
        (cur.link.length > 8000 ? "This is a long link: some chat apps cut long links, so email may be safer. " : "") + "Hidden posts and posts waiting for approval are left out."; };
      viewers.onchange = async () => { cur = await make(); inp.value = cur.link; describe(); }; describe();
      inp.addEventListener("focus", () => inp.select());
      await dialog({ title: "Share this wall", wide: true, body: h("div", {}, h("p", {}, "Anyone with this link can see the wall as it is now, and save their own copy. Later changes are not sent to them: share a new link after changes."),
        h("div", { class: "row" }, inp, h("button", { class: "btn primary", onclick: async () => { await navigator.clipboard.writeText(cur.link); ctx.toast("Link copied"); } }, "Copy link")),
        h("label", { class: "check" }, viewers, h("span", {}, "Viewers may also add posts (they get codes to send you)")), note) });
    }
    /* ---------- present: one post at a time ---------- */
    function present() {
      const list = ordered(shown()); if (!list.length) return; let i = 0;
      const ov = h("div", { class: "wpresent", role: "dialog", "aria-modal": "true", "aria-label": "Presenting posts", tabindex: "-1" });
      const draw = () => { ov.innerHTML = ""; const p = list[i];
        ov.append(h("div", { class: "wp-card", style: p.color ? `--pc:${p.color}` : null }, p.title ? h("h2", {}, p.title) : null, p.image ? h("img", { src: p.image, alt: p.title ? `Picture: ${p.title}` : "Picture" }) : null,
          p.body ? h("p", {}, p.body) : null, p.link ? h("p", { class: "muted" }, domain(p.link)) : null, h("p", { class: "muted" }, (p.author || "Anonymous") + (D.sections.length > 1 ? " · " + section(p.section).name : ""))),
          h("div", { class: "wp-nav" }, h("button", { class: "btn", onclick: () => go(-1), disabled: i === 0 ? "" : null }, "← Previous"), h("span", {}, `${i + 1} of ${list.length}`),
            h("button", { class: "btn", onclick: () => go(1), disabled: i === list.length - 1 ? "" : null }, "Next →"), h("button", { class: "btn", onclick: close }, "Close"))); };
      const go = d => { i = Math.max(0, Math.min(list.length - 1, i + d)); draw(); };
      const key = e => { if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); } else if (e.key === "ArrowLeft") go(-1); else if (e.key === "Escape") close(); };
      const close = () => { removeEventListener("keydown", key); ov.remove(); };
      addEventListener("keydown", key); document.body.append(ov); draw(); ov.focus();
    }
    render();
    return {
      reload(d) { D = d; fix(); render(); },
      destroy() {},
      exports: () => [
        { label: "Spreadsheet (CSV)", icon: "download", run: () => { const rows = [["Section", "Title", "Message", "Link", "Name", "Date", "Reactions", "Comments", "Status"],
          ...D.posts.map(p => [section(p.section).name, p.title, p.body, p.link, p.author || "Anonymous", new Date(p.created).toISOString().slice(0, 16).replace("T", " "), p.reactions, p.comments.map(c => c.text).join(" | "), p.status === "pending" ? "waiting" : p.hidden ? "hidden" : "shown"])];
          const cell = v => { const s = String(v ?? ""); const t = /^[=+\-@\t\r]/.test(s) ? "'" + s : s; return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
          download(new Blob(["\ufeff" + rows.map(r => r.map(cell).join(",")).join("\r\n")], { type: "text/csv" }), fileSafe(ctx.doc.title) + ".csv"); } },
        { label: "Print or save as PDF", icon: "download", run: () => { document.body.classList.add("print-wall"); setTimeout(() => { print(); document.body.classList.remove("print-wall"); }, 60); } },
      ],
    };
  }
  Modules.wall = { blank: () => blank(), templates, mount };
})();
