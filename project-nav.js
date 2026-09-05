/* ===== PROJECT NAVIGATION (Keep Exploring) - SHARED COMPONENT ===== */
/* Renders Previous / Back to Projects / Next based on the actual
   project order defined below. Injected into #project-nav on every
   project detail page. */
(function () {
  'use strict';

  /* --- Project order (must match the order in index.html #projects) --- */
  var PROJECTS = [
    { name: 'UPS System', file: 'ups-details.html' },
    { name: 'RC Boat', file: 'rcboat-details.html' },
    { name: 'Digital Clock', file: 'digital-clock-details.html' },
    { name: 'Cam Design', file: 'cam-design-details.html' }
  ];

  var BACK_TO = 'index.html#projects';

  /* --- Inject a self-contained stylesheet ONLY when exp-style.css is
         not loaded (the older project pages use a plain inline template). --- */
  function injectStyles(root) {
    if (document.querySelector('link[href*="exp-style.css"]')) return; // already styled by exp-style.css

    var style = document.createElement('style');
    style.textContent =
      '#project-nav .exp-section { margin-bottom: 44px; }' +
      '#project-nav .exp-section-head { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }' +
      '#project-nav .exp-section-num { font-size: 1.7rem; font-weight: 900; line-height: 1; background: linear-gradient(135deg, #2563EB, rgba(37,99,235,0.25)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; opacity: 0.85; font-variant-numeric: tabular-nums; }' +
      '#project-nav .exp-section-title { font-size: 1.35rem; font-weight: 800; letter-spacing: 0.01em; color: white; }' +
      '#project-nav .exp-section-sub { color: #9CA3AF; font-size: 0.9rem; margin-top: 3px; }' +
      '#project-nav .exp-nav-grid { display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 18px; margin-top: 8px; }' +
      '#project-nav .exp-nav-card { display: flex; flex-direction: column; justify-content: center; gap: 8px; min-height: 108px; padding: 22px 24px; border-radius: 18px; background: #111827; border: 1px solid #1F2937; box-shadow: 0 10px 30px rgba(2,6,16,0.45); transition: all 0.35s ease; }' +
      '#project-nav a.exp-nav-card { color: inherit; text-decoration: none; }' +
      '#project-nav a.exp-nav-card:hover { border-color: rgba(37,99,235,0.25); box-shadow: 0 22px 50px rgba(2,6,16,0.6), 0 8px 30px rgba(37,99,235,0.14); transform: translateY(-4px); background: #151F33; }' +
      '#project-nav .exp-nav-label { display: inline-flex; align-items: center; gap: 8px; font-size: 0.74rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #3B82F6; }' +
      '#project-nav .exp-nav-name { font-size: 1.02rem; font-weight: 700; color: white; }' +
      '#project-nav .exp-nav-name .nav-arrow { color: #3B82F6; margin-left: 8px; }' +
      '#project-nav .exp-nav-card.exp-nav-center { align-items: center; text-align: center; background: linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.03)); border-color: rgba(37,99,235,0.25); }' +
      '#project-nav .exp-nav-card.exp-nav-muted { opacity: 0.45; cursor: default; filter: grayscale(0.4); }' +
      '#project-nav .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1); transition-delay: var(--d, 0s); }' +
      '#project-nav .reveal.revealed { opacity: 1; transform: translateY(0); }' +
      '@media (max-width: 900px) {' +
      '  #project-nav .exp-nav-grid { grid-template-columns: 1fr; }' +
      '  #project-nav .exp-section-num { font-size: 1.5rem; }' +
      '  #project-nav .exp-section-title { font-size: 1.2rem; }' +
      '}';
    root.appendChild(style);
  }

  /* --- Always call so exp-style loaded pages keep the same 07 numbering. --- */
  function currentIndex() {
    var page = window.location.pathname.split('/').pop() || '';
    for (var i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].file === page) return i;
    }
    return -1;
  }

  function card(project, dir) {
    if (!project) {
      var mutedLabel = dir === 'prev'
        ? '<i class="fas fa-arrow-left"></i> Previous Project'
        : 'Next Project <i class="fas fa-arrow-right"></i>';
      var mutedName = dir === 'prev' ? 'Start of the Journey' : 'End of the Journey';
      return '<div class="exp-nav-card exp-nav-muted reveal">' +
        '<span class="exp-nav-label">' + mutedLabel + '</span>' +
        '<span class="exp-nav-name">' + mutedName + '</span></div>';
    }
    if (dir === 'prev') {
      return '<a href="' + project.file + '" class="exp-nav-card reveal">' +
        '<span class="exp-nav-label"><i class="fas fa-arrow-left"></i> Previous Project</span>' +
        '<span class="exp-nav-name">' + project.name + ' <span class="nav-arrow"><i class="fas fa-arrow-left"></i></span></span></a>';
    }
    return '<a href="' + project.file + '" class="exp-nav-card reveal" data-delay="0.2">' +
      '<span class="exp-nav-label">Next Project <i class="fas fa-arrow-right"></i></span>' +
      '<span class="exp-nav-name">' + project.name + ' <span class="nav-arrow"><i class="fas fa-arrow-right"></i></span></span></a>';
  }

  function renderNav(root) {
    var idx = currentIndex();
    if (idx < 0) return;

    var prev = idx > 0 ? PROJECTS[idx - 1] : null;
    var next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;

    root.innerHTML =
      '<section class="exp-section">' +
      '  <div class="exp-section-head reveal">' +
      '    <span class="exp-section-num">07</span>' +
      '    <div>' +
      '      <h2 class="exp-section-title">Keep Exploring</h2>' +
      '      <p class="exp-section-sub">Continue through the projects.</p>' +
      '    </div>' +
      '  </div>' +
      '  <div class="exp-nav-grid">' +
      card(prev, 'prev') +
      '    <a href="' + BACK_TO + '" class="exp-nav-card exp-nav-center reveal" data-delay="0.1">' +
      '      <span class="exp-nav-label"><i class="fas fa-th-large"></i> Back to Projects</span>' +
      '      <span class="exp-nav-name">All Projects</span>' +
      '    </a>' +
      card(next, 'next') +
      '  </div>' +
      '</section>';

    // set stagger delays from data-delay and reveal on scroll
    var els = root.querySelectorAll('.reveal');
    Array.prototype.forEach.call(els, function (el) {
      var d = parseFloat(el.getAttribute('data-delay'));
      el.style.setProperty('--d', (isNaN(d) ? 0 : d) + 's');
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      Array.prototype.forEach.call(els, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('revealed'); });
    }
  }

  var root = document.getElementById('project-nav');
  if (!root) return;

  injectStyles(root);
  renderNav(root);
})();