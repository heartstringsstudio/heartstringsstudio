const base='https://heartstringsstudio.github.io/storyroom/';
const occasions=[['Weddings','Wedding'],['Memorials & Tributes','Memorial / Tribute'],['Anniversaries','Anniversary'],['Birthdays','Birthday'],['Retirements','Retirement'],['Military Tributes','Military Tribute'],['Celebrations of Life','Celebration of Life'],['Gratitude & Thank You','Gratitude / Thank You'],['Just Because','Just Because']];
for(const [label,value] of occasions){const a=document.createElement('a');a.href=base+'?occasion='+encodeURIComponent(value);a.textContent=label;document.querySelector('.occasions').append(a)}
const songs=[['lLHM931NU4Y','wedding','This week’s song','Before the Doors Open','A wedding morning, and all the love that arrives before the ceremony begins.'],['fDOgbEE7BX8','memorial','Memorial','Forever and a Day','A deeply personal tribute to a life that left its mark, and a love that stays.'],['ppbdNuOdGng','teacher','Community tribute','We Love You, Mrs. Gaynor','Decades of alumni memories honoring the woman who helped raise generations of Lincoln High Cougars.'],['jmSfTesTUcw','military','Military tribute','Worth Every Mile','For the sacrifice, service, and homecoming — and the people who wait.'],['OOypcnwpw9A','talk','Memorial','I Still Talk to You','The quiet moments. The empty spaces. The conversations that never really stopped.'],['O9YqauiOqzE','kitchen','Wedding','Two Weeks in the Kitchen','A father-daughter wedding song made from the ordinary hours nobody thinks to photograph.']];
for(const [id,img,type,title,desc] of songs){const a=document.createElement('a');a.className='song';a.href='https://www.youtube.com/watch?v='+id;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','Listen to '+title+' on YouTube');a.innerHTML=`<div class="song-image"><img class="scene-thumb" src="assets/${['wedding','kitchen'].includes(img)?'wedding':img==='teacher'?'studio':'porch'}.webp" alt="Illustrative Appalachian scene" loading="lazy"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" onerror="this.hidden=true" alt="${title} song artwork" loading="lazy"><span class="play" aria-hidden="true">▶</span></div><small>${type}</small><h3>${title}</h3><p>${desc}</p>`;document.querySelector('#songs').append(a)}
const faq=[['How does it work?','Fill out the intake form with your story. Tim will contact you by email within 24 hours with next steps. He writes your lyrics, works with you on a round of revisions, and produces your custom song.'],['How fast will I get my song?','Most songs arrive in 48–72 hours. Memorial songs always receive 24-hour delivery at no extra charge. For other songs, rush delivery is an additional $50. Mention your date in the intake form and Tim will confirm what’s possible.'],['Can I pick the style and approve the lyrics?','Absolutely. Choose the genre and feeling — romantic, funny, emotional, nostalgic, solemn, or whatever fits your story. You receive the lyrics first, with one round of revisions before production.'],['Can I give this as a gift?','Yes. A custom song makes a personal wedding gift, birthday surprise, anniversary present, or tribute. Share your keepsake page with someone you love, or play your downloaded MP3 at an event.'],['How do I share my song?','Your keepsake page holds your song on an unlisted YouTube link, custom artwork, full lyrics, and MP3 and lyric sheet downloads. Send the page link by text or email. Unlisted links aren’t publicly listed, but anyone with the link can view or share them.'],['Is my song one-of-a-kind?','Every song is built around your story from scratch. Names, memories, and the details that matter to you shape the finished song.'],['What if the finished song misses the mark?','Tim starts over from scratch. The remake guarantee is included in your custom song.']];
for(const [q,a] of faq){const d=document.createElement('details');const s=document.createElement('summary');s.textContent=q;const p=document.createElement('p');p.textContent=a;d.append(s,p);document.querySelector('#questions').append(d)}

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const animated=document.querySelectorAll('.section-head,.song,.keepsake-copy,.keepsake-stack article,.steps article,.price-card,.quotes figure,.portrait,.about>div:last-child,.faq>div,.closing-content');
animated.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${(i%3)*110}ms`)});
let revealObserver;
function setupReveal(){if(reduceMotion.matches){animated.forEach(el=>el.classList.add('seen'));return;}if(!('IntersectionObserver' in window))return;document.documentElement.classList.add('motion-ready');revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('seen');revealObserver.unobserve(entry.target)}})},{threshold:.12});animated.forEach(el=>revealObserver.observe(el));}
setupReveal();
const story=document.querySelector('.home-story');const hero=document.querySelector('.hero');let scheduled=false;
function updateScroll(){scheduled=false;if(reduceMotion.matches)return;const r=story.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-r.top/(story.offsetHeight-innerHeight||1)));story.style.setProperty('--journey',progress);const heroProgress=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/hero.offsetHeight));hero.style.setProperty('--hero-progress',heroProgress);}
function onScroll(){if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);updateScroll();
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){document.documentElement.classList.remove('motion-ready');animated.forEach(el=>el.classList.add('seen'));story.style.setProperty('--journey',0);hero.style.setProperty('--hero-progress',0)}else{setupReveal();updateScroll()}});
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.song,.hero-postcard,.price-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduceMotion.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-((e.clientY-r.top)/r.height-.5)*16}deg`);card.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*20}deg`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')})});}

/* ENGAGEMENT TRACKING (scroll depth · section views · CTA clicks).
   Restores the four GA4 events the pre-rebuild site sent. Silent no-op if
   the analytics tag is blocked or absent. */
(function () {
  if (typeof gtag !== 'function') return;

  /* How far down the page people get: 25 / 50 / 75 / 90 / 100%. */
  const marks = [25, 50, 75, 90, 100];
  const fired = {};
  function scrollPct() {
    const doc = document.documentElement;
    const max = Math.max(document.body.scrollHeight, doc.scrollHeight) - innerHeight;
    if (max <= 0) return 100;
    return Math.min(100, Math.round((scrollY / max) * 100));
  }
  function checkScroll() {
    const p = scrollPct();
    marks.forEach(m => {
      if (p < m || fired[m]) return;
      fired[m] = true;
      gtag('event', 'scroll_depth', { percent: m, event_category: 'engagement', event_label: m + '%', non_interaction: true });
    });
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { checkScroll(); ticking = false; });
  }, { passive: true });
  checkScroll();

  /* Which sections actually get seen (50% in view). */
  function sectionName(el) {
    if (el.id) return el.id;
    const eyebrow = el.querySelector('.eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) return eyebrow.textContent.trim().slice(0, 60);
    const h = el.querySelector('h1, h2');
    if (h && h.textContent.trim()) return h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
    return 'section';
  }
  if ('IntersectionObserver' in window) {
    const seen = {};
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const name = sectionName(entry.target);
        if (seen[name]) return;
        seen[name] = true;
        gtag('event', 'section_view', { section: name, event_category: 'engagement', event_label: name, non_interaction: true });
      });
    }, { threshold: .5 });
    document.querySelectorAll('section').forEach(el => io.observe(el));
  }

  /* Primary CTA clicks. */
  addEventListener('click', e => {
    const el = e.target.closest('a, button');
    if (!el) return;
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    const href = el.getAttribute('href') || '';
    if (href.includes('/storyroom/')) {
      gtag('event', 'cta_click', { cta: 'begin_song', event_category: 'engagement', event_label: txt });
      /* The story room lives off-site, so GA can't observe the submit —
         a click through to it is the closest conversion signal we have. */
      const occ = (href.split('occasion=')[1] || '').split('&')[0];
      gtag('event', 'generate_lead', { event_category: 'conversion', event_label: txt, occasion: occ ? decodeURIComponent(occ) : 'unspecified' });
    } else if (href.includes('/jukebox/')) {
      gtag('event', 'cta_click', { cta: 'hear_songs', event_category: 'engagement', event_label: txt });
    }
  }, true);
})();
