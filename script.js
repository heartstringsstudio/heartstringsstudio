const base='https://heartstringsstudio.github.io/storyroom/';
const occasions=[['Weddings','Wedding'],['Memorials & Tributes','Memorial / Tribute'],['Anniversaries','Anniversary'],['Birthdays','Birthday'],['Retirements','Retirement'],['Military Tributes','Military Tribute'],['Celebrations of Life','Celebration of Life'],['Gratitude & Thank You','Gratitude / Thank You'],['Just Because','Just Because']];
for(const [label,value] of occasions){const a=document.createElement('a');a.href=base+'?occasion='+encodeURIComponent(value);a.textContent=label;document.querySelector('.occasions').append(a)}
const songs=[['lLHM931NU4Y','wedding','This week’s song','Before the Doors Open','A wedding morning, and all the love that arrives before the ceremony begins.','assets/before-the-doors-open-youtube.jpg'],['iCzuyECSoFY','celebration','Celebration of life','She Left Us a Party','A celebration of Lenay, whose friends and coworkers gathered in Washington, D.C., and at Margaritaville in Florida to honor her life.','assets/lenay-youtube.jpg'],['fDOgbEE7BX8','memorial','Memorial','Forever and a Day','A deeply personal tribute to a life that left its mark, and a love that stays.'],['ppbdNuOdGng','teacher','Community tribute','We Love You, Mrs. Gaynor','Decades of alumni memories honoring the woman who helped raise generations of Lincoln High Cougars.'],['jmSfTesTUcw','military','Military tribute','Worth Every Mile','For the sacrifice, service, and homecoming — and the people who wait.'],['OOypcnwpw9A','talk','Memorial','I Still Talk to You','The quiet moments. The empty spaces. The conversations that never really stopped.'],['O9YqauiOqzE','kitchen','Wedding','Two Weeks in the Kitchen','A father-daughter wedding song made from the ordinary hours nobody thinks to photograph.']];

/* The cards play in place, the same way the Jukebox's cards do: the artwork is
   the play button, the YouTube iframe is only injected on tap (no embed cost
   for people who never press play), one song plays at a time, and Escape or
   Close puts the card back. Falls back to a plain YouTube link when the player
   can't load — rural connections drop these embeds more often than you'd
   think. */
const sceneFor=img=>['wedding','kitchen'].includes(img)?'wedding':img==='teacher'?'studio':'porch';
let playing=null;

