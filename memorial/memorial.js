/* The memorial page's song cards are real YouTube links, so they work with
   scripts off. With scripts on, a tap plays the song in place in the
   nocookie player instead: one at a time, built only on request, with the
   YouTube link kept beside the Close button for slow connections. */
(function () {
  let playing = null;

  function stop(refocus) {
    if (!playing) return;
    const { card, face, link } = playing;
    playing = null;
    const player = card.querySelector('.player-face');
    if (player) player.remove();
    card.append(face);
    card.classList.remove('is-playing');
    if (refocus) link.focus();
  }

  for (const card of document.querySelectorAll('.mem-songs .song')) {
    const link = card.querySelector('a[data-video]');
    if (!link) continue;
    link.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button || !navigator.onLine) return;
      e.preventDefault();
      stop();
      const id = link.dataset.video, title = link.dataset.title;
      if (typeof gtag === 'function') gtag('event', 'song_play', { event_category: 'engagement', event_label: title });
      const face = card.querySelector('.card-face');
      face.remove();
      const player = document.createElement('div');
      player.className = 'player-face';
      const frame = document.createElement('div');
      frame.className = 'player-frame';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = 'Now playing: ' + title;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.append(iframe);
      const bar = document.createElement('div');
      bar.className = 'player-bar';
      const name = document.createElement('span');
      name.className = 'player-title';
      name.textContent = title;
      const out = document.createElement('a');
      out.className = 'player-out';
      out.href = 'https://youtu.be/' + id;
      out.target = '_blank';
      out.rel = 'noopener';
      out.textContent = 'Open on YouTube';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'stop-btn';
      close.textContent = '✕ Close';
      close.setAttribute('aria-label', 'Stop playing “' + title + '”');
      close.addEventListener('click', () => stop(true));
      bar.append(name, out, close);
      player.append(frame, bar);
      card.append(player);
      card.classList.add('is-playing');
      playing = { card, face, link };
      close.focus();
    });
  }
  addEventListener('keydown', e => { if (e.key === 'Escape') stop(true); });

  /* Contact taps: one channel event and one generate_lead each, the same
     scheme as the main page, with placements that say "memorial page". */
  if (typeof gtag !== 'function') return;
  addEventListener('click', e => {
    const el = e.target.closest('a');
    if (!el) return;
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    const href = el.getAttribute('href') || '';
    const placement = el.closest('.mem-hero') ? 'memorial_hero' : el.closest('.closing') ? 'memorial_closing' : 'memorial_page';
    const lead = method => gtag('event', 'generate_lead', { event_category: 'conversion', event_label: txt, method, placement });
    if (href.startsWith('https://m.me/')) {
      gtag('event', 'messenger_click', { event_category: 'engagement', event_label: txt, placement });
      lead('messenger');
    } else if (href.startsWith('https://calendar.app.google/')) {
      gtag('event', 'callback_click', { event_category: 'engagement', event_label: txt, placement });
      lead('callback');
    } else if (href.startsWith('sms:')) {
      gtag('event', 'sms_click', { event_category: 'engagement', event_label: txt, placement });
      lead('sms');
    } else if (href.startsWith('tel:')) {
      gtag('event', 'tel_click', { event_category: 'engagement', event_label: txt, placement });
      lead('tel');
    } else if (href.startsWith('mailto:')) {
      lead('email');
    }
  }, true);
})();
