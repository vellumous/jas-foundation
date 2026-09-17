(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile nav toggle ----------
     The menu opens/closes with a CSS transition (see style.css, the
     .js-anim rules). It is NOT animated in GSAP: a CSS transition on
     the same property as a GSAP tween would fight over `transform`,
     and a CSS transition behaves identically in every browser, which
     is the point — the menu must not "move" on click in Chrome/Brave
     the way it currently does. The toggle class is added on the first
     click, so the very first paint is always instant. */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('open', !open);
      links.classList.add('js-anim');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
    }));
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- GSAP: one orchestrated hero entrance per page ---------- */
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && !reduceMotion) {
    gsap.registerPlugin(window.ScrollTrigger);

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-eyebrow', { opacity: 0, y: 10, duration: 0.5 })
      .from('.hero h1', { opacity: 0, y: 22, duration: 0.7 }, '-=0.25')
      .from('.hero .lede', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.hero-actions', { opacity: 0, y: 12, duration: 0.5 }, '-=0.35')
      .from('.hero-art', { opacity: 0, scale: 0.96, duration: 0.8 }, '-=0.6');

    /* sequential reveal, used only where the content is genuinely a
       sequence (the Vision timeline) or a single quoted moment
       (testimonials) — not scattered across every section. */
    gsap.utils.toArray('.timeline-step').forEach((step, i) => {
      gsap.from(step, {
        opacity: 0,
        x: -16,
        duration: 0.6,
        scrollTrigger: { trigger: step, start: 'top 82%' },
        delay: i * 0.03
      });
    });

    gsap.utils.toArray('.testimonial').forEach(t => {
      gsap.from(t, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        scrollTrigger: { trigger: t, start: 'top 85%' }
      });
    });

    gsap.utils.toArray('.reveal-in').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }
})();