function buildFace(song,featured=false){
  const [id,img,type,title,desc,artwork]=song;
  const thumbnail=artwork||`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const face=document.createElement('div');
  face.className='card-face';
  const thumb=document.createElement('button');
  thumb.type='button';
  thumb.className='song-image thumb-btn';
  thumb.setAttribute('aria-label','Play “'+title+'”');
  thumb.innerHTML=`<img class="scene-thumb" src="assets/${sceneFor(img)}.webp" alt="" loading="lazy"><img src="${thumbnail}" onerror="this.hidden=true" alt="" loading="${featured?'eager':'lazy'}"><span class="play" aria-hidden="true">▶</span>`;
  thumb.addEventListener('click',()=>startSong(face.closest('.song'),song));
  const meta=document.createElement('div');
  meta.className='card-body';
  meta.innerHTML=`<small>${type}</small><h3>${title}</h3><p>${desc}</p>`;
  if(featured){
    const label=document.createElement('span');
    label.className='weekly-play-label';
    label.textContent='Play this week’s song';
    label.setAttribute('aria-hidden','true');
    thumb.append(label);
    face.append(thumb);
  }else{
    face.append(thumb,meta);
  }
  return face;
}

function buildBar(song,minimal,onStop){
  const bar=document.createElement('div');
  bar.className='player-bar';
  if(!minimal){
    const eq=document.createElement('span');
    eq.className='equalizer';
    eq.setAttribute('aria-hidden','true');
    eq.innerHTML='<span></span><span></span><span></span><span></span>';
    const t=document.createElement('span');
    t.className='player-title';
    t.textContent=song[3];
    bar.append(eq,t);
  }
  const stop=document.createElement('button');
  stop.type='button';
  stop.className='stop-btn';
  stop.textContent='✕ Close';
  stop.setAttribute('aria-label','Stop playing “'+song[3]+'”');
  stop.addEventListener('click',()=>onStop?onStop():stopSong(true));
  bar.append(stop);
  return bar;
}

function buildFallback(song){
  const panel=document.createElement('div');
  panel.className='fallback-panel';
  const msg=document.createElement('p');
  msg.textContent='The player is having trouble loading right now.';
  const link=document.createElement('a');
  link.href='https://youtu.be/'+song[0];
  link.target='_blank';
  link.rel='noopener';
  link.textContent='Open on YouTube →';
  panel.append(msg,link);
  return panel;
}

/* Fills a container with the player itself: the nocookie iframe plus its bar,
   or the plain-link fallback when the visitor is offline. After seven seconds,
   a slow embed gets a nonblocking YouTube link instead of being removed.
   `stillOpen` prevents late help from appearing in an already closed player. */
function fillPlayer(container,song,onStop,stillOpen){
  if(!navigator.onLine){
    container.append(buildFallback(song),buildBar(song,true,onStop));
    return;
  }
  const frame=document.createElement('div');
  frame.className='player-frame';
  const iframe=document.createElement('iframe');
  iframe.src='https://www.youtube-nocookie.com/embed/'+song[0]+'?autoplay=1&rel=0';
  iframe.title='Now playing: '+song[3];
  iframe.allow='autoplay; encrypted-media; picture-in-picture';
  iframe.allowFullscreen=true;
  iframe.loading='eager';
  let loaded=false;
  let loadingHelp=null;
  iframe.addEventListener('load',()=>{
    loaded=true;
    if(loadingHelp)loadingHelp.remove();
  });
  setTimeout(()=>{
    if(loaded||!stillOpen())return;
    loadingHelp=buildFallback(song);
    loadingHelp.classList.add('player-loading-help');
    loadingHelp.querySelector('p').textContent='If the player is taking a while, you can also listen on YouTube.';
    container.append(loadingHelp);
  },7000);
  frame.append(iframe);
  container.append(frame,buildBar(song,false,onStop));
}

function startSong(card,song){
  if(!card||(playing&&playing.card===card))return;
  stopSong();
  closeVideo();
  if(typeof gtag==='function')gtag('event','song_play',{event_category:'engagement',event_label:song[3]});
  const face=card.querySelector('.card-face');
  if(face)face.remove();
  card.style.setProperty('--tilt-x','0deg');
  card.style.setProperty('--tilt-y','0deg');
  const player=document.createElement('div');
  player.className='player-face';
  fillPlayer(player,song,null,()=>!!playing&&playing.card===card);
  card.append(player);
  card.classList.add('is-playing');
  playing={card,song};
  const stop=player.querySelector('.stop-btn');
  if(stop)stop.focus();
}

function stopSong(refocus){
  if(!playing)return;
  const {card,song}=playing;
  playing=null;
  const player=card.querySelector('.player-face');
  if(player)player.remove();
  card.classList.remove('is-playing');
  card.append(buildFace(song,card.classList.contains('weekly-player')));
  if(refocus){
    const thumb=card.querySelector('.thumb-btn');
    if(thumb)thumb.focus();
  }
}

// The first entry is the single source for the weekly spotlight.
const weeklySong=songs[0];
const weeklyPlayer=document.querySelector('#weekly-player');
document.querySelector('#weekly-title').textContent=weeklySong[3];
document.querySelector('#weekly-description').textContent=weeklySong[4];
weeklyPlayer.append(buildFace(weeklySong,true));
for(const song of songs.slice(1)){const card=document.createElement('article');card.className='song';card.append(buildFace(song));document.querySelector('#songs').append(card)}
addEventListener('keydown',e=>{if(e.key==='Escape')stopSong(true)});

/* The WBOY segment isn't a song card, so its links open the same player in a
   lightbox instead. The anchors stay real youtube.com links — scripts-off,
   old browsers, middle-clicks and ctrl-clicks all still reach the video — and
   the click is upgraded in place: the nocookie iframe is only built once
   someone asks for it, one video plays at a time, and Escape, the backdrop or
   Close puts it away. */
let videoModal=null;

function closeVideo(){
  if(videoModal)videoModal.close();
}

function openVideo(feature,opener){
  stopSong();
  closeVideo();
  if(typeof gtag==='function')gtag('event','song_play',{event_category:'engagement',event_label:feature[3]});
  const dialog=document.createElement('dialog');
  dialog.className='video-modal';
  dialog.setAttribute('aria-label','Now playing: '+feature[3]);
  const body=document.createElement('div');
  body.className='video-modal-body';
  fillPlayer(body,feature,closeVideo,()=>videoModal===dialog);
  dialog.append(body);
  dialog.addEventListener('close',()=>{
    if(videoModal===dialog)videoModal=null;
    dialog.remove();
    if(opener&&opener.isConnected)opener.focus();
  });
  /* Clicking the backdrop closes it; the iframe swallows its own clicks. */
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  document.body.append(dialog);
  videoModal=dialog;
  dialog.showModal();
  const stop=dialog.querySelector('.stop-btn');
  if(stop)stop.focus();
}

if(typeof HTMLDialogElement==='function'&&HTMLDialogElement.prototype.showModal){
  for(const link of document.querySelectorAll('a[data-video]')){
    link.addEventListener('click',e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
      e.preventDefault();
      const title=link.dataset.videoTitle||link.textContent.trim();
      openVideo([link.dataset.video,'feature','As seen on',title,''],link);
    });
  }
}

const faq=[['How does it work?','Fill out the intake form with your story. Tim will contact you by email within 24 hours with next steps. He writes your lyrics, works with you on a round of revisions, and produces your custom song.'],['How fast will I get my song?','Most songs arrive in 48–72 hours. Memorial songs always receive 24-hour delivery at no extra charge. For other songs, rush delivery is an additional $50. Mention your date in the intake form and Tim will confirm what’s possible.'],['Can I pick the style and approve the lyrics?','Absolutely. Choose the genre and feeling — romantic, funny, emotional, nostalgic, solemn, or whatever fits your story. You receive the lyrics first, with one round of revisions before production.'],['Can I give this as a gift?','Yes. A custom song makes a personal wedding gift, birthday surprise, anniversary present, or tribute. Share your keepsake page with someone you love, or play your downloaded MP3 at an event.'],['How do I share my song?','Your keepsake page holds your song on an unlisted YouTube link, custom artwork, full lyrics, and MP3 and lyric sheet downloads. Send the page link by text or email. Unlisted links aren’t publicly listed, but anyone with the link can view or share them.'],['Is my song one-of-a-kind?','Every song is built around your story from scratch. Names, memories, and the details that matter to you shape the finished song.'],['What if the finished song misses the mark?','Tim starts over from scratch. The remake guarantee is included in your custom song.']];
for(const [q,a] of faq){const d=document.createElement('details');const s=document.createElement('summary');s.textContent=q;const p=document.createElement('p');p.textContent=a;d.append(s,p);document.querySelector('#questions').append(d)}

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const phoneLayout=matchMedia('(max-width:760px)');
const animated=document.querySelectorAll('.statement,.section-head,.song:not(.weekly-player),.keepsake-copy,.keepsake-stack article,.steps article,.price-card,.quotes figure,.portrait,.about>div:last-child,.faq>div,.closing-content');
animated.forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${(i%3)*110}ms`)});
let revealObserver;
function setupReveal(){if(revealObserver)revealObserver.disconnect();if(reduceMotion.matches){animated.forEach(el=>el.classList.add('seen'));return;}if(!('IntersectionObserver' in window))return;document.documentElement.classList.add('motion-ready');revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('seen');revealObserver.unobserve(entry.target)}})},{threshold:.12});animated.forEach(el=>revealObserver.observe(el));}
setupReveal();
const story=document.querySelector('.home-story');const hero=document.querySelector('.hero');let scheduled=false;
function updateScroll(){scheduled=false;if(reduceMotion.matches||phoneLayout.matches){story.style.setProperty('--journey',0);hero.style.setProperty('--hero-progress',0);return;}const r=story.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-r.top/(story.offsetHeight-innerHeight||1)));story.style.setProperty('--journey',progress);const heroProgress=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/hero.offsetHeight));hero.style.setProperty('--hero-progress',heroProgress);}
function onScroll(){if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);updateScroll();
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){document.documentElement.classList.remove('motion-ready');animated.forEach(el=>el.classList.add('seen'));story.style.setProperty('--journey',0);hero.style.setProperty('--hero-progress',0)}else{setupReveal();updateScroll()}});
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.song:not(.weekly-player),.hero-postcard,.price-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduceMotion.matches||card.classList.contains('is-playing'))return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-((e.clientY-r.top)/r.height-.5)*16}deg`);card.style.setProperty('--tilt-y',`${((e.clientX-r.left)/r.width-.5)*20}deg`)});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')})});}

/* Ambient phone motion runs only while its section is visible. */
const ambientScenes=document.querySelectorAll('.scene-frame,.hero-copy,.closing-content');
let ambientObserver;
function setupMobileMotion(){
  if(ambientObserver)ambientObserver.disconnect();
  ambientScenes.forEach(el=>el.classList.remove('in-view'));
  const enabled=phoneLayout.matches&&!reduceMotion.matches&&!document.hidden&&'IntersectionObserver' in window;
  document.documentElement.classList.toggle('mobile-motion-ready',enabled);
  if(!enabled)return;
  ambientObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting));
  },{threshold:0});
  ambientScenes.forEach(el=>ambientObserver.observe(el));
}
setupMobileMotion();
phoneLayout.addEventListener('change',()=>{setupMobileMotion();updateScroll()});
reduceMotion.addEventListener('change',setupMobileMotion);
document.addEventListener('visibilitychange',setupMobileMotion);

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
