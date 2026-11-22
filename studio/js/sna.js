/* If Leaves Weave network analysis. Standard, well-documented algorithms, written to be checked:
   degree, density, reciprocity, betweenness (Brandes 2001), harmonic closeness, eigenvector centrality,
   PageRank, local clustering, Louvain communities (Blondel et al. 2008), maximal cliques (Bron–Kerbosch with pivot),
   sociometric status (Coie, Dodge & Coppotelli 1982), and Fruchterman–Reingold, target and circle layouts. */
"use strict";
const SNA = (() => {
  // ties: [{from, to, type: "positive" | "negative", weight}]
  function graph(people, ties, { directed = true, type = "positive" } = {}) {
    const ids = people.map(p => p.id), idx = new Map(ids.map((id, i) => [id, i])), n = ids.length;
    const out = Array.from({ length: n }, () => new Map()), inn = Array.from({ length: n }, () => new Map());
    for (const t of ties) { if ((t.type || "positive") !== type) continue; const a = idx.get(t.from), b = idx.get(t.to); if (a == null || b == null || a === b) continue; // one tie per person-to-person choice: an accidental repeat merges, keeping the stronger weight
    const w = +t.weight || 1, put = (m, k) => m.set(k, Math.max(m.get(k) || 0, w)); put(out[a], b); put(inn[b], a); if (!directed) { put(out[b], a); put(inn[a], b); } }
    return { n, ids, idx, out, inn, directed };
  }
  // undirected, weighted version (weights added both ways) for communities, eigenvector and clustering
  function sym(g) { const adj = Array.from({ length: g.n }, () => new Map()); g.out.forEach((m, a) => m.forEach((w, b) => { adj[a].set(b, (adj[a].get(b) || 0) + w); adj[b].set(a, (adj[b].get(a) || 0) + w); })); if (!g.directed) adj.forEach(m => m.forEach((w, k) => m.set(k, w / 2))); return adj; }
  const edgeCount = g => g.out.reduce((s, m) => s + m.size, 0) / (g.directed ? 1 : 2);
  function density(g) { const n = g.n; if (n < 2) return 0; return edgeCount(g) / (g.directed ? n * (n - 1) : n * (n - 1) / 2); }
  function reciprocity(g) { if (!g.directed) return 1; let m = 0, mutual = 0; g.out.forEach((mp, a) => mp.forEach((_, b) => { m++; if (g.out[b].has(a)) mutual++; })); return m ? mutual / m : 0; }
  // Brandes betweenness (unweighted shortest paths); normalised to 0–1
  function betweenness(g) {
    const n = g.n, cb = new Array(n).fill(0);
    for (let s = 0; s < n; s++) {
      const S = [], P = Array.from({ length: n }, () => []), sigma = new Array(n).fill(0), d = new Array(n).fill(-1); sigma[s] = 1; d[s] = 0; const Q = [s];
      while (Q.length) { const v = Q.shift(); S.push(v); for (const w of g.out[v].keys()) { if (d[w] < 0) { Q.push(w); d[w] = d[v] + 1; } if (d[w] === d[v] + 1) { sigma[w] += sigma[v]; P[w].push(v); } } }
      const delta = new Array(n).fill(0);
      while (S.length) { const w = S.pop(); for (const v of P[w]) delta[v] += sigma[v] / sigma[w] * (1 + delta[w]); if (w !== s) cb[w] += delta[w]; }
    }
    const norm = n > 2 ? (g.directed ? (n - 1) * (n - 2) : (n - 1) * (n - 2)) : 1; // undirected counts each pair twice above, so the same divisor applies
    return cb.map(v => v / norm);
  }
  // Harmonic closeness: mean of 1/distance to everyone else (works when some people are unreachable)
  function closeness(g) { const n = g.n; return g.out.map((_, s) => { const d = new Array(n).fill(-1); d[s] = 0; const Q = [s]; let sum = 0; while (Q.length) { const v = Q.shift(); for (const w of g.out[v].keys()) if (d[w] < 0) { d[w] = d[v] + 1; sum += 1 / d[w]; Q.push(w); } } return n > 1 ? sum / (n - 1) : 0; }); }
  // Eigenvector centrality on the undirected network (power iteration, scaled so the highest is 1)
  function eigenvector(adj) { const n = adj.length; if (!n) return []; let x = new Array(n).fill(1); for (let it = 0; it < 2000; it++) { const y = new Array(n).fill(0); adj.forEach((m, a) => m.forEach((w, b) => { y[a] += w * x[b]; })); for (let i = 0; i < n; i++) y[i] += x[i]; /* shift by the identity: same eigenvector, but it always converges */ const mx = Math.max(...y) || 1, nx = y.map(v => v / mx); const diff = nx.reduce((s, v, i) => s + Math.abs(v - x[i]), 0); x = nx; if (diff < 1e-12) break; } return x; }
  // PageRank for directed influence (damping 0.85; people who choose nobody share evenly)
  function pagerank(g, d = .85) { const n = g.n; if (!n) return []; let pr = new Array(n).fill(1 / n); const outW = g.out.map(m => [...m.values()].reduce((a, b) => a + b, 0)); for (let it = 0; it < 200; it++) { const nx = new Array(n).fill((1 - d) / n); let dangling = 0; for (let a = 0; a < n; a++) { if (!outW[a]) { dangling += pr[a]; continue; } g.out[a].forEach((w, b) => { nx[b] += d * pr[a] * w / outW[a]; }); } for (let i = 0; i < n; i++) nx[i] += d * dangling / n; const diff = nx.reduce((s, v, i) => s + Math.abs(v - pr[i]), 0); pr = nx; if (diff < 1e-12) break; } return pr; }
  function clustering(adj) { return adj.map((m, v) => { const nb = [...m.keys()], k = nb.length; if (k < 2) return 0; let links = 0; for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) if (adj[nb[i]].has(nb[j])) links++; return 2 * links / (k * (k - 1)); }); }
  // Louvain community detection on the undirected weighted network
  function louvain(adj) {
    let n = adj.length; if (!n) return { comm: [], q: 0 };
    let A = adj.map(m => new Map(m)); let member = [...Array(n).keys()]; // original node -> community in current level
    const modularity = (A, c) => { let m2 = 0; A.forEach(mp => mp.forEach(w => (m2 += w))); if (!m2) return 0; const tot = new Map(), inn = new Map(); A.forEach((mp, i) => { const k = [...mp.values()].reduce((a, b) => a + b, 0); tot.set(c[i], (tot.get(c[i]) || 0) + k); mp.forEach((w, j) => { if (c[i] === c[j]) inn.set(c[i], (inn.get(c[i]) || 0) + w); }); }); let q = 0; tot.forEach((t, cm) => { q += (inn.get(cm) || 0) / m2 - (t / m2) ** 2; }); return q; };
    for (let level = 0; level < 20; level++) {
      const N = A.length, k = A.map(mp => [...mp.values()].reduce((a, b) => a + b, 0)), m2 = k.reduce((a, b) => a + b, 0); if (!m2) break;
      const c = [...Array(N).keys()], tot = [...k]; let moved = true, any = false;
      for (let pass = 0; moved && pass < 50; pass++) { moved = false;
        for (let i = 0; i < N; i++) {
          const ci = c[i], wTo = new Map(); A[i].forEach((w, j) => { if (j !== i) wTo.set(c[j], (wTo.get(c[j]) || 0) + w); });
          tot[ci] -= k[i]; let best = ci, gain = (wTo.get(ci) || 0) - tot[ci] * k[i] / m2;
          wTo.forEach((w, cm) => { const gn = w - tot[cm] * k[i] / m2; if (gn > gain + 1e-12) { gain = gn; best = cm; } });
          tot[best] += k[i]; if (best !== ci) { c[i] = best; moved = true; any = true; }
        } }
      if (!any) break;
      const relabel = new Map(); c.forEach(x => { if (!relabel.has(x)) relabel.set(x, relabel.size); }); const cc = c.map(x => relabel.get(x));
      member = member.map(x => cc[x]); const M = relabel.size, B = Array.from({ length: M }, () => new Map());
      A.forEach((mp, i) => mp.forEach((w, j) => { const a = cc[i], b = cc[j]; B[a].set(b, (B[a].get(b) || 0) + w); })); A = B;
      if (M === N) break;
    }
    // number communities by size (largest first) so colours stay stable
    const sizes = new Map(); member.forEach(x => sizes.set(x, (sizes.get(x) || 0) + 1)); const order = [...sizes.keys()].sort((a, b) => sizes.get(b) - sizes.get(a)), ren = new Map(order.map((x, i) => [x, i]));
    const comm = member.map(x => ren.get(x)); return { comm, q: modularity(adj, comm) };
  }
  // Maximal cliques (3 or more) among reciprocated ties, Bron–Kerbosch with pivoting
  function cliques(g, min = 3) {
    const n = g.n, N = Array.from({ length: n }, () => new Set()); for (let a = 0; a < n; a++) for (const b of g.out[a].keys()) if (!g.directed || g.out[b].has(a)) { N[a].add(b); N[b].add(a); }
    const res = []; const bk = (R, P, X) => { if (!P.size && !X.size) { if (R.length >= min) res.push([...R]); return; } let u = null, best = -1; for (const v of [...P, ...X]) { let c = 0; for (const w of P) if (N[v].has(w)) c++; if (c > best) { best = c; u = v; } } for (const v of [...P]) { if (N[u]?.has(v)) continue; bk([...R, v], new Set([...P].filter(w => N[v].has(w))), new Set([...X].filter(w => N[v].has(w)))); P.delete(v); X.add(v); } };
    bk([], new Set([...Array(n).keys()]), new Set()); return res.sort((a, b) => b.length - a.length);
  }
  const zs = arr => { const n = arr.length, m = arr.reduce((a, b) => a + b, 0) / (n || 1), sd = Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / (n || 1)); return arr.map(v => (sd ? (v - m) / sd : 0)); };
  // Coie, Dodge & Coppotelli (1982): standardise liked-most (LM) and liked-least (LL) within the group
  function status(lm, ll) {
    const zLM = zs(lm), zLL = zs(ll), SP = zs(zLM.map((v, i) => v - zLL[i])), SI = zs(zLM.map((v, i) => v + zLL[i]));
    return lm.map((_, i) => { const p = zLM[i], l = zLL[i], sp = SP[i], si = SI[i]; let s = "Not classified";
      if (sp > 1 && p > 0 && l < 0) s = "Popular"; else if (sp < -1 && l > 0 && p < 0) s = "Rejected"; else if (si < -1 && p < 0 && l < 0) s = "Neglected"; else if (si > 1 && p > 0 && l > 0) s = "Controversial"; else if (sp > -.5 && sp < .5) s = "Average";
      return { status: s, zLM: p, zLL: l, SP: sp, SI: si }; });
  }
  function analyse(people, ties, { directed = true } = {}) {
    const g = graph(people, ties, { directed }), neg = graph(people, ties, { directed, type: "negative" }), adj = sym(g), n = g.n;
    const inDeg = g.inn.map(m => m.size), outDeg = g.out.map(m => m.size), negIn = neg.inn.map(m => m.size), bt = betweenness(g), cl = closeness(g), ev = eigenvector(adj), pr = pagerank(g), cc = clustering(adj), comm = louvain(adj), cq = cliques(g);
    const mutual = g.out.map((m, a) => [...m.keys()].filter(b => g.out[b].has(a)).length);
    const hasNeg = ties.some(t => t.type === "negative"), st = hasNeg ? status(inDeg, negIn) : null;
    const mean = inDeg.reduce((a, b) => a + b, 0) / (n || 1), sd = Math.sqrt(inDeg.reduce((s, v) => s + (v - mean) ** 2, 0) / (n || 1));
    const per = people.map((p, i) => ({ id: p.id, name: p.name, inDeg: inDeg[i], outDeg: outDeg[i], negIn: negIn[i], mutual: mutual[i], betweenness: bt[i], closeness: cl[i], eigenvector: ev[i], pagerank: pr[i], clustering: cc[i], community: comm.comm[i], status: st?.[i].status || null, z: st?.[i] || null,
      isolate: inDeg[i] === 0 && outDeg[i] === 0, unchosen: inDeg[i] === 0, star: n > 3 && sd > 0 && inDeg[i] >= mean + sd, onlyMutual: false }));
    const pairs = []; g.out.forEach((m, a) => m.forEach((_, b) => { if (a < b && g.out[b].has(a)) pairs.push([g.ids[a], g.ids[b]]); }));
    return { per, density: density(g), reciprocity: reciprocity(g), modularity: comm.q, communities: Math.max(0, ...comm.comm.map(x => x + 1)), cliques: cq.map(c => c.map(i => g.ids[i])), mutualPairs: pairs, ties: edgeCount(g), hasNeg, n };
  }
  /* ---------- Layouts (deterministic, so the same data gives the same picture) ---------- */
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function forceLayout(people, ties, { width = 900, height = 650, iterations = 400, seed = 7 } = {}) {
    const n = people.length; if (!n) return {}; const r = rng(seed), idx = new Map(people.map((p, i) => [p.id, i])), pos = people.map((_, i) => ({ x: width / 2 + Math.cos(i / n * Math.PI * 2) * width * .3 + r() * 10, y: height / 2 + Math.sin(i / n * Math.PI * 2) * height * .3 + r() * 10 }));
    const E = ties.filter(t => idx.has(t.from) && idx.has(t.to) && t.from !== t.to).map(t => [idx.get(t.from), idx.get(t.to), t.type === "negative" ? .25 : 1]), k = Math.sqrt(width * height / n) * .75; let temp = width / 8;
    for (let it = 0; it < iterations; it++) {
      const disp = pos.map(() => ({ x: 0, y: 0 }));
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y, d = Math.hypot(dx, dy) || .01; const f = k * k / d; dx /= d; dy /= d; disp[i].x += dx * f; disp[i].y += dy * f; disp[j].x -= dx * f; disp[j].y -= dy * f; }
      for (const [a, b, s] of E) { let dx = pos[a].x - pos[b].x, dy = pos[a].y - pos[b].y, d = Math.hypot(dx, dy) || .01; const f = d * d / k * s; dx /= d; dy /= d; disp[a].x -= dx * f; disp[a].y -= dy * f; disp[b].x += dx * f; disp[b].y += dy * f; }
      for (let i = 0; i < n; i++) { disp[i].x += (width / 2 - pos[i].x) * .02; disp[i].y += (height / 2 - pos[i].y) * .02; const d = Math.hypot(disp[i].x, disp[i].y) || .01; pos[i].x += disp[i].x / d * Math.min(d, temp); pos[i].y += disp[i].y / d * Math.min(d, temp); }
      temp = Math.max(.5, temp * .985);
    }
    // fit into the frame
    const xs = pos.map(p => p.x), ys = pos.map(p => p.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), s = Math.min((width - 120) / Math.max(1, x1 - x0), (height - 120) / Math.max(1, y1 - y0), 1.6);
    const outp = {}; people.forEach((p, i) => { outp[p.id] = { x: 60 + (pos[i].x - x0) * s, y: 60 + (pos[i].y - y0) * s }; }); return outp;
  }
  // Target sociogram (after Northway 1940): most-chosen people in the centre, rings outwards; groups kept together
  function targetLayout(people, an, { size = 760 } = {}) {
    const c = size / 2, maxIn = Math.max(1, ...an.per.map(p => p.inDeg)), rings = 4, out = {}, byRing = Array.from({ length: rings }, () => []);
    an.per.forEach(p => { const r = p.inDeg === 0 ? rings - 1 : Math.min(rings - 2, Math.floor((1 - p.inDeg / maxIn) * (rings - 1))); byRing[r].push(p); });
    byRing.forEach((list, r) => { list.sort((a, b) => a.community - b.community || b.inDeg - a.inDeg); const rad = r === 0 && list.length === 1 ? 0 : (r + .6) * (size / 2 - 50) / rings; list.forEach((p, i) => { const a = -Math.PI / 2 + i / list.length * Math.PI * 2 + r * .35; out[p.id] = { x: c + Math.cos(a) * rad, y: c + Math.sin(a) * rad }; }); });
    return { pos: out, rings: Array.from({ length: rings }, (_, r) => ({ r: (r + 1) * (size / 2 - 50) / rings, c })) };
  }
  function circleLayout(people, an, { size = 700 } = {}) { const c = size / 2, R = size / 2 - 70, list = [...an.per].sort((a, b) => a.community - b.community || b.inDeg - a.inDeg), out = {}; list.forEach((p, i) => { const a = -Math.PI / 2 + i / list.length * Math.PI * 2; out[p.id] = { x: c + Math.cos(a) * R, y: c + Math.sin(a) * R }; }); return out; }
  return { analyse, graph, sym, betweenness, closeness, eigenvector, pagerank, clustering, louvain, cliques, status, density, reciprocity, forceLayout, targetLayout, circleLayout };
})();
if (typeof module !== "undefined") module.exports = SNA;
