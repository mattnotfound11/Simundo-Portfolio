/* Jan Louis Simundo, portfolio app.
   Renders the single page from window.CONTENT and wires every animation.
   Needs: gsap, ScrollTrigger, ScrollToPlugin (cdnjs), icons.js, content.js. */
(() => {
  const C = window.CONTENT;
  const ICONS = window.ICONS;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  gsap.registerPlugin(ST, window.ScrollToPlugin);
  gsap.config({ force3D: true });
  ST.config({ ignoreMobileResize: true });

  /* ---------- shared tokens (same values as the original design system) ---------- */
  const MOTION = "(prefers-reduced-motion: no-preference)";
  const EASE = { out: "expo.out", inOut: "power3.inOut", linear: "none" };
  const DUR = { quick: 0.3, reveal: 0.75, slow: 1 };
  const P = C.person, L = C.links;
  // Pages live at /, /contact/ and /work/<slug>/; BASE is the path back to the site root.
  const BASE = window.BASE || "";
  const PAGE = document.body.dataset.page || "home";
  const home = (hash) => (PAGE === "home" ? hash : BASE + hash);
  const mailto = (subject) => `mailto:${L.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cx = (...a) => a.filter(Boolean).join(" ");
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersMotion = () => matchMedia(MOTION).matches;

  /* ---------- icons (Lucide, same shapes as the original) ---------- */
  const LUCIDE = {
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    play: '<path d="M6 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 6 3.5z" fill="currentColor"/>',
    "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    "file-text": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
    "map-pin": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
    "message-square": '<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>',
    moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };
  const ico = (name, size = 24, cls = "") =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cx("lucide", "lucide-" + name, cls)}" aria-hidden="true">${LUCIDE[name]}</svg>`;
  const GH_PATH = "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z";
  const ghIcon = (s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${GH_PATH}"/></svg>`;
  const brand = (slug, s = 16, fill = "currentColor") => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" fill="${fill}"><path d="${ICONS[slug].path}"/></svg>`;

  /* ---------- small helpers that mirror the original hooks ---------- */
  const BTN = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const BTN_SOLID = BTN + " bg-accent text-accent-contrast hover:opacity-90";
  const BTN_OUTLINE = BTN + " border border-border text-text hover:border-accent hover:text-accent";
  const CARD = "rounded-card border border-border bg-surface/70";
  const THIRD = "md:w-[calc((100%_-_2rem)/3)] md:shrink-0";
  const TWO_THIRDS = "md:w-[calc((100%_-_2rem)/3*2_+_1rem)] md:shrink-0";
  const ext = (href) => (/^https?:/.test(href) ? ' target="_blank" rel="noreferrer"' : "");

  // Pause looping tweens while their element is off screen.
  function pauseOffscreen(el, tweens) {
    if (!el) return;
    ST.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => tweens.forEach((t) => t.paused(!s.isActive)) });
  }
  // Play looping tweens only while the pointer is over the card (".anim-host").
  function playOnHover(el, tweens) {
    if (!el) return;
    const host = el.closest(".anim-host") || el;
    tweens.forEach((t) => t.pause());
    host.addEventListener("pointerenter", () => tweens.forEach((t) => t.play()));
    host.addEventListener("pointerleave", () => tweens.forEach((t) => t.pause()));
  }
  // Re-read function-based values (widths) after a resize, keeping the loop's place.
  function refreshOnResize(tw) {
    ST.addEventListener("refresh", () => { const p = tw.progress(), paused = tw.paused(); tw.invalidate().progress(p).paused(paused); });
  }
  // Fade-and-rise when scrolled into view.
  function reveal(el, delay = 0) {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      gsap.from(el, { opacity: 0, y: 28, duration: DUR.reveal, delay, ease: EASE.out, clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
  }
  const Reveal = (cls, inner) => `<div class="${cls}" data-reveal>${inner}</div>`;
  const Label = (cls, t) => `<p class="${cx("font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted", cls)}">${t}</p>`;

  // Section shell: label, title with gradient last word, rule.
  function Section(id, label, title, inner, extra = "") {
    const words = title.split(" ");
    const last = words.pop();
    return `<section id="${id}" class="mx-auto max-w-[1760px] px-5 min-[1280px]:px-[clamp(1.25rem,3vw,3.5rem)] py-[72px] md:py-24" ${extra}>
      <div class="text-center" data-sec-head>
        ${Label("sec-label", label)}
        <h2 class="sec-title mt-2 text-[clamp(28px,4vw,48px)] font-bold tracking-tight">${words.join(" ")} <span class="text-gradient">${last}</span></h2>
        <div aria-hidden="true" class="sec-rule mx-auto mt-4 h-0.5 w-12 origin-center rounded-full bg-gradient-to-r from-accent to-accent2"></div>
      </div>
      <div class="mt-12">${inner}</div>
    </section>`;
  }
  function initSectionHeads() {
    $$("[data-sec-head]").forEach((head) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.timeline({ defaults: { ease: EASE.out }, scrollTrigger: { trigger: head, start: "top 88%", once: true } })
          .from($(".sec-label", head), { opacity: 0, y: 12, duration: DUR.reveal * 0.8 })
          .from($(".sec-title", head), { opacity: 0, y: 22, duration: DUR.reveal }, 0.08)
          .from($(".sec-rule", head), { scaleX: 0, duration: DUR.reveal }, 0.2);
      });
    });
  }

  /* =====================================================================
     Chrome: header, progress bar, cursor backdrop, aurora shader
     ===================================================================== */
  const NAV = [
    { id: "top", label: "Home", href: home("#top") },
    { id: "about", label: "About", href: home("#about") },
    { id: "experience", label: "Experience", href: home("#experience") },
    { id: "work", label: "Work", href: home("#work") },
    { id: "multimedia", label: "Multimedia", href: home("#multimedia") },
    { id: "credentials", label: "Credentials", href: home("#credentials") },
  ];
  const CONTACT_HREF = BASE + "contact/";

  const Face = (size, cls = "") => `<img src="${BASE + P.avatar}" alt="Photo of ${esc(P.name)}" width="${size}" height="${size}" draggable="false" class="${cx("rounded-full border border-border object-cover", cls)}" style="width:${size}px;height:${size}px;object-position:50% 30%">`;

  const Header = () => `
  <header class="sticky top-0 z-40 px-4 min-[1280px]:px-[clamp(1rem,3vw,3.5rem)] pt-4">
    <nav aria-label="Primary" class="mx-auto grid max-w-[1760px] grid-cols-[1fr_auto_1fr] items-center">
      <button type="button" data-theme-toggle class="grid size-11 place-items-center justify-self-start rounded-full border border-border bg-surface/80 text-text backdrop-blur"></button>
      <ul data-nav class="relative hidden items-center gap-1 rounded-full border border-border bg-surface/80 p-1.5 backdrop-blur md:flex">
        <span data-nav-ind aria-hidden="true" class="absolute left-0 top-1.5 bottom-1.5 rounded-full bg-accent2/20 opacity-0"></span>
        ${NAV.map((n) => `<li><a href="${n.href}" data-id="${n.id}" class="relative flex items-center gap-1 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 text-muted hover:text-text">${n.label}</a></li>`).join("")}
      </ul>
      <div class="col-start-3 flex items-center gap-2 justify-self-end">
        <a href="${CONTACT_HREF}" ${PAGE === "contact" ? 'aria-current="page"' : ""} class="${cx("hidden items-center gap-2 rounded-full border bg-surface/80 px-5 py-3 text-sm font-semibold backdrop-blur hover:border-accent sm:flex", PAGE === "contact" ? "border-accent text-accent" : "border-border")}">${ico("mail", 16)}Get in touch</a>
        <button type="button" data-burger aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" class="grid size-11 place-items-center rounded-full border border-border bg-surface/80 backdrop-blur md:hidden">${ico("menu", 18)}</button>
      </div>
    </nav>
    <ul id="mobile-menu" hidden class="menu-in mx-auto mt-2 max-w-[1760px] rounded-card border border-border bg-surface/95 p-2 backdrop-blur md:hidden">
      ${[...NAV, { label: "Contact", href: CONTACT_HREF }].map((n) => `<li><a href="${n.href}" class="block rounded-xl px-4 py-3 text-muted hover:text-text">${n.label}</a></li>`).join("")}
    </ul>
  </header>`;

  function initProgress() {
    const bar = $(".progress-bar");
    let raf = 0;
    const draw = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    };
    const req = () => (raf ||= requestAnimationFrame(draw));
    draw();
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    new ResizeObserver(req).observe(document.documentElement);
  }

  function initBackdrop() {
    const root = $(".backdrop"), glow = $(".backdrop-glow"), lit = $(".backdrop-lit");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const G = 1040;
    let tx = innerWidth / 2, ty = innerHeight * 0.25, x = tx, y = ty, raf = 0, last = 0;
    const paint = () => {
      glow.style.transform = `translate3d(${(x - G / 2).toFixed(1)}px, ${(y - G / 2).toFixed(1)}px, 0)`;
      lit.style.transform = `translate3d(${(x - 280).toFixed(1)}px, ${(y - 280).toFixed(1)}px, 0)`;
      lit.style.backgroundPosition = `${(-(x - 280)).toFixed(1)}px ${(-(y - 280)).toFixed(1)}px`;
    };
    paint();
    if (reduce || !fine) return;
    const step = (t) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      const k = 1 - Math.exp(-dt * 9);
      x += (tx - x) * k; y += (ty - y) * k;
      paint();
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.4 ? requestAnimationFrame(step) : 0;
      if (!raf) last = 0;
    };
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; root.dataset.live = "true"; raf ||= requestAnimationFrame(step); }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => (root.dataset.live = "false"));
  }

  /* Aurora: WebGL2 light field behind the hero that bends around the cursor. */
  const LAYERS = 84, TWIST = 1.25, DRAG = 0.18;
  const VERT = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;
  const FIELD = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uC1; uniform vec3 uC2; uniform float uSize; uniform float uAngle;
