/* Seasonal pricing, Black Friday and holiday 2026 (set by the owner, 21 November 2026).

   One schedule, checked against the date in Eastern time, switches the price
   copy on the home page and the memorial page by itself:

     teaser       Nov 21 – Nov 26   ribbon announces Black Friday; prices stay $150
     blackfriday  Nov 27            $99, midnight to midnight, first 25 songs,
                                    written in the order received (no 48–72 guarantee)
     holiday      Nov 28 – Dec 20   $125, 48–72 hours guaranteed as usual
     (none)       from Dec 21       nothing runs; the page is back to $150 flat

   The served HTML always says $150, so scripts-off visitors and crawlers see
   the regular price, and nothing has to be edited on December 21.

   Memorial songs get the sale price, and keep their 24-hour promise on
   Black Friday ("Memorial songs still come first"). Paid rush is not
   offered on Black Friday orders (owner, 21 Nov 2026). Gift certificates are
   $99 on Black Friday and $125 after, good for one song for a year from the
   day they're bought, paid by Venmo, Cash App, cash or check. They do not
   count toward the 25-song cap and stay $99 all day, even once it is reached.

   Once the 25 Black Friday songs are taken, set SOLD_OUT to true: the ribbon
   says so, the $125 holiday price starts early for the rest of the day
   (owner, 21 Nov 2026), and gift certificates stay $99 until midnight.

   Preview any day with ?promo=YYYY-MM-DD (e.g. ?promo=2026-11-27), or
   ?promo=soldout for Black Friday after the 25, or ?promo=off for the
   regular page. Never put "24 hours" in this file's home
   page copy: that figure belongs to the memorial band and the rush add-on. */
