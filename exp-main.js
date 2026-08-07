/* ===== EXPERIENCE DETAIL PAGES - SHARED JS ===== */
(function () {
  'use strict';

  /* --- Navbar scroll state --- */
  var navbar = document.getElementById('expNavbar');
  if (navbar) {
    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Reveal on scroll --- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      var d = parseFloat(el.getAttribute('data-delay'));
      el.style.setProperty('--d', (isNaN(d) ? 0 : d) + 's');
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* --- Lightbox --- */
  function buildLightbox() {
    if (document.getElementById('expLightbox')) return;
    var lb = document.createElement('div');
    lb.className = 'exp-lightbox';
    lb.id = 'expLightbox';
    lb.innerHTML =
      '<div class="exp-lightbox-toolbar">' +
      '  <span class="exp-lightbox-count">1 / 1</span>' +
      '  <div class="exp-lightbox-actions">' +
      '    <button class="exp-lb-btn" type="button" id="expLbZoom" aria-label="Zoom"><i class="fas fa-search-plus"></i></button>' +
      '    <button class="exp-lb-btn" type="button" id="expLbClose" aria-label="Close"><i class="fas fa-times"></i></button>' +
      '  </div>' +
      '</div>' +
      '<div class="exp-lightbox-stage">' +
      '  <button class="exp-lb-nav exp-lb-prev" type="button" id="expLbPrev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>' +
      '  <div class="exp-lightbox-media" id="expLbMedia"></div>' +
      '  <button class="exp-lb-nav exp-lb-next" type="button" id="expLbNext" aria-label="Next"><i class="fas fa-chevron-right"></i></button>' +
      '</div>' +
      '<div class="exp-lightbox-close-hint">Esc to close</div>';
    document.body.appendChild(lb);
    return lb;
  }

  function initLightbox() {
    var lb = buildLightbox();
    var media = document.getElementById('expLbMedia');
    var count = lb.querySelector('.exp-lightbox-count');
    var closeBtn = document.getElementById('expLbClose');
    var prevBtn = document.getElementById('expLbPrev');
    var nextBtn = document.getElementById('expLbNext');
    var zoomBtn = document.getElementById('expLbZoom');

    var items = Array.prototype.slice.call(document.querySelectorAll('.exp-gallery-item, .exp-cert-preview'));
    var index = 0;
    var currentVideo = null;

    function render() {
      if (!items.length) return;
      var item = items[index];
      var src = item.getAttribute('data-src') || item.querySelector('img').getAttribute('src');
      var type = item.getAttribute('data-type') || 'image';
      media.classList.remove('zoomed');
      currentVideo = null;
      media.innerHTML = '';
      if (type === 'video') {
        var v = document.createElement('video');
        v.src = src;
        v.controls = true;
        v.autoplay = true;
        v.setAttribute('playsinline', '');
        currentVideo = v;
        media.appendChild(v);
      } else {
        var img = new Image();
        img.src = src;
        img.alt = 'Image ' + String(index + 1).padStart(2, '0');
        img.id = 'expLbImg';
        media.appendChild(img);
      }
      count.textContent = (index + 1) + ' / ' + items.length;
    }

    function open(i) {
      if (!items.length) return;
      index = i;
      render();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (currentVideo) { currentVideo.pause(); }
      media.innerHTML = '';
    }
    function prev() { if (index > 0) { index--; render(); } else { index = items.length - 1; render(); } }
    function next() { if (index < items.length - 1) { index++; render(); } else { index = 0; render(); } }
    function toggleZoom() {
      if (currentVideo) return;
      media.classList.toggle('zoomed');
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        open(i);
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);
    zoomBtn.addEventListener('click', toggleZoom);
    media.addEventListener('click', toggleZoom);
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === '+' || e.key === '=') toggleZoom();
      else if (e.key === '-') toggleZoom();
    });
  }

  initLightbox();
})();
