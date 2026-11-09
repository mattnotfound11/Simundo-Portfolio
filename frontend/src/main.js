/* Jan Louis Simundo — Portfolio
   Shared behaviour: loader, nav, page transitions, animations. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof gsap !== 'undefined';
  if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  const PAGES = [
    ['index.html', 'Home', 'home'],
    ['about.html', 'About', 'about'],
    ['skills.html', 'Skills', 'skills'],
    ['projects.html', 'Projects', 'projects'],
    ['contact.html', 'Contact', 'contact'],
  ];
  const current = document.body.dataset.page || 'home';
  const EMAIL = 'jsimundo@usa.edu.ph';

  /* ---------- inject chrome (bg, nav, footer) ---------- */
  const mail = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 8 9 6 9-6"/></svg>';
  const links = (cls) => PAGES.map(([h, t, id]) => `<a href="${h}" ${cls} data-id="${id}" ${id === current ? 'aria-current="page"' : ''}>${t}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip" href="#main">Skip to content</a>
    <div class="bg-aurora" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="cursor-glow" aria-hidden="true"></div>
    <div class="progress" aria-hidden="true"></div>
    <div class="nav-wrap"><nav class="nav" aria-label="Primary">
      <a href="index.html" class="logo glass" aria-label="Jan Louis Simundo, home"><b>JL</b><span>Simundo</span></a>
      <ul class="nav-links glass"><span class="nav-ind" aria-hidden="true"></span>${PAGES.map(([h, t, id]) => `<li><a href="${h}" data-id="${id}" ${id === current ? 'aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
      <a href="contact.html" class="nav-cta glass">${mail}Get in touch</a>
      <button class="burger glass" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </nav></div>
    <div class="drawer" aria-hidden="true">${links('')}</div>
    <div class="curtain" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <button class="to-top glass" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/></svg></button>
    <div class="toast" role="status" aria-live="polite"></div>`);

  document.body.insertAdjacentHTML('beforeend', `
    <footer><div class="wrap foot">
      <span><strong style="color:var(--ink)">JLS</strong> &nbsp;•&nbsp; © ${new Date().getFullYear()} Jan Louis Simundo</span>
      <nav aria-label="Footer">${PAGES.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
    </div></footer>`);

  /* ---------- toast + copy ---------- */
  const toast = $('.toast');
  let tt;
  const say = (m) => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2200); };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const done = () => say('Email copied: ' + EMAIL);
    (navigator.clipboard ? navigator.clipboard.writeText(EMAIL).then(done) : Promise.reject()).catch(() => {
      const t = Object.assign(document.createElement('textarea'), { value: EMAIL });
      document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done();
    });
  });

  /* ---------- nav indicator ---------- */
  const ind = $('.nav-ind');
  const navLinks = $$('.nav-links a');
  const moveInd = (a) => {
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1;
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.parentElement.offsetLeft}px)`;
  };
  const active = () => navLinks.find((a) => a.dataset.id === current);
  requestAnimationFrame(() => { ind.style.transition = 'none'; moveInd(active()); requestAnimationFrame(() => (ind.style.transition = '')); });
  navLinks.forEach((a) => { a.addEventListener('mouseenter', () => moveInd(a)); a.addEventListener('focus', () => moveInd(a)); });
  $('.nav-links').addEventListener('mouseleave', () => moveInd(active()));
  addEventListener('resize', () => moveInd(active()));

  /* ---------- mobile drawer ---------- */
  const burger = $('.burger'), drawer = $('.drawer');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* ---------- scroll progress, back-to-top, cursor glow ---------- */
  const bar = $('.progress'), top = $('.to-top'), glow = $('.cursor-glow');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    top.classList.toggle('show', scrollY > 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  if (matchMedia('(pointer:fine)').matches && !reduce) {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();
  }

  /* ---------- page transitions (curtain) ---------- */
  const cols = $$('.curtain i');
  const goTo = (href) => {
    if (reduce || !hasGsap) { location.href = href; return; }
    gsap.set(cols, { transformOrigin: '50% 100%' });
    gsap.to(cols, { scaleY: 1, duration: .55, ease: 'power3.inOut', stagger: .06, onComplete: () => { sessionStorage.setItem('jls-from', '1'); location.href = href; } });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/\.html$|\/$/.test(u.pathname)) return;
    if (u.pathname === location.pathname && !u.hash) return;
    e.preventDefault(); goTo(u.href);
  });
  addEventListener('pageshow', (e) => { if (e.persisted) gsap && gsap.set(cols, { scaleY: 0 }); });

  /* ---------- loader (first visit of the session) ---------- */
  const firstVisit = !sessionStorage.getItem('jls-seen') && current === 'home' && !reduce && hasGsap;
  const arrived = sessionStorage.getItem('jls-from');
  sessionStorage.removeItem('jls-from');

  const start = () => {
    document.body.classList.remove('is-loading');
    initPage();
  };

  if (firstVisit) {
    sessionStorage.setItem('jls-seen', '1');
    document.body.classList.add('is-loading');
    const L = document.createElement('div');
    L.className = 'loader';
    L.setAttribute('aria-label', 'Loading');
    L.innerHTML = `
      <div class="panel top"></div><div class="panel bot"></div>
      <div class="loader-inner">
        <div class="ld-stage">
          <div class="ld-rings"><span></span><span></span><span></span></div>
          <svg viewBox="0 0 560 190" aria-hidden="true">
            <defs>
              <clipPath id="ldclip"><text class="ld-text" x="280" y="150" text-anchor="middle">JLS</text></clipPath>
              <linearGradient id="ldg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0284c7"/></linearGradient>
            </defs>
            <text class="ld-text ld-outline" x="280" y="150" text-anchor="middle">JLS</text>
            <g clip-path="url(#ldclip)">
              <g class="ld-water" transform="translate(0 200)">
                <path class="ld-wave1" d="M-560 0 q70 -22 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V260 H-560Z"/>
                <path class="ld-wave2" d="M-560 14 q70 22 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V260 H-560Z"/>
              </g>
            </g>
          </svg>
        </div>
        <div class="ld-meta"><span class="ld-status">Booting portfolio</span><div class="ld-bar"><b></b></div><span class="ld-count">000%</span></div>
      </div>`;
    document.body.prepend(L);

    const water = $('.ld-water', L), w1 = $('.ld-wave1', L), w2 = $('.ld-wave2', L);
    const count = $('.ld-count', L), barEl = $('.ld-bar b', L), status = $('.ld-status', L);
    const steps = ['Booting portfolio', 'Compiling HTML', 'Importing python', 'Styling the frontend', 'Ready'];
    const state = { p: 0 };
    gsap.to($('.ld-outline', L), { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' });
    gsap.to(w1, { x: 140, duration: 1.4, ease: 'none', repeat: -1 });
    gsap.to(w2, { x: -140, duration: 1.9, ease: 'none', repeat: -1 });
    gsap.to(state, {
      p: 100, duration: 2.8, ease: 'power2.inOut',
      onUpdate() {
        const p = state.p;
        count.textContent = String(Math.round(p)).padStart(3, '0') + '%';
        gsap.set(water, { y: 200 - p * 1.72 });
        gsap.set(barEl, { scaleX: p / 100 });
        status.textContent = steps[Math.min(steps.length - 1, Math.floor(p / 21))];
      },
      onComplete() {
        const tl = gsap.timeline({ onComplete: () => { L.remove(); } });
        tl.to('.loader-inner', { scale: 1.12, opacity: 0, duration: .5, ease: 'power2.in' })
          .to('.loader .panel.top', { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '-=.05')
          .to('.loader .panel.bot', { yPercent: 100, duration: .9, ease: 'expo.inOut' }, '<')
          .add(start, '-=.55');
      },
    });
  } else {
    if (arrived && hasGsap && !reduce) {
      gsap.set(cols, { scaleY: 1, transformOrigin: '50% 0%' });
      gsap.to(cols, { scaleY: 0, duration: .7, ease: 'power3.inOut', stagger: .06, delay: .05 });
    }
    addEventListener('DOMContentLoaded', start, { once: true });
    if (document.readyState !== 'loading') start();
  }

  /* ============================================================
     Page init: runs after the loader has left
     ============================================================ */
  let inited = false;
  function initPage() {
    if (inited) return; inited = true;
    splitHeadings();
    heroIntro();
    reveals();
    tilt();
    magnetic();
    spotlight();
    counters();
    meters();
    timeline();
    typed();
    chat();
    orbit();
    marquees();
    filters();
    contactForm();
  }

  /* split heading lines for a mask-reveal */
  function splitHeadings() {
    $$('[data-split]').forEach((el) => {
      const html = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = html.map((l) => `<span class="split-line"><span>${l}</span></span>`).join('');
    });
  }

  function heroIntro() {
    if (!hasGsap || reduce) { $$('[data-reveal],[data-hero]').forEach((e) => { e.style.opacity = 1; e.style.transform = 'none'; }); return; }
    const spans = $$('[data-split] .split-line > span');
    gsap.from(spans, { yPercent: 115, rotate: 3, duration: 1.1, ease: 'expo.out', stagger: .1 });
    const hero = $$('[data-hero]');
    if (hero.length) gsap.fromTo(hero, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .1, delay: .2 });
  }

  function reveals() {
    if (!hasGsap || reduce || typeof ScrollTrigger === 'undefined') return;
    $$('[data-reveal]').forEach((el) => {
      const d = parseFloat(el.dataset.reveal) || 0;
      gsap.to(el, { opacity: 1, y: 0, duration: .9, delay: d, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $$('[data-stagger]').forEach((box) => {
      gsap.from(box.children, { opacity: 0, y: 40, scale: .96, duration: .8, ease: 'power3.out', stagger: .09, scrollTrigger: { trigger: box, start: 'top 85%', once: true } });
    });
    // gentle parallax on floating bits
    $$('[data-parallax]').forEach((el) => gsap.to(el, { yPercent: parseFloat(el.dataset.parallax), ease: 'none', scrollTrigger: { trigger: el, scrub: true } }));
  }

  /* 3D tilt */
  function tilt() {
    if (reduce || !matchMedia('(pointer:fine)').matches) return;
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }

  /* magnetic buttons */
  function magnetic() {
    if (reduce || !hasGsap || !matchMedia('(pointer:fine)').matches) return;
    $$('.btn, .nav-cta, .logo').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .35, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }));
    });
  }

  /* spotlight following the pointer inside tiles */
  function spotlight() {
    $$('.tile').forEach((t) => t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', e.clientX - r.left + 'px');
      t.style.setProperty('--my', e.clientY - r.top + 'px');
    }));
  }

  function counters() {
    $$('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      if (!hasGsap || reduce || typeof ScrollTrigger === 'undefined') { el.textContent = end + suffix; return; }
      const o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v) + suffix) }) });
    });
  }

  function meters() {
    $$('.meter i').forEach((m) => {
      if (!hasGsap || reduce || typeof ScrollTrigger === 'undefined') { m.style.transform = 'none'; return; }
      gsap.to(m, { scaleX: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: m, start: 'top 92%', once: true } });
    });
  }

  function timeline() {
    const t = $('.timeline');
    if (!t || !hasGsap || reduce || typeof ScrollTrigger === 'undefined') return;
    gsap.fromTo(t, { '--draw': 0 }, { '--draw': 1, ease: 'none', scrollTrigger: { trigger: t, start: 'top 75%', end: 'bottom 70%', scrub: true } });
  }

  /* typewriter */
  function typed() {
    const el = $('[data-typed]');
    if (!el) return;
    const words = JSON.parse(el.dataset.typed);
    if (reduce) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 32 : 70);
    })();
  }

  /* "Ask me anything" mini chat on the home page */
  function chat() {
    const form = $('.ask-form');
    if (!form) return;
    const log = $('.ask-log'), input = $('input', form);
    const A = [
      [/build|project|work|make/, 'Right now I am practising frontend work: layouts, animations and small interactive pages with HTML, CSS and JavaScript. See the Projects page for what I am putting together.'],
      [/contact|email|reach|hire|message/, `Easiest is email: ${EMAIL}. Or open the Contact page and send a note.`],
      [/skill|stack|know|tech|python|html|css/, 'I know HTML and Python, and I am now on the frontend developer path: CSS, JavaScript and modern tooling. The Skills page has the full list.'],
      [/school|study|educ|univ|course|degree/, 'I studied BS Information Technology at the University of San Agustin, from 1st to 3rd year.'],
      [/who|name|about|you/, 'I am Jan Louis Simundo, an IT student at the University of San Agustin working towards becoming a frontend developer.'],
      [/hi|hello|hey/, 'Hey! Ask me about my skills, school or projects.'],
    ];
    const reply = (q) => (A.find(([re]) => re.test(q.toLowerCase())) || [0, 'Good question! I am still growing as a developer, so email me and I will happily answer: ' + EMAIL])[1];
    const add = (t, who) => {
      log.querySelector('.hint')?.remove();
      const m = Object.assign(document.createElement('div'), { className: 'msg ' + who });
      log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
    };
    const ask = (q) => {
      if (!q.trim()) return;
      add('', 'me').textContent = q;
      const b = add('', 'bot'); b.innerHTML = '<span class="caret"></span>';
      const a = reply(q); let i = 0;
      setTimeout(function t() { b.textContent = a.slice(0, ++i); log.scrollTop = log.scrollHeight; if (i < a.length) setTimeout(t, reduce ? 0 : 14); }, 350);
    };
    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); input.value = ''; });
    $$('.chip').forEach((c) => c.addEventListener('click', () => ask(c.textContent)));
  }

  /* orbiting skills */
  function orbit() {
    const rings = [
      ['.r1', ['HTML', 'PY', 'CSS']],
      ['.r2', ['JS', 'Git', 'UI', 'Fig']],
      ['.r3', ['React', 'Node', 'SQL']],
    ];
    rings.forEach(([sel, items]) => {
      const ring = $('.orbit ' + sel); if (!ring) return;
      items.forEach((t, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const s = document.createElement('span');
        s.style.left = 50 + 50 * Math.cos(a) + '%';
        s.style.top = 50 + 50 * Math.sin(a) + '%';
        s.innerHTML = `<em>${t}</em>`;
        ring.appendChild(s);
      });
    });
  }

  function marquees() {
    $$('.marquee-track').forEach((t) => (t.innerHTML += t.innerHTML));
  }

  function filters() {
    const bar = $('.filters'); if (!bar) return;
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach((x) => x.classList.toggle('on', x === b));
      const f = b.dataset.f;
      $$('.proj').forEach((p) => {
        const show = f === 'all' || p.dataset.cat.includes(f);
        if (hasGsap && !reduce) {
          gsap.to(p, { opacity: show ? 1 : 0, scale: show ? 1 : .94, duration: .35, onComplete: () => (p.style.display = show ? '' : 'none') });
          if (show) { p.style.display = ''; }
        } else p.style.display = show ? '' : 'none';
      });
    });
  }

  function contactForm() {
    const f = $('.form'); if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(f);
      const body = `${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(d.get('subject') || 'Hello from your portfolio')}&body=${encodeURIComponent(body)}`;
      say('Opening your email app…');
    });
  }
})();
