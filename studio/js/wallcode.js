/* If Leaves Weave Wall: a wall packed into a link, and a post packed into a code. There is no server: the text itself carries
   the data, and the part of a link after "#" never reaches any server. Everything that arrives from someone else is cleaned
   here before it is shown or saved. Used by the Wall (studio/js/wall.js) and the public page (wall-link.html). */
"use strict";
const WallCode = (() => {
  const newId = () => Math.random().toString(36).slice(2, 10);
  const b64u = bytes => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
  const unb64u = t => { const s = atob(t.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((t.length + 3) % 4)); const o = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) o[i] = s.charCodeAt(i); return o; };
  const canZip = typeof CompressionStream === "function";
  const through = async (stream, bytes) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

  /* "z" = compressed (deflate-raw), "j" = plain JSON, for browsers without compression. */
  async function pack(obj) {
    const raw = new TextEncoder().encode(JSON.stringify(obj));
    if (canZip) { try { return "z" + b64u(await through(new CompressionStream("deflate-raw"), raw)); } catch { /* fall back below */ } }
    return "j" + b64u(raw);
  }
  async function unpack(t) {
    if (typeof t !== "string" || t.length < 2 || t.length > 3e6 || !/^[zj][A-Za-z0-9_-]+$/.test(t)) throw new Error("not a wall code");
    const bytes = unb64u(t.slice(1)), raw = t[0] === "z" ? await through(new DecompressionStream("deflate-raw"), bytes) : bytes;
    return JSON.parse(new TextDecoder().decode(raw));
  }
  /* The studio's existing "#import=" door (gzip, base64url), so a shared wall can be saved as your own copy. */
  async function importLink(doc, base) {
    const raw = new TextEncoder().encode(JSON.stringify({ kind: "ifleavesweave-wall-doc", doc }));
    return new URL("wall.html", base).href + "#import=" + b64u(await through(new CompressionStream("gzip"), raw));
  }

  /* A post code: ILW-POST-1.<packed>.<check>. The check catches a code that was cut short or changed when copied. */
  const check = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0").slice(0, 6); };
  const PREFIX = "ILW-POST-1.";
  const CODE_RX = /ILW-POST-1\.([zj][A-Za-z0-9_-]+)\.([0-9a-f]{6})/g;
  async function postCode(obj) { const p = await pack(obj); return PREFIX + p + "." + check(p); }
  /* Every code found anywhere in the text (an email, a chat export, several codes at once). */
  async function readCodes(text) {
    const posts = [], problems = [];
    for (const m of String(text || "").matchAll(CODE_RX)) {
      if (check(m[1]) !== m[2]) { problems.push("damaged"); continue; }
      try { posts.push(await unpack(m[1])); } catch { problems.push("unreadable"); }
    }
    if (!posts.length && !problems.length && /ILW-POST/.test(String(text))) problems.push("damaged");
    return { posts, problems };
  }

  /* ---------- cleaning what someone else wrote ---------- */
  const str = (v, n) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").slice(0, n);
  const url = v => { const s = str(v, 500).trim(); try { const u = new URL(s); return /^https?:$/.test(u.protocol) ? u.href : ""; } catch { return ""; } };
  const img = v => (typeof v === "string" && v.length < 400000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) ? v : "";
  const colour = v => /^#[0-9a-fA-F]{6}$/.test(v || "") ? v : "";
  function cleanPost(p) {
    p = p && typeof p === "object" ? p : {};
    return { id: str(p.id, 24).replace(/[^\w-]/g, "") || newId(), section: str(p.section, 24), title: str(p.title, 120).trim(), body: str(p.body, 2000).trim(),
             link: url(p.link), image: img(p.image), color: colour(p.color), author: str(p.author, 60).trim(), created: Number.isFinite(+p.created) ? +p.created : Date.now() };
  }
  function cleanWall(w) {          // a wall arriving in a link: only the fields a viewer needs
    w = w && typeof w === "object" ? w : {};
    const sections = (Array.isArray(w.s) ? w.s : []).slice(0, 40).map(s => ({ id: str(s.id, 24).replace(/[^\w-]/g, "") || newId(), name: str(s.n, 80) || "Posts" }));
    const posts = (Array.isArray(w.p) ? w.p : []).slice(0, 500).map(p => ({ ...cleanPost(p), pinned: !!p.pinned, reactions: Math.max(0, Math.min(1e6, +p.r || 0)),
      comments: (Array.isArray(p.c) ? p.c : []).slice(0, 100).map(c => ({ author: str(c.a, 60), text: str(c.t, 600) })) }));
    return { v: 1, title: str(w.t, 120) || "A wall", description: str(w.d, 1000), layout: ["wall", "columns", "stream", "grid"].includes(w.l) ? w.l : "wall",
             reaction: ["like", "star", "vote", "none"].includes(w.r) ? w.r : "like", sections: sections.length ? sections : [{ id: newId(), name: "Posts" }], posts,
             contribute: w.c && typeof w.c === "object" ? cleanInvite(w.c) : null };
  }
  function cleanInvite(c) {        // what a contribute link carries: the wall's key, title, prompt and section names, nothing else
    c = c && typeof c === "object" ? c : {};
    const sections = (Array.isArray(c.s) ? c.s : []).slice(0, 40).map(s => ({ id: str(s.id, 24).replace(/[^\w-]/g, ""), name: str(s.n, 80) })).filter(s => s.id);
    return { key: str(c.k, 40).replace(/[^\w-]/g, ""), title: str(c.t, 120) || "A wall", prompt: str(c.d, 1000), sections, images: !!c.i };
  }

  /* A picture made smaller before it is stored or sent: at most `max` pixels on the longer side, as JPEG. */
  async function shrinkImage(file, max = 1200, quality = 0.82) {
    if (!file || !/^image\//.test(file.type)) throw new Error("That file is not a picture.");
    const bmp = await createImageBitmap(file), k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(bmp, 0, 0, c.width, c.height); bmp.close?.();
    return c.toDataURL("image/jpeg", quality);
  }
  const REACTIONS = { like: ["♥", "Like", "likes"], star: ["★", "Star", "stars"], vote: ["▲", "Vote", "votes"], none: ["", "", ""] };
  const COLOURS = ["#FFF4C2", "#DDF2E3", "#DCEEFB", "#FBE1E7", "#ECE4FB", "#FFE6CF", "#FFFFFF"];
  return { pack, unpack, importLink, postCode, readCodes, cleanPost, cleanWall, cleanInvite, shrinkImage, str, url, newId, REACTIONS, COLOURS, canZip };
})();
