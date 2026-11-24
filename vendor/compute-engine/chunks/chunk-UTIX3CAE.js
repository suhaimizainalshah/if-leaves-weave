/** Compute Engine 0.185.1 */
import{$e as $r,$f as Pr,Ae as rt,Af as il,Ag as zl,Be as vn,Bf as at,Bg as Fl,Ce as ot,Cf as sl,Cg as Lr,De as La,Df as al,Dg as ti,Ee as it,Ef as en,Fe as _r,Ff as q,Ge as Wo,Gf as X,Gg as Nl,He as st,Hf as ll,Ie as za,If as ul,Je as Fa,Jf as Sn,Ke as Na,Kf as Rn,Le as yr,Lf as pl,Me as Ga,Mf as cl,Ne as Ia,Nf as fl,Oe as Yo,Of as dl,Pe as Oa,Pf as Zo,Qc as ba,Qd as xa,Qe as br,Qf as Tt,Rc as fr,Re as Ma,Rf as Dn,Se as Ua,Sf as ml,Td as wa,Te as Pt,Tf as lt,Ue as xr,Uf as jn,Ve as Bn,Vf as Sr,We as Ba,Wf as Rr,Xe as Da,Xf as hl,Ye as wr,Yf as gl,Ze as ja,Zf as _l,_e as Va,_f as kt,af as qa,be as $a,bf as Ha,bg as yl,ce as va,cf as Wa,cg as bl,de as Ea,df as Ya,dg as xl,ee as nt,ef as En,eg as wl,fe as St,ff as Ka,fg as $l,ge as Vo,gf as Cn,gg as Ar,he as Ca,hf as Xa,ie as Sa,if as Za,ig as Tr,je as Ra,jf as Ja,jg as Jo,ke as qo,kf as vr,kg as kr,le as Pa,lf as Er,lg as je,me as dr,mf as Qa,mg as Qo,na as ya,ne as Aa,nf as el,ng as vl,oe as Un,of as Cr,og as El,pe as Je,pf as Ko,pg as Cl,qe as Ta,qf as nl,qg as Sl,re as un,rf as tl,rg as Rl,se as mr,sf as Xo,sg as Pl,td as jo,te as Qe,tf as rl,tg as Al,ue as tt,uf as ol,ug as ei,ve as ka,vf as f,vg as Tl,we as Ho,wf as At,wg as ut,xe as hr,xg as kl,ye as Rt,yg as ni,ze as gr,zg as Ll}from"./chunk-VJJNCX3B.js";import{a as Do}from"./chunk-CR526YWH.js";import{B as ga,D as _a}from"./chunk-ISCHR3OY.js";import{i as Ze}from"./chunk-D3Y5NZEE.js";import{$f as Go,Bb as et,Da as B,Ea as C,Eb as aa,Jb as Be,Na as _,Pe as ca,Qa as Ue,Qb as pr,Qe as fa,Rb as la,Sb as Fo,Sj as Oo,Ta as zo,Tb as ua,hg as Io,i as ln,j as $n,jh as ma,mf as cr,nf as da,qo as Bo,rd as pa,rn as Uo,ro as Mn,wh as De,wi as ha}from"./chunk-6C3VZ7DD.js";import{r as Mo}from"./chunk-ZHSHNBKT.js";import{h as No}from"./chunk-I7YXKCV7.js";import{Ac as Y,Bb as ta,Ga as Le,Kb as Ct,Lb as Qn,Ob as ko,Sa as D,U as Pe,X as Qs,bc as an,l as wn,m as In,qb as ea,qc as ze,sc as Lo,vc as ra,xb as lr,yb as na,zb as On}from"./chunk-DDRV37J7.js";import{Y as oa,Z as ia,aa as sa,b as se,l as ur}from"./chunk-3D4WY464.js";var tf=new Set(["Add","Subtract","Negate","Multiply","Divide","Rational","Power","Sqrt","Root"]);function Ol(e){if(B(e))return!e.isComplex&&e.isFinite===!0;if(!_(e)||!tf.has(e.operator))return!1;if(e.operator==="Power"){let n=e.ops[1];if(n===void 0||!B(n)||!(Math.abs(n.re)<=4096))return!1}return e.ops.every(Ol)}function pt(e){if(!Ol(e))return;let n=B(e)?e:e.evaluate();return B(n)&&!n.isComplex&&n.isFinite===!0?n:void 0}function Lt(e){if(!B(e))return;let n=e.numericValue,t=typeof n=="number"?new se(n):n.bignumRe;return t!==void 0&&t.isFinite()?t:void 0}function ii(e,n,t){let r=()=>{let i=se.ZERO;for(let s of e){let a=Lt(s);if(a===void 0)return;i=i.add(a)}if(n.length>0){let s=se.ZERO;for(let a of n){let u=Lt(a);if(u===void 0)return;s=s.add(u)}i=i.add(s.mul(se.PI))}return i},o=se.precision;try{se.precision=50;let i=r();if(i===void 0)return;if(i.isZero())return t(i);let s=i.significand<0n?-i.significand:i.significand,a=i.exponent+s.toString().length;if(a>1e4)return;se.precision=Math.max(50,a+30);let u=r();return u===void 0?void 0:t(u)}finally{se.precision=o}}var rf=26e6,of=5e4,sf=1e-4,Ml=`
uniform highp uint _gpu_zero_u;
highp float _gpu_opq(highp float v) {
  return uintBitsToFloat(floatBitsToUint(v) ^ _gpu_zero_u);
}

highp vec2 _gpu_two_sum(highp float fa, highp float fb) {
  highp float a = _gpu_opq(fa);
  highp float b = _gpu_opq(fb);
  highp float s = _gpu_opq(a + b);
  highp float bb = _gpu_opq(s - a);
  return vec2(s, _gpu_opq(a - _gpu_opq(s - bb)) + _gpu_opq(b - bb));
}

highp vec2 _gpu_two_prod(highp float fa, highp float fb) {
  highp float a = _gpu_opq(fa);
  highp float b = _gpu_opq(fb);
  highp float p = _gpu_opq(a * b);
  highp uint ua = floatBitsToUint(a);
  highp uint ub = floatBitsToUint(b);
  if (!(abs(p) >= 1e-30 && abs(p) <= 1e30) || (ua & 0x7F800000u) == 0u || (ub & 0x7F800000u) == 0u) return vec2(p, 0.0);
  highp uint up = floatBitsToUint(p);
  highp uint ma = (ua & 0x7FFFFFu) | 0x800000u;
  highp uint mb = (ub & 0x7FFFFFu) | 0x800000u;
  highp uint mp = (up & 0x7FFFFFu) | 0x800000u;
  highp int sc = int((ua >> 23) & 0xFFu) + int((ub >> 23) & 0xFFu) - 300;
  highp int s = int((up >> 23) & 0xFFu) - 150 - sc;
  highp uint a1 = ma >> 12;
  highp uint a0 = ma & 0xFFFu;
  highp uint b1 = mb >> 12;
  highp uint b0 = mb & 0xFFFu;
  highp uint lo = a0 * b0 + ((a1 * b0 + a0 * b1) << 12) + ((a1 * b1) << 24);
  highp uint d = lo - (mp << uint(s));
  highp int r = (d & 0x80000000u) != 0u ? -int(~d + 1u) : int(d);
  highp float sgn = ((ua ^ ub) & 0x80000000u) != 0u ? -1.0 : 1.0;
  highp int h = sc / 2;
  return vec2(p, sgn * float(r) * uintBitsToFloat(uint(h + 127) << 23) * uintBitsToFloat(uint(sc - h + 127) << 23));
}

highp vec4 _gpu_xred_fix(highp vec4 a) {
  highp float r = a.x;
  highp float lo = a.y;
  highp float k = floor(_gpu_opq((r + lo) * 0.636619772) + 0.5);
  highp vec2 t = _gpu_two_sum(r, -(k * 1.5703125));
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(k * 4.8375129699707031e-4));
  r = t.x;
  lo += t.y;
  lo -= k * 7.5495336204767227e-8 + k * 2.5632829192545614e-12;
  highp float q = a.z + k;
  return vec4(r, lo, q - 4.0 * floor(q / 4.0), a.w);
}

highp vec4 _gpu_xred(highp float x, highp float khi, highp float klo, highp float xmax) {
  highp vec2 pe = _gpu_two_prod(x, khi);
  highp vec2 qe = _gpu_two_prod(x, klo);
  highp float p = pe.x;
  highp float k = floor(_gpu_opq(p * 0.636619772) + 0.5);
  highp float kh = floor(k / 4096.0);
  highp float kl = k - kh * 4096.0;
  highp vec2 s = _gpu_two_sum((kh * 1.5703125) * 4096.0, kl * 1.5703125);
  highp float r = _gpu_opq(p - s.x);
  highp vec2 t = _gpu_two_sum(r, -(kh * 4.8375129699707031e-4) * 4096.0);
  r = t.x;
  highp float lo = t.y;
  t = _gpu_two_sum(r, -(kl * 4.8375129699707031e-4));
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(kh * 7.5495336204767227e-8) * 4096.0);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, -(kl * 7.5495336204767227e-8));
  r = t.x;
  lo += t.y;
  lo -= k * 2.5632829192545614e-12 + k * 6.1230317691118863e-17;
  t = _gpu_two_sum(r, -s.y);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, pe.y);
  r = t.x;
  lo += t.y;
  t = _gpu_two_sum(r, qe.x);
  r = t.x;
  lo += t.y + qe.y;
  return _gpu_xred_fix(vec4(r, lo, k, abs(x) <= xmax ? 1.0 : 0.0));
}

highp vec4 _gpu_xred_add(highp vec4 a, highp vec4 b) {
  highp vec2 s = _gpu_two_sum(a.x, b.x);
  return _gpu_xred_fix(vec4(s.x, a.y + b.y + s.y, a.z + b.z, a.w * b.w));
}

highp vec2 _gpu_xsin(highp vec4 a) {
  highp vec2 rr = _gpu_two_sum(a.x, a.y);
  highp float rh = rr.x;
  highp float rl = rr.y;
  highp float r2 = rh * rh;
  highp float ts = (rh * r2) * (-0.166666667 + r2 * (8.33333333e-3 + r2 * (-1.98412698e-4 + r2 * 2.75573192e-6)));
  highp vec2 sn = _gpu_two_sum(rh, (rl - 0.5 * rl * r2) + ts);
  highp vec2 p2 = _gpu_two_prod(rh, rh);
  highp float tc = (p2.x * p2.x) * (4.16666667e-2 + p2.x * (-1.38888889e-3 + p2.x * (2.48015873e-5 + p2.x * -2.75573192e-7)));
  highp vec2 c1 = _gpu_two_sum(1.0, -0.5 * p2.x);
  highp vec2 cs = _gpu_two_sum(c1.x, c1.y + (-0.5 * (p2.y + 2.0 * rh * rl) + tc));
  if (a.z == 0.0) return sn;
  if (a.z == 1.0) return cs;
  if (a.z == 2.0) return -sn;
  return -cs;
}

highp float _gpu_xfract(highp vec2 s, highp float ohi, highp float olo, highp float ok) {
  highp float sx = _gpu_opq(s.x);
  highp float sy = _gpu_opq(s.y);
  highp vec2 pe = _gpu_two_prod(sx, ohi);
  highp vec2 a = _gpu_two_sum(pe.x, -floor(pe.x));
  highp float small = a.y + (pe.y + sy * ohi + sx * olo);
  highp float h = _gpu_opq(a.x + small);
  if (h >= 1.0) {
    highp float d = _gpu_opq(a.x - 1.0) + small;
    h = d >= 0.0 ? d : 0.99999994;
  }
  if (h < 0.0) {
    h = _gpu_opq(h + 1.0);
    if (h >= 1.0) h = 0.99999994;
  }
  return ok > 0.5 ? h : uintBitsToFloat(0x7FC00000u);
}

highp float _gpu_xhash_sin(highp vec4 a, highp float ohi, highp float olo) {
  return _gpu_xfract(_gpu_xsin(a), ohi, olo, a.w);
}

highp float _gpu_xhash_cos(highp vec4 a, highp float ohi, highp float olo) {
  highp float q = a.z + 1.0;
  return _gpu_xfract(_gpu_xsin(vec4(a.x, a.y, q - 4.0 * floor(q / 4.0), a.w)), ohi, olo, a.w);
}
`,ri=new WeakMap;function Gl(e){let n=e.naming;if(n===void 0)return;let t=ri.get(n);return t===void 0&&(t={bounds:[],warnings:[]},ri.set(n,t)),t}function Ul(e,n){let t=e.naming===void 0?void 0:ri.get(e.naming),r=[],o=[];if(t===void 0)return{bounds:r,warnings:o};for(let{bound:i,text:s}of t.bounds)n.includes(s)&&!r.some(a=>a.operand===i.operand&&a.maxAbs===i.maxAbs)&&r.push({...i});for(let{warning:i,text:s}of t.warnings)n.includes(s)&&!o.some(a=>a.code===i.code&&a.value===i.value)&&o.push({...i});return{bounds:r,warnings:o}}var af=new Set(["Sin","Cos","Tan","Cot","Sec","Csc"]);function zr(e){let n=pt(e);return n===void 0?void 0:n.re}function Bl(e){if(!_(e))return!1;let n=t=>{let r=zr(t);return r!==void 0&&Math.abs(r)>=1e3};if(e.operator==="Multiply"&&e.ops.some(n))return!0;if(e.operator==="Divide"){let t=e.ops[1]===void 0?void 0:zr(e.ops[1]);if(t!==void 0&&t!==0&&Math.abs(t)<=.001)return!0}return e.operator==="Dot"&&e.ops.some(t=>(_(t,"List")||_(t,"Tuple"))&&t.ops.some(n))?!0:e.ops.some(Bl)}function Fr(e){let n=(t,r,o)=>{if(!_(t))return!1;if(af.has(t.operator))return o||t.ops.some(Bl)||t.ops.some(i=>n(i,!1,!1));if(!r)return t.ops.some(i=>n(i,!1,!1));switch(t.operator){case"Multiply":{let i=t.ops.some(s=>{let a=zr(s);return a!==void 0&&Math.abs(a)>=1e3});return t.ops.some(s=>n(s,!0,o||i))}case"Divide":{let i=t.ops[1]===void 0?void 0:zr(t.ops[1]),s=i!==void 0&&i!==0&&Math.abs(i)<=.001;return n(t.ops[0],!0,o||s)||t.ops[1]!==void 0&&n(t.ops[1],!1,!1)}case"Negate":case"Add":case"Subtract":case"Abs":return t.ops.some(i=>n(i,!0,o));default:return t.ops.some(i=>n(i,!1,!1))}};return n(e,!0,!1)}function Dl(e,n){return n===void 0||n.size===0||!_(e)?!1:n.has(e.operator)||e.ops.some(t=>Dl(t,n))}function jl(e,n){return C(e)?n.varsKeys?.has(e.symbol)===!0?!0:n.boundVars?.has(e.symbol)===!0?!1:e.value===void 0:!1}function oi(e,n){if(C(e))return e.type.matches("integer")?2**24:jl(e,n)?1/0:void 0;let t=o=>{if(B(o)){if(o.isComplex)return;let i=o.re;return Number.isInteger(i)&&Math.abs(i)<2**24?1:Number.isInteger(i*256)&&Math.abs(i)<2**16?256:void 0}if(C(o))return o.type.matches("integer")?1:void 0;if(_(o)){if(["Floor","Ceil","Round","Truncate"].includes(o.operator))return o.nops===1&&o.ops[0]!==void 0&&oi(o.ops[0],n)!==void 0?1:void 0;if(["Add","Subtract","Negate"].includes(o.operator)){let i=1;for(let s of o.ops){let a=t(s);if(a===void 0)return;a===256&&(i=256)}return i}if(o.operator==="Multiply")return o.ops.every(i=>t(i)===1)?1:void 0}},r=t(e);if(r!==void 0)return r===1?2**24:2**16}function lf(e,n,t){let r,o=e;if(_(e,"Multiply")&&e.nops===2){let[y,w]=B(e.ops[0])?[e.ops[0],e.ops[1]]:[e.ops[1],e.ops[0]];if(!B(y)||y.isComplex||!Number.isFinite(y.re)||Math.abs(y.re)>of)return;r=y,o=w}if(!_(o,"Sin")&&!_(o,"Cos")||f.isComplexValued(o))return;let i=o.ops[0];if(i===void 0)return;let s=[],a=[],u=[],l=y=>B(y)&&!y.isComplex&&Number.isFinite(y.re),c=y=>t(y)==="scalar"&&!f.isComplexValued(y),p=e.engine,d=(y,w,x)=>{if(!c(x))return!1;let $=oi(x,n);return $===void 0?!1:(s.push({k:y,pi:w,x,exactBelow:$}),!0)},h=y=>{let w=pt(y);if(w!==void 0)return a.push(w),!0;let x=f.piMultiple(y),$=x===void 0?void 0:pt(x);if($!==void 0)return u.push($),!0;let A=x!==void 0,E=x??y;if(_(E,"Negate")&&E.ops[0]!==void 0)return d(p.number(-1),A,E.ops[0]);if(_(E,"Multiply")){let z=E.ops.findIndex(l);if(z>=0){let N=E.ops.filter((M,P)=>P!==z);return N.length!==1?!1:d(E.ops[z],A,N[0])}}if(!A&&_(E,"Dot")&&E.nops===2){let[z,N]=E.ops,[M,P]=_(N,"List")||_(N,"Tuple")?[z,N]:[N,z];if(!(_(P,"List")||_(P,"Tuple"))||!P.ops.every(l)||t(M)!==P.nops||M.isPure===!1)return!1;let G=k=>{if(C(M))return jl(M,n)?1/0:void 0;if(_(M,"List")||_(M,"Tuple")){let R=M.ops[k];return R===void 0?void 0:oi(R,n)}};for(let k=0;k<P.nops;k++){if(P.ops[k].re===0)continue;let R=G(k);if(R===void 0)return!1;s.push({k:P.ops[k],pi:!1,x:{vector:M,index:k},exactBelow:R})}return!0}return d(p.One,A,E)};if((_(i,"Add")?i.ops:[i]).every(h)&&!(s.length===0||s.length>4))return{outer:r,trig:o.operator,terms:s,literals:a,piFactors:u}}function Il(e,n){if(e===void 0)return{hi:1,lo:0,residual:0};let t=se.precision;try{se.precision=50;let r=Lt(e)??new se(e.re);n&&(r=r.mul(se.PI));let o=Math.fround(r.toNumber()),i=r.sub(new se(o)),s=Math.fround(i.toNumber()),a=Math.abs(i.sub(new se(s)).toNumber());return{hi:o,lo:s,residual:a}}finally{se.precision=t}}function uf(e){if(!Number.isFinite(e))return e;let n=Math.fround(e);return n>e&&(n=Math.fround(n*(1-2**-24))),n}var pf=["x","y","z","w"];function Nr(e,n,t,r,o,i,s){if(Dl(n,o.foldExcludedOps)||!Fr(n))return;let a=x=>{let $=s();return Gl(o)?.warnings.push({text:$,warning:{code:"float32-unsafe-argument",kind:"correctness",value:n.toString(),message:`The operand of \`${e}\` amplifies a trigonometric value by a constant of magnitude 1000 or more, so its float32 value on ${o.language??"a shader"} can have no relation to the exact value (a sine hash such as \`fract(43758.5\xB7sin(12.9898\xB7x))\`). ${x}`}}),$},u=o.language==="glsl"&&t&&i(n)==="scalar"?lf(n,o,i):void 0;if(u===void 0)return a(o.language==="glsl"?"The exact form covers `Mod(O\xB7sin(\u03A3 K\xB7x + c), 1)` (or `cos`, or a `Dot` with a list of numbers) with |O| \u2264 50000 and each x an input or an integer-valued expression.":"This target has no exact form.");let l;if(u.literals.length+u.piFactors.length>0&&(l=ii(u.literals,u.piFactors,x=>{let $=se.PI.div(2),A=x.div($).round(),E=x.sub(A.mul($)),z=A.sub(A.div(4).floor().mul(4)).toNumber(),N=Math.fround(E.toNumber()),M=Math.fround(E.sub(new se(N)).toNumber());return{hi:N,lo:M,q:z}}),l===void 0))return a("The constant term of the trigonometric argument is too large to reduce exactly.");let c=n.engine,p=Il(u.outer,!1),d=[],h=[];for(let x of u.terms){let $=Il(x.k,x.pi),A,E;if("vector"in x.x){let N=x.x.vector,M=_(N,"List")||_(N,"Tuple")?N.ops[x.x.index]:void 0;A=M!==void 0?r(M):`(${r(N)}).${pf[x.x.index]}`,E=c.function("At",[x.x.vector,c.number(x.x.index+1)]).toString()}else A=r(x.x),E=x.x.toString();let z=uf(Math.min(rf/Math.abs($.hi),$.residual>0?sf/(Math.abs(p.hi)*$.residual):1/0,x.exactBelow));d.push(`_gpu_xred(${A}, ${q($.hi,"glsl")}, ${q($.lo,"glsl")}, ${q(z,"glsl")})`),h.push({operand:E,maxAbs:z})}l!==void 0&&(l.hi!==0||l.lo!==0||l.q!==0)&&d.push(`vec4(${q(l.hi,"glsl")}, ${q(l.lo,"glsl")}, ${q(l.q,"glsl")}, 1.0)`);let g=d.reduce((x,$)=>`_gpu_xred_add(${x}, ${$})`),y=`_gpu_xhash_${u.trig==="Sin"?"sin":"cos"}(${g}, ${q(p.hi,"glsl")}, ${q(p.lo,"glsl")})`,w=Gl(o);for(let x of h)w?.bounds.push({bound:x,text:y});return y}var Fe={__proto__:null,Add:["+",11],Negate:["-",14],Subtract:["-",11],Multiply:["*",12],Divide:["/",13],Equal:["==",8],NotEqual:["!=",8],LessEqual:["<=",9],GreaterEqual:[">=",9],Less:["<",9],Greater:[">",9],And:["&&",4],Or:["||",3],Not:["!",14]};function ne(){return"vec2"}function Ne(){return"vec3"}function zt(e){let n=e.hoist?.unit;if(n!==void 0)return _(n,"Assign")?n.ops[1]:_(n,"Declare")?f.declareValueOperand(n.ops):n}var Vl=["sin","cos","sign"];function ve(e,n,t){return ct(e,n(e),t)}function ct(e,n,t){return _(e)?(t?.operators?.(e.operator)??Fe[e.operator])===void 0?n:`(${n})`:n}function le(e){return en(NaN,e?.language)}var Pn=new WeakSet,Ft=new WeakSet;function Gr(){return"atan"}var si={Less:"lessThan",LessEqual:"lessThanEqual",Greater:"greaterThan",GreaterEqual:"greaterThanEqual",Equal:"equal",NotEqual:"notEqual"};function Ir(e){return`bvec${e}`}function Ve(e){return`vec${e}`}function ee(e){return Y(e.type.type)}var pn=/^(?:[iub]?vec[234]|mat[234]|(?:float|int|uint|bool)\s*\[)/,ql=/^(?:[iub]?vec[234]\s*\[)/,Hl=/\b(?:[iub]?vec[234]|mat[234]|(?:float|int|uint|bool)\s*\[)/;function Or(e){let n=0;for(let t of e)if(t==="("||t==="[")n++;else if(t===")"||t==="]")n--;else if(t===" "&&n===0)return`(${e})`;return e}function be(e){let n=e.trim();return/^[A-Za-z_]\w*(?:\.\w+|\[\d+\])*$/.test(n)||/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(n)}var Wl={__proto__:null,True:"true",False:"false",Pi:"3.14159265359",ExponentialE:"2.71828182846",GoldenRatio:"1.61803398875",CatalanConstant:"0.91596559417",EulerGamma:"0.57721566490"};function ue(e,n){return q(e,n)}function nn(){return"float"}function ie(e){return`vec${e}`}function ai(e){let n=new Set,t=r=>{if(!n.has(r)){if(n.add(r),C(r))return cn(r.type.type)!==void 0&&f.localShapeFrameOf(r.symbol)===void 0?r:void 0;if(!(!_(r)||r.operator==="Function"))for(let o of r.ops){let i=t(o);if(i!==void 0)return i}}};return t(e)}function cn(e){return f.pointOrPointListUnion(e)}function An(e){return e!==void 0&&e.width===1&&(e.element==="i"||e.element==="u")}function tn(e){let n=di(e);if(/^(float|double)$/.test(n))return{element:"f",width:1};if(n==="int")return{element:"i",width:1};if(n==="uint")return{element:"u",width:1};if(n==="bool")return{element:"b",width:1};let t=/^([ibu]?)vec([234])$/.exec(n);if(t)return{element:t[1]||"f",width:Number(t[2])}}function Nt(e){return e.width===1?e.element==="b"?"bool":e.element==="i"?"int":e.element==="u"?"uint":nn():e.element==="f"?ie(e.width):`${e.element}vec${e.width}`}var Yl=new WeakMap;function li(e){let n=new Map,t=new Map;for(let{name:r,type:o}of e){let i=tn(o);t.set(r,{spelling:o.trim(),value:i,ref:r}),n.set(r,i===void 0?f.LOCAL_UNSHAPED:i.width>=2?i.width:i.element==="b"?f.LOCAL_BOOLEAN:f.LOCAL_SCALAR)}return Yl.set(n,t),n}function Ae(e){if(!C(e))return;let n=f.localShapeFrameOf(e.symbol);if(n!==void 0)return Yl.get(n)?.get(e.symbol)}function ui(e,n,t=new Set){if(!(!_(e)||t.has(e))){if(t.add(e),e.operator==="Assign"&&C(e.ops[0])&&n.has(e.ops[0].symbol))return e.ops[0].symbol;for(let r of e.ops){let o=ui(r,n,t);if(o!==void 0)return o}}}function pi(e,n){if(n.length===0)return e;let t=new Map(n.map(r=>[r.name,An(tn(r.type))?`float(${r.name})`:r.name]));return{...e,var:r=>t.get(r)??e.var(r),...f.withBoundScope(e,[...t.keys()])}}function Vn(e){return fi(e)===nn()}function Mr(e){if(typeof e=="string"||e.kind!=="list")return;let n=Y(e.elements);if(typeof n=="string"||n.kind!=="tuple")return;let t=n.elements.length;if(t<2||t>4)return{decline:`the points of the base have ${t} coordinates, and a shader vector holds 2 to 4`};for(let r=0;r<t;r++)if(!Vn(n.elements[r].type))return{decline:`coordinate ${r+1} of the points of the base (type \`${Pe(n.elements[r].type)}\`) is not a REAL scalar \u2014 a shader vector's components are single floats`};return t}function ci(e){let n=/^vec([234])/.exec(e);return n===null?1:Number(n[1])}function ft(e){if(e=Y(e),typeof e!="string"){if(e.kind==="tuple")return e.elements.every(n=>Vn(n.type))?e.elements.length:void 0;if(e.kind==="list"&&e.dimensions?.length===1)return Vn(e.elements)?e.dimensions[0]:void 0}}function fi(e){if(e===void 0||e==="unknown"||e==="any")return nn();if(e=Y(e),D(e,"color"))return ie(3);if(ze(e))return ie(2);if(D(e,"boolean"))return"bool";if(D(e,"number"))return nn();let n=ft(e);if(n!==void 0&&n>=2&&n<=4)return ie(n)}function pe(e,n){let t=Ae(e);if(t!==void 0)return An(t.value)?nn():t.value&&Nt(t.value);let r=kr(n?.fragmentScope,e);if(r!==void 0){let i=r.representation;if(i==="int"||i==="uint")return nn();if(i==="float"||i==="bool"||/^vec[234]$/.test(i))return i}if(C(e)&&f.isLocalBoolean(e.symbol))return"bool";if(ai(e)!==void 0)return;if((!C(e)||!f.localShapeFrameOf(e.symbol))&&(D(ee(e),"color")||vr(e)!==void 0))return ie(3);if(f.isComplexValued(e))return ie(2);let o=f.aggregateComponentCount(e);if(o!==void 0)return o<2||o>4?void 0:cf(e)?ie(o):void 0;if(!f.isNonScalarShape(e))return e.type.matches("boolean")?"bool":nn()}function cf(e){if(_(e,"Tuple")||_(e,"List"))return e.ops.every(t=>Vn(ee(t)));let n=ee(e);return typeof n!="string"&&(n.kind==="tuple"||n.kind==="list")?ft(n)!==void 0:!0}var Ur=new WeakMap,Kl=["strict"];function di(e){return e.trim().replace(/^((lowp|mediump|highp|flat|smooth|noperspective|centroid)\s+)+/,"")}function Xl(e){let n=di(e);if(/^d?mat[234](x[234])?$/.test(n))return{kind:"matrix",spelling:n};if(/\[\s*\d*\s*\]$/.test(n))return{kind:"array",spelling:n}}function mi(e){let n=di(e);return/^(f16|f32|f64|i32|u32)$/.test(n)||/^vec[234]([fhiu]|\s*<.*>)$/.test(n)||/^mat[234]x[234]([fh]|\s*<.*>)$/.test(n)||/^array\s*<.*>$/.test(n)}var Zl=new Set(["Add","Subtract","Multiply","Divide","Negate","Power","Square","Sqrt","Root","Exp","Ln","Log","Abs","Sign","Floor","Ceil","Round","Truncate","Fract","Mod","Sin","Cos","Tan","Arcsin","Arccos","Arctan","Sinh","Cosh","Tanh"]),Jl=new Set(["Less","LessEqual","Greater","GreaterEqual","Equal","NotEqual","And","Or","Not"]);function Ql(e,n){let t=n.find(c=>c.name===e);if(t!==void 0)return{type:tn(t.type)};let r=/^(.+)\.([a-z]{1,4})$/.exec(e),o=r===null?void 0:n.find(c=>c.name===r[1]);if(r===null||o===void 0){let c=n.length===0?"This shader declares no outputs.":`The outputs are ${n.map(d=>`"${d.name}" (\`${d.type}\`)`).join(", ")}.`,p=n.find(d=>(tn(d.type)?.width??1)>=2);return{error:`"${e}" is not an output of the shader. A body statement must assign a declared output, or components of a vector output${p===void 0?"":` (\`${p.name}.x\`)`}. ${c}`}}let i=r[2],s=tn(o.type),a=c=>({error:`"${e}" selects the components "${i}" of the output "${o.name}" (\`${o.type}\`), but ${c}.`});if(s===void 0||s.width<2)return a("the output is not a vector");let u=["xyzw","rgba","stpq"],l=u.find(c=>[...i].every(p=>c.includes(p)));return l===void 0?a(`these letters are not all from one of the sets ${u.map(c=>`"${c}"`).join(", ")}`):[...i].some(c=>l.indexOf(c)>=s.width)?a(`the vector has only ${s.width} components`):new Set(i).size!==i.length?a("an assignment cannot write a component more than once"):{type:{element:s.element,width:i.length}}}function hi(e,n,t){return e.width!==n.width?!1:e.element===n.element?!0:t===void 0?!1:n.element==="f"?e.element==="i"||e.element==="u":t>=400&&e.element==="i"&&n.element==="u"}function Br(e){let n=ee(e);return n==="tuple"||typeof n!="string"&&(n.kind==="tuple"||n.kind==="union")?!1:e.type.matches("indexed_collection<any>")}function ff(e,n,t){if(!_(e,"PointList"))return{decline:"the operand is not a symbolic `PointList` application, and only that shape has a statically known point count"};let r=e.ops;if(n>=r.length)return{decline:`the points have arity ${r.length}, so there is no coordinate ${n+1}`};let o;for(let l=0;l<r.length;l++){let c=r[l];if(Br(c)){let p=f.aggregateComponentCount(c);if(p===void 0)return{decline:`source component ${l+1} (type \`${c.type.toString()}\`) has no statically known length, and a shader vector must have one`};if(p<2||p>4)return{decline:`source component ${l+1} has ${p} elements, and a shader vector holds 2 to 4`};o=o===void 0?p:Math.min(o,p)}else if(!D(ee(c),"number"))return{decline:`component ${l+1} (type \`${c.type.toString()}\`) is neither a list source nor a provably scalar numeric slot, so it has no \`vecN\` broadcast`}}if(o===void 0)return{decline:"no component is a list source, so this is not a point LIST"};for(let l=0;l<r.length;l++)if(l!==n&&!r[l].isPure)return{decline:`component ${l+1} is impure, and the projection would discard it unevaluated`};let i=r[n];if(!Br(i))return`${`vec${o}`}(${t(i)})`;let s=f.aggregateComponentCount(i),a=t(i);if(s===o)return a;let u="xyzw".slice(0,o);return be(a)?`${a}.${u}`:`(${a}).${u}`}function dt(e,n){return new Error(`Could not compile \`${e}\`: its value has the type \`${n.type.toString()}\`, which has no shader type, and the calls of the functions that give such a value would be written out more than ${ml} times. If the value reads a symbol that can be a point or a list of points, declare that symbol with the point type (\`tuple<real, real>\`).`)}function Dr(e,n){let t=n!==void 0&&n>=2&&n<=4?n:2;return`ce.declare('${e}', 'tuple<${Array(t).fill("real").join(", ")}>')`}function gi(e,n,t,r,o=!1){let i=Dr(n,r.arity);return`Could not compile \`${e}\`: "${n}" has the type \`${t.type.toString()}\`, which admits a point and a list of points. A shader value cannot be both: a point is a vector (\`vec2\`, \`vec3\`, \`vec4\`) and a list of points is an array. `+(o?`Declare "${n}" as a point (\`${i}\`).`:`Declare "${n}" as a point (\`${i}\`), or assign a point to "${n}" and do not map it with \`vars\`, so that the shader uses its value.`)}function df(e,n){return n.boundVars?.has(e)===!0?!0:n.varsKeys?.has(e)!==!0&&n.var(e)!==void 0}function jr(e,n,t,r){let o=n==="x"?0:n==="y"?1:2,i=`Point${n.toUpperCase()}`,s=C(e)?cn(e.type.type):void 0;if(s!==void 0&&C(e)){let l=df(e.symbol,r),c=f.localShapeFrameOf(e.symbol)?.get(e.symbol);if(l&&c!==void 0&&c>=2&&c<=4){if(c<=o)throw new Error(`Could not compile \`${i}\`: the point has arity ${c} \u2014 no ${["first","second","third"][o]} coordinate.`);return Tn(t(e),n)}throw new Error(gi(i,e.symbol,e,s,l))}if(!C(e)&&cn(e.type.type)!==void 0)throw new Error(`Could not compile \`${i}\`: \`${e.toString()}\` has the type \`${e.type.toString()}\`, which admits a point and a list of points. A shader value cannot be both: a point is a vector (\`vec2\`, \`vec3\`, \`vec4\`) and a list of points is an array. Make the value a point (a tuple such as \`tuple<real, real>\`).`);let a=ee(e),u=typeof a!="string"?a.kind==="tuple"?a.elements.length:a.kind==="list"&&a.dimensions?.length===1&&a.dimensions[0]>=2&&a.dimensions[0]<=4&&a.elements!==void 0&&D(a.elements,"number")?a.dimensions[0]:void 0:void 0;if(u===void 0&&e.type.matches("indexed_collection<any>")){let l=ff(e,o,t);if(typeof l=="string")return l;throw new Error(`Could not compile \`Point${n.toUpperCase()}\`: a list of points has no GPU lowering (a point must be a single vec2/vec3/vec4): ${l.decline}.`)}if(u!==void 0&&u<=o)throw new Error(`Could not compile \`Point${n.toUpperCase()}\`: the point has arity ${u} \u2014 no ${["first","second","third"][o]} coordinate.`);return Tn(t(e),n)}function Tn(e,n){let t=e.trim();if(t===en(NaN))return n.length===1?t:`vec${n.length}(${t})`;if(be(t))return`${t}.${n}`;let r=/^[A-Za-z_]\w*\(/.exec(t);if(r!==null&&t.endsWith(")")){let o=0,i=!0;for(let s=r[0].length-1;s<t.length;s++)if(t[s]==="(")o+=1;else if(t[s]===")"&&(o-=1,o===0&&s!==t.length-1)){i=!1;break}if(i)return`${t}.${n}`}return`(${t}).${n}`}var mf=new Set(["attribute","const","uniform","varying","buffer","shared","coherent","volatile","restrict","readonly","writeonly","layout","centroid","flat","smooth","noperspective","patch","sample","in","out","inout","precision","invariant","precise","subroutine","lowp","mediump","highp","struct","break","continue","do","for","while","switch","case","default","if","else","discard","return","void","bool","int","uint","float","double","vec2","vec3","vec4","dvec2","dvec3","dvec4","bvec2","bvec3","bvec4","ivec2","ivec3","ivec4","uvec2","uvec3","uvec4","mat2","mat3","mat4","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","dmat2","dmat3","dmat4","sampler2D","sampler3D","samplerCube","sampler2DArray","sampler2DShadow","samplerCubeShadow","isampler2D","usampler2D","atomic_uint","image2D","true","false","filter","texture","asm","class","union","enum","typedef","template","this","packed","goto","inline","noinline","public","static","extern","external","interface","long","short","half","fixed","unsigned","superp","input","output","hvec2","hvec3","hvec4","fvec2","fvec3","fvec4","sizeof","cast","namespace","using"]);function eu(e){return e==="glsl"?mf:new Set}function Vr(e,n){return eu(n).has(e)}function Te(e,n){if(eu(n).has(e))throw new Error(`"${e}" is a reserved word in ${n??"this shader language"} and cannot be used as a variable name. Rename it before compiling to a GPU target (fail closed, D6).`);return e}var nu={vertex:new Set(["gl_VertexID","gl_InstanceID","gl_Position","gl_PointSize","gl_ClipDistance","gl_DepthRange"]),fragment:new Set(["gl_FragCoord","gl_FrontFacing","gl_PointCoord","gl_FragDepth","gl_PrimitiveID","gl_SampleID","gl_SamplePosition","gl_Layer","gl_ViewportIndex","gl_ClipDistance","gl_DepthRange"]),compute:new Set(["gl_NumWorkGroups","gl_WorkGroupID","gl_LocalInvocationID","gl_GlobalInvocationID","gl_LocalInvocationIndex","gl_WorkGroupSize"])},tu={vertex:[{name:"gl_Position",type:"vec4"},{name:"gl_PointSize",type:"float"}],fragment:[{name:"gl_FragDepth",type:"float"}]},ru={vertex:{gl_VertexID:"int",gl_InstanceID:"int",gl_Position:"vec4",gl_PointSize:"float",gl_ClipDistance:"float[]"},fragment:{gl_FragCoord:"vec4",gl_FrontFacing:"bool",gl_PointCoord:"vec2",gl_FragDepth:"float",gl_PrimitiveID:"int",gl_SampleID:"int",gl_SamplePosition:"vec2",gl_Layer:"int",gl_ViewportIndex:"int",gl_ClipDistance:"float[]"}};function yi(e,n,t){let r=ul(e,n);return`${ne()}(${q(r.re,t?.language)}, ${q(r.im,t?.language)})`}function bi(e,n,t){if(_(e)&&["Rgb","Hsv","Hsl","Tuple"].includes(e.operator)&&!Je(e,t.cse?.harvestOptions)&&!t.foldExcludedOps?.has(e.operator)){let r="_gpu_srgb_to_oklch(";if(n.startsWith(r)&&n.endsWith(")"))return`_gpu_srgb_roundtrip(${n.slice(r.length,-1)})`}return`_gpu_oklch_to_srgb(${n})`}function me(e,n){let t=n[0]?.engine;if(t===void 0)return!1;try{let r=t.function(e,[...n],{form:"structural"}).type;return ze(Lo(r.type))}catch{return!1}}function qr(e,n){if(Cr(e,n)==="complex")throw new Error(`Could not compile \`${e}\`: its value is not real for these operands, and the shader targets have no complex lane for it`)}function ge(e,n){return f.isComplexValued(e)?n(e):(Rn(void 0,e),`${ne()}(${n(e)}, 0.0)`)}function _i(e){return e=Y(e),ze(Lo(e))?!1:Le(e,"number")}function Gt(e){let n=Y(e);if(n==="tuple")return"this type does not give the number or the types of the elements";if(typeof n=="string"||n.kind!=="tuple")return;let t=n.elements.length;if(t<2)return`a tuple of ${t} element${t===1?"":"s"} has no shader type (there is no \`vec1\`)`;if(!(t<=4&&n.elements.every(r=>D(r.type,"boolean")))){for(let r=0;r<t;r++)if(!_i(n.elements[r].type))return`element ${r+1} of the tuple (type \`${Pe(n.elements[r].type)}\`) is not a real scalar \u2014 a shader vector or array of floats holds only real scalars`}}function hf(e){if(_(e,"List")||_(e,"Tuple"))return e.ops.every(t=>!f.isNonScalarShape(t));if(f.isComplexValued(e))return!0;if(C(e)&&f.localShapeFrameOf(e.symbol)!==void 0){let t=Ae(e);return t?.value===void 0||t.value.element==="f"}let n=f.withoutAbsentArms(ee(e));return typeof n=="string"?!0:n.kind==="tuple"?n.elements.every(t=>_i(t.type)):n.kind==="list"&&n.dimensions?.length===1?_i(n.elements):!1}function Ie(e){let n=f.vectorComponentCount(e);if(n!==void 0)return hf(e)?n:void 0}function Hr(e){if(e.length===0)return;let n;for(let t of e){if(!f.isNonScalarShape(t))return;let r=f.aggregateComponentCount(t);if(r===void 0||r<2||r>4||n!==void 0&&r!==n)return;n=r}return n}function kn(e,n){if(e.length===0)throw new Error(`Could not compile \`${n}\`: an empty tuple/list has no GPU lowering \u2014 GLSL has no zero-length array type.`);for(let[t,r]of e.entries()){if(!f.isNonScalarShape(r))continue;let o=f.aggregateComponentCount(r),i=o===void 0?"a matrix/tensor value":`${o} component${o===1?"":"s"} \u2014 a complex value or a nested tuple/list`;throw new Error(`Could not compile \`${n}\`: element ${t+1} (\`${r.toString()}\`) is itself vector-valued (${i}) and has no GPU lowering; a ${n} constructor takes scalar components.`)}}function It(e,n){let t=Ie(e);return t===void 0?le(n):`${`vec${t}`}(${le(n)})`}function xi(e,n){let t=/_gpu_[A-Za-z0-9_]+\s*\(/.exec(e);if(t!==null)return`it calls the preamble helper \`${t[0].slice(0,-1).trim()}\`, which is declared with scalar float parameters.`;if(n!==void 0){if(/\?|[<>]=?|[=!]=/.test(e))return"it branches on a comparison, which a shader requires to be a scalar bool.";if(!e.includes(n))return"it does not use the operand at all, so its result is a scalar."}}function Wr(e,n,t){if(e===null)return;let r=f.piMultiple(e);return r!==void 0&&j(r)==="scalar"?qe(je(e,r,su,t),n,!1,void 0,t):void 0}var su={name:"the angle in half-turns",operators:["Multiply","Divide","Negate","Add","Power","Sqrt","Root"],forbiddenSymbols:["Pi","ImaginaryUnit"]},gf={name:"the reduction of the constant term of a periodic argument",operators:["Add","Multiply"]};function fn(e,n,t){if(e===null)return;let r=f.imaginaryPiMultiple(e);return r!==void 0&&j(r)==="scalar"?qe(je(e,r,su,t),n,!1,void 0,t):void 0}function qe(e,n,t,r,o){let i=_f(e,n,t,r);return je(e,i,gf,o??r)}function _f(e,n,t,r){if(f.isComplexValued(e)||j(e)!=="scalar")return e;if(_(e,"Multiply")&&e.nops===2){let[o,i]=B(e.ops[0])?[e.ops[0],e.ops[1]]:[e.ops[1],e.ops[0]];if(!B(o)||!_(i,"Add"))return e;let s=ou(i,n,t,o,r);return s===i?e:e.engine.function("Multiply",[o,s])}return _(e,"Add")?ou(e,n,t,void 0,r):e}function yf(e,n){if(!_(e)||n.constantFold===!1||e.isPure!==!0||e.unknowns.length>0)return;let t=e.engine;if(!e.symbols.every(a=>t.symbol(a).isConstant)||f.reachesExcludedName(e,n))return;let r=a=>B(a)&&!a.isComplex&&a.isFinite===!0,o=e.evaluate();if(r(o)&&B(o)&&o.isExact)return o;let i=e.N();if(!r(i))return;let s=Math.max(1,Math.ceil(Math.log10(Math.abs(i.re)+1)));return t.precision>=s+12?i:void 0}function ou(e,n,t,r,o){if(!_(e,"Add"))return e;let i=[],s=[],a=[];for(let c of e.ops){let p=pt(c);if(p!==void 0){i.push(p);continue}if(t){let h=f.piMultiple(c),g=h===void 0?void 0:pt(h);if(g!==void 0){s.push(g);continue}}let d=o===void 0?void 0:yf(c,o);if(d!==void 0){i.push(d);continue}a.push(c)}if(i.length+s.length===0)return e;let u=ii(i,s,c=>{let p=t?se.PI.mul(n):new se(n);if(r!==void 0){let d=Lt(r);if(d===void 0||d.isZero())return;p=p.div(d.abs())}if(!(c.abs().cmp(p.div(2))<=0))return c.sub(c.div(p).round().mul(p)).toNumber()});if(u===void 0)return e;let l=e.engine;return u===0?a.length===0?l.Zero:a.length===1?a[0]:l.function("Add",a):l.function("Add",[...a,l.number(u)])}function j(e){if(_(e,"Normalize")&&e.nops===1)return j(e.op1);if(f.isComplexValued(e)||!f.isNonScalarShape(e)&&!bf(e))return"scalar";let n=Ie(e);if(n!==void 0)return n;if((_(e,"List")||_(e,"Tuple"))&&Hr(e.ops)!==void 0)return"array";if(_(e,"Matrix"))return"matrix";let t=ee(e);return typeof t!="string"&&t.kind==="list"&&(t.dimensions?.length??0)>=2?"matrix":"array"}function bf(e){let n=ee(e);return D(n,wn)&&!D(n,"string")}function Ge(e){return typeof e=="number"?`vec${e}`:e}function wi(e,n){if(e==null||n===null||n===void 0)return;let t=j(e),r=j(n);if(typeof t=="number")return r==="scalar"||r===t?t:void 0;if(typeof r=="number")return t==="scalar"?r:void 0}function $i(e,n,t){return n===void 0||j(e)!=="scalar"?t(e):`${Ve(n)}(${t(e)})`}function vi(e){if(_(e,"Matrix")){let t=e.ops[0];if(!_(t)||t.nops===0)return;let r=t.ops,o=_(r[0])?r[0].nops:0;return o>0&&r.every(i=>_(i)&&i.nops===o)?[r.length,o]:void 0}let n=ee(e);if(typeof n!="string"&&n.kind==="list"){let t=n.dimensions;if(t?.length===2&&t[0]>0&&t[1]>0)return[t[0],t[1]]}}function Ee(e){let n=e.trim(),t=/^([A-Za-z_]\w*(?:\s*\[\d+\])?)\s*\(/.exec(n);if(t===null)return;let r=0,o=t[0].length,i=[];for(let s=t[0].length-1;s<n.length;s++)if(n[s]==="(")++r===1&&(o=s+1);else if(n[s]===","&&r===1)i.push(n.slice(o,s).trim()),o=s+1;else if(n[s]===")"&&--r===0){if(s!==n.length-1)return;let a=n.slice(o,s).trim();return(a!==""||i.length>0)&&i.push(a),{callee:t[1].trim(),argCount:i.length,operands:i}}}function xf(e,n){let t=new RegExp(`(?:^|\\n)[^\\S\\n]*(?:fn[^\\S\\n]+|[A-Za-z_]\\w*(?:\\[\\d+\\])?[^\\S\\n]+)${e}[^\\S\\n]*\\(([^)]*)\\)`).exec(n);return t===null?!1:!/[iub]?vec[234]|mat[234]|array\s*<|\[\s*\d+\s*\]/.test(t[1])}var wf=["dot","length","distance","determinant","any","all"];function $f(e){let n=new RegExp(`\\b(?:${wf.join("|")})\\s*\\(`,"g"),t="",r=0,o;for(;(o=n.exec(e))!==null;){let i=0,s=-1;for(let a=o.index+o[0].length-1;a<e.length;a++)if(e[a]==="(")i++;else if(e[a]===")"&&--i===0){s=a;break}if(s<0)break;t+=e.slice(r,o.index)+"0.0",r=s+1,n.lastIndex=r}return t+e.slice(r)}function iu(e){let n=/\b([iub]?vec[234][fhiu]?)\s*\(/g,t;for(;(t=n.exec(e))!==null;){let r=0;for(let o=t.index+t[0].length-1;o<e.length;o++)if(e[o]==="(")r++;else if(e[o]===")"&&--r===0){let i=$f(e.slice(t.index+t[0].length,o)),s=/\b(?:[iub]?vec[234]|mat[234]|float\s*\[)/.exec(i);if(s!==null)return`it packs its operands into a \`${t[1]}\` constructor, which has no room for the aggregate \`${s[0].trim()}\` value standing in each slot.`;break}}}function au(e){return e?.gpuShapeRules}var lu=new WeakMap;function uu(e){let n=e[0];return e.length===1&&n!==void 0&&(_(n,"Tuple")||_(n,"PointList"))&&Pt(n)}function ce(e,n=()=>!0){return typeof e=="function"&&lu.set(e,n),e}var pu=new WeakMap;function Ln(e,n){return typeof e=="function"&&pu.set(e,n),e}function Ot(e,n,t){return(r,o)=>{let i=r[n];if(r.length!==2||i===null||i===void 0||X(i)!==t)return;let s=Ee(o);if(!(s?.callee!==e||s.argCount!==1))return new Set([n])}}var Ei=e=>e.length===1&&_(e[0],"List"),Ci=e=>e.length===1;function ht(e){let n=[...e].sort((t,r)=>t-r).map(t=>`${t+1}`);return n.length===0?"nowhere":n.length===1?`in argument ${n[0]}`:`in arguments ${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}function cu(e,n){let t=Ee(e);return t===void 0?!1:pn.test(t.callee)?!ql.test(t.callee):n.has(t.callee)?t.operands.some(r=>cu(r,n)):!1}function vf(e){if(e===void 0)return;let n=Ee(e);if(n===void 0)return;let t=/^vec([234])f?$/.exec(n.callee);return t===null?void 0:Number(t[1])}function fu(e,n){let t=Ee(e);if(t===void 0)return;let r=n.get(t.callee);if(r!==void 0){let o=t.operands.map(i=>cu(i,n));if(o.some(i=>i)){let i=o.findIndex((s,a)=>!s&&!r.has(a));if(i>=0)return`the shader builtin \`${t.callee}\` takes a scalar only ${ht(r)}, but the emitted call \`${e.trim()}\` has a scalar in argument ${i+1}, where the overload requires the \`vecN\` genType; the scalar is not promoted to a vector.`}}for(let o of t.operands){let i=fu(o,n);if(i!==void 0)return i}}var Ef=new Set(["Variance","Hypot","Arctan2","Haversine","GammaLn","Beta","Erf","Erfc","ErfInv","Heaviside","Sinc","FresnelC","FresnelS","BesselJ","Arccot","Arcsch","InverseHaversine","Gamma","Factorial","Digamma","Trigamma","PolyGamma","Zeta","HurwitzZeta","LerchPhi","PolyLog","Sign","Smoothstep"]);function du(e,n){return f.REAL_ONLY_BY_DEFINITION.has(e)||Ef.has(e)||f.stringHelperIsRealOnly(e,n)}function Si(e,n,t,r,o,i){let s=n.map(j);if(typeof i=="function"){if(lu.get(i)?.(n)===!0)return;let z=pu.get(i)?.(n,t);if(z!==void 0&&z.size>0)return Si(e,n.filter((N,M)=>!z.has(M)),t,r,o)}let a=E=>{throw new Error(`Could not compile \`${e}\`: ${E}`)},u=Ee(t),l=()=>{if(u===void 0||u.argCount!==n.length)return;let E=r.vectorOnlySlots.get(u.callee);if(E===void 0)return;let z=s.findIndex((N,M)=>E.has(M)&&N==="scalar");z>=0&&a(`the shader builtin \`${u.callee}\` is declared over the \`vecN\` genType ${ht(E)} in this language \u2014 it has no scalar overload there \u2014 but argument ${z+1} lowers to a scalar; the scalar is not promoted to a vector.`)};if(s.every(E=>E==="scalar")){l();return}let c=new Set(s.filter(E=>typeof E=="number")),p=()=>{c.size>1&&a(`its operands lower to shader vectors of different widths (${[...c].map(E=>`vec${E}`).join(", ")}); the componentwise builtins and operators require ONE genType.`)},d=s.includes("matrix"),h=s.includes("array"),g=u;if(g===void 0){let E=Fe[e]?.[0];if(E===void 0||!/^[-+*/]$/.test(E)){if(be(t))return;(h||d)&&a(`the compound shader lowering \`${t}\` is built from the genType-polymorphic builtins and operators, which have no ${d?"`matN`":"array"} reading, so the operand shapes (${s.map(Ge).join(", ")}) have no lowering.`),p();let G=iu(t);G!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(Ge).join(", ")}) \u2014 ${G}`);return}if(h&&a("an operand lowers to a shader ARRAY (`float[N]`), which has no arithmetic operators \u2014 only scalars, `vecN` and `matN` values do."),!d){p();return}let z=[];for(let G=0;G<s.length;G++){let k=s[G];if(k!=="matrix"){z.push(k);continue}let R=vi(n[G]);if(R!==void 0&&R[1]===1&&R[0]>=2&&R[0]<=4&&_(n[G],"Matrix")){z.push(R[0]);continue}(R===void 0||R[0]!==R[1]||R[0]<2||R[0]>4)&&a(`its operand \`${n[G].toString()}\` lowers to a matrix with no native square \`matN\` (N = 2\u20134) shader type`+(R!==void 0?` (its dimensions are ${R[0]}\xD7${R[1]})`:" (its dimensions are not statically known)")+`, so the shader operator \`${E}\` has no overload for it.`),z.push({mat:R[0]})}let N=G=>typeof G=="number"?`vec${G}`:G==="scalar"?G:`mat${G.mat}`,M=`(${z.map(N).join(", ")})`,P=new Set(z.flatMap(G=>G==="scalar"?[]:[typeof G=="number"?G:G.mat]));if(!z.some(G=>typeof G=="object")){P.size>1&&a(`its operands lower to shader vectors of different widths ${M}; the componentwise operators require ONE genType.`);return}if(n.length===1){r.matrixNegate||a(`the shader unary \`-\` is declared over scalars and \`vecN\` only in this language; it has no overload for the ${N(z[0])} operand.`);return}if(E!=="*"){z.some(G=>typeof G=="number")&&a(`a \`matN\` and a \`vecN\` operand combine only under \`*\` (matrix-vector product), not \`${E}\`.`),r.matrixArithmetic(E,z.every(G=>typeof G=="object"))||a(`the shader operator \`${E}\` has no overload for the operand shapes ${M}.`),P.size>1&&a(`the componentwise \`${E}\` requires matrices of the SAME dimensions, but the operand shapes are ${M}.`);return}P.size>1&&a(`under \`*\` the matrix and vector dimensions must agree (\`matCxR * vecC\`, \`matKxR * matCxK\`), but the operand shapes ${M} do not.`);return}let{callee:y,argCount:w}=g;if(pn.test(y))return;if(y.startsWith("_gpu_")){if(w!==n.length||!xf(y,o(`${y}(`)))return;let E=xi(t);E!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(Ge).join(", ")}) \u2014 ${E}`);return}(d||h)&&a(`the shader builtin \`${y}\` is declared over scalar and \`vecN\` genTypes; it has no ${d?"`matN`":"array"} overload, so the operand shapes (${s.map(Ge).join(", ")}) have no lowering.`),p();let x=iu(t);x!==void 0&&a(`the shader lowering \`${t}\` cannot take the non-scalar operand shapes (${s.map(Ge).join(", ")}) \u2014 ${x}`);let $=s.map((E,z)=>E!=="scalar"||w!==n.length?E:vf(g.operands[z])??E);if(c.size===1&&$.includes("scalar")){let E=r.scalarGenTypeSlots.get(y);if(E===void 0&&a(`the shader builtin \`${y}\` requires MATCHING genType arguments, but it is applied to a vec${[...c][0]} operand and a scalar one; the scalar is not promoted to a vector.`),w===n.length){let N=$.findIndex((M,P)=>M==="scalar"&&!E.has(P));N>=0&&a(`the shader builtin \`${y}\` takes a scalar only ${ht(E)}, but here the scalar stands in argument ${N+1}, where the overload requires the vec${[...c][0]} genType; the scalar is not promoted to a vector.`)}let z=fu(t,r.scalarGenTypeSlots);z!==void 0&&a(z)}let A=r.mandatoryScalarSlots.get(y);if(A!==void 0&&w===n.length){let E=s.findIndex((z,N)=>A.has(N)&&z!=="scalar");E>=0&&a(`the shader builtin \`${y}\` requires a SCALAR ${ht(A)} \u2014 that argument is not genType-polymorphic, so there is no overload with a ${Ge(s[E])} standing there \u2014 but argument ${E+1} lowers to a ${Ge(s[E])}.`)}l()}function mu(){let e=new Set,n=t=>{if(C(t)&&e.has(t.symbol))return ie(3);let r=j(t);if(r==="matrix"){let o=vi(t);if(o===void 0)return;let[i,s]=o;return i===s?`mat${s}`:`mat${s}x${i}`}if(r==="array"){let o=ee(t);if(typeof o!="string"&&o.kind==="tuple"&&o.elements.length>4&&Gt(o)===void 0)return`float[${o.elements.length}]`;if(typeof o=="string"||o.kind!=="list")return;let i=o.dimensions?.length===1?o.dimensions[0]:void 0;if(i===void 0||!(i>0))return;let s=Mr(o);return typeof s=="number"?`vec${s}[${i}]`:`float[${i}]`}return pe(t)};return Ur.set(n,e),n}function mt(e){if(f.isComplexValued(e))return;let n=r=>{let o=mt(r);return o!==void 0&&"element"in o&&o.element==="f"&&o.width===1};if(B(e))return{element:"f",width:1};if(C(e)){let r=Ae(e);return r!==void 0?An(r.value)?{element:"f",width:1}:r.value??Xl(r.spelling):e.symbol==="True"||e.symbol==="False"?{element:"b",width:1}:e.isConstant===!0&&e.type.matches("real")?{element:"f",width:1}:void 0}if(!_(e))return;let t=e.operator;if(t==="Matrix"){let r=vi(e);if(r===void 0)return;let[o,i]=r;if(i===1){let s=e.ops[0];return(_(s)?s.ops.map(u=>_(u)?u.ops[0]:u):[]).every(n)?o>=2&&o<=4?{element:"f",width:o}:{kind:"array",spelling:`float[${o}]`}:void 0}return o!==i||o>4?i>=2&&i<=4?{kind:"array",spelling:`vec${i}[${o}]`}:void 0:{kind:"matrix",spelling:`mat${i}`}}if(t==="Tuple"||t==="List"){if(!e.ops.every(n))return;let r=e.nops;return r>=2&&r<=4?{element:"f",width:r}:{kind:"array",spelling:`float[${r}]`}}if(Zl.has(t))return e.nops>0&&e.ops.every(n)?{element:"f",width:1}:void 0;if(Jl.has(t))return e.nops>0&&e.ops.every(r=>{let o=mt(r);return o!==void 0&&"element"in o&&o.width===1})?{element:"b",width:1}:void 0;if(t==="If"&&e.nops===3){let r=mt(e.ops[1]),o=mt(e.ops[2]);if(r!==void 0&&o!==void 0&&"element"in r&&"element"in o&&r.element===o.element&&r.width===o.width)return r}}function we(e,n,t){return En(e,n,t)}function rn(e,n,t){if(n.some(r=>!Cn(r,t)&&we(r,t)))throw new Error(`Could not compile \`${e}\`: an operand contains code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler), and this shader form writes the operand more than once, so that code would run more than once.`)}function xe(e,n,t,r=!1){if(!Kr(n,t,r))throw new Error(`Could not compile \`${e}\`: its code would be computed in a statement ahead of the rest of its statement, and code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler) would then run out of the order of the interpreter.`)}var Yr=new Map;function hu(e,n){let t=Yr.get(e);t===void 0&&(t=[],Yr.set(e,t)),t.push(f.compileParents().length);try{return n()}finally{t.pop(),t.length===0&&Yr.delete(e)}}function Cf(e){let n=e.hoist===void 0?void 0:Yr.get(e.hoist),t=n?.[n.length-1];if(t!==void 0){let r=f.compileParents()[t];if(r!==void 0)return r}return zt(e)}function Kr(e,n,t=!1){let r=Cf(n);if(e===void 0)return r===void 0||!we(r,n);let o=!t&&e.some(l=>we(l,n)),i=e.some(l=>f.foldValueImpure(l));if(!o&&!i)return!0;if(r===void 0)return!o;let s=new Set(e);if(we(r,n,l=>s.has(l)||Cn(l,n)))return!1;if(!o)return!0;let a=l=>{let c=new Map,p=new Set,d=new Set,h=!1,g=(x,$,A)=>{if(A===null||x.has($))return h=!0,0;if(A===void 0)return 0;x.add($);let E=y(A);return x.delete($),E},y=x=>{let $=c.get(x);if($!==void 0)return $;let A=x===l?1:0;if(C(x)){let E=x.symbol,z=St(E,n);z!==void 0?A+=g(d,E,z):Ka(E,n)||(A+=g(p,E,x.engine._getSymbolValue(E)))}else if(zo(x))for(let E of x.values)A+=y(E);else if(_(x)){for(let N of x.ops)A+=y(N);let E=x.operator,z=St(E,n);if(z!==void 0)A+=g(d,E,z);else{let N=nt(x.engine,E);if(N!==void 0)A+=g(d,E,N);else{let M=jo(x.engine.lookupDefinition(E))?.clauses;if(M!==void 0&&M.length>0)if(d.has(E))h=!0;else{d.add(E);for(let P of M)A+=y(P.literal);d.delete(E)}}}}return c.set(x,A),A},w=y(r);return h?void 0:w};if(e.some(l=>we(l,n)&&a(l)!==1)||Sf(r,s,n))return!1;let u=new Map;for(let l of e)u.set(l,0);return zn(r,u)===0}function Sf(e,n,t){let r=new Set,o=new Set,i=!1,s=(u,l,c)=>{if(u.has(l))return!1;u.add(l);let p=a(c);return u.delete(l),p},a=u=>{if(i)return!1;if(n.has(u))return i=!0,!1;if(C(u)){let d=u.symbol,h=St(d,t);if(h===null)return!0;if(h!==void 0)return s(o,d,h);if(t.varsKeys?.has(d)===!0)return!0;if(t.boundVars?.has(d)===!0)return!1;let g=u.engine._getSymbolValue(d);return g!==void 0&&s(r,d,g)}if(zo(u)){for(let d of u.values)if(a(d))return!0;return!1}if(!_(u))return!1;for(let d of u.ops)if(a(d))return!0;if(i)return!1;let l=u.operator,c=St(l,t);if(c===null)return!0;if(c!==void 0)return s(o,l,c);let p=nt(u.engine,l);if(p!==void 0)return s(o,l,p);for(let d of jo(u.engine.lookupDefinition(l))?.clauses??[])if(s(o,l,d.literal))return!0;return!1};return a(e)}function ae(e,n,t,r,o=!1){if(rn(e,[n],r),!f.foldValueImpure(n))return t(n);if(!f.canHoist(r)||!o&&j(n)!=="scalar")throw new Error(`Could not compile \`${e}\`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.`);He(e,[n],r),xe(e,[n],r);let i=f.tempVar(r),a=`${o?ne():"float"} ${i}`;return f.hoistStatement(r,`${a} = ${t(n)};`),Oe([n],r),i}var dn;function gu(e,n){let t=0;for(;t<e.length&&t<n.length&&e[t]===n[t];)t+=1;if(t===n.length)return!0;if(t===e.length||t===0)return!1;let r=e[t-1];if(!_(r))return!1;let o=(u,l)=>u===l||C(u)&&u.engine._getSymbolValue(u.symbol)===l,i=r.ops,s=i.findIndex(u=>o(u,e[t])),a=-1;for(let u=i.length-1;u>=0&&a<0;u--)o(i[u],n[t])&&(a=u);return s>=0&&a>=0&&s<a}var _u=Symbol("gpuDrawOrder");function Xr(e){let n=new Error(e);return n[_u]=!0,n}function Rf(e){let n=new Set,t=r=>{if(n.has(r))return!1;if(n.add(r),C(r)){if(!f.foldValueImpure(r))return!1;let o=r.engine._getSymbolValue(r.symbol);return o!==void 0&&t(o)}if(!_(r))return!1;if(Pi(r)){let o=r.engine.lookupDefinition(r.operator);if(!$n(o)||o.operator.isUserFunctionDefinition||o.operator.drawsRandom!==!0)return!0}return r.ops.some(t)};return t(e)}function Zr(e){return dn!==void 0&&f.foldValueImpure(e)}function yu(e,n,t){if(dn!==void 0||!(e instanceof Error)||e[_u]!==!0||t===void 0||Rf(t))return;let r={inline:!1,reordered:!1};dn=r;let o;try{o=n()}finally{dn=void 0}if(r.reordered)throw e;return o}var Ri=new WeakMap;function He(e,n,t){if(dn!==void 0)return;let r=()=>{throw Xr(`Could not compile \`${e}\`: an operand that draws a random value would be bound to a temporary ahead of the rest of its statement, and a draw written before it would then come after it.`)},o=t.hoist,i=zt(t),s=o===void 0?void 0:Ri.get(o),a=n.find(w=>f.foldValueImpure(w))??n[0],u=1,l=2,c=new Map,p=w=>{let x=c.get(w);if(x!==void 0)return x;let $=0;if(w===a)$=u;else if(s?.has(w))$=0;else if(C(w))$=f.foldValueImpure(w)?l:0;else if(_(w)){for(let A of w.ops)if($=p(A),$!==0)break;$===0&&Pi(w)&&($=l)}return c.set(w,$),$},d=()=>{if(i===void 0)return!1;let w=new Map,x=n.reduce(($,A)=>$+zn(A,w),0);return zn(i,w)===x},h=(w,x)=>{let $=x.get(w);if($!==void 0)return $;let A=w===a?1:0;if(_(w))for(let E of w.ops)A+=h(E,x);return x.set(w,A),A},g=i===void 0?0:p(i);g===l&&r();let y=i!==void 0&&h(i,new Map)>1;(g===0||y)&&!d()&&r()}function Oe(e,n){let t=n.hoist;if(t===void 0)return;let r=Ri.get(t)??new Set;for(let o of e)r.add(o);Ri.set(t,r)}function Pi(e){if(!_(e)||e.operator==="WithRandomSeed"||!f.foldValueImpure(e))return!1;if(!e.ops.some(t=>f.foldValueImpure(t)))return!0;let n=e.engine.lookupDefinition(e.operator);return $n(n)?n.operator.drawsRandom||n.operator.isUserFunctionDefinition:ln(n)}function zn(e,n=new Map){let t=n.get(e);if(t!==void 0)return t;let r=0;if(C(e))r=f.foldValueImpure(e)?1:0;else if(_(e)){for(let o of e.ops)r+=zn(o,n);Pi(e)&&(r+=1)}return n.set(e,r),r}var Ce=34028234663852886e22;function bu(e){let n=j(e);return n==="scalar"?e.type.matches("finite_real"):typeof n!="number"?!1:e.type.matches("list<finite_real>")||e.type.matches(`tuple<${Array(n).fill("finite_real").join(", ")}>`)}var Pf=new Set(["Sin","Cos","Tanh","Arctan","Abs","Floor","Ceil","Round","Truncate","Fract","Sign","Clamp","Min","Max","ElementMin","ElementMax","Smoothstep","Random"]);function We(e,n,t=!1){let r=!1;if(!bu(e)){if(j(e)!=="scalar")return!1;r=!0}try{return xu(n,r)?.finite(e,t)===!0}catch(o){if(o instanceof Error&&o.name==="CancellationError")throw o;return!1}}function xu(e,n){let t=e.cse?.harvestOptions;if(t===void 0)return;let r=e.userFunctions===void 0?void 0:wu.get(e.userFunctions),o=m=>r==="all"||r?.has(m)===!0,i=e.gpuParameterFacts,s=new Map,a=new Map,u=m=>_(m)?f.foldedRealNumber(m,e):void 0,l=m=>{if(typeof m!="object"||m.kind!=="numeric")return;let{lower:v,upper:b}=m;if(v===void 0||b===void 0)return;let S=Math.max(Math.abs(v),Math.abs(b));return Number.isFinite(S)?S:void 0},c=m=>l(m.type.type),p=m=>{if(!_(m)||!m.type.matches("finite_real"))return;let v=m.operator;if(e.boundVars?.has(v)===!0||e.unrollSkipHeads?.has(v)===!0||e.overridesHead?.(v)===!0||t.isOverriddenOperator?.(v)===!0||f.userFunctionLiteral(m.engine,v)===void 0)return;let b=m.engine.lookupDefinition(v),S;ln(b)&&b.value.inferredType!==!0?S=b.value.type.type:$n(b)&&b.operator.inferredSignature!==!0&&(S=b.operator.signature.type);let T=lr(S);if(T===void 0||!D(T,"finite_real"))return;let L=l(T);return L===void 0||L>Ce?void 0:L},d=m=>p(m)!==void 0,h=new Set,g=m=>e.varsKeys?.has(m)===!0||t.isVarsKey?.(m)===!0,y=m=>{let v=m.engine._getSymbolValue(m.symbol);if(v!==void 0&&!(g(m.symbol)||e.boundVars?.has(m.symbol)===!0)&&e.var(m.symbol)===void 0)return f.foldedValueInRadians(v,e)},w=(m,v=!1)=>{let b=v?a:s,S=b.get(m);if(S!==void 0)return S;let T=_(m)&&(m.operator==="Add"||m.operator==="Subtract"||m.operator==="Negate"),L=!1;if(B(m))L=m.type.matches("finite_real")&&m.im===0&&Math.abs(m.re)<=Ce;else if(C(m)&&i?.get(m.symbol)?.finite===!0)L=!0;else if(C(m)&&o(m.symbol))L=!1;else if(C(m)){let O=y(m),U=O??m.engine._getSymbolValue(m.symbol),V=g(m.symbol),K=V&&m.valueDefinition?.isConstant!==!0&&e.var(m.symbol)===m.symbol;L=(O!==void 0||m.valueDefinition?.inferredType!==!0)&&(!n||O!==void 0||bu(m))&&(!V||K)&&(U===void 0||!h.has(m.symbol)&&(h.add(m.symbol),w(U))),h.delete(m.symbol)}else if(_(m)&&t.isOverriddenOperator?.(m.operator)!==!0&&m.ops.every((O,U)=>w(O,v&&T||m.operator==="Divide"&&U===1))){let O=u(m);if(O!==void 0&&Number.isFinite(O)&&Math.abs(O)<=Ce)return b.set(m,!0),!0;if(m.operator==="Multiply")L=$(m.ops);else if(m.operator==="Power")L=v&&N(m)||M(m)!==void 0;else if(T){let U=[],V=K=>{_(K)&&(K.operator==="Add"||K.operator==="Subtract"||K.operator==="Negate")?K.ops.forEach(V):U.push(K)};V(m),L=A(U)}else if(m.operator==="List"||m.operator==="Tuple")L=!0;else if(m.operator==="Divide")L=E(m);else if(m.operator==="Mod")L=z(m);else if(m.operator==="Abs"&&m.nops===1&&(Xo(m.op1)||rl(m.op1)||f.isComplexValued(m.op1))){let U=j(m.op1),V=typeof U=="number"&&Xo(m.op1)&&!f.isComplexValued(m.op1)?x(m.op1):void 0;L=typeof U=="number"&&V!==void 0&&U*V*V*(1+2**-10)<=Ce/2}else(i!==void 0||n)&&m.operator==="Smoothstep"&&!m.type.matches("finite_real")?L=B(m.op1)&&B(m.op2)&&!m.op1.isSame(m.op2):Pf.has(m.operator)?L=!0:L=d(m)}return b.set(m,L),L},x=(m,v=0)=>{if(B(m))return m.im===0&&Number.isFinite(m.re)?Math.abs(m.re):void 0;if(_(m)&&(m.operator==="List"||m.operator==="Tuple")){let b=0;for(let S of m.ops){let T=x(S,v+1);if(T===void 0)return;b=Math.max(b,T)}return b}if(C(m)){let b=i?.get(m.symbol);if(b?.finite===!0)return b.magnitude;if(o(m.symbol))return;let S=y(m);if(S!==void 0)return v<8?x(S,v+1):void 0}else{if(_(m)&&(m.operator==="Sin"||m.operator==="Cos"||m.operator==="Tanh")&&(m.type.matches("real")||n&&w(m.op1)))return 1;if(_(m)&&m.operator==="Arctan"&&m.nops===1&&(m.type.matches("real")||n&&w(m.op1)))return Math.PI/2;if(_(m)&&m.operator==="Random"&&m.nops===0)return 1;if(_(m)&&m.operator==="Power"&&B(m.op2)){let b=P(m.op1);if(b!==void 0&&N(m))return Math.max(1,b)**m.op2.re*(1+2**-10);let S=M(m);if(S!==void 0)return S}else if(_(m)&&m.operator==="Divide"&&m.nops===2&&!B(m.op2)&&w(m)){let b=x(m.op1,v+1),S=H(m.op2);if(b!==void 0&&S!==void 0&&E(m))return b/S*(1+2**-20)}else if(_(m)&&m.operator==="Multiply"){let b=1;for(let S of m.ops){let T=x(S,v+1);if(T===void 0){b=NaN;break}b*=T}if(Number.isFinite(b))return b}else if(_(m)&&m.nops===1&&(m.operator==="Floor"||m.operator==="Ceil"||m.operator==="Round"||m.operator==="Truncate")&&!f.isComplexValued(m.op1)){let b=x(m.op1,v+1);if(b!==void 0)return b+1}else{if(_(m)&&m.operator==="Fract"&&m.nops===1&&!f.isComplexValued(m.op1)&&!Fr(m.op1)&&w(m))return 1;if(_(m)&&m.operator==="Mod"&&m.nops===2&&!f.isComplexValued(m.op1)&&!f.isComplexValued(m.op2)&&!Fr(m.op1)&&w(m)){if(B(m.op2)&&m.op2.im===0&&m.op2.re===1)return 1;let b=x(m.op1,v+1),S=x(m.op2,v+1);if(b!==void 0&&S!==void 0)return S+(b+S)*2**-16}}}if(C(m)){if(m.valueDefinition?.isConstant===!0&&!g(m.symbol)&&m.unknowns.length===0){let b=m.N();if(b.im===0&&Number.isFinite(b.re))return Math.abs(b.re)}}else{let b=u(m);if(b!==void 0&&Number.isFinite(b))return Math.abs(b)}if(_(m)&&(m.operator==="Add"||m.operator==="Subtract"||m.operator==="Negate"||m.operator==="Abs"||m.operator==="Min"||m.operator==="Max")){let b=m.operator==="Add"||m.operator==="Subtract",S=!b&&m.operator!=="Negate",T=0;for(let L of m.ops){if(S&&(j(L)!=="scalar"||f.isComplexValued(L)))return;let O=x(L,v+1);if(O===void 0)return;T=b?T+O:Math.max(T,O)}return Number.isFinite(T)?T:void 0}if(_(m))return p(m);if(!(!C(m)||i?.has(m.symbol)===!0||o(m.symbol)||y(m)!==void 0||m.valueDefinition?.inferredType===!0))return c(m)},$=m=>{let v=1,b=0,S=!0;for(let T of m){let L=x(T);L===void 0?b+=1:(v*=Math.max(1,L),B(T)&&L<=1&&(T.operator!=="Rational"||Math.abs(T.numerator.re)===1&&T.denominator.re<=2**126)||(S=!1))}return b===1?S:b===0&&Number.isFinite(v)&&v<=Ce/2},A=m=>{let v=0,b=0;for(let S of m){let T=x(S)??G(S);T===void 0?b+=1:v+=T}return Number.isFinite(v)?b===0?v<=Ce/2:b===1&&v<=2**100:!1},E=m=>{if(!_(m)||m.nops!==2)return!1;if(!B(m.op2)){let S=H(m.op2),T=x(m.op2);if(S===void 0||!(S>=2**-126)||T===void 0||T>2**126)return!1;let L=x(m.op1);return L===void 0?S>=2:L/S<=Ce/2}if(m.op2.im!==0)return!1;let v=Math.abs(m.op2.re);if(!(v>=2**-126&&v<=2**126))return!1;let b=x(m.op1);return b===void 0?v>=2:b/v<=Ce/2},z=m=>{if(!_(m)||m.nops!==2)return!1;let v=m.op2;if(B(v)&&v.im===0&&v.re===1)return!0;let b;if(B(v))b=v.im===0?Math.abs(v.re):void 0;else if(!n&&C(v)&&i?.has(v.symbol)!==!0&&!o(v.symbol)&&y(v)===void 0&&v.valueDefinition?.inferredType!==!0){let L=v.type.type;if(typeof L=="object"&&L.kind==="numeric"){let{lower:O,upper:U}=L;O!==void 0&&O>0?b=O:U!==void 0&&U<0&&(b=-U)}}if(b===void 0||!(b>=2**-126))return!1;let S=x(m.op1),T=x(v);return S===void 0||T===void 0||T>2**126?!1:S/b<=Ce/2&&S+T<=Ce/2},N=m=>{if(!_(m)||!B(m.op2)||m.op2.im!==0)return!1;let v=m.op2.re;if(!Number.isInteger(v)||v<2||v>4)return!1;let b=P(m.op1);return b!==void 0&&Math.max(1,b)**v*(1+2**-10)<=Ce/2},M=m=>{if(!_(m,"Power")||!B(m.op2)||m.op2.im!==0)return;let v=-m.op2.re;if(!Number.isInteger(v)||v<2||v>4)return;let b=P(m.op1);if(b===void 0||Math.max(1,b)**v*(1+2**-10)>2**126)return;let S=H(m.op1);if(S===void 0)return;let T=S**v*(1-2**-20);if(!(T>=2**-126))return;let L=1/T*(1+2**-20);return L<=Ce/2?L:void 0},P=m=>{let v=b=>(_(b)&&b.operator==="Negate"&&(b=b.op1),_(b)&&b.operator==="Multiply"?G(b):k(b));if(_(m)&&(m.operator==="Add"||m.operator==="Subtract")){let b=0;for(let S of m.ops){let T=v(S);if(T===void 0)return;b+=T}return Number.isFinite(b)?b:void 0}return v(m)},G=m=>{if(!_(m)||m.operator!=="Multiply")return;let v=1,b=0,S=0;for(let T of m.ops){if(B(T)){if(T.operator==="Rational")return;b+=1}else S+=1;let L=k(T);if(L===void 0)return;v*=L}if(!(b===0||S!==1))return Number.isFinite(v)?v:void 0},k=m=>{if(B(m))return m.im===0&&Number.isFinite(m.re)?Math.abs(m.re):void 0;if(_(m)&&(m.operator==="Sin"||m.operator==="Cos"))return m.nops===1&&(m.type.matches("real")||n&&w(m.op1))?1:void 0;if(!C(m)||i?.has(m.symbol)===!0||o(m.symbol)||y(m)!==void 0||m.valueDefinition?.inferredType===!0)return;let v=m.type.type;if(typeof v!="object"||v.kind!=="numeric")return;let{lower:b,upper:S}=v;if(b===void 0||S===void 0)return;let T=Math.max(Math.abs(b),Math.abs(S));return Number.isFinite(T)?T:void 0},R=m=>br(m)!==void 0,I=(m,v=0)=>{if(v>32||!w(m)||R(m))return;let b=(T,L,O,U=1)=>{let V=U*11754943508222875e-54,K=[T-O-V,L+O+V];return Math.max(-K[0],K[1])<=Ce/2?K:void 0};if(B(m))return m.im===0?b(m.re,m.re,Math.abs(m.re)*2**-23):void 0;if(C(m)){let T=i?.get(m.symbol);if(T?.finite===!0)return T.range;let L=y(m);if(L!==void 0)return I(L,v+1)}else if(_(m)){let T=m.operator;if(T==="Negate"&&m.nops===1){let O=I(m.op1,v+1);if(O!==void 0)return[-O[1],-O[0]]}else if((T==="Add"||T==="Subtract")&&m.nops>=1){let O=0,U=0,V=0,K=!0;if(m.ops.forEach((de,W)=>{let J=K?I(de,v+1):void 0;if(J===void 0){K=!1;return}T==="Subtract"&&W>0?(O-=J[1],U-=J[0]):(O+=J[0],U+=J[1]),V+=Math.max(-J[0],J[1])}),K)return b(O,U,m.nops*2**-22*V,m.nops)}else if(T==="Multiply"&&m.nops>=1){let O=m.ops.filter(R),U=1,V=1,K=O.length<=1&&O.length<m.nops,de=(Q,re)=>{if(Q===void 0)return;let ye=Math.min(Q[0]*re,Q[1]*re),Ke=Math.max(Q[0]*re,Q[1]*re);if(!((ye>0||Ke<0)&&Math.min(Math.abs(ye),Math.abs(Ke))<2**-100))return b(ye,Ke,2**-20*Math.max(-ye,Ke))};for(let Q of m.ops){if(!K)break;if(R(Q))continue;let re=I(Q,v+1);if(re===void 0){K=!1;break}let ye=[U*re[0],U*re[1],V*re[0],V*re[1]];if(U=Math.min(...ye),V=Math.max(...ye),(U>0||V<0)&&Math.min(Math.abs(U),Math.abs(V))<2**-100){K=!1;break}}let W=K&&Number.isFinite(U)&&Number.isFinite(V)?b(U,V,m.nops*2**-22*Math.max(-U,V)):void 0,J=O[0]===void 0?void 0:br(O[0]);if(J!==void 0&&(W=de(W,1/J.q),J.p!==1&&(W=de(W,J.p))),W!==void 0)return W}else if(T==="Divide"&&m.nops===2&&B(m.op2)&&!R(m.op2)&&m.op2.im===0&&Math.abs(m.op2.re)>=2**-126&&Math.abs(m.op2.re)<=2**126){let O=I(m.op1,v+1),U=m.op2.re;if(O!==void 0){let V=O[0]/U,K=O[1]/U;return b(Math.min(V,K),Math.max(V,K),2**-21*Math.max(Math.abs(V),Math.abs(K)))}}let L=u(m);return L!==void 0&&Number.isFinite(L)?b(L,L,Math.abs(L)*2**-23):void 0}let S=x(m);return S===void 0?void 0:[-S,S]},H=(m,v=0)=>{if(v>32||!w(m,!0)||R(m))return;let b=T=>Number.isFinite(T)&&T>=2**-126?T:void 0;if(B(m))return m.im===0?b(Math.abs(m.re)*(1-2**-23)):void 0;if(_(m,"Power")&&B(m.op2)&&m.op2.im===0&&Number.isInteger(m.op2.re)&&m.op2.re>=2&&m.op2.re<=4){let T=H(m.op1,v+1);return T===void 0?void 0:b(T**m.op2.re*(1-2**-20))}if(_(m,"Multiply")){let T=m.ops.filter(R);if(T.length>1||T.length===m.nops)return;let L=1;for(let U of m.ops){if(R(U))continue;let V=H(U,v+1);if(V===void 0||(L*=V,!(L>=2**-100)))return}L*=1-m.nops*2**-22;let O=T[0]===void 0?void 0:br(T[0]);if(O!==void 0){if(L=L/O.q*(1-2**-20),!(L>=2**-100))return;L*=Math.abs(O.p)*(1-2**-20)}return b(L)}let S=I(m,v+1);if(!(S===void 0||S[0]<=0&&S[1]>=0))return b(Math.min(Math.abs(S[0]),Math.abs(S[1])))};return{finite:w,magnitude:m=>x(m)}}var wu=new WeakMap,$u=new WeakMap;function vu(e){let n=new Set,t=new Set,r=(o,i)=>{if(!(!_(o)||t.has(o))){if(t.add(o),!i)for(let s of De(o))n.add(s);(o.operator==="Assign"||o.operator==="Declare")&&C(o.op1)&&n.add(o.op1.symbol);for(let s of o.ops)r(s,!1)}};return r(e,!0),n}function Eu(e,n){let t=n.userFunctions,r=n.cse?.harvestOptions;if(t===void 0||r===void 0)return;let o=e.engine,i=k=>r.isOverriddenOperator?.(k)===!0||n.unrollSkipHeads?.has(k)===!0||n.overridesHead?.(k)===!0,s=new Set,a=!1,u=new Map,l=k=>{if(u.has(k))return u.get(k);let R;if(!i(k))try{R=f.userFunctionLiteral(o,k)}catch(I){if(I instanceof Error&&I.name==="CancellationError")throw I;a=!0}return u.set(k,R),R},c=[],p=new Map,d=new Set,h=new Set,g=new Map,y=0,w=[[e,void 0]],x=(k,R)=>{if(p.has(k)||!_(R,"Function"))return;let I;try{I=$r(R,n,t,k)}catch(b){if(b instanceof Error&&b.name==="CancellationError")throw b;a=!0;return}let H=vu(I),m=R.ops.slice(1),v=m.map(b=>Be(b));p.set(k,{names:v,stable:m.map((b,S)=>!et(b)&&v[S]!==""&&!H.has(v[S]))}),w.push([I,k])},$=(k,R,I,H=!1)=>{if(C(k)){let L=k.symbol;if(I.has(L)||R!==void 0&&p.get(R).names.includes(L))return;let O=l(L);if(O!==void 0)d.add(L),x(L,O);else if(!h.has(L)){h.add(L);let U=o._getSymbolValue(L);U!==void 0&&w.push([f.foldedValueInRadians(U,n),void 0])}return}if(!_(k)||a)return;if(++y>1e5){a=!0;return}if(I.size===0){let L=g.get(R);if(L===void 0&&g.set(R,L=new Set),L.has(k))return;L.add(k)}let m=k.operator;(m==="Assign"||m==="Declare")&&C(k.op1)&&s.add(k.op1.symbol);let v=l(m);v!==void 0&&(I.has(m)?d.add(m):c.push({caller:R,callee:m,args:k.ops,bound:I}),x(m,v));let b=R===void 0||!H?[]:p.get(R).names,S=De(k).filter(L=>!b.includes(L));for(let L of S){let O=l(L);O!==void 0&&(d.add(L),x(L,O))}let T=S.length===0?I:new Set([...I,...S]);for(let L of k.ops)$(L,R,T)};for(;w.length>0;){let[k,R]=w.pop();$(k,R,new Set,R!==void 0)}if(wu.set(t,a?"all":s),a||p.size===0)return;let A=new Map;for(let k of p.keys())A.set(k,new Set);for(let k of c)k.caller!==void 0&&k.caller!==k.callee?A.get(k.callee).add(k.caller):k.caller===k.callee&&d.add(k.callee);let E=[],z=new Map;for(let[k,R]of A)z.set(k,R.size);let N=[...p.keys()].filter(k=>z.get(k)===0);for(;N.length>0;){let k=N.pop();E.push(k);for(let[R,I]of A)if(I.has(k)){let H=z.get(R)-1;z.set(R,H),H===0&&N.push(R)}}let M=new Map;for(let[k,{names:R}]of p)M.set(k,R.map(()=>({finite:!1,magnitude:void 0})));let P=k=>{if(k.caller===void 0)return n;let R=p.get(k.caller).names,I=M.get(k.caller),H=new Map;R.forEach((v,b)=>{v!==""&&H.set(v,I[b])});let m=new Set(n.boundVars??[]);for(let v of R)v!==""&&m.add(v);return{...n,boundVars:m,gpuParameterFacts:H}},G=(k,R)=>R.size===0?!1:C(k)?R.has(k.symbol):_(k)?R.has(k.operator)||k.ops.some(I=>G(I,R)):!1;for(let k of E){let{names:R,stable:I}=p.get(k),H=c.filter(S=>S.callee===k),m=I.map(S=>S&&!d.has(k));(H.length===0||H.some(S=>S.args.length!==R.length))&&m.fill(!1);let v=R.map(()=>0);for(let S of H){if(!m.some(O=>O))break;let T=P(S),L=xu(T,!0);S.args.forEach((O,U)=>{if(!m[U])return;if(j(O)!=="scalar"||G(O,S.bound)||!We(O,T)){m[U]=!1;return}let V;try{V=L?.magnitude(O)}catch(de){if(de instanceof Error&&de.name==="CancellationError")throw de;V=void 0}let K=v[U];v[U]=V===void 0||K===void 0?void 0:Math.max(K,V)})}let b=Ru(e.engine,k,R.length);M.set(k,R.map((S,T)=>Cu(I[T],m[T]?v[T]:null,b?.[T])))}$u.set(t,M)}function Cu(e,n,t){if(!e)return{finite:!1,magnitude:void 0};if(t===void 0)return n===null?{finite:!1,magnitude:void 0}:{finite:!0,magnitude:n};let r=Math.max(Math.abs(t[0]),Math.abs(t[1]));return{finite:!0,magnitude:n==null?r:Math.min(n,r),range:t}}function Su(e,n,t,r,o,i){let s=o.userFunctions===void 0?void 0:$u.get(o.userFunctions)?.get(e),a=Ru(r.engine,e,i?.arity??n.length);if(s===void 0&&a===void 0)return;let u=vu(r),l=new Map;return n.forEach((c,p)=>{if(t[p]!=="float"||u.has(c))return;let d=i?.at[p]??p,h=s?.[d],g=h?.finite===!0?h:Cu(!0,null,a?.[d]);g.finite&&l.set(c,g)}),l.size===0?void 0:l}function Ru(e,n,t){let r=e.lookupDefinition(n),o;if(ln(r)&&r.value.inferredType!==!0?o=r.value.type.type:$n(r)&&r.operator.inferredSignature!==!0&&(o=r.operator.signature.type),typeof o!="object"||o.kind!=="signature")return;let i=o.args;if(i===void 0||i.length!==t||o.optArgs!==void 0||o.variadicArg!==void 0)return;let s=!1,a=i.map(u=>{let l=u.type;if(typeof l!="object"||l.kind!=="numeric"||!D(l,"finite_real"))return;let{lower:c,upper:p}=l;if(!(c===void 0||p===void 0)&&!(!Number.isFinite(c)||!Number.isFinite(p))&&!(Math.max(Math.abs(c),Math.abs(p))>Ce))return s=!0,[c,p]});return s?a:void 0}function Qr(e,n,t){if(!/\breturn\b/.test(n))return;let r=n.split(`
`),o=r.length===1;for(let i of r){let s=i.length-i.trimStart().length;for(let a of i.matchAll(/\breturn\b/g))if(!(!o&&a.index===s))throw new Error(`Could not compile ${Qe(e)}: an early \`Return\` here has no ${t.toUpperCase()} lowering \u2014 the emitted source would place a \`return\` where the language requires an expression (\`${i.trim()}\`). A shader function returns once, at the end of its body, so a \`Return\` inside a conditional \u2014 or one that IS the body's final value \u2014 cannot be emitted. Rewrite it as a conditional VALUE, or evaluate instead.`)}}function eo(e){let n=new Set,t=r=>{if(!_(r))return;let o=r.operator,i=r.ops;o==="Break"||o==="Continue"?i.length===0&&n.add(r):o==="Block"?i.forEach(t):(o==="If"&&(i.length===2||i.length===3&&C(i[2],"Nothing"))||o==="Which"&&i.length===2&&!C(i[0],"True"))&&(n.add(r),t(i[1]))};return t(e),n}function Ai(e,n,t){let r=n.includes(`
`);if(!r&&!/\breturn\b/.test(n))return;let o=t.toUpperCase(),i=(r?n.split(`
`)[0]:n).trim();throw new Error(`Could not compile ${Qe(e)}: this route emits a single ${o} EXPRESSION, but the body lowers to ${r?"a statement sequence":"a bare `return` statement"} (\`${i}${r?"\u2026":""}\`). ${o} has no expression-level block or immediately-invoked function to wrap statements in, so there is no valid emission for this position. Compile a statement body with compile() instead \u2014 that route emits a function body.`)}function gt(e,n,t){let r=Bn(n);if(r===void 0)return;let o=t.toUpperCase();if(r!=="Assign")throw new Error(`Could not compile ${Qe(e)}: this route emits a single ${o} EXPRESSION, but the body is a declaration. A declaration is a STATEMENT in ${o}, so the emitted \`float s\`-shaped source is not valid in an expression position \u2014 and it carries no initializer, so the declared value would be silently DROPPED. Compile a statement body with compile() instead \u2014 that route emits a function body.`)}function mn(e){let n=new Set,t=r=>{if(n.has(r))return!1;if(n.add(r),C(r)){let i=r.engine._getSymbolValue(r.symbol);return i!==void 0&&t(i)}if(!_(r))return!1;let o=r.operator;return o==="Sum"||o==="Product"||o==="Block"||o==="Loop"?!0:r.ops.some(t)};return t(e)}function Pu(e,n){let t=e.engine.lookupDefinition(n),r=[];return $n(t)?r.push(t.operator.signature?.type):ln(t)&&r.push(t.value.type?.type,t.value.value?.type?.type),r.some(o=>{let i=ea(o);return i==="any"||i?.includes("scope")===!0||i?.includes("state")===!0})}function Af(e,n,t){if(!_(e))return!1;let r=new Set;return e.ops.some(o=>{if(_(o,"Declare")){let i=o.ops[0];if(C(i))r.add(i.symbol);else if(_(i,"Tuple")||_(i,"List")||_(i,"Delimiter")||_(i,"Sequence"))for(let a of i.ops)C(a)&&r.add(a.symbol);let s=f.declareValueOperand(o.ops);return s!==void 0&&qn(s,n,t)}if(_(o,"Assign")){let i=o.ops[0];return!C(i)||!r.has(i.symbol)?!0:qn(o.ops[1],n,t)}return qn(o,n,t)})}function qn(e,n,t=new Set){if(n.has(e))return!1;if(C(e)){if(Pu(e,e.symbol))return!0;if(!f.foldValueImpure(e)||t.has(e.symbol))return!1;let o=e.engine._getSymbolValue(e.symbol);if(o===void 0)return!0;t.add(e.symbol);try{return qn(o,n,t)}finally{t.delete(e.symbol)}}if(!_(e)||!f.foldValueImpure(e))return!1;if(e.operator==="Block")return Af(e,n,t);let r=e.operator;return r==="Assign"||r==="Declare"||r==="Assume"||e.ops.some(o=>qn(o,n,t))?!0:Pu(e,r)}function no(e,n,t){if(!f.canHoist(t)||Pn.has(t.hoist))return;let r=zt(t);if(r===void 0)return;if(e.some(f.hasObservableEffect)){if(e.some($=>qn($,new Set)))return;if(dn===void 0){let $=new Map,A=e.map(z=>zn(z,$)),E=A.reduce((z,N)=>z+N,0);if(zn(r,$)!==E||A.some(z=>z>1)){if(e.some(mn))throw Xr("Could not compile the selection: a clause needs statements and draws a random value, and a draw of the rest of the statement could then change places with its draws.");return}}}if(!Kr(e,t)||qn(r,new Set(e)))return;let o=e.filter(($,A)=>A%2===1),i=Mt("Which",e),a=(o.some($=>!Jr($,t))?o.filter($=>!Jr($,t)):o).map($=>i&&j($)==="scalar"?ie(2):pe($));if(a.some($=>$===void 0)||new Set(a).size!==1)return;let u=a[0];if(!/^(float|vec[234])$/.test(u)&&!C(e[e.length-2],"True"))return;let l=t.hoist,c=($,A)=>{let E=l.stmts.length;A&&Ft.add(l);let z;try{z=A?hu(l,$):$()}finally{Ft.delete(l)}let N=l.stmts.splice(E).map(M=>M.replace(/;\s*$/,""));return{code:z,stmts:N}},p=$=>$.map(A=>`  ${A.replace(/\n/g,`
  `)}`),d=$=>/[;{}]\s*$/.test($)?$:`${$};`,h=f.tempVar(t),g=o.find($=>Ie($))??null,y=i?`${ne()}(${le(t)})`:It(g,t),w=$=>{if($>=e.length)return[`${h} = ${y}`];let A=e[$],E=e[$+1];if(C(A,"True")){let P=c(()=>n(E,$+1),!0);return[...P.stmts,`${h} = ${P.code}`]}let z=c(()=>n(A,$),$>0),N=c(()=>n(E,$+1),!0),M=[...N.stmts,`${h} = ${N.code}`];return[...z.stmts,`if (${z.code}) {`,...p(M),"} else {",...p(w($+2)),"}"]},x=w(0);return f.hoistStatement(t,`${u} ${h};`,x.map(d).join(`
`)),h}function Tu(e,n,t){if(!n.some(i=>mn(i.body)||i.guard!==void 0&&mn(i.guard))||f.hasObservableEffect(e))return;let r=e.engine,o=n.flatMap(i=>[i.test===void 0?r.True:i.guard===void 0||C(i.guard,"True")?r.False:i.guard,i.body]);if(!Mt("Which",o)&&Kr([...o,...n.flatMap(i=>i.comparisons)],t))return no(o,(i,s)=>{let a=n[Math.floor(s/2)];if(s%2===1)return Ye("Match",a.compileBody,t);let u=a.test;return s===0?u():Ye("Match",u,t)},t)}function on(e){return f.canHoist(e)&&!Pn.has(e.hoist)}function to(e){let n=new Set,t=new Set,r=!1,o=i=>{if(!r){if(C(i)){let s=i.symbol;if(t.has(s))return;let a=i.engine._getSymbolValue(s);if(a===void 0)return;t.add(s),o(a),t.delete(s);return}if(_(i)){if(n.has(i)){r=!0;return}n.add(i);for(let s of i.ops)o(s)}}};return o(e),r}function Ye(e,n,t){let r=f.canHoist(t)?t.hoist:void 0;if(r!==void 0&&Ft.has(r))return Ft.delete(r),n();let o=r?.stmts.length??0,i=r!==void 0&&Pn.has(r);r!==void 0&&Pn.add(r);let s;try{s=n()}finally{r!==void 0&&!i&&Pn.delete(r)}if(r!==void 0&&r.stmts.length>o)throw r.stmts.length=o,Xr(`Could not compile \`${e}\`: a conditionally-evaluated branch contains a multi-statement construct (a loop-form Sum/Product, or an impure operand bound to a hoisted temporary). Hoisting it out of the branch would run it unconditionally \u2014 a shader conditional is an expression, not a statement \u2014 which changes the result whenever the branch draws from the random stream.`);return s}function Fn(e,n,t){return n==="1.0"&&t==="0.0"?`float(${e})`:`((${e}) ? (${n}) : (${t}))`}function ku(e){if(_(e,"Tuple"))return!0;let n=ee(e);return typeof n!="string"&&n.kind==="tuple"}function Ti(e,n){for(let t of n)if(t!=null&&!(!_(t,"List")&&!_(t,"Tuple"))&&j(t)==="array")throw new Error(`Could not compile \`${e}\`: the value \`${t.toString()}\` lowers to a shader ARRAY, and a selection (a GLSL ternary) chooses between scalars or vectors only.`)}function _e(e){throw new Error(`Could not compile \`Which\`: ${e}`)}function Mt(e,n){return f.liveSelectionArms({operator:e,ops:n}).some(t=>f.isComplexValued(t))}function Jr(e,n){return C(e,"Missing")?n.boundVars?.has(e.symbol)!==!0&&n.varsKeys?.has(e.symbol)!==!0:B(e)&&Number.isNaN(e.re)&&e.im===0}function Tf(e,n,t){if(n)return`${ne()}(${le(t)})`;let r=e.find(o=>!Jr(o,t)&&Ie(o))??null;return It(r,t)}function Ut(e,n,t,r,o,i){if(i!==void 0&&Jr(n,o))return Tf(i,r,o);if(!r||f.isComplexValued(n))return t;let s=j(n)==="scalar";if(!s||!Le(n.type.type,"number"))throw new Error(`Could not compile \`${e}\`: the value \`${n.toString()}\` is not a ${s?"number":"scalar"}, and another value of the selection is complex.`);return`${ne()}(${t}, 0.0)`}function Lu(e){if(C(e,"True")||C(e,"False"))return;if(_(e,"List")){for(let i of e.ops)C(i,"True")||C(i,"False")||f.isBooleanValued(i)&&!f.isComplexValued(i)&&!f.isNonScalarShape(i)||_e(`a literal list condition needs provably boolean scalar cells (\`True\`/\`False\` or a scalar comparison); the cell \`${i.toString()}\` is not one, and the interpreter only selects when every cell evaluates to a boolean.`);let o=e.nops;return(o<2||o>4)&&_e(`a ${o}-element list condition has no GPU vector lowering (only vec2\u2013vec4 are shader values).`),o}let n=e.operator,t=_(e)?e.ops:[];if(Mo(n)){let o;for(let i of t){f.isComplexValued(i)&&_e(`a complex-valued operand (\`${i.toString()}\`) in an element-wise condition is lowered as a \`vec2\` of (re, im), which has no cell meaning in a selection.`),ku(i)&&_e(`a tuple operand (\`${i.toString()}\`) in an element-wise condition has no element-wise reading \u2014 the interpreter binds a tuple atomically.`);let s=Ie(i);if(s===void 0){f.isNonScalarShape(i)&&_e(`the condition operand \`${i.toString()}\` is not a shader scalar and has no static vec2\u2013vec4 shape (an unknown-length list, a matrix, or a 5+-element list).`);continue}o!==void 0&&o!==s&&_e(`an element-wise condition mixes vec${o} and vec${s} operands.`),o=s}return o===void 0?void 0:((n==="Equal"||n==="NotEqual")&&t.length>2&&_e(`an n-ary \`${n}\` over a collection operand has no faithful element-wise lowering \u2014 the interpreter's n-ary form switches shape on how many operands are collections at run time, so no pairwise conjunction matches it.`),si[n]===void 0&&_e(`the relation \`${n}\` has no componentwise shader form.`),o)}if(n==="And"||n==="Or"||n==="Not"){let o;for(let i of t){let s=Lu(i);s!==void 0&&(o!==void 0&&o!==s&&_e(`an element-wise \`${n}\` mixes vec${o} and vec${s} operands.`),o=s)}return o}if(f.isComplexValued(e))return;let r=f.vectorComponentCount(e);if(r!==void 0)return e.type.matches("indexed_collection<boolean>")||_e(`the condition \`${e.toString()}\` is a collection of \`${e.type.toString()}\`, not of booleans.`),r;f.isNonScalarShape(e)&&_e(`the condition \`${e.toString()}\` is not a shader scalar and has no static vec2\u2013vec4 shape.`)}function Au(e,n){if(e.length===1)return e[0];let t=Ve(n);return`${Ir(n)}(${e.map(r=>`${t}(${r})`).join(" * ")})`}function kf(e,n){if(e.length===1)return e[0];let t=Ve(n);return`${Ir(n)}(${e.map(r=>`${t}(${r})`).join(" + ")})`}function zu(e,n,t,r){let o=Ir(n),i=Ve(n);if(C(e,"True"))return`${o}(true)`;if(C(e,"False"))return`${o}(false)`;if(_(e,"List"))return`${o}(${e.ops.map(u=>C(u,"True")?"true":C(u,"False")?"false":t(u)).join(", ")})`;let s=e.operator,a=_(e)?e.ops:[];if(Mo(s)){let u=si[s];u===void 0&&_e(`the relation \`${s}\` has no componentwise shader form.`);let l=(h,g)=>{let y=g?ae(s,h,t,r):t(h);return Ie(h)===void 0?`${i}(${y})`:y},c=a.some((h,g)=>g>=1&&g<=a.length-2&&h.isPure===!1),p=a.map(h=>l(h,c&&h.isPure===!1)),d=[];for(let h=0;h<p.length-1;h++)d.push(`${u}(${p[h]}, ${p[h+1]})`);return Au(d,n)}if(s==="And"||s==="Or"||s==="Not"){let u=a.map(l=>zu(l,n,t,r));if(s==="Not"){if(u.length!==1)throw new Error("Could not compile `Not`: expected one argument");return`not(${u[0]})`}return s==="And"?Au(u,n):kf(u,n)}return!f.isComplexValued(e)&&f.vectorComponentCount(e)!==void 0?t(e):`${o}(${t(e)})`}function Fu(e,n,t){let r;for(let u=0;u<e.length;u+=2){let l=Lu(e[u]);l!==void 0&&(r!==void 0&&r!==l&&_e(`the conditions of an element-wise selection mix vec${r} and vec${l}.`),r=l)}if(r===void 0)return null;let o=r,i=Ve(o),s=u=>{f.isComplexValued(u)&&_e(`an element-wise selection cannot have a complex-valued arm (\`${u.toString()}\`) \u2014 a compiled complex value is a \`vec2\` of (re, im), which has no cell convention inside a selection.`),ku(u)&&_e(`an element-wise selection cannot have a tuple arm (\`${u.toString()}\`) \u2014 a lifted point would be a list of points, which is not a GPU value.`),(C(u,"True")||C(u,"False")||u.type.matches("boolean")||u.type.matches("indexed_collection<boolean>"))&&_e(`an element-wise selection cannot have a boolean-valued arm (\`${u.toString()}\`) \u2014 a GPU selection produces one numeric vector, and there is no boolean-cell convention. Use numeric arms (e.g. 1 and 0) instead.`);let l=Ie(u);if(l===o)return n(u);if(l===void 0&&!f.isNonScalarShape(u))return`${i}(${n(u)})`;_e(`the arm \`${u.toString()}\` does not fit the vec${o} shape of the element-wise conditions (the interpreter answers \`incompatible-dimensions\`).`)},a=`${i}(${le(t)})`;for(let u=e.length-2;u>=0;u-=2){let l=s(e[u+1]);if(C(e[u],"True")){a=l;continue}let c=zu(e[u],o,n,t);a=`mix(${a}, ${l}, ${c})`}return a}function Lf(e,n){return!f.foldValueImpure(e)&&!we(e,n)}function zf(e,n,t,r,o,i){if(t.length===0)throw new Error(`Could not compile \`${e}\`: needs at least one argument`);if(t.length===1)return ve(t[0],r,i);let s=t.map(j),a=o?.scalarGenTypeSlots.get(e),u=a!==void 0&&t.length>2,l=`${e}(${r(t[0])}, ${r(t[1])})`,c=s[0];for(let p=1;p<t.length;p++){if(p>1&&(l=`${e}(${l}, ${r(t[p])})`),u){let d=[c,s[p]],h=d.findIndex((g,y)=>g==="scalar"&&!a.has(y)&&d[1-y]!=="scalar");if(h>=0)throw new Error(`Could not compile \`${n}\`: the shader builtin \`${e}\` takes a scalar only ${ht(a)}, but the emitted call \`${l}\` has a scalar in argument ${h+1}, where the overload requires the \`vecN\` genType; the scalar is not promoted to a vector.`)}c==="scalar"&&(c=s[p])}return l}function ki(e,n,t,r,o){let i=()=>zf(e,n,t,r,au(o),o);if(t.length<2||t.some(g=>f.isComplexValued(g)))return i();let s=t.map(j),a=t.every(g=>We(g,o,!0));if(a&&new Set(s).size===1&&(s[0]==="scalar"||typeof s[0]=="number")||!s.every(g=>g==="scalar"||typeof g=="number"))return i();let u=new Set(s.filter(g=>typeof g=="number"));if(u.size>1)return i();let l=u.size===1?[...u][0]:void 0,c=l===void 0?"":ie(l),p=t.map((g,y)=>l!==void 0&&s[y]==="scalar"?`${c}(${r(g)})`:r(g)),d=a?e:`_gpu_${e}${l??""}`,h=p[0];for(let g=1;g<p.length;g++)h=`${d}(${h}, ${p[g]})`;return h}function ro(e,n,t){let r=Ee(n),o,i;if(r!==void 0&&pn.test(r.callee)){if(r.operands.some(h=>Hl.test(h)))return;let p=r.operands.length;if(p===0)return;let d=/^([iub]?)vec([234])([fhiu]?)\s*(<[^<>]*>)?$/.exec(r.callee.trim());if(d!==null){let h=Number(d[2]);if(p===h)return r.operands;if(p>h)return;if(p===1&&/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(r.operands[0].trim()))return Array.from({length:h},()=>r.operands[0]);if(r.operands.every(y=>be(y)))return["x","y","z","w"].slice(0,h).map(y=>`${n.trim()}.${y}`);if(!on(t)&&Lf(e,t))return["x","y","z","w"].slice(0,h).map(y=>`${n.trim()}.${y}`);o=h,i=r.callee.trim()}else{let h=/^mat([234])(?:x([234]))?/.exec(r.callee.trim());if(h!==null){let g=Number(h[1]),y=h[2]===void 0?g:Number(h[2]);if(p!==g*y)return}return r.operands}}if(o===void 0){let p=j(e);if(typeof p!="number")return;o=p}let s=["x","y","z","w"].slice(0,o);if(/^[A-Za-z_]\w*$/.test(n))return s.map(p=>`${n}.${p}`);if(!f.canHoist(t))return;let a=f.foldValueImpure(e);a&&He(e.operator,[e],t),xe(C(e)?e.symbol:e.operator,[e],t);let u=f.tempVar(t),c=`${i??`vec${o}`} ${u}`;return f.hoistStatement(t,`${c} = ${n};`),a&&Oe([e],t),s.map(p=>`${u}.${p}`)}function Li(e,n,t,r,o){if(t.length===0)throw new Error(`Could not compile \`${n}\`: needs at least one argument`);let i=t.map(j),s=t.map(p=>p.isCollection&&p.count===0),a=t.map((p,d)=>s[d]?"":r(p)),u=a.map((p,d)=>{if(s[d]||i[d]!=="scalar")return!0;let h=Ee(p);return h!==void 0&&pn.test(h.callee)}),l=p=>{let d=p[0];for(let h=1;h<p.length;h++)d=`_gpu_${e}(${d}, ${p[h]})`;return d};if(!u.some(p=>p))return a.length===1?ct(t[0],a[0],o):t.every(p=>We(p,o,!0))?a.slice(1).reduce((p,d)=>`${e}(${p}, ${d})`,a[0]):l(a);let c=[];for(let p=0;p<t.length;p++){if(s[p])continue;if(!u[p]){c.push(a[p]);continue}let d=ro(t[p],a[p],o);if(d===void 0)throw new Error(`Could not compile \`${n}\`: the operand \`${t[p].toString()}\` lowers to a shader ${Ge(i[p])} with no compile-time component list, so there is nothing for the reduction to fold over \u2014 a shader has no dynamic iteration here, and the \`${e}\` builtin is componentwise, not a reduction.`);c.push(...d)}return c.length===0?`(${le(o)})`:t.every((p,d)=>s[d]||We(p,o,!0))?`(${c.slice(1).reduce((p,d)=>`${e}(${p}, ${d})`,c[0])})`:`(${l(c)})`}function zi(e,n,t,r){let o=e==="GCD"?"_gpu_gcd":"_gpu_lcm",i=[];for(let a of n){if(a==null)throw new Error(`Could not compile \`${e}\`: missing argument`);if(a.isCollection&&a.count===0)continue;let u=t(a),l=Ee(u);if(!(j(a)!=="scalar"||l!==void 0&&pn.test(l.callee))){i.push(u);continue}let p=ro(a,u,r);if(p===void 0)throw new Error(`Could not compile \`${e}\`: the operand \`${a.toString()}\` lowers to a shader ${Ge(j(a))} with no compile-time component list, so there is nothing for the fold to run over.`);i.push(...p)}if(i.length===0)return q(e==="GCD"?0:1,r.language);if(i.length===1)return`abs(${i[0]})`;let s=i[0];for(let a=1;a<i.length;a++)s=`${o}(${s}, ${i[a]})`;return s}function Dt(e){return Ue(e)?e.string?.toLowerCase()??null:null}function Fi(e,n,t){let r=X(n);if(r!==void 0&&Number.isInteger(r))return r.toString();if(f.isComplexValued(n))throw new Error(`Could not compile \`${e}\`: the integer operand \`${n.toString()}\` is complex, and a shader has no conversion from a complex value to an integer.`);return`int(${t(n)})`}var oo=100;function Ni(e,n,t){if(B(n)&&!Number.isFinite(n.re)||n.type.matches("infinity")||n.type.matches("nan"))throw new Error(`Could not compile \`${e}\`: the ${t} bound \`${n.toString()}\` is not a finite number \u2014 an infinite or NaN bound has no terminating loop.`)}var Nu=8;function _t(e,n,t){let r=typeof t=="number"?t:void 0;return(t==="scalar"||r!==void 0)&&n>=2&&n<=4?`_gpu_pow${n}${r===void 0?"":`_v${r}`}(${e})`:`_gpu_powi${r??""}(${e}, ${ue(n)})`}function Gu(e){let n=new Set,t=/(?<![\w$])(_gpu_pow([234])(?:_v([234]))?)\s*\(/g,r="";for(let o of e.matchAll(t)){let i=o[1];if(n.has(i))continue;n.add(i);let s=o[3]?ie(Number(o[3])):"float",a=o[2]==="2"?"return x * x;":o[2]==="3"?"return x * x * x;":`${s} s = x * x; return s * s;`;r+=`
${s} ${i}(${s} x) { ${a} }
`}return r}var Bt=8,Gi=([e,n],t,r)=>{if(e==null||n===null||n===void 0)throw new Error("Could not compile `Binomial`: need two arguments");let o=X(n);if(o===void 0||!Number.isInteger(o)||o<0)throw new Error("Could not compile `Binomial`: only a literal non-negative integer second operand compiles \u2014 anything else is inert in the interpreter.");if(o>Bt)throw new Error(`Could not compile \`Binomial\`: a second operand above ${Bt} would unroll to ${o} factors.`);if(f.isComplexValued(e))throw new Error("Could not compile `Binomial`: a complex first operand has no GPU lowering.");if(B(e)&&!Number.isFinite(e.re)||e.type.matches("infinity")||e.type.matches("nan"))throw new Error("Could not compile `Binomial`: a statically non-finite first operand evaluates to NaN in the interpreter, not a falling factorial.");if(o===0){if(e.isPure===!1)throw new Error("Could not compile `Binomial`: a second operand of 0 discards the first, but an impure (Random) first operand is still drawn by the interpreter.");return q(1,r.language)}if(o===1)return ve(e,t,r);let i=ae("Binomial",e,t,r),s=[`(${i})`];for(let u=1;u<o;u++)s.push(`((${i}) - ${q(u,r.language)})`);let a=1;for(let u=2;u<=o;u++)a*=u;return`((${s.join(" * ")}) / ${q(a,r.language)})`};function Ff(e){if(_(e,"Square")&&e.ops.length===1||_(e,"Power")&&e.ops.length===2&&X(e.ops[1])===2)return e.ops[0]}function Iu(e,n,t,r){let o=e==="Sum"?"0.0":"1.0",i=e==="Sum"?" + ":" * ";if(n.isCollection&&n.count===0)return o;let s=e==="Sum"?Ff(n):void 0,a=s===void 0?void 0:j(s);if(s!==void 0&&s.isPure&&typeof a=="number"&&!f.isComplexValued(n)&&!Je(n,r.cse?.harvestOptions)&&!r.foldExcludedOps?.has(n.operator)){let h=t(s),g=we(s,r);if(g&&!f.canHoist(r)&&rn("Sum",[s],r),!be(h)&&f.canHoist(r)){g&&xe("Sum",[s],r);let y=f.tempVar(r),x=`${`vec${a}`} ${y}`;f.hoistStatement(r,`${x} = ${h};`),h=y}return`dot(${h}, ${h})`}let u=j(n),l=t(n),c=Ee(l);if(!(!f.isComplexValued(n)&&(u!=="scalar"||c!==void 0&&pn.test(c.callee))))throw new Error(`Could not compile \`${e}\`: the operand \`${n.toString()}\` is not a collection (type \`${n.type.toString()}\`), so there is nothing to reduce over \u2014 this is the collection form of ${e}, which takes no indexing set.`);let d=ro(n,l,r);if(d===void 0)throw new Error(`Could not compile \`${e}\`: the operand \`${n.toString()}\` lowers to a shader ${Ge(u)} with no compile-time component list, so there is nothing for the reduction to fold over \u2014 a shader has no dynamic iteration here.`);return`(${d.map(h=>`(${h})`).join(i)})`}function Ii(e,n){let t=f.bigOpBoundConstant(e);if(t!==void 0)return t;let r=f.foldedRealNumber(e,n);if(r===void 0||!Number.isFinite(r)||Math.fround(r)!==r)return;let o=Math.floor(r);return o>=-(2**31)&&o<2**31-1?o:void 0}var Nf=new Set(["int","uint","float","floor"]);function Oi(e){let n=e.trim();if(/^-?\d+(?:\.\d*)?$/.test(n)||/^[A-Za-z_]\w*$/.test(n))return!0;let t=/^([A-Za-z_]\w*)\((.*)\)$/.exec(n);if(t===null||!Nf.has(t[1]))return!1;let r=t[2],o=0;for(let i of r)if(i==="(")o+=1;else if(i===")"){if(o===0)return!1;o-=1}return o===0&&Oi(r)}function Mi(e,n){let t=[],r=[...n];for(let o=e.length-1;o>=0;o--){let[i,s]=e[o],a=new RegExp(`(?<![\\w$])${i}(?![\\w$])`);r.some(u=>a.test(u))&&(t.unshift(e[o]),r.push(s))}return t}function Ui(e,n,t){return`${pe(t)??"float"} ${e} = ${n};`}function jt(e,n){return f.compileValueOperand(e,n,Fe.Multiply[1])}var Ou=2**24,so=new WeakMap;function io(e,n){return Number.isInteger(e)&&Number.isInteger(n)&&e>=-Ou&&n<=Ou&&e<=n}function Bi(e,n,t,r,o){if(!e.boundVars||!io(t,r))return;let i=so.get(e.boundVars);i||so.set(e.boundVars,i=new Map);let s=e.var(n);s!==void 0&&i.set(n,{min:t,max:r,code:o,reference:s})}function Di(e){e.boundVars&&so.delete(e.boundVars)}function ji(e,n,t,r=0){if(r>32)return;if(B(e))return!e.isComplex&&io(e.re,e.re)?{min:e.re,max:e.re,code:String(e.re)}:void 0;if(C(e)){let u=n.boundVars?so.get(n.boundVars)?.get(e.symbol):void 0;return u&&u.reference===n.var(e.symbol)?u:void 0}if(!_(e)||Je(e)||!t(e.operator)||!["Add","Subtract","Negate","Multiply"].includes(e.operator))return;let o=e.ops.map(u=>ji(u,n,t,r+1));if(o.some(u=>u===void 0))return;let i=o;if(e.operator==="Negate"&&i.length===1){let u=i[0];return{min:-u.max,max:-u.min,code:`(-(${u.code}))`}}if(e.operator==="Subtract"&&i.length===2){let[u,l]=i,c=u.min-l.max,p=u.max-l.min;return io(c,p)?{min:c,max:p,code:`(${u.code} - ${l.code})`}:void 0}if(!["Add","Multiply"].includes(e.operator)||i.length===0)return;let s=e.operator==="Multiply",a=i[0];for(let u of i.slice(1)){let l=s?[a.min*u.min,a.min*u.max,a.max*u.min,a.max*u.max]:[a.min+u.min,a.max+u.max],c=Math.min(...l),p=Math.max(...l);if(!io(c,p))return;a={min:c,max:p,code:`(${a.code} ${s?"*":"+"} ${u.code})`}}return a}function Vi(e){if(_(e,"List")||_(e,"Tuple")){let t=e.ops;for(let r=0;r<t.length;r++){if(f.isNonScalarShape(t[r]))return`element ${r+1} of the base is itself an aggregate (type \`${t[r].type.toString()}\`), so it is not one component of a shader vector`;if(!D(ee(t[r]),"number"))return`element ${r+1} of the base (type \`${t[r].type.toString()}\`) is not provably scalar numeric, and a shader value has no other element domain here`}return}let n=ee(e);if(typeof n!="string"){if(n.kind==="tuple"){for(let t=0;t<n.elements.length;t++)if(!Vn(n.elements[t].type))return`slot ${t+1} of the base tuple (type \`${Pe(n.elements[t].type)}\`) is not a REAL scalar \u2014 a shader vector's components are single floats, and a shader value has no other element domain here`;return}if(n.kind==="list")return Vn(n.elements)?void 0:`the base's element type \`${Pe(n.elements)}\` is not a REAL scalar \u2014 a shader vector's components are single floats, and a shader value has no other element domain here`}return`the base (type \`${e.type.toString()}\`) states no element type, so its elements are not provably scalar numeric`}function Gf(e){if(!C(e)||f.localShapeFrameOf(e.symbol)===void 0)return"unframed";let n=Ae(e);if(n?.value!==void 0&&n.value.element!=="f")return`the base is declared "${n.spelling}" by the caller, whose components are not floats \u2014 a positional shader access reads one float component, and GLSL does not convert between the component types`}function qi(e){let n=Ae(e);if(n===void 0){if(C(e)&&f.isLocalBoolean(e.symbol))return{decline:"the index is a shader `bool`, and a positional access indexes by a number \u2014 GLSL does not convert a boolean to one"};if(C(e)&&f.localShapeFrameOf(e.symbol)){let r=f.aggregateComponentCount(e);if(r!==void 0)return{decline:`the index is the local name "${e.symbol}", which holds an aggregate of ${r} components, not a scalar number \u2014 a positional shader access indexes by a float, and neither language converts an aggregate to one`}}return}let t=n.value;return t===void 0||t.width>1||t.element==="b"?{decline:`the index is declared "${n.spelling}" by the caller, which is not a scalar number \u2014 a positional shader access indexes by a float, and GLSL does not convert to one implicitly`}:t.element==="f"||An(t)?void 0:{cast:!0}}function Hi(e,n){let t=e.symbol,r=`the base "${t}" is ${n}-backed (storage hint)`;if(f.localShapeFrameOf(t)!==void 0)return{decline:`${r}, but here "${t}" is a declared or local name whose shape comes from its declaration, not from the engine type the hint applies to \u2014 a name with a storage hint must be a free symbol of the expression`};let o=Qn(e.type.type),i=e.type.toString();if(typeof o=="string"||o.kind!=="list")return{decline:`${r}, which requires a one-dimensional fixed-length list of numbers, but its type is \`${i}\``};let s=o.dimensions??[];if(s.length>1)return{decline:`${r}, which requires a ONE-dimensional list laid out in the texture, but its type \`${i}\` is ${s.length}-dimensional`};let a=s[0]??-1;if(a<0)return{decline:`${r}, but its type \`${i}\` states no static length, and the texture read bounds the index by the list's declared length`};if(a===0)return{decline:`${r}, but its type \`${i}\` is an empty list, which has no element to read`};let u=Vi(e);return u!==void 0?{decline:`${r}, and ${u}`}:{count:a,storage:n}}function Mu(e,n){if(e===null)return{decline:"it has no base operand"};if(C(e)){let a=n.storage?.get(e.symbol);if(a!==void 0)return Hi(e,a)}let t=ee(e);if(C(e,"Missing")||t==="missing")return{decline:"the base is the absence marker (`Missing`), which has no shader value to index into"};if(!_(e,"List")&&!_(e,"Tuple")&&f.isComplexValued(e))return{decline:"the base is a complex value (lowered as `vec2(re, im)` by the complex convention), not an indexable collection"};if(_(e,"Dictionary")||typeof t!="string"&&(t.kind==="dictionary"||t.kind==="record"))return{decline:`the base is a dictionary (type \`${e.type.toString()}\`) and a shader has no keyed lookup \u2014 only positional access into a value of static shape`};if(t==="tuple")return{decline:"the base is an unparameterized `tuple`, which states no arity, so there is no static element count to index against"};let r=f.aggregateComponentCount(e),o=!1;if(r===void 0&&_(e)&&e.operator!=="List"&&e.operator!=="Tuple"){let a=e.type.type,u=f.typeWithFreeInputsAsNumbers(e,n);u!==a&&(r=ft(u),o=r!==void 0)}if(r===void 0){if(C(e)){let a=Ae(e);if(a!==void 0&&a.value===void 0)return{decline:`the base is the caller-declared name "${e.symbol}", whose declared shader type \`${a.spelling}\` is not one this target reads \u2014 it parses the scalar spellings and the two-to-four component vector spellings that GLSL reads (\`vec3\`, \`ivec3\`), and no array, matrix or struct type. The declaration decides the shape of a declared name, so no static element count reaches the analysis (the engine type \`${e.type.toString()}\` is not consulted for a declared name)`}}return typeof t!="string"&&t.kind==="list"?(t.dimensions?.length??0)>=2?{decline:`the base (type \`${e.type.toString()}\`) is multi-axis; only a one-dimensional base has a positional shader lowering`}:{decline:`the base (type \`${e.type.toString()}\`) has no statically known length, and a shader value must have one`}:{decline:`the base (type \`${e.type.toString()}\`) is not a statically counted collection`}}if(r<0)return{decline:`the base (type \`${e.type.toString()}\`) has no statically known length, and a shader value must have one`};if(r===0)return{decline:"the base is empty, and GLSL has no zero-length value type"};if(r===1)return{decline:"the base has 1 element: there is no `vec1`, and a 1-element aggregate has no shader value shape of its own"};if(o)return{count:r};let i=Gf(e);if(i!=="unframed")return i===void 0?{count:r}:{decline:i};let s=Vi(e);return s!==void 0?{decline:s}:{count:r}}function lo(e,n){if(!Number.isInteger(e)||e===0)return null;let t=e>0?e-1:n+e;return t>=0&&t<n?t:null}function uo(e,n,t,r){if(_(e,"List")||_(e,"Tuple"))return r(e.ops[n]);let o=r(e),i=t<=4?`.${"xyzw"[n]}`:`[${n}]`;return be(o)?`${o}${i}`:`(${o})${i}`}function Uu(e,n,t){return!(_(e,"List")||_(e,"Tuple"))&&t<=4&&n.every(o=>o!==null)}function Bu(e,n,t){return Uu(e,n,t)?1:n.filter(r=>r!==null).length}function Du(e,n,t,r,o){if(Uu(e,n,t)){let a=r(e),u=n.map(l=>"xyzw"[l]).join("");return be(a)?`${a}.${u}`:`(${a}).${u}`}let i=`vec${n.length}`,s=n.map(a=>a===null?le(o):uo(e,a,t,r));return`${i}(${s.join(", ")})`}function ju(e){return C(e,"True")||C(e,"False")?"bool":B(e)?!e.isComplex&&Number.isInteger(e.re)?"int":"other-literal":Ue(e)||C(e,"Missing")||_(e,"List")||_(e,"Tuple")||_(e,"Dictionary")?"other-literal":D(ee(e),"boolean")?"dyn-bool":"dyn"}function Vu(e,n){let t=s=>`vec${s}`,r=(s,a,u)=>`vec${s}[${a}](${u.join(", ")})`;if(_(e,"PointList")){let s=e.ops;if(s.length<2||s.length>4)return{decline:`the points of the base have ${s.length} coordinates, and a shader vector holds 2 to 4`};let a,u=[];for(let p=0;p<s.length;p++){let d=s[p];if(Br(d)){let h=f.aggregateComponentCount(d);if(h===void 0||h<1)return{decline:`source component ${p+1} of the point list (type \`${d.type.toString()}\`) has no statically known length, and a shader array must have one`};let g=Vi(d);if(g!==void 0)return{decline:`in source component ${p+1}, ${g}`};if(!d.isPure)return{decline:`source component ${p+1} of the point list is impure, and the array of points references it once per point`};u.push(h),a=a===void 0?h:Math.min(a,h)}else{if(!D(ee(d),"number")||f.isComplexValued(d))return{decline:`component ${p+1} of the point list (type \`${d.type.toString()}\`) is neither a list source nor a provably real scalar`};if(!d.isPure)return{decline:`component ${p+1} of the point list is impure, and the array of points references it once per point`};u.push(void 0)}}if(a===void 0)return{decline:"no component is a list source, so this is not a point LIST"};let l=a,c=p=>`${t(s.length)}(${s.map((d,h)=>u[h]===void 0?n(d):uo(d,p,u[h],n)).join(", ")})`;return{m:s.length,n:l,point:c,source:()=>r(s.length,l,Array.from({length:l},(p,d)=>c(d)))}}let o=Mr(ee(e));if(typeof o!="number")return o;let i=_(e,"List")?e.nops:f.aggregateComponentCount(e);return i===void 0||i<1?{decline:`the base (type \`${e.type.toString()}\`) has no statically known number of points, and a shader array must have one`}:{m:o,n:i,point:s=>{if(_(e,"List"))return n(e.ops[s]);let a=n(e);return be(a)?`${a}[${s}]`:`(${a})[${s}]`},source:()=>n(e)}}function qu(e,n,t,r,o,i){let{m:s,n:a}=e,u=`vec${s}(${le(o)})`;if((_(t,"List")||D(ee(t),wn))&&i("the index is a collection, so the result is a list of points, which has no shader value shape here"),C(t,"Missing")||D(ee(t),"missing"))return n.isPure||i("the access folds to a vector of NaN components, which would DISCARD the impure base unevaluated"),u;if((f.isComplexValued(t)||!Le(ee(t),"number"))&&i(`the index (type \`${t.type.toString()}\`) is not a real number, so it selects no point`),B(t)&&n.isPure){let d=lo(t.re,a);return d===null?u:e.point(d)}let l=qi(t);l!==void 0&&"decline"in l&&i(l.decline);let c=r(t),p=l===void 0?c:`float(${c})`;return`_gpu_atp${s}_${a}(${e.source()}, ${p})`}function Hu(e,n){let t=en(NaN,"glsl"),{guard:r,doc:o}=po(n);return`
vec${e} _gpu_atp${e}_${n}(vec${e} v[${n}], float i) {
${o}
  if (${r})
    return vec${e}(${t});
  int k = int(i);
  return v[(k > 0) ? k - 1 : ${n} + k];
}
`}function Wu(e){let n=new Map,t=/(?<![\w$])_gpu_atp([234])_(\d+)\s*\(/g,r;for(;(r=t.exec(e))!==null;)n.set(`${r[1]}_${r[2]}`,[Number(r[1]),Number(r[2])]);return[...n.values()]}function Wi(e,n){return n.boundVars?.has(e)===!0||f.localShapeFrameOf(e)!==void 0}var ao;function Yu(e,n){let t=ao;ao=e.symbol;try{return n(e)}finally{ao=t}}function Yi(e,n,t){let r=n.get(e);if(!(r===void 0||ao===e))throw new Error(`Could not compile \`${e}\`: the symbol is ${r}-backed (compile option \`storage: { ${e}: '${r}' }\`), and a texture has no shader value of its own on the ${t} target: it can be read only through a positional access (\`At(${e}, i)\`). Here it is referenced as a whole \u2014 as an operand, in a reduction, or as a bare value \u2014 which has no lowering.`)}function Ku(e){let n=en(NaN,"glsl"),{guard:t,doc:r}=po(e),o=e<=4?`vec${e} v`:`float v[${e}]`;return`
float _gpu_at${e}(${o}, float i) {
${r}
  if (${t})
    return ${n};
  int k = int(i);
  return v[(k > 0) ? k - 1 : ${e} + k];
}
`}function po(e,n="i"){let t=q(e,"glsl");return{guard:`!(${n} >= -${t} && ${n} <= ${t}) || ${n} != floor(${n}) || ${n} == 0.0`,doc:`  // 1-based; negative counts from the end; anything else \u2192 NaN.
  // The guard runs entirely in float space: it rejects NaN, \xB1\u221E, huge
  // finite values, non-integers and 0 BEFORE the int cast (undefined
  // outside int range), and makes the out-of-bounds index (undefined
  // behavior in GLSL) unreachable.`}}function Xu(e){let n=en(NaN,"glsl"),{guard:t,doc:r}=po(e);return`
float _gpu_texat${e}(sampler2D v, float i) {
${r}
  if (${t})
    return ${n};
  int k = int(i);
  k = (k > 0) ? k - 1 : ${e} + k;
  // Row-major in a texture of run-time width; the host guarantees at least
  // ${e} texels, so the coordinate is in range whenever the guard passed.
  int w = textureSize(v, 0).x;
  return texelFetch(v, ivec2(k % w, k / w), 0).r;
}
`}function Zu(e){return Qu(e,/(?<![\w$])_gpu_at(\d+)\s*\(/g)}function Ju(e){return Qu(e,/(?<![\w$])_gpu_texat(\d+)\s*\(/g)}function Qu(e,n){let t=new Set,r;for(;(r=n.exec(e))!==null;)t.add(Number(r[1]));return[...t].sort((o,i)=>o-i)}var ep=new Map,If=/^(?:fn[^\S\n]+([A-Za-z_]\w*)|(?:(?:highp|mediump|lowp)[^\S\n]+)?[A-Za-z_]\w*(?:\[\d+\])?[^\S\n]+([A-Za-z_]\w*))[^\S\n]*\(/;function Of(e){let n=ep.get(e);if(n!==void 0)return n;let t=[],r=[],o="",i,s=0;for(let a of e.split(`
`)){if(r.length===0&&a.trim()===""){o+=`
`;continue}r.push(a);let u=a.replace(/\/\/.*$/,"");if(i===void 0){let l=If.exec(u);l!==null&&(i=l[1]??l[2])}for(let l of u)l==="{"?s+=1:l==="}"&&(s-=1);i!==void 0&&s===0&&u.includes("}")&&(t.push({name:i,source:r.join(`
`),lead:o,reference:new RegExp(`(?<![\\w$])${i}(?![\\w$])`),calls:[]}),r=[],o="",i=void 0)}for(let a=0;a<t.length;a++)for(let u=0;u<a;u++)t[u].reference.test(t[a].source)&&t[a].calls.push(u);return ep.set(e,t),t}function he(e,n){let t=Of(n),r=t.map(i=>i.reference.test(e));for(let i=t.length-1;i>=0;i--)if(r[i])for(let s of t[i].calls)r[s]=!0;let o="";for(let i of t.filter((s,a)=>r[a]))o+=`${o===""?i.lead||`
`:i.lead}${i.source}
`;return o}function Vt(e,n,t,r,o,i=1){let s=typeof e=="string"?e:"Round",a=(P,G)=>typeof e=="string"?`${e}(${P})`:e(P,G),u=X(t);if(u!==void 0&&(u===0||!Number.isFinite(u)))throw new Error(`Could not compile \`${s}\` with a step of ${u}: the result is NaN, and the ${o.language??"GPU"} target has no NaN literal.`);let l=u!==void 0?q(Math.abs(u),o.language):`abs(${ae(s,t,r,o)})`;if(j(n)==="scalar"){let P=ae(s,n,r,o);return`_gpu_step_fix(${`${a(`${i===1?"_gpu_step_quotient":"_gpu_half_step_quotient"}(${P}, ${l})`,!0)} * ${l}`}, ${P}, ${l})`}let c=j(n);if(typeof c!="number")throw new Error(`Could not compile \`${s}\` with a step: the operand is not a scalar or a vector.`);let p=ie(c),d=(P,G,k,R,I)=>{let H={"<=":"lessThanEqual",">":"greaterThan","==":"equal"}[R];return`mix(${P}, ${G}, ${H}(${k}, ${I}))`},h=f.canHoist(o),g=(P,G)=>{if(!h||/^[A-Za-z_]\w*$/.test(P))return P;let k=f.tempVar(o);return f.hoistStatement(o,`${G} ${k} = ${P};`),k},y=g(ae(s,n,r,o),p),w=u!==void 0?l:g(l,nn()),x=g(`(${y} / ${w})`,p),$=u!==void 0?"1.17549435e-38":`(${w} < 3.4e38 ? 1.17549435e-38 : 0.0)`,A=g(d(x,`(sign(${y}) * ${$})`,x,"==",`${p}(0.0)`),p),E=i===1?`round(${A})`:`(round(${A} * 2.0) * 0.5)`,z=g(d(A,E,`abs(${A} - ${E})`,"<=",`4.8e-7 * abs(${A})`),p),N=`(${a(z,!1)} * ${w})`,M=u!==void 0?`abs(${x})`:`(abs(${x}) * sign(${w}))`;return`(${d(N,y,M,">",`${p}(3.4e38)`)})`}function co(e,n,t){if(n==="to-even")return`roundEven(${e})`;if(t)return`${{"away-from-zero":"_gpu_round","toward-zero":"_gpu_round_tz","toward-positive-infinity":"_gpu_round_up","toward-negative-infinity":"_gpu_round_down"}[n]}(${e})`;let r=a=>`ceil(0.5 + 0.5 * sign(${a} - 0.5))`,o=a=>`floor(0.5 + 0.5 * sign(${a} - 0.5))`,i=/^[\w.]+$/.test(e)?e:`(${e})`,s=`floor(abs(${e}))`;switch(n){case"away-from-zero":return`(sign(${e}) * (${s} + ${r(`abs(${e}) - ${s}`)}))`;case"toward-zero":return`(sign(${e}) * (${s} + ${o(`abs(${e}) - ${s}`)}))`;case"toward-positive-infinity":return`(floor(${e}) + ${r(`${i} - floor(${e})`)})`;case"toward-negative-infinity":return`(ceil(${e}) - ${r(`ceil(${e}) - ${i}`)})`}}function np(e){let n=ie(e);return`
${n} _gpu_powi${e}(${n} x, float n) {
  if (n == 0.0) return ${n}(1.0);
  if (n == 2.0) return x * x;
  if (n == 3.0) return x * x * x;
  if (n == 4.0) { ${n} s = x * x; return s * s; }
  ${n} r = pow(abs(x), ${n}(n));
  if (mod(abs(n), 2.0) == 1.0) return mix(${n}(1.0), ${n}(-1.0), lessThan(x, ${n}(0.0))) * r;
  return r;
}
`}function tp(e){let n=/(?<![\w$])_gpu_powi\s*\(/.test(e),t=new Set,r=/(?<![\w$])_gpu_powi([234])\s*\(/g,o;for(;(o=r.exec(e))!==null;)t.add(Number(o[1]));return[...n?["scalar"]:[],...[...t].sort((i,s)=>i-s)]}var rp=[2,3,4];function Mf(){return[["_gpu_fmod","float"],...rp.map(n=>[`_gpu_fmod${n}`,`vec${n}`])].map(([n,t])=>`${t} ${n}(${t} x, ${t} y) {
  ${t} r = mod(mod(x, y), y);
  r = r + y * (1.0 - step(0.0, r * sign(y)));
  return r - y * step(abs(y), r * sign(y));
}`).join(`
`)}var Ki=`
${Mf()}
`;function Xi(e,n,t){if(f.isComplexValued(e)||f.isComplexValued(n))return;let r=j(e),o=j(n),i=c=>c==="scalar"||typeof c=="number";if(!i(r)||!i(o))return;if(r==="scalar"&&o==="scalar")return`_gpu_fmod(${t(e)}, ${t(n)})`;if(typeof r=="number"&&typeof o=="number"&&r!==o)return;let s=typeof r=="number"?r:o,a=ie(s),u=r==="scalar"?`${a}(${t(e)})`:t(e),l=o==="scalar"?`${a}(${t(n)})`:t(n);return`_gpu_fmod${s}(${u}, ${l})`}function Zi(e,n){return`tanh(${n(e)})`}function Uf(){let e="0x7FFFFFFFu",n="0x7F800000u",t=[1,...rp],r=u=>u===1?"":`${u}`,o=(u,l)=>`_gpu_isnan${r(u)}(${l})`,i=(u,l,c,p)=>u===1?`(${p} ? ${c} : ${l})`:`mix(${l}, ${c}, ${p})`,s=[];for(let u of t)for(let[l,c,p]of[["_gpu_isnan",">","greaterThan"],["_gpu_isnonfinite",">=","greaterThanEqual"]]){let d=`${l}${r(u)}`;u===1?s.push(`bool ${d}(float x) {
  return (floatBitsToUint(x) & ${e}) ${c} ${n};
}`):s.push(`bvec${u} ${d}(vec${u} x) {
  return ${p}(floatBitsToUint(x) & ${e}, uvec${u}(${n}));
}`)}let a=(u,l,c,p)=>`${c} ${u}(${l.map(d=>`${c} ${d}`).join(", ")}) {
  return ${p};
}`;for(let u of t){let l=u===1?"float":`vec${u}`,c=r(u);for(let y of["max","min"])s.push(a(`_gpu_${y}${c}`,["a","b"],l,i(u,i(u,`${y}(a, b)`,"b",o(u,"b")),"a",o(u,"a"))));s.push(a(`_gpu_clamp${c}`,["x","lo","hi"],l,i(u,i(u,i(u,"min(max(x, lo), hi)","hi",o(u,"hi")),"lo",o(u,"lo")),"x",o(u,"x")))),s.push(a(`_gpu_sign${c}`,["x"],l,i(u,"sign(x)","x",o(u,"x"))));for(let y of["sin","cos"]){let w=`_gpu_isnonfinite${c}(x)`,x=u===1?"intBitsToFloat(0x7FC00000)":`${l}(intBitsToFloat(0x7FC00000))`;s.push(a(`_gpu_${y}${c}`,["x"],l,i(u,`${y}(x)`,x,w)))}let p=y=>u===1?y:`${l}(${y})`;s.push(a(`_gpu_hermite${c}`,["t"],l,`t * t * (${p("3.0")} - 2.0 * t)`));let d=u===1?"e0 == e1":"equal(e0, e1)",h=u===1?"x < e0":"lessThan(x, e0)",g=i(u,`_gpu_hermite${c}(min(max((x - e0) / (e1 - e0), ${p("0.0")}), ${p("1.0")}))`,i(u,p("1.0"),p("0.0"),h),d);s.push(a(`_gpu_smoothstep${c}`,["e0","e1","x"],l,i(u,i(u,i(u,g,"x",o(u,"x")),"e1",o(u,"e1")),"e0",o(u,"e0"))))}return s.join(`
`)}function hn(e,n,t,r){if(Bf.test(t)||We(n,r,!0))return`${e}(${t})`;let o=j(n);return o==="scalar"?`_gpu_${e}(${t})`:typeof o=="number"?`_gpu_${e}${o}(${t})`:`${e}(${t})`}var Bf=/^\(?-?\d+(?:\.\d*)?(?:e[-+]?\d+)?\)?$/,Ji=`
${Uf()}
`;function Qi(e,n,t,r,o){if(t.length!==3||t.some(l=>l==null)||t.some(l=>f.isComplexValued(l)))return;let i=t.map(j);if(e==="clamp"&&i.every(l=>l==="scalar")&&t.every(l=>We(l,o,!0))){let[l,c,p]=t.map(d=>r(d));return`min(max(${l}, ${c}), ${p})`}if(i.every(l=>l==="scalar"))return`_gpu_${e}(${t.map(l=>r(l)).join(", ")})`;let s=i[n];if(typeof s!="number"||!i.every(l=>l==="scalar"||l===s))return;let a=ie(s),u=t.map((l,c)=>i[c]==="scalar"?`${a}(${r(l)})`:r(l));return e==="clamp"&&t.every(l=>We(l,o,!0))?`min(max(${u[0]}, ${u[1]}), ${u[2]})`:`_gpu_${e}${s}(${u.join(", ")})`}function qt(e,n,t){return`${e}(${ge(n,t)})`}var op=new Set(["Rgb","Hsv","Hsl","Oklab","Oklch"]),fo=new Set(["oklch","oklab","lab","rgb","hsl","hsv"]),Ht=new Map([["srgb","_gpu_gamut_map_oklch"],["display-p3","_gpu_gamut_map_oklch_p3"]]);function es(e,n){let t=e.slice(0,3),r=`${Ne()}(${t.map(i=>n(i)).join(", ")})`;return t.every(i=>B(i)&&i.im===0&&Number.isFinite(i.re))?r:`_gpu_finite_color(${r})`}function ke(e,n,t,r){if(_(n,"List"))throw new Error(`Could not compile \`${e}\`: a list is not a color \u2014 a color operand must be a color, a color string or a tuple of 3 or 4 components.`);if(!_(n)||n.operator!=="Tuple"){if(st(n))throw new Error(`Could not compile \`${e}\`: this operator takes a COLOR, and a tuple is color COMPONENTS, not a color. Build a color from the components first \u2014 \`AsRgb((r, g, b))\` reads them as 0-1 sRGB, and \`ColorFromColorspace(components, space)\` reads them in any named space.`);if(Er(n))throw new Error(`Could not compile \`${e}\`: cannot settle the color space of the operand at compile time \u2014 it holds a converted color at one of the positions its value comes from, and a shader color is a bare vector with no run-time tag, so the channels cannot be converted back to OKLCh.`);return C(n)&&r?.loweredSymbolType!==void 0&&Ur.get(r.loweredSymbolType)?.add(n.symbol),Df(t(n),vr(n))}let o=n.ops;if(o.length<3||o.length>4)throw new Error(`Could not compile \`${e}\`: a tuple of ${o.length} components is not a color \u2014 a color tuple has 3 components, or 4 with the fourth read as alpha.`);return gn(e,o),kn(o.slice(0,3),Ne()),`_gpu_srgb_to_oklch(${Ne()}(${o.slice(0,3).map(i=>t(i)).join(", ")}))`}function Hn(e,n,t,r){if(!(_(n)&&n.operator==="Tuple")&&st(n)){let i=f.aggregateComponentCount(n);if(i===4&&ip(e),i!==void 0&&i!==3)throw new Error(`Could not compile \`${e}\`: a tuple of ${i} components is not a color \u2014 color components are 3 channels, or 4 with the fourth read as alpha.`);return`_gpu_srgb_to_oklch(${t(n)})`}return ke(e,n,t,r)}function Df(e,n){switch(n){case"rgb":return`_gpu_srgb_to_oklch(${e})`;case"oklab":return`_gpu_oklab_to_oklch(${e})`;case"hsl":return`_gpu_srgb_to_oklch(_gpu_hsl_to_rgb(${e}))`;case"hsv":return`_gpu_srgb_to_oklch(_gpu_hsv_to_rgb(${e}))`;default:return e}}function gn(e,n){n.length<=3||ip(e)}function ip(e){throw new Error(`Could not compile \`${e}\`: an alpha (4th) operand is not representable on the GPU target \u2014 color values are \`vec3\` (OKLCh) end to end, with no alpha channel. Drop the alpha operand and pass it separately (e.g. as a uniform) at the framebuffer boundary.`)}var ns=new WeakMap;function ts(){return{frames:[],counters:0,spatialCounter:void 0,stage:void 0,hostFrame:!1,varNames:void 0}}function ap(e){let n={};e.gpuRandomRoot=n,ns.set(n,ts())}function _n(e){let n=e.gpuRandomRoot??e,t=ns.get(n);return t===void 0&&(t=ts(),ns.set(n,t)),t}function lp(e){let n=_n(e);n.frames.length=0,n.counters=0,n.spatialCounter=void 0,f.resetNaming(e)}function rs(e){return`_gpu_rnd_n${e.counters++}`}var Yt="_gpu_rnd_n";function sp(e,n){let t=o=>`0x${(o>>>0).toString(16).padStart(8,"0")}u`;return`uvec2(${t(e)}, ${t(n)})`}function Wt(e){let n=jf(e),t=dn;if(t===void 0)return n;t.inline&&(t.reordered=!0);let r=[...f.compileParents()];if(t.last!==void 0&&!gu(t.last,r)&&(t.reordered=!0),t.last=r,!on(e))return t.inline=!0,n;let o=r[r.length-1],i=o!==void 0&&_(o)?o.op1:void 0;if((o===void 0||!_(o)?[]:_(o,"Random")&&_(i,"Interval")?i.ops.map(u=>_(u,"Open")||_(u,"Closed")?u.op1:u):o.ops).some(u=>!Cn(u,e)&&we(u,e)))throw new Error("Could not compile `Random`: an operand of the draw contains code supplied by the caller (a `vars` source, a `functions` or `operators` entry, or a `compile` handler), and the draw, bound to a temporary ahead of the statement, would run before that code.");xe("Random",o===void 0?void 0:[o],e,!0);let a=f.tempVar(e);return f.hoistStatement(e,`float ${a} = ${n};`),a}function jf(e){let n=_n(e),t=n.frames[n.frames.length-1];if(t!==void 0)return`_gpu_rnd_draw(${t.seed}, ${t.counter})`;if(n.hostFrame)throw new Error("Could not compile `Random()`: an unframed draw has no shader form while a host `WithRandomSeed` frame is active \u2014 a shader invocation cannot share the host's mutable draw counter, and fragments run in parallel. GPU frames must be LEXICAL: move the `WithRandomSeed(seed, \u2026)` inside the compiled expression.");if(n.stage!==void 0&&n.stage!=="fragment")throw new Error(`Could not compile \`Random()\`: an unframed draw compiles to \`gl_FragCoord\`-derived spatial noise, which exists only in a fragment shader (this is a \`${n.stage}\` shader). Wrap the draw in \`WithRandomSeed(seed, \u2026)\` to get a stage-independent stream.`);return n.spatialCounter??=rs(n),`_gpu_rnd_draw(uvec2(floatBitsToUint(gl_FragCoord.x), floatBitsToUint(gl_FragCoord.y)), ${n.spatialCounter})`}function up(e){let n=new Set,t=new Set,r=(s,a)=>{if(t.has(a))return;t.add(a);let u=s.engine;if(u===void 0)return;let l=f.userFunctionLiteral(u,a);l!==void 0&&l.ops.length>0&&i(l.ops[0])},o=new Set,i=s=>{if(!o.has(s)){if(o.add(s),C(s)){it(s)||_r(s)?n.add(s.symbol):r(s,s.symbol);return}if(_(s)){typeof s.operator=="string"&&s.operator!==""&&r(s,s.operator);for(let a of s.ops)i(a)}}};return e!==void 0&&i(e),n}function pp(e){let n=new Map,t=new Map;return qf(e,r=>{let o=r.symbol;if(n.has(o)||t.has(o))return;let i=r.type.type,s=cn(i);if(s!==void 0){n.set(o,gi(o,o,r,s));return}let a=Gt(i);if(a!==void 0){n.set(o,`Could not compile \`${o}\`: "${o}" has the type \`${r.type.toString()}\`, and ${a}. A shader can read a tuple of 2 to 4 real numbers (a point) as a vector, and a longer tuple of real numbers as an array.`);return}let u=Vf(i);u!==void 0&&t.set(o,`Could not compile \`${o}\`: "${o}" has the type \`${r.type.toString()}\`, ${u}. A shader declares an input with a size fixed at compile time (a scalar, a vector, a matrix or an array of a stated length, of at least one element), so no shader can declare "${o}". Declare its length in its type (\`list<real^8>\`, \`matrix<real^3x3>\`).`)}),{pointOrList:n,unsizedLists:t}}function Vf(e){let n="which has no static length";if(e=Y(e),typeof e=="string")return e==="list"||e==="range"||e==="set"||e==="dictionary"||e==="collection"||e==="indexed_collection"?n:void 0;if(e.kind==="list"){let t=e.dimensions;return!Array.isArray(t)||t.length===0||t.some(r=>r<0)?n:t.some(r=>r===0)?"which holds no element, and a shader array holds at least one":void 0}return e.kind==="set"||e.kind==="dictionary"||e.kind==="collection"||e.kind==="indexed_collection"?n:void 0}function qf(e,n){let t=new Set,r=new Set,o=new Set,i=(u,l)=>{if(t.has(l))return;t.add(l);let c=u.engine;if(c===void 0)return;let p=f.userFunctionLiteral(c,l);p!==void 0&&p.ops.length>0&&a(p,o)},s=new Map,a=(u,l)=>{let c=s.get(u);if(!c?.has(l)){if(c===void 0?s.set(u,new Set([l])):c.add(l),C(u)){if(l.has(u.symbol))return;if(n(u),i(u,u.symbol),!r.has(u.symbol)){r.add(u.symbol);let p=u.engine?._getSymbolValue(u.symbol);p!==void 0&&a(p,o)}return}if(_(u)){typeof u.operator=="string"&&u.operator!==""&&!l.has(u.operator)&&i(u,u.operator);let p=De(u),d=p.length===0?l:new Set([...l,...p]);for(let h of u.ops)a(h,d)}}};e!==void 0&&a(e,o)}function cp(e,n,t,r,o){if(o().has(n))return!1;for(let i of Object.keys(r)){if(i===t)continue;if(i===n)return!1;let s=r[i];if(typeof s!="string")continue;let a=s.trim();if(a===e||a===n)return!1}return!0}function fp(e,n,t){for(let r of Object.keys(e)){if(!t().has(r))continue;let o=e[r];if(typeof o!="string")continue;let i=/^\s*([A-Za-z_][A-Za-z0-9_]*)(?:\.[A-Za-z_][A-Za-z0-9_]*|\[[0-9]+\])*\s*$/.exec(o)?.[1];if(!(i===void 0||i===r)&&n().has(i))throw new Error(`Could not compile: the \`vars\` entry for \`${r}\` reads the uniform \`${i}\`, but the compiled code declares or writes the symbol \`${i}\`, which the shader emits with the same name. The shader would read that variable instead of the uniform. Rename the uniform or the symbol.`)}}function Kt(e,n){let t=n.language??"GPU";return`${e} is not supported on the ${t} target: a shader expression has no general collection indexing. Only \`Random()\`, \`Random(Interval(a, b))\` and \`Random(Range(\u2026))\` compile \u2014 the closed-form domains.`}function dp(e,n,t){if(_(e,"Interval")){if(e.nops!==2)throw new Error("Random(Interval(a, b)): expects two endpoints");let r=c=>_(c,"Open")||_(c,"Closed")?c.op1:c,o=r(e.op1),i=r(e.op2);for(let[c,p]of[["lower",o],["upper",i]])if(!p.canonical.isPure)throw new Error(`Could not compile \`Random(Interval(a, b))\`: the ${c} endpoint is not pure \u2014 a shader expression has no statement to evaluate it into once, so the endpoint is spliced (and would run) more than once per draw. Hoist the draw out of the endpoint.`);let s=X(o),a=X(i);if(s!==void 0&&a!==void 0){if(!(a>s))throw new Error(`Random(Interval(${s}, ${a})): the interval is empty or reversed \u2014 there is no uniform distribution to draw from.`);return`(${ue(s)} + ${Wt(t)} * ${ue(a-s)})`}if(rn("Random",[o],t),!Cn(i,t)&&we(i,t))throw new Error("Could not compile `Random(Interval(a, b))`: the upper endpoint contains code supplied by the caller (a `vars` source, a `functions` or `operators` entry, or a `compile` handler), and the draw would run before that code.");let u=n(o),l=n(i);return`((${u}) + ${Wt(t)} * ((${l}) - (${u})))`}if(_(e,"Range")){let r=pa(e);if(r===void 0||!Number.isFinite(r))throw new Error("Could not compile `Random(Range(\u2026))`: the GPU target requires a Range with constant, finite bounds \u2014 a symbolic or unbounded range has no known element count to draw from.");if(r===0)throw new Error("Random(Range(\u2026)): the range is empty (no elements).");let o=e.ops,i,s;if(o.length===1?(i=1,s=1):o.length===2?(i=o[0].re,s=o[1].re>=o[0].re?1:-1):(i=o[0].re,s=o[2].re),!Number.isFinite(i)||!Number.isFinite(s))throw new Error("Random(Range(\u2026)): the GPU target requires constant numeric bounds.");let a=`floor(${Wt(t)} * ${ue(r)})`,u=s<0?"-":"+",l=Math.abs(s);return l===1?`(${ue(i)} ${u} ${a})`:`(${ue(i)} ${u} ${ue(l)} * ${a})`}throw new Error(Kt("Random(collection)",t))}function mp(e,n,t){if(Ue(e)){let[u,l]=No(e.string);return sp(u,l)}if(e.type.matches("string"))throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: a string seed that is not a compile-time literal cannot be folded in a shader \u2014 GLSL has no strings. Use a literal string, a numeric seed, or fold the seed on the host.");let r=e.canonical;if(!r.isPure)throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: the seed expression is not pure \u2014 the folded seed is spliced at EVERY draw site of the frame, so it would be evaluated once per draw. Use a compile-time constant or a single shader-supplied symbol.");let o=X(r)??X(r.N());if(o!==void 0){let[u,l]=No(o);return sp(u,l)}let i=C(r)?r.symbol:void 0;if(i===void 0)throw new Error("Could not compile `WithRandomSeed(seed, \u2026)`: a COMPUTED seed expression has no shader form \u2014 the folded seed is spliced at every draw site of the frame, so it would be recomputed per draw. Use a compile-time constant seed (host-identical stream) or a single shader-supplied symbol (its own stream).");let s=t.var(i);if(s!==void 0)throw _n(t).varNames?.has(i)?new Error(`Could not compile \`WithRandomSeed(${i}, \u2026)\`: a seed supplied through \`vars\` (\`${i}\` \u2192 \`${s}\`) is the HOST-UNIFORM row of the seed ABI, which is not implemented: the host folds an f64 seed with \`foldSeed\` into TWO words, while a shader can only reinterpret the f32 bits it receives (\`seedHi = 0u\`), so the shader would silently draw a DIFFERENT stream than the host. Use either a compile-time literal seed \u2014 the host-identical stream \u2014 or an explicitly invocation-varying seed symbol that is NOT in \`vars\`, which owns its own stream.`):new Error(`Could not compile \`WithRandomSeed(${i}, \u2026)\`: the seed resolves to the shader constant \`${s}\`, which the seed ABI cannot fold. Use a compile-time numeric or string seed.`);return`uvec2(floatBitsToUint(${n(r).trim()}), 0u)`}var hp={name:"the exponent of e in half-turns",operators:["Add","Multiply","Divide","Negate","Power","Sqrt","Root"]},yn=256;function Xt(e,n){if(!(n<=yn))throw new un({code:"inline-collection-too-large",kind:"capability",message:`Could not compile \`${e}\`: a constant collection of ${n} elements is above the ${yn} elements a shader array constructor takes on this target. Ship the collection as a texture (a \`storage: sampler2D\` input, read with \`At\`) instead.`})}function gp(e,n,t,r){let o=h=>{throw new Error(`Could not compile \`${e}\`: ${h}`)};f.isComplexValued(n)&&o(`a complex-valued operand (\`${n.toString()}\`) is lowered as a \`vec2\` of (re, im), which has no element-wise reading \u2014 a componentwise shader builtin would treat its real and imaginary parts as two independent elements.`),Ie(n)===void 0&&o(`the operand \`${n.toString()}\` has no static vec2\u2013vec4 shape (an unknown-length list, a matrix, or a 5+-element list), so it is not a shader vector and the componentwise builtins do not apply to it.`);let i=t.collection(),s=(Xa(n,r)||we(n,r))&&!/^[A-Za-z_]\w*$/.test(i);if(e==="Square")return/^[A-Za-z_]\w*$/.test(i)?`(${i} * ${i})`:_t(i,2,j(n));let a=t.element(i),u=Ie(n),l=We(n,r,!0),c=a,p=a;for(let h of Vl){let g=`_gpu_${h}(${i})`;c=c.split(g).join(l?`${h}(${i})`:`_gpu_${h}${u}(${i})`),p=p.split(g).join(i)}s&&c.split(i).length>2&&o(`the operand \`${n.toString()}\` draws a random value or contains code supplied by the caller, and the lowering \`${a}\` uses it more than once, so each use would run that code again.`);let d=xi(p.split(i).join("_operand"),"_operand");return d!==void 0&&o(`the scalar shader lowering \`${a}\` is not componentwise \u2014 ${d} A shader has no element loop, so a non-componentwise lowering cannot be broadcast over a \`vecN\` at all.`),c}function mo(e,n,t,r){let o={First:1,Second:2,Third:3,Last:-1}[e],i=ee(n),s=p=>typeof p!="string"&&p.kind==="tuple"&&p.elements.length>=2&&p.elements.length<=4&&p.elements.every(d=>D(d.type,"boolean"))?p.elements.length:void 0,a,u=Ae(n),l=u?.value;if(l!==void 0&&l.element==="b"&&l.width>=2&&l.width<=4)a=l.width;else if(u===void 0&&C(n)&&s(i)!==void 0)a=s(i);else if(u===void 0&&(_(n,"At")||_(n,"If")||_(n,"Which"))&&typeof i!="string"&&i.kind==="union"&&i.types.includes("missing")){let p=Y(an({kind:"union",types:i.types.filter(d=>d!=="missing")}));typeof p!="string"&&p.kind==="tuple"&&p.elements.length>=2&&p.elements.length<=4&&Gt(p)===void 0&&s(p)===void 0&&(a=p.elements.length)}if(a!==void 0){let p=o===-1?a:o;if(p>a)throw new Error(`Could not compile \`${e}\`: the operand (type \`${n.type.toString()}\`) is a vector of ${a} components, which has no element at the position ${p}.`);return Tn(t(n),"xyzw"[p-1])}let c=n.engine.number(o);je(n,n.engine._fn("At",[n,c]),{name:`the position of \`${e}\``,operators:["At"],nops:2},r);try{return _p([n,c],t,r)}catch(p){throw p instanceof Error&&!(p instanceof un)&&p.message.startsWith("Could not compile `At`: ")?new Error(`Could not compile \`${e}\` (read as \`At\` with the index ${o}): `+p.message.slice(24)):p}}function _p(e,n,t){let r=P=>{throw new Error(`Could not compile \`At\`: ${P}.`)};e.length<2&&r("it has no index operand"),e.length>2&&r(`this lowering reads one index, and it was given ${e.length-1}. The compiler rewrites a chained access \`At(x, i, j)\` to the nested access \`At(At(x, i), j)\` before it calls this lowering`);let o=e[0],i=e[1],s=C(o)&&t.storage?.get(o.symbol)!==void 0?void 0:Vu(o,n);if(s!==void 0)return"decline"in s&&r(s.decline),!o.isPure&&!i.isPure&&r("both the base and the index are impure, and GLSL does not specify the order in which a call evaluates its arguments"),qu(s,o,i,n,t,r);let a=Mu(o,t);"decline"in a&&r(a.decline);let u=a.count,l=a.storage,c,p=P=>(c??=Yu(o,n),`_gpu_texat${u}(${c}, ${P})`);!o.isPure&&!i.isPure&&r("both the base and the index are impure, and GLSL does not specify the order in which a call evaluates its arguments");let d=_(o,"List")||_(o,"Tuple")?o.ops:void 0,h=d!==void 0,g=P=>{o.isPure||r(P)},y=(P,G)=>{let k=d;for(let R=0;R<k.length;R++){if(k[R].isPure)continue;let I=P.filter(H=>H===R).length;I===0&&r(`element ${R+1} of the literal base is impure and the ${G} does not select it, so folding would discard it unevaluated`),I>1&&r(`element ${R+1} of the literal base is impure and the ${G} selects it ${I} times, which would evaluate it more than once`)}},w=P=>{(P==="base"?o:i).isPure||r(`the access folds to the NaN spelling, which would DISCARD the impure ${P} unevaluated`)};if(_(i,"List")){let P=i.ops,G=P.map(ju),k=G.indexOf("other-literal");k>=0&&r(`entry ${k+1} of the index list (\`${P[k].toString()}\`) is a literal that is not an integer, so it selects no element and the list is not an index gather at all`);let R=new Set(G),I=R.has("int")||R.has("dyn"),H=R.has("bool")||R.has("dyn-bool");I&&H&&r("the index list mixes integer entries with boolean ones, so it is neither a gather nor a mask"),R.has("dyn-bool")&&r("the index is a boolean mask with runtime-valued entries: its result LENGTH depends on how many of them are true at run time, so it has no static shader value shape. This shape has no shader lowering at all \u2014 it is not a missing tier");let m;if(R.has("bool"))P.length!==u&&r(`the index is a boolean mask of length ${P.length}, but the base has ${u} elements \u2014 a mask's length must equal the collection's`),m=[],P.forEach((b,S)=>{C(b,"True")&&m.push(S)});else if(R.has("dyn")){let b=G.filter(S=>S==="dyn").length;r(`the index list has ${b} runtime-valued integer ${b===1?"entry":"entries"}; a static-count DYNAMIC gather is not lowered in this version (no witness requested it yet) \u2014 the helpers it needs are the same ones the scalar form already emits`),m=[]}else m=P.map(b=>lo(b.re,u));let v=m.length;if(v===0&&r("the index selects 0 elements, and GLSL has no zero-length value type"),v===1&&r("the index selects exactly 1 element, which CE types as a 1-element LIST (pinned: `At(L, [2])` \u2192 `[20]`), and no shader value has that shape \u2014 there is no `vec1`"),v>4&&r(`the index selects ${v} elements, so the RESULT would be a \`vec${v}\`, and a shader vector holds 2 to 4`),l!==void 0){let b=`vec${v}`,S=m.map(T=>T===null?le(t):p(q(T+1,t.language)));return`${b}(${S.join(", ")})`}if(h)y(m.filter(b=>b!==null),"gather");else{let b=Bu(o,m,u);b===0?g("the gather selects no element of the base, so its emission would DISCARD the impure base unevaluated"):b>1&&g("the gather emits a constructor that references the impure base more than once, which would evaluate it more than once")}return Du(o,m,u,n,t)}let x=ee(i);if(C(i,"Missing")||D(x,"missing"))return w("base"),w("index"),le(t);Ue(i)&&r("the index is a string key, and only a dictionary base takes one \u2014 a positional shader access indexes by number"),f.isComplexValued(i)&&r("the index is a complex value, which lowers to a `vec2(re, im)`; the interpreter reads its real part, and a shader has no such reading of a vector in an index position");let $=qi(i);if($!==void 0&&"decline"in $&&r($.decline),B(i)){let P=lo(i.re,u);return P===null?(w("base"),le(t)):l!==void 0?p(q(i.re,t.language)):(h&&y([P],"access"),uo(o,P,u,n))}if(D(x,wn)&&!D(x,"string")){let P=f.aggregateComponentCount(i);(P===void 0||P<0)&&r(`the index is a collection (type \`${i.type.toString()}\`) with no statically known length, so there is no static count to emit a result shape against`),r(`the index is a collection of ${P} runtime-valued entries; a static-count DYNAMIC gather is not lowered in this version (no witness requested it yet)`)}Le(x,"number")||r(`the index (type \`${i.type.toString()}\`) is provably not a number, so it selects no element and \`At\` has no value to project`);let A,E=()=>A??=n(o),z=ji(i,t,P=>!t.foldExcludedOps?.has(P)&&t.operators?.(P)===Fe[P]&&t.functions?.(P)===bn[P]);if(l===void 0&&z&&z.min>=1&&z.max<=u){let P=E();return`${be(P)?P:`(${P})`}[${z.code} - 1]`}let N=n(i),M=$===void 0?N:`float(${N})`;return l===void 0||!C(o)?`_gpu_at${u}(${E()}, ${M})`:p(M)}function yp(e,n,t,r=0){if(r>64)return!1;if(B(e))return!0;if(C(e)){if(e.symbol===n||t.storage?.get(e.symbol)!==void 0&&!Wi(e.symbol,t))return!0;let s=t.var(e.symbol);return!t.varsKeys?.has(e.symbol)&&(s===void 0||be(s))}if(!_(e)||!e.isPure||Je(e)||t.foldExcludedOps?.has(e.operator))return!1;let o=bn[e.operator],i=Fe[e.operator];return o===void 0&&i===void 0||t.functions?.(e.operator)!==o||i!==void 0&&t.operators?.(e.operator)!==i?!1:e.ops.every(s=>yp(s,n,t,r+1))}function os(e,n,t,r){if(!n[0])throw new Error(`Could not compile \`${e}\`: no body`);if(!n[1])return Iu(e,n[0],t,r);if(f.assertScalarBigOpBody(e,n[0]),n.length>2)return os(e,[je(n,n[0].engine._fn(e,[n[0],...n.slice(2)]),{name:`the nest of a multi-index \`${e}\``,operators:[e]},r),n[1]],t,r);let o=_(n[1],"Element")&&C(n[1].op1)&&_(n[1].op2,"Range")&&(n[1].op2.nops===2||n[1].op2.nops===3&&n[1].op2.op3.re===1)?je(n[1],n[1].engine._fn("Limits",[n[1].op1,n[1].op2.op1,n[1].op2.op2]),{name:"a `Range` index set",operators:["Limits"],nops:3},r):n[1];if(!_(o,"Limits"))throw new Error(`Could not compile \`${e}\`: expected Limits indexing set`);let i=o.ops,s=C(i[0])?i[0].symbol:"_",a=f.isComplexValuedUnderIndices(n[0],[s]),u=W=>f.withRealLoopIndices([s],W);Ni(e,i[1],"lower"),Ni(e,i[2],"upper");let l=Ii(i[1],r),c=Ii(i[2],r);f.assertSafeBigOpBounds(e,[i[1],i[2]],r);let p=e==="Sum",d=p?"+":"*",h=ne(),g=a?void 0:u(()=>f.aggregateComponentCount(n[0]));if(g!==void 0&&(g<2||g>4))throw new Error(`Could not compile \`${e}\`: each term is a list of ${g} elements, and a shader has no accumulator for a list of that length (only a vector of 2 to 4 components).`);let y=a?`${h}(${p?"0.0":"1.0"}, 0.0)`:g!==void 0?`${ie(g)}(${p?"0.0":"1.0"})`:p?"0.0":"1.0",w=a?ie(2):g!==void 0?ie(g):"float",x=(W,J)=>a&&!p?`_gpu_cmul(${W}, ${J})`:`${W} ${d} ${J}`,$=l!==void 0&&c!==void 0;if($&&l>c)return y;let A=yp(n[0],s,r);if($&&rt(c-l+1,vn(n[0]),oo)){let W=J=>{let Q=r.hoist?.stmts,re=Q?.length??0,ye=[],Ke=0,Ks=0;for(let Xe=l;Xe<=c;Xe++){let vt=ue(Xe),sr=f.withBoundScope(r,[s]),ef=sr.boundVars,ar={stmts:[],boundVars:ef,unit:n[0]},To={...r,var:Js=>Js===s?vt:r.var(Js),...sr,hoist:f.canHoist(r)?ar:void 0};A&&Bi(To,s,Xe,Xe,String(Xe));let Et;try{Et=u(()=>f.compileValueOperand(n[0],To))}finally{Di(To)}if(ar.stmts.length===0){Ke+=1,ye.push(`(${Et})`);continue}if(Ks+=1,f.foldValueImpure(n[0])&&He(e,[n[0]],r),xe(e,[n[0]],r),/^[A-Za-z_$][\w$]*$/.test(Et)){f.hoistStatement(r,...ar.stmts),f.foldValueImpure(n[0])&&Oe([n[0]],r),ye.push(`(${Et})`);continue}let Zs=f.tempVar(r),nf=`${w} ${Zs}`;f.hoistStatement(r,...ar.stmts,`${nf} = ${Et};`),f.foldValueImpure(n[0])&&Oe([n[0]],r),ye.push(`(${Zs})`)}if(Ke>0&&Ks>0&&we(n[0],r))throw new Error(`Could not compile \`${e}\`: some unrolled terms are computed in statements ahead of the expression and others stay in it, and code supplied by the caller (a \`vars\` source, a \`functions\` or \`operators\` entry, or a \`compile\` handler) in the terms would then run out of the order of the interpreter.`);let Xs=`(${ye.reduce((Xe,vt)=>x(Xe,vt))})`;return Q!==void 0&&J.length>0&&Q.splice(re,0,...Mi(J,[Xs,...Q.slice(re)]).map(([Xe,vt,sr])=>Ui(Xe,vt,sr))),Xs};return f.canHoist(r)?f.hoistLoopInvariants(n[0],[s],r,W,J=>pe(J)!==void 0).result:W([])}let E=f.tempVar(r),z="int",N=-(2**31),M=2**31-1;for(let[W,J,Q]of[["lower",l,M],["upper",c,M-1]])if(J!==void 0&&(J<N||J>Q))throw new Error(`Could not compile \`${e}\`: the ${W} bound ${J} is outside the range of the 32-bit loop counter (${N} to ${Q}).`);let P=f.withBoundScope(r,[s]),G=P.boundVars,k={stmts:[],boundVars:G,unit:n[0]},R={...r,var:W=>W===s?`float(${s})`:r.var(W),...P,hoist:k};A&&$&&Bi(R,s,l,c,s);let{bindings:I,result:H}=f.hoistLoopInvariants(n[0],[s],r,()=>u(()=>{try{return r.cse?.enabled?(f.openCseSession(n[0],R,r.cse.harvestOptions),f.compileCseRoot(n[0],R,0,()=>f.compileValueOperand(n[0],R))):f.compileValueOperand(n[0],R)}finally{Di(R)}}),W=>pe(W)!==void 0),m=(W,J)=>{let Q=Ae(W),re=Q?.value;if(Q===void 0||re!==void 0&&re.width===1&&re.element==="f")return`int(floor(${f.compile(W,r)}))`;if(re!==void 0&&re.width===1&&re.element==="i")return Q.ref;if(re!==void 0&&re.width===1&&re.element==="u")return`int(${Q.ref})`;throw new Error(`Could not compile \`${e}\`: the ${J} bound \`${W.toString()}\` is declared "${Q.spelling}" by the caller, which is not a scalar number \u2014 a loop bound must be one.`)},v=l!==void 0?String(l):m(i[1],"lower"),b=c!==void 0?String(c):m(i[2],"upper");Te(s,r.language);let S=`${w} ${E}`,T=`${z} ${s}`,L=bp(r),O=W=>/([A-Za-z_]\w*)\)*$/.exec(W.trim())?.[1]===s,U=c===void 0&&(!Oi(b)||O(b))?f.tempVar(r):"",V=U===""?[]:[`${z} ${U} = ${b};`],K=U===""?b:U,de=[...V,...Mi(I,[H,...k.stmts]).map(([W,J,Q])=>Ui(W,J,Q)),`${S} = ${y};`,`for (${T} = ${v}; ${s} <= ${K}; ${s}++) {`,...L===void 0?[]:[`  ${L}`],...k.stmts.map(W=>W.split(`
`).map(J=>`  ${J}`).join(`
`)),a&&!p?`  ${E} = ${x(E,H)};`:`  ${E} ${d}= ${H};`,"}"];return f.canHoist(r)?(f.foldValueImpure(n[0])&&He(e,[n[0]],r),xe(e,n,r),f.hoistStatement(r,de.join(`
`)),f.foldValueImpure(n[0])&&Oe([n[0]],r),E):[...de,`return ${E};`].join(`
`)}var Wn="_gpu_passes";function bp(e){let n=e.fragmentPassBudget;if(n!==void 0)return`if (++${Wn} > ${n}) break;`}var bn={__proto__:null,Add:(e,n,t)=>{if(e.length===0)return"0.0";if(e.length===1)return Or(n(e[0]));if(!e.some(l=>f.isComplexValued(l)))return Sn(e.map(l=>n(l)),"0.0","+",t.language);for(let l of e)Rn("Add",l);if(e.some(l=>cl(l))){let l=ne();return e.map(c=>{let p=n(c);return f.isComplexValued(c)?p:`${l}(${p}, 0.0)`}).join(" + ")}let o=e.map(l=>pl(l,n,t.language)),i=[],s=[];for(let l of o)l.re!==null&&i.push(l.re),l.im!==null&&s.push(l.im);let a=Sn(i,"0.0","+",t.language),u=Sn(s,"0.0","+",t.language);return`${ne()}(${a}, ${u})`},Multiply:(e,n,t)=>{if(e.length===0)return"1.0";if(e.length===1)return Or(n(e[0]));if(!e.some(l=>f.isComplexValued(l)))return Sn(e.map(l=>jt(l,t)),"1.0","*",t.language);for(let l of e)Rn("Multiply",l);let o=e.findIndex(l=>C(l,"ImaginaryUnit")||B(l)&&l.re===0&&l.isComplex);if(o>=0){let l=e[o],c=C(l,"ImaginaryUnit")?1:l.im,p=e.filter((g,y)=>y!==o),d=ne();if(p.length===0)return`${d}(0.0, ${q(c,t.language)})`;let h=p.filter(g=>f.isComplexValued(g));if(h.length===0){let g=p.map(w=>jt(w,t));c!==1&&g.unshift(q(c,t.language));let y=Sn(g,"1.0","*",t.language);return`${d}(0.0, ${y})`}if(h.length===1&&C(h[0])){let g=n(h[0]),y=/^[A-Za-z_][A-Za-z0-9_]*$/.test(g)?g:`(${g})`,w=p.filter(A=>A!==h[0]).map(A=>jt(A,t));c!==1&&w.unshift(q(c,t.language));let x=`${d}(-${y}.y, ${y}.x)`,$=Sn(w,"1.0","*",t.language);return $==="1.0"?x:`(${$} * ${x})`}}let i=[],s=[];for(let l of e)f.isComplexValued(l)?s.push(n(l)):i.push(jt(l,t));let a=Sn(i,"1.0","*",t.language),u=s[0];for(let l=1;l<s.length;l++)u=`_gpu_cmul(${u}, ${s[l]})`;return a!=="1.0"&&(u=`(${a} * ${u})`),u},Divide:(e,n,t)=>{if(e.length===0)return"1.0";if(e.length===1)return n(e[0]);let r=f.isComplexValued(e[0]),o=e.length>=2&&f.isComplexValued(e[1]);if(!r&&!o){if(e.length===2){let a=X(e[0]),u=X(e[1]);return a!==void 0&&u!==void 0&&u!==0?q(a/u,t.language):u===1?n(e[0]):`(${n(e[0])}) / (${n(e[1])})`}let s=`(${n(e[0])})`;for(let a=1;a<e.length;a++)s=`${s} / (${n(e[a])})`;return s}for(let s of e)Rn("Divide",s);return r&&o?`_gpu_cdiv(${n(e[0])}, ${n(e[1])})`:r&&!o?`((${n(e[0])}) / (${n(e[1])}))`:`_gpu_cdiv(${ne()}(${n(e[0])}, 0.0), ${n(e[1])})`},Negate:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Negate`: no argument");let r=X(e);return r!==void 0?q(-r,t.language):B(e)&&e.isComplex?`${ne()}(${q(-e.re,t.language)}, ${q(-e.im,t.language)})`:C(e,"ImaginaryUnit")?`${ne()}(0.0, -1.0)`:`(-(${n(e)}))`},Abs:(e,n,t)=>f.isComplexValued(e[0])?`length(${n(e[0])})`:f.isNonNegative(e[0])?ve(e[0],n,t):`abs(${n(e[0])})`,Arccos:(e,n)=>f.isComplexValued(e[0])?`_gpu_cacos(${n(e[0])})`:me("Arccos",e)?`_gpu_cacos(${ge(e[0],n)})`:`acos(${n(e[0])})`,Arcsin:(e,n)=>f.isComplexValued(e[0])?`_gpu_casin(${n(e[0])})`:me("Arcsin",e)?`_gpu_casin(${ge(e[0],n)})`:`asin(${n(e[0])})`,Arctan:(e,n)=>f.isComplexValued(e[0])?`_gpu_catan(${n(e[0])})`:`atan(${n(e[0])})`,At:ce((e,n,t)=>_p(e,n,t)),Ceil:(e,n,t)=>e.length>1&&e[1]!==null?Vt("ceil",e[0],e[1],n,t):f.isIntegerValued(e[0])?ve(e[0],n,t):`ceil(${n(e[0])})`,Clamp:(e,n,t)=>Qi("clamp",0,e,n,t)??`clamp(${e.map(r=>n(r)).join(", ")})`,Cos:(e,n,t)=>{if(f.isComplexValued(e[0]))return`_gpu_ccos(${n(e[0])})`;let r=Wr(e[0],2,t);return r!==void 0?`_gpu_cospi(${n(r)})`:hn("cos",e[0],n(qe(e[0],2,!0,t)),t)},Degrees:"radians",Exp:(e,n)=>f.isComplexValued(e[0])?`_gpu_cexp(${n(e[0])})`:`exp(${n(e[0])})`,Exp2:"exp2",First:ce((e,n,t)=>mo("First",e[0],n,t)),Second:ce((e,n,t)=>mo("Second",e[0],n,t)),Third:ce((e,n,t)=>mo("Third",e[0],n,t)),Last:ce((e,n,t)=>mo("Last",e[0],n,t)),PointX:(e,n,t)=>jr(e[0],"x",n,t),PointY:(e,n,t)=>jr(e[0],"y",n,t),PointZ:(e,n,t)=>jr(e[0],"z",n,t),Floor:(e,n,t)=>e.length>1&&e[1]!==null?Vt("floor",e[0],e[1],n,t):f.isIntegerValued(e[0])?ve(e[0],n,t):`floor(${n(e[0])})`,Fract:(e,n,t)=>{let r=e[0];if(r==null)throw new Error("Could not compile `Fract`: missing argument");let o=()=>`fract(${n(r)})`;return Nr("Fract",r,!0,n,t,j,o)??o()},Ln:(e,n)=>f.isComplexValued(e[0])?`_gpu_cln(${n(e[0])})`:e[0]?.isNegative===!0&&me("Ln",e)?`_gpu_cln(${ge(e[0],n)})`:`log(${n(e[0])})`,Log2:"log2",Max:ce((e,n,t)=>Li("max","Max",e,n,t)),Min:ce((e,n,t)=>Li("min","Min",e,n,t)),Mean:ce((e,n,t)=>{throw new Error(`Could not compile \`Mean\`: the operator is known to the engine but target '${t.language??"unknown"}' has no lowering for it.`)}),ElementMax:(e,n,t)=>ki("max","ElementMax",e,n,t),ElementMin:(e,n,t)=>ki("min","ElementMin",e,n,t),Mix:"mix",If:(e,n,t)=>{if(e.length!==3)throw new Error("Could not compile `If`: wrong number of arguments");Ti("If",[e[1],e[2]]);let r=Mt("If",e),o=[e[1],e[2]],i=l=>Ut("If",e[l],n(e[l],l),r,t,o);if(mn(e[1])||mn(e[2])||on(t)&&(to(e[1])||to(e[2])||Zr(e[1])||Zr(e[2]))){let l=no([e[0],e[1],e[0].engine.True,e[2]],(c,p)=>p===1||p===3?Ut("If",c,n(c,p===3?2:p),r,t,o):n(c,p),t);if(l!==void 0)return l}let s=n(e[0],0),a=Ye("If",()=>i(1),t),u=Ye("If",()=>i(2),t);return Fn(s,a,u)},Which:(e,n,t)=>{if(e.length<2||e.length%2!==0)throw new Error("Could not compile `Which`: expected condition/value pairs");Ti("Which",e.filter((l,c)=>c%2===1));let r=Mt("Which",e),o=e.filter((l,c)=>c%2===1),i=l=>Ut("Which",e[l],n(e[l],l),r,t,o),s=on(t);if(e.some((l,c)=>c>0&&(mn(l)||s&&(to(l)||Zr(l))))){let l=no(e,(c,p)=>p%2===1?Ut("Which",c,n(c,p),r,t,o):n(c,p),t);if(l!==void 0)return l}let a=e.filter((l,c)=>c%2===1).find(l=>Ie(l))??null,u=l=>{if(l>=e.length)return r?`${ne()}(${le(t)})`:It(a,t);let c=e[l],p=w=>l===0?w():Ye("Which",w,t);if(C(c,"True"))return`(${p(()=>i(l+1))})`;let d=l;for(;d+3<e.length&&!C(e[d+2],"True")&&e[l+1].isPure&&e[d+2].isPure&&e[d+3].isPure&&e[d+3].isSame(e[l+1]);)d+=2;let h=p(()=>n(c,l)),g=[];for(let w=l+2;w<=d;w+=2)g.push(Ye("Which",()=>n(e[w],w),t));let y=g.length===0?h:[h,...g].map(w=>`(${w})`).join(" || ");return Fn(y,Ye("Which",()=>i(l+1),t),u(d+2))};return u(0)},Match:(e,n,t)=>(rn("Match",[e[0]],t),e[0].isPure===!1&&xe("Match",[e[0]],t),f.compileMatchTernary(e[0].engine,e,t,{ternary:(r,o,i)=>Fn(r,o,i),eq:"==",noMatch:le(t),allowStrings:!1,arm:r=>Ye("Match",r,t),statement:r=>Tu(e[0],r,t)})),Power:(e,n,t)=>{let r=e[0],o=e[1];if(r===null)throw new Error("Could not compile `Power`: no argument");if(o==null)throw new Error("Could not compile `Power`: expected two operands, got one");let i=f.negativeBaseFloatPower(e);if(f.isComplexValued(r)||f.isComplexValued(o)){if(C(r,"ExponentialE")){let h=o!==null?f.eulerPiSplit(o):void 0;if(h!==void 0&&j(h.u)==="scalar"&&(h.a===void 0||j(h.a)==="scalar")){let g=qe(je(o,h.u,hp,t),2,!1,void 0,t),y=h.a===void 0?void 0:je(o,h.a,hp,t);return y===void 0?`_gpu_cossinpi(${n(g)})`:`(exp(${n(y)}) * _gpu_cossinpi(${n(g)}))`}return`_gpu_cexp(${n(o)})`}Rn("Power",r),Rn("Power",o);let c=ne(),p=f.isComplexValued(r)?n(r):`${c}(${n(r)}, 0.0)`;if(typeof i=="object")return`_gpu_cpowrr(${p}, ${q(i.value,t.language)}, ${i.oddNumerator?"-1.0":"1.0"})`;let d=f.isComplexValued(o)?n(o):`${c}(${n(o)}, 0.0)`;return`_gpu_cpow(${p}, ${d})`}let s=X(r),a=X(o);if(s!==void 0&&a!==void 0){let c=Math.pow(s,a);if(Number.isNaN(c)){if(me("Power",e))return yi(s,a,t);let p=ll(s,o,a);if(p!==void 0)return q(p,t.language)}return q(c,t.language)}let u=f.realPowerExponent(e)??(typeof i=="object"?i:void 0);if(u!==void 0){let c=ae("Power",r,n,t),p=wi(r,o),d=w=>p===void 0?q(w,t.language):`${Ve(p)}(${q(w,t.language)})`,h=`pow(abs(${c}), ${d(u.value)})`;if(!u.oddNumerator)return h;let g=p===void 0?`${c} < ${d(0)}`:`lessThan(${c}, ${d(0)})`;return`(${p===void 0?`(${g} ? -1.0 : 1.0)`:`mix(${d(1)}, ${d(-1)}, ${g})`} * ${h})`}if(me("Power",e))return`_gpu_cpow(${ge(r,n)}, ${ge(o,n)})`;let l=wi(r,o);if(a===0){let c=j(r);return c==="scalar"?"1.0":typeof c=="number"?`${Ve(c)}(1.0)`:`_gpu_powi(${n(r)}, 0.0)`}if(a===1)return Or(n(r));if(C(r,"ExponentialE")&&j(o)==="scalar"&&n(r)==="2.71828182846")return`exp(${n(o)})`;if(a===.5)return`sqrt(${n(r)})`;if(s===2)return`exp2(${n(o)})`;if(a!==void 0&&Number.isInteger(a)){let c=a,p=Math.abs(c),d;if(p===1)d=`(${n(r)})`;else if((C(r)||B(r))&&p<=Nu){let h=n(r);d=/^[A-Za-z_]\w*$|^-?[0-9]+(?:\.[0-9]*)?$/.test(h)?`(${Array(p).fill(h).join(" * ")})`:_t(h,p,j(r))}else d=_t(n(r),p,j(r));return c<0?`(1.0 / ${d})`:d}if(f.isIntegerValued(o)&&!f.isNonNegative(r)&&j(o)==="scalar"){let c=j(r),p=typeof c=="number"?c:void 0;if(c==="scalar"||p!==void 0)return`_gpu_powi${p??""}(${n(r)}, ${n(o)})`}return`pow(${$i(r,l,n)}, ${$i(o,l,n)})`},Radians:"radians",Round:(e,n,t)=>{let r=j(e[0])==="scalar",o=e[0].engine.roundingTies,i=s=>co(s,o,r);return e.length<2?f.isIntegerValued(e[0])?ve(e[0],n,t):i(r?n(e[0]):ae("Round",e[0],n,t)):Vt((s,a)=>co(s,o,a),e[0],e[1],n,t,.5)},Sign:(e,n,t)=>hn("sign",e[0],n(e[0]),t),Sin:(e,n,t)=>{if(f.isComplexValued(e[0]))return`_gpu_csin(${n(e[0])})`;let r=Wr(e[0],2,t);return r!==void 0?`_gpu_sinpi(${n(r)})`:hn("sin",e[0],n(qe(e[0],2,!0,t)),t)},Smoothstep:(e,n,t)=>Qi("smoothstep",2,e,n,t)??`smoothstep(${e.map(r=>n(r)).join(", ")})`,Sqrt:(e,n,t)=>{if(f.isComplexValued(e[0]))return`_gpu_csqrt(${n(e[0])})`;let r=X(e[0]);return r!==void 0?r<0?`${ne()}(0.0, ${q(Math.sqrt(-r),t.language)})`:q(Math.sqrt(r),t.language):e[0]?.isNegative===!0&&me("Sqrt",e)?`_gpu_csqrt(${ge(e[0],n)})`:`sqrt(${n(e[0])})`},Step:"step",Tan:(e,n,t)=>{if(f.isComplexValued(e[0]))return`_gpu_ctan(${n(e[0])})`;let r=Wr(e[0],1,t);return r!==void 0?`_gpu_tanpi(${n(r)})`:`tan(${n(qe(e[0],1,!0,t))})`},Truncate:(e,n,t)=>e.length>1&&e[1]!==null?Vt("trunc",e[0],e[1],n,t):f.isIntegerValued(e[0])?ve(e[0],n,t):`trunc(${n(e[0])})`,Real:(e,n,t)=>f.isComplexValued(e[0])?`(${n(e[0])}).x`:ve(e[0],n,t),Imaginary:(e,n)=>f.isComplexValued(e[0])?`(${n(e[0])}).y`:"0.0",Argument:(e,n,t)=>{if(f.isComplexValued(e[0])){let o=ae("Argument",e[0],n,t,!0),i=Ee(o);return i!==void 0&&i.callee==="vec2"&&i.operands.length===2?`${Gr()}(${i.operands[1]}, ${i.operands[0]})`:`${Gr()}(${Tn(o,"y")}, ${Tn(o,"x")})`}let r=ae("Argument",e[0],n,t);return Fn(`${r} >= 0.0`,"0.0",Fn(`${r} < 0.0`,"3.14159265359",en(NaN)))},Conjugate:(e,n,t)=>{if(f.isComplexValued(e[0])){let r=ne(),o=ae("Conjugate",e[0],n,t,!0);return`${r}(${Tn(o,"x")}, -${Tn(o,"y")})`}return ve(e[0],n,t)},Remainder:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Remainder`: missing argument");let o=a=>co(a,"toward-positive-infinity",j(e)==="scalar"&&j(n)==="scalar");if(rn("Remainder",[e,n],r),f.foldValueImpure(e)||f.foldValueImpure(n)){if(!f.canHoist(r)||j(e)!=="scalar"||j(n)!=="scalar")throw new Error("Could not compile `Remainder`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");He("Remainder",[e,n],r),xe("Remainder",[e,n],r);let a=f.tempVar(r),u=f.tempVar(r),l=c=>`float ${c}`;return f.hoistStatement(r,`${l(a)} = ${t(e)};`,`${l(u)} = ${t(n)};`),Oe([e,n],r),`(${a} - ${u} * ${o(`${a} / ${u}`)})`}let i=`(${t(e)})`,s=`(${t(n)})`;return`(${i} - ${s} * ${o(`${i} / ${s}`)})`},Cot:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Cot`: no argument");if(rn("Cot",[e],t),f.isComplexValued(e)){if(f.foldValueImpure(e)){if(!f.canHoist(t))throw new Error("Could not compile `Cot`: an impure (Random) complex operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");He("Cot",[e],t),xe("Cot",[e],t);let i=f.tempVar(t),s=`${ne()} ${i}`;return f.hoistStatement(t,`${s} = ${n(e)};`),Oe([e],t),`_gpu_cdiv(_gpu_ccos(${i}), _gpu_csin(${i}))`}let o=n(e);return`_gpu_cdiv(_gpu_ccos(${o}), _gpu_csin(${o}))`}if(f.foldValueImpure(e)){if(!f.canHoist(t)||j(e)!=="scalar")throw new Error("Could not compile `Cot`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");He("Cot",[e],t),xe("Cot",[e],t);let o=f.tempVar(t),i=`float ${o}`;return f.hoistStatement(t,`${i} = ${n(qe(e,1,!0,t))};`),Oe([e],t),`(_gpu_cos(${o}) / _gpu_sin(${o}))`}let r=n(qe(e,1,!0,t));return`(${hn("cos",e,r,t)} / ${hn("sin",e,r,t)})`},Csc:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Csc`: no argument");return f.isComplexValued(e)?`_gpu_cdiv(${ne()}(1.0, 0.0), _gpu_csin(${n(e)}))`:`(1.0 / ${hn("sin",e,n(qe(e,2,!0,t)),t)})`},Sec:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Sec`: no argument");return f.isComplexValued(e)?`_gpu_cdiv(${ne()}(1.0, 0.0), _gpu_ccos(${n(e)}))`:`(1.0 / ${hn("cos",e,n(qe(e,2,!0,t)),t)})`},Arccot:([e],n)=>{if(e===null)throw new Error("Could not compile `Arccot`: no argument");return`(1.5707963267948966 - atan(${n(e)}))`},Arccsc:([e],n)=>{if(e===null)throw new Error("Could not compile `Arccsc`: no argument");return f.isComplexValued(e)||me("Arccsc",[e])?qt("_gpu_cacsc",e,n):`asin(1.0 / (${n(e)}))`},Arcsec:([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsec`: no argument");return f.isComplexValued(e)||me("Arcsec",[e])?qt("_gpu_casec",e,n):`acos(1.0 / (${n(e)}))`},Sinh:(e,n,t)=>{if(f.isComplexValued(e[0])){let r=fn(e[0],2,t);return r!==void 0?`_gpu_ipi_sinh(${n(r)})`:`_gpu_csinh(${n(e[0])})`}return`sinh(${n(e[0])})`},Cosh:(e,n,t)=>{if(f.isComplexValued(e[0])){let r=fn(e[0],2,t);return r!==void 0?`_gpu_ipi_cosh(${n(r)})`:`_gpu_ccosh(${n(e[0])})`}return`cosh(${n(e[0])})`},Tanh:(e,n,t)=>{if(f.isComplexValued(e[0])){let r=fn(e[0],1,t);return r!==void 0?`_gpu_ipi_tanh(${n(r)})`:`_gpu_ctanh(${n(e[0])})`}return Zi(e[0],n)},Coth:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Coth`: no argument");if(f.isComplexValued(e)){let r=fn(e,1,t);if(r!==void 0)return`_gpu_ipi_coth(${n(r)})`;let o=ae("Coth",e,n,t,!0);return`_gpu_cdiv(_gpu_ccosh(${o}), _gpu_csinh(${o}))`}return`(1.0 / ${Zi(e,n)})`},Csch:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Csch`: no argument");if(f.isComplexValued(e)){let r=fn(e,2,t);return r!==void 0?`_gpu_ipi_csch(${n(r)})`:`_gpu_cdiv(${ne()}(1.0, 0.0), _gpu_csinh(${n(e)}))`}return`(1.0 / sinh(${n(e)}))`},Sech:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Sech`: no argument");if(f.isComplexValued(e)){let r=fn(e,2,t);return r!==void 0?`_gpu_ipi_sech(${n(r)})`:`_gpu_cdiv(${ne()}(1.0, 0.0), _gpu_ccosh(${n(e)}))`}return`(1.0 / cosh(${n(e)}))`},Arcosh:(e,n)=>f.isComplexValued(e[0])?`_gpu_cacosh(${n(e[0])})`:me("Arcosh",e)?`_gpu_cacosh(${ge(e[0],n)})`:`acosh(${n(e[0])})`,Arsinh:(e,n)=>f.isComplexValued(e[0])?`_gpu_casinh(${n(e[0])})`:`asinh(${n(e[0])})`,Artanh:(e,n)=>f.isComplexValued(e[0])?`_gpu_catanh(${n(e[0])})`:me("Artanh",e)?`_gpu_catanh(${ge(e[0],n)})`:`atanh(${n(e[0])})`,Arcoth:([e],n)=>{if(e===null)throw new Error("Could not compile `Arcoth`: no argument");return f.isComplexValued(e)||me("Arcoth",[e])?qt("_gpu_cacoth",e,n):`atanh(1.0 / (${n(e)}))`},Arcsch:([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsch`: no argument");return`asinh(1.0 / (${n(e)}))`},Arsech:([e],n)=>{if(e===null)throw new Error("Could not compile `Arsech`: no argument");return f.isComplexValued(e)||me("Arsech",[e])?qt("_gpu_casech",e,n):`acosh(1.0 / (${n(e)}))`},Arctan2:(e,n)=>{if(e.length<2)throw new Error("Could not compile `Arctan2`: need two arguments");return`${Gr()}(${n(e[0])}, ${n(e[1])})`},Hypot:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Hypot`: need two arguments");return`length(vec2(${t(e)}, ${t(n)}))`},Haversine:([e],n,t)=>{if(e===null)throw new Error("Could not compile `Haversine`: no argument");return`((1.0 - ${hn("cos",e,n(e),t)}) * 0.5)`},InverseHaversine:([e],n)=>{if(e===null)throw new Error("Could not compile `InverseHaversine`: no argument");return`(2.0 * asin(sqrt(${n(e)})))`},Gamma:(e,n,t)=>{let r=e[0];if(!r)throw new Error("Could not compile `Gamma`: no argument");if(e.length>1)throw new Error(`Could not compile \`Gamma\`: the two-operand form is the upper incomplete gamma \u0393(s, z), which has no ${t.language??"GPU"} lowering (\`_gpu_gamma\` is the COMPLETE \u0393).`);return`_gpu_gamma(${n(r)})`},GammaLn:([e],n)=>{if(e===null)throw new Error("Could not compile `GammaLn`: no argument");return`_gpu_gammaln(${n(e)})`},Factorial:([e],n)=>{if(e===null)throw new Error("Could not compile `Factorial`: no argument");return`_gpu_gamma(${n(e)} + 1.0)`},Beta:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Beta`: need two arguments");let o=ae("Beta",e,t,r),i=ae("Beta",n,t,r);return`(_gpu_gamma(${o}) * _gpu_gamma(${i}) / _gpu_gamma(${o} + ${i}))`},Erf:([e],n)=>{if(e===null)throw new Error("Could not compile `Erf`: no argument");return`_gpu_erf(${n(e)})`},Digamma:([e],n)=>{if(e===null)throw new Error("Could not compile `Digamma`: no argument");return`_gpu_digamma(${n(e)})`},Trigamma:([e],n)=>{if(e===null)throw new Error("Could not compile `Trigamma`: no argument");return`_gpu_trigamma(${n(e)})`},PolyGamma:(e,n)=>{if(e.length!==2||e[0]===null||e[1]===null)throw new Error("Could not compile `PolyGamma`: need two arguments");return`_gpu_polygamma(${n(e[0])}, ${n(e[1])})`},Zeta:(e,n)=>{if(e.length===1)return`_gpu_zeta(${n(e[0])})`;if(e.length===2)return`_gpu_zeta_generalized(${n(e[0])}, ${n(e[1])})`;throw new Error("Could not compile `Zeta`: it takes one or two operands")},HurwitzZeta:(e,n)=>{if(e.length!==2)throw new Error("Could not compile `HurwitzZeta`: only the two-operand form `HurwitzZeta(s, a)` compiles");return qr("HurwitzZeta",e),`_gpu_hurwitz_zeta(${n(e[0])}, ${n(e[1])})`},LerchPhi:(e,n)=>{if(e.length!==3)throw new Error("Could not compile `LerchPhi`: it takes exactly three operands");return qr("LerchPhi",e),`_gpu_lerch_phi(${n(e[0])}, ${n(e[1])}, ${n(e[2])})`},PolyLog:(e,n)=>{if(e.length!==2)throw new Error("Could not compile `PolyLog`: it takes exactly two operands");return qr("PolyLog",e),`_gpu_poly_log(${n(e[0])}, ${n(e[1])})`},Binomial:Gi,Choose:Gi,Erfc:([e],n)=>{if(e===null)throw new Error("Could not compile `Erfc`: no argument");return`(1.0 - _gpu_erf(${n(e)}))`},ErfInv:([e],n)=>{if(e===null)throw new Error("Could not compile `ErfInv`: no argument");return`_gpu_erfinv(${n(e)})`},Heaviside:([e],n)=>{if(e===null)throw new Error("Could not compile `Heaviside`: no argument");return`_gpu_heaviside(${n(e)})`},Sinc:([e],n)=>{if(e===null)throw new Error("Could not compile `Sinc`: no argument");return`_gpu_sinc(${n(e)})`},FresnelC:([e],n)=>{if(e===null)throw new Error("Could not compile `FresnelC`: no argument");return`_gpu_fresnelC(${n(e)})`},FresnelS:([e],n)=>{if(e===null)throw new Error("Could not compile `FresnelS`: no argument");return`_gpu_fresnelS(${n(e)})`},BesselJ:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `BesselJ`: need two arguments");return`_gpu_besselJ(int(${t(e)}), ${t(n)})`},Lb:"log2",Log:(e,n)=>{if(e.length===0)throw new Error("Could not compile `Log`: no argument");if(e.some(t=>f.isComplexValued(t))||e.some(t=>t.isNegative===!0)&&me("Log",e)){let t=`_gpu_cln(${ge(e[0],n)})`;return e.length===1?`(${t} * 0.4342944819032518)`:`_gpu_cdiv(${t}, _gpu_cln(${ge(e[1],n)}))`}return e.length===1?`(log(${n(e[0])}) / log(10.0))`:f.fixedLogBase(e)===2?`log2(${n(e[0])})`:`(log(${n(e[0])}) / log(${n(e[1])}))`},Log10:([e],n)=>{if(e===null)throw new Error("Could not compile `Log10`: no argument");return`(log(${n(e)}) * 0.4342944819032518)`},Lg:([e],n)=>{if(e===null)throw new Error("Could not compile `Lg`: no argument");return`(log(${n(e)}) * 0.4342944819032518)`},Square:([e],n)=>{if(e===null)throw new Error("Could not compile `Square`: no argument");if(C(e)||B(e)){let r=n(e);if(/^[A-Za-z_]\w*$|^-?[0-9]+(?:\.[0-9]*)?$/.test(r))return`(${r} * ${r})`;let o=j(e);return _t(r,2,o)}let t=j(e);return _t(n(e),2,t)},Root:([e,n],t,r)=>{if(e===null)throw new Error("Could not compile `Root`: no argument");if(f.isComplexValued(e)||n!=null&&f.isComplexValued(n)){if(n!=null&&f.isComplexValued(n))throw new Error("Could not compile `Root`: a complex degree has no shader lowering.");let u=ne(),l=ae("Root",e,t,r,!0);if(n==null)return`_gpu_csqrt(${l})`;let c=X(n);if(c!==void 0){let h=q(1/c,r.language),g=`_gpu_cpow(${l}, ${u}(${h}, 0.0))`;return!Number.isInteger(c)||c%2===0?g:Fn(`(${l}).y == 0.0`,`${u}(sign((${l}).x) * pow(abs((${l}).x), ${h}), 0.0)`,g)}let p=ae("Root",n,t,r),d=`mod(abs(${p}), 2.0) == 1.0`;return Fn(`(${l}).y == 0.0 && fract(${p}) == 0.0 && ${d}`,`${u}(sign((${l}).x) * pow(abs((${l}).x), 1.0 / (${p})), 0.0)`,`_gpu_cpow(${l}, ${u}(1.0 / (${p}), 0.0))`)}if(n==null)return`sqrt(${t(e)})`;let o=X(n);if(o===2)return`sqrt(${t(e)})`;let i=X(e);if(i!==void 0&&o!==void 0){let u=Math.pow(i,1/o);if(Number.isNaN(u)){let l=i<0?f.realRootDegreeTerms(n):void 0;if(i<0&&(Number.isInteger(o)&&o%2!==0||l?.oddNumerator===!0))return q(-Math.pow(-i,1/o),r.language);if(l!==void 0)return q(Math.pow(-i,1/o),r.language);if(me("Root",[e,n]))return yi(i,1/o,r)}return q(u,r.language)}if(me("Root",[e,n]))return`_gpu_cpow(${ge(e,t)}, ${ne()}(1.0 / (${t(n)}), 0.0))`;let s=f.realRootDegreeTerms(n);if(o!==void 0&&(Number.isInteger(o)&&o%2!==0||s?.oddNumerator===!0)){let u=ae("Root",e,t,r);return`(sign(${u}) * pow(abs(${u}), ${q(1/o,r.language)}))`}if(o!==void 0&&s!==void 0)return`pow(abs(${t(e)}), ${q(1/o,r.language)})`;let a=t(n);return`pow(${t(e)}, 1.0 / ${/^[\w.]+$/.test(a)?a:`(${a})`})`},GamutMap:(e,n,t)=>{if(e.length===0)throw new Error("Could not compile `GamutMap`: no argument");let r=ke("GamutMap",e[0],n,t),o=e.length>=2&&e[1]!==null?e[1]:void 0,i="srgb";if(o!==void 0){let a=Dt(o);if(a===null)throw new Error("Could not compile `GamutMap`: the gamut must be a string literal on a shader target");i=a}let s=Ht.get(i);if(s!==void 0)return`${s}(${r})`;throw new Error(`Could not compile \`GamutMap\`: unknown gamut "${i}" \u2014 the gamut is ${[...Ht.keys()].map(a=>`"${a}"`).join(" or ")}.`)},ColorMix:(e,n,t)=>{if(e.length<2)throw new Error("Could not compile `ColorMix`: need two colors");let r=ke("ColorMix",e[0],n,t),o=ke("ColorMix",e[1],n,t),i=e.length>=3?n(e[2]):"0.5";return`_gpu_color_mix(${r}, ${o}, ${i})`},ColorContrast:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `ColorContrast`: need two colors");return`_gpu_apca(${ke("ColorContrast",e,t,r)}, ${ke("ColorContrast",n,t,r)})`},ContrastingColor:ce((e,n,t)=>{if(e.length===0)throw new Error("Could not compile `ContrastingColor`: no argument");let r=(l,c,p)=>`(${l} ? ${c} : ${p})`;if(e.slice(0,3).some(l=>l.isPure===!1))throw new Error("Could not compile `ContrastingColor`: an impure (Random) operand cannot be bound to a temporary at this position \u2014 a repeated draw would shift every later value in the shader.");t!==void 0&&rn("ContrastingColor",e.slice(0,3),t);let o=(l,c)=>{if(t===void 0||l.unknowns.length===0||/^[A-Za-z_]\w*$/.test(c)||!f.canHoist(t))return c;let p=f.tempVar(t),h=`${Ne()} ${p}`;return f.hoistStatement(t,`${h} = ${c};`),p},i=o(e[0],ke("ContrastingColor",e[0],n,t));if(e.length>=3){let l=o(e[1],ke("ContrastingColor",e[1],n,t)),c=o(e[2],ke("ContrastingColor",e[2],n,t));return r(`abs(_gpu_apca(${l}, ${i})) >= abs(_gpu_apca(${c}, ${i}))`,l,c)}let s="vec3",a=`${s}(0.0)`,u=`${s}(1.0, 0.0, 0.0)`;return r(`abs(_gpu_apca(${u}, ${i})) >= abs(_gpu_apca(${a}, ${i}))`,u,a)}),ColorToColorspace:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `ColorToColorspace`: need color and space");let o=Dt(n);if(o===null)throw new Error("Could not compile `ColorToColorspace`: space must be a string literal");let i=Hn("ColorToColorspace",e,t,r);switch(o){case"oklch":return i;case"oklab":case"lab":return`_gpu_oklch_to_oklab(${i})`;case"rgb":return bi(e,i,r);case"hsl":return`_gpu_rgb_to_hsl(_gpu_oklch_to_srgb(${i}))`;case"hsv":return`_gpu_rgb_to_hsv(_gpu_oklch_to_srgb(${i}))`;default:throw new Error(`Could not compile \`ColorToColorspace\`: unsupported space "${o}" on GPU target`)}},ColorFromColorspace:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `ColorFromColorspace`: need components and space");let r=Dt(n);if(r===null)throw new Error("Could not compile `ColorFromColorspace`: space must be a string literal");let o=_(e)&&op.has(e.operator)?e:null;if(_(e)&&e.operator==="List")throw new Error("Could not compile `ColorFromColorspace`: a list is not a color component vector \u2014 the operand must be a tuple or a color.");o?gn("ColorFromColorspace",o.ops):_(e)&&e.operator==="Tuple"&&gn("ColorFromColorspace",e.ops),o&&kn(o.ops.slice(0,3),Ne());let i=o?`${Ne()}(${o.ops.slice(0,3).map(s=>t(s)).join(", ")})`:t(e);if(!fo.has(r))throw new Error(`Could not compile \`ColorFromColorspace\`: unsupported space "${r}" on GPU target`);return i},Color:([e])=>{if(e===null)throw new Error("Could not compile `Color`: no argument");let n=Dt(e);if(n===null)throw new Error("Could not compile `Color`: argument must be a string literal on GPU target");let t=fr(n);if(t===null)throw new Error(`Could not compile \`Color\`: invalid color string "${n}"`);if((t&255)!==255)throw new Error(`Could not compile \`Color\`: the color string "${n}" carries an alpha channel, which is not representable on the GPU target \u2014 color values are \`vec3\` (OKLCh) end to end, with no alpha channel. Use a fully opaque color and pass the alpha separately (e.g. as a uniform) at the framebuffer boundary.`);let r=t>>>24&255,o=t>>>16&255,i=t>>>8&255,s=ba({r,g:o,b:i});return`${Ne()}(${q(s.L)}, ${q(s.C)}, ${q(s.H)})`},Rgb:(e,n)=>{if(e.length<3)throw new Error("Could not compile `Rgb`: need 3 components");return gn("Rgb",e),`_gpu_srgb_to_oklch(${Ne()}(${n(e[0])}, ${n(e[1])}, ${n(e[2])}))`},Hsv:(e,n)=>{if(e.length<3)throw new Error("Could not compile `Hsv`: need 3 components");return gn("Hsv",e),`_gpu_srgb_to_oklch(_gpu_hsv_to_rgb(${Ne()}(${n(e[0])}, ${n(e[1])}, ${n(e[2])})))`},Hsl:(e,n)=>{if(e.length<3)throw new Error("Could not compile `Hsl`: need 3 components");return gn("Hsl",e),`_gpu_srgb_to_oklch(_gpu_hsl_to_rgb(${Ne()}(${n(e[0])}, ${n(e[1])}, ${n(e[2])})))`},Oklab:(e,n)=>{if(e.length<3)throw new Error("Could not compile `Oklab`: need 3 components");return gn("Oklab",e),`_gpu_oklab_to_oklch(${es(e,n)})`},Oklch:(e,n)=>{if(e.length<3)throw new Error("Could not compile `Oklch`: need 3 components");return gn("Oklch",e),es(e,n)},AsOklch:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsOklch`: no argument");return ct(e,Hn("AsOklch",e,n,t),t)},AsOklab:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsOklab`: no argument");return`_gpu_oklch_to_oklab(${Hn("AsOklab",e,n,t)})`},AsRgb:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsRgb`: no argument");return bi(e,Hn("AsRgb",e,n,t),t)},AsHsv:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsHsv`: no argument");return`_gpu_rgb_to_hsv(_gpu_oklch_to_srgb(${Hn("AsHsv",e,n,t)}))`},AsHsl:([e],n,t)=>{if(e===null)throw new Error("Could not compile `AsHsl`: no argument");return`_gpu_rgb_to_hsl(_gpu_oklch_to_srgb(${Hn("AsHsl",e,n,t)}))`},Mandelbrot:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Mandelbrot`: missing arguments");let r=Fi("Mandelbrot",n,t);return`_fractal_mandelbrot(${ge(e,t)}, ${r})`},Julia:([e,n,t],r)=>{if(e===null||n===null||t===null)throw new Error("Could not compile `Julia`: missing arguments");let o=Fi("Julia",t,r);return`_fractal_julia(${ge(e,r)}, ${ge(n,r)}, ${o})`},Cross:"cross",Distance:"distance",Dot:"dot",Norm:ce((e,n,t)=>{if(e.length>1)throw new Error(`Could not compile \`Norm\`: only the default L2 norm compiles on the ${t.language??"GPU"} target.`);let r=e[0];if((_(r,"Tuple")||_(r,"PointList"))&&Pt(r)){let o=xr(r,t);if(typeof o=="string")throw new Error(`Could not compile \`Norm\`: a point with a broadcasting component, and ${o}.`);return n(o)}if(_(r,"Tuple")||_(r,"List")){if(Pt(r))throw new Error("Could not compile `Norm`: a point with a broadcasting component.");let o=r.nops;if(o===0||o>4)throw new Error(`Could not compile \`Norm\`: the ${t.language??"GPU"} 'length()' builtin only accepts 2-4 component vectors (got ${o}).`);if(r.ops.some(i=>f.isComplexValued(i))){let i=r.ops.map(s=>{if(f.isComplexValued(s))return`length(${n(s)})`;if(j(s)!=="scalar")throw new Error(`Could not compile \`Norm\`: the entry \`${s.toString()}\` is not a scalar, so it has no modulus beside a complex entry.`);return n(s)});return o===1?i[0]:`length(${Ve(o)}(${i.join(", ")}))`}return o===1?`abs(${n(r.op1)})`:`length(${n(r)})`}return`length(${n(r)})`},uu),Length:ce((e,n,t)=>{let o=kr(t.fragmentScope,e[0])?.type,i=o?.kind==="point"?o.size:o?.kind==="list"?o.count:void 0;if(e.length===1&&i!==void 0)return ue(i);throw new Error(`Could not compile \`Length\`: the collection element count is not supported on the ${t.language??"GPU"} target: the '${t.language??"GPU"}' 'length()' builtin is the Euclidean norm (CE 'Norm'), not a count.`)}),Normalize:"normalize",Reflect:"reflect",Refract:"refract",Sum:ce((e,n,t)=>os("Sum",e,n,t),Ci),Product:ce((e,n,t)=>os("Product",e,n,t),Ci),Range:(e,n,t)=>{if(e.length<2||e.length>3)throw new Error("Could not compile `Range`: GPU compile expects 2 or 3 arguments (lo, hi, step?)");let r=e[0].re,o=e[1].re,i=e.length===3?e[2].re:1;if(!Number.isFinite(r)||!Number.isFinite(o)||!Number.isFinite(i))throw new Error("Could not compile `Range`: GPU compile requires constant numeric bounds (non-constant ranges must be materialized at JS host then uploaded as a uniform)");if(i===0)throw new Error("Could not compile `Range`: step cannot be zero");let s=Do(r,o,i);if(s===0)throw new Error("Could not compile `Range`: empty range (lo > hi for positive step, or lo < hi for negative step)");Xt("Range",s);let a=[];for(let l=0;l<s;l++)a.push(r+l*i);return`${`float[${s}]`}(${a.map(l=>ue(l,t.language)).join(", ")})`},Loop:(e,n,t)=>{if(!e[0])throw new Error("Could not compile `Loop`: no body");if(!e[1])throw new Error("Could not compile `Loop`: no indexing set");let r=e.slice(1);f.assertBreakLeavesWholeLoop(r,e[0]);let o="int",i=g=>`float(${g})`,s=[],a=[],u=[],l=[];for(let g of r){if(!_(g,"Element"))throw new Error("Could not compile `Loop`: expected Element(index, Range(lo, hi))");let y=g.ops[0],w=g.ops[1],x=_(w,"ParallelDomain")&&w.nops===1?w.op1:w;if(!C(y))throw new Error("Could not compile `Loop`: index must be a symbol");if(!_(x,"Range"))throw new Error("Could not compile `Loop`: expected Range(lo, hi)");let $=y.symbol;if(Te($,t.language),s.includes($))throw new Error(`Could not compile \`Loop\` on this target: two Element clauses use the same index \`${$}\``);let A=s.find(m=>x.has(m));if(A!==void 0)throw new Error(`Could not compile \`Loop\` on this target: the \`Range\` of the index \`${$}\` reads the outer index \`${A}\`, and the bounds of a shader loop do not read an index`);let E=[];l.push(E);let z=m=>{let v=x.ops[m];if(B(v)||C(v)&&!Wi(v.symbol,t)&&t.varsKeys?.has(v.symbol)!==!0){let O=v.re;if(Number.isFinite(O))return`${Math.floor(O)}`;if(B(v))throw new Error("Could not compile `Loop`: bounds must be finite numbers")}let b=f.compileListStatement(t,v,O=>[f.compile(v,O)]),S=b.pop(),T=Oa(S);if(T!==void 0&&Number.isFinite(T)&&b.length===0)return`${Math.floor(T)}`;if(!v.type.matches("integer"))throw new Error(`Could not compile \`Loop\` on this target: the ${m===0?"lower":"upper"} bound \`${v.toString()}\` of the \`Range\` of the index \`${$}\` is read at run time, so it must have the static type \`integer\` (it has the type \`${v.type.toString()}\`)`);if(S.includes(`
`))throw new Error(`Could not compile \`Loop\` on this target: the ${m===0?"lower":"upper"} bound \`${v.toString()}\` of the \`Range\` of the index \`${$}\` compiles to statements, which the read of a bound cannot hold`);let L=f.tempVar(t);return E.push(...b.map(O=>/[;}]\s*$/.test(O)?O:`${O};`),`int ${L} = int(${S});`),L},N=z(0),M=z(1),P=1;if(x.ops.length>=3){let m=x.ops[2].re;if(!Number.isInteger(m)||m===0)throw new Error("Could not compile `Loop` on this target: the step of the `Range` must be a non-zero integer known at compile time");P=m}let G=`${o} ${$}`,k=P>0?`${$} <= ${M}`:`${$} >= ${M}`,R=P===1?`${$}++`:`${$} += ${P}`;s.push($),a.push(`for (${G} = ${N}; ${k}; ${R}) {`);let I=g.ops[2];if(I===void 0||C(I,"Nothing")){u.push(void 0);continue}if(!D(I.type.type,"boolean"))throw new Error(`Could not compile \`Loop\` on this target: the guard of the index \`${$}\` is not a boolean (type \`${I.type.toString()}\`)`);if(mn(I))throw new Error(`Could not compile \`Loop\` on this target: the guard of the index \`${$}\` needs statements, which a shader \`if\` condition cannot hold`);let H=[...s];u.push(f.compile(I,{...t,var:m=>H.includes(m)?i(m):t.var(m),...f.withBoundScope(t,H)}))}let c=f.compileStatementList(e[0],{...t,shaderLoopJumps:eo(e[0]),var:g=>s.includes(g)?i(g):t.var(g),...f.withBoundScope(t,s)}),p=g=>g.split(`
`).map(y=>`  ${y}`).join(`
`),d=c,h=bp(t);for(let g=a.length-1;g>=0;g--){let y=u[g];y!==void 0&&(d=`if (${y}) {
${p(d)}
}`),h!==void 0&&(d=`${h}
${d}`),d=`${a[g]}
${p(d)}
}`;let w=l[g];w.length>0&&(d=`${w.join(`
`)}
${d}`)}return d},GCD:ce((e,n,t)=>zi("GCD",e,n,t)),LCM:ce((e,n,t)=>zi("LCM",e,n,t)),Variance:ce((e,n,t)=>{let r;if(e.length===1&&_(e[0],"List"))r=e[0].ops;else if(e.length>=2)r=e;else throw new Error("Could not compile `Variance`: GPU target requires a List argument or at least 2 scalar arguments");let o=r.length;if(o<2)throw new Error("Could not compile `Variance`: need at least 2 elements");let i=r.map(l=>ae("Variance",l,n,t)),a=`((${i.join(" + ")}) / ${ue(o)})`;return`((${i.map(l=>`(${l} - ${a}) * (${l} - ${a})`).join(" + ")}) / ${ue(o-1)})`},Ei),Median:ce((e,n,t)=>{let r;if(e.length===1&&_(e[0],"List"))r=e[0].ops;else if(e.length>=1)r=e;else throw new Error("Could not compile `Median`: GPU target requires a List argument or at least 1 scalar argument");let o=r.length;if(o===0)throw new Error("Could not compile `Median`: empty list");if(o>8)throw new Error(`Could not compile \`Median\`: GPU target supports up to 8 elements via inline sorting network (got ${o}). For larger lists, compute on the CPU and pass the result as a uniform.`);let i=r.map(s=>n(s));return o===1?ct(r[0],i[0],t):`_gpu_median_${o}(${i.join(", ")})`},Ei),Random:ce((e,n,t)=>{if(e.length===0)return Wt(t);if(e.length===1)return dp(e[0],n,t);throw new Error("Could not compile `Random`: expects at most one operand, the DOMAIN to draw from (`Random()`, `Random(Interval(a, b))`, `Random(Range(\u2026))`). The seed argument was removed by the Random family redesign \u2014 seed with `WithRandomSeed(seed, body)`.")},e=>e.length===1),WithRandomSeed:(e,n,t)=>{if(e.length!==2)throw new Error("Could not compile `WithRandomSeed(seed, body)`: expects exactly two operands");let r=_n(t),o=mp(e[0],n,t),i=rs(r);r.frames.push({seed:o,counter:i});try{return ve(e[1],n,t)}finally{r.frames.pop()}},RandomChoice:(e,n,t)=>{throw new Error(Kt("RandomChoice(domain, k)",t))},RandomSample:(e,n,t)=>{throw new Error(Kt("RandomSample(xs, k)",t))},RandomShuffle:(e,n,t)=>{throw new Error(Kt("RandomShuffle(xs)",t))},Apply:(e,n,t)=>{let r=xp(e,t);if(typeof r=="string")throw new Error(`Could not compile \`Apply\`: ${r}`);return ve(je(e,r,{name:"the body of an applied function",operators:"any",symbolLeaves:!0},t),n,t)},Function:()=>{throw new Error("Anonymous functions (Function) are not supported in GPU targets")}};Ln(bn.Power,Ot("exp2",0,2));Ln(bn.Clamp,ss("min",0));Ln(bn.ElementMax,ss("max"));Ln(bn.ElementMin,ss("min"));function ss(e,n){return(t,r)=>{if(Ee(r)?.callee!==e||t.some(a=>a==null)||t.some(a=>f.isComplexValued(a)))return;let o=t.map(j);if(n!==void 0&&typeof o[n]!="number"||new Set(o.filter(a=>typeof a=="number")).size!==1||!o.every(a=>a==="scalar"||typeof a=="number"))return;let s=new Set;return o.forEach((a,u)=>{a==="scalar"&&s.add(u)}),s.size>0?s:void 0}}function xp(e,n){try{Sr(e)}catch(h){return h.message.replace(/^Could not compile `Apply`: /,"")}if(Rr(e))return gl();let[t,...r]=e;if(t===void 0)return"missing function";let o=r,i=_(t,"Derivative")?f.appliedDerivativeLiteral(e):t;if(!_(i,"Function"))return _(t,"Derivative")?`${f.appliedDerivativeDeclineReason(e)}, and target '${n.language}' has no numerical derivative.`:`only a function literal or the derivative of a function compiles as the callee on target '${n.language}'.`;let s=Ca(i,o);s!==void 0&&(o=s);let a=i.ops.slice(1);if(a.length!==o.length)return`the function takes ${a.length} parameter(s) but ${o.length} argument(s) are supplied.`;let u={};for(let[h,g]of a.entries()){let y=et(g)?"":Be(g);if(!y)return"a parameter of the function is not a plain name.";u[y]=o[h]}let l=i.ops[0],c=_(l,"Block")&&l.nops===1?l.op1:l;if(_(c,"Block"))return"the body of the function has more than one statement.";if(!o.every(h=>h.isPure===!0))return"an argument has an effect, which the substitution would repeat.";let p=Mn(c);for(let[h,g]of Object.entries(u)){if(p.has(h))return`the body of the function rebinds \`${h}\`.`;for(let y of g.symbols)if(p.has(y))return`the body of the function binds \`${y}\`, which an argument reads.`}if(xa(i.type.type)&&o.some(is))return Hf(i,c,Object.keys(u),o,n);let d=f.appliedArgumentTypeMismatch(i,o,!1);return d!==void 0?d:c.subs(u)}function Hf(e,n,t,r,o){let i,s=[];for(let u of r){if(!is(u)){s.push(void 0);continue}let l=Wf(u);if(l===void 0)return`the function applies to each element of the argument \`${u.toString()}\`, but target '${o.language}' cannot write out its elements: its length is not known at compile time, or it has more than ${yn} elements.`;if(i!==void 0&&l.length!==i)return`the function applies to each element of collection arguments of different lengths (${i} and ${l.length}).`;i=l.length,s.push(l)}let a=[];for(let u=0;u<(i??0);u++){let l=r.map((c,p)=>s[p]?.[u]??c);if(l.some((c,p)=>s[p]!==void 0&&is(c))){let c=xp([e,...l],o);if(typeof c=="string")return c;a.push(c)}else{let c=f.appliedArgumentTypeMismatch(e,l,!1);if(c!==void 0)return c;let p={};for(let[d,h]of t.entries())p[h]=l[d];a.push(n.subs(p))}}return e.engine.function("List",a)}function is(e){if(ca(e))return!0;let n=Qn(e.type.type);return D(n,In)&&!D(n,"string")&&!(typeof n=="object"&&n.kind==="tuple")}function Wf(e){let n=e.engine;if(_(e,"List"))return e.nops<=yn?e.ops:void 0;if(_(e,"Range")&&(e.nops===2||e.nops===3)){let r=e.ops[0].re,o=e.ops[1].re,i=e.nops===3?e.ops[2].re:1;if(![r,o,i].every(Number.isFinite)||i===0)return;let s=Do(r,o,i);return s>yn?void 0:Array.from({length:s},(a,u)=>n.number(r+u*i))}let t=j(e);if(typeof t=="number")return Array.from({length:t},(r,o)=>n.function("At",[e,n.number(o+1)]))}function as(e,n,t,r,o){let i=e[0];if(!_(i))return n(i);let s=i.ops;if(s.length===0)return n(i);let a=s.length,u=s[0],l=_(u)?u.nops:0;if(l===1&&s.every(c=>_(c)&&c.nops===1)){let c=s.map(p=>n(_(p)?p.ops[0]:p));return a>=2&&a<=4?`${t(a)}(${c.join(", ")})`:(Xt("Matrix",a),`${o(a)}(${c.join(", ")})`)}if(a===l&&a>=2&&a<=4&&s.every(c=>_(c)&&c.nops===l)){let c=[];for(let p=0;p<l;p++){let d=s.map(h=>n(_(h)?h.ops[p]:h));c.push(`${t(a)}(${d.join(", ")})`)}return`${r(a)}(${c.join(", ")})`}return n(i)}var bt=yn;function xn(e){if(!(e===void 0||e==="unknown"||e==="any")&&(e=Ct(e),!(e==="nothing"||e==="never"))){if(D(e,"boolean"))return{kind:"boolean"};if(D(e,"color"))return{kind:"color"};if(ze(e))return{kind:"complex"};if(D(e,"integer"))return{kind:"integer"};if(D(e,"number"))return{kind:"real"};if(typeof e!="string"){if(e.kind==="tuple"){let n=e.elements.length;return n<2||n>4||!e.elements.every(t=>Yf(Ct(t.type)))?void 0:{kind:"point",size:n}}if(e.kind==="list"){let n=e.dimensions??void 0;if(n!==void 0&&n.length!==1)return;let t=n!==void 0&&n[0]>=0?n[0]:void 0,r=e.elements;if(typeof r!="string"&&r.kind==="union"&&r.types.some(i=>ze(Ct(i))))return;let o=xn(e.elements);return o===void 0?D(e.elements,"number")&&!ze(e.elements)?{kind:"list",element:{kind:"real"},count:t}:void 0:o.kind==="real"||o.kind==="integer"?{kind:"list",element:{kind:"real"},count:t}:o.kind==="point"?{kind:"list",element:o,count:t}:void 0}}}}function Cp(e){let n=tn(e);if(n!==void 0){if(n.width===1)return n.element==="f"?{kind:"real"}:n.element==="i"||n.element==="u"?{kind:"integer"}:n.element==="b"?{kind:"boolean"}:void 0;if(n.element==="f"&&n.width>=2&&n.width<=4)return{kind:"point",size:n.width}}}function Yf(e){return D(e,"number")&&!ze(e)}function ls(e){return e>=2&&e<=4?`vec${e}`:void 0}function Yn(e){switch(e.kind){case"real":case"integer":return"float";case"boolean":return"bool";case"complex":return"vec2";case"color":return"vec3";case"point":return ls(e.size);case"list":{if(e.count===void 0||e.count<1||e.count>bt)return;if(e.element.kind==="point"){let n=ls(e.element.size);return n===void 0?void 0:`${n}[${e.count}]`}return ls(e.count)??`float[${e.count}]`}}}var F=(e,n,t={})=>({operands:e,result:n,...t});function Sp(e,n){if(n.parent===void 0)return tt.isComplexValued(e);let t=new Map,r=new Map;for(let o=n;o.parent!==void 0;o=o.parent)for(let[i,s]of o.bindings){if(t.has(i)||!("representation"in s))continue;let a=s.type;t.set(i,a.kind==="complex");let u=a.kind==="complex"?2:a.kind==="color"?3:a.kind==="point"?a.size:a.kind==="list"?a.count:void 0;a.kind==="boolean"?r.set(i,f.LOCAL_BOOLEAN):u!==void 0?r.set(i,u):a.kind!=="list"&&r.set(i,f.LOCAL_SCALAR)}return tt.withLocalShapeFrame(t,r,()=>tt.isComplexValued(e))}var fe={signatures:[F(["real"],"real")]},yt={signatures:[F(["real"],"real"),F(["point"],"point")]},te={signatures:[F(["complex"],"complex",{when:Sp}),F(["real"],"real"),F(["complex"],"complex"),F(["point"],"point")]},Kf={walk:(e,n,t,r)=>r.signatures(e,n,t,Sp(e,n)?[F(["complex"],"complex")]:te.signatures)},Zt=e=>({signatures:[F(Array(e).fill("real"),"real")]}),Rp={signatures:[F(["real"],"real",{rest:"real"}),F(["complex"],"complex",{rest:"complex"}),F(["point"],"point",{rest:"point",broadcast:!0})]},wp={walk:(e,n,t,r)=>{let i=(_(e)?e.ops:[]).slice(1).find(s=>Pp(s));return i!==void 0?r.refuse(i,"place",`An operand of \`${e.operator}\` after the first holds a block, which GLSL cannot evaluate there`):r.signatures(e,n,t,[F(["boolean"],"boolean",{rest:"boolean"})])}};function Pp(e,n=new Set){return!_(e)||e.operator==="Function"?!1:e.operator==="Block"?!0:n.has(e)?!1:(n.add(e),e.ops.some(t=>Pp(t,n)))}var Ap={signatures:[F(["real"],"real",{rest:"real"}),F(["complex"],"complex",{rest:"complex"}),F(["point"],"point",{rest:"point",broadcast:!0,pointScalarSlots:[]})]};function _o(e,n,t){return{walk:(r,o,i,s)=>{let a=_(r)?r.ops:[],u=p=>D(p.type.type,"number"),l=p=>n!==void 0&&Xf(p,d=>n.has(d)&&!Qo(o,d));if(t!==void 0&&a.some(l)&&a.every(p=>u(p)||l(p)))return"walk"in t?t.walk(r,o,i,s):s.signatures(r,o,i,t.signatures);let c=a.find(p=>Ma(p.type.type)&&Ua(p.type.type));return c!==void 0&&a.some(p=>D(p.type.type,"number"))?s.refuse(r,"signature",`The operand \`${c.toString()}\` of \`${r.operator}\` may be a point by its type \`${c.type.toString()}\`, and another operand is a number`):"walk"in e?e.walk(r,o,i,s):s.signatures(r,o,i,e.signatures)}}}function Xf(e,n){let t=!1,r=o=>C(o)?n(o.symbol)?(t=!0,!0):D(o.type.type,"number"):_(o)?o.operator==="Tuple"||o.operator==="List"||o.operator==="Function"||o.operatorDefinition?.scoped===!0||nt(o.engine,o.operator)!==void 0?!1:o.ops.every(r):D(o.type.type,"number");return r(e)&&t}var Zf={signatures:[F(["real","real"],"real"),F(["complex","complex"],"complex"),F(["point","point"],"point",{broadcast:!0,pointScalarSlots:[]})]},Tp={signatures:[...Zf.signatures,...te.signatures]},Jt=(e,n)=>({signatures:[F(Array(e).fill("real"),"real"),F(Array(e).fill("point"),"point",{broadcast:!0,scalarSlots:n})]}),Qt={signatures:[F(["real","real","real"],"color")]},er={signatures:[F(["color"],"color"),F(["point"],"color",{sizes:[3]})]},ho={signatures:[F(["real","real"],"boolean",{rest:"real"})]},$p={signatures:[F(["real","real"],"boolean"),F(["boolean","boolean"],"boolean"),F(["tuple","tuple"],"boolean")]},us={signatures:[F(["real"],"real"),F(["complex"],"real")]},ps=e=>({walk:(n,t,r,o)=>{let i=_(n)?n.ops[0]:void 0,s=i!==void 0&&C(i)?Ct(i.type.type):void 0;return s!==void 0&&typeof s!="string"&&s.kind==="list"&&(s.dimensions==null||s.dimensions.some(a=>a<0))?o.refuse(n,"signature",`The operand \`${i.toString()}\` of \`${n.operator}\` is a list with no stated length, not a point`):o.signatures(n,t,r,[F(["point"],"real",{sizes:e})])}}),go={walk:(e,n,t,r)=>kp(e)?r.refuse(e,"limit",`The step of \`${e.operator}\` is 0 or not finite, so the value is NaN, and the GLSL fragment has no NaN literal`):r.signatures(e,n,t,[F(["real"],"real"),F(["real","real"],"real"),F(["point"],"point")])};function kp(e){if(!_(e)||e.nops!==2||!["Floor","Ceil","Round","Truncate"].includes(e.operator))return!1;let n=X(e.op2);return n!==void 0&&(n===0||!Number.isFinite(n))}var cs=e=>({walk:(n,t,r,o)=>{let i=_(n)?n.ops:[];return Cr(n.operator,i)==="complex"?o.refuse(n,"signature",`The value of \`${n.toString()}\` is not real, and the GLSL fragment has no complex lane for \`${n.operator}\``):o.signatures(n,t,r,[F(Array(e).fill("real"),"real")])}});function vp(e,n,t,r){let o=_(e)?e.ops:[];if(o.length===1)return Jf(e,o[0],n,t,r);for(let i of o.slice(1)){let s=_(i,"Limits")?[i.op2,i.op3]:_(i,"Element")&&_(i.op2,"Range")?[i.op2.op1,i.op2.op2]:[];try{Za(e.operator,s.map(a=>a===void 0?a:r.constant(a,n)??a))}catch(a){if(!String(a?.message).includes("out-of-range"))continue;return r.refuse(e,"limit",`A bound of \`${e.operator}\` is out-of-range: more than ${Number.MAX_SAFE_INTEGER} in magnitude`)}}return vl(e,n,t,r)}function Jf(e,n,t,r,o){let i=o.value(n,t,r),s=i.type,a=s.kind==="point"?{kind:"real"}:s.kind==="list"&&(s.element.kind==="real"||s.element.kind==="integer")&&s.count!==void 0&&(s.count>=2&&s.count<=4||_(n,"List")&&s.count<=bt)?s.element:void 0;return a===void 0?o.refuse(e,"signature",`\`${e.operator}\` of the collection \`${n.toString()}\` of the type \`${Tr(s)}\` is not in the GLSL fragment: the collection must be a point, a list of 2 to 4 real numbers, or a list literal of at most ${bt} real numbers`):o.valueFacts(e,a,[{kind:"none",type:s,representation:i.representation}])}function Ep(e,n,t,r){let o=_(e)?e.ops:[];if(o.length!==2)return r.refuse(e,"signature",`\`${e.operator}\` takes two operands`);let i=r.value(o[0],n,t),s=B(o[0])?o[0]:r.constant(o[0],n);if(B(s)&&!Number.isFinite(s.re))return r.refuse(e,"limit",`The first operand of \`${e.operator}\` is the non-finite constant \`${s.toString()}\`, which the GLSL fragment does not take`);let a=o[1],u=a.re;if(!B(a)||!Number.isInteger(u)||u<0||a.im!==0)return r.refuse(e,"signature",`The second operand of \`${e.operator}\` is a literal non-negative integer in the GLSL fragment`);if(u>Bt)return r.refuse(e,"limit",`The second operand of \`${e.operator}\` is at most ${Bt} in the GLSL fragment`);let l=r.convert(i,{kind:"real"});return l===void 0?r.refuse(e,"signature",`The first operand of \`${e.operator}\` is a real in the GLSL fragment`):r.valueFacts(e,{kind:"real"},[l])}function Qf(e,n,t,r){let o=_(e)?e.ops:[],i=$a("D",o);return i===void 0?r.refuse(e,"head","`D` is in the GLSL fragment only when the engine finds a closed form of the derivative at compile time"):r.type(i,n,t)}function ed(e,n,t,r){let o=_(e)?e.ops:[],i=Ja(o),s=o.slice(1);if(i===void 0||!_(i,"Function")||i.nops-1!==s.length)return r.refuse(e,"head","`Apply` is in the GLSL fragment only as the application of a derivative whose closed form the engine finds at compile time");let a=i.ops.slice(1).map(l=>Be(l));if(a.some(l=>l===""))return r.refuse(e,"head","`Apply` of this derivative is outside the GLSL fragment");let u=i.ops[0].subs(Object.fromEntries(a.map((l,c)=>[l,s[c]])));return r.type(u,n,t)}var oe=e=>({walk:e});function nd(e,n,t,r){let o=_(e)?e.ops[0]:void 0;if(o!==void 0){let i=eo(o),s=new Set,a=l=>{if(!(!_(l)||s.has(l))&&(s.add(l),!(l.operator==="Loop"||l.operator==="Function"))){if(l.operator==="Break"&&!i.has(l))return l;for(let c of l.ops){let p=a(c);if(p!==void 0)return p}}},u=a(o);if(u!==void 0)return r.refuse(u,"place","A `Break` of a `Loop` is in the GLSL fragment as a statement of the loop body, or as the branch of an `If` with no else branch there")}return zl(e,n,t,r)}function td(e,n,t,r){let o=Rl(e,n,t,r),i=o.type,s=i.kind==="list"&&i.element.kind!=="point"&&i.count!==void 0&&i.count>=2&&i.count<=4;return(i.kind==="boolean"||i.kind==="color"||i.kind==="list"&&!s)&&D("missing",e.type.type)?r.refuse(e,"signature",`The \`Which\` has no default clause, and its value has the type \`${Tr(i)}\`, which has no representation of \`Missing\` in GLSL: add a last clause with the condition \`True\``):o}function rd(e,n,t,r){let o=Sl(e,n,t,r);if(!_(e)||e.nops!==2||t.place==="statement")return o;let i=o.type,s=i.kind==="list"&&i.element.kind!=="point"&&i.count!==void 0&&i.count>=2&&i.count<=4;return i.kind==="color"||i.kind==="list"&&!s?r.refuse(e,"signature",`The \`If\` has no else branch, and its value has the type \`${Tr(i)}\`, which has no \`NaN\` value in GLSL: add an else branch`):o}var od={Add:_o(Ap),Multiply:Rp,Subtract:_o(Tp),Divide:{signatures:[F(["real","real"],"real"),F(["complex","complex"],"complex"),F(["point","point"],"point",{broadcast:!0,pointScalarSlots:[1]})]},Negate:te,Power:{signatures:[F(["real","real"],"real"),F(["complex","complex"],"complex"),F(["point","point"],"point",{broadcast:!0})]},Root:{signatures:[F(["real","real"],"real"),F(["complex","real"],"complex")]},Sqrt:Kf,Square:te,Abs:{walk:(e,n,t,r)=>{let o=_(e)?e.ops[0]:void 0;return o!==void 0&&Ia(o)?r.refuse(e,"signature",`The operand \`${o.toString()}\` of \`Abs\` has the type \`${o.type.toString()}\`, which admits a point and another shape`):r.signatures(e,n,t,[F(["real"],"real"),F(["complex"],"real"),F(["tuple"],"real"),F(["point"],"point")])}},Sign:yt,Floor:go,Ceil:go,Round:go,Truncate:go,Fract:yt,Mod:Jt(2,[1]),Remainder:Zt(2),Hypot:Zt(2),Clamp:Jt(3,[1,2]),Mix:Jt(3,[2]),Step:Jt(2,[0]),Smoothstep:Jt(3,[0,1]),Max:{signatures:[F(["real"],"real",{rest:"real"}),F(["real-list"],"real"),F(["real-or-list"],"real",{rest:"real-or-list"}),F(["point"],"real",{rest:"point",broadcast:!0})]},Min:{signatures:[F(["real"],"real",{rest:"real"}),F(["real-list"],"real"),F(["real-or-list"],"real",{rest:"real-or-list"}),F(["point"],"real",{rest:"point",broadcast:!0})]},ElementMax:{signatures:[F(["real"],"real",{rest:"real"}),F(["point","point"],"point",{rest:"point",broadcast:!0})]},ElementMin:{signatures:[F(["real"],"real",{rest:"real"}),F(["point","point"],"point",{rest:"point",broadcast:!0})]},GCD:{signatures:[F(["real"],"real",{rest:"real"}),F(["real-list"],"real"),F(["real-or-list"],"real",{rest:"real-or-list"})]},LCM:{signatures:[F(["real"],"real",{rest:"real"}),F(["real-list"],"real"),F(["real-or-list"],"real",{rest:"real-or-list"})]},Factorial:fe,Binomial:oe(Ep),Choose:oe(Ep),D:oe(Qf),Apply:oe(ed),Sin:te,Cos:te,Tan:te,Cot:te,Sec:te,Csc:te,Sinh:te,Cosh:te,Tanh:te,Coth:te,Sech:te,Csch:te,Arcsin:te,Arccos:te,Arctan:te,Arccot:yt,Arcsec:te,Arccsc:te,Arsinh:te,Arcosh:te,Artanh:te,Arcoth:te,Arsech:te,Arcsch:yt,Exp:te,Exp2:yt,Ln:te,Log:{signatures:[F(["real"],"real"),F(["real","real"],"real"),F(["complex"],"complex"),F(["complex","complex"],"complex")]},Log2:yt,Log10:fe,Lb:fe,Lg:fe,Arctan2:{signatures:[F(["real","real"],"real"),F(["point","point"],"point")]},Sinc:fe,Erf:fe,Erfc:fe,ErfInv:fe,Gamma:fe,GammaLn:fe,Digamma:fe,Trigamma:fe,PolyGamma:Zt(2),Beta:Zt(2),Zeta:{signatures:[F(["real"],"real"),F(["real","real"],"real")]},HurwitzZeta:cs(2),PolyLog:cs(2),LerchPhi:cs(3),BesselJ:Zt(2),FresnelC:fe,FresnelS:fe,Heaviside:fe,Haversine:fe,InverseHaversine:fe,Degrees:fe,Radians:fe,Mandelbrot:{signatures:[F(["complex","index"],"real")]},Julia:{signatures:[F(["complex","complex","index"],"real")]},Real:us,Imaginary:us,Argument:us,Conjugate:{signatures:[F(["real"],"real"),F(["complex"],"complex")]},Tuple:oe(ei),PointList:oe(ei),List:oe(Tl),PointX:ps([2,3,4]),PointY:ps([2,3,4]),PointZ:ps([3,4]),Dot:{signatures:[F(["real","real"],"real"),F(["point","point"],"real")]},Cross:{signatures:[F(["point","point"],"point",{sizes:[3]})]},Norm:{signatures:[F(["real"],"real"),F(["complex"],"real"),F(["point"],"real")]},Normalize:{signatures:[F(["real"],"real"),F(["point"],"point")]},Distance:{signatures:[F(["point","point"],"real")]},Reflect:{signatures:[F(["real","real"],"real"),F(["point","point"],"point")]},Refract:{signatures:[F(["real","real","real"],"real"),F(["point","point","real"],"point")]},Length:oe(ut),First:oe(ut),Second:oe(ut),Third:oe(ut),Last:oe(ut),Rgb:Qt,Hsl:Qt,Hsv:Qt,Oklab:Qt,Oklch:Qt,Color:{signatures:[F(["color"],"color")]},ColorMix:{signatures:[F(["color","color"],"color"),F(["color","color","real"],"color")]},AsRgb:er,AsHsl:er,AsHsv:er,AsOklab:er,AsOklch:er,ColorToColorspace:{signatures:[F(["color","name"],{kind:"point",size:3}),F(["point","name"],{kind:"point",size:3},{sizes:[3]})]},ColorFromColorspace:{signatures:[F(["point","name"],"color",{sizes:[3]}),F(["color","name"],"color")]},GamutMap:{signatures:[F(["color"],"color"),F(["color","name"],"color")]},ContrastingColor:{signatures:[F(["color"],"color"),F(["color","color"],"color"),F(["color","color","color"],"color")]},ColorContrast:{signatures:[F(["color","color"],"real")]},Less:ho,LessEqual:ho,Greater:ho,GreaterEqual:ho,Equal:$p,NotEqual:$p,And:wp,Or:wp,Not:{signatures:[F(["boolean"],"boolean")]},If:oe(rd),Which:oe(td),Sum:oe(vp),Product:oe(vp),At:oe(Pl),Range:oe(Al),Block:oe(Cl),Loop:oe(nd),ParallelLoop:oe(Fl),Break:oe(El),Assign:oe(ni),AddTo:oe(ni),Declare:oe(Ll),Typed:oe(kl)};function id(e){if(!_(e))return;let n=e.ops,[t,r]=n;switch(e.operator){case"Argument":case"Beta":case"Cot":case"Remainder":case"ContrastingColor":case"Variance":return n;case"Binomial":case"Choose":{let o=r===void 0?void 0:X(r);return o!==void 0&&Number.isInteger(o)&&o>=2?[t]:void 0}case"Conjugate":return t!==void 0&&f.isComplexValued(t)?[t]:void 0;case"Coth":return t!==void 0&&f.isComplexValued(t)&&fn(t,1)===void 0?[t]:void 0;case"Power":{if(t===void 0||r===void 0||f.isComplexValued(t)||f.isComplexValued(r)||X(t)!==void 0&&X(r)!==void 0)return;let o=f.negativeBaseFloatPower(n);return f.realPowerExponent(n)!==void 0||typeof o=="object"?[t]:void 0}case"Round":case"Floor":case"Ceil":case"Truncate":return t===void 0?void 0:r===void 0?e.operator==="Round"&&!f.isIntegerValued(t)&&j(t)!=="scalar"?[t]:void 0:X(r)===void 0?[t,r]:[t];case"Root":{if(t===void 0)return;if(f.isComplexValued(t)||r!==void 0&&f.isComplexValued(r))return r!==void 0&&X(r)===void 0?[t,r]:[t];if(r===void 0)return;let o=X(r);return o===void 0||o===2||X(t)!==void 0||me("Root",[t,r])?void 0:Number.isInteger(o)&&o%2!==0||f.realRootDegreeTerms(r)?.oddNumerator===!0?[t]:void 0}}return sd.has(e.operator)&&e.nops>2?n.slice(1,-1):void 0}var sd=new Set(["Less","LessEqual","Greater","GreaterEqual","Equal","NotEqual"]),ad=new Set(["AsHsl","AsHsv","AsOklab","AsOklch","AsRgb","ColorContrast","ColorMix","ColorToColorspace","ContrastingColor","GamutMap"]);function ld(e){if(!(!_(e)||!ad.has(e.operator)))return e.ops.find(n=>!_(n,"Tuple")&&Er(n))}function ud(e,n){return id(e)?.find(t=>!Cn(t,n)&&En(t,n))}function ds(e,n={}){let t=e.storage,r=n.vars,o=p=>p.role==="input"&&C(p.symbol)&&r!==void 0&&Object.hasOwn(r,p.symbol.symbol)?r[p.symbol.symbol]:void 0,i=p=>{if(!C(p.symbol))return!1;let d=p.symbol.symbol;try{let h=o(p);return h!==void 0?(typeof h=="string"&&/^[A-Za-z_]\w*$/.test(h)&&Te(h,"glsl"),!1):(Te(d,"glsl"),!1)}catch{return!0}},s=p=>n.functions!==void 0&&Object.hasOwn(n.functions,p),a=oe((p,d,h,g)=>{let w=(_(p)?p.ops:[]).map(A=>{let E=g.value(A,d,h);return{kind:"none",type:E.type,representation:E.representation}}),x=xn(p.type.type),$=x!==void 0&&(x.kind==="color"||x.kind==="point"||x.kind==="complex"||x.kind==="boolean")?x:{kind:"real"};return g.valueFacts(p,$,w)}),u=p=>({walk:(d,h,g,y)=>{let w=ud(d,e);if(w!==void 0)return y.refuse(d,"head",`The operand \`${w.toString()}\` of \`${d.operator}\` contains code that the caller supplies (a \`vars\` entry that is code, a \`functions\` entry or a \`compile\` handler), and the GLSL code writes that operand more than once, so the code would run more than once`);let x=_(d,"At")?d.ops[0]:void 0,$=x===void 0?void 0:xn(x.type.type);if($?.kind==="list"&&$.count===1&&fs($)&&!(C(x)&&t?.get(x.symbol)==="sampler2D"))return y.refuse(d,"signature","The base of `At` is a list of one element, which has no value in GLSL (there is no `vec1`)");let A=x!==void 0&&C(x)?t?.get(x.symbol):void 0,E=A!==void 0&&x!==void 0?Qn(x.type.type):void 0,z=A!==void 0&&C(x)&&E!==void 0&&(typeof E=="string"||E.kind!=="list"||(E.dimensions??[]).length<=1&&(E.dimensions?.[0]??-1)<=0)?Hi(x,A):void 0;if(z!==void 0&&"decline"in z)return y.refuse(d,"signature",`Could not compile \`At\`: ${z.decline}.`);let N=ld(d);return N!==void 0?y.refuse(d,"signature",`The color operand \`${N.toString()}\` of \`${d.operator}\` holds colors in different color spaces at the positions its value comes from, and a GLSL color is a \`vec3\` with no color space`):_(d)&&Qa(d.engine,d.operator,e,d)!==void 0?y.refuse(d,"head",`A user definition shadows the library operator \`${d.operator}\`, which the GLSL fragment then does not take`):"walk"in p?p.walk(d,h,g,y):y.signatures(d,h,g,p.signatures)}}),l={};for(let[p,d]of Object.entries(od))l[p]=u(d);let c=n.declaredVectors;c!==void 0&&c.size>0&&(l.Add=u(_o(Ap,c,Rp)),l.Subtract=u(_o(Tp,c,{signatures:[F(["real","real"],"real"),F(["complex","complex"],"complex"),F(["point","point"],"point",{broadcast:!0})]})));for(let p of Object.keys(n.functions??{}))l[p]=a;return{name:"GLSL",rules:l,typeOfSymbol:p=>{if(C(p))return xn(p.type.type)},typeOfInput:p=>{if(!C(p))return;let d=xn(p.type.type);return d!==void 0?d:p.engine.lookupDefinition(p.symbol)===void 0?void 0:xn(p.engine.symbol(p.symbol).type.type)},typeOfType:xn,storedValue:p=>{if(!C(p))return;let d=p.symbol;if(!(r!==void 0&&Object.hasOwn(r,d)))return p.engine._getSymbolValue(d)},representationOfBinding:(p,d)=>{if(d.declared===void 0&&i(d))return;let h=d.declared===void 0?void 0:tn(d.declared);if(h?.width===1&&(h.element==="i"||h.element==="u"))return p.kind==="integer"?h.element==="i"?"int":"uint":void 0;if(d.role==="index")return p.kind==="integer"?"int":void 0;if(p.kind==="list"){if(d.role==="parameter")return fs(p)&&p.count!==void 0&&p.count>=2&&p.count<=4?Yn(p):void 0;if(d.role!=="input")return;if(C(d.symbol)&&t?.get(d.symbol.symbol)==="sampler2D")return fs(p)?"sampler2D":void 0}return Yn(p)},representationOfValue:Yn,bindingLimit:(p,d)=>{let h=d.symbol,g=C(h)?h.symbol:h.toString();if(i(d)){let y=o(d);return y===void 0?`\`${g}\` is a reserved word of GLSL, and the shader cannot name a variable so: rename it, or map it with the \`vars\` option`:`The \`vars\` option maps \`${g}\` to \`${String(y)}\`, a reserved word of GLSL, and the shader cannot name a variable so`}if(p.kind==="list"){if(p.count===void 0)return`The list \`${g}\` has no static count: name it in the \`storage\` option (\`storage: { ${g}: 'sampler2D' }\`) to read it from a texture`;if(p.count>bt)return`The list \`${g}\` has ${p.count} elements, more than the limit of ${bt} elements of a shader array: name it in the \`storage\` option (\`storage: { ${g}: 'sampler2D' }\`) to read it from a texture`}},constantValue:p=>{if(e.constantFold===!1||kp(p))return;let d=tl(p,e)?.value;if(!(B(d)&&d.im!==0)&&!(d!==void 0&&d.unknowns.length>0))return d},literal:(p,d,h)=>{if(p==="name")return h==="GamutMap"?Ht.has(d):h==="ColorToColorspace"||h==="ColorFromColorspace"?fo.has(d):!0;let g=fr(d);return g!==null&&(g&255)===255},counterRange:[-(2**31),2**31-1],aggregateHasNoLoop:(p,d,h)=>d>h||_(p)&&rt(h-d+1,vn(p.op1),oo),sumAssigned:n.sumAssigned,functionOf:(p,d)=>pd(p,d,e,s)}}function ms(e,n,t){let r=lt(e,n,{scalarNames:new Set,localNames:new Set(t)},dt);return Dn(r,n,new Set([...t,...jn(r).written]))}function fs(e){return e.element.kind==="real"||e.element.kind==="integer"}function pd(e,n,t,r){if(!_(e))return;let o=e.operator;if(r(o))return;let i=e.engine,s=nt(i,o);if(s===void 0)return;let a=s.ops.slice(1),u=a.map(R=>Be(R)),l=e.ops,c=s.ops[0],p=s,d=u.map((R,I)=>I),h=R=>{let I=t.storage?.get(R.symbol);if(I==="sampler2D")return!0;if(I!==void 0)return!1;let H=xn(R.type.type);return H?.kind==="list"&&H.count!==void 0&&H.count<=bt&&Yn(H)!==void 0},g=l.map(R=>C(R)&&!Qo(n,R.symbol)&&ln(i.lookupDefinition(R.symbol))&&D(R.type.type,"list<any>")&&h(R)),y=o;if(g.includes(!0)&&!Va(i,o,s)&&l.length===a.length&&u.every(R=>R!=="")){let R=new Set;if(_(c,"Block"))for(let b of c.ops)_(b,"Declare")&&C(b.op1)&&R.add(b.op1.symbol),Mn(b,R);else Mn(c,R);let I=new Set(u.filter((b,S)=>!g[S])),H={},m=[],v=!0;for(let[b,S]of l.entries()){if(!g[b]||!C(S))continue;let T=u[b];(R.has(T)||R.has(S.symbol)||I.has(S.symbol))&&(v=!1),H[T]=S,m.push(`${b}=${JSON.stringify(S.symbol)}`)}if(v){let b=c.subs(H),S=i.box(["Function",b.json,...a.filter((T,L)=>!g[L]).map(T=>T.json)]);b.isValid&&S.isValid&&_(S,"Function")&&(c=S.ops[0],p=S,d=d.filter(T=>!g[T]),y=`${o}#bind${m.join(",")}`)}}let w=d.map(R=>u[R]),x=d.map(R=>{let I=Wa(i,o,R);if((I===void 0||I==="unknown"||I==="any")&&(I=la(a[R])),!(I===void 0||I==="unknown"||I==="any"))return I}),$=x.map(R=>{if(R===void 0||ha(R))return;let I=xn(R);return I===void 0||I.kind==="list"?void 0:I}),A=f.userFunctionParamsAreScalar(i,o),E=x.map((R,I)=>$[I]===void 0&&(R!==void 0&&D(R,"collection")||!A&&(R===void 0||D("list<number>",R)))),N=w.some(R=>Vr(R,"glsl"))&&y===o?Ya(i,o,l,t):void 0,M=N!==void 0;M&&(y=`${o}#inlined`);let P=t.userFunctions;if(P!==void 0&&y===o){let R=ol(i,o,s,l,t);R?.scalarDefinition===!0&&(p=R.specialized)}let G=P===void 0?void 0:$r(p,t,P,o),k=ms(G??ja(c,t),t,w);return{key:y,name:o,parameters:w,parameterTypes:$,collectionParameters:E,broadcasts:A,parameterSymbols:d.map(R=>{if(M)return;let I=a[R];return C(I)?I:_(I)&&C(I.op1)?I.op1:void 0}),arguments:l.length===a.length?d.map(R=>l[R]):l,body:k,sizeCheck:M?{body:N,shared:!1}:G===void 0?void 0:{body:G,shared:!0},sumAssigned:wr(c)}}var cd=1e4,fd=1e6,dd=8,md=2e3,Lp=100;function zp(e,n,t){if(n.userFunctions===void 0||!Oo(e))return e;let r=e.engine,o=new hs(r,n,t);if(!o.mentionsUserCall(e))return e;let i;try{i=o.expand(e,Fp,hd,new Set)}catch(a){if(a===xt)return e;throw a}if(i===e||!o.sharesACallAcrossBodies())return e;let s=dd*o.sourceSize(e);if(o.writtenSize(i)>s||gd(i,s)>s||i.isValid!==!0)return e;for(let a of o.substituted)n.symbolDeps?.add(a);return i}var Fp=new Set,hd="";function gd(e,n){let t=[],r=new Set,o=p=>{if(!r.has(p)){if(r.add(p),_(p))for(let d of p.ops)o(d);t.push(p)}};o(e),t.reverse();let i=[-1],s=new Map,a=(p,d,h)=>{let g=`${p}:${d}:${h}`,y=s.get(g);return y===void 0&&(y=i.length,i.push(p),s.set(g,y)),y},u=new Map;t.forEach((p,d)=>u.set(p,d));let l=new Map([[e,new Set([0])]]),c=0;for(let p of t){let d=l.get(p);if(c+=d.size,c>n)return c;if(!_(p))continue;let h=new Set(dr(p).map(g=>g.index));p.ops.forEach((g,y)=>{let w=l.get(g);if(w===void 0&&l.set(g,w=new Set),h.has(y))for(let x of d)w.add(a(x,u.get(p),y));else for(let x of d)w.add(x)})}return c}var xt=Symbol("over budget"),hs=class{constructor(n,t,r){this.engine=n;this.target=t;this.options=r}engine;target;options;calls=new Map;bodiesOf=new Map;nodes=new WeakMap;frames=[];mentions=new WeakMap;ids=new WeakMap;idOfSpelling=new Map;paths=new WeakMap;distinctNodes=0;pureSeen=new Set;substituted=new Set;substitutions=0;isShaderScalar(n){return this.target.loweredSymbolType?.(n)==="float"}isHeadOverridden(n){return this.options.isOverridden(n)||this.target.unrollSkipHeads?.has(n)===!0||this.target.overridesHead?.(n)===!0}isUserFunction(n){return this.isHeadOverridden(n)?!1:f.userFunctionLiteral(this.engine,n)!==void 0}sourceSize(n){let t=vn(n),r=new Set,o=new Set,i=[n];for(;i.length>0;){let s=i.pop();if(o.has(s)||!_(s))continue;o.add(s),i.push(...s.ops);let a=s.operator;if(r.has(a)||!this.isUserFunction(a))continue;r.add(a);let u=f.userFunctionLiteral(this.engine,a);u!==void 0&&(t+=vn(u.ops[0]),i.push(u.ops[0]))}return t}writtenSize(n){let t=new Map,r=[n],o=new Set;for(;r.length>0;){let l=r.pop();if(!o.has(l)&&(o.add(l),!!_(l)))for(let c of l.ops)t.set(c,(t.get(c)??0)+1),r.push(c)}let i=l=>(t.get(l)??0)>=2&&this.pathCount(l)>=Pa,s=new Map,a=l=>{let c=s.get(l);if(c!==void 0)return c;let p=1;if(_(l))for(let d of l.ops)p+=i(d)?1:a(d);return s.set(l,p),p},u=a(n);for(let l of o)i(l)&&(u+=a(l));return u}charge(n){this.pathCount(n)}pathCount(n){let t=this.paths.get(n);if(t!==void 0)return t;let r=1;if(_(n)){for(let o of n.ops)if(r+=this.pathCount(o),r>fd)throw xt}if(this.paths.set(n,r),this.distinctNodes+=1,this.distinctNodes>cd)throw xt;return r}checkPure(n){if(!Oo(n,this.pureSeen))throw xt}idOf(n){let t=this.ids.get(n);if(t!==void 0)return t;let r=_(n)?`${n.operator}(${n.ops.map(i=>this.idOf(i)).join(",")})`:JSON.stringify(n.json),o=this.idOfSpelling.get(r);return o===void 0&&(o=this.idOfSpelling.size,this.idOfSpelling.set(r,o)),this.ids.set(n,o),o}callKey(n,t){return`${n}(${t.map(r=>this.idOf(r)).join(",")})`}mentionsUserCall(n){if(!_(n))return!1;let t=this.mentions.get(n);if(t!==void 0)return t;let r=this.isUserFunction(n.operator)||n.ops.some(o=>this.mentionsUserCall(o));return this.mentions.set(n,r),r}sharesACallAcrossBodies(){for(let n of this.bodiesOf.values())if(n.size>1)return!0;return!1}expand(n,t,r,o){if(!_(n)||!this.mentionsUserCall(n)||n.operator==="Function"||this.isHeadOverridden(n.operator))return n;if(t.size>0){let l=this.expandNode(n,t,r,o);return this.charge(l),l}let i=this.nodes.get(n);if(i!==void 0){for(let l of i.keys)this.record(l,r);return i.result}let s={body:r,keys:new Set};this.frames.push(s);let a;try{a=this.expandNode(n,t,r,o)}finally{this.frames.pop()}this.charge(a),this.nodes.set(n,{result:a,keys:s.keys});let u=this.frames[this.frames.length-1];if(u!==void 0&&u.body===r)for(let l of s.keys)u.keys.add(l);return a}record(n,t){let r=this.bodiesOf.get(n);r===void 0&&(r=new Set,this.bodiesOf.set(n,r)),r.add(t);let o=this.frames[this.frames.length-1];o!==void 0&&o.body===t&&o.keys.add(n)}expandNode(n,t,r,o){let i=this.unrolledClause(n,t,r,o);if(i!==void 0)return i;let s=De(n);if((n.operator==="Sum"||n.operator==="Product")&&s.length>0)throw xt;if(s.length>0){if(n.localScope===void 0)return n;let l=new Set([...t,...s]),c=n.ops.map(d=>this.expand(d,l,r,o));if(c.every((d,h)=>d===n.ops[h]))return n;let p=ma(n.localScope,this.engine,n.operator,c);return p===void 0?n:this.engine.function(n.operator,c,{scope:p})}let a=n.ops.map(l=>this.expand(l,t,r,o)),u=n.operator;if(this.isUserFunction(u)&&!t.has(u)&&!o.has(u)){let l=this.callKey(u,a);this.record(l,r);let c=t.size===0,p=c?this.calls.get(l):void 0;if(p!==void 0)return p;for(let h of a)this.checkPure(h);let d=f.substitutedUserFunctionBody(this.engine,u,a,this.target,t.size>0?_d(t):void 0,h=>this.isShaderScalar(h));if(d!==void 0){if(this.substitutions+=1,this.substitutions>md)throw xt;o.add(u);let h;try{h=this.expand(d,t,l,o)}finally{o.delete(u)}return this.substituted.add(u),c&&this.calls.set(l,h),h}}if(a.every((l,c)=>l===n.ops[c]))return n;if(u==="Which"){let l=this.nestedWhich(a);if(l!==void 0)return l}return this.engine.function(u,a)}nestedWhich(n){if(n.length<6||n.length%2!==0)return;let t=n[n.length-2];if(!C(t)||t.symbol!=="True")return;let r=this.engine.function("Which",n.slice(n.length-4),{form:"structural"});for(let o=n.length-6;o>=0;o-=2)r=this.engine.function("Which",[n[o],n[o+1],this.engine.True,r],{form:"structural"});return r}unrolledClause(n,t,r,o){let i=n.operator;if(i!=="Sum"&&i!=="Product"||n.nops!==2)return;let[s,a]=n.ops;if(!_(a,"Limits")||a.nops!==3)return;let[u,l,c]=a.ops;if(!this.mentionsUserCall(s)||!C(u))return;let p=u.symbol;if(!B(l)||!B(c))return;let d=l.re,h=c.re;if(!Number.isSafeInteger(d)||!Number.isSafeInteger(h)||h<d)return;let g=h-d+1;if(g>Lp||!rt(g,vn(s),Lp)||s.isPure!==!0||(this.checkPure(s),f.isComplexValuedUnderIndices(s,[p]))||Mn(s).has(p))return;let w=[];for(let x=d;x<=h;x++){let $=s.subs({[p]:this.engine.number(x)});w.push(this.expand($,t,r,o))}return w.length===1?w[0]:this.engine.function(i==="Sum"?"Add":"Multiply",w,{form:"structural"})}};function _d(e){return{scalarNames:Fp,localNames:e}}var Se=5e4;function Kn(e,n,t=Se){let r=new Map,o=new Map,i=[],s=[],a=new Set,u=[[e,0,Np(e)]];for(;u.length>0;){let m=u[u.length-1],[v,b,S]=m;if(b<S.length){m[1]=b+1;let V=S[b];r.has(V)||u.push([V,0,Np(V)]);continue}if(u.pop(),r.has(v))continue;let T=S.map(V=>r.get(V)),L=_(v)&&S.length!==v.nops,O=_(v)?`${L?`R${v.nops}`:""}${v.operator}(${T.join(",")})`:C(v)?`S${v.symbol}`:`L${JSON.stringify(v.json)}`,U=o.get(O);U===void 0&&(U=i.length,o.set(O,U),i.push(v),s.push(T),L&&a.add(U)),r.set(v,U)}let l=r.get(e),c=i.length,p=new Map,d=m=>{let v=p.get(m);if(v===void 0){let b=i[m];v=_(b)&&!a.has(m)?yd(b):new Array(s[m].length).fill(void 0),p.set(m,v)}return v},h=new Map,g=m=>{let v=h.get(m);if(v===void 0){let b=i[m];v=_(b)&&!a.has(m)?Aa(b):s[m].map((S,T)=>T),h.set(m,v)}return v},y=new Map,w=m=>{let v=y.get(m);if(v===void 0){v=new Set;let b=i[m];C(b)&&v.add(b.symbol);for(let S of s[m])for(let T of w(S))v.add(T);y.set(m,v)}return v},x=[new Set],$=[-1],A=[void 0],E=(m,v)=>{for(let b=v;b>=0;b=$[b]){if(x[b].has(m))return!0;let S=A[b];if(S!==void 0){if(S.opaque)return!1;if(S.boundNames.length>0){let T=w(m);if(S.boundNames.some(L=>T.has(L)))return!1}}}return!1},z=m=>{for(let v=m;v>=0;v=$[v])if(A[v]?.inert===!0)return!0;return!1},N=0,M=[[l,0,0]];for(x[0].add(l),N=1;M.length>0;){let m=M[M.length-1],[v,b,S]=m,T=g(v);if(S>=T.length){M.pop();continue}m[2]=S+1;let L=T[S],O=s[v][L],U=b,V=d(v)[L];if(V!==void 0&&(U=x.length,x.push(new Set),$.push(b),A.push(V)),N+=1,N>t)return N;if(!z(U)){if(E(O,U))continue;x[U].add(O)}M.push([O,U,0])}let P=new Array(c);for(let m=0;m<c;m++)P[m]=n!==void 0&&n.isCallerMapped(i[m]);let G=new Array(c).fill(0);G[l]=1;for(let m=c-1;m>=0;m--)if(!P[m])for(let v of s[m])G[v]=Math.min(2,G[v]+G[m]);let k=new Array(c);for(let m=0;m<c;m++)k[m]=n!==void 0&&n.share!==!1&&m!==l&&G[m]>=2&&n.mayRecord(i[m]);let R=new Array(c),I=new Array(c),H=0;for(let m=0;m<c;m++){let v=1;for(let S of s[m])v+=R[S];R[m]=v;let b=1;if(P[m])b=v;else for(let S of s[m])b+=k[S]?1:I[S];I[m]=b,k[m]&&(H+=b)}return Math.max(N,H+I[l])}function yd(e){let n=new Array(e.nops).fill(void 0),t=e.operator;if(t==="Block"){let o=De(e);for(let i=0;i<e.nops;i++)n[i]={inert:!1,opaque:!1,boundNames:o};return n}if(t==="Function"||t==="Loop"){let o=De(e);for(let i=0;i<e.nops;i++)n[i]=i===0?{inert:!1,opaque:!0,boundNames:o}:{inert:!0,opaque:!1,boundNames:o};return n}let r=e.operatorDefinition;if(r?.scoped===!0){let o=Number.POSITIVE_INFINITY;try{for(let s of r.bindingSites?.(e.ops,"post")??[])s.path.length>0&&(o=Math.min(o,s.path[0]))}catch{o=Number.POSITIVE_INFINITY}Number.isFinite(o)||(o=0);let i=De(e);for(let s=0;s<e.nops;s++)n[s]=s<o?{inert:!1,opaque:!0,boundNames:i}:{inert:!0,opaque:o===0,boundNames:i}}for(let o of dr(e)){let i=n[o.index];n[o.index]={inert:o.inert||(i?.inert??!1),opaque:i?.opaque??!1,boundNames:i?.boundNames??[]}}return n}function Np(e){return _(e)?e.ops:[]}function Xn(e){return["x","y"].map(n=>`if ((floatBitsToUint(${e}.${n}) & 0x7FFFFFFFu) > 0x7F800000u) return vec2(${e}.${n});`).join(`
  `)}var gs={__proto__:null,_gpu_cmul:{deps:[],glsl:`vec2 _gpu_cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}`},_gpu_cdiv:{deps:[],glsl:`vec2 _gpu_cdiv(vec2 a, vec2 b) {
  float d = b.x * b.x + b.y * b.y;
  return vec2((a.x * b.x + a.y * b.y) / d, (a.y * b.x - a.x * b.y) / d);
}`},_gpu_cexp:{deps:[],glsl:`vec2 _gpu_cexp(vec2 z) {
  ${Xn("z")}
  float e = exp(z.x);
  return vec2(e * cos(z.y), e * sin(z.y));
}`},_gpu_cln:{deps:[],glsl:`vec2 _gpu_cln(vec2 z) {
  ${Xn("z")}
  return vec2(log(length(z)), atan(z.y, z.x));
}`},_gpu_cpow:{deps:["_gpu_cexp","_gpu_cmul","_gpu_cln"],glsl:`vec2 _gpu_cpow(vec2 z, vec2 w) {
  if (z.x == 0.0 && z.y == 0.0 && w.x > 0.0) return vec2(0.0);
  return _gpu_cexp(_gpu_cmul(w, _gpu_cln(z)));
}`},_gpu_cpowrr:{deps:["_gpu_cpow"],glsl:`vec2 _gpu_cpowrr(vec2 z, float e, float s) {
  if (z.y == 0.0 && z.x < 0.0) return vec2(s * pow(-z.x, e), 0.0);
  return _gpu_cpow(z, vec2(e, 0.0));
}`},_gpu_csqrt:{deps:[],glsl:`vec2 _gpu_csqrt(vec2 z) {
  ${Xn("z")}
  float r = length(z);
  float theta = atan(z.y, z.x);
  return sqrt(r) * vec2(cos(theta * 0.5), sin(theta * 0.5));
}`},_gpu_csin:{deps:[],glsl:`vec2 _gpu_csin(vec2 z) {
  ${Xn("z")}
  return vec2(sin(z.x) * cosh(z.y), cos(z.x) * sinh(z.y));
}`},_gpu_ccos:{deps:[],glsl:`vec2 _gpu_ccos(vec2 z) {
  ${Xn("z")}
  return vec2(cos(z.x) * cosh(z.y), -sin(z.x) * sinh(z.y));
}`},_gpu_ctan:{deps:["_gpu_cdiv","_gpu_csin","_gpu_ccos"],glsl:`vec2 _gpu_ctan(vec2 z) {
  return _gpu_cdiv(_gpu_csin(z), _gpu_ccos(z));
}`},_gpu_csinh:{deps:[],glsl:`vec2 _gpu_csinh(vec2 z) {
  ${Xn("z")}
  return vec2(sinh(z.x) * cos(z.y), cosh(z.x) * sin(z.y));
}`},_gpu_ccosh:{deps:[],glsl:`vec2 _gpu_ccosh(vec2 z) {
  ${Xn("z")}
  return vec2(cosh(z.x) * cos(z.y), sinh(z.x) * sin(z.y));
}`},_gpu_ctanh:{deps:["_gpu_cdiv","_gpu_csinh","_gpu_ccosh"],glsl:`vec2 _gpu_ctanh(vec2 z) {
  return _gpu_cdiv(_gpu_csinh(z), _gpu_ccosh(z));
}`},_gpu_chypot:{deps:[],glsl:`float _gpu_chypot(float x, float y) {
  float ax = abs(x);
  float ay = abs(y);
  float m = max(ax, ay);
  if (m == 0.0) return 0.0;
  float n = min(ax, ay) / m;
  return m * sqrt(1.0 + n * n);
}`},_gpu_clog1p:{deps:[],glsl:`float _gpu_clog1p(float x) {
  if (x >= 0.5) return log(1.0 + x);
  float s = x / (2.0 + x);
  float t = s * s;
  return 2.0 * s * (1.0 + t * (0.3333333333333333 + t * (0.2 + t * (0.14285714285714285 + t * (0.1111111111111111 + t * 0.09090909090909091)))));
}`},_gpu_casinhr:{deps:["_gpu_clog1p"],glsl:`float _gpu_casinhr(float v) {
  float a = abs(v);
  float r = a > 1.0e9 ? log(a) + 0.6931471805599453 : _gpu_clog1p(a + a * a / (1.0 + sqrt(1.0 + a * a)));
  return v < 0.0 ? -r : r;
}`},_gpu_czsign:{deps:[],glsl:`float _gpu_czsign(float y, float s) {
  return (y < 0.0 || (y == 0.0 && s < 0.0)) ? -1.0 : 1.0;
}`},_gpu_csqrts:{deps:["_gpu_chypot","_gpu_czsign"],glsl:`vec2 _gpu_csqrts(float x, float y, float s) {
  if (x == 0.0 && y == 0.0) return vec2(0.0);
  float h = _gpu_chypot(x, y);
  if (x >= 0.0) {
    float t = sqrt(0.5 * x + 0.5 * h);
    return vec2(t, y / (2.0 * t));
  }
  float t = sqrt(0.5 * h - 0.5 * x);
  return vec2(abs(y) / (2.0 * t), _gpu_czsign(y, s) * t);
}`},_gpu_casin_core:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_casin_core(float x0, float y0, float s) {
  float x = x0;
  float y = y0;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  vec2 a = _gpu_csqrts(1.0 - x, -y, -s);
  vec2 b = _gpu_csqrts(1.0 + x, y, s);
  float im = _gpu_casinhr(a.x * b.y - a.y * b.x);
  return vec2(atan(x, a.x * b.x - a.y * b.y), im < 0.0 ? im - k : im + k);
}`},_gpu_casin:{deps:["_gpu_casin_core"],glsl:`vec2 _gpu_casin(vec2 z) {
  return _gpu_casin_core(z.x, z.y, z.x > 0.0 ? -1.0 : 1.0);
}`},_gpu_cacos:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_cacos(vec2 z) {
  float x = z.x;
  float y = z.y;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  float s = z.x > 0.0 ? -1.0 : 1.0;
  vec2 a = _gpu_csqrts(1.0 - x, -y, -s);
  vec2 b = _gpu_csqrts(1.0 + x, y, s);
  float im = _gpu_casinhr(b.x * a.y - b.y * a.x);
  return vec2(2.0 * atan(a.x, b.x), im < 0.0 ? im - k : im + k);
}`},_gpu_catanh_core:{deps:["_gpu_chypot","_gpu_clog1p","_gpu_czsign"],glsl:`vec2 _gpu_catanh_core(float x, float y, float s) {
  if (_gpu_chypot(x, y) > 1.0e18) {
    float h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    float q = y / 8.0 / h4 / h4;
    return vec2(x / 16.0 / h4 / h4, q == 0.0 ? _gpu_czsign(y, s) * 1.5707963267948966 : 0.5 * atan(q, -1.0));
  }
  float ax = abs(x);
  float u = 1.0 - ax;
  float d = u * u + y * y;
  float re = d < 1.0e-30 ? 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))) : 0.25 * _gpu_clog1p(4.0 * ax / d);
  float m = u * (1.0 + ax) - y * y;
  float im = 2.0 * y == 0.0 ? (m < 0.0 ? _gpu_czsign(y, s) * 1.5707963267948966 : 0.0) : 0.5 * atan(2.0 * y, m);
  return vec2(x < 0.0 ? -re : re, im);
}`},_gpu_catanh:{deps:["_gpu_catanh_core"],glsl:`vec2 _gpu_catanh(vec2 z) {
  return _gpu_catanh_core(z.x, z.y, z.x > 0.0 ? -1.0 : 1.0);
}`},_gpu_catan:{deps:["_gpu_catanh_core","_gpu_inf"],glsl:`vec2 _gpu_catan(vec2 z) {
  if (z.x == 0.0 && abs(z.y) == 1.0) return vec2(_gpu_inf(), _gpu_inf());
  vec2 r = _gpu_catanh_core(-z.y, z.x, z.y < 0.0 ? -1.0 : 1.0);
  return vec2(r.y, -r.x);
}`},_gpu_casinh:{deps:["_gpu_casin_core"],glsl:`vec2 _gpu_casinh(vec2 z) {
  vec2 r = _gpu_casin_core(-z.y, z.x, z.y < 0.0 ? -1.0 : 1.0);
  return vec2(r.y, -r.x);
}`},_gpu_cacosh:{deps:["_gpu_csqrts","_gpu_casinhr"],glsl:`vec2 _gpu_cacosh(vec2 z) {
  float x = z.x;
  float y = z.y;
  float k = 0.0;
  if (max(abs(x), abs(y)) > 1.0e37) {
    x = x * 0.0625;
    y = y * 0.0625;
    k = 2.772588722239781;
  }
  vec2 a = _gpu_csqrts(x - 1.0, y, 1.0);
  vec2 b = _gpu_csqrts(x + 1.0, y, 1.0);
  return vec2(_gpu_casinhr(a.x * b.x + a.y * b.y) + k, 2.0 * atan(a.y, b.x));
}`},_gpu_cinv:{deps:[],glsl:`vec2 _gpu_cinv(vec2 z) {
  if (abs(z.x) >= abs(z.y)) {
    float r = z.y / z.x;
    float d = z.x + z.y * r;
    return vec2(1.0 / d, -r / d);
  }
  float r = z.x / z.y;
  float d = z.x * r + z.y;
  return vec2(r / d, -1.0 / d);
}`},_gpu_cln2z:{deps:["_gpu_chypot"],glsl:`float _gpu_cln2z(vec2 z) {
  return 45.054566736396445 - log(_gpu_chypot(z.x * 18446744073709551616.0, z.y * 18446744073709551616.0));
}`},_gpu_cinvpm:{deps:["_gpu_cinv","_gpu_chypot"],glsl:`vec2 _gpu_cinvpm(vec2 z, float t) {
  vec2 w = _gpu_cinv(z);
  if (_gpu_chypot(z.x, z.y) > 2.0) return vec2(1.0 + t * w.x, t * w.y);
  float nx = z.x + t;
  return vec2(nx * w.x - z.y * w.y, nx * w.y + z.y * w.x);
}`},_gpu_cacsc:{deps:["_gpu_cinv","_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z"],glsl:`vec2 _gpu_cacsc(vec2 z) {
  float s = z.y == 0.0 ? (z.x > 0.0 ? -1.0 : 1.0) : (z.y > 0.0 ? -1.0 : 1.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) return vec2(atan(z.x, abs(z.y)), s * _gpu_cln2z(z));
  vec2 w = _gpu_cinv(z);
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(p.x, p.y, -s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(atan(w.x, a.x * b.x - a.y * b.y), _gpu_casinhr(a.x * b.y - a.y * b.x));
}`},_gpu_casec:{deps:["_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z"],glsl:`vec2 _gpu_casec(vec2 z) {
  float s = z.y == 0.0 ? (z.x > 0.0 ? -1.0 : 1.0) : (z.y > 0.0 ? -1.0 : 1.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18 && (z.x != 0.0 || z.y != 0.0)) return vec2(atan(abs(z.y), z.x), -s * _gpu_cln2z(z));
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(p.x, p.y, -s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(2.0 * atan(a.x, b.x), _gpu_casinhr(b.x * a.y - b.y * a.x));
}`},_gpu_casech:{deps:["_gpu_cinvpm","_gpu_csqrts","_gpu_casinhr","_gpu_cln2z","_gpu_inf"],glsl:`vec2 _gpu_casech(vec2 z) {
  if (z.x == 0.0 && z.y == 0.0) return vec2(_gpu_inf(), 0.0);
  if (_gpu_chypot(z.x, z.y) < 1.0e-18) return vec2(_gpu_cln2z(z), z.y == 0.0 && z.x < 0.0 ? 3.141592653589793 : -atan(z.y, z.x));
  float s = z.y > 0.0 ? -1.0 : 1.0;
  vec2 p = _gpu_cinvpm(z, -1.0);
  vec2 q = _gpu_cinvpm(z, 1.0);
  vec2 a = _gpu_csqrts(-p.x, -p.y, s);
  vec2 b = _gpu_csqrts(q.x, q.y, s);
  return vec2(_gpu_casinhr(a.x * b.x + a.y * b.y), 2.0 * atan(a.y, b.x));
}`},_gpu_cacoth:{deps:["_gpu_chypot","_gpu_clog1p"],glsl:`vec2 _gpu_cacoth(vec2 z) {
  float x = z.x;
  float y = z.y;
  if (_gpu_chypot(x, y) > 1.0e18) {
    float h4 = _gpu_chypot(0.25 * x, 0.25 * y);
    return vec2(x / 16.0 / h4 / h4, -y / 16.0 / h4 / h4);
  }
  float ax = abs(x);
  float u = 1.0 - ax;
  float d = u * u + y * y;
  float re = d < 1.0e-30 ? 0.5 * (log(_gpu_chypot(1.0 + ax, y)) - log(_gpu_chypot(u, y))) : 0.25 * _gpu_clog1p(4.0 * ax / d);
  float m = (ax - 1.0) * (ax + 1.0) + y * y;
  float im = 2.0 * y == 0.0 ? (m < 0.0 ? (x > 0.0 ? -1.5707963267948966 : 1.5707963267948966) : 0.0) : 0.5 * atan(-2.0 * y, m);
  return vec2(x < 0.0 ? -re : re, im);
}`}};function Gp(e){let n=new Set;for(let i of Object.keys(gs))e.includes(i)&&n.add(i);if(n.size===0)return"";let t=new Set;function r(i){if(t.has(i))return;let s=gs[i];if(s){for(let a of s.deps)r(a);t.add(i)}}for(let i of n)r(i);let o=[];for(let i of t)o.push(gs[i].glsl);return`
`+o.join(`

`)+`
`}var _s=`
float _gpu_gamma(float z) {
  const float PI = 3.14159265358979;
  // Gamma has a pole at every non-positive integer, and the reflection
  // formula below cannot see it: sin(PI * z) is not exactly 0 there in
  // floating point, so Gamma(-2.0) came back as a large finite number. The
  // interpreter answers the undirected infinity at a pole; its float
  // projection is Infinity (pole-encoding ruling 2026-08-28 \u2014 the magnitude
  // survives, the missing direction does not). The lower bound keeps
  // -Infinity out of the guard: it satisfies z == floor(z) but is not a
  // pole, and Gamma(-Infinity) is NaN in the interpreter's numeric lane.
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) return _gpu_inf();
  // Gamma(+Infinity) is +Infinity; the Lanczos sum below gives NaN for it.
  if (z > 3.4028234663852886e38) return z;
  float w = z;
  if (z < 0.5) w = 1.0 - z;
  w -= 1.0;
  float x = 0.99999999999980993;
  x += 676.5203681218851 / (w + 1.0);
  x += -1259.1392167224028 / (w + 2.0);
  x += 771.32342877765313 / (w + 3.0);
  x += -176.61502916214059 / (w + 4.0);
  x += 12.507343278686905 / (w + 5.0);
  x += -0.13857109526572012 / (w + 6.0);
  x += 9.9843695780195716e-6 / (w + 7.0);
  x += 1.5056327351493116e-7 / (w + 8.0);
  float t = w + 7.5;
  float g = sqrt(2.0 * PI) * pow(t, w + 0.5) * exp(-t) * x;
  if (z < 0.5) return PI / (sin(PI * z) * g);
  return g;
}

float _gpu_gammaln(float z) {
  const float PI = 3.14159265358979;
  // ln|Gamma(z)|, as the interpreter answers on the real axis: +Infinity at
  // a pole (a non-positive integer), and the reflection formula
  // ln(PI) - ln|sin(PI z)| - lnGamma(1 - z) for z < 0. |sin(PI z)| is
  // sin(PI fract(z)); the product PI z loses its fraction for a large |z|.
  if (z <= 0.0 && z == floor(z) && z >= -3.4028234663852886e38) return _gpu_inf();
  if (z < 0.0) {
    float w = 1.0 - z;
    float w3 = w * w * w;
    float lw = w * log(w) - w - 0.5 * log(w)
      + 0.5 * log(2.0 * PI)
      + 1.0 / (12.0 * w)
      - 1.0 / (360.0 * w3)
      + 1.0 / (1260.0 * w3 * w * w);
    return log(PI) - log(sin(PI * (z - floor(z)))) - lw;
  }
  float z3 = z * z * z;
  return z * log(z) - z - 0.5 * log(z)
    + 0.5 * log(2.0 * PI)
    + 1.0 / (12.0 * z)
    - 1.0 / (360.0 * z3)
    + 1.0 / (1260.0 * z3 * z * z);
}
`,ys=`
float _gpu_digamma(float x) {
  const float PI = 3.14159265358979;
  // A pole (a non-positive integer) answers the float projection of the
  // interpreter's undirected infinity, +Infinity, as _gpu_gamma does. The
  // lower bound keeps -inf out: it satisfies x == floor(x), and the
  // interpreter answers NaN there.
  if (x <= 0.0 && x == floor(x))
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  float result = 0.0;
  float z = x;
  if (x < 0.0) {
    // cot(PI x) = cot(PI r) with r = x - round(x), which is exact: the
    // product PI x keeps only an absolute accuracy next to an integer.
    float r = x - floor(x + 0.5);
    result = -PI / tan(PI * r);
    z = 1.0 - x;
  }
  for (int k = 0; k < 6; k++) {
    if (z >= 6.0) break;
    result -= 1.0 / z;
    z += 1.0;
  }
  float z2 = 1.0 / (z * z);
  return result + (log(z) - 0.5 / z -
    z2 * (1.0 / 12.0 - z2 * (1.0 / 120.0 - z2 * (1.0 / 252.0 - z2 / 240.0))));
}

float _gpu_trigamma(float x) {
  const float PI = 3.14159265358979;
  if (x <= 0.0 && x == floor(x)) // a pole, and -inf: see _gpu_digamma
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  float result = 0.0;
  float sgn = 1.0;
  float z = x;
  if (x < 0.0) {
    float sr = sin(PI * (x - floor(x + 0.5)));
    result = PI * PI / (sr * sr);
    sgn = -1.0;
    z = 1.0 - x;
  }
  float t = 0.0;
  for (int k = 0; k < 6; k++) {
    if (z >= 6.0) break;
    t += 1.0 / (z * z);
    z += 1.0;
  }
  float z2 = 1.0 / (z * z);
  t += 1.0 / z + 0.5 * z2 +
    z2 / z * (1.0 / 6.0 - z2 * (1.0 / 30.0 - z2 * (1.0 / 42.0 - z2 / 30.0)));
  return result + sgn * t;
}

float _gpu_polygamma(float n, float x) {
  if (n == 0.0) return _gpu_digamma(x);
  if (n == 1.0) return _gpu_trigamma(x);
  if (n != floor(n) || n < 0.0 || n > 24.0) return _gpu_nan();
  if (x <= 0.0 && x == floor(x)) // a pole, and -inf: see _gpu_digamma
    return x >= -3.4028234663852886e38 ? _gpu_inf() : _gpu_nan();
  if (x < -4096.0) return _gpu_nan(); // one term per unit of |x|
  if (x > 3.4e38) return 0.0; // +inf
  float fact = 1.0;
  for (int j = 2; j <= 24; j++) {
    if (float(j) > n) break;
    fact *= float(j);
  }
  float lf = log(fact);
  float n1 = n + 1.0;
  // With an odd power n + 1, a term at a negative z is negative.
  bool oddPower = mod(n1, 2.0) == 1.0;
  float sum = 0.0;
  float mag = 0.0;
  float xmax = 0.0;
  float z = x;
  for (int k = 0; k < 4132; k++) {
    if (z >= n + 10.0) break;
    float e = lf - n1 * log(abs(z));
    float t = exp(e);
    sum += (z < 0.0 && oddPower) ? -t : t;
    mag += t;
    xmax = max(xmax, abs(e));
    z += 1.0;
  }
  // The asymptotic series of the double kernel, from a = n!/z^(n+1):
  // (n-1)!/z^n + n!/(2 z^(n+1)) + sum B_2k (2k+n-1)!/((2k)! z^(2k+n)).
  float a = exp(lf - n1 * log(z));
  float tail = a * z / n + 0.5 * a;
  float f = a * n1 / (2.0 * z);
  float b[10] = float[10](
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  float prev = 3.0e38;
  for (int k = 1; k <= 10; k++) {
    float term = b[k - 1] * f;
    if (abs(term) >= prev) break;
    tail += term;
    prev = abs(term);
    float m = float(2 * k);
    f = f * (m + n) * (m + n + 1.0) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  float res = sum + tail;
  // 500 = 3e-5 / 6e-8: the terms of both signs cancel where res is small
  // against their sizes. The ratio, not a product, so that nothing
  // overflows next to f32's largest value.
  if (x < 0.0 && oddPower && !((mag + abs(tail)) / abs(res) <= 500.0 / (6.0 + xmax)))
    return _gpu_nan();
  return mod(n, 2.0) == 0.0 ? -res : res;
}
`,bs=`
float _gpu_zeta_pow(float x, float e) {
  if (x >= 0.0) return pow(x, e);
  if (e != floor(e)) return _gpu_nan();
  float r = pow(-x, e);
  if (mod(abs(e), 2.0) == 1.0) return -r;
  return r;
}

float _gpu_hurwitz_zeta_em(float s, float a, float sm1) {
  int n = int(ceil(15.0 - a));
  if (n < 0) n = 0;
  float sum = 0.0;
  float z = a;
  for (int k = 0; k < n; k++) {
    sum += _gpu_zeta_pow(z, -s);
    z += 1.0;
  }
  // Tail: closed-form integral + half-term (DLMF 25.11.9). The integral
  // term is the pole at s = 1: it uses sm1 = s - 1 as the caller knows it.
  sum += pow(z, -sm1) / sm1 + 0.5 * pow(z, -s);
  // Bernoulli correction series, same ten B_2j as BERNOULLI_2K
  // (special-functions.ts); u carries the term divided by B_2j.
  float b[10] = float[10](
    1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0, 5.0 / 66.0,
    -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0, 43867.0 / 798.0,
    -174611.0 / 330.0
  );
  float u = (s / 2.0) * pow(z, -(s + 1.0));
  float prevAbs = 3.0e38;
  for (int j = 1; j <= 10; j++) {
    float term = u * b[j - 1];
    if (abs(term) >= prevAbs) break;
    sum += term;
    prevAbs = abs(term);
    float m = float(2 * j);
    u = u * (s + m - 1.0) * (s + m) / ((m + 1.0) * (m + 2.0) * z * z);
  }
  return sum;
}

// Gamma(x) / (2 pi)^x for x >= 1, as vec2(value, error estimate in units of
// the f32 rounding error 6e-8). Stirling's series after a shift to y >= 8:
// (y/(2 pi e))^y sqrt(2 pi/y) e^corr, divided by x (x+1) ... (y-1) and
// multiplied by (2 pi)^(y-x). Neither Gamma(x) nor (2 pi)^x is formed (they
// overflow f32 near x = 35 and x = 48), and the largest pow argument is
// about y log2(y/(2 pi e)), 15 at x = 25.5, where the Lanczos _gpu_gamma
// calls pow with an argument of about 126, and 122 at x = 64, the end of
// the range _gpu_riemann_zeta uses.
vec2 _gpu_zeta_gamma_2pi(float x) {
  const float PI = 3.14159265358979;
  float p = 1.0;
  float y = x;
  for (int k = 0; k < 8; k++) {
    if (y >= 8.0) break;
    p *= y;
    y += 1.0;
  }
  float y2 = y * y;
  float corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * y2)) / y2) / y;
  float base = y / 17.079468445347132; // y / (2 pi e)
  float v = pow(base, y) * sqrt(2.0 * PI / y) * (exp(corr) / p) *
    pow(2.0 * PI, y - x);
  return vec2(v, abs(v) * (12.0 + abs(y * log2(base)) + y));
}

// zeta(s), with sm1 = s - 1 passed by a caller that knows it more exactly
// than s - 1.0 can recover it from a rounded s.
float _gpu_riemann_zeta(float s, float sm1) {
  const float PI = 3.14159265358979;
  if (sm1 == 0.0) return _gpu_inf(); // pole
  if (s == 0.0) return -0.5;
  if (s < 0.0) {
    if (s == floor(s) && mod(s, 2.0) == 0.0) return 0.0; // trivial zero
    // Below s = -63 the f32 error passes 3e-5 in an f32 model whose log2 is
    // 2.5 ulp off, and near s = -64.8 pow(y / (2 pi e), y) overflows.
    if (s < -63.0) return _gpu_nan();
    // sin(PI s/2) = (-1)^n sin(PI (s/2 - n)): s/2 - n is exact, so the
    // sine keeps its relative accuracy next to an even s.
    float hs = s / 2.0;
    float n = floor(hs + 0.5);
    float sinHalfPiS = sin(PI * (hs - n));
    if (mod(n, 2.0) != 0.0) sinHalfPiS = -sinHalfPiS;
    // 1 - s is rounded, but its distance to the pole, -s, is exact.
    float oneMinusS = 1.0 - s;
    // 2^s pi^(s-1) Gamma(1-s) = 2 Gamma(1-s)/(2 pi)^(1-s). From 1 - s = 8
    // on, from Stirling's series: with the Lanczos Gamma, zeta(s) was up to
    // 3.3e-5 off near s = -22 in an f32 model whose log2 is 2.5 ulp off.
    if (oneMinusS >= 8.0)
      return 2.0 * _gpu_zeta_gamma_2pi(oneMinusS).x * sinHalfPiS *
        _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
    return pow(2.0, s) * pow(PI, s - 1.0) * sinHalfPiS *
      _gpu_gamma(oneMinusS) * _gpu_hurwitz_zeta_em(oneMinusS, 1.0, -s);
  }
  return _gpu_hurwitz_zeta_em(s, 1.0, sm1);
}

float _gpu_zeta(float s) {
  return _gpu_riemann_zeta(s, s - 1.0);
}

// zeta(s, 1+h) = sum C(-s,k) h^k zeta(s+k), |h| < 1 \u2014 no cancellation,
// since each zeta(s+k) reflects to Re >= 0. See zetaNearOneComplex. The
// stop tolerance is near the f32 epsilon (1.2e-7), and 100 terms reach it
// for every s >= -24.5. Below, the series answers NaN: with _gpu_zeta
// defined down to s = -63, 46 of 1500 values of zeta(s, a) for s from -63.5
// to -24.5 were more than 3e-5 off.
float _gpu_zeta_near_one(float s, float h) {
  if (s < -24.5) return _gpu_nan();
  float sum = _gpu_zeta(s);
  float c = 1.0;
  float hk = 1.0;
  float largest = abs(sum);
  int small = 0;
  for (int k = 1; k < 100; k++) {
    hk *= h;
    if (hk == 0.0) break;
    // f = 1 - k - s is exact when s is near 1 - k, and s + k - 1 = -f is
    // then the exact distance from s + k to the pole of zeta.
    float f = float(1 - k) - s;
    if (f == 0.0) return sum + c * hk * (-1.0 / float(k));
    c = c * f / float(k);
    float term = c * hk * _gpu_riemann_zeta(s + float(k), -f);
    sum += term;
    float size = abs(term);
    largest = max(largest, size);
    if (size <= 1e-7 * largest) {
      if (++small == 2) break;
    } else small = 0;
  }
  return sum;
}

// 1 - e^(-y) for y >= 0, without the cancellation of 1.0 - exp(-y) at a
// small y (a Taylor polynomial below y = 0.25).
float _gpu_zeta_em1(float y) {
  if (y < 0.25) {
    float r = 1.0 - y / 7.0;
    r = 1.0 - y / 6.0 * r;
    r = 1.0 - y / 5.0 * r;
    r = 1.0 - y / 4.0 * r;
    r = 1.0 - y / 3.0 * r;
    r = 1.0 - y / 2.0 * r;
    return y * r;
  }
  return 1.0 - exp(-y);
}

// zeta(s, b) for 0 < b <= 1 and s < 1 by Hermite's integral (DLMF
// 25.11.29): b^(-s)/2 + b^(1-s)/(s-1) plus
// 2 int_0^inf sin(s atan(t/b)) (b^2 + t^2)^(-s/2) / (e^(2 pi t) - 1) dt.
// The two closed terms are one product, b^(-s) (s - 1 + 2b) / (2 (s - 1)):
// 2b - 1 is exact for b >= 1/4, so the factor s + (2b - 1) has a single
// rounding, relative to itself, where the two terms cancel (at s = 1/2,
// b = 0.3 they are 0.91 and -1.10 and the value is 0.011). The integrand is formed
// in one exp, so that a large -s does not overflow before e^(-2 pi t)
// applies. 8-point Gauss-Legendre panels, b/2 wide from t = 0 and doubling
// up to 1 wide (the integrand varies on the scale b next to t = 0, and has
// poles at t = +-i), until the panel mean is below 1e-9 of the largest one
// past the peak of the envelope at t = -s/(2 pi). Returns vec2(value, error
// estimate in units of the f32 rounding error 6e-8): the rounding of the
// closed product and, for each node, of its exp argument, of the log of
// b^2 + t^2 (times s/2), and of the sine argument s atan(t/b). vec2(0,
// 3e38) when 40 panels do not reach the stopping test (b >= 2^-10 takes
// at most 17 on s from -3 to 1).
vec2 _gpu_zeta_hermite(float s, float b) {
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  float k = pow(b, -s) / (2.0 * (s - 1.0));
  // max() keeps a fast-math compiler from reassociating the sum into
  // (s + 2b) - 1, which loses s next to s = 0 (6.7% off at s = -1e-6,
  // b = 1/2 on an Apple GPU, where 2b - 1 = 0).
  float c = s + max(2.0 * b - 1.0, -1.0);
  float closed = k * c;
  float err = abs(k) * (abs(c) + (b < 0.25 ? 1.0 : 0.0)) +
    abs(closed) * (4.0 + abs(s * log2(b)));
  float b2 = b * b;
  float tPeak = max(0.0, -s / (2.0 * PI));
  float sum = 0.0;
  float largest = 0.0;
  float x = 0.0;
  bool done = false;
  for (int p = 0; p < 40; p++) {
    float w = x == 0.0 ? 0.5 * b : min(x, 1.0);
    float cc = x + 0.5 * w;
    float r = 0.5 * w;
    float size = 0.0;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float t = cc + (j == 0 ? -r : r) * gx[i];
        float y = 2.0 * PI * t;
        float lr = log(b2 + t * t);
        float ex = -0.5 * s * lr - y - log(_gpu_zeta_em1(y));
        float th = s * atan(t / b);
        float q = r * gw[i] * exp(ex);
        float f = q * sin(th);
        sum += f;
        size += abs(f);
        err += 2.0 * (abs(f) * (6.0 + abs(ex) + 0.5 * abs(s) * (2.0 + abs(lr))) +
          q * abs(th));
      }
    }
    x += w;
    float mean = size / w;
    largest = max(largest, mean);
    if (x > tPeak && x >= 1.0 && mean <= 1e-9 * largest) {
      done = true;
      break;
    }
  }
  if (!done) return vec2(0.0, 3.0e38);
  float v = closed + 2.0 * sum;
  return vec2(v, err + 2.0 * abs(v));
}

// zeta(s, b) for s <= -3 and 0 < b <= 1 by Hurwitz's formula, the Fourier
// series in the base point:
// 2 Gamma(1-s)/(2 pi)^(1-s) sum_k sin(2 pi k b + pi s/2) / k^(1-s). Its
// terms fall like k^(s-1) and do not cancel; 64 of them leave a tail below
// 64^s/(-s) of the prefactor, 1.3e-6 at s = -3. The sine argument is
// reduced exactly: pi (2 frac(k b) + (s/2 mod 2)), minus its nearest
// integer n, with the sign (-1)^n. Returns vec2(value, error estimate in
// units of 6e-8): the pow roundings, the rounding of the argument (about
// 20 k units of each term's size), the tail and the prefactor.
vec2 _gpu_zeta_fourier(float s, float b) {
  const float PI = 3.14159265358979;
  vec2 g = _gpu_zeta_gamma_2pi(1.0 - s);
  float hs = s / 2.0;
  float ps = hs - 2.0 * floor(hs / 2.0);
  float sum = 0.0;
  float err = 0.0;
  for (int k = 1; k <= 64; k++) {
    float fk = float(k);
    float kb = fk * b;
    float ph = 2.0 * (kb - floor(kb)) + ps;
    float n = floor(ph + 0.5);
    float sn = sin(PI * (ph - n));
    if (mod(n, 2.0) != 0.0) sn = -sn;
    float pk = pow(fk, s - 1.0);
    float t = sn * pk;
    sum += t;
    err += abs(t) * (4.0 + abs((s - 1.0) * log2(fk))) + pk * (fk * 20.0);
  }
  float tail = pow(64.0, s) / (-s);
  return vec2(2.0 * g.x * sum,
    2.0 * g.x * (err + tail / 6.0e-8 + 2.0 * abs(sum)) + 2.0 * g.y * abs(sum));
}

// zeta(s, a) for a > 0 and -24.5 <= s < 1 from the base point b = a - m in
// (0, 1]: zeta(s, a) = zeta(s, b) - sum_{j<m} (b + j)^(-s). zeta(s, b) is
// the Fourier series for s <= -3, the Taylor series in b for b < 2^-10
// (zeta(s, b) = b^(-s) + zeta(s, 1 + b), where Hermite's integral would
// need more panels), and Hermite's integral otherwise. NaN when the error
// estimate exceeds 3e-5 of the value (next to a zero of zeta(s, a)).
float _gpu_zeta_shifted(float s, float a) {
  float m = ceil(a) - 1.0;
  float b = a - m;
  vec2 r;
  if (s <= -3.0) r = _gpu_zeta_fourier(s, b);
  else if (b < 0.0009765625) {
    float t = pow(b, -s);
    float zn = _gpu_zeta_near_one(s, b);
    r = vec2(zn + t, 64.0 * abs(zn) + abs(t) * (3.0 + abs(s * log2(b))));
  } else r = _gpu_zeta_hermite(s, b);
  float z = r.x;
  float err = r.y;
  // m <= 123: the caller keeps a below 4 * edge <= 124.
  for (int j = 0; j < 128; j++) {
    if (float(j) >= m) break;
    float br = b + float(j);
    float t = pow(br, -s);
    z -= t;
    err += abs(t) * (3.0 + float(j) + abs(s * log2(br)));
  }
  err += abs(z) * (m + 2.0);
  if (!(6.0e-8 * err <= 3.0e-5 * abs(z))) return _gpu_nan();
  return z;
}

float _gpu_hurwitz_zeta(float s, float a) {
  if (s == 1.0) return _gpu_inf(); // pole, every base point a
  if (s == 0.0) return 0.5 - a;
  if (a == 1.0) return _gpu_zeta(s);
  bool aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) return _gpu_inf(); // (a+k) = 0 term diverges
  if (a < 0.0 && s != floor(s)) return _gpu_nan(); // complex value
  if (a < -1.0e6) return _gpu_nan();
  float edge = max(12.0, ceil(abs(s)) + 6.0);
  // Where the Euler-Maclaurin terms cancel: s < 1/2 short of a = 4 * edge,
  // and 1/2 <= s < 1 below a = 1 (the zeros of zeta(s, a) there).
  if (a > 0.0 && s >= -24.5 && s < 1.0 && (s < 0.5 ? a < 4.0 * edge : a < 1.0))
    return _gpu_zeta_shifted(s, a);
  if (s >= 0.0 || a >= 4.0 * edge) return _gpu_hurwitz_zeta_em(s, a, s - 1.0);
  // Shift a to 1+h (|h| <= 3/4) and expand in Taylor series \u2014 see
  // hurwitzZetaComplex's doc comment for why EM alone cancels here.
  float m = floor(a - 0.5);
  float h = a - m - 1.0;
  if (abs(h) > 0.75) return _gpu_hurwitz_zeta_em(s, a, s - 1.0);
  float z = _gpu_zeta_near_one(s, h);
  int steps = int(abs(m));
  for (int j = 0; j < steps; j++) {
    float br = m > 0.0 ? h + 1.0 + float(j) : a + float(j);
    if (br == 0.0) continue;
    float t = _gpu_zeta_pow(br, -s);
    z = m > 0.0 ? z - t : z + t;
  }
  return z;
}

float _gpu_zeta_generalized(float s, float a) {
  if (s == 1.0) return _gpu_inf(); // pole, every base point a
  if (a > 0.0) return _gpu_hurwitz_zeta(s, a);
  if (a == 0.0) return _gpu_zeta(s);
  if (a < -1.0e6) return _gpu_nan();
  int n = int(ceil(-a));
  float sum = 0.0;
  for (int k = 0; k < n; k++) sum += pow(-(a + float(k)), -s);
  float cur = a + float(n);
  if (cur == 0.0) cur = 1.0; // drop the (k + a) = 0 term
  return sum + _gpu_hurwitz_zeta(s, cur);
}
`;var xs=`
vec2 _gpu_lerch_series(float z, float s, float a) {
  int n0 = a < 0.0 ? int(ceil(-a)) : 0;
  float az = abs(z);
  float sum = 0.0;
  float zk = 1.0;
  float prev = 3.0e38;
  // For the error estimate: the terms weighted by the roundings of z^k (k
  // of them), their moduli, and the range of |a + k| (pow(b, -s) is within
  // about 6e-8 (2 + |s log2 b|) relative on a GPU).
  float err = 0.0;
  float sizes = 0.0;
  float bmin = 3.0e38;
  float bmax = 0.0;
  int settled = 0;
  for (int k = 0; k < n0 + 4096; k++) {
    float b = a + float(k);
    float t = (b != 0.0) ? zk * _gpu_zeta_pow(b, -s) : 0.0;
    sum += t;
    float size = abs(t);
    err += size * (2.0 + float(k));
    sizes += size;
    if (b != 0.0) {
      bmin = min(bmin, abs(b));
      bmax = max(bmax, abs(b));
    }
    if (b > 0.0) {
      float rho = max(size / prev, az);
      if (size == 0.0 ||
          (size < prev && rho < 1.0 &&
           size * rho / (1.0 - rho) <= 1e-7 * abs(sum))) {
        settled++;
        if (settled == 3) {
          float lb = max(abs(log2(bmin)), abs(log2(bmax)));
          float bound = 6.0e-8 * (err + sizes * (2.0 + abs(s * lb)));
          if (!(bound <= 3.0e-5 * abs(sum))) return vec2(0.0);
          // A GPU flushes a term below the smallest normal f32 (1.2e-38) to
          // zero. The flushed tail is at most 1.2e-38 / (1 - |z|): decline
          // unless that is below 2^-24 of the sum. (Not rho: after a flushed
          // term, prev can be 0 and rho 0/0.)
          if (abs(sum) * (1.0 - az) < 1.9721523e-31) return vec2(0.0);
          return vec2(sum, 1.0);
        }
      } else {
        settled = 0;
      }
      prev = size;
    }
    zk *= z;
  }
  return vec2(0.0);
}

vec2 _gpu_lerch_euler(float z, float s, float a) {
  int n0 = a <= 0.0 ? int(floor(-a)) + 1 : 0;
  float head = 0.0;
  float zn = 1.0;
  float largest = 0.0;
  for (int k = 0; k < n0; k++) {
    float b = a + float(k);
    float t = (b != 0.0) ? zn * _gpu_zeta_pow(b, -s) : 0.0;
    head += t;
    largest = max(largest, abs(t));
    zn *= z;
  }
  float b0 = a + float(n0);
  float w[65];
  int nterm = 0;
  float sum = 0.0;
  float zPow = 1.0;
  int settled = 0;
  for (int k = 0; k < 64; k++) {
    float cur = zPow * pow(b0 + float(k), -s);
    float inc;
    if (k == 0) {
      nterm = 1;
      w[1] = cur;
      inc = 0.5 * cur;
    } else {
      float tmp = w[1];
      w[1] = cur;
      for (int j = 1; j <= nterm - 1; j++) {
        float dum = w[j + 1];
        w[j + 1] = 0.5 * (w[j] + tmp);
        tmp = dum;
      }
      if (nterm >= 64) return vec2(0.0);
      w[nterm + 1] = 0.5 * (w[nterm] + tmp);
      if (abs(w[nterm + 1]) <= abs(w[nterm])) {
        nterm++;
        inc = 0.5 * w[nterm];
      } else {
        inc = w[nterm + 1];
      }
    }
    sum += inc;
    zPow *= z;
    if (k > 4 && abs(inc) <= 1e-7 * abs(sum)) {
      settled++;
      if (settled == 3) {
        // A GPU flushes a term below the smallest normal f32 (1.2e-38) to
        // zero: decline unless the terms the stopping rule reads, down to
        // 1e-7 of the sum, are normal.
        if (abs(sum) < 1.9721523e-31) return vec2(0.0);
        float tail = zn * sum;
        float res = head + tail;
        if (max(largest, abs(tail)) > 100.0 * abs(res)) return vec2(0.0);
        return vec2(res, 1.0);
      }
    } else {
      settled = 0;
    }
  }
  return vec2(0.0);
}

// 1 - e^(-t) for t >= 0, by its Taylor series below 1/4, where
// 1.0 - exp(-t) would cancel.
float _gpu_lerch_em(float t) {
  if (t < 0.25)
    return t * (1.0 - t / 2.0 * (1.0 - t / 3.0 * (1.0 - t / 4.0 *
      (1.0 - t / 5.0 * (1.0 - t / 6.0 * (1.0 - t / 7.0))))));
  return 1.0 - exp(-t);
}

// ln Gamma(s) for s > 0: shift the argument to x >= 8 (ln Gamma(s) =
// ln Gamma(x) - ln(s (s+1) ... (x-1))), then the Stirling series. Within
// about 1e-6 absolute. _gpu_gamma is not used here: its Lanczos sum
// cancels in f32 near s = 0.
float _gpu_lerch_lgamma(float s) {
  float p = 1.0;
  float x = s;
  for (int k = 0; k < 8; k++) {
    if (x >= 8.0) break;
    p *= x;
    x += 1.0;
  }
  float x2 = x * x;
  float corr = (1.0 / 12.0 - (1.0 / 360.0 - 1.0 / (1260.0 * x2)) / x2) / x;
  return (x - 0.5) * log(x) - x + (0.91893853320467274 + corr) - log(p);
}

// 1 / (1 - z e^(-t)) for t >= 0 and z < 1, without cancellation: for
// 0 < z < 1 the denominator is (1 - z) + z (1 - e^(-t)), two terms >= 0.
float _gpu_lerch_g(float z, float t) {
  if (z < 0.0) return 1.0 / (1.0 - z * exp(-t));
  return 1.0 / ((1.0 - z) + z * _gpu_lerch_em(t));
}

// One step of the polynomials P_m(w) = (1 - w)^(m+1) Phi(w, -m, a), in
// place: P_(m+1)(w) = (1 - w)(a P_m + w P_m') + (m + 1) w P_m, that is
// p'_k = (a + k) p_k + (m + 2 - a - k) p_(k-1), from P_0 = 1. It follows from
// Phi(w, -m-1, a) = (a + w d/dw) Phi(w, -m, a). Updated from the top so
// each entry still reads the previous row's values. c holds
// LERCH_MAX_N + 2 entries.
void _gpu_lerch_pstep(inout float c[18], float a, int m) {
  for (int k = m + 1; k >= 0; k--) {
    float hi = k <= m ? (a + float(k)) * c[k] : 0.0;
    float lo = k >= 1 ? (float(m + 2) - a - float(k)) * c[k - 1] : 0.0;
    c[k] = hi + lo;
  }
}

// Phi(w, -n, a) = v sum_k p_k u^k v^(n-k), v = 1/(1 - w), u = w v, from
// the coefficients of P_n: returns vec2(the sum without its factor v, the
// sum of the moduli of its terms), by Horner in u with the powers of v
// carried along. For w < -1, |u| and |v| are at most 1, so nothing
// overflows. The caller applies the factor v, or folds it into an
// exponent (see _gpu_lerch_integral).
vec2 _gpu_lerch_poly(float c[18], int n, float u, float v) {
  float au = abs(u);
  float av = abs(v);
  float r = c[n];
  float ra = abs(c[n]);
  float vp = v;
  float avp = av;
  for (int k = n - 1; k >= 0; k--) {
    r = r * u + c[k] * vp;
    ra = ra * au + abs(c[k]) * avp;
    vp *= v;
    avp *= av;
  }
  return vec2(r, ra);
}

// Phi(z, -n, a) for an integer 0 <= n <= LERCH_MAX_N: a rational function
// of z, for every real z != 1 and every a (the (k + a) = 0 term is 0^n = 0,
// dropped as the series drops it). It has no branch cut, so it holds for
// z > 1 too. Returns vec2(value, 1), or vec2(0, 0) when the terms cancel so
// far that the error estimate exceeds 3e-5 of the value (next to a zero of
// Phi); the caller then tries its other methods.
vec2 _gpu_lerch_rational(float z, int n, float a) {
  const float EPS = 6.0e-8;
  float c[18];
  for (int i = 0; i < 18; i++) c[i] = 0.0;
  c[0] = 1.0;
  for (int m = 0; m < n; m++) _gpu_lerch_pstep(c, a, m);
  float v = 1.0 / (1.0 - z);
  vec2 q = _gpu_lerch_poly(c, n, z * v, v);
  if (!(EPS * (float(n + 4) * q.y) <= 3.0e-5 * abs(q.x))) return vec2(0.0);
  return vec2(q.x * v, 1.0);
}

// Phi(z,s,a) for real z < 1 (z != 0) and a > 0, from
//   Phi(z,s,a) = 1/Gamma(s) Int_0^inf t^(s-1) e^(-a t) / (1 - z e^(-t)) dt
// for s > 0, whose integrand is positive, so the sum has no cancellation at
// any z. For s <= 0 (not an integer) it integrates by parts n = ceil(-s)
// times first:
//   Phi(z,s,a) = 1/Gamma(s+n) Int_0^inf t^(s+n-1) e^(-a t) R_n(z e^(-t)) dt,
// R_n(w) = Phi(w, -n, a): the n-th derivative in t of
// e^(-a t)/(1 - z e^(-t)) is (-1)^n e^(-a t) R_n(z e^(-t)), and the n signs
// (-1) of the parts cancel it. That integrand is positive for 0 < z < 1
// and changes sign for z < 0, where the error estimate measures the
// cancellation. A negative a (s > 0 is then an integer) is first shifted to
// a + n0 in (0, 1] by Phi(a) = sum_{k<n0} z^k (a+k)^(-s) + z^n0 Phi(a+n0).
// With tau = a t the integral is a^(-(s+n)) times an integral against the
// density tau^(s+n-1) e^(-tau) / Gamma(s+n). Its pieces: [0, e0] in closed
// form from the first two Taylor terms of the integrand's smooth factor,
// R_n(z) and -R_(n+1)(z); [e0, lam] (lam = min(1, 1/a)) in panels of width
// <= 3 in ln t, which resolves the t^(s+n-1) singularity and, for z near 1,
// the pole at t = ln z < 0; then panels in t up to where 1/(1 - z e^(-t))
// has reached 1 (t = ln(-z) + 17 for z < 0) and the density is negligible
// (tau = s + n + 30; for a > 1 and z < 0 the integrand decays like
// e^(-(a-1) t) before that). A linear panel starting at x is at most 2x
// wide (the singularity at t = 0), at most 8/a wide (e^(-a t)), and at most
// max(4/(1 + n/4), 0.6 |x - L|) wide, L = ln|z|: the poles of the integrand
// sit at t = L +- i pi (of order n + 1), so a panel far from the step at L
// may be a fixed fraction of its distance to it, and next to it the panels
// narrow as n grows. So the panel count does not grow with |z|: in
// measurements the whole f32 range (|z| up to 3.4e38) takes at most 22
// panels. Below z = -1 the factor 1/(1 - z e^(-t)) is carried as its log,
// -softplus(L - t), inside the exponent of the density: the factor runs from
// about 1/|z| to 1 and the density e^(-a t) down past e^(-88), so each alone
// can fall under the smallest normal f32, which a GPU flushes to zero (the
// value at z = -3e38 was 3% off), where their product does not. Every panel
// is an 8-point Gauss-Legendre rule, at most 28 panels (224 integrand
// values, each a Horner sum of n + 1 terms); past that it declines.
// Returns vec2(value, 1) or vec2(0, 0) where it cannot vouch for the value:
// the error estimate adds, in units of the f32 rounding error EPS, the
// errors of the shifted terms, of each node (its exp argument, and the
// moduli of the terms of R_n), of the closed-form head, of ln Gamma(s+n)
// and of a^(-(s+n)), and declines above 3e-5 of the value.
vec2 _gpu_lerch_integral(float z, float s, float a) {
  const float EPS = 6.0e-8;
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  int n = s > 0.0 ? 0 : int(ceil(-s));
  float sn = s + float(n);
  int n0 = a < 0.0 ? int(ceil(-a)) : 0;
  float head = 0.0;
  float zk = 1.0;
  float err = 0.0;
  for (int k = 0; k < n0; k++) {
    float bk = a + float(k);
    float t = zk * _gpu_zeta_pow(bk, -s);
    head += t;
    err += abs(t) * (2.0 + float(k) + abs(s * log2(abs(bk))));
    zk *= z;
  }
  a += float(n0);
  float c[18];
  for (int i = 0; i < 18; i++) c[i] = 0.0;
  c[0] = 1.0;
  for (int m = 0; m < n; m++) _gpu_lerch_pstep(c, a, m);
  float lg = _gpu_lerch_lgamma(sn);
  float lam = min(1.0, 1.0 / a);
  float delta = z > 0.0 ? -log(z) : PI;
  float e0 = 1e-3 * min(lam, delta);
  float la = log(a);
  float tau0 = a * e0;
  float L = z < 0.0 ? log(-z) : log(z);
  bool big = z < -1.0;
  // With the factor in the exponent, every node also carries e^S,
  // S = min(a, 1) L, the size of the largest nodes (about |z|^(-min(a,1))),
  // so that the nodes of a value near the smallest normal f32 do not flush
  // to zero one by one; the sum is divided by e^S at the end, inside one
  // exp (at z = -1e35 a value of 6e-37 was 0.4% off without it).
  float S = big ? min(a, 1.0) * L : 0.0;
  float lG0 = 0.0;
  float v0h = 1.0 / (1.0 - z);
  float u0 = z * v0h;
  if (big) {
    lG0 = -(L + log(1.0 + exp(-L)));
    v0h = exp(lG0);
    u0 = -exp(L + lG0);
  }
  vec2 f0 = _gpu_lerch_poly(c, n, u0, v0h);
  float c1[18] = c;
  _gpu_lerch_pstep(c1, a, n);
  vec2 f1 = _gpu_lerch_poly(c1, n + 1, u0, v0h);
  float p0 = big ? exp(sn * log(tau0) - lg + lG0 + S) : exp(sn * log(tau0) - lg) * v0h;
  float d1 = -f1.x / a;
  float sum = p0 * (f0.x / sn + d1 * tau0 / (sn + 1.0));
  // The head's error: the rounding of Phi(z, -n, a) and Phi(z, -n-1, a),
  // bounded by the moduli of their terms, and the exp that gives p0.
  float ferr = abs(p0) * ((f0.y / sn + f1.y / a * tau0 / (sn + 1.0)) * float(n + 5)) +
    abs(sum) * (abs(sn * log(tau0)) + abs(lg) + abs(L));
  float v0 = log(e0);
  float v1 = log(lam);
  float nlog = max(1.0, ceil((v1 - v0) / 3.0));
  float hv = (v1 - v0) / nlog;
  float TG = max(L, 0.0) + 17.0;
  float tw = (sn + 30.0) / a;
  float tEnd = tw;
  if (z < 0.0) tEnd = max(tw, a > 1.0 ? min(TG, (sn + 30.0) / (a - 1.0)) : TG);
  float hW = 8.0 / a;
  float x = lam;
  for (int p = 0; p < 28; p++) {
    bool logPanel = float(p) < nlog;
    if (!logPanel && x >= tEnd) break;
    float w = logPanel ? hv :
      min(min(2.0 * x, hW), max(4.0 / (1.0 + 0.25 * float(n)), 0.6 * abs(x - L)));
    float cc = logPanel ? v0 + (float(p) + 0.5) * hv : x + 0.5 * w;
    float r = 0.5 * w;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float u = cc + (j == 0 ? -r : r) * gx[i];
        float t = logPanel ? exp(u) : u;
        float tau = a * t;
        float e = logPanel ? sn * (u + la) : (sn - 1.0) * log(tau);
        float vn;
        float un;
        float lG = 0.0;
        if (big) {
          float xs = L - t;
          lG = -(max(xs, 0.0) + log(1.0 + exp(-abs(xs))));
          vn = exp(lG);
          un = -exp(xs + lG);
        } else {
          vn = _gpu_lerch_g(z, t);
          un = z * exp(-t) * vn;
        }
        vec2 pv = _gpu_lerch_poly(c, n, un, vn);
        float ex = e - tau - lg;
        float q = r * gw[i] * ((logPanel ? 1.0 : a) * (big ? exp(ex + lG + S) : exp(ex) * vn));
        sum += q * pv.x;
        ferr += q * (abs(pv.x) * ((abs(e) + tau) + (abs(lG) + abs(L))) +
          pv.y * (float(n + 3) + t));
      }
    }
    if (!logPanel) x += w;
  }
  if (x < tEnd) return vec2(0.0); // the panel budget ran out
  float scaled = big ? (sum < 0.0 ? -1.0 : 1.0) * exp(log(abs(sum)) - (S + sn * la))
                     : pow(a, -sn) * sum;
  float tail = zk * scaled;
  float res = head + tail;
  float rel = ferr / abs(sum) + (8.0 + abs(lg)) +
    ((float(n0) + 2.0) + (abs(sn * log2(a)) + S));
  float bound = EPS * (err + abs(tail) * rel);
  if (!(bound <= 3.0e-5 * abs(res))) return vec2(0.0);
  return vec2(res, 1.0);
}

// The three ways _gpu_lerch_hermite computes h = e^x x^(-sig) Gamma(sig, x)
// at a complex x = (x.x, x.y), sig >= 1. Each returns vec4(Re h, Im h,
// err, ok), with err an estimate of the absolute error of h in units of
// the f32 rounding error.
//
// An integer sig = n + 1: Gamma(n+1, x) = n! e^(-x) sum_{k<=n} x^k / k!,
// so h = (1/x) sum_{j<=n} n!/(n-j)! x^(-j), summed from the inside out.
vec4 _gpu_lerch_h_integer(float sig, vec2 x) {
  int n = int(sig) - 1;
  float d = x.x * x.x + x.y * x.y;
  float ir = x.x / d;
  float ii = -x.y / d;
  float ix = sqrt(ir * ir + ii * ii);
  float rr = 1.0;
  float ri = 0.0;
  float ra = 1.0; // the same sum over the moduli
  for (int j = 1; j <= n; j++) {
    float tr = ir * rr - ii * ri;
    float ti = ir * ri + ii * rr;
    rr = 1.0 + float(j) * tr;
    ri = float(j) * ti;
    ra = 1.0 + float(j) * ix * ra;
  }
  return vec4(rr * ir - ri * ii, rr * ii + ri * ir, (float(n) + 3.0) * ra * ix, 1.0);
}

// |x| < sig: h = e^x x^(-sig) Gamma(sig) - sum_k x^k / (sig (sig+1) ... (sig+k)),
// whose terms decrease from the first. (The continued fraction loses
// digits in f32 there: 8% at sig = 12.9, x = -0.01 - 3.14i.)
vec4 _gpu_lerch_h_series(float sig, vec2 x) {
  float tr = 1.0 / sig;
  float ti = 0.0;
  float sr = tr;
  float si = 0.0;
  float sa = tr;
  int k = 1;
  for (k = 1; k < 100; k++) {
    float f = sig + float(k);
    float nr = (tr * x.x - ti * x.y) / f;
    ti = (tr * x.y + ti * x.x) / f;
    tr = nr;
    sr += tr;
    si += ti;
    float ta = abs(tr) + abs(ti);
    sa += ta;
    if (ta < 1e-8 * (abs(sr) + abs(si))) break;
  }
  float er = x.x - sig * log(sqrt(x.x * x.x + x.y * x.y)) + _gpu_lerch_lgamma(sig);
  // arg x. At z = -1, x.x is -0.0, and the two-argument atan of Apple's
  // GPU (ANGLE Metal and WebGPU) then answers the wrong branch, so the
  // imaginary axis is taken explicitly.
  float arg = x.x == 0.0 ? (x.y < 0.0 ? -1.5707963267949 : 1.5707963267949) : atan(x.y, x.x);
  float ei = x.y - sig * arg;
  float m = exp(er);
  return vec4(m * cos(ei) - sr, m * sin(ei) - si,
    m * (24.0 + abs(er) + abs(ei)) + (float(k) + 3.0) * sa, 1.0);
}

// |x| >= sig: Legendre's continued fraction for h, by the modified Lentz
// method, at most 200 steps.
vec4 _gpu_lerch_h_cf(float sig, vec2 x) {
  const float FPMIN = 1e-30;
  float br = x.x - sig + 1.0;
  float bi = x.y;
  float cr = 1e30;
  float ci = 0.0;
  float dd = br * br + bi * bi;
  float dr = br / dd;
  float di = -bi / dd;
  float hr = dr;
  float hi = di;
  for (int i = 1; i < 200; i++) {
    float an = -float(i) * (float(i) - sig);
    br += 2.0;
    dr = an * dr + br;
    di = an * di + bi;
    if (abs(dr) + abs(di) < FPMIN) dr = FPMIN;
    float cc = cr * cr + ci * ci;
    cr = br + an * cr / cc;
    ci = bi - an * ci / cc;
    if (abs(cr) + abs(ci) < FPMIN) cr = FPMIN;
    dd = dr * dr + di * di;
    dr = dr / dd;
    di = -di / dd;
    float er = dr * cr - di * ci;
    float ei = dr * ci + di * cr;
    float nr = hr * er - hi * ei;
    hi = hr * ei + hi * er;
    hr = nr;
    if (abs(er - 1.0) + abs(ei) < 1e-7)
      return vec4(hr, hi, 35.0 * sqrt(hr * hr + hi * hi), 1.0);
  }
  return vec4(0.0);
}

// Phi(z,s,a) for real z != 0, 1 and s <= 0, from the Hermite-type
// representation (valid for a > 0):
//   Phi(z,s,a) = 1/(2 a^s) + a^(1-s) h - 2 Int_0^inf
//     sin(t log z - s arctan(t/a)) / ((a^2+t^2)^(s/2) (e^(2 pi t) - 1)) dt,
// with h = e^x x^(s-1) Gamma(1-s, x) at x = -a log z. (The middle term is
// z^(-a) (-log z)^(s-1) Gamma(1-s, -a log z): e^x = z^(-a) and
// x^(1-s) = a^(1-s) (-log z)^(1-s) for a real a > 0.) For z < 0,
// log z = ln|z| + i pi; the three terms are then complex and their sum is
// real, so only the real parts are summed, and the integrand's real part
// is sin(t ln|z| - s arctan(t/a)) cosh(pi t) / (e^(2 pi t) - 1). First a is
// shifted to b = a + m >= 1, which keeps |Im x| = pi b >= pi and the
// integrand's branch points at t = +-ib clear of the real axis. The
// integral is an 8-point Gauss-Legendre rule on at most 16 panels up to
// where e^(-pi t) (b^2+t^2)^(-s/2) is negligible, each panel at most 1.5
// wide (poles at t = +-i) and at most 4/|ln|z|| wide (the oscillation);
// past 16 panels it declines. Returns vec2(value, 1) or vec2(0, 0) where
// the error estimate (the pow and exp arguments, h's own error, and the
// cancellation between the terms) exceeds 3e-5 of the value.
vec2 _gpu_lerch_hermite(float z, float s, float a) {
  const float EPS = 6.0e-8;
  const float PI = 3.14159265358979;
  const float gx[4] = float[4](0.1834346424956498, 0.5255324099163290,
    0.7966664774136267, 0.9602898564975363);
  const float gw[4] = float[4](0.3626837833783620, 0.3137066458778873,
    0.2223810344533745, 0.1012285362903763);
  if (s < -30.0) return vec2(0.0);
  int m = a < 1.0 ? int(ceil(1.0 - a)) : 0;
  float head = 0.0;
  float zk = 1.0;
  float err = 0.0;
  for (int k = 0; k < m; k++) {
    float bk = a + float(k);
    if (bk != 0.0) {
      float t = zk * _gpu_zeta_pow(bk, -s);
      head += t;
      err += abs(t) * (2.0 + float(k) + abs(s * log2(abs(bk))));
    }
    zk *= z;
  }
  float b = a + float(m);
  float L = log(abs(z));
  float sig = 1.0 - s;
  vec2 x = vec2(-b * L, z < 0.0 ? -b * PI : 0.0);
  vec4 h;
  if (sig == floor(sig)) h = _gpu_lerch_h_integer(sig, x);
  else if (sqrt(x.x * x.x + x.y * x.y) < sig) h = _gpu_lerch_h_series(sig, x);
  else h = _gpu_lerch_h_cf(sig, x);
  if (h.w < 0.5) return vec2(0.0);
  float t1 = 0.5 * pow(b, -s);
  float bs = pow(b, sig);
  float t2 = bs * h.x;
  // |h| up to a factor sqrt(2), without squaring: near z = 1 an integer
  // order gives an h near 1e25, whose square overflows f32.
  float t2abs = bs * (abs(h.x) + abs(h.y));
  float q3 = max(-s, 0.0);
  float t3end = (21.0 + q3 * log(1.0 + (q3 + 7.0) / b)) / PI;
  float n3 = ceil(t3end / min(1.5, 4.0 / max(abs(L), 1e-3)));
  if (n3 > 16.0) return vec2(0.0);
  float h3 = t3end / n3;
  float t3 = 0.0;
  float a3 = 0.0;
  float b2 = b * b;
  for (int p = 0; p < 16; p++) {
    if (float(p) >= n3) break;
    float c = (float(p) + 0.5) * h3;
    float r = 0.5 * h3;
    for (int i = 0; i < 4; i++) {
      for (int j = 0; j < 2; j++) {
        float t = c + (j == 0 ? -r : r) * gx[i];
        float y = 2.0 * PI * t;
        float q = exp(-y);
        float omq = _gpu_lerch_em(y);
        float K = z < 0.0 ? exp(-PI * t) * (1.0 + q) / (2.0 * omq) : q / omq;
        float f = sin(t * L - s * atan(t / b)) *
          exp(-0.5 * s * log(b2 + t * t)) * K;
        float wf = r * gw[i] * f;
        t3 += wf;
        a3 += abs(wf) * ((6.0 + 10.0 * t) +
          (abs(s) * (2.0 + 0.5 * log2(b2 + t * t)) + abs(t * L)));
      }
    }
  }
  t3 = -2.0 * t3;
  a3 = 2.0 * a3;
  float phi = t1 + t2 + t3;
  float res = head + zk * phi;
  float e1 = t1 * (2.0 + abs(s * log2(b)));
  float e2 = t2abs * (2.0 + abs(sig * log2(b))) + bs * h.z;
  float ephi = (e1 + e2) + (a3 + 3.0 * (t1 + t2abs + abs(t3)));
  float bound = EPS * (err + abs(zk) * (ephi + (float(m) + 2.0) * abs(phi)) + abs(res));
  // An infinite res passes the test above (inf <= inf) although it is a
  // term past the f32 range, not the value: Phi(-0.5, -30, 10) = 8.0e28
  // was -inf. The other methods then answer, or the call is NaN.
  if (!(bound <= 3.0e-5 * abs(res)) || !(abs(res) < 3.4e38)) return vec2(0.0);
  return vec2(res, 1.0);
}

// Phi(z,s,a) for s <= 0: the integral after n integrations by parts (a
// non-integer s >= -LERCH_MAX_N with a > 0), and where it declines the
// Hermite form.
vec2 _gpu_lerch_negative(float z, float s, float a) {
  if (s != floor(s) && a > 0.0 && s >= -16.0) {
    vec2 r = _gpu_lerch_integral(z, s, a);
    if (r.y > 0.5) return r;
  }
  return _gpu_lerch_hermite(z, s, a);
}

// Phi(z,s,a) as vec2(value, 1), or vec2(0, 0) where the value is complex
// or no method can vouch for it. The cases, in order: z = 1 is the Hurwitz
// zeta; z = 0 keeps only the k = 0 term; s = 0 is 1/(1 - z); a
// non-positive integer s >= -LERCH_MAX_N is the rational function of
// _gpu_lerch_rational, for every z, where it does not decline; a
// non-positive integer a with s > 0 is the pole (+inf); a < 0 with a
// non-integer s is complex; z > 1 is on the branch cut unless s is a
// non-positive integer, where Phi has no cut (the Hermite form). Past
// z = -1 and at z = -1: the positive integral for s > 0, and for s <= 0
// _gpu_lerch_negative. Inside the unit interval: the Euler transform
// (z < 0, s > 0) or the direct series, and where those decline the
// integral (s > 0) or _gpu_lerch_negative (s <= 0).
vec2 _gpu_lerch_core(float z, float s, float a) {
  if (z == 1.0) return vec2(_gpu_hurwitz_zeta(s, a), 1.0);
  if (z == 0.0) return vec2(_gpu_zeta_pow(a, -s), 1.0); // only the k = 0 term survives
  if (s == 0.0) return vec2(1.0 / (1.0 - z), 1.0);
  if (s < 0.0 && s == floor(s) && s >= -16.0) {
    vec2 q = _gpu_lerch_rational(z, int(-s), a);
    if (q.y > 0.5) return q;
  }
  bool aNonposInt = a <= 0.0 && a == floor(a);
  if (aNonposInt && s > 0.0) return vec2(_gpu_inf(), 1.0); // (k+a) = 0 diverges, z != 0
  if (a < 0.0 && s != floor(s)) return vec2(0.0); // complex value
  if (a < -1.0e6) return vec2(0.0); // one term per unit of -a
  if (z > 1.0) {
    if (s > 0.0 || s != floor(s)) return vec2(0.0); // on the branch cut
    return _gpu_lerch_hermite(z, s, a);
  }
  if (z < -1.0) return s > 0.0 ? _gpu_lerch_integral(z, s, a) : _gpu_lerch_negative(z, s, a);
  if (z < 0.0 && s > 0.0) {
    vec2 e = _gpu_lerch_euler(z, s, a);
    return e.y > 0.5 ? e : _gpu_lerch_integral(z, s, a);
  }
  if (z == -1.0) return _gpu_lerch_negative(z, s, a); // s < 0: the series diverges
  vec2 r = _gpu_lerch_series(z, s, a);
  if (r.y > 0.5) return r;
  return s > 0.0 ? _gpu_lerch_integral(z, s, a) : _gpu_lerch_negative(z, s, a);
}

// Phi(z, s, a) for z < 0, -30 <= s <= -3 and |a| < 100, from the Fourier
// modes of the base point b = a moved into (0, 1] (the form of
// lerchModesComplex, numerics/lerch-phi.ts, for a real z < 0):
//   Phi(z, s, b) = 2 Gamma(1-s) e^(-b L) sum_{m = 1, 3, 5, ...}
//     (L^2 + pi^2 m^2)^((s-1)/2) cos(pi (b m + (s-1) (1/2 + atan(L/(pi m))/pi))),
// L = ln|z|: the modes n and 1 - n of the sum over all integers n, paired.
// The terms fall like m^(s-1) and do not cancel the way the Hermite form's
// terms do below z = -1. The sum stops when the bound m (pi m)^(s-1)/(2|s|)
// on the modes left out, taken against the first one, is below 1e-9, and
// after 128 modes at most (ln|z| near 7 at s = -4). The phase is kept in
// units of pi and reduced to [-1/2, 1/2] before the cosine; b m and
// (s-1)/2 are reduced modulo 2 exactly. The modes are summed relative to
// the first one, and the factor 2 Gamma(1-s) e^(-bL) (L^2 + pi^2)^((s-1)/2)
// is one exp. a <= 0 adds the terms z^j (a+j)^(-s) before b; a > 1 uses
// Phi(z,s,a) = z^(-m) (Phi(z,s,b) - sum_{j<m} z^j (b+j)^(-s)). With c = 1
// (only with a = 1) the value is z Phi(z, s, 1) = Li_s(z): the factor
// z = -e^L goes into the exponent of the scale, so that Li_s(z) does not
// pass through Phi, which falls below the smallest normal f32 (1.18e-38)
// before Li_s(z) does. Returns vec2(value, 1), or vec2(0, 0) when the error
// estimate (the roundings of the exp and log arguments and of the phase,
// the modes left out, ln Gamma and the shift, in units of 6e-8) exceeds
// 3e-5 of the value, when the value is not a finite normal f32, or when
// z^(-m), the shifted sum or z^m is not: a GPU flushes a value below
// 1.18e-38 to 0, and a value past 3.4e38 is inf. The test is
// rerr <= 500 |res| (500 = 3e-5 / 6e-8): EPS rerr and 3e-5 |res| themselves
// fall below 1.18e-38 when |res| is below about 4e-34.
vec2 _gpu_lerch_modes(float z, float s, float a, float c) {
  const float EPS = 6.0e-8;
  const float FLUSH = 2.0e-31; // 1.18e-38 / EPS
  const float PI = 3.14159265358979;
  if (s < -30.0 || abs(a) >= 100.0) return vec2(0.0);
  float b = a;
  float pre = 0.0;
  float post = 0.0;
  if (a <= 0.0) {
    pre = floor(-a) + 1.0;
    b = a + pre;
  } else if (a > 1.0) {
    post = ceil(a) - 1.0;
    b = a - post;
  }
  float head = 0.0;
  float herr = 0.0;
  float zk = 1.0;
  for (int j = 0; j < 128; j++) {
    if (float(j) >= pre) break;
    float bj = a + float(j);
    if (bj != 0.0) {
      float t = zk * _gpu_zeta_pow(bj, -s);
      head += t;
      herr += abs(t) * (3.0 + float(j) + abs(s * log2(abs(bj))));
    }
    zk *= z;
  }
  float L = log(-z);
  float sm1 = s - 1.0;
  float hs = 0.5 * sm1;
  float ps = hs - 2.0 * floor(0.5 * hs); // (s-1)/2 modulo 2
  float L2 = L * L;
  float lr1 = log(L2 + PI * PI);
  float sum = 0.0;
  float err = 0.0;
  float tail = 0.0;
  for (int n = 1; n <= 128; n++) {
    float m = float(2 * n - 1);
    float x = PI * m;
    float lr = log(L2 + x * x);
    float at = atan(L / x) / PI;
    float bm = b * m;
    float P = (bm - 2.0 * floor(0.5 * bm)) + ps + sm1 * at;
    float k = floor(P + 0.5);
    float cs = cos(PI * (P - k));
    if (mod(k, 2.0) != 0.0) cs = -cs;
    float ex = hs * (lr - lr1);
    float mag = exp(ex);
    float t = mag * cs;
    sum += t;
    err += abs(t) * (4.0 + abs(ex)) +
      mag * (abs(hs) * (abs(lr) + abs(lr1)) + PI * (abs(P) + abs(sm1) * abs(at) + b * m));
    tail = mag * m / (-2.0 * s);
    if (tail <= 1e-9) break;
  }
  float lg = _gpu_lerch_lgamma(1.0 - s);
  float scale = 2.0 * exp(lg + hs * lr1 - (b - c) * L);
  float phib = scale * sum;
  if (!(scale < 3.4e38 && abs(phib) < 3.4e38)) return vec2(0.0);
  float eb = scale * (err + tail / EPS + 4.0 * abs(sum)) +
    abs(phib) * (abs(lg) + abs(hs * lr1) + abs((b - c) * L) + 12.0);
  // A GPU flushes a scale or Phi(z, s, b) below 1.18e-38 to 0: count the
  // loss (FLUSH = 1.18e-38 in units of EPS) rather than decline, since
  // next to the terms that a > 1 subtracts it can be negligible.
  if (scale < 1.18e-38 || abs(phib) < 1.18e-38) eb += FLUSH * (1.0 + abs(sum));
  if (c > 0.5) phib = -phib; // z = -e^L
  float res;
  float rerr;
  if (post > 0.0) {
    float acc = phib;
    float aerr = eb;
    float zj = 1.0;
    for (int j = 0; j < 128; j++) {
      if (float(j) >= post) break;
      float bj = b + float(j);
      float t = zj * pow(bj, -s);
      acc -= t;
      aerr += abs(t) * (3.0 + float(j) + abs(s * log2(bj)));
      zj *= z;
    }
    float zinv = pow(-z, -post);
    if (!(zinv >= 1.18e-38 && zinv < 3.4e38 && abs(acc) >= 1.18e-38 && abs(acc) < 3.4e38))
      return vec2(0.0);
    float sg = mod(post, 2.0) == 0.0 ? 1.0 : -1.0;
    res = sg * zinv * acc;
    rerr = zinv * (aerr + abs(acc) * (post + 2.0)) + abs(res) * abs(post * log2(-z));
  } else {
    if (!(abs(zk) >= 1.18e-38 && abs(zk) < 3.4e38)) return vec2(0.0);
    res = head + zk * phib;
    rerr = herr + abs(zk) * (eb + abs(phib) * (pre + 2.0));
  }
  // 500.0 * abs(res) is +inf for abs(res) > 6.8e35, and an error estimate
  // that overflowed to +inf passed the test inf <= inf: an infinite
  // estimate must decline.
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(rerr < 3.4e38 && rerr <= 500.0 * abs(res)))
    return vec2(0.0);
  return vec2(res, 1.0);
}

// Where every method of _gpu_lerch_core declines, z < 0 with s <= -3 tries
// the Fourier modes last, so that the values the other methods answer do
// not change.
float _gpu_lerch_phi(float z, float s, float a) {
  vec2 r = _gpu_lerch_core(z, s, a);
  if (r.y > 0.5) return r.x;
  if (z < 0.0 && s <= -3.0 && !(a < 0.0 && s != floor(s))) {
    r = _gpu_lerch_modes(z, s, a, 0.0);
    if (r.y > 0.5) return r.x;
  }
  return _gpu_nan();
}

// Li_s(z) for z < -1 and a real s < 0 that is not an integer, by
// Jonquiere's inversion formula (DLMF 25.12.13 with the Hurwitz zeta form):
//   Li_s(z) = Re[(2 pi)^s e^(i pi s/2) / Gamma(s) zeta(1 - s, A)]
//             - cos(pi s) Li_s(1/z),   A = 1/2 - i ln(-z) / (2 pi).
// zeta(1 - s, A) (1 - s > 1) is summed by Euler-Maclaurin: 12 terms, the
// tail integral, the half term and up to 8 Bernoulli corrections, in
// complex f32. 1/Gamma(s) = sin(pi s) Gamma(1 - s) / pi, with sin(pi s)
// taken from the distance of s to its nearest integer. Returns
// vec2(value, 1), or vec2(0, 0) when Li_s(1/z) declines, when the value is
// not a finite normal f32, or when the error estimate exceeds 3e-5 of the
// value. The estimate counts, for each value that a GPU can flush to 0
// (below 1.18e-38), the loss of 1.18e-38 (FLUSH, in units of EPS): the
// terms of zeta(1 - s, A), of which |A|^(s-1) falls below 1.18e-38 near
// z = -1e38 when s is near -30, and the terms of Li_s(1/z).
vec2 _gpu_poly_log_inversion(float s, float z) {
  const float EPS = 6.0e-8;
  const float FLUSH = 2.0e-31; // 1.18e-38 / EPS
  const float PI = 3.14159265358979;
  const float B[8] = float[8](1.0 / 6.0, -1.0 / 30.0, 1.0 / 42.0, -1.0 / 30.0,
    5.0 / 66.0, -691.0 / 2730.0, 7.0 / 6.0, -3617.0 / 510.0);
  float ai = -log(-z) / (2.0 * PI);
  float sig = 1.0 - s;
  float zr = 0.0;
  float zi = 0.0;
  float zerr = 0.0;
  for (int k = 0; k < 12; k++) {
    float wr = 0.5 + float(k);
    float lnw = 0.5 * log(wr * wr + ai * ai);
    float ph = -sig * atan(ai, wr);
    float m = exp(-sig * lnw);
    zr += m * cos(ph);
    zi += m * sin(ph);
    zerr += m * (4.0 + abs(sig * lnw) + abs(ph));
  }
  float wr = 12.5;
  float lnw = 0.5 * log(wr * wr + ai * ai);
  float th = atan(ai, wr);
  // w^(1 - sig) / (sig - 1), with 1 - sig = s taken from s itself: near
  // s = 0, (1 - s) - 1 would keep only a few digits of s.
  float m1 = exp(s * lnw) / -s;
  float p1 = s * th;
  zr += m1 * cos(p1);
  zi += m1 * sin(p1);
  zerr += abs(m1) * (4.0 + abs(s * lnw) + abs(p1));
  // w^(-sig) / 2
  float m0 = exp(-sig * lnw);
  float p0 = -sig * th;
  zr += 0.5 * m0 * cos(p0);
  zi += 0.5 * m0 * sin(p0);
  zerr += 0.5 * m0 * (4.0 + abs(sig * lnw) + abs(p0));
  // Bernoulli terms B_2j (sig)_(2j-1) / (2j)! w^(-sig-2j+1): u starts at
  // (sig/2) w^(-sig-1) and gains (sig+2j-1)(sig+2j) / ((2j+1)(2j+2) w^2).
  float mu1 = exp((-sig - 1.0) * lnw);
  float pu1 = (-sig - 1.0) * th;
  float ur = sig / 2.0 * mu1 * cos(pu1);
  float ui = sig / 2.0 * mu1 * sin(pu1);
  float w2r = wr * wr - ai * ai;
  float w2i = 2.0 * wr * ai;
  float w2d = w2r * w2r + w2i * w2i;
  float iw2r = w2r / w2d;
  float iw2i = -w2i / w2d;
  float prev = 3.0e38;
  for (int j = 1; j <= 8; j++) {
    float tr = ur * B[j - 1];
    float ti = ui * B[j - 1];
    float ta = abs(tr) + abs(ti);
    if (ta >= prev) break;
    zr += tr;
    zi += ti;
    zerr += ta * (10.0 + abs(sig * lnw));
    prev = ta;
    float mm = float(2 * j);
    float c = (sig + mm - 1.0) * (sig + mm) / ((mm + 1.0) * (mm + 2.0));
    float nr = c * (ur * iw2r - ui * iw2i);
    ui = c * (ur * iw2i + ui * iw2r);
    ur = nr;
  }
  zerr += 44.0 * FLUSH; // at most 22 terms in each of zr and zi
  float n = floor(s + 0.5);
  float d = s - n;
  float sgn = mod(n, 2.0) == 0.0 ? 1.0 : -1.0;
  float lg1 = _gpu_lerch_lgamma(sig);
  float fm = sgn * sin(PI * d) * exp(s * log(2.0 * PI) + lg1) / PI;
  float fre = fm * cos(0.5 * PI * s);
  float fim = fm * sin(0.5 * PI * s);
  float first = fre * zr - fim * zi;
  float firstErr = abs(fm) * zerr +
    abs(fm) * sqrt(zr * zr + zi * zi) * (30.0 + abs(lg1) + abs(s * 2.7));
  // Li_s(1/z): for |1/z| <= 1/2 its own series sum_k (1/z)^k k^(-s), with
  // an error estimate, stopped when the tail after the term t is below
  // t rho/(1-rho) <= 1e-8 of the sum, rho = |1/z| ((k+1)/k)^(-s): the ratio
  // of the next term to t, which bounds every later ratio because it
  // decreases with k for s < 0. (The ratio |1/z| alone does not bound it:
  // the second term is 2^(-s) |1/z| times the first, 0.6 of it at
  // z = -8.7e8, s = -29, where the sum stopped after one term and the value
  // was 9.6 times too large.) Closer to the rim _gpu_lerch_negative (the
  // integral, then the Hermite form) at 1/z.
  float iz = 1.0 / z;
  float li = 0.0;
  float lierr = 0.0;
  if (iz >= -0.5) {
    float wk = 1.0;
    float prev = 3.0e38;
    bool done = false;
    for (int k = 1; k < 200; k++) {
      wk *= iz;
      float t = wk * pow(float(k), -s);
      li += t;
      float size = abs(t);
      lierr += size * (2.0 + float(k) + abs(s * log2(float(k)))) + FLUSH;
      float rho = -iz * pow(float(k + 1) / float(k), -s);
      if (size < prev && rho < 1.0 && size * rho / (1.0 - rho) <= 1e-8 * abs(li)) {
        done = true;
        break;
      }
      prev = size;
    }
    if (!done) return vec2(0.0);
  } else {
    vec2 inner = _gpu_lerch_negative(iz, s, 1.0);
    if (inner.y < 0.5) return vec2(0.0);
    li = iz * inner.x;
    lierr = 500.0 * abs(li); // the inner value is within 3e-5 = 500 EPS
  }
  float res = first - sgn * cos(PI * d) * li;
  // In units of EPS; the test is bound <= (3e-5 / EPS) |res|, since
  // EPS bound and 3e-5 |res| fall below 1.18e-38 for a small |res|.
  float bound = ((firstErr + 4.0 * abs(first)) + (lierr + 2.0 * abs(li))) + 4.0 * FLUSH;
  // An estimate that overflowed to +inf declines (500.0 * abs(res) is +inf
  // for abs(res) > 6.8e35, and inf <= inf passes).
  if (!(abs(res) >= 1.18e-38 && abs(res) < 3.4e38) ||
      !(bound < 3.4e38 && bound <= 500.0 * abs(res)))
    return vec2(0.0);
  return vec2(res, 1.0);
}

// PolyLog(s, z). The integer orders the interpreter answers in closed form
// come first, so the shader agrees with it there: z = 0 is 0; the orders 1,
// 0 and -1 are -ln(1 - z), z/(1 - z) and z/(1 - z)^2, with a pole (+inf)
// at z = 1; an order -n, 2 <= n <= 12, is the Eulerian closed form
// z * sum_k A(n,k) z^k / (1 - z)^(n+1), which for |z| > 1 is summed in
// u = z/(1 - z) and v = 1/(1 - z) (|u|, |v| <= 1 for z < -1) so that it does
// not overflow. Every other order uses Li_s(z) = z * Phi(z, s, 1), and where
// that declines below z = -1 with a negative non-integer order, Jonquiere's
// inversion formula (_gpu_poly_log_inversion). NaN on the cut z > 1 (except
// the orders above) and where both decline.
float _gpu_poly_log(float s, float z) {
  if (z == 0.0) return 0.0;
  if (s == 1.0) {
    if (z == 1.0) return _gpu_inf();
    return z < 1.0 ? -log(1.0 - z) : _gpu_nan();
  }
  if (s == 0.0) {
    if (z == 1.0) return _gpu_inf();
    return z / (1.0 - z);
  }
  if (s == -1.0) {
    if (z == 1.0) return _gpu_inf();
    return z / ((1.0 - z) * (1.0 - z));
  }
  if (s <= -2.0 && s >= -12.0 && s == floor(s) && z != 1.0) {
    int n = int(-s);
    // Row n of the Eulerian numbers, built in place from row 0 = [1]:
    // A(m,k) = (k+1) A(m-1,k) + (m-k) A(m-1,k-1), updated from the top so
    // each entry still reads the previous row's values.
    float row[13];
    row[0] = 1.0;
    for (int i = 1; i < 13; i++) row[i] = 0.0;
    for (int m = 1; m <= n; m++) {
      for (int k = m - 1; k >= 1; k--)
        row[k] = float(k + 1) * row[k] + float(m - k) * row[k - 1];
    }
    if (abs(z) > 1.0) {
      // sum_k A(n,k) u^(k+1) v^(n-k) = u v sum_k A(n,k) u^k v^(n-1-k)
      float v = 1.0 / (1.0 - z);
      float u = z * v;
      float r = row[n - 1];
      float vp = v;
      for (int k = n - 2; k >= 0; k--) {
        r = r * u + row[k] * vp;
        vp *= v;
      }
      return u * v * r;
    }
    float p = 0.0;
    for (int k = n - 1; k >= 0; k--) p = p * z + row[k];
    float den = 1.0;
    for (int i = 0; i <= n; i++) den *= 1.0 - z;
    return z * p / den;
  }
  // Below z = -1, Phi(z, s, 1) = Li_s(z)/z falls below the smallest normal
  // f32 before Li_s(z) does, and the 3e-5 test of the methods behind
  // _gpu_lerch_core falls below it (a GPU flushes both sides to 0) when
  // |Phi| < 1.18e-38 / 3e-5 = 3.9e-34: the inversion and the modes (with the
  // factor z in the exponent) answer there instead.
  vec2 r = _gpu_lerch_core(z, s, 1.0);
  if (r.y > 0.5 && (z >= -1.0 || (abs(r.x) >= 3.9e-34 && abs(z * r.x) < 3.4e38)))
    return z * r.x;
  if (z < -1.0 && s < 0.0 && s != floor(s)) {
    vec2 v = _gpu_poly_log_inversion(s, z);
    if (v.y > 0.5) return v.x;
  }
  if (z < 0.0 && s <= -3.0) {
    r = _gpu_lerch_modes(z, s, 1.0, 1.0);
    if (r.y > 0.5) return r.x;
  }
  return _gpu_nan();
}
`,ws=`
float _gpu_erf(float x) {
  float ax = abs(x);
  float t = 1.0 / (1.0 + 0.3275911 * ax);
  float y = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  float result = 1.0 - y * exp(-ax * ax);
  return x < 0.0 ? -result : result;
}

float _gpu_erfinv(float x) {
  float pi = 3.14159265358979;
  float x2 = x * x;
  float x3 = x * x2;
  float x5 = x3 * x2;
  float x7 = x5 * x2;
  float x9 = x7 * x2;
  return sqrt(pi) * 0.5 * (x + (pi / 12.0) * x3 + (7.0 * pi * pi / 480.0) * x5 + (127.0 * pi * pi * pi / 40320.0) * x7 + (4369.0 * pi * pi * pi * pi / 5806080.0) * x9);
}
`,$s=`
float _gpu_heaviside(float x) {
  if ((floatBitsToUint(x) & 0x7FFFFFFFu) > 0x7F800000u) return x;
  if (x < 0.0) return 0.0;
  if (x > 0.0) return 1.0;
  return 0.5;
}
`,vs=`
float _gpu_sinc(float x) {
  if (abs(x) < 1e-10) return 1.0;
  return sin(x) / x;
}
`,Es=`
float _gpu_polevl(float x, float c[12], int n) {
  float ans = c[0];
  for (int i = 1; i < n; i++) ans = ans * x + c[i];
  return ans;
}
`,Cs=`
float _gpu_fresnelC(float x_in) {
  float sgn = x_in < 0.0 ? -1.0 : 1.0;
  float x = abs(x_in);

  if (x < 1.6) {
    float x2 = x * x;
    float t = x2 * x2;
    float cn[6] = float[6](
      -4.98843114573573548651e-8, 9.50428062829859605134e-6,
      -6.45191435683965050962e-4, 1.88843319396703850064e-2,
      -2.05525900955013891793e-1, 9.99999999999999998822e-1
    );
    float cd[7] = float[7](
      3.99982968972495980367e-12, 9.15439215774657478799e-10,
      1.25001862479598821474e-7, 1.22262789024179030997e-5,
      8.68029542941784300606e-4, 4.12142090722199792936e-2, 1.0
    );
    return sgn * x * _gpu_polevl(t, cn, 6) / _gpu_polevl(t, cd, 7);
  }

  if (x < 36.0) {
    float x2 = x * x;
    float t = 3.14159265358979 * x2;
    float u = 1.0 / (t * t);
    float fn[10] = float[10](
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20
    );
    float fd[11] = float[11](
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20
    );
    float gn[11] = float[11](
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22
    );
    float gd[12] = float[12](
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    float f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    float g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    float z = 1.5707963267948966 * x2;
    float c = cos(z);
    float s = sin(z);
    return sgn * (0.5 + (f * s - g * c) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Ss=`
float _gpu_fresnelS(float x_in) {
  float sgn = x_in < 0.0 ? -1.0 : 1.0;
  float x = abs(x_in);

  if (x < 1.6) {
    float x2 = x * x;
    float t = x2 * x2;
    float sn[6] = float[6](
      -2.99181919401019853726e3, 7.08840045257738576863e5,
      -6.29741486205862506537e7, 2.54890880573376359104e9,
      -4.42979518059697779103e10, 3.18016297876567817986e11
    );
    float sd[7] = float[7](
      1.0, 2.81376268889994315696e2, 4.55847810806532581675e4,
      5.1734388877009640073e6, 4.19320245898111231129e8, 2.2441179564534092094e10,
      6.07366389490084914091e11
    );
    return sgn * x * x2 * _gpu_polevl(t, sn, 6) / _gpu_polevl(t, sd, 7);
  }

  if (x < 36.0) {
    float x2 = x * x;
    float t = 3.14159265358979 * x2;
    float u = 1.0 / (t * t);
    float fn[10] = float[10](
      4.21543555043677546506e-1, 1.43407919780758885261e-1,
      1.15220955073585758835e-2, 3.450179397825740279e-4,
      4.63613749287867322088e-6, 3.05568983790257605827e-8,
      1.02304514164907233465e-10, 1.72010743268161828879e-13,
      1.34283276233062758925e-16, 3.76329711269987889006e-20
    );
    float fd[11] = float[11](
      1.0, 7.51586398353378947175e-1,
      1.16888925859191382142e-1, 6.44051526508858611005e-3,
      1.55934409164153020873e-4, 1.8462756734893054587e-6,
      1.12699224763999035261e-8, 3.60140029589371370404e-11,
      5.8875453362157841001e-14, 4.52001434074129701496e-17,
      1.25443237090011264384e-20
    );
    float gn[11] = float[11](
      5.04442073643383265887e-1, 1.97102833525523411709e-1,
      1.87648584092575249293e-2, 6.84079380915393090172e-4,
      1.15138826111884280931e-5, 9.82852443688422223854e-8,
      4.45344415861750144738e-10, 1.08268041139020870318e-12,
      1.37555460633261799868e-15, 8.36354435630677421531e-19,
      1.86958710162783235106e-22
    );
    float gd[12] = float[12](
      1.0, 1.47495759925128324529,
      3.37748989120019970451e-1, 2.53603741420338795122e-2,
      8.14679107184306179049e-4, 1.27545075667729118702e-5,
      1.04314589657571990585e-7, 4.60680728146520428211e-10,
      1.10273215066240270757e-12, 1.38796531259578871258e-15,
      8.39158816283118707363e-19, 1.86958710162783236342e-22
    );
    float f = 1.0 - u * _gpu_polevl(u, fn, 10) / _gpu_polevl(u, fd, 11);
    float g = (1.0 / t) * _gpu_polevl(u, gn, 11) / _gpu_polevl(u, gd, 12);
    float z = 1.5707963267948966 * x2;
    float c = cos(z);
    float s = sin(z);
    return sgn * (0.5 - (f * c + g * s) / (3.14159265358979 * x));
  }

  return sgn * 0.5;
}
`,Rs=`
float _gpu_factorial(int n) {
  float f = 1.0;
  for (int i = 2; i <= n; i++) f *= float(i);
  return f;
}

float _gpu_besselJ_series(int n, float x) {
  float halfX = x / 2.0;
  float negQ = -(x * x) / 4.0;
  float term = 1.0;
  for (int i = 1; i <= n; i++) term /= float(i);
  float s = term;
  for (int k = 1; k <= 60; k++) {
    term *= negQ / (float(k) * float(n + k));
    s += term;
    if (abs(term) < abs(s) * 1e-7) break;
  }
  return s * pow(halfX, float(n));
}

float _gpu_besselJ_asymptotic(int n, float x) {
  float mu = 4.0 * float(n) * float(n);
  float P = 1.0;
  float Q = 0.0;
  float ak = 1.0;
  float e8x = 8.0 * x;
  for (int k = 1; k <= 12; k++) {
    float twokm1 = float(2 * k - 1);
    ak *= mu - twokm1 * twokm1;
    float denom = _gpu_factorial(k) * pow(e8x, float(k));
    float contrib = ak / denom;
    if (k == 1 || k == 3 || k == 5 || k == 7 || k == 9 || k == 11) {
      if (((k - 1) / 2) % 2 == 0) Q += contrib;
      else Q -= contrib;
    } else {
      if ((k / 2) % 2 == 1) P -= contrib;
      else P += contrib;
    }
    if (abs(contrib) < 1e-7) break;
  }
  float chi = x - (float(n) / 2.0 + 0.25) * 3.14159265358979;
  return sqrt(2.0 / (3.14159265358979 * x)) * (P * cos(chi) - Q * sin(chi));
}

float _gpu_besselJ(int n, float x) {
  if (x == 0.0) return n == 0 ? 1.0 : 0.0;
  float sgn = 1.0;
  if (n < 0) {
    n = -n;
    if (n % 2 != 0) sgn = -1.0;
  }
  if (x < 0.0) {
    x = -x;
    if (n % 2 != 0) sgn *= -1.0;
  }
  if (x > 25.0 + float(n * n) / 2.0) return sgn * _gpu_besselJ_asymptotic(n, x);
  if (x < 5.0 + float(n)) return sgn * _gpu_besselJ_series(n, x);
  int M = max(n + 20, int(ceil(x)) + 30);
  if (M > 200) return sgn * _gpu_besselJ_series(n, x);
  float vals[201];
  float jp1 = 0.0;
  float jk = 1.0;
  vals[M] = jk;
  for (int k = M; k >= 1; k--) {
    float jm1 = (2.0 * float(k) / x) * jk - jp1;
    jp1 = jk;
    jk = jm1;
    vals[k - 1] = jk;
  }
  float norm = vals[0];
  for (int k = 2; k <= M; k += 2) norm += 2.0 * vals[k];
  return sgn * vals[n] / norm;
}
`,Ps=`
float _fractal_smooth(vec2 z, vec2 c, int i, int maxIter) {
  vec2 w = z;
  int k = i;
  for (int extra = 0; extra < 16 && dot(w, w) <= 65536.0; extra++) {
    w = vec2(w.x*w.x - w.y*w.y + c.x, 2.0*w.x*w.y + c.y);
    k++;
  }
  if (!(dot(w, w) > 65536.0)) {
    w = z;
    k = i;
  }
  return clamp((float(k) - log2(log2(dot(w, w))) + 4.0) / float(maxIter), 0.0, 1.0);
}

float _fractal_mandelbrot(vec2 c, int maxIter) {
  vec2 z = vec2(0.0, 0.0);
  for (int i = 0; i < maxIter; i++) {
    z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0)
      return _fractal_smooth(z, c, i, maxIter);
  }
  return 1.0;
}

float _fractal_julia(vec2 z, vec2 c, int maxIter) {
  for (int i = 0; i < maxIter; i++) {
    z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
    if (dot(z, z) > 4.0)
      return _fractal_smooth(z, c, i, maxIter);
  }
  return 1.0;
}
`,As=`
float _gpu_gcd(float a, float b) {
  a = abs(a); b = abs(b);
  if (a == 0.0) return b;
  if (b == 0.0) return a;
  if (floor(a) == a && floor(b) == b && a < 16777216.0 && b < 16777216.0) {
    for (int i = 0; i < 64; i++) {
      if (b == 0.0) break;
      float t = mod(a, b);
      a = b;
      b = t;
    }
    return a;
  }
  float mn = min(a, b);
  float tol = 1e-6 * max(a, b);
  for (int i = 0; i < 64; i++) {
    if (b <= tol) break;
    float t = mod(a, b);
    a = b;
    b = t;
  }
  return a > mn ? mn : a;
}

float _gpu_lcm(float a, float b) {
  if (a == 0.0 || b == 0.0) return 0.0;
  return abs(a) / _gpu_gcd(a, b) * abs(b);
}
`,Ts=`
uvec3 _gpu_pcg3d(uvec3 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  v ^= v >> 16u;
  v.x += v.y*v.z; v.y += v.z*v.x; v.z += v.x*v.y;
  return v;
}
float _gpu_rnd_draw(uvec2 seed, inout uint n) {
  uvec3 w = _gpu_pcg3d(uvec3(seed.x, seed.y, n));
  n = n + 1u;
  return float(w.x >> 8u) * (1.0 / 16777216.0);
}
`,ks=`
float _gpu_median_2(float a, float b) {
  return (a + b) * 0.5;
}
float _gpu_median_3(float a, float b, float c) {
  return max(min(a, b), min(max(a, b), c));
}
float _gpu_median_4(float a, float b, float c, float d) {
  float lo = max(min(a, b), min(c, d));
  float hi = min(max(a, b), max(c, d));
  return (lo + hi) * 0.5;
}
float _gpu_median_5(float a, float b, float c, float d, float e) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v0,v3); v3=max(v0,v3); v0=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v4); v4=max(v1,v4); v1=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  return v2;
}
float _gpu_median_6(float a, float b, float c, float d, float e, float f) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v2 + v3) * 0.5;
}
float _gpu_median_7(float a, float b, float c, float d, float e, float f, float g) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f,v6=g;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return v3;
}
float _gpu_median_8(float a, float b, float c, float d, float e, float f, float g, float h) {
  float t; float v0=a,v1=b,v2=c,v3=d,v4=e,v5=f,v6=g,v7=h;
  t=min(v0,v1); v1=max(v0,v1); v0=t;
  t=min(v2,v3); v3=max(v2,v3); v2=t;
  t=min(v4,v5); v5=max(v4,v5); v4=t;
  t=min(v6,v7); v7=max(v6,v7); v6=t;
  t=min(v0,v2); v2=max(v0,v2); v0=t;
  t=min(v1,v3); v3=max(v1,v3); v1=t;
  t=min(v4,v6); v6=max(v4,v6); v4=t;
  t=min(v5,v7); v7=max(v5,v7); v5=t;
  t=min(v0,v4); v4=max(v0,v4); v0=t;
  t=min(v1,v5); v5=max(v1,v5); v1=t;
  t=min(v2,v6); v6=max(v2,v6); v2=t;
  t=min(v3,v7); v7=max(v3,v7); v3=t;
  t=min(v1,v2); v2=max(v1,v2); v1=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  t=min(v5,v6); v6=max(v5,v6); v5=t;
  t=min(v3,v5); v5=max(v3,v5); v3=t;
  t=min(v2,v4); v4=max(v2,v4); v2=t;
  t=min(v3,v4); v4=max(v3,v4); v3=t;
  return (v3 + v4) * 0.5;
}
`,Ip=`
float _gpu_srgb_to_linear(float c) {
  if (c != c) return c;
  float a = abs(c);
  if (a <= 0.04045) return c / 12.92;
  return sign(c) * pow((a + 0.055) / 1.055, 2.4);
}

float _gpu_linear_to_srgb(float c) {
  if (c != c) return c;
  float a = abs(c);
  if (a <= 0.0031308) return 12.92 * c;
  return sign(c) * (1.055 * pow(a, 1.0 / 2.4) - 0.055);
}

vec3 _gpu_srgb_to_oklab(vec3 rgb) {
  float r = _gpu_srgb_to_linear(rgb.x);
  float g = _gpu_srgb_to_linear(rgb.y);
  float b = _gpu_srgb_to_linear(rgb.z);
  float lc = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  float mc = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  float sc = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  if (lc != lc || mc != mc || sc != sc) return vec3(lc + mc + sc);
  float l_ = sign(lc) * pow(abs(lc), 1.0 / 3.0);
  float m_ = sign(mc) * pow(abs(mc), 1.0 / 3.0);
  float s_ = sign(sc) * pow(abs(sc), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  );
}

vec3 _gpu_oklab_to_srgb(vec3 lab) {
  float l_ = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m_ = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s_ = lab.x - 0.0894841775 * lab.y - 1.291485548 * lab.z;
  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;
  float r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  float b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return vec3(_gpu_linear_to_srgb(r), _gpu_linear_to_srgb(g), _gpu_linear_to_srgb(b));
}

vec3 _gpu_oklab_to_oklch(vec3 lab) {
  float C = length(lab.yz);
  float H = atan(lab.z, lab.y) * (180.0 / 3.14159265359);
  if (H < 0.0) H += 360.0;
  return vec3(lab.x, C, H);
}

vec3 _gpu_oklch_to_oklab(vec3 lch) {
  float h_rad = lch.z * (3.14159265359 / 180.0);
  return vec3(lch.x, lch.y * cos(h_rad), lch.y * sin(h_rad));
}

vec3 _gpu_srgb_to_oklch(vec3 rgb) {
  return _gpu_oklab_to_oklch(_gpu_srgb_to_oklab(rgb));
}

vec3 _gpu_oklch_to_srgb(vec3 lch) {
  return _gpu_oklab_to_srgb(_gpu_oklch_to_oklab(lch));
}

bool _gpu_in_srgb_gamut(vec3 rgb) {
  return all(greaterThanEqual(rgb, vec3(-1e-6))) && all(lessThanEqual(rgb, vec3(1.000001)));
}

vec3 _gpu_srgb_to_p3(vec3 rgb) {
  float r = _gpu_srgb_to_linear(rgb.x);
  float g = _gpu_srgb_to_linear(rgb.y);
  float b = _gpu_srgb_to_linear(rgb.z);
  return vec3(
    _gpu_linear_to_srgb(0.8224619687 * r + 0.1775380313 * g),
    _gpu_linear_to_srgb(0.0331941989 * r + 0.9668058011 * g),
    _gpu_linear_to_srgb(0.0170826307 * r + 0.0723974407 * g + 0.9105199286 * b)
  );
}

vec3 _gpu_p3_to_srgb(vec3 p3) {
  float r = _gpu_srgb_to_linear(p3.x);
  float g = _gpu_srgb_to_linear(p3.y);
  float b = _gpu_srgb_to_linear(p3.z);
  return vec3(
    _gpu_linear_to_srgb(1.2249401763 * r - 0.2249401763 * g),
    _gpu_linear_to_srgb(-0.0420569547 * r + 1.0420569547 * g),
    _gpu_linear_to_srgb(-0.0196375546 * r - 0.0786360456 * g + 1.0982736 * b)
  );
}

vec3 _gpu_oklch_to_gamut(vec3 lch, bool p3) {
  vec3 rgb = _gpu_oklch_to_srgb(lch);
  if (p3) return _gpu_srgb_to_p3(rgb);
  return rgb;
}

float _gpu_gamut_delta_e(vec3 c, vec3 lch, bool p3) {
  vec3 a = _gpu_srgb_to_oklab(p3 ? _gpu_p3_to_srgb(c) : c);
  vec3 b = _gpu_oklch_to_oklab(lch);
  float dL = a.x - b.x;
  float da = a.y - b.y;
  float db = a.z - b.z;
  return sqrt(dL * dL + da * da + db * db);
}

vec3 _gpu_gamut_map_oklch_in(vec3 lch, bool p3) {
  float L = lch.x;
  float C = lch.y;
  float H = lch.z;
  if (L != L || C != C || H != H) return vec3(L + C + H);
  if (!(abs(L) <= 3.4028234663852886e38 && abs(C) <= 3.4028234663852886e38 && abs(H) <= 3.4028234663852886e38))
    return vec3(intBitsToFloat(0x7FC00000));
  if (L >= 1.0) return vec3(1.0);
  if (L <= 0.0) return vec3(0.0);
  if (C < 0.0) {
    C = -C;
    H = H + 180.0;
  }
  vec3 origin = _gpu_oklch_to_gamut(vec3(L, C, H), p3);
  vec3 clipped = clamp(origin, 0.0, 1.0);
  if (_gpu_in_srgb_gamut(origin)) return clipped;
  if (_gpu_gamut_delta_e(clipped, vec3(L, C, H), p3) < 0.02) return clipped;
  float lo = 0.0;
  float hi = C;
  bool loInGamut = true;
  for (int i = 0; i < 24; i++) {
    if (hi - lo <= 0.0001) break;
    float chroma = (lo + hi) / 2.0;
    vec3 current = _gpu_oklch_to_gamut(vec3(L, chroma, H), p3);
    if (loInGamut && _gpu_in_srgb_gamut(current)) {
      lo = chroma;
    } else {
      clipped = clamp(current, 0.0, 1.0);
      float e = _gpu_gamut_delta_e(clipped, vec3(L, chroma, H), p3);
      if (e < 0.02) {
        if (0.02 - e < 0.0001) return clipped;
        loInGamut = false;
        lo = chroma;
      } else {
        hi = chroma;
      }
    }
  }
  return clipped;
}

vec3 _gpu_gamut_map_oklch(vec3 lch) {
  return _gpu_gamut_map_oklch_in(lch, false);
}

vec3 _gpu_gamut_map_oklch_p3(vec3 lch) {
  return _gpu_p3_to_srgb(_gpu_gamut_map_oklch_in(lch, true));
}

vec3 _gpu_gamut_map_srgb(vec3 rgb) {
  if (rgb.x != rgb.x || rgb.y != rgb.y || rgb.z != rgb.z)
    return vec3(rgb.x + rgb.y + rgb.z);
  if (_gpu_in_srgb_gamut(rgb)) return clamp(rgb, 0.0, 1.0);
  if (!(abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38))
    return clamp(rgb, 0.0, 1.0);
  return _gpu_gamut_map_oklch(_gpu_srgb_to_oklch(rgb));
}

vec3 _gpu_hsl_to_rgb(vec3 hsl) {
  float h = mod(hsl.x, 360.0);
  if (h != h || hsl.y != hsl.y || hsl.z != hsl.z) return vec3(h + hsl.y + hsl.z);
  float s = clamp(hsl.y, 0.0, 1.0);
  float l = clamp(hsl.z, 0.0, 1.0);
  float c = (1.0 - abs(2.0 * l - 1.0)) * s;
  float h6 = h / 60.0;
  float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  float m = l - c / 2.0;
  return vec3(r + m, g + m, b + m);
}

vec3 _gpu_rgb_to_hsl(vec3 rgb_in) {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z)
    return vec3(rgb_in.x + rgb_in.y + rgb_in.z);
  vec3 rgb = _gpu_gamut_map_srgb(rgb_in);
  float maxc = max(max(rgb.x, rgb.y), rgb.z);
  float minc = min(min(rgb.x, rgb.y), rgb.z);
  float l = (maxc + minc) / 2.0;
  float d = maxc - minc;
  if (d < 1e-6) return vec3(0.0, 0.0, l);
  float s = d / (1.0 - abs(2.0 * l - 1.0));
  float h;
  if (maxc == rgb.x)      h = mod((rgb.y - rgb.z) / d, 6.0);
  else if (maxc == rgb.y) h = (rgb.z - rgb.x) / d + 2.0;
  else                    h = (rgb.x - rgb.y) / d + 4.0;
  h *= 60.0;
  if (h < 0.0) h += 360.0;
  return vec3(h, s, l);
}

vec3 _gpu_hsv_to_rgb(vec3 hsv) {
  float h = mod(hsv.x, 360.0);
  if (h != h || hsv.y != hsv.y || hsv.z != hsv.z) return vec3(h + hsv.y + hsv.z);
  float s = clamp(hsv.y, 0.0, 1.0);
  float v = clamp(hsv.z, 0.0, 1.0);
  float c = v * s;
  float h6 = h / 60.0;
  float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
  float r = 0.0;
  float g = 0.0;
  float b = 0.0;
  if (h6 < 1.0)      { r = c; g = x; b = 0.0; }
  else if (h6 < 2.0) { r = x; g = c; b = 0.0; }
  else if (h6 < 3.0) { r = 0.0; g = c; b = x; }
  else if (h6 < 4.0) { r = 0.0; g = x; b = c; }
  else if (h6 < 5.0) { r = x; g = 0.0; b = c; }
  else               { r = c; g = 0.0; b = x; }
  float m = v - c;
  return vec3(r + m, g + m, b + m);
}

vec3 _gpu_rgb_to_hsv(vec3 rgb_in) {
  if (rgb_in.x != rgb_in.x || rgb_in.y != rgb_in.y || rgb_in.z != rgb_in.z)
    return vec3(rgb_in.x + rgb_in.y + rgb_in.z);
  vec3 rgb = _gpu_gamut_map_srgb(rgb_in);
  float maxc = max(max(rgb.x, rgb.y), rgb.z);
  float minc = min(min(rgb.x, rgb.y), rgb.z);
  float v = maxc;
  float d = maxc - minc;
  if (d < 1e-6) return vec3(0.0, 0.0, v);
  float s = (maxc < 1e-6) ? 0.0 : d / maxc;
  float h;
  if (maxc == rgb.x)      h = mod((rgb.y - rgb.z) / d, 6.0);
  else if (maxc == rgb.y) h = (rgb.z - rgb.x) / d + 2.0;
  else                    h = (rgb.x - rgb.y) / d + 4.0;
  h *= 60.0;
  if (h < 0.0) h += 360.0;
  return vec3(h, s, v);
}

vec3 _gpu_color_mix(vec3 lch1, vec3 lch2, float t) {
  float L = mix(lch1.x, lch2.x, t);
  float C = mix(lch1.y, lch2.y, t);
  bool a1 = lch1.y < 1e-6;
  bool a2 = lch2.y < 1e-6;
  float H;
  if (a1 && a2) {
    H = lch1.z;
  } else if (a1) {
    H = lch2.z;
  } else if (a2) {
    H = lch1.z;
  } else {
    float dh = lch2.z - lch1.z;
    if (dh > 180.0) dh -= 360.0;
    if (dh < -180.0) dh += 360.0;
    H = lch1.z + dh * t;
    if (H < 0.0) H += 360.0;
    if (H >= 360.0) H -= 360.0;
  }
  return vec3(L, C, H);
}

float _gpu_apca_luma(vec3 srgb) {
  if (srgb.x != srgb.x || srgb.y != srgb.y || srgb.z != srgb.z)
    return srgb.x + srgb.y + srgb.z;
  float Y = 0.2126729 * sign(srgb.x) * pow(abs(srgb.x), 2.4)
          + 0.7151522 * sign(srgb.y) * pow(abs(srgb.y), 2.4)
          + 0.0721750 * sign(srgb.z) * pow(abs(srgb.z), 2.4);
  return Y >= 0.022 ? Y : Y + pow(0.022 - Y, 1.414);
}

float _gpu_apca(vec3 lch_bg, vec3 lch_fg) {
  float Ybg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_bg));
  float Yfg = _gpu_apca_luma(_gpu_oklch_to_srgb(lch_fg));
  if (Ybg != Ybg || Yfg != Yfg) return Ybg + Yfg;
  float C = 0.0;
  if (abs(Ybg - Yfg) >= 0.0005) {
    if (Ybg > Yfg) C = (pow(Ybg, 0.56) - pow(Yfg, 0.57)) * 1.14;
    else           C = (pow(Ybg, 0.65) - pow(Yfg, 0.62)) * 1.14;
  }
  if (abs(C) < 0.1) return 0.0;
  return C > 0.0 ? C - 0.027 : C + 0.027;
}
`,bd=`
vec3 _gpu_srgb_roundtrip(vec3 rgb) {
  if (abs(rgb.x) <= 3.4028234663852886e38 && abs(rgb.y) <= 3.4028234663852886e38 && abs(rgb.z) <= 3.4028234663852886e38) return rgb;
  return _gpu_oklch_to_srgb(_gpu_srgb_to_oklch(rgb));
}
`,xd=`
vec3 _gpu_finite_color(vec3 c) {
  if (abs(c.x) <= 3.4028234663852886e38 && abs(c.y) <= 3.4028234663852886e38 && abs(c.z) <= 3.4028234663852886e38) return c;
  return vec3(intBitsToFloat(0x7FC00000));
}
`,Op=Ip+bd+xd,Mp=`
float _gpu_nan() {
  return intBitsToFloat(0x7FC00000);
}
`,Ls=`
float _gpu_inf() {
  return intBitsToFloat(0x7F800000);
}
`,zs=`
float _gpu_powi(float x, float n) {
  if (n == 0.0) return 1.0;
  if (n == 2.0) return x * x;
  if (n == 3.0) return x * x * x;
  if (n == 4.0) { float s = x * x; return s * s; }
  float r = pow(abs(x), n);
  if (x < 0.0 && mod(abs(n), 2.0) == 1.0) return -r;
  return r;
}
`,Up=`
vec2 _gpu_cossinpi(float u) {
  if ((floatBitsToUint(u) & 0x7FFFFFFFu) >= 0x7F800000u) return vec2(intBitsToFloat(0x7FC00000));
  float r = u - 2.0 * floor(u / 2.0 + 0.5);
  float q = floor(2.0 * r + 0.5);
  float t = r - q / 2.0;
  float c = cos(3.141592653589793 * t);
  float s = sin(3.141592653589793 * t);
  float k = q + 4.0 - 4.0 * floor((q + 4.0) / 4.0);
  vec2 v = vec2(s, -c);
  if (k == 0.0) v = vec2(c, s);
  if (k == 1.0) v = vec2(-s, c);
  if (k == 2.0) v = vec2(-c, -s);
  return vec2(v.x == 0.0 ? 0.0 : v.x, v.y == 0.0 ? 0.0 : v.y);
}
float _gpu_sinpi(float u) {
  return _gpu_cossinpi(u).y;
}
float _gpu_cospi(float u) {
  return _gpu_cossinpi(u).x;
}
float _gpu_tanpi(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return _gpu_inf();
  return cs.y == 0.0 ? 0.0 : cs.y / cs.x;
}
vec2 _gpu_ipi_sinh(float u) {
  return vec2(0.0, _gpu_cossinpi(u).y);
}
vec2 _gpu_ipi_cosh(float u) {
  return vec2(_gpu_cossinpi(u).x, 0.0);
}
vec2 _gpu_ipi_tanh(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, cs.y == 0.0 ? 0.0 : cs.y / cs.x);
}
vec2 _gpu_ipi_csch(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, -1.0 / cs.y);
}
vec2 _gpu_ipi_sech(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.x == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(1.0 / cs.x, 0.0);
}
vec2 _gpu_ipi_coth(float u) {
  vec2 cs = _gpu_cossinpi(u);
  if (cs.y == 0.0) return vec2(_gpu_inf(), _gpu_inf());
  return vec2(0.0, cs.x == 0.0 ? 0.0 : -cs.x / cs.y);
}
`,Bp=`
float _gpu_round(float x) {
  float a = abs(x);
  float m = floor(a);
  return sign(x) * (m + step(0.5, a - m));
}
float _gpu_round_tz(float x) {
  float a = abs(x);
  float m = floor(a);
  return sign(x) * (m + (1.0 - step(a - m, 0.5)));
}
float _gpu_round_up(float x) {
  float m = floor(x);
  return m + step(0.5, x - m);
}
float _gpu_round_down(float x) {
  float m = ceil(x);
  return m - step(0.5, m - x);
}
float _gpu_step_quotient(float x, float k) {
  float q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) return sign(x) * 1.17549435e-38;
  float r = round(q);
  return abs(q - r) <= 4.8e-7 * abs(q) ? r : q;
}
float _gpu_half_step_quotient(float x, float k) {
  float q = x / k;
  if (q == 0.0 && x != 0.0 && k < 3.4e38) return sign(x) * 1.17549435e-38;
  float r = round(q * 2.0) * 0.5;
  return abs(q - r) <= 4.8e-7 * abs(q) ? r : q;
}
float _gpu_step_fix(float m, float x, float k) {
  return k != 0.0 && abs(x / k) > 3.4e38 ? x : m;
}
`;var wd=1e4,Dp="_GPU_PASSES_DECLARED",$d=2**30;function jp(e){if(e===void 0)return wd;if(e!==1/0){if(typeof e!="number"||!(e>0))throw new Error('Invalid compilation option "iterationBudget": expected a positive number, or `Infinity` for no cap');return Math.min(Math.floor(e),$d)}}function vd(e,n,t){if(e!==void 0)return e.functions.get(t??n)}function Ed(e){if(e==="bool")return"false";let n="_gpu_nan()";if(e==="float")return n;let t=/^(float|vec[234])\[(\d+)\]$/.exec(e);if(t!==null){let r=t[1]==="float"?n:`${t[1]}(${n})`;return`${e}(${Array(Number(t[2])).fill(r).join(", ")})`}return`${e}(${n})`}function Vp(e){return`Could not compile: the ${e.toUpperCase()} code of the user-defined functions that the expression calls would have more than ${Se.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path when the shader cannot compute it once: the paths go through different branches of an \`If\`, the subexpression reads a \`vars\` source that is not a variable or a field of a variable (\`u.c\`), it is not pure, or the \`cse\` option is false. A call that is written in place of its definition is written in full at each call site.`}function Cd(e){let n={isOverriddenOperator:()=>!1};class t extends Map{get(i){return this.has(i)||this.set(i,Je(i,n)),super.get(i)}}let r=gr._callerLowered;gr._callerLowered=new t;try{return e()}finally{gr._callerLowered=r}}var nr=class{getOperators(){return Fe}_functionsMemo;getFunctions(){let n=this.getLanguageSpecificFunctions();return this._functionsMemo?.languageSpecific!==n&&(this._functionsMemo={languageSpecific:n,merged:Object.assign(Object.create(null),bn,n)}),this._functionsMemo.merged}getConstants(){return Wl}getShapeRules(){return{scalarGenTypeSlots:new Map([["mix",new Set([2])],["refract",new Set([2])]]),mandatoryScalarSlots:new Map([["refract",new Set([2])]]),vectorOnlySlots:new Map([["cross",new Set([0,1])],["dot",new Set([0,1])],["faceForward",new Set([0,1,2])],["normalize",new Set([0])],["reflect",new Set([0,1])],["refract",new Set([0,1])]]),matrixArithmetic:(n,t)=>n==="*"||t&&(n==="+"||n==="-"),matrixNegate:!1}}createTarget(n={}){let t=this.getFunctions(),r=this.getConstants(),o="vec2",i=this.getShapeRules(),s={language:this.languageId,isRealOnlyLowering:du,supportedModes:Kl,loweredSymbolType:mu(),maxInlineElements:yn,gpuShapeRules:i,beginCompilation:lp,hoistScalarInvariants:!0,unrollComprehensions:!0,appliesFunctionLiteralsOnly:!0,assignmentValue:(a,u,l)=>D(ee(a),"color")?ke("Assign",a,c=>c===a?u:f.compileValueOperand(c,l),l):u,cseCanMaterialize:on,cseMaterialize:(a,u,l,c)=>{if(!on(c))return!1;let p=pe(a,c);return p===void 0?!1:(f.hoistStatement(c,`${p} ${u} = ${l};`),!0)},bareStatementBlocks:this.languageId==="glsl",recompileStatement:yu,lazyOperand:(a,u,l)=>Ye(a,u,l),valueBlock:(a,u,l,c,p)=>{if(!f.canHoist(c)||Pn.has(c.hoist))return;let d=p!==void 0&&f.foldValueImpure(p);d&&He("Block",[p],c),xe("Block",p===void 0?void 0:[p],c);let h=pe(a,c);if(h===void 0)return;let g=f.tempVar(c),y=f.joinShaderStatements([...u,`${g} = ${l}`]).split(`
`).map(w=>`  ${w}`).join(`
`);return f.hoistStatement(c,`${h} ${g};`,`{
${y}
}`),d&&Oe([p],c),g},mangleId:a=>Te(a,this.languageId),selection:(a,u,l)=>Fu(a,u,l),broadcastUnary:(a,u,l,c)=>gp(a,u,l,c),checkOperandShapes:(a,u,l)=>Si(a,u,l,i,c=>this.preambleFor(c),t[a]),operators:a=>Fe[a],functions:a=>t[a],constant:a=>a==="ImaginaryUnit"?`${o}(0.0, 1.0)`:r[a],var:a=>{if(a==="ImaginaryUnit")return`${o}(0.0, 1.0)`;if(a in r)return r[a]},string:a=>{throw new Error(`Could not compile the string literal ${JSON.stringify(a)}: it is not supported on the ${this.languageId} target: the shader languages have no text type \u2014 no string, no character, no grapheme-cluster indexing \u2014 so there is no value a quoted literal could lower to.`)},number:a=>ue(a,this.languageId),complex:(a,u)=>`${o}(${ue(a,this.languageId)}, ${ue(u,this.languageId)})`,absence:{numeric:{make:()=>le({language:this.languageId})}},indent:0,ws:a=>a??"",preamble:"",declare:(a,u)=>`${u??"float"} ${a}`,block:a=>{if(a.length===0)return"";let u=a.length-1;if(/^\s*(for|while)\b/.test(a[u]))throw new Error(`Could not compile \`${this.languageId.toUpperCase()}\`: a Loop (or other statement-form construct) cannot be the final statement of a block \u2014 a shader block must evaluate to a typed value.`);return a[u]=`return ${a[u]}`,f.joinShaderStatements(a)},naming:{counter:0,usedNames:new Set},...n};if(s.constantFold!==!1&&s.foldEmittedConstant===void 0){let a=fl(s.varsKeys,s.var);s.foldEmittedConstant=(u,l)=>dl(l,a)}return ap(s),s}createTargetFor(n,t,r={}){let o=this.createTarget(r),i=0;o.checkDefinitionBody=(p,d,h)=>{let g=d.cse,y={...Un(p,{...g?.harvestOptions,admitPureUserFunctions:!0}),share:h&&g?.enabled===!0},w=Kn(p,y);if(h||(i+=w),w>Se||i>Se)throw new Error(Vp(this.languageId))};let s=up(n);if(s.size>0){let p=o.mangleId;o.mangleId=d=>{if(s.has(d))throw new Error(`Could not compile \`${d}\`: the symbol is text-typed, which is not supported on the ${this.languageId} target: the shader languages have no text type \u2014 no string, no character, no grapheme-cluster indexing \u2014 so it would be emitted as a bare identifier and declared as a numeric uniform.`);return p?p(d):d}}let a=o.storage;if(a!==void 0&&a.size>0){let p=o.var,d=o.mangleId,h=this.languageId;o.var=g=>(Yi(g,a,h),p(g)),o.mangleId=g=>(Yi(g,a,h),d?d(g):g)}let{pointOrList:u,unsizedLists:l}=pp(n);if(u.size>0){let p=o.var,d=o.mangleId;o.var=h=>{let g=p(h),y=u.get(h);if(g!==void 0&&y!==void 0&&o.varsKeys?.has(h)===!0)throw new Error(y);return g},o.mangleId=h=>{let g=u.get(h);if(g!==void 0)throw new Error(g);return d?d(h):h}}if(l.size>0){let p=o.var,d=o.mangleId,h=g=>{let y=l.get(g);if(y!==void 0&&o.storage?.has(g)!==!0&&f.localShapeFrameOf(g)===void 0)throw new Error(y)};o.var=g=>{let y=p(g);return y!==void 0&&o.varsKeys?.has(g)===!0&&h(g),y},o.mangleId=g=>(h(g),d?d(g):g)}let c=_n(o);if(c.stage=t,c.hostFrame=n?.engine?._randomFrame!==void 0,r.naming===void 0&&(o.naming=f.newNamingContext(n,[o.preamble])),this.currentUserFunctions=void 0,!("userFunctions"in r)){let p=this.newUserFunctions();p.root=o,o.userFunctions=p,this.currentUserFunctions=p}return o}currentUserFunctions;currentAnnotation;userFunctionDefs(n){let t=this.currentUserFunctions,r=t?.defs;return!t||!r||r.size===0||(f.pruneUnreferencedVariantBases(t,n),r.size===0)?"":[...r.values()].join(`

`)+`
`}newUserFunctions(){let n=this.languageId,t=new Map,r=(i,s,a,u)=>this.declareGPUFunction(i,s,a,u),o=(i,s,a,u,l)=>{if(u.length===0||a.ret!=="float")return;let c=u[0].engine;if(!f.userFunctionParamsAreScalar(c,i))return;let p,d,h=u.map((x,$)=>{if(a.complex[$]||a.colors[$])return;let A=pe(x,l);if(A===a.params[$])return!1;if(a.params[$]!=="float"||A===void 0||!/^vec[234]$/.test(A)||!f.isShaderVectorListArg(x))return;let E=ci(A);if(f.aggregateComponentCount(x)===E&&!(p!==void 0&&p!==E))return p=E,d=A,!0});if(p===void 0||d===void 0||h.some(x=>x===void 0))return;let g=l.userFunctions;if(g===void 0)return;let y=h.map(x=>x?"1":"0").join(""),w=f.registryHelperName(g,`${i}#each${p}_${y}`);if(!g.defs.has(w)){let x=u.map((E,z)=>[`a${z}`,h[z]?d:a.params[z]]),$=["x","y","z","w"].slice(0,p),A=`${d}(${$.map(E=>`${s}(${u.map((z,N)=>h[N]?`a${N}.${E}`:`a${N}`).join(", ")})`).join(", ")})`;g.defs.set(w,r(w,d,x,A))}return`${w}(${u.map(x=>f.compileValueOperand(x,l)).join(", ")})`};return{defs:new Map,compiling:new Set,lowering:{noRecursion:!0,refusesParameterName:i=>Vr(i,n),staticReturnType:!0,define:({id:i,name:s,key:a,params:u,body:l,literal:c,target:p,parameterTypes:d,parameterPositions:h,extraParams:g})=>{let y=vd(this.currentAnnotation,i,a),w=y!==void 0?y.body:ms(l,p,u);Te(s,n);for(let b of u)Te(b,n);let x=g??[];for(let b of x)Te(b.name,n);let $=c.engine,A=_(c)?c.ops.slice(1):[],E=new Map,z=new Map,N=[],M=[],P=y!==void 0&&y.type.kind==="function"&&y.type.parameters.length===u.length?y.type:void 0,G=u.map((b,S)=>{let T=P?.parameters[S].type,L=y?.scope.bindings.get(b),O=T===void 0?void 0:L!==void 0&&"representation"in L?L.representation:Yn(T);if(T!==void 0&&O!==void 0){let Q=T,re=Q.kind==="complex",ye=Q.kind==="color";N.push(ye),M.push(re),E.set(b,re);let Ke=re?2:ye?3:Q.kind==="point"?Q.size:Q.kind==="list"?Q.count??0:0;return z.set(b,Q.kind==="boolean"?f.LOCAL_BOOLEAN:Ke>=2?Ke:f.LOCAL_SCALAR),O}let U=d?.[S]??f.userFunctionParamType($,i,S),V=A[S]?.type?.type,K=U===void 0||U==="unknown"?V:U,de=fi(K);if(N.push(K!==void 0&&D(Y(K),"color")),de===void 0)throw new Error(`Could not compile \`${i}\`: parameter "${b}" has no static ${n.toUpperCase()} type \u2014 only scalars, booleans, colors, complex values and 2\u20134 component vectors have one, and a shader function signature must be fully typed. Declare a narrower signature for "${i}".`);let W=K!==void 0&&ze(K),J=W?2:N[S]?3:ft(K??"unknown")??0;return E.set(b,W),M.push(W),z.set(b,de==="bool"?f.LOCAL_BOOLEAN:J>=2?J:f.LOCAL_SCALAR),de}),k=f.withLocalShapeFrame(E,z,()=>x.map(b=>{let S=pe(b.expr);if(S===void 0)throw new Error(`Could not compile \`${i}\`: the hoisted value \`${b.expr.toString()}\` has no static ${n.toUpperCase()} type, so no variant of "${i}" takes it as a parameter.`);return{shader:S,complex:f.isComplexValued(b.expr)}}),!0);x.forEach((b,S)=>{let{shader:T,complex:L}=k[S],O=L?2:ci(T);E.set(b.name,L),z.set(b.name,T==="bool"?f.LOCAL_BOOLEAN:O>=2?O:f.LOCAL_SCALAR)});let R=Su(i,u,G,w,p,h),{ret:I,code:H}=f.withLocalShapeFrame(E,z,()=>{let b=P!==void 0?Yn(P.result)??pe(w):pe(w),S=b===void 0?ai(w):void 0;if(S!==void 0&&C(S))throw new Error(`Could not compile \`${i}\`: the return value reads "${S.symbol}", which has the type \`${S.type.toString()}\`. That type admits a point and a list of points, so the return value has no static ${n.toUpperCase()} type. Declare "${S.symbol}" as a point (\`${Dr(S.symbol,cn(S.type.type)?.arity)}\`).`);if(b===void 0)throw new Error(`Could not compile \`${i}\`: the return value has no static ${n.toUpperCase()} type \u2014 only scalars, booleans, colors, complex values and 2\u20134 component vectors have one.`);let T={...p,gpuParameterFacts:R,fragmentScope:y?.scope,fragmentBody:y?.body,onReturn:O=>{let U=O===void 0?void 0:pe(O,T);if(U!==b)throw new Error(`Could not compile \`${i}\`: a \`Return\` in this body yields `+(U===void 0?`a value with no static ${n.toUpperCase()} type`:`a "${U}" value`)+`, but "${i}" is declared to return "${b}" (the shape of the body's own final value). ${n.toUpperCase()} has no implicit conversion between them, and a shader function has a single return type. Make every \`Return\` \u2014 and the body's final value \u2014 the same shape.`)}},L=f.withNestedCseHarvest(w,T,u,()=>f.compileFunctionBody(w,T));return f.recordUserFunctionLane(p,i,s,w),{ret:b,code:L}},!0);Qr(i,H,n);let m=[...u,...x.map(b=>b.name)],v=[...G,...k.map(b=>b.shader)];return t.set(s,{names:m,params:v,colors:[...N,...x.map(()=>!1)],complex:[...M,...k.map(b=>b.complex)],ret:I}),r(s,I,m.map((b,S)=>[b,v[S]]),H)},call:({id:i,name:s,args:a,target:u,held:l})=>{let c=t.get(s);if(c===void 0)throw new Error(`Internal: no synthesized signature for "${i}"`);let p=l===void 0?a:[...a,...l];if(p.length!==c.params.length)throw new Error(`Could not compile \`${i}\`: called with ${p.length} argument(s) but declared with ${c.params.length} \u2014 a ${n.toUpperCase()} call must match its declaration exactly (there are no optional or variadic parameters).`);if(l===void 0){let h=o(i,s,c,p,u);if(h!==void 0)return h}let d=p.map((h,g)=>{let y=pe(h,u),w=y===void 0?Ae(h):void 0;if(w!==void 0)throw new Error(`Could not compile \`${i}\`: argument ${g+1} \`${h.toString()}\` is declared "${w.spelling}" by the caller \u2014 a type with no static ${n.toUpperCase()} value shape here (only scalars, booleans and 2\u20134 component vectors have one), so it cannot be matched against parameter "${c.names[g]}" (declared "${c.params[g]}").`);if(y===void 0)throw new Error(`Could not compile \`${i}\`: argument ${g+1} is a collection with no static ${n.toUpperCase()} shape (only 2\u20134 component vectors have one), and a shader has no runtime broadcast dispatch to apply "${i}" element-wise.`);if(c.complex[g]&&y==="float"&&y!==c.params[g])return`${ne()}(${f.compileValueOperand(h,u)}, 0.0)`;if(y!==c.params[g])throw new Error(`Could not compile \`${i}\`: argument ${g+1} \`${h.toString()}\` lowers to "${y}" but parameter "${c.names[g]}" is declared "${c.params[g]}" \u2014 ${n.toUpperCase()} has no implicit conversion between them. Declare a matching signature for "${i}".`);return c.colors[g]?ke(i,h,x=>f.compileValueOperand(x,u),u):f.compileValueOperand(h,u)});return`${s}(${d.join(", ")})`},value:({id:i})=>{throw new Error(`Could not compile \`${i}\`: a user-defined function cannot be used as a VALUE on target '${n}' \u2014 the shader languages have no function values (no higher-order operands, no function pointers). Call it instead.`)}}}}declareGPUFunction(n,t,r,o){let i=`${t} ${n}(${r.map(([s,a])=>`${a} ${s}`).join(", ")})`;if(o.includes(`
`)){let s=o.split(`
`).map(a=>`  ${a}`).join(`
`);return`${i} {
${s}
}`}return`${i} {
  return ${o};
}`}typeDeclaredBody(n,t,r,o,i={}){let s=r.map(l=>({name:l.name,type:Cp(l.type),declared:l.type.trim()})),a=ds(t,{declaredVectors:new Set(s.filter(l=>l.type?.kind==="point").map(l=>l.name))}),u=Jo(n,i.userFunctions===!1?{...a,functionOf:()=>{}}:a,{inputs:s});if(u.refusal!==void 0){let l=Lr(u.refusal);throw new un({...l,message:`Could not compile ${o}: ${l.message}`})}return u}withAnnotation(n,t){let r=this.currentAnnotation;this.currentAnnotation=n;try{return t()}finally{this.currentAnnotation=r}}compileDeclaredFunctionBody(n,t,r){n=Ze(n);let o=t.map(([p,d])=>({name:p,type:d})),i=this.createTargetFor(n,void 0,{constantFold:r?.constantFold}),s=f.namingContext(i);for(let[p]of t)s.usedNames.add(p);let a=pi(i,o);f.beginRootPreprocessing(n,a);let u=Dn(lt(n,a,{scalarNames:new Set,localNames:new Set(o.map(p=>p.name))},dt),a,new Set([...o.map(p=>p.name),...jn(n).written])),l=this.typeDeclaredBody(u,a,o,"`compileFunction()`");Object.assign(a,{fragmentScope:l.scope});let c=this.withAnnotation(l,()=>f.withLocalShapeFrame(new Map,li(o),()=>f.compileFunctionBody(u,a)));return Qr("this function body",c,this.languageId),c}compile(n,t={}){let r=t.storage===void 0?void 0:At(t.storage,[n],this.createTarget(),{vars:t.vars,functions:t.functions});try{return at(n,t.vars,()=>Zo(n,t,o=>this.compileOrThrow(o,t,r)))}catch(o){if(ur(o,n.engine._deadlineFrame),t.fallback!==!0)throw o;let i=o.message;return console.warn(`Compilation fallback for "${n.operator}" (target: ${this.languageId}): ${i}`),f.buildInterpreterFallback(n,i,this.languageId,this.createTarget(),t.vars?new Set(Object.keys(t.vars)):void 0,mr(o,i))}}canCompile(n,t={}){try{return this.preparedAndTypedForCheck(n,t,({prepared:r,annotation:o,handlerCode:i})=>{if(o.refusal!==void 0)return{ok:!1,diagnostic:Lr(o.refusal)};let s=i?Cd(()=>{let l=Ko(r.expr,r.target,!0);return l?.reason==="handler-value"?void 0:l}):Ko(r.expr,r.target,!0);s!==void 0&&nl(r.expr,r.target,s);for(let{sizeCheck:l}of o.functions.values()){if(l===void 0)continue;let c=l.body,p={...Un(c,{...r.cseOptions,admitPureUserFunctions:!0}),share:l.shared&&t.cse!==!1};if(Kn(c,p)>Se)throw new Error(Vp(this.languageId))}if(t.strictTypes!==!0)return{ok:!0};let a=f.withReferences({},r.expr,r.target,t.vars?new Set(Object.keys(t.vars)):void 0),u=Nl(a.freeSymbolTypes);return u===void 0?{ok:!0}:{ok:!1,diagnostic:{...ti(new Error(u.message)),binding:u.names[0]}}})}catch(r){return{ok:!1,diagnostic:ti(r)}}}preparedAndTypedForCheck(n,t,r){let o=t.storage===void 0?void 0:At(t.storage,[n],this.createTarget(),{vars:t.vars,functions:t.functions});return at(n,t.vars,()=>Zo(n,t,i=>r(this.prepareAndType(i,t,o))))}_fragmentAnnotationForTest(n,t={}){return this.preparedAndTypedForCheck(n,t,({annotation:r})=>r)}compileOrThrow(n,t={},r){let{prepared:o,annotation:i}=this.prepareAndType(n,t,r);if(i.refusal!==void 0)throw new un(Lr(i.refusal));return this.emitPreparedRoot(o,t,i)}prepareAndType(n,t,r){jp(t.iterationBudget);let o=this.prepareRoot(n,t,r);el(o.target);let i=o.target,s=i.cse;i.cse??={enabled:!1,harvestOptions:{...o.cseOptions},instances:[]};let a,u=!1;try{a=Jo(o.expr,ds(i,{functions:t.functions,vars:t.vars,sumAssigned:wr(n)})),a.refusal===void 0&&(i.cse={enabled:!1,harvestOptions:{...o.cseOptions,isOverriddenOperator:()=>!1,isStringVar:()=>!1},instances:[]},u=En(o.expr,i))}finally{i.cse=s}return{prepared:o,annotation:a,handlerCode:u}}prepareRoot(n,t,r){n=Ze(n),n=Da(n);let o=La(void 0,t.functions),i,s=n,a=()=>i??=jn(s,t.vars),u=()=>a().all;t.vars!==void 0&&fp(t.vars,()=>a().written,u);let l=$=>Ta(t.vars?.[$],/^[A-Za-z_][A-Za-z0-9_]*$/.test($)?$:void 0,(A,E)=>cp(A,E,$,t.vars??{},u));n=ot(n,{skipHeads:o,iterationBudget:t.iterationBudget,readsLiveSource:l,unrollComprehensions:!0});let{functions:c,vars:p}=t,d=this.getFunctions(),h=this.getConstants(),g="vec2",y=this.createTargetFor(n,void 0,{varsKeys:p?new Set(Object.keys(p)):void 0,foldExcludedOps:c?new Set(Object.keys(c)):void 0,unrollSkipHeads:o,constantFold:t.constantFold,storage:r,mode:t.mode,functions:$=>{if(c&&Object.hasOwn(c,$)){let A=il(c[$]);if(typeof A=="string")return A;if(typeof A=="function")return A.name||$}return d[$]},constant:$=>$==="ImaginaryUnit"?`${g}(0.0, 1.0)`:h[$],var:$=>{if(p&&Object.hasOwn(p,$)){let A=p[$];return typeof A=="string"&&/^[A-Za-z_]\w*$/.test(A)&&Te(A,this.languageId),A}if($==="ImaginaryUnit")return`${g}(0.0, 1.0)`;if($ in h)return h[$]},naming:f.newNamingContext(n,[t.preamble,...p?Object.values(p):[]])});f.beginRootPreprocessing(n,y),n=Dn(lt(n,y,void 0,dt),y,a().written),n=ot(zp(f.inlineCollectionValuedCallsAtRoot(n,y,"list<any>"),y,{isOverridden:$=>c!==void 0&&Object.hasOwn(c,$)||p!==void 0&&Object.hasOwn(p,$)}),{skipHeads:o,iterationBudget:t.iterationBudget,readsLiveSource:l,unrollComprehensions:!0,explicitPointNorm:$=>{let A=xr($,y);return typeof A=="string"?void 0:A}}),p&&(_n(y).varNames=new Set(Object.keys(p)));let w={isOverriddenOperator:$=>c!==void 0&&Object.hasOwn(c,$),isStringVar:l,isVarsKey:$=>p!==void 0&&Object.hasOwn(p,$)};if(Kn(n,{...Un(n,{...w,admitPureUserFunctions:!0}),share:t.cse!==!1})>Se)throw new Error(`Could not compile: the ${this.languageId.toUpperCase()} code for this expression would have more than ${Se.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path when the shader cannot compute it once: the paths go through different branches of an \`If\`, the subexpression reads a \`vars\` source that is not a variable or a field of a variable (\`u.c\`), it is not pure, or the \`cse\` option is false.`);return{expr:n,target:y,cseOptions:w}}emitPreparedRoot(n,t,r){let o=this.currentAnnotation;this.currentAnnotation=r;try{return this.emitAnnotatedRoot(n,t,r)}finally{this.currentAnnotation=o}}emitAnnotatedRoot(n,t,r){let{expr:o,target:i,cseOptions:s}=n,{vars:a}=t,u=jp(t.iterationBudget);Object.assign(i,{fragmentScope:r.scope,fragmentPassBudget:u}),f.openCseSession(o,i,{enabled:t.cse,...s}),Eu(o,i);let l=f.compileCseRoot(o,i,0,()=>f.compileFunctionBody(o,i)),c=[...this.currentUserFunctions?.defs.values()??[]];u!==void 0&&[l,...c].some(g=>g.includes(Wn))&&(l=this.withPassCap(l,r.scope.facts.get(o),u,i)),Qr("this expression",l,this.languageId);let p={target:this.languageId,success:!0,code:l},d=this.preambleFor(l);d&&(p.preamble=d);let h=Ul(i,`${l}
${d??""}`);return h.bounds.length>0&&(p.float32Bounds=h.bounds),h.warnings.length>0&&(p.warnings=h.warnings),f.withReferences(p,o,i,a?new Set(Object.keys(a)):void 0),p}withPassCap(n,t,r,o){let i=t!==void 0&&"representation"in t?t.representation:void 0;if(i===void 0||i==="int"||i==="uint"||i==="sampler2D")throw new Error(`Could not compile: the value of the expression has no ${this.languageId.toUpperCase()} type that the pass cap can hold.`);let s=n.split(`
`),a=s.pop(),u=s.length===0?n:/^return (.*);$/s.exec(a.trim())?.[1];if(u===void 0)throw new Error("Could not compile: the code of the expression does not end with its value, so the pass cap cannot test it.");let l=f.tempVar(o);return[`${Wn} = 0;`,...s,`${i} ${l} = ${u};`,`return ${Wn} > ${r} ? ${Ed(i)} : ${l};`].join(`
`)}preambleFor(n){let t=this.userFunctionDefs(n);t&&(n=`${n}
${t}`);let r="";n.includes(Wn)&&(r+=`#ifndef ${Dp}
#define ${Dp}
int ${Wn} = 0;
#endif
`);let o=Gp(n),i=o.includes("_gpu_inf(");i&&(r+=Ls),r+=o;let s=Zu(n),a=Wu(n),u=Ju(n),l=/_gpu_(hurwitz_)?zeta/.test(n),c=/_gpu_(lerch|poly_log)/.test(n),p=/_gpu_(di|tri|poly)gamma\(/.test(n);(n.includes("_gpu_nan")||s.length>0||a.length>0||u.length>0||l||c||p)&&(r+=Mp),!i&&(n.includes("_gpu_inf")||n.includes("_gpu_gamma")||/_gpu_ipi_\w+\(/.test(n)||n.includes("_gpu_tanpi")||l||c||p)&&(r+=Ls);for(let d of s)r+=Ku(d);for(let[d,h]of a)r+=Hu(d,h);for(let d of u)r+=Xu(d);r+=Gu(n);for(let d of tp(n))r+=d==="scalar"?zs:np(d);if(r+=he(n,Ki),r+=he(n,Ji),r+=he(n,Bp),r+=he(n,Up),r+=he(n,Ml),r+=he(l||c?`${n} _gpu_gamma(`:n,_s),r+=he(n,ys),r+=he(c?`${n} _gpu_zeta_pow( _gpu_hurwitz_zeta(`:n,bs),r+=he(n,xs),r+=he(n,ws),n.includes("_gpu_heaviside")&&(r+=$s),n.includes("_gpu_sinc")&&(r+=vs),n.includes("_gpu_fresnel")&&(r+=Es),n.includes("_gpu_fresnelC")&&(r+=Cs),n.includes("_gpu_fresnelS")&&(r+=Ss),r+=he(n,Rs),r+=he(n,Ps),n.includes("_gpu_rnd_draw")){let d=[...new Set(n.match(new RegExp(`${Yt}\\d+`,"g"))??[])].sort((h,g)=>Number(h.slice(Yt.length))-Number(g.slice(Yt.length)));r+=`
`+d.map(h=>`uint ${h} = 0u;
`).join(""),r+=he(n,Ts)}return r+=he(n,As),r+=he(n,ks),r+=he(n,Op),t?r?`${r}
${t}`:t:r}compileToSource(n,t={}){if(n=Ze(n),gt("compileToSource()",n,this.languageId),t.storage!==void 0&&Object.keys(t.storage).length>0)throw new Error("compileToSource() does not support the `storage` option: a sampler-backed read needs a helper declaration, and this route returns a bare expression with no preamble channel. Use `compile()`, whose result carries the preamble.");let r=this.createTargetFor(n,void 0,{userFunctions:void 0,constantFold:t.constantFold}),o=Dn(n,r,jn(n).written);if(o!==n&&Kn(o,{...Un(o),share:!1})>Se)throw new Error(`Could not compile \`compileToSource()\`: the ${this.languageId.toUpperCase()} code would have more than ${Se.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path on this route, which has no common-subexpression pass. Use \`compile()\`, or assign the subexpression to a variable of its own (\`Block\`).`);let i=this.typeDeclaredBody(o,r,[],"`compileToSource()`",{userFunctions:!1});Object.assign(r,{fragmentScope:i.scope});let s=this.withAnnotation(i,()=>f.compile(o,r));return Ai("compileToSource()",s,this.languageId),s}compileShaderBody(n,t,r=[],o,i=[],s=[],a){if(t==="compute"&&n.length>0)throw new Error(`Could not compile the body statement "${n[0].variable}" of \`compileShader()\`: a compute shader from \`compileShader()\` cannot write a result. It has no outputs and no storage buffer, so the statement would assign a name that the shader does not declare. To compute values on the GPU, use \`compile()\`.`);let u=[...s,...tu[t]??[]],l=n.map(P=>{let G=Ql(P.variable,u);if("error"in G)throw new Error(`Could not compile the body statement "${P.variable}" of \`compileShader()\`: ${G.error}`);return G});n=n.map(P=>({...P,expression:Ze(P.expression)}));let c=0;for(let P of n)c+=Kn(P.expression,{...Un(P.expression),share:!1});if(c>Se)throw new Error(`Could not compile \`compileShader()\`: the ${this.languageId.toUpperCase()} code of the body statements would have more than ${Se.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path in a body statement. Assign the subexpression to a variable of its own (\`Block\`).`);let p=new Set;for(let P of r){if(p.has(P.name))throw new Error(`Could not compile: the shader declaration \`${P.name}\` is declared more than once (as an input and as a uniform): two storage classes cannot share one name, and a body referencing it names neither unambiguously. Rename one of them.`);p.add(P.name)}let d=[...r];for(let P of[...s,...Object.entries(ru[t]??{}).map(([G,k])=>({name:G,type:k}))])p.has(P.name)||(p.add(P.name),d.push({name:P.name,type:P.type}));let h=this.createTargetFor(n[0]?.expression,t,{constantFold:o,naming:f.newNamingContext(n.map(P=>P.expression),n.map(P=>P.variable))}),g=new Set,y=!1,w=h.var.bind(h);h.var=P=>{let G=w(P);return y&&G===void 0&&g.add(P),G};let x=pi(h,d),$=new Set([...d.map(P=>P.name),...i]),A=[],E=0;y=!0;let z=f.withLocalShapeFrame(new Map,li(d),()=>n.map((P,G)=>{gt(`compileShader() body statement "${P.variable}"`,P.expression,this.languageId);let k=ui(P.expression,new Set(r.map(W=>W.name)));if(k!==void 0)throw new Error(`Could not compile the body statement "${P.variable}" of \`compileShader()\`: it assigns "${k}", a declared input or uniform of the shader, which is read-only in ${this.languageId.toUpperCase()}. Assign a local copy of it instead (\`Block(y \u2254 ${k}; y \u2254 y + 1; y)\`).`);f.beginRootPreprocessing(P.expression,x);let R=Dn(lt(P.expression,x,{scalarNames:new Set,localNames:$},dt),x,new Set([...$,...jn(P.expression).written]));A[G]=R;let I=this.typeDeclaredBody(R,x,d,`the body statement "${P.variable}" of \`compileShader()\``);if(E+=Kn(R,{...Un(R),share:!1}),E>Se)throw new Error(`Could not compile \`compileShader()\`: the ${this.languageId.toUpperCase()} code of the body statements would have more than ${Se.toLocaleString("en-US")} nodes. A subexpression that several paths reach is written once for each path in a body statement. Assign the subexpression to a variable of its own (\`Block\`).`);Object.assign(x,{fragmentScope:I.scope});let H=this.withAnnotation(I,()=>f.compileStatementBody(R,x)),{stmts:m}=H,{code:v}=H;Ai(`compileShader() body statement "${P.variable}"`,v,this.languageId);let b=l[G].type,S=R,T=C(S)?d.find(W=>W.name===S.symbol):void 0,L=T===void 0?void 0:tn(T.type),O=b!==void 0&&b.element!=="f"&&L!==void 0&&An(L),U=O?L:mt(S),V=U===void 0?f.aggregateComponentCount(S):void 0,K=W=>`Could not compile the body statement "${P.variable}" of \`compileShader()\`: the value ${W}, and the target "${P.variable}" has the type \`${Nt(b)}\`.`,de=`${this.languageId.toUpperCase()} does not convert the one to the other in an assignment. Give the value the type of the target, or declare the output with the type of the value.`;if(b!==void 0&&V!==void 0&&V>0&&V!==b.width)throw new Error(`${K(`has ${V} components`)} ${de}`);if(O&&hi(L,b,a))v=T.name;else if(b!==void 0&&U!==void 0&&(!("element"in U)||!hi(U,b,a))){let W=`has the type \`${"element"in U?Nt(U):U.spelling}\``;throw"element"in U&&U.element==="f"&&b.element!=="f"?new Error(`${K(W)} \`compileShader()\` computes float values, and cannot assign an integer output. Declare the output with a float type (\`${Nt({element:"f",width:b.width})}\`).`):new Error(`${K(W)} ${de}`)}return{variable:P.variable,code:v,stmts:m}}));y=!1;let N=new Set([...r.map(P=>P.name),...i]),M=new Set;for(let P of A)for(let G of f.analyzeReferences(P,x,N).freeSymbols)!N.has(G)&&!(this.languageId==="glsl"&&nu[t]?.has(G)===!0)&&g.has(G)&&M.add(G);if(M.size>0)throw new Error(`Could not compile \`compileShader()\`: the body reads ${[...M].map(P=>`"${P}"`).join(", ")}, which no input or uniform of the shader declares. The emitted ${this.languageId.toUpperCase()} would read an undeclared name. Declare each name as an input or a uniform, or assign it a value.`);return z}};function Fs(e,n,t="List"){Xt(t,e.length);let r=Hr(e);return r!==void 0?`vec${r}[${e.length}](${e.map(o=>n(o)).join(", ")})`:(kn(e,e.length>=2&&e.length<=4?`vec${e.length}`:"float[]"),e.length===2?`vec2(${e.map(o=>n(o)).join(", ")})`:e.length===3?`vec3(${e.map(o=>n(o)).join(", ")})`:e.length===4?`vec4(${e.map(o=>n(o)).join(", ")})`:`float[${e.length}](${e.map(o=>n(o)).join(", ")})`)}var Hp={__proto__:null,Inversesqrt:"inversesqrt",Mod:([e,n],t,r)=>{if(e===null||n===null)throw new Error("Could not compile `Mod`: missing argument");let o=()=>X(n)===1?`fract(fract(${t(e)}))`:Xi(e,n,t)??`mod(${t(e)}, ${t(n)})`;return Nr("Mod",e,X(n)===1,t,r,j,o)??o()},List:(e,n)=>Fs(e,n,"List"),Matrix:(e,n)=>as(e,n,t=>`vec${t}`,t=>`mat${t}`,t=>`float[${t}]`),Tuple:(e,n)=>Fs(e,n,"Tuple"),PointList:(e,n)=>(kn(e,e.length>=2&&e.length<=4?`vec${e.length}`:"float[]"),Fs(e,n,"PointList"))};Ln(Hp.Mod,Ot("fract",1,1));var Sd={scalarGenTypeSlots:new Map([["min",new Set([1])],["max",new Set([1])],["clamp",new Set([1,2])],["mix",new Set([2])],["step",new Set([0])],["smoothstep",new Set([0,1])],["mod",new Set([1])],["refract",new Set([2])]]),mandatoryScalarSlots:new Map([["refract",new Set([2])]]),vectorOnlySlots:new Map([["cross",new Set([0,1])]]),matrixArithmetic:()=>!0,matrixNegate:!0},qp=class extends nr{languageId="glsl";getLanguageSpecificFunctions(){return Hp}getShapeRules(){return Sd}compileFunction(n,t,r,o,i){gt("compileFunction()",n,this.languageId);for(let[c,p]of[["the result",r],...o.map(([d,h])=>[`the parameter "${d}"`,h])])if(mi(p))throw new Error(`Could not compile \`compileFunction()\`: the declared type \`${p.trim()}\` of ${c} is not a GLSL type. Use the GLSL spelling (\`float\`, \`vec3\`, \`ivec3\`, \`mat2\`).`);let s=this.compileDeclaredFunctionBody(n,o,i),a=o.map(([c,p])=>`${p} ${c}`).join(", "),u=this.preambleFor(s),l=u?`${u}
`:"";if(s.includes(`
`)){let c=s.split(`
`).map(p=>`  ${p}`).join(`
`);return`${l}${r} ${t}(${a}) {
${c}
}`}return`${l}${r} ${t}(${a}) {
  return ${s};
}`}compileShader(n){let{type:t,version:r="300 es",inputs:o=[],outputs:i=[],uniforms:s=[],body:a,constantFold:u}=n;if(t!=="vertex"&&t!=="fragment")throw new Error(`Could not compile \`compileShader()\`: the GLSL target writes only vertex and fragment shaders, not a "${String(t)}" shader. GLSL ES 3.00 (WebGL 2) has no compute stage.`);let l=Number.parseInt(r,10);if(!Number.isFinite(l)||l<300)throw new Error(`GLSL version "${r}" is not supported: ES 3.00+ (or desktop 3.30+) is required`);for(let h of[...o,...i,...s])if(mi(h.type))throw new Error(`Could not compile \`compileShader()\`: the declared type \`${h.type.trim()}\` of "${h.name}" is not a GLSL type. Use the GLSL spelling (\`float\`, \`vec3\`, \`ivec3\`, \`mat2\`, \`float[5]\`).`);let c=`#version ${r}

`;t==="fragment"&&(c+=`precision highp float;
precision highp int;

`);for(let h of o)c+=`in ${h.type} ${h.name};
`;o.length>0&&(c+=`
`);for(let h of i)c+=`out ${h.type} ${h.name};
`;i.length>0&&(c+=`
`);for(let h of s)c+=`uniform ${h.type} ${h.name};
`;s.length>0&&(c+=`
`);let p=this.compileShaderBody(a,t,[...o,...s],u,i.map(h=>h.name),i,/es/i.test(r)?void 0:l),d=this.preambleFor(p.map(h=>[...h.stmts,h.code].join(`
`)).join(`
`));d&&(c+=`${d}
`),c+=`void main() {
`;for(let h of p){for(let g of h.stmts)c+=g.split(`
`).map(y=>`  ${y}
`).join("");c+=`  ${h.variable} = ${h.code};
`}return c+=`}
`,c}};var xc={__proto__:null,True:"True",False:"False"},wc=new Set(["and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","None","nonlocal","not","or","pass","raise","return","try","while","with","yield"]);function Wp(e){if(wc.has(e))throw new Error(`"${e}" is a reserved word in python and cannot be used as a variable name. Rename it, or map it to another name with \`vars\`, before compiling to Python (fail closed, D6).`);if(!$c.test(e))throw new Error(`"${e}" is not a Python identifier and cannot be used as a variable name. Rename it, or map it to another name with \`vars\`, before compiling to Python (fail closed, D6).`);return e}function Zn(e){if(wc.has(e)||e in xc)throw new Error(`"${e}" is a reserved word in python and cannot be used as a function, parameter or index name. Rename it before compiling to Python (fail closed, D6).`);if(!$c.test(e))throw new Error(`"${e}" is not a Python identifier and cannot be used as a function, parameter or index name. Rename it before compiling to Python (fail closed, D6).`);return e}var $c=/^[\p{XID_Start}_]\p{XID_Continue}*$/u;function Ad(e){if(e.normalize("NFKC")===e)return e;let n=r=>`_u${r.codePointAt(0).toString(16).toUpperCase()}_`,t="";for(let r of e)t+=r.normalize("NFKC")===r?r:n(r);if(t.normalize("NFKC")===t)return t;t="";for(let r of e)t+=r.codePointAt(0)<128?r:n(r);return t}function Ms(e){return e.split(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/)}var or=/[\p{XID_Start}_]\p{XID_Continue}*/gu;function yo(e,n){let t=Ms(e),r=new Set(n.outside??[]);for(let c=0;c<t.length;c+=2)for(let p of t[c].match(or)??[])r.add(p);let o=new Map;for(let c of r){let p=c.normalize("NFKC"),d=o.get(p);d===void 0?o.set(p,[c]):d.push(c)}let i=[...o].filter(([,c])=>c.length>1),s=new Map,a=c=>s.get(c)??c;if(i.length===0)return{body:e,name:a};let u=new Set(n.hostNames());for(let c of n.callerSources??[])for(let p of Ms(c).filter((d,h)=>h%2===0))for(let d of p.match(or)??[])u.add(d);let l=new Set(o.keys());for(let[c,p]of i){let d=p.filter(g=>u.has(g));if(d.length>1)throw new Error(`Could not compile to Python: the inputs "${d[0]}" and "${d[1]}" are the same name for Python ("${c}"), because Python reads each identifier in its NFKC normal form, so the host cannot give them two values. Rename one of them, or map it to another name with \`vars\` (fail closed, D6).`);let h=d[0]??p.find(g=>g===c)??p[0];for(let g of p){if(g===h)continue;let y=Ad(g),w=y;for(let x=1;l.has(w.normalize("NFKC"));x++)w=`${y}_${x}`;l.add(w.normalize("NFKC")),s.set(g,w)}}for(let c=0;c<t.length;c+=2)t[c]=t[c].replace(or,a);return{body:t.join(""),name:a}}var Td=new Set("ArithmeticError AssertionError AttributeError BaseException BaseExceptionGroup BlockingIOError BrokenPipeError BufferError BytesWarning ChildProcessError ConnectionAbortedError ConnectionError ConnectionRefusedError ConnectionResetError DeprecationWarning EOFError Ellipsis EncodingWarning EnvironmentError Exception ExceptionGroup FileExistsError FileNotFoundError FloatingPointError FutureWarning GeneratorExit IOError ImportError ImportWarning IndentationError IndexError InterruptedError IsADirectoryError KeyError KeyboardInterrupt LookupError MemoryError ModuleNotFoundError NameError NotADirectoryError NotImplemented NotImplementedError OSError OverflowError PendingDeprecationWarning PermissionError ProcessLookupError PythonFinalizationError RecursionError ReferenceError ResourceWarning RuntimeError RuntimeWarning StopAsyncIteration StopIteration SyntaxError SyntaxWarning SystemError SystemExit TabError TimeoutError TypeError UnboundLocalError UnicodeDecodeError UnicodeEncodeError UnicodeError UnicodeTranslateError UnicodeWarning UserWarning ValueError Warning ZeroDivisionError __import__ abs aiter all anext any ascii bin bool breakpoint bytearray bytes callable chr classmethod compile complex copyright credits delattr dict dir divmod enumerate eval exec exit filter float format frozenset getattr globals hasattr hash help hex id input int isinstance issubclass iter len license list locals map max memoryview min next object oct open ord pow print property quit range repr reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip np math cmath scipy".split(" "));function kd(e){let n=Ms(e).map((s,a)=>a%2===0?s:'""').join(""),t=new Set,r=[...n.matchAll(or)],o=s=>{let a=1;for(let u=s;u<n.length;u++)if("([{".includes(n[u]))a+=1;else if(")]}".includes(n[u])&&--a===0)return u;return n.length},i=[];for(let s of r){let a=s.index,u=a+s[0].length;if(n[a-1]===".")continue;let l=n.slice(u).match(/^\s*(\S)/)?.[1],c=i.some(([p,d])=>a>=p&&u<=d);if((l==="("||l==="."||c)&&t.add(s[0].normalize("NFKC")),s[0]==="isinstance"&&l==="("){let p=n.indexOf("(",u)+1,d=o(p),h=0;for(let g=p;g<d;g++)if("([{".includes(n[g]))h+=1;else if(")]}".includes(n[g]))h-=1;else if(n[g]===","&&h===0){i.push([g,d]);break}}if(s[0]==="except"){let p=n.indexOf(":",u);i.push([u,p<0?n.length:p])}}return t}function tr(e,n){let t;for(let r of n){let o=r.normalize("NFKC");if(!(!Td.has(o)&&!o.startsWith("_ce_"))&&(t??=kd(e),t.has(o)))throw new Error(`"${r}" is the name of a Python builtin or module ("${o}") that the compiled Python code uses, and cannot be used as a symbol, parameter or function name. Rename it before compiling to Python (fail closed).`)}}function Yp(e){return Object.values(e??{}).filter(n=>typeof n=="string")}var Ns={__proto__:null,Pi:"np.pi",ExponentialE:"np.e",ImaginaryUnit:"1j",Infinity:"np.inf",NaN:"np.nan",GoldenRatio:"((1 + np.sqrt(5)) / 2)",CatalanConstant:"0.915965594177219015054603514932384110774",EulerGamma:"0.5772156649015328606065120900824024310421"};function Us(e,n,t){return`(lambda _q: max(0, int((_q + (0 if float(${e}).is_integer() and float(${n}).is_integer() and float(${t}).is_integer() else min(${1e-12} * (1 + abs(_q)), ${.001}))) // 1) + 1))((${n} - ${e}) / ${t})`}function Kp(e,n){let t=X(e);return t!==void 0?`${Math.max(0,Math.round(t))}`:`max(0, ${Ld(e,n)})`}function Ld(e,n){return`int(np.floor((${n(e)}) + 0.5))`}function Xp(e,n,t,r){let o=X(t);if(o!==void 0){let u=Math.round(o);return Math.abs(u)>Number.MAX_SAFE_INTEGER?e==="Take"?`${n}[:]`:`${n}[:0]`:e==="Take"?u<0?`${n}[${u}:]`:`${n}[:${u}]`:u<0?`${n}[:${u}]`:`${n}[${u}:]`}let i=e==="Take"?"_l[_n:] if _n < 0 else _l[:_n]":"_l[:_n] if _n < 0 else _l[_n:]",s=Number.MAX_SAFE_INTEGER,a=`int(np.clip(np.floor((${r(t)}) + 0.5), -${s}, ${s}))`;return`(lambda _l, _n: ${i})(${n}, ${a})`}function ir(e,n){let t=r=>{if(_r(r))return!0;if(it(r))return!1;let o=On(Y(r.type.type));return o!==void 0&&o!=="never"&&D(Y(o),"character")};if(n.some(t))throw new Error(`Could not compile \`${e}\`: a character participant. A character is one UAX #29 grapheme cluster, and this target has no stdlib grapheme segmentation or code-point-sequence ordering to reproduce the interpreter's character semantics. The interpreter evaluates it instead.`)}function vc(e,n){for(let t of n){let r=Wo(t);if(r!==null)throw new Error(`Could not compile \`${e}\`: a ${r} participant. The interpreter compares it as ONE value, whereas the emitted Python looks inside it: a dictionary or record has no positional lowering, and a tuple is mapped over element-wise by \`np.less\` (\`Equal(Tuple(1, 2), List(1, 2))\` answered \`True\`) where a point binds atomically. The interpreter evaluates it instead.`)}}function zd(e){let n=(t,r,o)=>{if(typeof t=="object"&&t.kind==="reference"&&t.def!==void 0){let a=Qs(t);if(o?.has(a))return!1;o=new Set(o).add(a)}let i=Y(t);if(typeof i=="string")return!r&&i==="tuple";if(i.kind==="tuple")return!r;if(i.kind==="union")return i.types.some(a=>n(a,r,o));let s=cr(i);return s===void 0?!1:n(s,!1,o)};return n(e.type.type,!0)}function Fd(e,n){if(n.some(zd))throw new Error(`Could not compile \`${e}\`: a participant whose ELEMENTS are tuples (a point list). \`np.less([(1, 2)], [(3, 4)])\` looks inside each point and answers \`[[True, True]]\`, whereas the interpreter broadcasts to an inert point comparison (\`[(1, 2) < (3, 4)]\`). Only the EQUALITY family admits point lists (whole-value \`_ce_eqcoll\`). The interpreter evaluates it instead.`)}function Nd(e,n){if(n.some(Fa))throw new Error(`Could not compile \`${e}\`: string-valued operands are not supported by this target (the lowering is numeric: a raw \`==\` that skips the interpreter's text conditioning). The interpreter evaluates it instead.`)}function Gd(e){return e.length!==2||!e.some(it)||e.some(n=>{let t=Y(n.type.type);return t!=="never"&&D(t,"number")})||e.some(n=>Wo(n)!==null)?!1:!e.some(n=>sn(n)||yr(n))}function Id(e,n){if(Ga(n))throw new Error(`Could not compile \`${e}\`: an ordering that mixes a string operand with an operand that is not provably a string. The interpreter leaves such a comparison symbolic (\`Less("a", 1)\` stays inert), whereas NumPy coerces the number to a string and answers a plausible-looking boolean (\`np.less(["a", 10], ["b", 9])\` \u2192 \`[True, True]\`). An ordering whose operands are ALL provably strings does compile \u2014 the interpreter compares strings the same way. The interpreter evaluates it instead.`)}function Zp(e,n,t,r){if(n.length<2)throw new Error(`Could not compile \`${e}\`: expected at least two arguments`);let o=n.filter(sn).length,i=n.map(h=>En(h,r)),s=h=>new Error(`Could not compile \`${e}\`: an operand runs code that the caller supplied (a \`vars\` or \`functions\` entry), and ${h}. The interpreter evaluates it instead.`);n.length===2&&n.every(st)&&n.every(za)||vc(e,n),ir(e,n);let u=Gd(n),l=o>=2&&n.every(Na);if(!u&&!l&&Nd(e,n),u){let h=e==="Equal"?"==":"!=";return`((${t(n[0])}) ${h} (${t(n[1])}))`}if(o===1){let h=n.findIndex(sn),g=N=>{let M=Y(N);return M!=="never"&&D(M,"number")},y=n[h],w=y.type.matches("list<any>")?On(Y(y.type.type)):void 0;if(w===void 0||!g(w)||!n.every((N,M)=>M===h||g(N.type.type)))throw new Error(`Could not compile \`${e}\`: a single collection operand broadcasts element-wise in the interpreter (a list of booleans, not a boolean). The Python target compiles that shape only for an ordered list of numbers whose other operands are numbers.`);if(i.some((N,M)=>N&&M!==h))throw s("the element-wise form evaluates it once for each element");let x=f.tempVar(r),$=n.map((N,M)=>M===h?x:t(N)),A=e==="Equal"?"==":"!=",E=[];for(let N=0;N<n.length-1;N++)E.push(`((${$[N]}) ${A} (${$[N+1]}))`);return`[${E.length===1?E[0]:`(${E.join(" and ")})`} for ${x} in ${t(y)}]`}if(o>=2){let h=(y,w)=>{let x=`_ce_eqcoll(${t(y)}, ${t(w)})`;return e==="Equal"?x:`(not ${x})`};if(n.length===2)return h(n[0],n[1]);if(i.some(y=>y))throw s("this chain splices a middle operand twice and skips the operands after a false pair");let g=[];for(let y=0;y<n.length-1;y++)g.push(h(n[y],n[y+1]));return`(${g.join(" and ")})`}let c=(h,g)=>`((${t(h)}) ${e==="Equal"?"==":"!="} (${t(g)}))`,p=h=>h===0||h===n.length-1;if(i.some((h,g)=>h&&(!p(g)||g>=2)))return Od(e,n,i,t,r,s);if(n.length===2)return c(n[0],n[1]);let d=[];for(let h=0;h<n.length-1;h++)d.push(c(n[h],n[h+1]));return`(${d.join(" and ")})`}function Od(e,n,t,r,o,i){let s=o.bindExpr;if(s===void 0)throw i("this target cannot bind it to a temporary");let a=t.lastIndexOf(!0),u=n.map(w=>r(w)),l=(w,x)=>x<a&&!B(w)&&!Ue(w)&&!(C(w)&&w.isConstant),c=n.map((w,x)=>t[x]||l(w,x)?f.tempVar(o):void 0),p=w=>c[w]??u[w],d=(w,x)=>`((${p(w)}) ${e==="Equal"?"==":"!="} (${p(x)}))`,h=w=>{let x=w+1<n.length?` and ${h(w+1)}`:"",$=`${d(w-1,w)}${x}`,A=c[w];return A===void 0?$:s([[A,u[w]]],$)},g=`(${h(1)})`,y=c[0];return y===void 0?g:s([[y,u[0]]],g)}function $t(e,n,t=!1){if(B(e)&&!e.isComplex&&Number.isFinite(e.re))return String(Math.floor(e.re));let r=f.compile(e,n);return!t||e.type.matches("integer")?r:`int((${r}) // 1)`}function Md(e,n){return B(e)&&!e.isComplex&&Number.isFinite(e.re)?String(Math.floor(e.re)+1):`${$t(e,n,!0)} + 1`}function Jp(e,n,t){if(!n[0])throw new Error(`Could not compile \`${e}\`: no body`);if(!n[1])throw new Error(`Could not compile \`${e}\`: no indexing set`);f.assertScalarBigOpBody(e,n[0]);let r=n[0],o=()=>new Error(`Could not compile \`${e}\`: the body is a statement or a block of statements, and the Python lowering of \`${e}\` is a generator expression, whose element is an expression. The loop form of \`${e}\` is written only where the \`${e}\` is the value of a statement (a function body, a statement of a block, or the right side of an assignment there).`);if(Bn(r)!==void 0||_(r,"Block")&&r.nops>1){let g=Ud(e,n,t);if(g!==void 0)return g;throw o()}let i=n.slice(2),s=g=>B(g)&&!g.isComplex&&Number.isFinite(g.re),a=i.some(g=>!_(g,"Limits")||!s(g.ops[1])||!s(g.ops[2])),u=0,{forClauses:l,idxTarget:c}=Ec(e,n.slice(1),t,a?g=>u++===0?g:f.tempVar(t):void 0),p=g=>e==="Sum"?`sum(${g})`:`math.prod(${g})`,d=n.length===2?n[1]:void 0;if(t.cseBind!==void 0&&_(d,"Limits")&&C(d.ops[0])){let[,g,y]=d.ops,w=z=>B(z)&&!z.isComplex&&Number.isFinite(z.re)?Math.floor(z.re):void 0,x=w(g),$=w(y),A=z=>w(z)!==void 0||C(z),E=x!==void 0&&$!==void 0;if(E&&x<=$||!E&&A(g)&&A(y)){let{bindings:z,result:N}=f.hoistLoopInvariants(r,[d.ops[0].symbol],t,()=>f.compile(r,c));if(N.includes(`
`))throw o();let M=p(`${N} ${l.join(" ")}`);if(z.length>0){let P=t.cseBind(z.map(([k,R])=>[k,R]),M);if(E)return P;let G=`${$t(g,t,!0)} <= ${$t(y,t,!0)}`;return`(${P} if ${G} else ${e==="Sum"?"0":"1"})`}return M}}let h=f.compile(r,c);if(h.includes(`
`))throw o();return p(`${h} ${l.join(" ")}`)}function Ec(e,n,t,r){let o=[],i=t;for(let s of n){if(!_(s,"Limits"))throw new Error(`Could not compile \`${e}\`: expected a Limits indexing set`);let a=s.ops,u=a[0];if(!C(u))throw new Error(`Could not compile \`${e}\`: index must be a symbol`);let l=Zn(u.symbol),c=r?.(l)??l,p=a[1],d=a[2];if(p===void 0||d===void 0||C(d,"Nothing")||d.isInfinity||p.isInfinity)throw new Error(`Could not compile \`${e}\`: an unbounded range is not supported`);f.assertSafeBigOpBounds(e,[p,d],i);let h=$t(p,i,!0),g=Md(d,i);o.push(`for ${c} in range(${h}, ${g})`);let y=i;i={...y,var:w=>w===l?c:y.var(w),...f.withBoundScope(y,[l])}}return{forClauses:o,idxTarget:i}}function Qp(e,n){let t={stmts:[],boundVars:n.boundVars,unit:e},r=f.compileCseRoot(e,{...n,hoist:t});if(t.stmts.length===0)return r;let o=r.includes(`
`)||/^return\b/.test(r)||/^[^\s()[\]{}'"=,:]+ = /.test(r);return[...t.stmts,o?r:`return ${r}`].join(`
`)}function Ud(e,n,t){if(!f.canHoist(t))return;let r=t.hoist.unit,o=E=>_(E,e)&&E.nops===n.length&&E.ops.every((z,N)=>z===n[N]);if(!(o(r)||_(r,"Assign")&&o(r.ops[1])||_(r,"Declare")&&o(f.declareValueOperand(r.ops))||_(r,"Return")&&o(r.ops[0])))return;let s=n[0],a=(E,z)=>{if(!_(E)||E.operator==="Function")return!1;let N=E.operator;return N==="Return"||(N==="Break"||N==="Continue")&&!z?!0:E.ops.some(M=>a(M,z||N==="Loop"))};if(a(s,!1))return;let u=f.tempVar(t),l={...t,cse:qa(t)},{forClauses:c,idxTarget:p}=Ec(e,n.slice(1),l,()=>f.tempVar(t)),d={stmts:[],boundVars:p.boundVars,unit:s},h=f.withFreshBlockLocals(()=>f.compile(s,{...p,hoist:d})),g=[...d.stmts,...h.split(`
`)],y=g.pop(),w=/^return (.+)$/.exec(y),x=/^([^\s()[\]{}'"=,:]+) = /.exec(y),$;if(w!==null&&w[1]!=="None")$=w[1];else if(w===null&&x!==null)g.push(y),$=x[1];else if(g.length===0&&!/^(?:if|for|while)\b/.test(y))$=y;else return;g.push(`${u} ${e==="Sum"?"+=":"*="} ${$}`);let A=g.join(`
`);for(let E=c.length-1;E>=0;E--)A=`${c[E]}:
${Po(A)}`;return f.hoistStatement(t,`${u} = ${e==="Sum"?"0":"1"}`,A),u}function Po(e){return(e.trim()===""?"pass":e).split(`
`).map(t=>`    ${t}`).join(`
`)}function Ao(e,n){if(C(e,"Nothing"))return"";if(!_(e))return f.compile(e,n);let t=e.operator;if(t==="Break")return"break";if(t==="Continue")return"continue";if(t==="Return")return`return ${f.compileOp(e,0,n,0,e.ops[0])}`;if(t==="If")return Jc(e.ops,n,e);let r=t==="Declare"&&_(e.ops[0],"Tuple");if(t==="Block"||r){let o=r?[e]:e.ops,i=r?void 0:e,s=f.withImplicitLocalDeclares(o.flatMap(l=>f.desugarPatternDeclare(l,n)??[l]).flatMap(l=>f.desugarPatternAssign(l,n)??[l]),n,i),a=s.flatMap(l=>_(l,"Declare")&&C(l.ops[0])?[l.ops[0].symbol]:[]);f.assertNoUseBeforeDeclare(s),f.assertLocalsAssignedBeforeRead(s,a);let u=l=>{let c=f.loopBodyTempTarget(s,n),p=l===void 0?c:{...c,var:h=>l.get(h)??c.var(h)},d=(h,g,y)=>{let w=p.var(y)??y,x=f.declareValueOperand(g);if(x===void 0)return"";let $=g.indexOf(x),A=$<0?f.compile(x,p):f.compileOp(h,$,p,0,x);return f.assertExpressionValue(A,p,"Declare",y),`${w} = ${A}`};return f.withCseScope(e,-1,p,()=>s.map(h=>_(h,"Declare")&&C(h.ops[0])?d(h,h.ops,h.ops[0].symbol):Ao(h,p)).filter(h=>h!=="").join(`
`))};return a.length===0?u():f.withFreshBlockLocals(()=>u(new Map(a.map(l=>[l,f.freshBlockLocalName(n)]))))}if(t==="Assign"&&_(e.ops[0],"Tuple")){let o=f.desugarPatternAssign(e,n);if(o!==null){let i=f.loopBodyTempTarget(o,n);return o.map(s=>Ao(s,i)).filter(s=>s!=="").join(`
`)}}return t==="Loop"?Rc(e.ops,n,e):f.compileOp(e,-1,n,0,e)}function Bd(e,n){if(_(e,"Range")&&e.nops>=2&&e.nops<=3){let[t,r,o]=e.ops,i=c=>c!==void 0&&B(c)&&!c.isComplex&&Number.isSafeInteger(c.re)?c.re:void 0,s=i(t),a=i(r),u=o===void 0?void 0:i(o);if(s!==void 0&&a!==void 0&&(o===void 0||u!==void 0)){let c=u??(a>=s?1:-1);return c===0?"[]":c===1?`range(${s}, ${a+1})`:c>0?`range(${s}, ${a+1}, ${c})`:`range(${s}, ${a-1}, ${c})`}let l=(c,p)=>p!==void 0||!B(c);if(o===void 0&&l(t,s)&&l(r,a)){let c=$t(t,n),p=$t(r,n);return`(lambda _a, _b: (range(int(_a), int(_b) + 1) if _b >= _a else range(int(_a), int(_b) - 1, -1)) if float(_a).is_integer() and float(_b).is_integer() else (lambda _s: [_a + _s * _i for _i in range(${Us("_a","_b","_s")})])(1 if _b >= _a else -1))(${c}, ${p})`}}if(e.type.matches("string"))throw new Error("Could not compile `Loop`: cannot iterate a string on this target \u2014 its elements are UAX #29 grapheme clusters and Python has no stdlib grapheme segmentation, so the emitted loop would walk code points instead. The interpreter evaluates it.");return ir("Loop",[e]),f.compile(e,n)}var Cc=new WeakMap;function bo(e,n,t){let r=f.newNamingContext(e,n,t),o=new Set(e.unknowns),i=new Set,s=[...e.symbols];for(;s.length>0;){let a=s.pop();if(i.has(a))continue;i.add(a);let u=e.engine._getSymbolValue(a);if(u!==void 0){for(let l of u.unknowns)o.add(l);s.push(...u.symbols)}}for(let a of n??[])if(typeof a=="string")for(let u of a.match(or)??[])o.add(u);return Cc.set(r,o),r}function Dd(e,n){if(n.var(e)!==void 0)return!0;let t=n.naming;return t!==void 0&&Cc.get(t)?.has(e)===!0}function Sc(e,n,t=!1){let r=f.elementClauseBinders(e,n);r.forEach((a,u)=>{let l=a.clause.ops[2];if(!(l===void 0||C(l,"Nothing"))){for(let c=u+1;c<r.length;c++)for(let p of r[c].names)if(l.has(p))throw new Error(`Could not compile \`Comprehension\`: the guard of clause ${u+1} names \`${p}\`, which a later clause binds; in a Python comprehension that name is the later loop's variable, unassigned at that point, where the interpreter reads the enclosing one. The interpreter evaluates it instead.`)}});let o=[],i=[],s=n;for(let a of r){let u=Bd(a.clause.ops[1],s);for(let y of a.names)Zn(y);let l=s,c=new Set(a.names),p=new Map;if(t){for(let y of a.names)if(Dd(y,l)){let w=f.tempVar(l);p.set(y,w),i.push(w)}}s={...l,var:y=>c.has(y)?p.get(y)??y:l.var(y),...f.withBoundScope(l,a.names)};let d=p.size===0?a.pyPattern:a.pyPattern.replace(/[^\s(),]+/g,y=>p.get(y)??y),h=a.clause.ops[2],g=h!==void 0&&!C(h,"Nothing")?` if ${om(h,s)}`:"";o.push(`for ${d} in ${u}${g}:`)}return{headers:o,bodyTarget:s,renamed:i}}function jd(e){return e.some(n=>_(n,"Element")&&n.nops>=3&&!C(n.ops[2],"Nothing"))}function Rc(e,n,t){if(!e[0])throw new Error("Could not compile `Loop`: no body");if(n.iterationBudget!==void 0)throw new Error("Could not compile `Loop` on target python: Python code cannot honor the `iterationBudget` option. The interpreter evaluates it instead.");let r=e[0],o=e.slice(1),i,s=n,a=[];if(o.length===0)i=["while True:"];else{if(jd(o))throw new Error("Could not compile `Loop`: a guarded `Element` clause has no Python statement form. The interpreter evaluates it instead.");f.assertBreakLeavesWholeLoop(o,r),{headers:i,bodyTarget:s,renamed:a}=Sc(o,n,!0)}let u=Po(f.withWritableLoopIndices(a,()=>f.withCseScope(t,0,s,()=>Ao(r,s))));for(let l=i.length-1;l>=0;l--)u=l===i.length-1?`${i[l]}
${u}`:`${i[l]}
${Po(u)}`;return u}function Vd(e,n,t){if(!e[0])throw new Error("Could not compile `Comprehension`: no body");if(!e[1])throw new Error("Could not compile `Comprehension`: no indexing set");let r=e[0];if(_(r,"Block")){if(r.nops!==1)throw new Error("Could not compile `Comprehension`: a multi-statement body has no Python list-comprehension form.");r=r.ops[0]}if(Gn(r))throw new Error("Could not compile `Comprehension`: the body is a statement, which has no place in a Python list comprehension.");Vs("Comprehension",r);let{headers:o,bodyTarget:i}=Sc(e.slice(1),n),s=f.withCseScope(t,0,i,()=>f.compile(r,i)),a=o.map(u=>u.slice(0,-1)).join(" ");return`[${s} ${a}]`}var Bs={__proto__:null,Add:["+",11],Negate:["-",14],Subtract:["-",11],Multiply:["*",12],Divide:["/",13],Power:["**",15],LessEqual:["<=",9],GreaterEqual:[">=",9],Less:["<",9],Greater:[">",9],And:["and",4],Or:["or",3],Not:["not",14]};function Pc(e,n,t){let r=n.trim();return r.startsWith("-")||r.startsWith("+")?`(${n})`:_(e)?(t?.operators?.(e.operator)??Bs[e.operator])===void 0?n:`(${n})`:n}function sn(e){let n=e.type;return n.matches("string")?!1:n.matches("list<any>")||n.matches("indexed_collection<any>")}function qd(e){let n=e.rank;return n>0?n:Ac(e.type.type)}function Ac(e){let n=Y(e);if(typeof n!="object"||n.kind!=="list"||n.dimensions===null)return;let t=n.dimensions?.length??1;if(D(n.elements,"number"))return t;let r=Ac(n.elements);return r===void 0?void 0:t+r}function ec(e){if(!(e===void 0||e<=2))throw new Error("Could not compile `Norm`: above rank 2 the interpreter computes only the Frobenius norm (the order 2, which is also the default), and `np.linalg.norm` raises for any explicit order on an input with more than two axes.")}function Hd(e){let n=e.type.type;for(let t=0;n!==void 0&&t<16;t++){if(D(n,"finite_number"))return!0;n=cr(n)}return!1}function Wd(e){let n=e.type.type;for(let t=0;n!==void 0&&t<16;t++){if(D(n,"integer"))return"integer";n=cr(n)}return Hd(e)?"finite":"any"}function Re(e,n,t){let r=n===void 0?"":`, ${n}`,o=t!=="integer"&&(n===void 0||n==="2"||n==="'fro'"||n==="_p"),i=o?`(lambda _m: np.linalg.norm(_a * 2.0**600${r}) * 2.0**-600 if 0 < _m < 2.0**-500 else np.linalg.norm(_a * 2.0**-600${r}) * 2.0**600 if _m > 2.0**500 else np.linalg.norm(_a${r}))(np.max(np.abs(_a), initial=0))`:`np.linalg.norm(${t==="any"?"_a":e}${r})`;if(t!=="any")return o?`(lambda _a: ${i})(np.asarray(${e}))`:i;let s="_a.dtype.kind in 'fc'";return`(lambda _a: float('inf') if ${s} and np.isinf(_a).any() else (float('nan') if ${s} and np.isnan(_a).any() else ${i}))(np.asarray(${e}))`}function Gs(e,n,t,r){let o="float('nan')";return`(lambda _x: np.abs(_x) if np.ndim(_x) == 0 else ${t==="vector"?`${Re("_x",n,r)} if np.ndim(_x) == 1 else ${o}`:`${Re("_x",n,r)} if np.ndim(_x) <= 2 else ${t==="two"?Re("_x",void 0,r):o}`})(${e})`}function Yd(e,n,t,r){let o="float('nan')";return So(e,n,t,i=>`(np.abs(_x) if _p > 0 else ${o}) if np.ndim(_x) == 0 else (${Re("_x","_p",r)} if _p > 0 else ${o}) if np.ndim(_x) == 1 else (${Tc(i,r)}) if np.ndim(_x) == 2 else (${Re("_x",void 0,r)} if _p == 2 else ${o})`)}function Tc(e,n){let r=`${Re("_x","_p",n)} if _p == 1 or _p == 2 or _p == np.inf else float('nan')`;return e===void 0?r:`${Re("_x","'fro'",n)} if ${e} else ${r}`}function So(e,n,t,r){return D(t,"number")||!Le(t,"string")?`(lambda _x, _p: ${r(void 0)})(${e}, ${n})`:`(lambda _x, _q: (lambda _p: ${r("(isinstance(_q, str) and _q == 'Frobenius')")})(({'Infinity': np.inf, 'Frobenius': 2}.get(_q, float('nan')) if isinstance(_q, str) else _q)))(${e}, ${n})`}var kc=`def _ce_cplx(_v):
    return complex(_v) if isinstance(_v, (int, float)) and not isinstance(_v, bool) else _v
def _ce_cisreal(_v):
    return _v.imag == 0 if isinstance(_v, (complex, np.complexfloating)) else True
def _ce_creal(_v):
    return _v.real if isinstance(_v, (complex, np.complexfloating)) else _v
def _ce_creal_elems(_v):
    if isinstance(_v, (list, tuple)):
        return [_ce_creal_elems(_x) for _x in _v]
    if hasattr(_v, 'ndim') and _v.ndim > 0:
        return np.asarray([_ce_creal_elems(_x) for _x in _v])
    if hasattr(_v, 'ndim') and _v.ndim == 0:
        _v = _v.item()
    return _ce_creal(_v) if _ce_cisreal(_v) else float('nan')`,Lc=`def _ce_bcast_apply(_op, _arrs):
    if _op == 'clip':
        return np.clip(_arrs[0], _arrs[1], _arrs[2])
    if _op == 'smoothstep':
        return _ce_smoothstep(_arrs[0], _arrs[1], _arrs[2])
    _pair = np.maximum if _op == 'max' else np.minimum
    _r = _arrs[0]
    for _a in _arrs[1:]:
        _r = _pair(_r, _a)
    return _r

def _ce_bcast(_op, *args):
    _arrs = [np.asarray(a) for a in args]
    _cols = [a for a in _arrs if a.ndim > 0]
    if not _cols:
        return np.asarray(_ce_bcast_apply(_op, _arrs))
    _n = _cols[0].shape[0]
    if any(a.shape[0] != _n for a in _cols) or _n == 0:
        return np.asarray(float('nan'))
    if all(a.shape == _cols[0].shape for a in _cols):
        return np.asarray(_ce_bcast_apply(_op, _arrs))
    return np.asarray([
        _ce_bcast(_op, *[(a[_i] if a.ndim > 0 else a) for a in _arrs])
        for _i in range(_n)
    ])
`,zc=`def _ce_rref(_m):
    _a = np.asarray(_m, dtype=float).copy()
    _rows, _cols = _a.shape
    _r = 0
    for _c in range(_cols):
        if _r >= _rows:
            break
        _piv = _r + int(np.argmax(np.abs(_a[_r:, _c])))
        if _a[_piv, _c] == 0:
            continue
        _a[[_piv, _r]] = _a[[_r, _piv]]
        _a[_r] = _a[_r] / _a[_r, _c]
        for _k in range(_rows):
            if _k != _r:
                _a[_k] = _a[_k] - _a[_k, _c] * _a[_r]
        _r += 1
    return _a
`,Fc=`def _ce_eqcoll(_a, _b):
    _al = isinstance(_a, (list, tuple, np.ndarray))
    _bl = isinstance(_b, (list, tuple, np.ndarray))
    if _al != _bl:
        return False
    if not _al:
        try:
            return bool(_a == _b)
        except TypeError:
            return False
    try:
        _x = np.asarray(_a)
        _y = np.asarray(_b)
        if _x.dtype.kind in 'iuf' and _y.dtype.kind in 'iuf':
            if _x.shape != _y.shape:
                return False
            with np.errstate(invalid='ignore'):
                return bool(np.all(_x == _y))
    except (ValueError, TypeError):
        pass
    if len(_a) != len(_b):
        return False
    return all(_ce_eqcoll(_x, _y) for _x, _y in zip(_a, _b))
`,Nc=`def _ce_same(_a, _b):
    if isinstance(_a, np.ndarray) or isinstance(_b, np.ndarray):
        return _ce_same(np.asarray(_a).tolist(), np.asarray(_b).tolist())
    if isinstance(_a, (bool, np.bool_)) != isinstance(_b, (bool, np.bool_)):
        return False
    if isinstance(_a, tuple) and isinstance(_b, tuple):
        return len(_a) == len(_b) and all(_ce_same(_x, _y) for _x, _y in zip(_a, _b))
    if isinstance(_a, list) and isinstance(_b, list):
        return len(_a) == len(_b) and all(_ce_same(_x, _y) for _x, _y in zip(_a, _b))
    if isinstance(_a, (float, np.floating)) and isinstance(_b, (float, np.floating)) and _a != _a and _b != _b:
        return True
    return bool(_a == _b)

def _ce_indexof(_l, _v):
    for _i, _x in enumerate(_l):
        if _ce_same(_x, _v):
            return _i + 1
    return 0
`;function xo(e,n){return`(lambda _x: (lambda _y: np.where(np.isinf(_y) & (_x != 0) & (np.abs(_x) < ${Math.PI/2}), _y, np.where(np.isinf(_y) | (np.abs(_y) * np.minimum(np.abs(_x), ${ia}.0) * ${oa} >= 1), np.inf, _y))[()])(${n}))(${e})`}function wo(e,n){return Gc(e,n==="cos"?"_pc":n==="sin"?"_ps":n==="tan"?"(np.where(_pc == 0, np.inf, _ps / np.where(_pc == 0, 1.0, _pc)) + 0.0)[()]":"(_pc + 1j * _ps)")}function Gc(e,n){return`(lambda _pu: (lambda _pr: (lambda _pq: (lambda _pt, _pk: (lambda _c0, _s0: (lambda _pc, _ps: ${n})((np.select([_pk == 0, _pk == 1, _pk == 2], [_c0, -_s0, -_c0], _s0) + 0.0)[()], (np.select([_pk == 0, _pk == 1, _pk == 2], [_s0, _c0, -_s0], -_c0) + 0.0)[()]))(np.cos(np.pi * _pt), np.sin(np.pi * _pt)))(_pr - _pq / 2, (_pq + 4) % 4))(np.floor(2 * _pr + 0.5)))(_pu - 2 * np.floor(_pu / 2 + 0.5)))(${e})`}function wt(e,n){let t="complex(np.inf, np.inf)",r=(i,s)=>`(np.where(${s} == 0, ${t}, 1j * ${i} / np.where(${s} == 0, 1.0, ${s})) + 0.0)[()]`,o={Sinh:"(1j * _ps + 0.0)",Cosh:"(_pc + 0j)",Tanh:r("_ps","_pc"),Csch:r("-1.0","_ps"),Sech:`(np.where(_pc == 0, ${t}, 1.0 / np.where(_pc == 0, 1.0, _pc) + 0j))[()]`,Coth:r("-_pc","_ps")}[n];return Gc(e,o)}function nc(e){return e===1/0?"float('inf')":e===-1/0?"-float('inf')":Number.isNaN(e)?"float('nan')":String(e)}var Jn=!1;function Ic(){return`import math
def _ce_pow_branch(_e):
    if not math.isfinite(_e) or _e == math.floor(_e):
        return None
    _tol = max(5e-324, abs(_e) * 4 * 2.220446049250313e-16, abs(_e) * 10.0 ** (1 - ${_a()}))
    _x = _e
    _a = float(math.floor(_x))
    _h1, _k1, _h, _k = 1.0, 0.0, _a, 1.0
    if not abs(_h / _k - _e) <= _tol:
        while _x - _a > 1e-15 * _k * _k:
            _x = 1 / (_x - _a)
            _a = float(math.floor(_x))
            _h, _h1 = _h1 + _a * _h, _h
            _k, _k1 = _k1 + _a * _k, _k
            if abs(_h / _k - _e) <= _tol:
                break
    if not (math.isfinite(_h) and math.isfinite(_k)) or _k == 0:
        return None
    if abs(_h / _k - _e) > _tol:
        return None
    if (12 / math.pi ** 2) * _k * _k * _tol > ${ga}:
        return None
    return (_h, _k)
def _ce_pow_real(_x, _y):
    if not (math.isfinite(_x) and _x < 0 and math.isfinite(_y)):
        return None
    _t = _ce_pow_branch(_y)
    if _t is None or _t[1] % 2 == 0:
        return None
    _m = float(np.power(-_x, _y))
    if not math.isfinite(_m):
        return None
    return -_m if _t[0] % 2 != 0 else _m
def _ce_cos_sin_pi(_v):
    _r = _v - 2 * math.floor(_v / 2 + 0.5)
    _q = math.floor(2 * _r + 0.5)
    _t = _r - _q / 2
    _c = math.cos(math.pi * _t)
    _s = 0.0 if _t == 0 else math.sin(math.pi * _t)
    return [(_c, _s), (-_s, _c), (-_c, -_s), (_s, -_c)][(_q + 4) % 4]
def _ce_pow_real_part(_v):
    if isinstance(_v, complex):
        return _v.real if _v.imag == 0 else None
    return float(_v)
def _ce_pow(_x, _y, _f=None):
    if np.ndim(_x) == 0 and np.ndim(_y) == 0:
        _xr = _ce_pow_real_part(_x)
        _yr = _ce_pow_real_part(_y)
        if _xr is not None and _yr is not None:
            _r = _ce_pow_real(_xr, _yr)
            if _r is not None:
                return _r
            if _xr < 0 and math.isfinite(_xr) and math.isfinite(_yr) and _yr != math.floor(_yr):
                _m = float(np.power(-_xr, _yr))
                _c, _s = _ce_cos_sin_pi(_yr)
                return complex(0.0 if _c == 0 else _m * _c, 0.0 if _s == 0 else _m * _s)
        return _x ** _y if _f is None else _f(_x, _y)
    _xa, _ya = np.broadcast_arrays(np.asarray(_x), np.asarray(_y))
    _r = np.array(_xa ** _ya if _f is None else _f(_xa, _ya), copy=True)
    _m = (np.real(_xa) < 0) & (np.imag(_xa) == 0) & (np.imag(_ya) == 0)
    for _i in zip(*np.nonzero(_m)):
        _v = _ce_pow_real(float(np.real(_xa[_i])), float(np.real(_ya[_i])))
        if _v is not None:
            _r[_i] = _v
    return _r
`}function $o(e,n,t,r,o=1){let[i,s]=t,a=h=>typeof n=="string"?`${n}(${h})`:n(h);if(i==null)throw new Error(`Could not compile \`${e}\`: no argument`);if(s==null)return a(r(i));let u=o===1?"_ce_q":"(_ce_q * 2)",l=o===1?"np.round(_ce_q)":"(np.round(_ce_q * 2) / 2)",c="__import__('fractions').Fraction",d=`(lambda _ce_q: (lambda _ce_n: np.where(_ce_n & (${`np.vectorize(lambda _ce_a, _ce_b, _ce_r: ${c}(repr(float(_ce_a))) == ${c}(float(_ce_r)) * ${c}(repr(float(_ce_b))), otypes=[bool])(_ce_x, _ce_k, ${l})`} if np.any(_ce_n) else False), ${l}, _ce_q))(np.isfinite(_ce_q) & (np.abs(${u} - np.round(${u})) <= 8.881784197001252e-16 * np.abs(${u}))))(np.where((_ce_x / _ce_k == 0) & (_ce_x != 0) & np.isfinite(_ce_k), np.sign(_ce_x) * 5e-324, _ce_x / _ce_k))`;return`(lambda _ce_x, _ce_k: np.where(np.isinf(_ce_x / _ce_k) & np.isfinite(_ce_x) & (_ce_k != 0), _ce_x, ${a(d)} * _ce_k))(np.asarray(${r(i)}, dtype=float), np.abs(${r(s)}))`}var Oc=`def _ce_smoothstep(_e0, _e1, _x):
    _e0 = np.asarray(_e0, dtype=float)
    _e1 = np.asarray(_e1, dtype=float)
    _x = np.asarray(_x, dtype=float)
    with np.errstate(divide='ignore', invalid='ignore'):
        _t = np.clip((_x - _e0) / (_e1 - _e0), 0.0, 1.0)
    _r = np.where(_e0 == _e1, np.where(_x < _e0, 0.0, 1.0), _t * _t * (3.0 - 2.0 * _t))
    _r = np.where(np.isnan(_e0) | np.isnan(_e1) | np.isnan(_x), np.nan, _r)
    return _r[()]`,Mc=`def _ce_round(_x, _ties):
    _a = np.abs(_x)
    _m = np.floor(_a)
    _d = _a - _m
    if _ties == 'away-from-zero':
        _away = True
    elif _ties == 'toward-zero':
        _away = False
    elif _ties == 'toward-positive-infinity':
        _away = np.greater(_x, 0)
    else:
        _away = np.less(_x, 0)
    return np.sign(_x) * (_m + np.logical_or(_d > 0.5, np.logical_and(_d == 0.5, _away)))
`;function Ds(e,n){return n==="to-even"?`np.round(${e})`:Jn?`(lambda _x: (lambda _a: (lambda _m: np.sign(_x) * (_m + np.logical_or(_a - _m > 0.5, np.logical_and(_a - _m == 0.5, ${{"away-from-zero":"True","toward-zero":"False","toward-positive-infinity":"np.greater(_x, 0)","toward-negative-infinity":"np.less(_x, 0)"}[n]}))))(np.floor(_a)))(np.abs(_x)))(${e})`:`_ce_round(${e}, '${n}')`}var tc="9007199254740991.0";function js(e){return`(np.any(np.asarray(${e}) > ${tc}) or np.any(np.asarray(${e}) < -${tc}))`}var Uc="np.asarray(_a).dtype.kind == 'f' or np.asarray(_b).dtype.kind == 'f' or np.result_type(_a if np.isscalar(_a) else np.asarray(_a), _b if np.isscalar(_b) else np.asarray(_b)).kind == 'f'";function Bc(e,n){return`${e} + ': ' + str(${n}) + ' is beyond the safe integer range of compiled code (+/-9007199254740991); evaluate with the interpreter for the exact result'`}var Dc=`def _ce_int_operands(_op, _all, _a, _b):
    _all = _all or ${Uc}
    for _x in (_a, _b):
        if _all and ${js("_x")}:
            raise ValueError(${Bc("_op","_x")})
    return (_a, _b)
def _ce_remainder(_a, _b):
    _ce_int_operands('Remainder', True, _a, _b)
    _q = _a / _b
    _m = np.floor(np.abs(_q))
    _d = np.abs(_q) - _m
    return _a - _b * (np.sign(_q) * (_m + np.logical_or(_d > 0.5, np.logical_and(_d == 0.5, np.greater(_q, 0)))))`;function rc(e,n,t,r){let o=r(n),i=r(t),s=d=>B(d)&&!d.isComplex&&!sa(d.re);if(e==="Mod"&&s(n)&&s(t))return`np.mod(${o}, ${i})`;if(!Jn)return e==="Mod"?`np.mod(*_ce_int_operands('Mod', False, ${o}, ${i}))`:`_ce_remainder(${o}, ${i})`;let a=d=>`(_ for _ in ()).throw(ValueError(${Bc(`'${e}'`,d)}))`,u=d=>e==="Mod"?`_f and ${js(d)}`:js(d),l=e==="Mod"?"np.mod(_a, _b)":`(_a - _b * ${Ds("_a / _b","toward-positive-infinity")})`,c=`${a("_a")} if ${u("_a")} else ${a("_b")} if ${u("_b")} else ${l}`;return`(lambda _a, _b: ${e==="Mod"?`(lambda _f: ${c})(${Uc})`:c})(${o}, ${i})`}var jc=`def _ce_ord(_f, _a, _b):
    def _ce_ord_len(_x):
        if isinstance(_x, np.ndarray):
            return len(_x) if _x.ndim > 0 else None
        if isinstance(_x, (list, tuple)):
            return len(_x)
        return None
    _la = _ce_ord_len(_a)
    _lb = _ce_ord_len(_b)
    if _la is not None and _lb is not None and _la != _lb:
        raise ValueError('incompatible dimensions')
    return _f(_a, _b)
`,Vc=`def _ce_listpos(_op, _n, _i):
    if isinstance(_i, (bool, np.bool_)) or not isinstance(_i, (int, float, np.integer, np.floating)) or not float(_i).is_integer():
        raise IndexError(_op + ': the index is not an integer at run time')
    _k = int(_i)
    if _k == 0 or _k > _n or _k < -_n:
        raise IndexError(_op + ': the index ' + str(_k) + ' is not a position of the list at run time')
    return _k - 1 if _k > 0 else _n + _k
def _ce_listcopy(_op, _l):
    if isinstance(_l, str):
        raise TypeError(_op + ': the operand is a string at run time, and this target cannot split a string into characters')
    return list(_l)
def _ce_replaceat(_l, _i, _v):
    _o = _ce_listcopy('ReplaceAt', _l)
    _o[_ce_listpos('ReplaceAt', len(_o), _i)] = _v
    return _o
def _ce_deleteat(_l, _i):
    _o = _ce_listcopy('DeleteAt', _l)
    del _o[_ce_listpos('DeleteAt', len(_o), _i)]
    return _o
def _ce_insert(_l, _i, _v):
    _o = _ce_listcopy('Insert', _l)
    _o.insert(_ce_listpos('Insert', len(_o) + 1, _i), _v)
    return _o
def _ce_replaceat_inplace(_l, *_u):
    if isinstance(_l, str):
        _l = _ce_listcopy('ReplaceAt', _l)
    for _k in range(0, len(_u), 2):
        _l[_ce_listpos('ReplaceAt', len(_l), _u[_k])] = _u[_k + 1]
    return _l
def _ce_owned_copy(_x):
    return _x if isinstance(_x, str) else _ce_listcopy('Fold', _x)
`,Is=new WeakSet,qc=`def _ce_predicate(_f, _kind, _mode):
    def _p(_x):
        _v = _f(_x)
        if isinstance(_v, (bool, np.bool_)):
            return bool(_v)
        if _mode == 'prefix':
            return False
        _absent = _v is None or (isinstance(_v, (float, np.floating)) and _v != _v)
        if _absent:
            return False
        raise TypeError(_kind + ' predicate must return "True" or "False"')
    return _p
`,Hc=`import math
import scipy.special
_ce_ug_zc = [float(scipy.special.zetac(_k)) / _k for _k in range(2, 48)]
def _ce_ug_cf(_s, _z):
    _b = _z + 1 - _s
    _c = 1e300
    _d = 1 / _b
    _h = _d
    _n = 0
    for _i in range(1, 5001):
        _an = -_i * (_i - _s)
        _b += 2
        _d = _an * _d + _b
        if abs(_d) < 1e-300:
            _d = 1e-300
        _c = _b + _an / _c
        if abs(_c) < 1e-300:
            _c = 1e-300
        _d = 1 / _d
        _e = _d * _c
        _h *= _e
        _n = _n + 1 if abs(_e - 1) < 8.881784197001252e-16 else 0
        if _n >= 3:
            return _h
    return math.nan
def _ce_ug_h(_s, _z):
    if _z >= 1 or _s > 0.5 or _s < -4096:
        return _ce_ug_cf(_s, _z)
    _m = round(-_s)
    _a = _s + _m
    if abs(_a) < 1e-200:
        _h = float(scipy.special.exp1(_z)) * math.exp(_z)
    else:
        _l = -0.5772156649015329 * _a + (_a - math.log1p(_a))
        _p = -_a
        for _c in _ce_ug_zc:
            _p *= -_a
            _l += _c * _p
        _t = 1.0
        _sum = 0.0
        for _k in range(1, 200):
            _t *= -_z / _k
            _d = _t / (_a + _k)
            _sum += _d
            if abs(_d) < 1e-17 * abs(_sum):
                break
        _h = math.exp(_z) * (math.expm1(_l - _a * math.log(_z)) / _a - _sum)
    for _k in range(_m):
        _h = (1 - _z * _h) / (1 - _a)
        _a -= 1
    return _h
def _ce_ug1(_s, _z, _reg):
    if math.isnan(_s) or math.isnan(_z):
        return math.nan
    if math.isinf(_s):
        if math.isinf(_z) or (_s < 0 and (_reg or _z <= 0)):
            return math.nan
        if _reg:
            return 1.0
        if _z < 0:
            return math.nan
        return math.inf if _s > 0 or _z < 1 else 0.0
    if _z < 0:
        return math.nan
    _int = _s <= 0 and _s == math.floor(_s)
    if _reg and _int:
        return 0.0 if _z > 0 else math.nan
    if _z == 0:
        if _s > 0:
            return 1.0 if _reg else float(scipy.special.gamma(_s))
        if _reg:
            return math.copysign(math.inf, scipy.special.gammasgn(_s))
        return math.inf if _int else float(scipy.special.gamma(_s))
    if _z == math.inf:
        return math.copysign(0.0, scipy.special.gammasgn(_s)) if _reg else 0.0
    if _s > 0.5 and not _reg:
        _q = float(scipy.special.gammaincc(_s, _z))
        if _q > 1e-300 and _z < _s + 1:
            return float(np.exp(scipy.special.gammaln(_s) + math.log(_q)))
    _h = _ce_ug_h(_s, _z)
    if not _h > 0:
        return math.nan
    _lg = _s * math.log(_z) - _z + math.log(_h)
    _g = float(_h * np.power(_z, _s) * np.exp(-_z))
    if not 2.2250738585072014e-308 <= _g < math.inf:
        _g = math.nan
    if not _reg:
        return _g if _g == _g else float(np.exp(_lg))
    _G = float(scipy.special.gamma(_s))
    if _g == _g and 2.2250738585072014e-308 <= abs(_G) < math.inf:
        return _g / _G
    _lG = scipy.special.gammaln(_s) if abs(_s) > 1e-300 else -math.log(abs(_s))
    return float(scipy.special.gammasgn(_s) * np.exp(_lg - _lG))
def _ce_ugamma(_s, _z, _reg):
    _s = np.asarray(_s)
    _z = np.asarray(_z)
    _nr = (np.imag(_s) != 0) | (np.imag(_z) != 0)
    with np.errstate(all='ignore'):
        _s, _z = np.broadcast_arrays(np.asarray(np.real(_s), dtype=float), np.asarray(np.real(_z), dtype=float))
        _nr = np.broadcast_to(_nr, _s.shape)
        _q = scipy.special.gammaincc(_s, _z)
        _r = np.array(_q if _reg else _q * scipy.special.gamma(_s), dtype=float)
        _slow = ~(_s >= 1e-20) | np.isinf(_s)
        if not _reg:
            _slow = _slow | ((_z > 0) & ~((_q > 1e-300) & (np.abs(_r) < np.inf)))
        for _i in np.flatnonzero(_slow & ~_nr):
            _r.flat[_i] = _ce_ug1(float(_s.flat[_i]), float(_z.flat[_i]), _reg)
        _r[_nr] = np.nan
    return _r[()]
`;function oc(e){let n=e;return(n.includes("_ce_cplx(")||n.includes("_ce_cisreal(")||n.includes("_ce_creal(")||n.includes("_ce_creal_elems("))&&(n=`${kc}
${n}`),n.includes("_ce_rref(")&&(n=`${zc}
${n}`),n.includes("_ce_bcast(")&&(n=`${Lc}
${n}`),n.includes("_ce_eqcoll(")&&(n=`${Fc}
${n}`),n.includes("_ce_indexof(")&&(n=`${Nc}
${n}`),n.includes("_ce_ord(")&&(n=`${jc}
${n}`),n.includes("_ce_round(")&&(n=`${Mc}
${n}`),(n.includes("_ce_smoothstep(")||n.includes("_ce_bcast('smoothstep'"))&&(n=`${Oc}
${n}`),(n.includes("_ce_int_operands(")||n.includes("_ce_remainder("))&&(n=`${Dc}
${n}`),n.includes("_ce_pow(")&&(n=`${Ic()}
${n}`),/_ce_(replaceat|replaceat_inplace|owned_copy|deleteat|insert)\(/.test(n)&&(n=`${Vc}
${n}`),n.includes("_ce_predicate(")&&(n=`${qc}
${n}`),n.includes("_ce_ugamma(")&&(n=`${Hc}
${n}`),n}function Kd(e,n){let t=n.includes(`
`);if(!t&&!/\breturn\b/.test(n.replace(/"(?:[^"\\]|\\.)*"/g,'""')))return;let r=(t?n.split(`
`)[0]:n).trim();throw new Error(`Could not compile ${Qe(e)}: this route emits a single Python EXPRESSION, but the body lowers to ${t?"a statement sequence":"a bare `return` statement"} (\`${r}${t?"\u2026":""}\`). Python has no expression-level block, and \`return\`/\`for\`/\`while\` are statements, so there is no valid emission for this position. Compile a statement body with compileFunction() instead \u2014 that route emits a \`def\`.`)}function Vs(e,n){let t=Bn(n);if(t!==void 0)throw new Error(`Could not compile ${Qe(e)}: this route emits a single Python EXPRESSION, but the body `+(t==="Assign"?"is an assignment. Python assignment is a STATEMENT (this target does not emit the walrus operator), so the emitted `s = x` is not valid in an expression position.":"is a declaration. Python has no declaration statement, so this target emits the EMPTY string for it \u2014 the declared name and its initializer would be silently DROPPED.")+" Give the block a VALUE statement (`Block(s \u2254 x; s)`) and compile it with compileFunction() instead \u2014 that route emits a `def`.")}function Xd(e,n){if(Wc(e,n),Ba(n))return;let t=Bn(n);if(t!==void 0)throw Zd(e,t)}function Wc(e,n,t=!1){let r=t?Hs:Gn,o=n;for(;_(o,"Block")&&o.ops.length>0;)o=o.ops[o.ops.length-1];if(o=f.tailValue(o,!0),_(o,"If")&&(r(o.ops[1])||r(o.ops[2])))throw new Error(`Could not compile ${Qe(e)}: the body's value statement is a selection whose branches are statements, which Python writes as an \`if:\`/\`else:\` block \u2014 and a block cannot be returned, so this route would emit \`return if \u2026:\`. Give the block a VALUE statement (\`Block(If(c, r \u2254 1, r \u2254 2); r)\`), which compiles to the \`if\` block followed by \`return r\`.`);if(t&&_(o,"If")){let i=Ro(o);if(i.has("control")&&i.has("value"))throw new Error(`Could not compile ${Qe(e)}: the body's value statement is a selection that mixes a control-flow branch (\`Break\`, \`Continue\` or a loop) with a value branch. Python writes such a selection as an \`if:\`/\`else:\` block, which has no value, so the value of the other branch would be lost.`)}}function Zd(e,n){return new Error(`Could not compile ${Qe(e)}: the body's value statement is `+(n==="Assign"?"an assignment":"a declaration (which this target emits as nothing at all)")+`, and a Python statement cannot be returned \u2014 this route would emit \`return ${n==="Assign"?"s = x":""}\`, which does not parse. Give the block a VALUE statement (\`Block(s \u2254 x; s)\`), which compiles to \`def f(x):\\n    s = x\\n    return s\`.`)}function ic(e,n,t,r,o){let i=t.length===1?"float('nan')":"None",s=!1,a=t.map(l=>sn(l)?`${e}(${r(l)})`:Xc(l)||ra(l.type.type)?(s=!0,`(lambda _v: ${i} if np.size(_v) == 0 else ${e}(_v))(${r(l)})`):r(l));if(a.length===0)return e==="np.max"?"-np.inf":"np.inf";if(a.length>1&&s)return`(lambda _ys: float('nan') if len(_ys) == 0 else ${e}(_ys))([_y for _y in (${a.join(", ")}) if _y is not None])`;if(a.length===1&&!sn(t[0]))return Pc(t[0],a[0],o);let u=a[0];for(let l=1;l<a.length;l++)u=`${n}(${u}, ${a[l]})`;return u}function sc(e,n,t){if(e[0]==null)throw new Error("Could not compile `Transpose`: missing argument");let r=t?`${t}(${n(e[0])})`:n(e[0]);if(e.length<3)return`np.transpose(${r})`;if(e.length>3||e[1]==null||e[2]==null)throw new Error("Could not compile `Transpose`: only the (value) and (value, axis1, axis2) forms compile.");return`np.swapaxes(${r}, int(${n(e[1])}) - 1, int(${n(e[2])}) - 1)`}function ac(e,n){if(n!==void 0&&(hr(f.collectionElementTypeOf(n))||Rt(n.type.type,!1)))throw new Error(`Could not compile \`${e}\`: a built-in fold over elements that are collections. The interpreter evaluates it instead.`)}var lc={"np.mean":"Mean","np.median":"Median","np.var":"Variance","np.std":"StandardDeviation"};function vo(e,n,t,r=""){if(n.length===0||n[0]==null)throw new Error(`Could not compile \`${e}\`: no argument`);let o=n.length===1?n[0]:void 0;if(o!==void 0&&!hr(On(Y(o.type.type)))&&!Rt(o.type.type,!0)&&Rt(o.type.type,!1)){let s=lc[e]??e;return`(lambda _d: ${e}(_d${r}) if np.ndim(_d) <= 1 else (_ for _ in ()).throw(TypeError('${s}: an element of the data is a list at run time')))(${t(o)})`}if(n.some(s=>hr(On(Y(s.type.type)))||Rt(s.type.type,!1)))throw new Error(`Could not compile \`${lc[e]??e}\`: an element of the data is a collection (a list, a string, a set or a dictionary). The interpreter evaluates it instead.`);if(n.length===1)return`${e}(${t(n[0])}${r})`;let i=n.map(s=>sn(s)?`*${t(s)}`:t(s));return`${e}([${i.join(", ")}]${r})`}function Eo(e,n,t,r){if(n.length<2)throw new Error(`Could not compile \`${e}\`: expected at least two operands`);if(vc(r,n),ir(r,n),Fd(r,n),Id(r,n),n.length===2)return`_ce_ord(${e}, ${t(n[0])}, ${t(n[1])})`;let o=n.map((s,a)=>`_r${a}`),i=`_ce_ord(${e}, ${o[0]}, ${o[1]})`;for(let s=1;s<n.length-1;s++)i=`np.logical_and(${i}, _ce_ord(${e}, ${o[s]}, ${o[s+1]}))`;return`(lambda ${o.join(", ")}: ${i})(${n.map(s=>t(s)).join(", ")})`}function uc(e,n,t,r){if(t.length===0||t[0]==null)throw new Error(`Could not compile \`${n}\`: no operand`);Yc(e,t,"list<boolean>");let o=r(t[0]);for(let i=1;i<t.length;i++)o=`_ce_ord(${n}, ${o}, ${r(t[i])})`;return o}var Jd=new Set(["Not","Argument"]);function Yc(e,n,t){n.forEach((r,o)=>{let i=Y(r.type.type);if(!(i!=="never"&&D(i,"boolean"))&&!(i!=="never"&&!it(r)&&D(i,t)))throw new Error(`Could not compile \`${e}\`: operand ${o+1} has the type \`${r.type.toString()}\`. A logical connective over a collection compiles only when every operand is a boolean or a collection of the type \`${t}\`. The interpreter evaluates it instead.`)})}function pc(e,n,t){if(n.length===0)return"[]";let r=n.findIndex(i=>C(i,"Missing"));if(r>=0)throw new Error(`Could not compile \`${e}\`: operand ${r+1} is absent, and the interpreter answers \`Missing\` for the whole join. The interpreter evaluates it instead.`);let o=i=>st(i)||!Le(Y(i.type.type),wn);return`[${n.map((i,s)=>o(i)?t(i):`*${Z(e,i,t,s+1)}`).join(", ")}]`}function Z(e,n,t,r){if(n&&n.type.matches("string"))throw new Error(`Could not compile \`${e}\`: a string collection \u2014 a string's elements are UAX #29 grapheme clusters and Python has no stdlib grapheme segmentation, so the emitted code would walk code points instead. The interpreter evaluates it.`);if(n&&ir(e,[n]),n&&Pr(n))throw new Error(`Could not compile \`${e}\`: ${r!==void 0?`operand ${r}`:"the operand"} may be text at run time (type \`${n.type.toString()}\`), and Python has no stdlib grapheme segmentation. The interpreter evaluates it.`);if(!n||!(n.type.matches("list<any>")||n.type.matches("indexed_collection<any>")))throw new Error(`Could not compile \`${e}\`: ${r!==void 0?`operand ${r}`:"operand"} is not an indexed collection (list/vector/range).`);return t(n)}function Qd(e){let n=an(Y(e.type.type));return Ys(ta(n))}function Ys(e){let n=e===void 0?void 0:an(Y(e)),t=n!==void 0&&typeof n!="string"&&n.kind==="union"&&!D(n,"number")&&n.types.some(o=>{let i=Y(o);return i==="unknown"||i==="any"||D(i,"number")});if(n!==void 0&&!t&&n!=="unknown"&&n!=="any"&&n!=="never"){if(D(n,"number"))return"float('nan')";let o=da(n);return o!==void 0?`(${Array.from({length:o},()=>"float('nan')").join(", ")}${o===1?",":""})`:"None"}return`((lambda _c: float('nan') if len(_c) > 0 and all(isinstance(_x, (int, float, complex, np.number)) and not isinstance(_x, (bool, np.bool_)) for _x in _c) else None)([_x for _x in ${t?"list(_l)":"list(_l)[:10]"} if _x is not None]) if isinstance(_l, (list, tuple, np.ndarray)) else None)`}function Kc(e,n){let t=Qd(e);if(n===void 0||!Number.isInteger(n)||n===0)return{absent:t,outOfRange:t};let r=Y(e.type.type),o=sl(r,n),i=o===void 0?t:Ys(o),s=Y(an(r)),a=typeof s!="string"&&s.kind==="tuple";return{absent:al(e,n)?"float('nan')":a?"None":t,outOfRange:i}}function Co(e,n,t,r){let o;if(n!==void 0&&ko(n.type.type)){let u=an(Y(n.type.type));u==="never"||D(u,"string")||!D(u,In)||Pr(n)?o=Z(e,n,r):(ir(e,[n]),o=r(n))}else o=Z(e,n,r);let{absent:i,outOfRange:s}=Kc(n,t<0?t:t+1),a=t<0?`_l[${t}] if len(_l) >= ${-t}`:`_l[${t}] if len(_l) > ${t}`;return`(lambda _l: ${i} if _l is None else (${a} else ${s}))(${o})`}function Xc(e){let n=Y(e.type.type);return n==="unknown"||n==="any"||n==="value"||n==="string"?!1:typeof n=="object"&&n.kind==="union"?n.types.some(t=>D(t,In)):D(n,In)}function em(e){let n=t=>{let r=Y(t);return typeof r=="string"?!1:r.kind==="broadcastable"?!0:r.kind==="union"&&r.types.some(n)};return n(e.type.type)}function nm(e){return D(Y(e.type.type),"number")}function $e(e,n,t,r=[],o){f.assertCallbackAnnotations(e,n,r);let i=wl[e];if(i!==void 0&&n!==void 0&&$l(e,n)){if(i==="select"){let s=lr(Y(n.type.type));if(s===void 0||Le(s,"nan"))throw new Error(`Could not compile \`${e}\` to Python: the predicate may return \`NaN\``+(s===void 0?"":` (its result type is \`${Pe(s)}\`)`)+", which this target cannot tell apart from the absent value `Missing`. The interpreter reports `NaN` as a predicate result that is not a boolean, and skips `Missing`. The interpreter evaluates it instead.")}return`_ce_predicate(${cc(e,n,t,r,o)}, '${e}', '${i}')`}return cc(e,n,t,r,o)}function cc(e,n,t,r,o){return f.withCheckedCallback(e,n,r,void 0,()=>(tm(e,n,r),rm(e,n,t)),o)}function qs(e,n=new Set){if(n.has(e)||(n.add(e),f.isNominalAtomicType(e)))return!1;let t=Y(e);return t==="unknown"||t==="any"||t==="value"||t==="expression"||t==="never"||D(t,"string")?!1:typeof t!="string"&&t.kind==="union"?t.types.some(r=>qs(r,n)):D(t,"collection")}function tm(e,n,t){let r=n&&(Uo(n)??n);if(!r||!_(r,"Function"))return;let o=r.ops.slice(1),i=Y(r.type.type),s=typeof i!="string"&&i.kind==="signature"?i.args:void 0,a;for(let[u,l]of t.entries()){let c=o[u];if(c===void 0)break;if(l===void 0||!qs(l))continue;let p=pr(c),d=p!==void 0&&Fo(p),h=s?.[u]?.type,g=(p===void 0||p==="unknown")&&(h===void 0||!qs(h));if(!d&&!g)continue;let y=Be(c);if(a??=Bo(r.ops[0]),!(!y||!a.has(y)))throw d?new Error(`Could not compile \`${e}\`: parameter ${u+1} of the function receives a value of the type \`${Pe(l)}\`, which can be a collection, and it is declared \`${Pe(p)}\`. The interpreter binds the collection whole and maps each element-wise operator of the body over it. The Python lambda reads the parameter as a scalar, and the Python operators repeat or concatenate a list. Declare the parameter with a collection type (for example \`list<number>\`).`):new Error(`Could not compile \`${e}\`: parameter ${u+1} of the function receives a value of the type \`${Pe(l)}\`, which can be a collection, but the function is compiled with this parameter read as a scalar`+(h===void 0?"":` (its type is \`${Pe(h)}\`)`)+". The Python operators repeat or concatenate a list where the interpreter maps over it. The interpreter evaluates it instead.")}}function rm(e,n,t){let r=n&&(Uo(n)??n);if(r&&_(r,"Function"))return t(r);if(r&&C(r)){let o={Add:"+",Subtract:"-",Multiply:"*",Divide:"/"}[r.symbol];if(o!==void 0)return`(lambda _a, _b: _a ${o} _b)`}throw new Error(`Could not compile \`${e}\`: the function operand has no Python form (only function literals and binary arithmetic operator symbols lower to a Python lambda).`)}function om(e,n){let t=f.compile(e,n);return e.type.matches("boolean")?t:`(lambda _g: isinstance(_g, (bool, np.bool_)) and bool(_g))(${t})`}var Nn=e=>f.isAtomicSource(e)?e:`(${e})`;function fc(e,n){let t=e.filter(o=>o!==void 0&&!Zc(o,n)),r=(t.length>0?t:e).flatMap(o=>o===void 0?[]:[o.type.type]);return f.absenceKind(r,n)==="object"?"None":"float('nan')"}function Zc(e,n){return C(e,"Missing")?n.boundVars?.has(e.symbol)!==!0&&n.varsKeys?.has(e.symbol)!==!0:!1}function Os(e,n,t,r){return t==="None"&&Zc(e,r)?"None":n()}function dc(e,n,t,r){return`((${n}) if (${r(e)}) else (${t}))`}function Gn(e){if(e===void 0)return!1;if(Bn(e)==="Assign")return!0;if(!_(e))return!1;let n=e.operator;return n==="Break"||n==="Continue"||n==="Return"||n==="Loop"?!0:n==="Block"?e.ops.length!==1||Gn(e.ops[0]):n==="If"?Gn(e.ops[1])||Gn(e.ops[2]):!1}function Hs(e){if(!Gn(e))return!1;let n=e;for(;_(n,"Block")&&n.ops.length>0;)n=n.ops[n.ops.length-1];return _(n,"If")?Hs(n.ops[1])||Hs(n.ops[2]):!(_(n)&&["Break","Continue","Return","Loop"].includes(n.operator))}function Ro(e,n=new Set){return e===void 0||C(e,"Nothing")?n:_(e,"Block")?(e.ops.length>0&&Ro(e.ops[e.ops.length-1],n),n):_(e,"If")?(Ro(e.ops[1],n),Ro(e.ops[2],n),n):(_(e)&&["Break","Continue","Loop"].includes(e.operator)?n.add("control"):n.add("value"),n)}function Jc(e,n,t){let r=e[0];if(r===void 0||e[1]===void 0)throw new Error("Could not compile `If`: wrong number of arguments");let o=l=>f.withCseScope(t,l,n,()=>Ao(e[l],n)),i=l=>f.compileOp(t,0,n,0,l),s=(l,c)=>`${l}
${Po(c)}`,a=e.length>2&&e[2]!==void 0,u=s(`if ${i(r)}:`,o(1));return a?`${u}
${s("else:",o(2))}`:u}function mc([e,n],t,r){let o=r?"GammaRegularized":"Gamma";if(e==null||n==null)throw new Error(`Could not compile \`${o}\`: missing argument`);if(!r){let u=[e,n].find(l=>f.isProvablyNonReal(l));if(u!==void 0)throw new un({code:"non-real-operand",kind:"capability",message:`Could not compile \`Gamma\`: the operand \`${u.toString()}\` is certainly not a real number, and this target's lowering of the upper incomplete gamma is real-only.`})}let i=t(e),s=t(n),a=X(e);if(a!==void 0){if(r&&a>=1e-20)return`scipy.special.gammaincc(${i}, ${s})`;if(!r&&Jn&&a>=25e-5&&a<=7.5)return`(scipy.special.gammaincc(${i}, ${s}) * scipy.special.gamma(${i}))`}return`_ce_ugamma(${i}, ${s}, ${r?"True":"False"})`}function im(e,n,t,r,o){let i=n.isCollection===!0||n.type.matches("collection<any>");if(i?n.type.matches("collection<real>"):!f.isComplexValued(n))return`${e}(${r(n)})`;let s=f.tempVar(o);return i?`(lambda ${s}: ${e}(_ce_creal_elems(${s})))(${r(n)})`:`(lambda ${s}: (${e}(_ce_creal(${s})) if _ce_cisreal(${s}) else ${t(s)}))(${r(n)})`}var sm={__proto__:null,Arcsin:{fn:"asin",cut:"real"},Arccos:{fn:"acos",cut:"real"},Arctan:{fn:"atan",cut:"atan"},Arsinh:{fn:"asinh",cut:"asinh"},Arcosh:{fn:"acosh",cut:"above"},Artanh:{fn:"atanh",cut:"real"},Arccsc:{fn:"asin",cut:"real",at0:"complex(float('nan'), float('nan'))"},Arcsec:{fn:"acos",cut:"real",at0:"complex(float('nan'), float('nan'))"},Arccot:{fn:"atan",cut:"atan"},Arcsch:{fn:"asinh",cut:"asinh",at0:"complex(float('nan'), float('nan'))"},Arsech:{fn:"acosh",cut:"above",at0:"complex(float('inf'), 0.0)"},Arcoth:{fn:"atanh",cut:"real",at0:"complex(0.0, np.pi / 2)"}};function Me(e,n){return(t,r,o)=>{let i=t[0];if(i==null)throw new Error(`Could not compile \`${e}\`: no argument`);let s=i.isCollection===!0||i.type.matches("collection<any>");if(s?i.type.matches("collection<real>"):!f.isComplexValued(i))return typeof n=="string"?`${n}(${r(i)})`:n(t,r,o);let{fn:a,cut:u,at0:l}=sm[e],c=l!==void 0||e==="Arccot",p=(g,y)=>{let w=u==="real"?`(complex(${g}.real, -0.0 if ${g}.real > 0 else 0.0) if ${y}.imag == 0 else ${g})`:u==="above"?`(complex(${g}.real, 0.0) if ${y}.imag == 0 else ${g})`:`(complex(-0.0 if ${g}.imag < 0 else 0.0, ${g}.imag) if ${y}.real == 0 else ${g})`,x=`cmath.${a}(${w})`;return a==="atanh"?`(complex(${g}.real * float('inf'), 0.0) if ${g}.imag == 0 and abs(${g}.real) == 1 else ${x})`:a==="atan"?`(complex(float('inf'), float('inf')) if ${g}.real == 0 and abs(${g}.imag) == 1 else ${x})`:x},d=f.tempVar(o),h;if(!c)h=`lambda ${d}: ${p(d,d)}`;else{let g=f.tempVar(o),y=`(lambda ${g}: ${p(g,d)})(1 / ${d})`,w=e==="Arccot"?`complex(cmath.phase(complex(${d}.real, 1.0)), 0.0) if ${d}.imag == 0`:`${l} if ${d} == 0`;h=`lambda ${d}: ${w} else ${y}`}return s?`np.vectorize(${h}, otypes=[complex])(${r(i)})`:`(${h})(${r(i)})`}}function am(e,n,t){if(!_(e,"Function"))return;let r=e.ops.slice(1),o;for(let[i,s]of n.entries()){let a=r[i];if(a===void 0)break;if(s.isCollection!==!0&&!yr(s)||f.isNominalAtomicType(s.type.type))continue;let u=fa(s),l=Go(s)||u,c=pr(a)??"unknown";if(u&&c!=="never"&&D(Y(c),"string"))continue;let p=ua(c);if(!p&&!Fo(c))continue;let d=Be(a);if((t||!p||l)&&(o??=Bo(e.ops[0]),!d||!o.has(d)))continue;if(u)throw new Error(`Could not compile \`${t?"ApplyWhole":"Apply"}\`: argument ${i+1} is a string, and the body reads the parameter \`${d}\`, which is not declared \`string\`: the Python operators \`*\` and \`+\` repeat or concatenate a string where the interpreter does not. Declare the parameter \`string\`.`);let h=p&&!t&&!l?"the interpreter maps the function over the elements of the collection, and the Python target has no such map for a function literal":`the body reads the parameter \`${d}\` as a scalar, while the interpreter binds the collection whole and maps each element-wise operator over it (the Python operators repeat or concatenate a list)`;throw new Error(`Could not compile \`${t?"ApplyWhole":"Apply"}\`: argument ${i+1} has the type \`${s.type.toString()}\`, which can be a collection, and its parameter is not declared with a collection type: ${h}. Declare the parameter with a collection type (for example \`list<number>\`).`)}}function Qc(e,n,t,r){let o=t?"ApplyWhole":"Apply";if(e[0]==null)throw new Error(`Could not compile \`${o}\`: missing function`);if(_(e[0],"Function")){n=f.checkedAppliedLiteralCompile(e[0],e.slice(1),n);let s=e[0],a=t?void 0:f.appliedLiteralNamedPointCall(s,e.slice(1),e.slice(1).map(l=>n(l)),n,()=>n(s),r);if(a!==void 0)return a;let u=t?void 0:f.appliedLiteralPointListCall(s,e.slice(1),e.slice(1).map(l=>n(l)),n,()=>n(s),r);if(u!==void 0)return u;if(!t&&s.nops===e.length&&ya(s.type.type)&&e.slice(1).some(l=>(Ha(l,r)??0)>0||Ea(l.type.type)))return f.emitUserFunctionCall(`(${n(s)})`,e.slice(1),r,e.slice(1).map(()=>!1),!0);am(e[0],e.slice(1),t)}let i=n(e[0]);return hl(e,o),`(${i})(${e.slice(1).map(s=>n(s)).join(", ")})`}var Ws={__proto__:null,Add:(e,n)=>e.length===0?"0":e.length===1?n(e[0]):e.map(t=>n(t)).join(" + "),Multiply:(e,n)=>e.length===0?"1":e.length===1?n(e[0]):e.map(t=>Nn(n(t))).join(" * "),Negate:(e,n)=>`(-(${n(e[0])}))`,Divide:(e,n)=>{if(e.length===0)return"1";if(e.length===1)return n(e[0]);if(e.length===2)return`(${n(e[0])}) / (${n(e[1])})`;let t=`(${n(e[0])})`;for(let r=1;r<e.length;r++)t=`${t} / (${n(e[r])})`;return t},Sin:(e,n)=>{if(f.isComplexValued(e[0]))return`cmath.sin(${n(e[0])})`;let t=f.piMultiple(e[0]);return t!==void 0?wo(n(t),"sin"):`np.sin(${n(e[0])})`},Cos:(e,n)=>{if(f.isComplexValued(e[0]))return`cmath.cos(${n(e[0])})`;let t=f.piMultiple(e[0]);return t!==void 0?wo(n(t),"cos"):`np.cos(${n(e[0])})`},Tan:(e,n)=>{if(f.isComplexValued(e[0]))return`cmath.tan(${n(e[0])})`;let t=f.piMultiple(e[0]);return t!==void 0?wo(n(t),"tan"):xo(n(e[0]),"np.tan(_x)")},Arcsin:Me("Arcsin","np.arcsin"),Arccos:Me("Arccos","np.arccos"),Arctan:Me("Arctan","np.arctan"),Arctan2:"np.arctan2",Sinh:(e,n)=>{if(f.isComplexValued(e[0])){let t=f.imaginaryPiMultiple(e[0]);return t!==void 0?wt(n(t),"Sinh"):`cmath.sinh(${n(e[0])})`}return`np.sinh(${n(e[0])})`},Cosh:(e,n)=>{if(f.isComplexValued(e[0])){let t=f.imaginaryPiMultiple(e[0]);return t!==void 0?wt(n(t),"Cosh"):`cmath.cosh(${n(e[0])})`}return`np.cosh(${n(e[0])})`},Tanh:(e,n)=>{if(f.isComplexValued(e[0])){let t=f.imaginaryPiMultiple(e[0]);return t!==void 0?wt(n(t),"Tanh"):`cmath.tanh(${n(e[0])})`}return`np.tanh(${n(e[0])})`},Arsinh:Me("Arsinh","np.arcsinh"),Arcosh:Me("Arcosh","np.arccosh"),Artanh:Me("Artanh","np.arctanh"),Cot:([e],n)=>{if(e===null)throw new Error("Could not compile `Cot`: no argument");return f.isComplexValued(e)?`(np.cos(${n(e)}) / np.sin(${n(e)}))`:xo(n(e),"1 / np.tan(_x)")},Csc:([e],n)=>{if(e===null)throw new Error("Could not compile `Csc`: no argument");return f.isComplexValued(e)?`(1 / np.sin(${n(e)}))`:xo(n(e),"1 / np.sin(_x)")},Sec:([e],n)=>{if(e===null)throw new Error("Could not compile `Sec`: no argument");return f.isComplexValued(e)?`(1 / np.cos(${n(e)}))`:xo(n(e),"1 / np.cos(_x)")},Degrees:([e],n)=>{if(e===null)throw new Error("Could not compile `Degrees`: no argument");return`(${Nn(n(e))} * np.pi / 180)`},Arccot:Me("Arccot",([e],n)=>{if(e===null)throw new Error("Could not compile `Arccot`: no argument");return`(np.pi / 2 - np.arctan(${n(e)}))`}),Arccsc:Me("Arccsc",([e],n)=>{if(e===null)throw new Error("Could not compile `Arccsc`: no argument");return`np.arcsin(1 / (${n(e)}))`}),Arcsec:Me("Arcsec",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsec`: no argument");return`np.arccos(1 / (${n(e)}))`}),Coth:([e],n)=>{if(e===null)throw new Error("Could not compile `Coth`: no argument");let t=f.isComplexValued(e)?f.imaginaryPiMultiple(e):void 0;return t!==void 0?wt(n(t),"Coth"):`(np.cosh(${n(e)}) / np.sinh(${n(e)}))`},Csch:([e],n)=>{if(e===null)throw new Error("Could not compile `Csch`: no argument");let t=f.isComplexValued(e)?f.imaginaryPiMultiple(e):void 0;return t!==void 0?wt(n(t),"Csch"):`(1 / np.sinh(${n(e)}))`},Sech:([e],n)=>{if(e===null)throw new Error("Could not compile `Sech`: no argument");let t=f.isComplexValued(e)?f.imaginaryPiMultiple(e):void 0;return t!==void 0?wt(n(t),"Sech"):`(1 / np.cosh(${n(e)}))`},Arcoth:Me("Arcoth",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcoth`: no argument");return`np.arctanh(1 / (${n(e)}))`}),Arcsch:Me("Arcsch",([e],n)=>{if(e===null)throw new Error("Could not compile `Arcsch`: no argument");return`np.arcsinh(1 / (${n(e)}))`}),Arsech:Me("Arsech",([e],n)=>{if(e===null)throw new Error("Could not compile `Arsech`: no argument");return`np.arccosh(1 / (${n(e)}))`}),Lb:"np.log2",Square:([e],n)=>{if(e===null)throw new Error("Could not compile `Square`: no argument");return`np.square(${n(e)})`},Fract:([e],n)=>{if(e===null)throw new Error("Could not compile `Fract`: no argument");return`np.modf(${n(e)})[0]`},Exp:(e,n)=>f.isComplexValued(e[0])?`cmath.exp(${n(e[0])})`:`np.exp(${n(e[0])})`,Ln:(e,n)=>f.isComplexValued(e[0])?`cmath.log(${n(e[0])})`:f.promotesRadicalToComplex("Ln",e)?`np.emath.log(${n(e[0])})`:`np.log(${n(e[0])})`,Log:(e,n)=>{let t=f.promotesRadicalToComplex("Log",e),r=f.fixedLogBase(e);if(r!==void 0)return t?`np.emath.log${r}(${n(e[0])})`:`np.log${r}(${n(e[0])})`;if(e.length===2){let o=t?"np.emath.log":"np.log";return`(${o}(${n(e[0])}) / ${o}(${n(e[1])}))`}return"np.log10"},Log10:"np.log10",Log2:"np.log2",Exp2:"np.exp2",Power:(e,n,t)=>{if(e.length!==2)return"np.power";let r=f.negativeBaseFloatPower(e),o=!Jn;if(C(e[0],"ExponentialE")){let s=f.eulerPiSplit(e[1]);if(s!==void 0){let a=wo(n(s.u),"exp");return s.a===void 0?a:`(np.exp(${n(s.a)}) * ${a})`}}if(f.isComplexValued(e[0])||f.isComplexValued(e[1]))return r!==void 0&&o?`_ce_pow(${n(e[0])}, ${n(e[1])})`:`(${Nn(n(e[0]))} ** ${Nn(n(e[1]))})`;let i=f.realPowerExponent(e)??(typeof r=="object"?r:void 0);if(i!==void 0){let s=f.tempVar(t),a=`np.power(np.abs(${s}), ${i.value})`,u=i.oddNumerator?`(np.where(${s} < 0, -1.0, 1.0) * ${a})`:a;return`(lambda ${s}: ${u})(${n(e[0])})`}return f.promotesRadicalToComplex("Power",e)?r==="runtime"&&o?`_ce_pow(${n(e[0])}, ${n(e[1])}, np.emath.power)`:`np.emath.power(${n(e[0])}, ${n(e[1])})`:r==="runtime"?o?`_ce_pow(${n(e[0])}, ${n(e[1])})`:`(${Nn(n(e[0]))} ** ${Nn(n(e[1]))})`:`np.power(${n(e[0])}, ${n(e[1])})`},Sqrt:(e,n)=>f.isComplexValued(e[0])?`cmath.sqrt(${n(e[0])})`:f.promotesRadicalToComplex("Sqrt",e)?`np.emath.sqrt(${n(e[0])})`:`np.sqrt(${n(e[0])})`,Root:(e,n)=>{if(e.length!==2)return"np.power";let[t,r]=e;if(f.isComplexValued(t)||f.isComplexValued(r))return`(lambda _z, _n: complex(np.sign(_z.real) * np.power(abs(_z.real), 1.0 / _n.real)) if _z.imag == 0 and _n.imag == 0 and _n.real % 2 == 1 else _z ** (1.0 / _n))(complex(${n(t)}), complex(${n(r)}))`;let o=X(r),i=f.realRootDegreeTerms(r);if(o!==void 0&&(Number.isInteger(o)&&o%2!==0||i?.oddNumerator===!0)){let s=n(t);return`(np.sign(${s}) * np.power(np.abs(${s}), 1.0 / ${n(r)}))`}return o!==void 0&&i!==void 0?`np.power(np.abs(${n(t)}), 1.0 / ${n(r)})`:f.promotesRadicalToComplex("Root",e)?`np.emath.power(${n(t)}, 1.0 / ${n(r)})`:`np.power(${n(t)}, 1.0 / ${n(r)})`},Abs:(e,n)=>f.isComplexValued(e[0])?`abs(${n(e[0])})`:`np.abs(${n(e[0])})`,Sign:(e,n,t)=>im("np.sign",e[0],r=>`${r} / abs(${r})`,n,t),Floor:(e,n)=>$o("Floor","np.floor",e,n),Ceil:(e,n)=>$o("Ceil","np.ceil",e,n),Round:(e,n)=>{let t=e[0];if(t==null)throw new Error("Could not compile `Round`: no argument");let r=t.engine.roundingTies;return e.length<2?Ds(n(t),r):$o("Round",o=>Ds(o,r),e,n,.5)},Truncate:(e,n)=>$o("Truncate","np.trunc",e,n),Min:(e,n,t)=>ic("np.min","np.minimum",e,n,t),Max:(e,n,t)=>ic("np.max","np.maximum",e,n,t),ElementMax:(e,n)=>{if(!e.some(sn)){if(e.length===1)return _(e[0])?`(${n(e[0])})`:n(e[0]);let t=n(e[0]);for(let r=1;r<e.length;r++)t=`np.maximum(${t}, ${n(e[r])})`;return t}return`_ce_bcast('max', ${e.map(t=>n(t)).join(", ")})`},ElementMin:(e,n)=>{if(!e.some(sn)){if(e.length===1)return _(e[0])?`(${n(e[0])})`:n(e[0]);let t=n(e[0]);for(let r=1;r<e.length;r++)t=`np.minimum(${t}, ${n(e[r])})`;return t}return`_ce_bcast('min', ${e.map(t=>n(t)).join(", ")})`},Smoothstep:(e,n)=>e.some(sn)?`_ce_bcast('smoothstep', ${e.map(t=>n(t)).join(", ")})`:`_ce_smoothstep(${e.map(t=>n(t)).join(", ")})`,Clamp:(e,n)=>e.some(sn)?`_ce_bcast('clip', ${n(e[0])}, ${n(e[1])}, ${n(e[2])})`:`np.clip(${n(e[0])}, ${n(e[1])}, ${n(e[2])})`,Mod:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Mod`: missing argument");return B(n)&&n.re===1&&!n.isComplex?`np.mod(${t(e)}, ${t(n)})`:rc("Mod",e,n,t)},Remainder:([e,n],t)=>{if(e===null||n===null)throw new Error("Could not compile `Remainder`: missing argument");return rc("Remainder",e,n,t)},Real:"np.real",Imaginary:"np.imag",Argument:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Argument`: expected one operand");return`np.angle(np.add(${n(e[0])}, 0))`},Conjugate:"np.conj",Sum:(e,n,t)=>Jp("Sum",e,t),Product:(e,n,t)=>Jp("Product",e,t),Mean:(e,n)=>vo("np.mean",e,n),Median:(e,n)=>vo("np.median",e,n),Variance:(e,n)=>vo("np.var",e,n,", ddof=1"),StandardDeviation:(e,n)=>vo("np.std",e,n,", ddof=1"),Covariance:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `Covariance`: expected two collection arguments");return`np.cov(${t(e)}, ${t(n)})[0][1]`},PopulationCovariance:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `PopulationCovariance`: expected two collection arguments");return`np.cov(${t(e)}, ${t(n)}, ddof=0)[0][1]`},Correlation:([e,n],t)=>{if(e==null||n==null)throw new Error("Could not compile `Correlation`: expected two collection arguments");return`np.corrcoef(${t(e)}, ${t(n)})[0][1]`},Dot:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Dot`: missing argument");if(e.some(t=>f.isTupleOfTuples(t)))throw new Error("Could not compile `Dot`: a tuple of tuples is one point with nested coordinates, which the interpreter does not contract; write a list of points or a matrix.");if(e.some(t=>!Go(t)&&Io(t)))throw new Error("Could not compile `Dot`: a list of points has no single numpy spelling \u2014 `np.dot` contracts it as a matrix, but the interpreter answers one inner product per point.");return`np.dot(${n(e[0])}, ${n(e[1])})`},Cross:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Cross`: missing argument");return`np.cross(${n(e[0])}, ${n(e[1])})`},Norm:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Norm`: missing argument");if(Io(e[0]))throw new Error("Could not compile `Norm`: a list of points has no numpy spelling \u2014 `np.linalg.norm` flattens it into one scalar, but the interpreter answers one norm per point.");let t=e[0].type.type;if(ko(t)){let a=On(Y(an(t)));if(a!==void 0&&na(a))throw new Error("Could not compile `Norm`: a list of points that may hold absent points has no numpy spelling \u2014 `np.linalg.norm` flattens it into one scalar, but the interpreter answers one norm per point.")}let r=Wd(e[0]);if(e.length<2)return Re(n(e[0]),void 0,r);let o=e[1],i=qd(e[0]);if(Ue(o)){let a={Infinity:"np.inf",Frobenius:"'fro'"}[o.string];if(a===void 0)throw new Error(`Could not compile \`Norm\`: the norm type "${o.string}" has no numpy spelling.`);return o.string==="Frobenius"&&i!==2?Re(n(e[0]),void 0,r):i===void 0?e[0].type.matches("number")?`np.abs(${n(e[0])})`:Gs(n(e[0]),a,"matrix",r):(ec(i),Re(n(e[0]),a,r))}let s=i===void 0&&e[0].type.matches("number");if(o.isSame(2)){if(i!==void 0&&i>=3)return Re(n(e[0]),void 0,r);if(s)return`np.abs(${n(e[0])})`;if(i===void 0)return Gs(n(e[0]),n(o),"two",r)}else if(!B(o)&&!o.isInfinity){let a=o.type.type;return s?So(n(e[0]),n(o),a,()=>"np.abs(_x) if _p > 0 else float('nan')"):i===void 0?Yd(n(e[0]),n(o),a,r):i>=3?So(n(e[0]),n(o),a,()=>`${Re("_x",void 0,r)} if _p == 2 else float('nan')`):So(n(e[0]),n(o),a,u=>i===1?`${Re("_x","_p",r)} if _p > 0 else float('nan')`:Tc(u,r))}if(B(o)&&!(o.re>0))throw new Error("Could not compile `Norm`: the interpreter defines norms only for a positive order, but `np.linalg.norm` answers a value for this order.");if(i===2&&B(o)&&!o.isSame(1)&&!o.isSame(2)&&!(o.isInfinity&&o.isPositive===!0))throw new Error("Could not compile `Norm`: the interpreter defines matrix norms only for orders 1, 2 and +Infinity \u2014 `np.linalg.norm` would raise or diverge for this order.");if(i===void 0){if(s)return`np.abs(${n(e[0])})`;let a=o.isSame(1)||o.isInfinity===!0&&o.isPositive===!0;return Gs(n(e[0]),n(o),a?"matrix":"vector",r)}return ec(i),Re(n(e[0]),n(o),r)},Determinant:"np.linalg.det",Inverse:"np.linalg.inv",Transpose:(e,n)=>sc(e,n),MatrixMultiply:"np.matmul",ConjugateTranspose:(e,n)=>sc(e,n,"np.conjugate"),Diagonal:"np.diag",MatrixPower:"np.linalg.matrix_power",Rank:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Rank`: missing argument");let t=Yo(e[0]);if(t!==void 0)throw new Error(`Could not compile \`Rank\`: the operand ${t}.`);return`np.ndim(${n(e[0])})`},RowReduce:(e,n)=>`_ce_rref(${n(e[0])})`,Equal:(e,n,t)=>Zp("Equal",e,n,t),NotEqual:(e,n,t)=>Zp("NotEqual",e,n,t),Less:(e,n)=>Eo("np.less",e,n,"Less"),LessEqual:(e,n)=>Eo("np.less_equal",e,n,"LessEqual"),Greater:(e,n)=>Eo("np.greater",e,n,"Greater"),GreaterEqual:(e,n)=>Eo("np.greater_equal",e,n,"GreaterEqual"),And:(e,n)=>uc("And","np.logical_and",e,n),Or:(e,n)=>uc("Or","np.logical_or",e,n),Not:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Not`: expected one operand");return Yc("Not",e,"tensor<boolean>"),`np.logical_not(${n(e[0])})`},If:(e,n,t)=>{if(e.length!==3)throw new Error("Could not compile `If`: wrong number of arguments");if(Gn(e[1])||Gn(e[2]))return Jc(e,t,f.cseParentNode());let r=fc([e[1],e[2]],t);return dc(e[0],Os(e[1],()=>n(e[1],1),r,t),Os(e[2],()=>n(e[2],2),r,t),o=>n(o))},Which:(e,n,t)=>{if(e.length<2||e.length%2!==0)throw new Error("Could not compile `Which`: expected condition/value pairs");for(let i=0;i<e.length;i+=2)f.assertScalarCondition(e[i],t);let r=fc(e.filter((i,s)=>s%2===1),t),o=i=>{if(i>=e.length)return r;let s=e[i],a=e[i+1],u=()=>Os(a,()=>n(a,i+1),r,t);return C(s,"True")?`(${u()})`:dc(s,u(),o(i+2),l=>i===0?n(l):n(l,i))};return o(0)},Match:()=>{throw new Error("Could not compile `Match`: pattern matching is not supported by the Python compile target in v1.")},Loop:(e,n,t)=>Rc(e,t,f.cseParentNode()),Comprehension:(e,n,t)=>Vd(e,t,f.cseParentNode()),Erf:"scipy.special.erf",Erfc:"scipy.special.erfc",Gamma:(e,n)=>{let t=e[0];if(t==null)throw new Error("Could not compile `Gamma`: no argument");return e.length<2?`scipy.special.gamma(${n(t)})`:mc(e,n,!1)},GammaLn:([e],n,t)=>{if(e===null)throw new Error("Could not compile `GammaLn`: no argument");let r="Could not compile `GammaLn`: scipy.special.loggamma takes another branch than the interpreter off the real axis; the compiled value would differ",o=()=>new un({code:"non-real-operand",kind:"capability",message:`${r}.`});if(f.isProvablyNonReal(e))throw o();let i=e.isCollection===!0||e.type.matches("collection<any>");if(i?e.type.matches("collection<real>"):!f.isComplexValued(e))return`scipy.special.gammaln(${n(e)})`;if(!f.runtimeRealGuards)throw o();let s=`(_ for _ in ()).throw(ValueError('${r}'))`,a=f.tempVar(t);return i?`(lambda ${a}: scipy.special.gammaln(_ce_creal_elems(${a})) if np.all(np.isreal(${a})) else ${s})(${n(e)})`:`(lambda ${a}: scipy.special.gammaln(_ce_creal(${a})) if _ce_cisreal(${a}) else ${s})(${n(e)})`},Factorial:([e],n)=>{if(e===null)throw new Error("Could not compile `Factorial`: no argument");return`scipy.special.gamma((${n(e)}) + 1)`},GammaRegularized:(e,n)=>mc(e,n,!0),BetaRegularized:([e,n,t],r)=>{if(e===null||n===null||t===null)throw new Error("Could not compile `BetaRegularized`: missing argument");return`scipy.special.betainc(${r(n)}, ${r(t)}, ${r(e)})`},List:(e,n)=>`[${e.map(t=>n(t)).join(", ")}]`,Matrix:(e,n)=>`np.array(${n(e[0])})`,Tuple:(e,n)=>{let t=e.map(r=>n(r));return t.length===1?`(${t[0]},)`:`(${t.join(", ")})`},Sequence:(e,n)=>`np.array([${e.map(t=>n(t)).join(", ")}])`,Range:(e,n)=>{if(e.length===0)return"[]";if(e.some(o=>o!=null&&bl(o)))throw new Error("Could not compile `Range`: a non-finite bound does not materialize.");let t=e.length===1?"1":n(e[0]),r=e.length===1?n(e[0]):n(e[1]);return e.length<=2?`(lambda _a, _b: (lambda _s: [float(_a + _s * _i) for _i in range(${Us("_a","_b","_s")})])(1 if _b >= _a else -1))(${t}, ${r})`:`(lambda _a, _b, _s: [] if _s == 0 else [float(_a + _s * _i) for _i in range(${Us("_a","_b","_s")})])(${t}, ${r}, ${n(e[2])})`},Function:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Function`: missing body");let r=e[0];for(;_(r,"Block")&&r.nops===1;)r=r.ops[0];if(_(r,"Block"))throw new Error("Could not compile `Function`: a multi-statement (Block) body has no Python lambda form.");f.assertNoDestructuringParams(e.slice(1)),f.assertNoRestParams(e.slice(1));let o=e.slice(1).map(l=>Zn(Be(l)||"_")),i={...t,localFunctions:t.lexicalFunctions??t.localFunctions},s=f.compile(r.canonical,{...i,var:l=>o.includes(l)?l:t.var(l),...f.withBoundScope(i,o)}),a=[],u=[];return e.slice(1).forEach((l,c)=>{let p=aa(l);if(p===void 0){a.push(o[c]);return}let d=Ra(p.engine,p,pr(l),"a `Function` literal");a.push(`${o[c]}=None`),u.push([o[c],n(d)])}),u.length===0?`(lambda ${a.join(", ")}: ${s})`:`(lambda ${a.join(", ")}: (lambda ${u.map(([l])=>l).join(", ")}: ${s})(${u.map(([l,c])=>`${c} if ${l} is None else ${l}`).join(", ")}))`},Length:(e,n)=>`len(${Z("Length",e[0],n)})`,Count:(e,n)=>{if(e.length!==1)throw new Error("Could not compile `Count`: only the single-argument cardinality form compiles; the value and predicate forms (`Count(xs, v)`, `Count(xs, p)`) are not supported.");return`len(${Z("Count",e[0],n)})`},IsEmpty:(e,n)=>`(len(${Z("IsEmpty",e[0],n)}) == 0)`,At:(e,n,t)=>{let r=e[0],o=e[1];if(r==null||o==null||e.length!==2)throw new Error("Could not compile `At`: this lowering reads one index. The compiler rewrites a chained access `At(x, i, j)` to the nested access `At(At(x, i), j)` before it calls this lowering.");if(yr(o)||em(o))throw new Error(`Could not compile \`At\`: the index (type \`${o.type.toString()}\`) is or may be a collection (a gather or a mask), and the Python target lowers only a scalar index. The interpreter evaluates it.`);if(Pr(r))throw new Error(`Could not compile \`At\`: the first operand may be text at run time (type \`${r.type.toString()}\`), and Python has no stdlib grapheme segmentation. The interpreter evaluates it.`);let i=tt.staticTypeOf(r,t);if(!(!D(i,"string")&&D(i,In))){if(!Xc(r))throw new Error("Could not compile `At`: operand is not an indexed collection (list/vector/range).");if(!nm(o))throw new Error(`Could not compile \`At\`: the first operand is not provably an indexed collection (type \`${r.type.toString()}\`) and the index is not provably numeric, so a keyed (dictionary) access cannot be ruled out.`)}let{absent:a,outOfRange:u}=Kc(r,B(o)&&Number.isInteger(o.re)?o.re:void 0);return`(lambda _l, _i: (${a} if _l is None else float('nan')) if not isinstance(_l, (list, tuple, np.ndarray)) else (_l[int(_i) - 1] if 1 <= _i <= len(_l) else (_l[int(_i)] if -len(_l) <= _i <= -1 else ${u})))(${n(r)}, ${n(o)})`},First:(e,n)=>Co("First",e[0],0,n),Second:(e,n)=>Co("Second",e[0],1,n),Third:(e,n)=>Co("Third",e[0],2,n),Last:(e,n)=>Co("Last",e[0],-1,n),Rest:(e,n)=>`${Z("Rest",e[0],n)}[1:]`,Most:(e,n)=>`${Z("Most",e[0],n)}[:-1]`,Take:(e,n)=>{let t=Z("Take",e[0],n);if(e[1]==null)throw new Error("Could not compile `Take`: missing count");return Xp("Take",t,e[1],n)},Drop:(e,n)=>{let t=Z("Drop",e[0],n);if(e[1]==null)throw new Error("Could not compile `Drop`: missing count");return Xp("Drop",t,e[1],n)},Reverse:(e,n)=>`${Z("Reverse",e[0],n)}[::-1]`,Pipe:(e,n)=>n(xl(e)),Sort:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Sort`: a custom comparator is not supported; only the default ascending numeric sort is.");return`sorted(${Z("Sort",e[0],n)})`},Ordering:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Ordering`: a custom ordering function is not supported.");return`(lambda _l: [_i + 1 for _i in sorted(range(len(_l)), key=lambda _j: _l[_j])])(${Z("Ordering",e[0],n)})`},Join:(e,n)=>pc("Join",e,n),ListJoin:(e,n)=>pc("ListJoin",e,n),Append:(e,n)=>{let t=Z("Append",e[0],n),r=e.slice(1).map(o=>n(o));return`[*${t}${r.map(o=>`, ${o}`).join("")}]`},ReplaceAt:(e,n)=>{if(e[1]==null||e[2]==null)throw new Error("Could not compile `ReplaceAt`: missing argument");if(e.length>3)throw new Error("Could not compile `ReplaceAt`: this target writes at one position");if(Is.has(e)){let r=[],o=e;for(;r.unshift(n(o[1]),n(o[2])),!!_(o[0],"ReplaceAt");)o=o[0].ops;return`_ce_replaceat_inplace(${n(o[0])}, ${r.join(", ")})`}return`_ce_replaceat(${Z("ReplaceAt",e[0],n)}, ${n(e[1])}, ${n(e[2])})`},DeleteAt:(e,n)=>{if(e[1]==null)throw new Error("Could not compile `DeleteAt`: missing index");return`_ce_deleteat(${Z("DeleteAt",e[0],n)}, ${n(e[1])})`},Insert:(e,n)=>{if(e[1]==null||e[2]==null)throw new Error("Could not compile `Insert`: missing argument");return`_ce_insert(${Z("Insert",e[0],n)}, ${n(e[1])}, ${n(e[2])})`},IndexOf:(e,n)=>{let t=Z("IndexOf",e[0],n);if(e[1]==null)throw new Error("Could not compile `IndexOf`: missing value");return`_ce_indexof(${t}, ${n(e[1])})`},Contains:(e,n)=>{e[0]&&Ar("Contains",e[0]);let t=Z("Contains",e[0],n);if(e[1]==null)throw new Error("Could not compile `Contains`: missing value");return`(_ce_indexof(${t}, ${n(e[1])}) > 0)`},Unique:(e,n)=>(e[0]&&Ar("Unique",e[0]),`list(dict.fromkeys(${Z("Unique",e[0],n)}))`),Zip:(e,n)=>e.length===0?"[]":(f.assertLockstepSourcesPure("Zip",e,1),`[list(_t) for _t in zip(${e.map((r,o)=>Z("Zip",r,n,o+1)).join(", ")})]`),Linspace:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Linspace`: missing argument");let t=e[1]==null?"1":n(e[0]),r=e[1]==null?n(e[0]):n(e[1]),o=e[2]==null?"50":n(e[2]);return`(lambda _s, _e, _n: [float(_v) for _v in np.linspace(_s, _e, _n)] if (abs(_s) < float('inf') and abs(_e) < float('inf')) or (_n == 0 and _s == _s and _e == _e) else float('nan'))(${t}, ${r}, max(0, int(${o})))`},Map:(e,n)=>{if(e[1]==null)throw new Error("Could not compile `Map`: missing source collection");if(e.length>2){let o=e.slice(1);f.assertLockstepSourcesPure("Map",o,2);let i=o.map((a,u)=>Z("Map",a,n,u+2));if(C(e[0])&&f.isBinaryInfixValueOperator(e[0].symbol)&&o.length!==2)throw new Error(`Could not compile \`Map\`: the operator symbol '${e[0].symbol}' used as the mapping compiles to a two-argument function, and ${o.length} collections supply ${o.length} arguments per call. The interpreter evaluates it instead.`);return`(lambda _f, *_ls: [_f(*_t) for _t in zip(*_ls)])(${$e("Map",e[0],n,f.zipCallbackArgTypes("Map",o,2),o)}, ${i.join(", ")})`}let t=Z("Map",e[1],n),r=$e("Map",e[0],n,[f.collectionElementTypeOf(e[1])],[e[1]]);return`(lambda _f: [_f(_x) for _x in ${t}])(${r})`},Filter:(e,n)=>{let t=Z("Filter",e[0],n);if(e[1]==null)throw new Error("Could not compile `Filter`: missing predicate");let r=$e("Filter",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: [_x for _x in ${t} if _f(_x)])(${r})`},CountIf:(e,n)=>{let t=Z("CountIf",e[0],n);if(e[1]==null)throw new Error("Could not compile `CountIf`: missing predicate");let r=$e("CountIf",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: sum(1 for _x in ${t} if _f(_x)))(${r})`},Find:(e,n)=>{let t=Z("Find",e[0],n);if(e[1]==null)throw new Error("Could not compile `Find`: missing predicate");let r=$e("Find",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f, _l, _n: (lambda _r: (${Ys(On(an(Y(e[0].type.type))))}) if _r is _n else _r)(next((_x for _x in _l if _f(_x)), _n)))(${r}, ${t}, object())`},IndexWhere:(e,n)=>{let t=Z("IndexWhere",e[0],n);if(e[1]==null)throw new Error("Could not compile `IndexWhere`: missing predicate");let r=$e("IndexWhere",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: next((_i + 1 for _i, _x in enumerate(${t}) if _f(_x)), 0))(${r})`},Position:(e,n)=>{let t=Z("Position",e[0],n);if(e[1]==null)throw new Error("Could not compile `Position`: missing predicate");let r=$e("Position",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: [_i + 1 for _i, _x in enumerate(${t}) if _f(_x)])(${r})`},Any:(e,n)=>{let t=Z("Any",e[0],n);if(e[1]==null)throw new Error("Could not compile `Any`: only the predicate form compiles.");let r=$e("Any",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: any(_f(_x) for _x in ${t}))(${r})`},All:(e,n)=>{let t=Z("All",e[0],n);if(e[1]==null)throw new Error("Could not compile `All`: only the predicate form compiles.");let r=$e("All",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]]);return`(lambda _f: all(_f(_x) for _x in ${t}))(${r})`},TakeWhile:(e,n)=>{let t=Z("TakeWhile",e[0],n);if(e[1]==null)throw new Error("Could not compile `TakeWhile`: missing predicate");return`(lambda _f, _l: _l[:next((_i for _i, _x in enumerate(_l) if not _f(_x)), len(_l))])(${$e("TakeWhile",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},DropWhile:(e,n)=>{let t=Z("DropWhile",e[0],n);if(e[1]==null)throw new Error("Could not compile `DropWhile`: missing predicate");return`(lambda _f, _l: _l[next((_i for _i, _x in enumerate(_l) if not _f(_x)), len(_l)):])(${$e("DropWhile",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},FlatMap:(e,n)=>{let t=Z("FlatMap",e[0],n);if(e[1]==null)throw new Error("Could not compile `FlatMap`: missing mapping function");return`(lambda _f, _l: [_y for _x in _l for _y in (lambda _r: _r if isinstance(_r, list) else [_r])(_f(_x))])(${$e("FlatMap",e[1],n,[f.collectionElementTypeOf(e[0])],[e[0]])}, ${t})`},Reduce:(e,n,t)=>{let r=Z("Reduce",e[0],n),o=e[1],i=e[2];if(o==null)throw new Error("Could not compile `Reduce`: missing combiner");let s=C(o)&&Vo(o,t)?{Add:"sum(_l)",Multiply:'__import__("math").prod(_l)',Min:"min(_l)",Max:"max(_l)"}[o.symbol]:void 0;if(s!==void 0)return ac("Reduce",e[0]),i!=null?`(lambda _l: ${{"sum(_l)":`sum(_l, ${n(i)})`,'__import__("math").prod(_l)':`__import__("math").prod(_l, start=${n(i)})`,"min(_l)":`min([${n(i)}, *_l])`,"max(_l)":`max([${n(i)}, *_l])`}[s]})(${r})`:`(lambda _l: float('nan') if len(_l) == 0 else ${s})(${r})`;if(_(o,"Function")&&qo(o,2)||C(o)){if(i==null)throw new Error("Could not compile `Reduce`: a custom combiner compiles only with an explicit initial value.");Ho("Reduce",o,i);let a=ka(o);for(let c of a??[])Is.add(c);let u;try{u=$e("Reduce",o,n,[f.foldAccumulatorArgType(e[0],o,i),f.collectionElementTypeOf(e[0])],[void 0,e[0]])}finally{for(let c of a??[])Is.delete(c)}let l=a!==void 0?`_ce_owned_copy(${n(i)})`:n(i);return`__import__('functools').reduce(${u}, ${r}, ${l})`}throw new Error("Could not compile `Reduce`: the combiner has no compiled function form on the Python target.")},Scan:(e,n,t)=>{let r=Z("Scan",e[0],n),o=e[1],i=e[2];if(o==null)throw new Error("Could not compile `Scan`: missing combiner");let s=C(o)&&Vo(o,t)?{Add:"(lambda _a, _b: _a + _b)",Multiply:"(lambda _a, _b: _a * _b)",Min:"(lambda _a, _b: min(_a, _b))",Max:"(lambda _a, _b: max(_a, _b))"}[o.symbol]:void 0;s!==void 0?ac("Scan",e[0]):Ho("Scan",o,i);let a=s??(_(o,"Function")&&qo(o,2)||C(o)?$e("Scan",o,n,[f.foldAccumulatorArgType(e[0],o,i),f.collectionElementTypeOf(e[0])],[void 0,e[0]]):void 0);if(a===void 0)throw new Error("Could not compile `Scan`: the combiner has no compiled function form on the Python target.");return i!=null?`list(__import__('itertools').accumulate(${r}, ${a}, initial=${n(i)}))[1:]`:`list(__import__('itertools').accumulate(${r}, ${a}))`},Tabulate:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Tabulate`: missing argument");if(e.length>3)throw new Error("Could not compile `Tabulate`: only the 1-D and 2-D forms compile.");for(let i=1;i<e.length;i++){let s=X(e[i]);if(s!==void 0&&Math.round(s)<=0)throw new Error(`Could not compile \`Tabulate\`: a statically non-positive dimension (${s}) gives a constant empty list.`)}let t=$e("Tabulate",e[0],n,["integer","integer"]),r=Kp(e[1],n);return e.length===2?`(lambda _f: [_f(_i + 1) for _i in range(${r})])(${t})`:`(lambda _f: [[_f(_i + 1, _j + 1) for _j in range(${Kp(e[2],n)})] for _i in range(${r})])(${t})`},Boole:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Boole`: missing argument");if(!f.isBooleanValued(e[0]))throw new Error("Could not compile `Boole`: the argument is not provably boolean.");return`(1 if ${n(e[0])} else 0)`},KroneckerDelta:(e,n)=>{if(e.length===0||e[0]==null)throw new Error("Could not compile `KroneckerDelta`: missing argument");return e.length===1?`(1 if ${n(e[0])} == 0 else 0)`:`(lambda *_v: 1 if all(_x == _v[0] for _x in _v) else 0)(${e.map(t=>n(t)).join(", ")})`},Element:(e,n)=>{if(e[0]==null||e[1]==null)throw new Error("Could not compile `Element`: missing argument");return Ar("Element",e[1]),`(_ce_indexof(${Z("Element",e[1],n)}, ${n(e[0])}) > 0)`},Identity:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Identity`: missing argument");return Pc(e[0],n(e[0]),t)},Apply:(e,n,t)=>{if(e[0]==null)throw new Error("Could not compile `Apply`: missing function");if(Sr(e),Rr(e))throw new Error(_l());if(_(e[0],"Function")){let r=e[0].ops.slice(1);if(!r.some(o=>et(o))&&!Sa(e[0],e.length-1))throw new Error(`Could not compile \`Apply\`: the function takes ${r.length} parameter(s) but ${e.length-1} argument(s) are supplied. `+(r.length===0?"The interpreter ignores the arguments of a function with no parameter, and the Python call raises a `TypeError`.":"The interpreter gives an `unexpected-argument` error, and the Python call raises a `TypeError`."))}return Qc(e,n,!1,t)},Flatten:(e,n)=>{if(e[1]!=null)throw new Error("Could not compile `Flatten`: an explicit depth is not supported on the Python target.");if(e[0]!=null&&wa(e[0].type.type,1/0))throw new Error("Could not compile `Flatten`: an element of the operand can be a tuple or a set, which the interpreter keeps as one element and compiled code can open, or the type of the operand does not show which elements are lists.");return`(lambda _l: (lambda _f: _f(_f, _l))(lambda _f, _x: [_y for _e in _x for _y in (_f(_f, _e) if isinstance(_e, list) else [_e])]))(${Z("Flatten",e[0],n)})`},Shape:(e,n)=>{if(e[0]==null)throw new Error("Could not compile `Shape`: missing argument");let t=Yo(e[0]);if(t!==void 0)throw new Error(`Could not compile \`Shape\`: the operand ${t}.`);return`list(np.shape(${n(e[0])}))`},Reshape:(e,n)=>{let t=Z("Reshape",e[0],n),r=e[1];if(r==null)throw new Error("Could not compile `Reshape`: missing shape");if(!_(r)||r.ops.length===0||r.ops.length>2)throw new Error("Could not compile `Reshape`: only a 1-D or 2-D target shape compiles.");return`np.resize(np.asarray(${t}), (${r.ops.map(o=>n(o)).join(", ")},)).tolist()`},Trace:(e,n)=>{if(e.length>1)throw new Error("Could not compile `Trace`: explicit axes do not compile.");return`${f.linearAlgebraLane([e[0]])==="complex"?"complex":"float"}(np.trace(np.asarray(${Z("Trace",e[0],n)})))`}};Ws.ApplyWhole=(e,n,t)=>Qc(e,n,!0,t);var lm=["strict","complex"],um=new Set(["Erf","Erfc","Lb","Log2","Log10","Exp2","Determinant","Inverse","MatrixMultiply","MatrixPower","Cross","Diagonal"]),pm=new Set(["GammaRegularized"]);function cm(e,n){return f.REAL_ONLY_BY_DEFINITION.has(e)||pm.has(e)?!0:f.stringHelperIsRealOnly(e,n)&&!um.has(e)}function hc(e,n,t){let r=[];for(let o of n){let i=e.engine.symbol(o).type?.type;i===void 0||!yl(i)||r.push([t(o),`"${o}" (type \`${f.declaredTypeText(i)}\`) is compiled as a Python sequence, and compiled code does not accept a string for it: it would read the string as code points, not as characters. Pass a list, or declare the parameter \`string\` to compile text.`])}return r}var gc=e=>`__import__("builtins").isinstance(${e}, __import__("builtins").str)`,_c=e=>`__import__("builtins").TypeError(${JSON.stringify(e)})`,rr="_c is None or (isinstance(_c, (float, complex, np.floating, np.complexfloating)) and cmath.isnan(_c))";function yc(e){let n=Array.from({length:e},(t,r)=>`cmath.isnan(_c[${r}])`).join(" and ");return`${rr} or (${n})`}var bc=class{includeImports;useScipy;constructor(n={}){this.includeImports=n.includeImports??!1,this.useScipy=n.useScipy??!1}getOperators(){return Bs}getFunctions(){return Ws}createTarget(n={}){return{language:"python",shapeDispatch:va,isRealOnlyLowering:cm,supportedModes:lm,complexLift:t=>`_ce_cplx(${t})`,complexIsReal:t=>`_ce_cisreal(${t})`,complexReal:t=>`_ce_creal(${t})`,complexRealElements:t=>`_ce_creal_elems(${t})`,realGuard:(t,r,o)=>t.length===0?`(${r})`:`((${r}) if (${t.join(" and ")}) else ${o==="boolean"?"False":"float('nan')"})`,chainOp:"and",bindExpr:(t,r)=>`(lambda ${t.map(o=>o[0]).join(", ")}: ${r})(${t.map(o=>o[1]).join(", ")})`,cseBind:(t,r)=>`[${r} ${t.map(([o,i])=>`for ${o} in [${i}]`).join(" ")}][0]`,shareSymbolSquares:!1,valueTailSelections:!1,broadcastUnary:(t,r,o,i)=>{let s=f.tempVar(i);return`[${o.element(s)} for ${s} in ${o.collection()}]`},collectionAwareHeads:Jd,operators:t=>Bs[t],functions:t=>Ws[t],var:t=>Ns[t],mangleId:Wp,constant:t=>Ns[t]??xc[t],complex:(t,r)=>`complex(${nc(t)}, ${nc(r)})`,string:t=>JSON.stringify(t),dictionary:t=>`{${t.map(([r,o])=>`${JSON.stringify(r)}: ${o}`).join(", ")}}`,number:t=>isFinite(t)?t.toString():t===1/0?"np.inf":t===-1/0?"-np.inf":"np.nan",indent:0,ws:t=>t??"",preamble:"",absence:{numeric:{make:()=>"math.nan",isAbsent:t=>`(lambda _c: ${rr})(${t})`,coalesce:(t,r)=>`(lambda _c: ${r} if (${rr}) else _c)(${t})`},object:{nullLiteral:"None",isAbsent:t=>`(lambda _c: ${rr})(${t})`,coalesce:(t,r)=>`(lambda _c: ${r} if (${rr}) else _c)(${t})`},point:{isAbsent:(t,r)=>`(lambda _c: ${yc(r)})(${t})`,coalesce:(t,r,o)=>`(lambda _c: ${r} if (${yc(o)}) else _c)(${t})`},raise:t=>`(_ for _ in ()).throw(ValueError(${t}))`,writtenSymbol:"numeric"},bareStatementBlocks:!0,declare:t=>"",block:t=>{if(t.length===0)return"";let r=t.length-1;if(/^(for|while)\b/.test(t[r]))t.push("return None");else{if(/^if\b/.test(t[r]))throw new Error("Could not compile `Block`: the block's value statement is a selection whose branches are statements, which Python writes as an `if:`/`else:` block \u2014 a block cannot be returned, and its value is not `None`. Give the block a VALUE statement after the selection.");!/^return\b/.test(t[r])&&!/\nreturn\b[^\n]*$/.test(t[r])&&(t[r]=`return ${t[r]}`)}return t.join(`
`)},naming:{counter:0,usedNames:new Set},...n}}makeVarResolver(n,t){return r=>{if(t?.includes(r))return r;if(n&&Object.hasOwn(n,r)){let o=n[r];return typeof o!="string"?Nn(JSON.stringify(o)):(/^[A-Za-z_]\w*$/.test(o)&&Wp(o),/["']/.test(o)?`(${o})`:Nn(o))}return Ns[r]}}compile(n,t={}){t.storage!==void 0&&At(t.storage,[n],this.createTarget(),{vars:t.vars,functions:t.functions});try{return at(n,t.vars,()=>this.compileOrThrow(n,t))}catch(r){if(ur(r,n.engine._deadlineFrame),t.fallback!==!0)throw r;let o=r.message;return console.warn(`Compilation fallback for "${n.operator}" (target: python): ${o}`),f.buildInterpreterFallback(n,o,"python",this.createTarget(),t.vars?new Set(Object.keys(t.vars)):void 0,mr(r,o))}}compileOrThrow(n,t={}){n=Ze(n),n=kt(n),n=ot(n,{iterationBudget:t.iterationBudget,readsLiveSource:c=>typeof t.vars?.[c]=="string"});let r=t.vars,o=this.makeVarResolver(r),i=this.createTarget({var:o,iterationBudget:t.iterationBudget,varsKeys:r?new Set(Object.keys(r)):void 0,constantFold:t.constantFold,mode:t.mode,naming:bo(n,[t.preamble,...r?Object.values(r):[]])}),s=Tt(n,i,{vars:r});s!==n&&(n=ot(s,{iterationBudget:t.iterationBudget,readsLiveSource:c=>typeof t.vars?.[c]=="string"})),f.openCseSession(n,i,{enabled:t.cse,isStringVar:c=>r!==void 0&&typeof r[c]=="string",isVarsKey:c=>r!==void 0&&Object.prototype.hasOwnProperty.call(r,c)}),Wc("compile()",n,!0);let a=Qp(n,i);a=yo(a,{callerSources:Yp(r),hostNames:()=>f.analyzeReferences(n,i,r?new Set(Object.keys(r)):void 0).freeSymbols}).body;let u=oc(a);tr(u,n.symbols.filter(c=>typeof r?.[c]!="string")),this.includeImports&&(u=this.withImports(u));let l={target:"python",success:!0,code:u};return f.withReferences(l,n,i,r?new Set(Object.keys(r)):void 0)}withImports(n){let t=`import numpy as np
`;return t+=`import cmath
`,this.useScipy&&(t+=`import scipy.special
`),/\bmath\./.test(n)&&(t+=`import math
`),`${t}
${n}`}compileToSource(n,t={}){Vs("compileToSource()",n),n=Ze(n),n=kt(n);let r=t.vars,o=this.createTarget({var:this.makeVarResolver(r),varsKeys:r?new Set(Object.keys(r)):void 0,constantFold:t.constantFold,mode:t.mode,naming:bo(n,[t.preamble,...r?Object.values(r):[]])}),i=at(n,r,()=>(n=Tt(n,o,{vars:r}),f.openCseSession(n,o,{enabled:t.cse,isStringVar:a=>r!==void 0&&typeof r[a]=="string",isVarsKey:a=>r!==void 0&&Object.prototype.hasOwnProperty.call(r,a)}),f.compileCseRoot(n,o)));Kd("compileToSource()",i);let s=oc(yo(i,{callerSources:Yp(r),hostNames:()=>f.analyzeReferences(n,o,r?new Set(Object.keys(r)):void 0).freeSymbols}).body);return tr(s,n.symbols.filter(a=>typeof r?.[a]!="string")),this.includeImports?this.withImports(s):s}compileFunction(n,t,r,o,i){Xd("compileFunction()",n),Zn(t);for(let p of r)Zn(p);n=Ze(n),n=kt(n);let s=this.createTarget({var:this.makeVarResolver(void 0,r),constantFold:i?.constantFold,naming:bo(n,void 0,r)});n=Tt(n,s),f.openCseSession(n,s,{enabled:i?.cse});let a=Qp(n,s),u=yo(a,{outside:[t,...r],hostNames:()=>[t,...f.analyzeReferences(n,s).freeSymbols.filter(p=>!r.includes(p))]});a=u.body;let l=r.map(u.name).join(", "),c="";this.includeImports&&(c+=`import numpy as np
`,c+=`import cmath
`,this.useScipy&&(c+=`import scipy.special
`),/\bmath\./.test(a)&&(c+=`import math
`),c+=`
`),(a.includes("_ce_cplx(")||a.includes("_ce_cisreal(")||a.includes("_ce_creal(")||a.includes("_ce_creal_elems("))&&(c+=`${kc}
`),a.includes("_ce_rref(")&&(c+=`${zc}
`),a.includes("_ce_bcast(")&&(c+=`${Lc}
`),a.includes("_ce_eqcoll(")&&(c+=`${Fc}
`),a.includes("_ce_indexof(")&&(c+=`${Nc}
`),a.includes("_ce_ord(")&&(c+=`${jc}
`),(a.includes("_ce_smoothstep(")||a.includes("_ce_bcast('smoothstep'"))&&(c+=`${Oc}
`),a.includes("_ce_round(")&&(c+=`${Mc}
`),(a.includes("_ce_int_operands(")||a.includes("_ce_remainder("))&&(c+=`${Dc}
`),a.includes("_ce_pow(")&&(c+=`${Ic()}
`),/_ce_(replaceat|replaceat_inplace|owned_copy|deleteat|insert)\(/.test(a)&&(c+=`${Vc}
`),a.includes("_ce_predicate(")&&(c+=`${qc}
`),a.includes("_ce_ugamma(")&&(c+=`${Hc}
`),c+=`def ${u.name(t)}(${l}):
`,o&&(c+=`    r"""${o}"""
`);for(let[p,d]of hc(n,r,u.name))c+=`    if ${gc(p)}:
        raise ${_c(d)}
`;if(a.includes(`
`)){let p=a.split(`
`).map(d=>`    ${d}`).join(`
`);c+=`${p}
`}else/^return\b/.test(a)?c+=`    ${a}
`:c+=`    return ${a}
`;return tr(c,[t,...r,...n.symbols].map(u.name)),c}compileVectorized(n,t,r,o,i){Zn(t);let a=this.compileFunction(n,`_${t}_scalar`,r,o,i)+`
`;return a+=`# Vectorized version
`,a+=`${t} = np.vectorize(_${t}_scalar)
`,tr(a,[t]),a}compileLambda(n,t,r){Vs("compileLambda()",n);for(let d of t)Zn(d);n=Ze(n),n=kt(n);let o=this.createTarget({var:this.makeVarResolver(void 0,t),constantFold:r?.constantFold,naming:bo(n,void 0,t)});n=Tt(n,o),f.openCseSession(n,o,{enabled:r?.cse});let i,s=Jn;Jn=!0;try{i=f.compileCseRoot(n,o)}finally{Jn=s}if(i.includes(`
`))throw new Error("Could not compile `compileLambda`: a multi-statement construct (loop-form Sum/Product, Loop, or Block) cannot be a Python lambda body \u2014 use compileFunction instead.");for(let[d,h]of[["_ce_bcast(","ElementMax/ElementMin/Clamp over a collection operand"],["_ce_rref(","RowReduce"],["_ce_indexof(","IndexOf"],["_ce_eqcoll(","equality over a collection or tuple operand"],["_ce_ord(","an ordering over a collection operand"],["_ce_pow(","a power whose base may be negative"],["_ce_round(","Round"],["_ce_predicate(","a predicate whose result is not provably a boolean"],["_ce_ugamma(","an upper incomplete gamma whose order is not known to be positive"],["_ce_cplx(","the complex lift of the complex modes"],["_ce_cisreal(","the realness test of the complex modes"],["_ce_creal(","the real projection of the complex modes"],["_ce_creal_elems(","the element-wise real projection of the complex modes"]])if(i.includes(d))throw new Error(`Could not compile \`compileLambda\`: ${h} needs the module-level ${d.slice(0,-1)} helper, which cannot ride along a bare lambda \u2014 use compileFunction instead.`);let a=yo(i,{outside:t,hostNames:()=>f.analyzeReferences(n,o).freeSymbols.filter(d=>!t.includes(d))}),u=t.map(a.name).join(", "),l=a.body,c=hc(n,t,a.name);c.length>0&&(l=`${c.map(([d,h])=>`(_ for _ in ()).throw(${_c(h)}) if ${gc(d)} else `).join("")}(${l})`);let p=`lambda ${u}: ${l}`;return tr(p,[...t,...n.symbols].map(a.name)),p}};export{nr as a,qp as b,bc as c};