uniform vec2 uMouse; uniform float uOn; uniform float uReach; uniform vec2 uVel;
out vec4 o;
const float TAU = 6.28318530718;
const float LAYERS = ${LAYERS.toFixed(1)};
const float TWIST = ${TWIST.toFixed(3)};
const float DRAG = ${DRAG.toFixed(3)};
const float GAIN = 0.62; const vec2 CENTRE = vec2(-0.62, 0.24); const float TILT = 0.6; const float ZOOM = 1.05;
const float THETA = 2.13; const float SHEAR = 0.963; const float SHRINK = 0.953;
const vec2 WARP_FREQ = vec2(0.42, 2.4); const vec2 WARP_AMP = vec2(0.13, 0.027); const vec2 ASPECT = vec2(2.1, 0.17);
const float OFFSET = 0.36; const float GLOW = 0.0021; const float SOFT = 0.0019; const float FALLOFF = 0.37;
const float PHASE = 12.0; const float CYCLE = 0.16; const float HUE_TRAVEL = 2.0;
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
void main() {
  vec2 R = uRes;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;
  vec2 d = pos - uMouse;
  float w = uOn * exp(-dot(d, d) / (uReach * uReach));
  if (w > 1e-4) pos = uMouse + rot(w * TWIST) * d * (1.0 - 0.3 * min(w, 1.0)) - uVel * min(w, 1.0) * DRAG;
  pos = rot(uAngle) * pos / uSize;
  float t = uTime * 0.49 + PHASE;
  float breath = (-sin(uTime * 0.735) + sin(uTime * 0.49 + 1.0)) * 0.25 + 0.5;
  vec2 u = rot(TILT) * ((pos - CENTRE) * (ZOOM - breath * 0.085));
  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));
  vec3 col = vec3(0.0);
  for (float i = 1.0; i <= LAYERS; i += 1.0) {
    u.x -= sin(u.y * WARP_FREQ.x + t + i * 0.007) * WARP_AMP.x;
    u.y -= sin(u.x * WARP_FREQ.y - t + i * 0.02) * WARP_AMP.y;
    u = fold * u * SHRINK;
    vec2 q = (u - vec2(OFFSET + breath * 0.1, 0.0)) * ASPECT;
    float g = GLOW / (dot(q, q) + SOFT) * (0.25 + breath * 0.4);
    float r = length(u);
    float k = sin(i * CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    col += g * mix(uC1, uC2, k) * (0.62 + 0.5 * k) * exp2(-r * FALLOFF);
  }
  vec3 x = max(col * GAIN, 0.0);
  col = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.85, 0.92, 0.98));
  col *= 1.0 - smoothstep(0.5, 1.6, length(pos)) * 0.07;
  o = vec4(col, 1.0);
}
`;
  const COMPOSE = `#version 300 es
