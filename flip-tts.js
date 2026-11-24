/* Read aloud for If Leaves Weave flipbooks. Optional introduction: FLIP.intro (text, spoken by the device voice) and
   FLIP.introAudio (a recording, played instead; if it can't play, the text is spoken). It plays once, only when listening
   starts on the first page, and can be skipped.
   Read aloud for If Leaves Weave flipbooks: reads the text of the pages on screen with the device's own voices
   (the Web Speech API: no account, no server, works offline). It reads the hidden page text (.sr) in #book and turns
   pages with the flipbook's own Next button, so it works with any flipbook layout. */
(function () {
  if (!("speechSynthesis" in window)) return; // browsers without speech: no button
  const synth = speechSynthesis, book = document.getElementById("book"), next = document.getElementById("next"), header = document.querySelector("header");
  if (!book || !header) return;
  const css = document.createElement("style");
  css.textContent = `.tts-bar{position:fixed;z-index:60;left:50%;bottom:16px;transform:translateX(-50%);display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;max-width:calc(100vw - 24px);background:rgba(22,25,31,.94);color:#fff;border-radius:16px;padding:8px 10px;font:14px/1.3 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.tts-bar[hidden]{display:none}.tts-bar button,.tts-bar select{font:inherit;color:#fff;background:rgba(255,255,255,.12);border:0;border-radius:10px;padding:7px 11px;cursor:pointer}.tts-bar button:hover{background:rgba(255,255,255,.22)}
.tts-bar select{max-width:170px}.tts-bar select option{color:#000}.tts-bar label{display:flex;gap:5px;align-items:center;padding:0 4px}.tts-bar :focus-visible{outline:3px solid #9fb7ff;outline-offset:2px}
.tts-bar .st{min-width:110px;text-align:center;opacity:.85;font-size:13px}#tts-btn[aria-pressed=true]{outline:2px solid currentColor}`;
  document.head.append(css);
  const btn = document.createElement("button"); btn.id = "tts-btn"; btn.type = "button"; btn.textContent = "Listen"; btn.setAttribute("aria-pressed", "false"); btn.title = "Read the pages aloud (L)";
  const ref = document.getElementById("fs"); ref ? header.insertBefore(btn, ref) : header.append(btn);
  const bar = document.createElement("div"); bar.className = "tts-bar"; bar.hidden = true; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Read aloud");
  bar.innerHTML = `<button type="button" data-a="play" aria-label="Pause">❚❚ Pause</button><button type="button" data-a="stop" aria-label="Stop reading">■ Stop</button>
    <select data-a="rate" aria-label="Reading speed"><option value=".8">Slower</option><option value="1" selected>Normal speed</option><option value="1.2">Faster</option><option value="1.5">Fastest</option></select>
    <select data-a="voice" aria-label="Voice"></select><label><input type="checkbox" data-a="cont" checked> Keep reading the next pages</label><button type="button" data-a="skip" hidden>Skip introduction</button><span class="st" aria-live="polite"></span><button type="button" data-a="close" aria-label="Close read aloud">✕</button>`;
  document.body.append(bar);
  const $b = a => bar.querySelector(`[data-a="${a}"]`), status = t => { bar.querySelector(".st").textContent = t; };
  let voices = [], queue = [], speaking = false, paused = false, gen = 0, intro = false, introDone = false, audio = null;
  const D = window.FLIP || {}, atStart = () => { const c = document.getElementById("count"); return !c || /^\s*1(\D|$)/.test(c.textContent.trim()); };
  const lang = (document.documentElement.lang || navigator.language || "en").slice(0, 2).toLowerCase();
  function loadVoices() { voices = synth.getVoices(); const mine = voices.filter(v => v.lang.toLowerCase().startsWith(lang)), list = mine.length ? mine : voices;
    $b("voice").innerHTML = list.map(v => `<option value="${v.name}">${v.name.replace(/Microsoft |Google /, "")} (${v.lang})</option>`).join("") || "<option>Default voice</option>";
    let saved = null; try { saved = localStorage.getItem("ilw-flip-voice"); } catch {} if (saved && list.some(v => v.name === saved)) $b("voice").value = saved; }
  loadVoices(); synth.onvoiceschanged = loadVoices;
  // the text of the pages on screen, split into sentence-sized pieces (Chrome cuts off long utterances)
  function pagesText() { return [...book.querySelectorAll(".sr")].map(e => e.textContent.trim()).filter(Boolean).join("\n\n"); }
  function chunks(t) { const out = []; for (const s of t.replace(/\s+/g, " ").match(/[^.!?;:]+[.!?;:]*\s*/g) || []) { if (s.length > 220) out.push(...s.match(/.{1,200}(\s|$)/g)); else if (out.length && (out[out.length - 1] + s).length < 200) out[out.length - 1] += s; else out.push(s); } return out.map(x => x.trim()).filter(Boolean); }
  function speakNext(my) {
    if (my !== gen) return;
    if (!queue.length && intro) { endIntro(); queue = chunks(pagesText()); status(statusText()); }
    if (!queue.length) { // this spread is done: turn the page, or finish
      if ($b("cont").checked && next && !next.disabled && getComputedStyle(next).visibility !== "hidden") { const before = pagesText(); turning = true; next.click(); waitTurn(before, my); }
      else { speaking = false; status("Finished"); playLabel(); }
      return; }
    const u = new SpeechSynthesisUtterance(queue.shift()), v = voices.find(x => x.name === $b("voice").value); if (v) { u.voice = v; u.lang = v.lang; } u.rate = +$b("rate").value;
    u.onend = () => speakNext(my); u.onerror = e => { if (e.error !== "interrupted" && e.error !== "canceled") speakNext(my); }; synth.speak(u);
  }
  let turning = false;
  function waitTurn(before, my, tries = 0) { setTimeout(() => { if (my !== gen) return; const now = pagesText(); if (now && now !== before) { turning = false; readNow(my); } else if (tries < 40) waitTurn(before, my, tries + 1); else { turning = false; speaking = false; status("Finished"); playLabel(); } }, 150); }
  const statusText = () => { const c = document.getElementById("count"); return c ? "Reading page " + c.textContent.split("/")[0].trim() : "Reading"; };
  function endIntro() { intro = false; $b("skip").hidden = true; if (audio) { audio.pause(); audio = null; } }
  function startIntro(my) { // the recording if there is one, otherwise the typed introduction
    intro = true; introDone = true; $b("skip").hidden = false; status("Introduction"); speaking = true; paused = false; playLabel();
    const spoken = () => { if (my !== gen) return; audio = null; queue = chunks(D.intro || ""); if (!queue.length) { endIntro(); queue = chunks(pagesText()); status(statusText()); } speakNext(my); };
    if (D.introAudio) { audio = new Audio(D.introAudio); audio.onended = () => { if (my !== gen) return; endIntro(); readNow(my, true); }; audio.onerror = () => { if (audio && my === gen) spoken(); }; audio.play().catch(() => { if (my === gen && audio) spoken(); }); }
    else spoken();
  }
  function readNow(my = ++gen, skipIntro = false) { synth.cancel(); if (!skipIntro && !introDone && (D.intro || D.introAudio) && atStart()) return startIntro(my);
    queue = chunks(pagesText()); speaking = true; paused = false; status(statusText()); playLabel(); if (!queue.length) { status("No text on this page"); } speakNext(my); }
  function stop() { gen++; synth.cancel(); endIntro(); queue = []; speaking = false; paused = false; status("Stopped"); playLabel(); }
  function playLabel() { const b = $b("play"); const on = speaking && !paused; b.textContent = on ? "❚❚ Pause" : "▶ Play"; b.setAttribute("aria-label", on ? "Pause" : "Play"); btn.setAttribute("aria-pressed", String(speaking)); }
  function open() { bar.hidden = false; readNow(); $b("play").focus(); }
  function close() { stop(); introDone = false; bar.hidden = true; btn.focus(); } // next time, the introduction plays again
  btn.onclick = () => bar.hidden ? open() : close();
  bar.addEventListener("click", e => { const a = e.target.closest("[data-a]")?.dataset.a;
    if (a === "play") { if (!speaking) readNow(); else if (paused) { if (audio) audio.play(); else synth.resume(); paused = false; playLabel(); status(intro ? "Introduction" : "Reading"); } else { if (audio) audio.pause(); else synth.pause(); paused = true; playLabel(); status("Paused"); } }
    if (a === "skip") { const my = ++gen; synth.cancel(); endIntro(); readNow(my, true); }
    if (a === "stop") stop(); if (a === "close") close(); });
  bar.addEventListener("change", e => { const a = e.target.dataset.a; if (a === "voice") { try { localStorage.setItem("ilw-flip-voice", e.target.value); } catch {} } if ((a === "voice" || a === "rate") && speaking) readNow(); });
  // turning pages by hand while reading restarts on the new page
  new MutationObserver(() => { if (speaking && !turning && !paused) { clearTimeout(close.t); close.t = setTimeout(() => readNow(), 250); } }).observe(book, { childList: true });
  addEventListener("keydown", e => { if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; if (e.key.toLowerCase() === "l" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); bar.hidden ? open() : close(); } });
  addEventListener("pagehide", () => synth.cancel());
})();
