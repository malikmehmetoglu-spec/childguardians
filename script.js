/* =========================================================
   script.js — UI behaviour only. No dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* ---- 1. Image placeholders -------------------------------------
     Any <img data-ph="..."> that fails to load is turned into a
     labelled placeholder box, so the layout never collapses before
     the real .webp files are added. Remove nothing — once the file
     exists at the same path, the placeholder disappears by itself. */
  document.querySelectorAll('img[data-ph]').forEach(function (img) {
    function fail() {
      if (img.classList.contains('is-missing')) return;
      img.classList.add('is-missing');
      img.removeAttribute('src');

      var parent = img.parentElement;
      if (!parent) return;
      if (!parent.classList.contains('ph-wrap')) {
        var holder = document.createElement('span');
        holder.className = 'ph-wrap';
        holder.style.display = 'block';
        parent.insertBefore(holder, img);
        holder.appendChild(img);
        parent = holder;
      }
      if (!parent.querySelector('.ph-label')) {
        var label = document.createElement('span');
        label.className = 'ph-label';
        label.textContent = img.dataset.ph;
        parent.appendChild(label);
      }
    }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---- 2. Mobile menu ------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- 3. Sticky header shadow ---------------------------------- */
  var head = document.getElementById('head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- 4. Counting numbers --------------------------------------
     Runs once when the stat scrolls into view. Values are written
     immediately if the user prefers reduced motion, and the final
     value is always present in the DOM (safe for screenshots). */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');

  function setFinal(el) {
    el.textContent = el.dataset.count + (el.dataset.suffix || '');
  }

  if (!('IntersectionObserver' in window) || reduce) {
    counters.forEach(setFinal);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var start = performance.now();
        var dur = 1200;
        (function step(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(start);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { io.observe(el); });
  }

  /* ---- 5. Footer year ------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- 6. Forms (front-end validation only) ---------------------
     No backend is wired yet. Replace the submit handler with a fetch
     to /api/contact (or a form service) when you are ready. */
  var contactForm = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formNote.textContent = 'Fill in your name, email and message.';
        formNote.classList.add('is-err');
        return;
      }
      formNote.classList.remove('is-err');
      formNote.textContent = 'Form is not connected to a backend yet.';
    });
  }

  var newsForm = document.getElementById('newsForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      newsForm.reset();
    });
  }
})();
