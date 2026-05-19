// ПИНК — frontend interactions

(function () {
  'use strict';

  // -------- Header scroll state --------
  const header = document.querySelector('.site-header');
  if (header && !header.classList.contains('is-solid')) {
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -------- Mobile burger --------
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if (burger && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!nav.classList.contains('is-open'));
    });
    // Закрываем при клике на любую ссылку в меню
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
    // Закрываем по Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
  }

  // -------- Favorite toggle on product cards --------
  document.addEventListener('click', (e) => {
    const fav = e.target.closest('.product-card__fav');
    if (!fav) return;
    e.preventDefault();
    fav.classList.toggle('is-active');
  });

  // -------- Hero unmute toggle --------
  const heroVideo = document.querySelector('.hero__video');
  const unmuteBtn = document.querySelector('.hero__unmute');
  if (heroVideo && unmuteBtn) {
    unmuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      unmuteBtn.dataset.muted = heroVideo.muted ? 'true' : 'false';
      unmuteBtn.innerHTML = heroVideo.muted
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 9v6h4l5 4V5L8 9H4zM17 8l4 4m0-4l-4 4"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 9v6h4l5 4V5L8 9H4zM16 8a5 5 0 010 8M19 5a9 9 0 010 14"/></svg>';
    });
  }

  // -------- Film hero play/pause --------
  const filmVideo = document.querySelector('.film-hero video');
  const playBtn = document.querySelector('.film-hero [data-play]');
  if (filmVideo && playBtn) {
    playBtn.addEventListener('click', () => {
      if (filmVideo.paused) filmVideo.play(); else filmVideo.pause();
    });
  }

  // -------- Film card hover playback --------
  document.querySelectorAll('.film-card video').forEach((v) => {
    const wrap = v.closest('.film-card');
    if (!wrap) return;
    wrap.addEventListener('mouseenter', () => { v.currentTime = 0; v.play().catch(()=>{}); });
    wrap.addEventListener('mouseleave', () => { v.pause(); });
  });

  // -------- Filter selection (visual only) --------
  document.querySelectorAll('.filters__group ul').forEach((ul) => {
    ul.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      ul.querySelectorAll('li').forEach((x) => x.classList.remove('is-active'));
      li.classList.add('is-active');
    });
  });

  document.querySelectorAll('.film-filters').forEach((bar) => {
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      bar.querySelectorAll('button').forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
    });
  });

  // -------- PDP swatches / sizes --------
  document.querySelectorAll('.swatches').forEach((g) => {
    g.addEventListener('click', (e) => {
      const s = e.target.closest('.swatch');
      if (!s) return;
      g.querySelectorAll('.swatch').forEach((x) => x.classList.remove('is-active'));
      s.classList.add('is-active');
    });
  });
  document.querySelectorAll('.sizes').forEach((g) => {
    g.addEventListener('click', (e) => {
      const s = e.target.closest('.size:not(.is-disabled)');
      if (!s) return;
      g.querySelectorAll('.size').forEach((x) => x.classList.remove('is-active'));
      s.classList.add('is-active');
    });
  });

  // -------- Look hotspots --------
  document.querySelectorAll('.look-view').forEach((view) => {
    const hotspots = view.querySelectorAll('.hotspot');
    const items = view.querySelectorAll('.look-item');
    const activate = (id) => {
      hotspots.forEach((h) => h.classList.toggle('is-active', h.dataset.id === id));
      items.forEach((i) => i.classList.toggle('is-active', i.dataset.id === id));
    };
    hotspots.forEach((h) => h.addEventListener('click', () => activate(h.dataset.id)));
    items.forEach((i) => i.addEventListener('click', () => activate(i.dataset.id)));
  });

  // -------- Lazy-load videos --------
  // Загружаем видео только когда оно близко ко viewport — экономия трафика.
  if ('IntersectionObserver' in window) {
    const vIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const v = entry.target;
        const src = v.dataset.src;
        if (src && !v.querySelector('source')) {
          const s = document.createElement('source');
          s.src = src;
          s.type = 'video/mp4';
          v.appendChild(s);
          v.load();
          v.play().catch(() => {});
        } else {
          v.play().catch(() => {});
        }
        vIo.unobserve(v);
      });
    }, { rootMargin: '300px 0px', threshold: 0.01 });
    document.querySelectorAll('video.lazy-video').forEach((v) => vIo.observe(v));
  } else {
    // fallback — просто загружаем сразу
    document.querySelectorAll('video.lazy-video').forEach((v) => {
      if (v.dataset.src && !v.querySelector('source')) {
        const s = document.createElement('source');
        s.src = v.dataset.src; s.type = 'video/mp4';
        v.appendChild(s); v.load();
      }
    });
  }

  // -------- Reveal on scroll --------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  }

  // -------- Newsletter mock --------
  document.querySelectorAll('.newsletter form').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input');
      const btn = f.querySelector('button');
      if (input && input.value) {
        btn.textContent = 'Спасибо ✓';
        input.value = '';
        setTimeout(() => { btn.textContent = 'Подписаться'; }, 2200);
      }
    });
  });

})();
