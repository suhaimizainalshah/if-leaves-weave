/* If Leaves Weave question bank: the reading rules. Pure functions, so they can be tested on their own.
   Input: lines of text in reading order, each { text, page, img? }. Output: question rows and answer keys.
   Rule-based (no AI): question numbers, parts, multiple-choice options, marks, answers and sections. */
(function (root) {
  const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];
  const RX = {
    section: /^\s*(?:section|part|bahagian|bahagian)\s+([A-Z]|[IVX]+|\d)\b[\s:.\-–]*(.*)$/i,
    answerHead: /^\s*(?:answers?|answer key|answer scheme|mark(?:ing)? scheme|suggested answers|solutions?|jawapan|skema(?: pemarkahan)?)\s*[:.]?\s*$/i,
    q: [ /^\s*(?:question|soalan)\s+(\d{1,3})\s*[.:)\-–]?\s*(.*)$/i, /^\s*Q\s?(\d{1,3})\s*[.:)\-–]?\s*(.*)$/, /^\s*(\d{1,3})\s*[.)]\s+(.*)$/, /^\s*(\d{1,3})\s+(?=[A-Z(“"])(.*)$/ ],
    part: /^\s*\(?([a-h])\)\s*(.*)$|^\s*([a-h])[.]\s+(.*)$/,
    roman: /^\s*\(?((?:x|ix|iv|v?i{1,3}|vi{0,3}))\)\s*(.*)$/,
    opt: /^\s*\(?([A-E])[.)]\s*(.+)$/,
    inlineOpts: /(?:^|\s)\(?([A-E])[.)]\s+/g,
    answer: /^\s*(?:ans(?:wer)?s?|jawapan)\s*[:.\-–]\s*(.*)$/i,
    marks: [ /[\[(]\s*(\d{1,2})\s*(?:m|mk|mks|marks?|markah)?\s*[\])]\s*$/i, /\b(\d{1,2})\s*(?:marks?|markah)\s*\)?\s*$/i, /\/\s*(\d{1,2})\s*$/ ],
    total: /^\s*(?:total|jumlah)\b/i,
  };
  const clean = s => String(s || "").replace(/\s+/g, " ").trim();
  function takeMarks(text) { for (const r of RX.marks) { const m = text.match(r); if (m) return { text: clean(text.slice(0, m.index)), marks: +m[1] }; } return { text, marks: null }; }
  function splitInlineOptions(text) { // "A 3 cm B 4 cm C 5 cm D 6 cm" or "(A) x (B) y"
    const hits = [...text.matchAll(/(?:^|\s)\(?([A-E])[.)]\s+/g)]; if (hits.length < 2 || hits[0].index > 2) return null;
    const letters = hits.map(h => h[1]); if (letters.join("") !== "ABCDE".slice(0, letters.length)) return null;
    return hits.map((h, i) => ({ letter: h[1], text: clean(text.slice(h.index + h[0].length, hits[i + 1]?.index ?? text.length)) }));
  }
  function trailingOptions(text) { // "Which is a mammal? (A) Shark (B) Whale (C) Trout (D) Eel"
    const m = text.match(/\s\(?A[.)]\s+/); if (!m) return null; const opts = splitInlineOptions(text.slice(m.index)); return opts && opts.length >= 2 ? { before: clean(text.slice(0, m.index)), opts } : null; }
  const key = r => [r.section || "", r.num || "", r.part || "", r.sub || ""].join("|");

  /* ---------- questions ---------- */
  function parseQuestions(lines, opt = {}) {
    const rows = [], answerLines = []; let cur = null, section = "", num = "", part = "", mode = "q", lastLetter = "";
    const open = (o) => { close(); cur = { id: Math.random().toString(36).slice(2, 9), section, num, part: "", sub: "", stem: "", text: "", options: [], answer: "", marks: null, figures: [], page: o.page, ...o }; };
    const close = () => { if (!cur) return; cur.text = clean(cur.text); if (cur.text || cur.options.length || cur.figures.length) rows.push(cur); cur = null; };
    for (const ln of lines) {
      if (ln.img) { (cur || (rows.length ? rows[rows.length - 1] : null))?.figures.push(ln.img); continue; }
      let t = clean(ln.text); if (!t) continue;
      if (ln.answerSection || (opt.answerSection !== false && RX.answerHead.test(t))) { close(); mode = "a"; if (!RX.answerHead.test(t)) answerLines.push(ln); continue; }
      if (mode === "a") { answerLines.push(ln); continue; }
      if (RX.total.test(t)) continue;
      const sec = t.match(RX.section); if (sec && t.length < 80 && opt.sections !== false) { close(); section = sec[1].toUpperCase(); num = part = ""; continue; }
      let m = null; for (const r of RX.q) { const x = t.match(r); if (x && +x[1] > 0 && +x[1] <= 300) { m = x; break; } }
      // a bare "3 Text" line only starts a question when it continues the sequence, so numbers in sentences don't
      if (m && RX.q.indexOf(RX.q.find(r => r.test(t))) === 3 && +m[1] !== (+num || 0) + 1) m = null;
      if (m && (!num || +m[1] !== +num || !cur)) { num = m[1]; part = ""; lastLetter = ""; let rest = m[2] || "";
        const pp = rest.match(/^\(?([a-h])\)\s*(.*)$/); // "1 (a) State…": the question and its first part on one line
        if (pp) { part = lastLetter = pp[1]; rest = pp[2]; }
        const mk = takeMarks(rest), to = trailingOptions(mk.text); open({ num, part, page: ln.page, text: to ? to.before : mk.text }); if (to) cur.options.push(...to.opts); if (mk.marks != null) cur.marks = mk.marks; continue; }
      const rm = num && t.match(RX.roman), pm = num && t.match(RX.part);
      const isRoman = rm && !(pm && /^[a-h]$/.test(rm[1]) && (rm[1] !== "i" || lastLetter === "h"));
      if (pm && !isRoman) { // a new part: the question's opening text becomes the stem shared by its parts
        const letter = (pm[1] || pm[3]).toLowerCase(), rest = pm[2] ?? pm[4] ?? ""; let stem = "", figs = [];
        if (cur && !cur.part) { stem = cur.text; figs = cur.figures; if (cur.marks == null && !cur.answer && !cur.options.length) cur = null; } // a bare stem is folded into its parts
        else if (cur) stem = cur.stem;
        part = letter; lastLetter = letter; const mk = takeMarks(rest); open({ num, part, stem: clean(stem), page: ln.page, text: mk.text, figures: figs }); if (mk.marks != null) cur.marks = mk.marks; continue; }
      if (isRoman && cur) { // a sub-part: the part's text joins the stem
        const sub = rm[1].toLowerCase(), mk = takeMarks(rm[2] || ""), p2 = cur.part; let stem = cur.stem, figs = [];
        if (!cur.sub) { stem = clean([cur.stem, cur.text].filter(Boolean).join(" — ")); figs = cur.figures; if (cur.marks == null && !cur.answer && !cur.options.length) cur = null; }
        open({ num, part: p2, sub, stem, page: ln.page, text: mk.text, figures: figs }); if (mk.marks != null) cur.marks = mk.marks; continue; }
      if (!cur) continue;
      const an = t.match(RX.answer); if (an) { cur.answer = clean([cur.answer, an[1]].filter(Boolean).join(" ")); continue; }
      const inline = opt.mcq !== false && splitInlineOptions(t); if (inline) { cur.options.push(...inline); continue; }
      const om = opt.mcq !== false && t.match(RX.opt); if (om && (cur.options.length ? om[1].charCodeAt(0) === cur.options[cur.options.length - 1].letter.charCodeAt(0) + 1 : om[1] === "A")) { cur.options.push({ letter: om[1], text: clean(om[2]) }); continue; }
      const mk = takeMarks(t); if (mk.marks != null) { cur.marks = (cur.marks || 0) + mk.marks; t = mk.text; }
      if (t) { if (cur.options.length) cur.options[cur.options.length - 1].text += " " + t; else cur.text += " " + t; }
    }
    close();
    return { rows, answerLines };
  }

  /* ---------- answer keys and marking schemes ---------- */
  function parseAnswers(lines) {
    const map = {}; let section = "", num = "", part = "", sub = "", last = null;
    const put = (k, ans, mk) => { const e = map[k] ||= { answer: "", marks: null }; if (ans) e.answer = clean([e.answer, ans].filter(Boolean).join(" ")); if (mk != null) e.marks = mk; last = e; };
    for (const ln of lines) {
      let t = clean(ln.text); if (!t || RX.answerHead.test(t)) continue;
      const sec = t.match(RX.section); if (sec && t.length < 60) { section = sec[1].toUpperCase(); continue; }
      const grid = [...t.matchAll(/(?:^|\s)(\d{1,3})\s*[.):]?\s*([A-E])(?=\s|$|[,;])/g)];
      if (grid.length >= 2 && grid.map(g => g[0]).join("").replace(/\s/g, "").length >= t.replace(/\s/g, "").length * .8) { grid.forEach(g => put([section, g[1], "", ""].join("|"), g[2])); last = null; continue; }
      // "3(b)(ii) answer [2]", "3b answer", "Q3 answer", "3. answer"
      let m = t.match(/^\s*(?:Q|question|soalan)?\s*(\d{1,3})\s*\(?([a-h])?\)?\s*\(?((?:x|ix|iv|v?i{1,3}|vi{0,3}))?\)?\s*[.:)\-–]?\s*(.*)$/i);
      if (m && m[1] && (m[4] || m[2] || /^\s*(?:Q|question|soalan)?\s*\d{1,3}\s*[.:)]/i.test(t) || /^\s*(?:Q|question|soalan)\s*\d/i.test(t))) { // includes a heading such as "Question 1" on its own
        num = m[1]; part = (m[2] || "").toLowerCase(); sub = (m[3] || "").toLowerCase(); const mk = takeMarks(m[4] || ""); put([section, num, part, sub].join("|"), mk.text, mk.marks); continue; }
      const pm = num && t.match(RX.part); if (pm) { part = (pm[1] || pm[3]).toLowerCase(); sub = ""; let rest = pm[2] ?? pm[4] ?? "";
        const sm = rest.match(/^\(?((?:x|ix|iv|v?i{1,3}|vi{0,3}))\)\s*(.*)$/); if (sm && sm[1]) { sub = sm[1]; rest = sm[2]; } // "(b)(i) answer"
        const mk = takeMarks(rest); put([section, num, part, sub].join("|"), mk.text, mk.marks); continue; }
      const rm = num && t.match(RX.roman); if (rm) { sub = rm[1].toLowerCase(); const mk = takeMarks(rm[2] || ""); put([section, num, part, sub].join("|"), mk.text, mk.marks); continue; }
      if (last) { const mk = takeMarks(t); if (mk.marks != null) last.marks = (last.marks || 0) + mk.marks; if (mk.text) last.answer = clean(last.answer + " " + mk.text); }
    }
    return map;
  }
  function merge(rows, map) {
    let matched = 0;
    for (const r of rows) { const tries = [key(r), ["", r.num, r.part, r.sub].join("|"), [r.section, r.num, r.part, ""].join("|"), ["", r.num, r.part, ""].join("|"), [r.section, r.num, "", ""].join("|"), ["", r.num, "", ""].join("|")];
      const hit = tries.map(k => map[k]).find(Boolean); if (!hit) continue; matched++;
      if (!r.answer && hit.answer) r.answer = hit.answer; if (r.marks == null && hit.marks != null) r.marks = hit.marks; }
    return matched;
  }
  /* ---------- checks: what may need a second look ---------- */
  function flag(rows) {
    const anyMarks = rows.some(r => r.marks != null), seen = new Map();
    for (const r of rows) { const f = [];
      if (!r.answer) f.push("No answer found"); if (anyMarks && r.marks == null) f.push("No marks found");
      if (r.options.length && r.options.length < 3) f.push("Only " + r.options.length + " options");
      if (r.options.length && r.answer && !/^[A-E]\b/i.test(r.answer)) f.push("Answer isn’t an option letter");
      if (r.text.length > 900) f.push("Very long: may be two questions");
      if (!r.text && !r.stem) f.push("No question text");
      if (r.figures.length && !r.figures.every(x => x.description)) f.push("Figure needs a description");
      const norm = (r.stem + " " + r.text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); if (norm.length > 20) { if (seen.has(norm)) f.push("Possible duplicate of " + seen.get(norm)); else seen.set(norm, label(r)); }
      r.flags = f; }
    return rows;
  }
  const label = r => `${r.section ? r.section + " " : ""}${r.num}${r.part ? "(" + r.part + ")" : ""}${r.sub ? "(" + r.sub + ")" : ""}`;
  const fingerprint = r => (r.stem + " " + r.text + " " + r.options.map(o => o.text).join(" ")).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const api = { parseQuestions, parseAnswers, merge, flag, label, fingerprint, key, takeMarks, splitInlineOptions, ROMAN };
  if (typeof module === "object" && module.exports) module.exports = api; else root.QBank = api;
})(typeof window !== "undefined" ? window : globalThis);