precision highp float;
uniform sampler2D uField; uniform vec2 uRes; uniform float uTime; uniform vec3 uBg; uniform float uPaper;
out vec4 o;
float ign(vec2 p, float f) { p += 5.588238 * mod(f, 64.0); return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)); }
void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 L = max(texture(uField, frag / uRes).rgb, 0.0);
  vec3 dark = uBg + L * (1.0 - uBg);
  float strength = clamp(max(L.r, max(L.g, L.b)), 0.0, 1.0);
  vec3 paper = uBg * (1.0 - strength) + L * 0.96;
  vec3 col = mix(dark, paper, uPaper);
  col += (ign(frag, floor(uTime * 24.0)) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
  const hexRGB = (v, d) => { const m = v.trim().match(/^#([0-9a-f]{6})$/i); if (!m) return d; const n = parseInt(m[1], 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  function program(gl, frag) {
    const sh = (type, src) => { const s = gl.createShader(type); if (!s) return null; gl.shaderSource(s, src); gl.compileShader(s); if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s; gl.deleteShader(s); return null; };
    const v = sh(gl.VERTEX_SHADER, VERT), f = sh(gl.FRAGMENT_SHADER, frag), p = gl.createProgram();
    if (!v || !f || !p) return null;
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p); gl.deleteShader(v); gl.deleteShader(f);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : (gl.deleteProgram(p), null);
  }
  function startAurora() {
    const wrap = $(".aurora"), cv = $(".aurora-canvas");
    const gl = cv.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false });
    if (!gl) return;
    const pa = program(gl, FIELD), pb = program(gl, COMPOSE);
    if (!pa || !pb) return;
    const uni = (p, names) => Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)]));
    const ua = uni(pa, ["uRes", "uTime", "uC1", "uC2", "uSize", "uAngle", "uMouse", "uOn", "uReach", "uVel"]);
    const ub = uni(pb, ["uField", "uRes", "uTime", "uBg", "uPaper"]);
    gl.bindVertexArray(gl.createVertexArray());
    const fb = gl.createFramebuffer();
    let tex = null, tw = 0, th = 0, half = !!gl.getExtension("EXT_color_buffer_float");
    const target = (w, h) => {
      if (w === tw && h === th && tex) return;
      for (let i = 0; i < 2; i++) {
        tex && gl.deleteTexture(tex);
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, half ? gl.RGBA16F : gl.RGBA8, w, h, 0, gl.RGBA, half ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (ok || !half) break;
        half = false;
      }
      tw = w; th = h;
    };
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(hover: none), (pointer: coarse)").matches;
    const css = getComputedStyle(document.documentElement);
    let bg = [0.05, 0.05, 0.06], c1 = [0.3, 0.9, 0.7], c2 = [0.6, 0.5, 1];
    let dirty = true;
    const readColors = () => {
      bg = hexRGB(css.getPropertyValue("--bg"), bg);
      c1 = hexRGB(css.getPropertyValue("--aurora-1"), c1);
      c2 = hexRGB(css.getPropertyValue("--aurora-2"), c2);
      dirty = true;
    };
    let W = innerWidth, H = innerHeight, vis = 1, time = 0, last = -1, lost = false;
    let mx = 0, my = 0, sx = 0, sy = 0, vx = 0, vy = 0, on = 0, inside = false;
    const fade = () => {
      const k = Math.min(1, Math.max(0, 1 - scrollY / (innerHeight * 0.85)));
      vis = k * k * (3 - 2 * k);
      wrap.style.opacity = vis.toFixed(3);
      wrap.style.visibility = vis < 0.005 ? "hidden" : "visible";
    };
    const frame = (dt) => {
      const still = rm.matches;
      if (!still) time = (time + dt) % 3600;
      const dpr = Math.min(devicePixelRatio || 1, coarse ? 1 : 1.5);
      const cw = Math.max(1, Math.round(W * dpr)), ch = Math.max(1, Math.round(H * dpr));
      if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
      target(Math.max(1, Math.round(cw * (coarse ? 0.4 : 0.5))), Math.max(1, Math.round(ch * (coarse ? 0.4 : 0.5))));
      const want = inside && !still ? 1 : 0;
      if (want && on < 0.02) { sx = mx; sy = my; }
      on += (want - on) * (1 - Math.exp(-dt * 5));
      const f = 1 - Math.exp(-dt * 16);
      const nx = sx + (mx - sx) * f, ny = sy + (my - sy) * f;
      if (dt > 0) { const k = 1 - Math.exp(-dt * 8); vx += ((nx - sx) / dt - vx) * k; vy += ((ny - sy) / dt - vy) * k; }
      sx = nx; sy = ny;
      const sp = Math.hypot(vx, vy) / H, cap = sp > 3 ? 3 / sp : 1;
      const lum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, tw, th);
      gl.useProgram(pa);
      gl.uniform2f(ua.uRes, tw, th); gl.uniform1f(ua.uTime, time);
      gl.uniform3f(ua.uC1, c1[0], c1[1], c1[2]); gl.uniform3f(ua.uC2, c2[0], c2[1], c2[2]);
      gl.uniform1f(ua.uSize, 1); gl.uniform1f(ua.uAngle, -Math.PI);
      gl.uniform2f(ua.uMouse, (sx - W / 2) / H, (H / 2 - sy) / H);
      gl.uniform1f(ua.uOn, on); gl.uniform1f(ua.uReach, 240 / H);
      gl.uniform2f(ua.uVel, (vx / H) * cap, (-vy / H) * cap);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, cw, ch);
      gl.useProgram(pb);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(ub.uField, 0); gl.uniform2f(ub.uRes, cw, ch); gl.uniform1f(ub.uTime, time);
      gl.uniform3f(ub.uBg, bg[0], bg[1], bg[2]);
      gl.uniform1f(ub.uPaper, Math.min(1, Math.max(0, (lum - 0.35) / 0.3)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (t) => {
      requestAnimationFrame(loop);
      if (lost || vis < 0.005 || document.hidden) { last = -1; return; }
      if (coarse && last >= 0 && t - last < 31) return;
      const dt = last < 0 ? 0 : Math.min(0.05, (t - last) / 1000);
      last = t;
      if (rm.matches && on < 0.01) { if (!dirty) return; dirty = false; }
      frame(dt);
    };
    new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    readColors(); fade();
    addEventListener("scroll", () => { fade(); dirty = true; }, { passive: true });
    addEventListener("resize", () => { W = innerWidth; H = innerHeight; fade(); dirty = true; });
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; inside = true; }, { passive: true });
    document.addEventListener("pointerout", (e) => { if (!e.relatedTarget) inside = false; });
    cv.addEventListener("webglcontextlost", (e) => { e.preventDefault(); lost = true; });
    cv.addEventListener("webglcontextrestored", () => location.reload());
    cv.dataset.ready = "true";
    requestAnimationFrame(loop);
  }
  function initAurora() {
    const go = () => setTimeout(startAurora, 1500);
    document.readyState === "complete" ? go() : addEventListener("load", go, { once: true });
  }

  /* Theme toggle (light is the default look; dark is a navy + sky variant). */
  function initTheme() {
    const btn = $("[data-theme-toggle]");
    const paint = () => {
      const dark = document.documentElement.classList.contains("dark");
      btn.innerHTML = dark ? ico("moon", 18) : ico("sun", 18);
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };
    paint();
    btn.addEventListener("click", () => {
      const flip = () => {
        const dark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", dark);
        try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
        paint();
      };
      document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches ? document.startViewTransition(flip) : flip();
    });
  }

  /* Nav: active-section highlight with a sliding pill, "Other" dropdown, mobile menu. */
  function initNav() {
    const ul = $("[data-nav]"), ind = $("[data-nav-ind]");
    let current = "";
    const paint = (id, animate) => {
      current = id;
      $$("a[data-id]", ul).forEach((a) => {
        const on = a.dataset.id === id;
        a.classList.toggle("text-text", on);
        a.classList.toggle("text-muted", !on);
        a.classList.toggle("hover:text-text", !on);
        on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
      });
      const a = $(`[data-id="${id}"]`, ul);
      if (!a) return gsap.set(ind, { opacity: 0 });
      const props = { x: a.offsetLeft, width: a.offsetWidth, opacity: 1 };
      animate && prefersMotion() ? gsap.to(ind, { ...props, duration: 0.45, ease: "power3.out" }) : gsap.set(ind, props);
    };
    if (PAGE === "home") {
      // Highlight the section in view; Tech highlights belong to About.
      const ids = ["top", "about", "skills", "experience", "work", "multimedia", "credentials"];
      let tops = [];
      const measure = () => { const y = scrollY; tops = ids.flatMap((id) => { const el = document.getElementById(id); return el ? [[id, el.getBoundingClientRect().top + y]] : []; }); };
      const update = () => {
        const probe = scrollY + innerHeight * 0.4;
        let id = "top";
        for (const [k, top] of tops) if (top <= probe) id = k === "skills" ? "about" : k;
        if (id !== current) paint(id, true);
      };
      measure(); update(); paint(current, false);
      ST.create({ start: 0, end: "max", onUpdate: update, onRefresh: () => { measure(); update(); } });
    } else paint("", false);
    addEventListener("resize", () => paint(current, false));

    // Mobile menu
    const burger = $("[data-burger]"), mobile = $("#mobile-menu");
    const setMenu = (o) => {
      mobile.hidden = !o;
      burger.setAttribute("aria-expanded", o);
      burger.setAttribute("aria-label", o ? "Close menu" : "Open menu");
      burger.innerHTML = ico(o ? "x" : "menu", 18);
    };
    burger.addEventListener("click", () => setMenu(mobile.hidden));
    $$("a", mobile).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* Smooth in-page scrolling (same ease and offset as the original). */
  function initAnchors() {
    document.addEventListener("click", (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = e.target.closest('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!a || !id || !prefersMotion()) return;
      const target = id === "top" ? 0 : document.getElementById(id);
      if (target === null) return;
      e.preventDefault();
      gsap.to(window, { duration: 0.9, ease: "power3.inOut", scrollTo: { y: target, offsetY: id === "top" ? 0 : 72, autoKill: true }, onComplete: () => history.replaceState(null, "", `#${id}`) });
    });
    const hash = location.hash.slice(1);
    if (hash && hash !== "top") {
      let live = true;
      const stop = () => (live = false);
      [200, 900, 1800].forEach((t) => setTimeout(() => live && document.getElementById(hash)?.scrollIntoView(), t));
      ["wheel", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, stop, { once: true, passive: true }));
    }
  }

  // Pause CSS animations in sections that are far off screen.
  function initOffscreen() {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("offscreen", !e.isIntersecting)), { rootMargin: "200px" });
    $$("main > section, footer").forEach((s) => io.observe(s));
  }

  /* =====================================================================
     Hero
     ===================================================================== */
  const QUESTIONS = ["What do you build?", "How can I contact you?", "What are your skills?"];
  const Hero = () => `
  <section id="top" class="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1040px] flex-col items-center px-5 pb-10 pt-10 text-center md:pt-14">
    <div class="hero-avatar relative size-24 [perspective:520px]">
      <span aria-hidden="true" class="avatar-glow absolute -inset-3 rounded-full bg-accent2/30 blur-xl"></span>
      <div class="avatar-float relative size-full">
        <img src="${BASE + P.avatar}" alt="Photo of ${esc(P.name)}" width="96" height="96" fetchpriority="high" draggable="false" class="avatar-tilt size-full cursor-pointer select-none rounded-full border border-border object-cover [transform-style:preserve-3d]">
      </div>
    </div>
    <h1 aria-label="Hi, I'm ${esc(P.name)}" class="mt-6 text-[clamp(32px,6vw,56px)] font-bold leading-[1.1] tracking-tight [perspective:600px]">
      <span aria-hidden="true" class="hero-hi mr-[0.28em] inline-block">Hi, I'm</span><span class="name-grad">${P.name.split(" ").map((w, i) => `${i ? " " : ""}<span aria-hidden="true" class="inline-block whitespace-nowrap">${[...w].map((ch) => `<span class="hero-letter name-letter inline-block">${esc(ch)}</span>`).join("")}</span>`).join("")}</span>
    </h1>
    <p class="hero-sub mt-3 max-w-xl text-lg text-muted"><span class="font-semibold text-text">${esc(P.role)}.</span> ${esc(P.tagline)}</p>
    <div class="hero-cta mt-6 flex flex-wrap justify-center gap-3">
      <a href="${CONTACT_HREF}" class="${BTN_SOLID}">Hire me</a>
      <a href="#work" class="${BTN_OUTLINE}">See my work</a>
    </div>
    <div class="hero-chat w-full">
      <div class="mx-auto mt-8 flex h-[340px] w-full max-w-[760px] flex-col rounded-[28px] border border-border bg-surface/70 p-4">
        <div data-chat-log aria-live="polite" class="flex flex-1 flex-col gap-3 overflow-y-auto px-2 py-2"><p data-chat-empty class="m-auto text-lg text-muted">Ask me anything about ${esc(P.first)}...</p></div>
        <div class="flex flex-wrap justify-center gap-2 py-3">${QUESTIONS.map((q) => `<button type="button" data-ask class="rounded-full border border-border bg-bg/60 px-3 py-1 text-sm text-muted hover:border-accent hover:text-accent">${q}</button>`).join("")}</div>
        <form data-chat-form class="flex items-center gap-2 rounded-full border border-border bg-bg/70 py-1.5 pl-5 pr-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
          <input maxlength="500" aria-label="Ask anything about ${esc(P.first)}" placeholder="Ask anything about ${esc(P.first)}..." class="flex-1 bg-transparent rounded-none py-2 text-base outline-none! placeholder:text-muted">
          <button type="submit" disabled aria-label="Send" class="grid size-10 place-items-center rounded-full bg-accent text-accent-contrast transition-opacity disabled:opacity-40">${ico("arrow-up", 18)}</button>
        </form>
      </div>
    </div>
    <a href="#about" class="hero-cue mt-8 flex flex-col items-center gap-1 text-sm text-muted hover:text-text">Scroll to explore${ico("arrow-down", 16, "hero-cue-arrow")}</a>
  </section>`;

  function initHero() {
    const sec = $("#top"), name = $(".name-grad", sec);
    // Gradient runs continuously across all letters, even across line breaks.
    const lay = () => {
      const letters = $$(".name-letter", name), rowStart = new Map();
      letters.forEach((l) => rowStart.set(l.offsetTop, Math.min(rowStart.get(l.offsetTop) ?? Infinity, l.offsetLeft)));
      let w = 0;
      letters.forEach((l) => { const x = l.offsetLeft - (rowStart.get(l.offsetTop) ?? 0); l.style.setProperty("--x", `${x}px`); w = Math.max(w, x + l.offsetWidth); });
      name.style.setProperty("--w", `${Math.max(w, 1)}px`);
    };
    lay();
    new ResizeObserver(lay).observe(name.parentElement);
    document.fonts?.ready.then(lay);

    const preloading = document.documentElement.classList.contains("preloading");
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      const play = () => tl.play(0);
      if (preloading && !window.__preloaderLeaving) { tl.pause(); addEventListener("preloader:leave", play, { once: true }); }
      tl.from(".hero-avatar", { scale: 0.6, opacity: 0, duration: 0.7 })
        .from(".hero-hi", { opacity: 0, y: 12, duration: 0.3 }, 0.1)
        .from(".hero-letter", { opacity: 0, y: 18, rotateX: -50, duration: 0.4, stagger: 0.02 }, 0.15)
        .from(".hero-sub", { y: 14, duration: 0.5 }, 0.2)
        .from(".hero-cta", { opacity: 0, y: 12, duration: 0.4 }, 0.3)
        .from(".hero-chat", { opacity: 0, y: 24, scale: 0.98, duration: 0.5 }, 0.3)
        .from(".hero-cue", { opacity: 0, duration: 0.4 }, 0.8);
      const cue = gsap.to(".hero-cue-arrow", { y: 6, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      const float = gsap.to(".avatar-float", { y: -6, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      const glow = gsap.to(".avatar-glow", { opacity: 0.35, scale: 1.12, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      const av = $(".avatar-tilt", sec);
      const squish = gsap.timeline({ paused: true })
        .to(av, { scale: 0.9, rotate: -6, duration: 0.12, ease: "power2.out" })
        .to(av, { scale: 1.08, rotate: 7, duration: 0.2, ease: "power2.inOut" })
        .to(av, { scale: 1, rotate: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
      av.addEventListener("click", () => squish.restart());
      const ry = gsap.quickTo(av, "rotationY", { duration: 0.7, ease: "power3.out" });
      const rx = gsap.quickTo(av, "rotationX", { duration: 0.7, ease: "power3.out" });
      if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
        addEventListener("pointermove", (e) => {
          const r = av.getBoundingClientRect();
          const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 420));
          const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 420));
          ry(nx * 22); rx(-ny * 22);
        }, { passive: true });
        document.documentElement.addEventListener("pointerleave", () => { rx(0); ry(0); });
      }
      pauseOffscreen(sec, [cue, float, glow]);
    });
    initChat();
    window.__appReady = true;
    dispatchEvent(new Event("app:ready"));
  }

  function initChat() {
    const log = $("[data-chat-log]"), form = $("[data-chat-form]"), input = $("input", form), send = $("button", form);
    let busy = false;
    const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const bubble = (text, user) => {
      $("[data-chat-empty]", log)?.remove();
      const p = document.createElement("p");
      p.className = cx("bubble-in max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-left text-[15px]", user ? "ml-auto bg-accent text-accent-contrast" : "bg-bg/80");
      p.textContent = text;
      log.appendChild(p); scroll();
    };
    const answer = (q) => (C.answers.find(([re]) => re.test(q.toLowerCase())) || [0, C.fallback])[1];
    const ask = (raw) => {
      const q = raw.trim().slice(0, 500);
      if (!q || busy) return;
      bubble(q, true);
      input.value = ""; send.disabled = true; busy = true;
      const thinking = document.createElement("p");
      thinking.className = "bubble-in animate-pulse text-left text-sm text-muted";
      thinking.textContent = "Thinking...";
      log.appendChild(thinking); scroll();
      setTimeout(() => { thinking.remove(); bubble(answer(q), false); busy = false; send.disabled = !input.value.trim(); }, 650 + Math.random() * 450);
    };
    input.addEventListener("input", () => (send.disabled = busy || !input.value.trim()));
    form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
    $$("[data-ask]").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
  }

  /* =====================================================================
     About (bento)
     ===================================================================== */
  const H3 = (t) => `<h3 class="text-[28px] font-extrabold leading-none tracking-tight">${t}</h3><div class="mt-2 h-0.5 w-7 bg-accent2"></div>`;
  const darkHex = (h) => parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16) < 150;
  const Strip = (slugs, hidden) => `<ul ${hidden ? 'aria-hidden="true"' : ""} class="flex shrink-0 gap-6 pr-6 ${hidden ? "motion-reduce:hidden" : ""}">${slugs.map((s) => { const i = ICONS[s]; return `<li class="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-wider text-muted">${brand(s, 16, darkHex(i.hex) ? "currentColor" : "#" + i.hex)}${i.title}</li>`; }).join("")}</ul>`;

  const About = () => Section("about", "About", "About me", `
    <div class="mx-auto flex w-full max-w-[992px] flex-col gap-4">
      <div class="flex flex-col gap-4 md:flex-row">
        ${Reveal(cx(CARD, THIRD, "grid place-items-center p-4 text-center"), `<div>
          <p class="bg-gradient-to-b from-text to-muted bg-clip-text text-[30px] font-extrabold uppercase leading-[1.05] tracking-tight text-transparent [filter:drop-shadow(0_0_18px_color-mix(in_srgb,var(--text)_25%,transparent))]">${esc(P.name)}</p>
          <div aria-hidden="true" class="mx-auto my-2 h-px w-12 bg-border"></div>
          <p class="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">${esc(P.role)}</p></div>`)}
        ${Reveal(cx(CARD, TWO_THIRDS, "overflow-hidden"), `<div data-fan class="relative h-[290px] overflow-hidden sm:h-[190px] md:h-[144px]">
          <p class="pointer-events-none absolute inset-x-0 top-2 z-10 mx-auto w-fit rounded-full border border-accent2/30 bg-bg/60 px-3 py-1 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-accent2">Hover or tap to read more</p>
          ${C.aboutCards.map((c, i) => `<button type="button" data-fan-card style="left:${i * 31}%;will-change:transform" class="absolute top-[46px] flex h-[230px] w-[38%] sm:h-[180px] md:h-[160px] flex-col justify-start rounded-xl border p-3 text-left transition-[border-color,box-shadow,background-color,color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <span class="block text-center text-[13px] font-bold uppercase tracking-wide">${c.title}</span>
            <span class="mt-1.5 block text-center text-[12px] leading-snug transition-colors duration-500">${c.text}</span></button>`).join("")}
        </div>`)}
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        ${Reveal(cx(CARD, THIRD, "anim-host flex flex-col p-5"), `${H3(C.mindset.heading)}
          <p class="mt-3 text-[15px] leading-snug text-muted"><span class="font-semibold text-text">${C.mindset.text.split(",")[0]},</span>${C.mindset.text.slice(C.mindset.text.indexOf(",") + 1)}</p>
          <div class="flex flex-1 items-center py-4"><div data-stack class="relative mx-auto h-[196px] w-full max-w-[290px]" role="group" aria-label="What I am learning">
            ${C.mindset.stack.map((s, i) => `<div data-stack-card aria-hidden="${i !== 0}" style="will-change:transform, filter, opacity" class="absolute left-1/2 top-0 h-full w-[58%] -translate-x-1/2 overflow-hidden rounded-2xl border border-accent2/50 bg-surface">
              <div class="grid size-full place-items-center" style="background:${s.tone}">${brand(s.icon, 64, "white")}</div>
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-10"><p class="text-[13px] font-bold uppercase leading-tight tracking-wide text-white">${s.label}</p></div></div>`).join("")}
            <p data-stack-live class="sr-only" aria-live="polite">${C.mindset.stack[0].label}</p>
          </div></div>
          <p class="text-[15px] leading-snug text-muted">${C.mindset.closing}</p>`)}
        <div class="${cx(THIRD, "flex flex-col gap-4")}">
          ${Reveal(cx(CARD, "aspect-square overflow-hidden p-0"), `<img src="${BASE + P.portrait}" alt="Portrait of ${esc(P.name)}" width="480" height="480" loading="lazy" class="profile-photo size-full object-cover">`)}
          ${Reveal("anim-host flex-1", `<div data-loc class="relative h-full min-h-[143px] overflow-hidden rounded-card border border-border bg-surface/70">
            <div aria-hidden="true" class="absolute inset-0 opacity-70 [background-image:radial-gradient(color-mix(in_srgb,var(--text)_28%,transparent)_1.2px,transparent_1.4px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_at_70%_30%,#000,transparent_75%)]"></div>
            <div aria-hidden="true" class="scan absolute inset-y-0 left-0 w-px bg-accent2 shadow-[0_0_18px_2px_var(--accent2)]"></div>
            <span aria-hidden="true" class="absolute right-[22%] top-[28%] grid size-3 place-items-center"><span class="pin-ring absolute size-3 rounded-full bg-accent"></span><span class="relative size-2 rounded-full bg-accent"></span></span>
            <div class="relative flex h-full flex-col justify-end p-4">${ico("map-pin", 14, "mb-1 text-accent")}
              <p class="text-[20px] font-extrabold uppercase leading-tight tracking-tight">${C.location.city}, ${C.location.country}</p>
              <p class="mt-1 font-mono text-[12px] text-muted">${C.location.coords}</p>
              <p class="font-mono text-[12px] text-accent2">- ${C.location.timezone}</p></div></div>`)}
        </div>
        ${Reveal(cx(CARD, THIRD, "anim-host flex flex-col overflow-hidden pt-5"), `<div class="px-5">${H3(C.craft.heading)}
            <p class="mt-3 text-[15px] leading-snug text-muted"><span class="font-semibold text-text">${C.craft.text}</span></p>
            <span class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm mt-3 text-[13px]"><span aria-hidden="true" class="size-2 rounded-full bg-accent"></span>${C.craft.status}</span></div>
          <div class="flex flex-1 flex-col justify-center py-4">${C.craft.strips.map((s, i) => `<div data-strip="${i % 2}" role="group" aria-label="Technologies" class="overflow-hidden border-b border-border first:border-t bg-bg/40 py-3.5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"><div class="flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 motion-reduce:px-4">${Strip(s)}${Strip(s, true)}</div></div>`).join("")}</div>
          <p class="px-5 pb-5 text-[15px] leading-snug text-muted">${C.craft.closing}</p>`)}
      </div>
    </div>`);

  function initAbout() {
    // Fanned cards: one is raised; cycles every 3.4s while visible and not hovered.
    const fan = $("[data-fan]"), cards = $$("[data-fan-card]", fan);
    let active = 1, hovering = false, visible = false;
    const setActive = (n) => {
      active = n;
      const motion = prefersMotion();
      cards.forEach((el, i) => {
        const on = i === active;
        const props = { y: on ? -20 : 0, rotate: on ? (i % 2 ? 2.4 : -2.4) : 0, scale: on ? 1.02 : 1, zIndex: on ? 5 : i === 1 ? 3 : 2 };
        motion ? gsap.to(el, { ...props, duration: 0.9, ease: "power3.inOut", overwrite: "auto", force3D: true }) : gsap.set(el, props);
        el.setAttribute("aria-pressed", on);
        el.className = el.className.replace(/ (border-accent2\/70 bg-surface shadow-\S+|border-border bg-surface text-muted)$/, "") + (on ? " border-accent2/70 bg-surface shadow-[0_0_44px_-6px_color-mix(in_srgb,var(--accent2)_55%,transparent)]" : " border-border bg-surface text-muted");
        const [t, d] = el.children;
        t.className = cx("block text-center text-[13px] font-bold uppercase tracking-wide", on ? "text-text" : "text-text/80");
        d.className = cx("mt-1.5 block text-center text-[12px] leading-snug transition-colors duration-500", on ? "text-text/90" : "text-muted/80");
      });
    };
    setActive(1);
    cards.forEach((el, i) => ["pointerenter", "focus", "click"].forEach((ev) => el.addEventListener(ev, () => setActive(i))));
    fan.addEventListener("pointerenter", () => (hovering = true));
    fan.addEventListener("pointerleave", () => (hovering = false));
    if (prefersMotion()) {
      new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 }).observe(fan);
      setInterval(() => visible && !hovering && setActive((active + 1) % cards.length), 3400);
    }

    // Learning stack: carousel that advances while the card is hovered.
    const stack = $("[data-stack]"), sc = $$("[data-stack-card]", stack), live = $("[data-stack-live]", stack);
    let top = 0;
    const layStack = () => {
      const w = stack.clientWidth || 300, motion = prefersMotion();
      sc.forEach((el, i) => {
        const d = (i - top + sc.length) % sc.length;
        const props = { x: (d === 0 ? 0 : d === 1 ? 1 : -1) * w * 0.27, xPercent: -50, scale: d === 0 ? 1 : 0.82, opacity: d === 0 ? 1 : 0.55, filter: d === 0 ? "blur(0px)" : "blur(3px)", zIndex: d === 0 ? 3 : 1 };
        motion ? gsap.to(el, { ...props, duration: 1, ease: "power3.inOut", overwrite: "auto", force3D: true }) : gsap.set(el, props);
        el.setAttribute("aria-hidden", i !== top);
      });
      live.textContent = C.mindset.stack[top].label;
    };
    sc.forEach((el) => el.classList.remove("-translate-x-1/2"));
    gsap.set(sc, { xPercent: -50 });
    layStack();
    if (prefersMotion()) {
      const host = stack.closest(".anim-host");
      let timer = 0;
      const next = () => { top = (top + 1) % sc.length; layStack(); };
      host.addEventListener("pointerenter", () => { next(); clearInterval(timer); timer = setInterval(next, 2800); });
      host.addEventListener("pointerleave", () => clearInterval(timer));
    }

    // Location card: scan line and pin pulse play while hovered.
    const loc = $("[data-loc]");
    gsap.matchMedia().add(MOTION, () => {
      const scan = gsap.fromTo($(".scan", loc), { x: 0 }, { x: () => loc.clientWidth || 300, duration: 5.5, ease: "sine.inOut", repeat: -1, yoyo: true });
      refreshOnResize(scan);
      const pin = gsap.to($(".pin-ring", loc), { scale: 2.4, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1, transformOrigin: "50% 50%" });
      playOnHover(loc, [scan, pin]);
    });

    // Craft: logo strips scroll while hovered (alternating directions).
    $$("[data-strip]").forEach((wrap) => {
      const row = wrap.firstElementChild, reverse = wrap.dataset.strip === "1";
      gsap.matchMedia().add(MOTION, () => {
        const half = () => row.scrollWidth / 2;
        const t = gsap.fromTo(row, { x: () => (reverse ? -half() : 0) }, { x: () => (reverse ? 0 : -half()), duration: () => half() / 32, ease: "none", repeat: -1 });
        refreshOnResize(t);
        playOnHover(wrap, [t]);
      });
    });
  }

  /* =====================================================================
     Experience and Credentials (same card as the original "Where I studied")
     ===================================================================== */
  const initials = (s) => s.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 3).map((w) => w[0]).join("");
  const Entry = ({ badge, title, years, line, place, focus }) => `<li>${Reveal("rounded-card border border-border bg-surface/70 px-5 pt-5 md:px-7", `
      <div class="flex items-start gap-3">
        <span aria-hidden="true" class="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-bg/60 font-mono text-[11px] font-bold text-muted">${badge}</span>
        <div class="min-w-0 flex-1"><h3 class="text-lg font-bold leading-snug md:text-xl">${title}</h3>${years ? `<p class="mt-1 text-right font-mono text-[11px] uppercase tracking-wider text-muted md:text-xs">${years}</p>` : ""}</div>
      </div>
      <div class="mt-3 flex flex-col gap-x-6 gap-y-1 border-t border-border py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[15px]">${line}</p>${place ? `<p class="font-mono text-xs text-muted">${place}</p>` : ""}
      </div>
      ${focus ? `<div class="border-t border-border py-3"><p class="font-mono text-[11px] uppercase tracking-wider text-muted">Focus</p><p class="mt-1.5 text-[15px] leading-snug">${focus}</p></div>` : '<div class="pb-2"></div>'}`)}</li>`;
  const Experience = () => Section("experience", "Experience", "My Experience", `<ol class="mx-auto flex max-w-[760px] flex-col gap-4">${C.experience.map((e) => Entry({ badge: e.badge || initials(e.org), title: e.title, years: e.years, line: e.org })).join("")}</ol>`);
  /* =====================================================================
     Multimedia: video cards that open a player (Google Drive embed)
     ===================================================================== */
  const driveEmbed = (id) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
  const Multimedia = () => Section("multimedia", "Multimedia", "Multimedia", `
    <ul class="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2 xl:grid-cols-3">${C.multimedia.map((m, i) => `<li>${Reveal("h-full", `
      <button type="button" data-media="${i}" class="media-card group block h-full w-full overflow-hidden rounded-card border border-border bg-surface/70 text-left transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <span class="relative block aspect-video overflow-hidden bg-bg">
          ${m.poster ? `<img src="${BASE + m.poster}" alt="" width="960" height="540" loading="lazy" decoding="async" style="object-position:${m.posterPosition || "center"}" class="size-full object-cover transition-transform duration-700 group-hover:scale-105">` : `<span class="proj-cover" style="background:linear-gradient(135deg,#0ea5e9,#0c4a6e)"><span><b>${esc(m.title)}</b></span></span>`}
          <span aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></span>
          <span aria-hidden="true" class="media-play absolute left-1/2 top-1/2 grid size-16 place-items-center rounded-full bg-surface/90 text-accent shadow-2xl backdrop-blur transition-transform duration-500">${ico(m.file ? "file-text" : "play", 26)}</span>
          ${m.duration ? `<span class="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-xs text-white">${esc(m.duration)}</span>` : ""}
        </span>
        <span class="block p-5">
          <span class="block text-xs uppercase tracking-[0.2em] text-muted">${esc(m.category)}${m.year ? ` · ${esc(m.year)}` : ""}</span>
          <span class="mt-1 block text-xl font-semibold tracking-tight">${esc(m.title)}</span>
          ${m.summary ? `<span class="mt-1.5 block text-[15px] leading-snug text-muted">${esc(m.summary)}</span>` : ""}
          ${m.tags?.length ? `<span class="mt-4 flex flex-wrap gap-1.5">${m.tags.map((t) => `<span class="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">${esc(t)}</span>`).join("")}</span>` : ""}
        </span>
      </button>`)}</li>`).join("")}</ul>
    <dialog data-player aria-label="Video player" class="media-dialog">
      <div class="relative w-full overflow-hidden rounded-card border border-border bg-surface shadow-2xl">
        <div class="flex items-center justify-between gap-4 px-5 py-3"><p data-player-title class="truncate font-semibold"></p>
          <a data-player-drive href="#" target="_blank" rel="noreferrer" class="ml-auto shrink-0 text-sm font-semibold text-accent hover:underline">Open in new tab</a>
          <button type="button" data-player-close aria-label="Close video" class="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-bg/60 hover:border-accent">${ico("x", 18)}</button></div>
        <div data-player-box class="aspect-video w-full bg-black"><iframe data-player-frame title="" allow="autoplay; fullscreen; picture-in-picture" class="size-full border-0"></iframe></div>
      </div>
    </dialog>`);
  function initMultimedia() {
    const dlg = $("[data-player]");
    if (!dlg) return;
    // Warm the cache with the card images once the page is idle, so they are ready before the section scrolls in.
    const warm = () => C.multimedia.forEach((m) => m.poster && (new Image().src = BASE + m.poster));
    "requestIdleCallback" in window ? requestIdleCallback(warm, { timeout: 4000 }) : setTimeout(warm, 2500);
    const frame = $("[data-player-frame]", dlg), title = $("[data-player-title]", dlg);
    let opener = null;
    dlg.addEventListener("close", () => { frame.src = "about:blank"; document.documentElement.style.overflow = ""; opener?.focus(); });
    $$("[data-media]").forEach((b) => b.addEventListener("click", () => {
      const m = C.multimedia[+b.dataset.media];
      opener = b;
      title.textContent = m.title;
      frame.title = m.title;
      $("[data-player-drive]", dlg).href = m.drive ? `https://drive.google.com/file/d/${encodeURIComponent(m.drive)}/view` : m.file ? BASE + m.file : m.embed;
      const isFile = !!m.file;
      $("[data-player-box]", dlg).classList.toggle("aspect-video", !isFile);
      $("[data-player-box]", dlg).style.height = isFile ? "min(78vh, 900px)" : "";
      frame.src = m.drive ? driveEmbed(m.drive) : isFile ? BASE + m.file : m.embed;
      document.documentElement.style.overflow = "hidden";
      dlg.showModal();
      if (prefersMotion()) gsap.fromTo(dlg.firstElementChild, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: EASE.out });
    }));
    $("[data-player-close]", dlg).addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  const Credentials = () => Section("credentials", "Credentials", "Where I studied", `<ol class="mx-auto flex max-w-[760px] flex-col gap-4">${C.credentials.map((e) => Entry({ badge: initials(e.school), title: e.title, years: e.years, line: `${e.school}${e.detail ? ` · ${e.detail}` : ""}`, place: e.place, focus: e.focus })).join("")}</ol>`);

  /* =====================================================================
     Skills: pill marquees + drag-to-spin globe
     ===================================================================== */
  const Pills = (items, hidden) => `<ul ${hidden ? 'aria-hidden="true"' : ""} class="${cx("flex shrink-0 gap-3 pr-3", hidden && "motion-reduce:hidden")}">${items.map((s) => `<li data-pill style="--c:${C.kindColor[s.kind]}" class="group flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface/80 px-5 py-3 font-mono text-[15px] text-text transition-[background-color,color,transform,border-color] duration-300 data-[active=true]:scale-110 data-[active=true]:border-transparent data-[active=true]:bg-[var(--c)] data-[active=true]:text-[#0c0d10]"><span aria-hidden="true" class="size-2 rounded-full bg-[var(--c)] transition-colors duration-300 group-data-[active=true]:bg-[#0c0d10]"></span>${s.name}</li>`).join("")}</ul>`;
  const Marquee = (items, dir, speed, label) => `<div data-marquee data-dir="${dir}" data-speed="${speed}" role="group" aria-label="${label}" class="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"><div class="flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-6">${Pills(items)}${Pills(items, true)}</div></div>`;
  const Skills = () => Section("skills", "Tech stack", "Tech highlights", `<div>
    ${Marquee(C.skillsTop, -1, 45, "Front-end skills")}
    <div class="my-6"><canvas data-globe aria-hidden="true" class="mx-auto block aspect-square w-full max-w-[640px] cursor-grab touch-pan-y active:cursor-grabbing"></canvas>
      <ul class="sr-only">${C.globe.map((g) => `<li>${g.name}</li>`).join("")}</ul>
      <p class="mt-2 text-center text-sm text-muted">Drag to spin</p></div>
    ${Marquee(C.skillsBottom, 1, 38, "Python, tools and what I am learning")}</div>`);

  function initMarquees() {
    $$("[data-marquee]").forEach((wrap) => {
      const row = wrap.firstElementChild, dir = +wrap.dataset.dir, speed = +wrap.dataset.speed;
      gsap.matchMedia().add(MOTION, () => {
        const half = () => row.scrollWidth / 2;
        const tw = gsap.fromTo(row, { x: () => (dir < 0 ? 0 : -half()) }, { x: () => (dir < 0 ? -half() : 0), duration: () => half() / speed, ease: "none", repeat: -1 });
        refreshOnResize(tw);
        ST.create({ trigger: wrap, start: "top bottom", end: "bottom top", onToggle: (s) => tw.paused(!s.isActive) });
        wrap.addEventListener("pointerenter", () => gsap.to(tw, { timeScale: 0.2, duration: 0.4 }));
        wrap.addEventListener("pointerleave", () => gsap.to(tw, { timeScale: 1, duration: 0.4 }));
        // Highlight the pill nearest the centre.
        const pills = $$("[data-pill]", wrap);
        let centres = [], width = 0, cur = -1, lastT = 0;
        const measure = () => { width = wrap.clientWidth; centres = pills.map((p) => p.offsetLeft + p.offsetWidth / 2); };
        measure();
        const ro = new ResizeObserver(measure); ro.observe(wrap);
        const tick = (t) => {
          if (t - lastT < 0.066) return;
          lastT = t;
          const x = gsap.getProperty(row, "x"), mid = width / 2;
          let best = 0, d = Infinity;
          centres.forEach((c, i) => { const k = Math.abs(c + x - mid); if (k < d) { d = k; best = i; } });
          if (best !== cur) { cur >= 0 && pills[cur].removeAttribute("data-active"); pills[best].setAttribute("data-active", "true"); cur = best; }
        };
        gsap.ticker.add(tick);
        return () => { gsap.ticker.remove(tick); ro.disconnect(); tw.kill(); cur >= 0 && pills[cur].removeAttribute("data-active"); };
      });
    });
  }

  const lumin = (hex) => { const h = hex.replace("#", ""); const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contrast = (a, b) => { const [x, y] = [lumin(a), lumin(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  function initGlobe() {
    const cv = $("[data-globe]"), ctx = cv.getContext("2d");
    if (!ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = C.globe.length;
    const pts = C.globe.map((g, i) => {
      const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5)), ic = ICONS[g.slug];
      return { name: g.name, hex: `#${ic.hex}`, path: new Path2D(ic.path), x: Math.cos(a) * r, y, z: Math.sin(a) * r };
    });
    let S = 0, yaw = 0.6, pitch = -0.28, tYaw = yaw, tPitch = pitch, spin = still ? 0 : 0.21, vYaw = spin, vPitch = 0;
    let drag = false, px = 0, py = 0, pt = 0, hover = -1, raf = 0, on = true, last = 0;
    const glow = pts.map(() => 0);
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); S = cv.clientWidth; cv.width = S * d; cv.height = S * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const rot = (x, y, z) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const X = x * cy + z * sy, Z = -x * sy + z * cy; return { x: X, y: y * cp - Z * sp, z: y * sp + Z * cp }; };
    let TEXT = "", MUTED = "", ACC = "", BG = "";
    const colors = () => { const s = getComputedStyle(document.documentElement); TEXT = s.getPropertyValue("--text").trim(); MUTED = s.getPropertyValue("--muted").trim(); ACC = s.getPropertyValue("--accent2").trim(); BG = s.getPropertyValue("--bg").trim(); };
    colors();
    new MutationObserver(() => { colors(); still && draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const draw = () => {
      const R = S * 0.34, c = S / 2;
      ctx.clearRect(0, 0, S, S);
      const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.35, R * 0.1, c, c, R);
      g.addColorStop(0, `${ACC}22`); g.addColorStop(1, `${ACC}05`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = ACC;
      const bands = [new Path2D(), new Path2D(), new Path2D()], alpha = [0.08, 0.17, 0.3];
      const seg = (a, b) => { const z = (a.z + b.z) / 2, p = bands[z < -0.25 ? 0 : z < 0.35 ? 1 : 2]; p.moveTo(c + a.x * R, c + a.y * R); p.lineTo(c + b.x * R, c + b.y * R); };
      for (const lat of [-60, -30, 0, 30, 60]) {
        const t = (lat * Math.PI) / 180, cr = Math.cos(t), sr = Math.sin(t);
        let p = rot(cr, sr, 0);
        for (let i = 1; i <= 40; i++) { const a = (i / 40) * Math.PI * 2, q = rot(Math.cos(a) * cr, sr, Math.sin(a) * cr); seg(p, q); p = q; }
      }
      for (let m = 0; m < 8; m++) {
        const t = (m / 8) * Math.PI;
        let p = rot(0, -1, 0);
        for (let i = 1; i <= 40; i++) { const a = -Math.PI / 2 + (i / 40) * Math.PI * 2, q = rot(Math.cos(t) * Math.cos(a), Math.sin(a), Math.sin(t) * Math.cos(a)); seg(p, q); p = q; }
      }
      bands.forEach((p, i) => { ctx.globalAlpha = alpha[i]; ctx.stroke(p); });
      const order = pts.map((p, i) => ({ i, p, ...rot(p.x, p.y, p.z) })).sort((a, b) => a.z - b.z);
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (const o of order) {
        const depth = (o.z + 1) / 2, h = glow[o.i], X = c + o.x * R * 1.12, Y = c + o.y * R * 1.12;
        const s = S * (0.04 + depth * 0.04) * (1 + 0.25 * h);
        ctx.globalAlpha = Math.min(1, 0.1 + depth ** 1.6 * 0.95 + 0.4 * h);
        ctx.fillStyle = contrast(o.p.hex, BG) < 2.2 ? TEXT : o.p.hex;
        ctx.save(); ctx.translate(X - s / 2, Y - s / 2); ctx.scale(s / 24, s / 24); ctx.fill(o.p.path); ctx.restore();
        const lab = Math.min(1, Math.max(0, (depth - 0.82) / 0.12));
        if (lab > 0 || h > 0.01) {
          ctx.globalAlpha = Math.max(lab, h); ctx.fillStyle = MUTED;
          ctx.font = `700 ${Math.max(10, Math.round(S * 0.02))}px "JetBrains Mono", ui-monospace, monospace`;
          ctx.fillText(o.p.name.toUpperCase(), X, Y + s / 2 + 6);
        }
      }
      ctx.globalAlpha = 1;
    };
    const step = (t) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      if (drag) { const k = 1 - Math.exp(-dt * 22); yaw += (tYaw - yaw) * k; pitch += (tPitch - pitch) * k; }
      else { yaw += vYaw * dt; pitch += vPitch * dt; pitch = Math.max(-1.2, Math.min(1.2, pitch)); vPitch *= Math.exp(-dt * 3.2); vYaw += (spin - vYaw) * (1 - Math.exp(-dt * 1.6)); }
      const k = 1 - Math.exp(-dt * 12);
      for (let i = 0; i < glow.length; i++) glow[i] += (+(i === hover) - glow[i]) * k;
      draw();
      raf = on ? requestAnimationFrame(step) : 0;
    };
    const pick = (e) => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, R = S * 0.34, c = S / 2;
      let best = -1, d = S * 0.05;
      pts.forEach((p, i) => { const q = rot(p.x, p.y, p.z); if (q.z < -0.1) return; const k = Math.hypot(c + q.x * R * 1.12 - x, c + q.y * R * 1.12 - y); if (k < d) { d = k; best = i; } });
      return best;
    };
    size(); draw();
    if (!still) raf = requestAnimationFrame(step);
    new ResizeObserver(() => { size(); draw(); }).observe(cv);
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !still && !raf) { last = 0; raf = requestAnimationFrame(step); } }).observe(cv);
    cv.addEventListener("pointerdown", (e) => { drag = true; px = e.clientX; py = e.clientY; pt = performance.now(); tYaw = yaw; tPitch = pitch; vYaw = 0; vPitch = 0; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", (e) => {
      if (drag) {
        const now = performance.now(), dt = Math.max(0.001, (now - pt) / 1000), dx = e.clientX - px, dy = e.clientY - py;
        px = e.clientX; py = e.clientY; pt = now;
        tYaw += dx * 0.009; tPitch = Math.max(-1.2, Math.min(1.2, tPitch - dy * 0.009));
        vYaw += ((dx * 0.009) / dt - vYaw) * 0.35; vPitch += ((-dy * 0.009) / dt - vPitch) * 0.35;
      } else hover = pick(e);
      if (still) { yaw = tYaw; pitch = tPitch; draw(); }
    });
    const up = () => { drag = false; vYaw = Math.max(-6, Math.min(6, vYaw)); vPitch = Math.max(-6, Math.min(6, vPitch)); };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => { hover = -1; if (still) { glow.fill(0); draw(); } });
  }

  /* =====================================================================
     Projects: pinned 3D scroll gallery on desktop, cards elsewhere
     ===================================================================== */
  const cover = (p) => `<div class="proj-cover" style="background:${p.tone}"><div><b>${p.title}</b><span>${p.category}</span></div></div>`;
  const ProjectsDesktop = () => {
    const big = "font-bold leading-[0.86] tracking-[-0.05em] whitespace-nowrap text-[clamp(56px,8vw,120px)]";
    return `<section id="work" aria-labelledby="work-heading" class="relative w-full" style="height:380vh" data-gallery>
      <h2 id="work-heading" class="sr-only">Featured projects</h2>
      <div data-stage class="sticky top-0 h-svh min-h-[600px] w-full overflow-hidden" style="perspective:1300px;transform-style:preserve-3d;isolation:isolate">
        <div data-w1 aria-hidden="true" class="pointer-events-none absolute left-1/2 top-[56%] z-0 w-max opacity-0 will-change-transform"><div class="${big} text-text">FEATURED</div></div>
        <div data-w2 aria-hidden="true" class="pointer-events-none absolute left-1/2 top-[39%] z-0 w-max opacity-0 will-change-transform"><div class="${big} text-gradient">PROJECTS</div></div>
        <p data-blurb aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 p-4 text-center text-xs font-medium leading-tight text-muted opacity-0">Things I have built, and am still building.</p>
        <div class="absolute inset-0 z-10" style="transform-style:preserve-3d">${C.projects.map((p) => `<div data-card class="absolute left-1/2 top-1/2 opacity-0" style="transform-style:preserve-3d;backface-visibility:hidden;transform-origin:50% 50%"><div class="relative size-full overflow-hidden border border-border bg-gradient-to-br shadow-2xl" style="border-radius:16px;backface-visibility:hidden">${p.image ? `<img src="${p.image}" alt="${esc(p.imageAlt || p.title)}" draggable="false" class="pointer-events-none block size-full select-none object-cover">` : cover(p)}</div></div>`).join("")}</div>
        <div class="pointer-events-none absolute inset-0 z-[200]">${C.projects.map((p) => `<div data-cap class="absolute left-1/2 top-1/2 opacity-0" style="visibility:hidden"><div class="origin-top-left">
          <p class="text-xs uppercase tracking-[0.2em] text-muted">${p.n} · ${p.category}</p>
          <div class="mt-1 flex items-baseline justify-between gap-3"><h3 class="text-lg font-bold tracking-tight">${p.title}</h3>${p.href ? `<a href="${p.href}" target="_blank" rel="noreferrer" class="pointer-events-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline">View ${ico("external-link", 14)}<span class="sr-only">${p.title} (opens in a new tab)</span></a>` : ""}</div>
          <div data-tags class="mt-2 flex w-max items-center gap-1.5">${p.tags.map((t) => `<span class="whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">${t}</span>`).join("")}</div>
        </div></div>`).join("")}</div>
      </div></section>`;
  };
  const ProjectsList = () => Section("work", "Work", "Featured projects", `<ol class="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-2 xl:grid-cols-3">${C.projects.map((p) => `<li class="flex">${Reveal("flex w-full flex-col", `
    <div class="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted"><span>${p.n}</span><span aria-hidden="true" class="h-px w-8 bg-border"></span>${Label("", p.category)}</div>
    <h3 class="mt-2 text-3xl font-bold tracking-tight">${p.title}</h3>
    <div class="mt-4 flex flex-1 flex-col rounded-[28px] border border-border bg-gradient-to-br p-6 text-white" style="background:${p.tone}">
      <p class="mb-6 text-lg font-medium">${p.summary}</p>
      ${p.image ? `<img src="${p.image}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" style="object-position:${p.imagePosition || 'center'}" class="mt-auto aspect-[2.3/1] w-full rounded-xl border border-white/25 object-cover">` : `<div role="img" aria-label="${esc(p.title)} screenshot placeholder" class="mt-auto overflow-hidden rounded-xl border border-white/25 bg-black/30"><div class="flex gap-1.5 px-3 py-2" aria-hidden="true"><span class="size-2.5 rounded-full bg-white/50"></span><span class="size-2.5 rounded-full bg-white/50"></span><span class="size-2.5 rounded-full bg-white/50"></span></div><div class="grid aspect-[2.3/1] place-items-center text-sm text-white/90">Screenshot coming soon</div></div>`}
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-2">${p.tags.map((t) => `<span class="rounded-full border border-border px-3 py-1 text-sm text-muted">${t}</span>`).join("")}${p.href ? `<a href="${p.href}" target="_blank" rel="noreferrer" class="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">View ${ico("external-link", 14)}<span class="sr-only">${p.title} (opens in a new tab)</span></a>` : ""}</div>`)}</li>`).join("")}</ol>`);
  const GALLERY_MQ = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

  function initGallery() {
    const sec = $("[data-gallery]");
    if (!sec) return;
    const stage = $("[data-stage]", sec), w1 = $("[data-w1]", sec), w2 = $("[data-w2]", sec), blurb = $("[data-blurb]", sec);
    const cards = $$("[data-card]", sec), caps = $$("[data-cap]", sec), N = cards.length;
    const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b), mix = (a, b, t) => a + (b - a) * t;
    const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10); };
    let W = 0, H = 0, tagW = [];
    const measure = () => { const r = stage.getBoundingClientRect(); W = Math.max(Math.round(r.width), 1); H = Math.max(Math.round(r.height), 1); caps.forEach((c, i) => { const t = $("[data-tags]", c); if (t) tagW[i] = t.offsetWidth; }); };
    const render = (p) => {
      const cols = Math.min(3, N), rows = Math.ceil(N / cols);
      const maxW = Math.min(1160, Math.max(W - 96, 200));
      const rowH = (H * 0.84 - rows * 88 - (rows - 1) * 16) / rows;
      const cw = Math.max(90, Math.min((maxW - 16 * (cols - 1)) / cols, rowH * 1.6)), ch = cw / 1.6;
      const tagScale = Math.min(1, cw / (Math.max(0, ...tagW) || cw));
      const gridW = cols * cw + (cols - 1) * 16, gridH = rows * (ch + 88) + (rows - 1) * 16;
      const ow = Math.min(410, W * 0.28), oh = ow / 1.6;
      const rx = Math.min(570, W * 0.44), ry = Math.min(210, H * 0.3), rz = Math.min(520, W * 0.42);
      const inA = smooth(0, 0.2, p), wordsOn = inA * (1 - smooth(0.74, 0.94, p));
      const lift = mix(28, 0, inA), gap = Math.min(220, W * 0.5), spread = mix(W * 0.7, (gap + 32) / 2, inA);
      w1.style.opacity = String(wordsOn); w1.style.transform = `translate3d(calc(-100% - ${spread}px), calc(-50% + ${lift}px), 0)`;
      w2.style.opacity = String(wordsOn); w2.style.transform = `translate3d(${spread}px, calc(-50% - ${lift}px), 0)`;
      blurb.style.width = `${gap}px`; blurb.style.opacity = String(smooth(0.12, 0.25, p) * (1 - smooth(0.58, 0.82, p)));
      const enter = smooth(0, 0.17, p), orbit = smooth(0.05, 0.7, p);
      for (let i = 0; i < N; i++) {
        const el = cards[i], cap = caps[i];
        const rise = smooth(0.025 + i * 0.01, 0.18 + i * 0.012, p);
        const settle = smooth(0.56 + i * 0.009, Math.min(0.91 + i * 0.009, 0.99), p);
        const ang = (((i / N) * 360 - 125 + orbit * 310) * Math.PI) / 180;
        const ox = Math.sin(ang) * rx, oy = Math.cos(ang + 0.65) * ry - H * 0.025 - 40, oz = Math.cos(ang) * rz;
        const front = clamp((oz + rz) / Math.max(rz * 2, 1));
        const sc = mix(0.82, 1, front), op = mix(0.2, 1, front);
        const sx = ox - ow / 2, sy = oy - oh / 2 + (1 - rise) * H * 0.48;
        const col = i % cols, row = Math.floor(i / cols), inRow = Math.min(cols, N - row * cols);
        const gx = -gridW / 2 + col * (cw + 16) + ((cols - inRow) * (cw + 16)) / 2;
        const gy = H * 0.52 - H / 2 - gridH / 2 + row * (ch + 88 + 16);
        const w = mix(ow, cw, settle), h = mix(oh, ch, settle), x = mix(sx, gx, settle), y = mix(sy, gy, settle);
        const z = mix(oz, 0, settle), ryd = mix(-Math.sin(ang) * 62, 0, settle), rzd = mix(-Math.sin(ang) * 8, 0, settle);
        const s = mix(sc, 1, settle), o = clamp(mix(op * rise * enter, 1, settle)), W2 = w * 2, H2 = h * 2;
        el.style.width = `${W2}px`; el.style.height = `${H2}px`; el.style.opacity = String(o);
        el.style.zIndex = String(settle > 0.86 ? 100 + i : Math.round(100 + front * 800));
        el.style.transform = `translate3d(${x - (W2 - w) / 2}px, ${y - (H2 - h) / 2}px, ${z}px) rotateY(${ryd}deg) rotateZ(${rzd}deg) scale(${s / 2})`;
        if (cap) {
          const show = smooth(0.93, 1, p), inner = cap.firstElementChild;
          inner.style.width = `${cw / tagScale}px`; inner.style.transform = tagScale < 1 ? `scale(${tagScale})` : "";
          cap.style.width = `${cw}px`; cap.style.opacity = String(show); cap.style.visibility = show < 0.02 ? "hidden" : "visible";
          cap.style.transform = `translate3d(${gx}px, ${gy + ch + 10}px, 0)`;
        }
      }
    };
    let goal = 0, cur = 0, raf = 0, last = 0;
    const tick = (t) => {
      raf = 0;
      const dt = clamp((t - (last || t)) / 1000, 0, 0.064);
      last = t;
      const next = cur + (goal - cur) * (1 - Math.exp(-7 * dt));
      cur = Math.abs(goal - next) < 1e-4 ? goal : next;
      render(cur);
      cur === goal ? (last = 0) : (raf = requestAnimationFrame(tick));
    };
    const onScroll = () => { const r = sec.getBoundingClientRect(), span = Math.max(r.height - innerHeight, 1); goal = clamp((innerHeight * 0.55 - r.top) / span); raf ||= requestAnimationFrame(tick); };
    const onResize = () => { measure(); onScroll(); render(cur); };
    measure(); render(0);
    document.fonts?.ready.then(onResize);
    new IntersectionObserver(([e]) => { e.isIntersecting ? (addEventListener("scroll", onScroll, { passive: true }), onScroll()) : removeEventListener("scroll", onScroll); }, { rootMargin: "100% 0px 100% 0px" }).observe(sec);
    addEventListener("resize", onResize);
  }

  /* =====================================================================
     Contact page, footer
     ===================================================================== */
  const Contact = () => Section("contact", "Contact", "Let's work together", `<div class="text-center">
    <div class="mb-6 flex justify-center">${Face(96)}</div>
    <p class="mx-auto max-w-xl text-muted">Have a project, an opportunity or a question? The best way to reach me is email, <span class="text-text">${L.email}</span>.</p>
    <div class="mt-6 flex flex-wrap justify-center gap-3">
      <a href="${mailto()}" class="${BTN_SOLID}">Email me</a>
      <button type="button" data-copy aria-live="polite" class="${BTN_OUTLINE}">${ico("copy", 16)}Copy email</button>
      ${L.github ? `<a href="${L.github}" target="_blank" rel="noreferrer" class="${BTN_OUTLINE}">${ghIcon(16)}GitHub profile</a>` : ""}
      ${L.linkedin ? `<a href="${L.linkedin}" target="_blank" rel="noreferrer" class="${BTN_OUTLINE}">LinkedIn profile</a>` : ""}
    </div></div>`, 'style="min-height:calc(100svh - 12rem)"');
  function initCopy() {
    const b = $("[data-copy]");
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(L.email); } catch { const t = Object.assign(document.createElement("textarea"), { value: L.email }); document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
      b.innerHTML = `${ico("check", 16)}Copied`;
      setTimeout(() => (b.innerHTML = `${ico("copy", 16)}Copy email`), 2000);
    });
  }

  // Footer on every page: navigation, GitHub, email, resume.
  const Footer = () => `<footer class="mx-auto flex max-w-[1760px] flex-col items-center justify-between gap-4 px-5 min-[1280px]:px-[clamp(1.25rem,3vw,3.5rem)] py-8 text-sm text-muted md:flex-row">
    <p class="flex items-center gap-3">${Face(32)}<span><span class="font-bold text-text">${P.initials}</span> &nbsp;•&nbsp; © ${new Date().getFullYear()} ${P.name}</span></p>
    <nav aria-label="Footer" class="flex flex-wrap justify-center gap-4">${[...NAV, { label: "Contact", href: CONTACT_HREF }].map((n) => `<a href="${n.href}" class="hover:text-text">${n.label}</a>`).join("")}</nav>
    <div class="flex items-center gap-4">
      ${L.github ? `<a href="${L.github}" target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)" class="hover:text-text">${ghIcon()}</a>` : ""}
      <a href="${mailto()}" aria-label="Email" class="hover:text-text">${ico("mail", 20)}</a>
      ${L.resume ? `<a href="${BASE + L.resume}" target="_blank" rel="noreferrer" aria-label="Resume (PDF, opens in a new tab)" class="hover:text-text">${ico("file-text", 20)}</a>` : ""}
    </div></footer>`;

  /* =====================================================================
     Mount
     ===================================================================== */
  const desktopGallery = PAGE === "home" && matchMedia(GALLERY_MQ).matches;
  const root = document.getElementById("root");
  root.removeAttribute("data-shell");
  const MAIN = {
    home: () => `${Hero()}${About()}${Skills()}${Experience()}${desktopGallery ? ProjectsDesktop() : ProjectsList()}${Multimedia()}${Credentials()}`,
    contact: () => Contact(),
  }[PAGE]();
  root.innerHTML = `
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast">Skip to content</a>
    <div aria-hidden="true" class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"><div class="progress-bar h-full origin-left" style="transform:scaleX(0)"></div></div>
    <div aria-hidden="true" class="backdrop"><div class="backdrop-glow"></div><div class="backdrop-dots backdrop-dots-faint"></div><div class="backdrop-lit"></div></div>
    <div aria-hidden="true" class="aurora"><canvas class="aurora-canvas"></canvas></div>
    ${Header()}
    <main id="main">${MAIN}</main>
    ${Footer()}`;
  // Re-render the work section if the viewport crosses the desktop breakpoint.
  if (PAGE === "home") matchMedia(GALLERY_MQ).addEventListener("change", () => location.reload());

  initProgress();
  initBackdrop();
  initAurora();
  initTheme();
  initNav();
  initAnchors();
  initOffscreen();
  initSectionHeads();
  $$("[data-reveal]").forEach((el) => reveal(el));
  if (PAGE === "home") {
    initHero();
    initAbout();
    initMarquees();
    initGlobe();
    initGallery();
    initMultimedia();
  }
  if (PAGE === "contact") initCopy();
  const refresh = () => ST.refresh();
  document.fonts?.ready.then(refresh);
  addEventListener("load", refresh);
})();