(function () {
  const MSG = 'https://m.me/61584734289007';
  const BLACK_FRIDAY = '2026-11-27';
  const SOLD_OUT = false;
  const PHASES = [
    { id: 'teaser', from: '2026-11-21', to: '2026-11-26' },
    { id: 'blackfriday', from: BLACK_FRIDAY, to: BLACK_FRIDAY },
    { id: 'holiday', from: '2026-11-28', to: '2026-12-20' }
  ];

  const GIFT = 'Gift certificates: $99 on Black Friday, $125 through December 20. Each is good for one song for a year from the day you buy it. Message me, and pay by Venmo, Cash App, cash or check.';
  const GIFT_FAQ = ['Can I give a song as a gift?', 'Yes. Through December 20 I offer gift certificates: $99 on Black Friday, November 27, and $125 the rest of the season. Each one is good for one custom song for a year from the day you buy it. Message me to get one; you can pay by Venmo, Cash App, cash or check.'];
  const was = '<s><span class="promo-sr">Regular price </span>$150</s> ';

  function easternToday() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      return `${get('year')}-${get('month')}-${get('day')}`;
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  let today = easternToday();
  let preview = null;
  try { preview = new URLSearchParams(location.search).get('promo'); } catch (e) { /* old browser */ }
  if (preview === 'off') today = '0000-00-00';
  else if (preview === 'soldout') today = BLACK_FRIDAY;
  else if (/^\d{4}-\d{2}-\d{2}$/.test(preview || '')) today = preview;

  const found = PHASES.find((p) => today >= p.from && today <= p.to);
  let phase = found ? found.id : null;
  if (phase === 'blackfriday' && (SOLD_OUT || preview === 'soldout')) phase = 'soldout';
  window.HS_PROMO = phase ? { phase, giftFaq: GIFT_FAQ } : null;
  if (!phase) return;

  const days = Math.round((Date.parse(BLACK_FRIDAY) - Date.parse(today)) / 864e5);
  const RIBBON = {
    teaser: ['BLACK FRIDAY · NOV 27', 'Every custom song <b>$99</b>, one day only.', `First 25 songs. Gift certificates too. ${days === 1 ? 'Starts tomorrow.' : `Starts in ${days} days.`}`],
    blackfriday: ['BLACK FRIDAY · TODAY ONLY', 'Every custom song <b>$99</b> until midnight.', 'First 25 songs, written in the order received. Gift certificates $99 too.'],
    soldout: ['BLACK FRIDAY', 'All 25 Black Friday songs are spoken for. Thank you.', 'The <b class="promo-small">$125</b> holiday price starts now. Gift certificates are still $99 until midnight.'],
    holiday: ['HOLIDAY PRICE · THROUGH DEC 20', 'Every custom song <b>$125</b>.', 'Order by December 20, in time for Christmas. Gift certificates available.']
  };

  /* Keyed by data-promo on the element; a phase without an entry leaves
     that element as served. */
  const COPY = {
    /* Home page */
    'hero-price': {
      blackfriday: `${was}$99 today only · First 25 songs · Written in the order received`,
      holiday: `${was}$125 through Dec 20 · Ready in 48–72 hours, guaranteed`
    },
    'price-amount': {
      blackfriday: `${was}$99 <small>today only</small>`,
      holiday: `${was}$125 <small>through Dec 20</small>`
    },
    'price-note': {
      teaser: `<b>Black Friday, November 27:</b> every song $99, one day only, for the first 25 songs. Then $125 through December 20.<br><b>Gift certificates</b> too. ${GIFT.replace('Gift certificates: ', '')}`,
      blackfriday: `<b>Black Friday:</b> $99 until midnight Eastern, for the first 25 songs. Black Friday songs are written in the order they come in, so the 48–72 hour guarantee doesn’t apply to them. Memorial songs still come first. Rush delivery isn’t available on Black Friday orders.<br><b>Gift certificates</b> are $99 all day and don’t count toward the 25. Each is good for one song for a year. Pay by Venmo, Cash App, cash or check.`,
      soldout: `<b>Black Friday:</b> all 25 songs at $99 are spoken for. Thank you.<br><b>Gift certificates</b> are still $99 until midnight, good for one song for a year. Pay by Venmo, Cash App, cash or check.<br><b>Holiday price:</b> $125 starting now, through December 20.`,
      holiday: `<b>Holiday price:</b> $125 through December 20. Order by the 20th and your song is ready before Christmas.<br><b>Gift certificates</b> are $125, good for one song for a year from the day you buy it. Pay by Venmo, Cash App, cash or check.`
    },
    delivery: {
      blackfriday: 'Black Friday songs written in the order received'
    },
    'step-delivery': {
      blackfriday: 'When your song is ready, I send you your keepsake page with your song, artwork and downloads. Black Friday songs are written in the order received.'
    },
    'closing-price': {
      blackfriday: '$99 today only. A song that stays.',
      holiday: '$125 through December 20. A song that stays.'
    },
    /* Memorial page: the lower price, said quietly. No ribbon, no
       "Black Friday", and nothing about 48–72 hours. */
    'mem-chip': {
      blackfriday: '$99 today',
      holiday: '$125 through Dec 20'
    },
    'mem-price': {
      blackfriday: '$99 today.',
      holiday: '$125 through December 20.'
    }
  };

  const ribbon = document.getElementById('promo');
  if (ribbon && RIBBON[phase]) {
    const [tag, main, sub] = RIBBON[phase];
    ribbon.innerHTML = `<div class="promo-inner wrap"><span class="promo-tag">${tag}</span><p class="promo-main">${main}<span class="promo-sub">${sub}</span></p><a class="promo-link" href="${MSG}">Message me <span aria-hidden="true">↗</span></a></div>`;
    ribbon.hidden = false;
    document.documentElement.classList.add('has-promo');
  }

  document.querySelectorAll('[data-promo]').forEach((el) => {
    /* Sold out: anything without its own sold-out line takes the holiday copy. */
    const set = COPY[el.dataset.promo] || {};
    const html = phase === 'soldout' && !('soldout' in set) ? set.holiday : set[phase];
    if (html == null) return;
    el.innerHTML = html;
    el.hidden = false;
  });
})();
