/**
 * script.js | Business Partners × Froneri | Eid 2025
 * Author: Ahmed Kilany — طارق زهران edition
 * Zero external deps except html2canvas CDN
 */
'use strict';
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let downloading = false;

/* ══ 1. LOADER ══ */
window.addEventListener('load', () => {
  setTimeout(() => {
    $('loader').classList.add('out');
    startParticles();
    startGradient();
    initStats();
    cloneTrack();
  }, 2700);
});

/* ══ 2. VH FIX (iOS Safari) ══ */
(function(){
  function setVh(){ document.documentElement.style.setProperty('--vh', window.innerHeight * .01 + 'px'); }
  setVh();
  window.addEventListener('resize', setVh, { passive: true });
})();

/* ══ 3. HEADER ══ */
(function(){
  const hdr = $('header'), btn = $('menuBtn'), nav = $('mobileNav');
  window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.querySelector('i').className = 'fa-solid fa-bars';
  }));
})();

/* ══ 4. BG PARTICLES ══ */
const bgC = $('bgCanvas'), bgCtx = bgC.getContext('2d');
let bgPs = [];
const HUES = [210, 45, 130, 50, 0];
function resizeBg(){ bgC.width = window.innerWidth; bgC.height = window.innerHeight; }
window.addEventListener('resize', resizeBg, { passive: true });
function mkPart(){
  return { x:Math.random()*bgC.width, y:Math.random()*bgC.height,
    r:Math.random()*1.5+.3, a:Math.random()*.5+.1,
    spd:Math.random()*.3+.08, dr:(Math.random()-.5)*.2,
    twk:Math.random()*Math.PI*2, hue:HUES[Math.floor(Math.random()*HUES.length)] };
}
function startParticles(){
  resizeBg();
  for(let i=0;i<80;i++) bgPs.push(mkPart());
  drawBg();
}
function drawBg(){
  bgCtx.clearRect(0,0,bgC.width,bgC.height);
  bgPs.forEach(p=>{
    p.twk+=.016; p.a=.07+Math.abs(Math.sin(p.twk))*.42;
    p.y-=p.spd; p.x+=p.dr;
    if(p.y<-5){p.y=bgC.height+5;p.x=Math.random()*bgC.width;}
    if(p.x<-5||p.x>bgC.width+5){p.x=Math.random()*bgC.width;p.y=bgC.height;}
    bgCtx.save();bgCtx.globalAlpha=p.a;
    bgCtx.beginPath();bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bgCtx.fillStyle=`hsl(${p.hue},80%,65%)`;bgCtx.shadowColor=`hsl(${p.hue},90%,60%)`;bgCtx.shadowBlur=5;
    bgCtx.fill();bgCtx.restore();
  });
  requestAnimationFrame(drawBg);
}

/* ══ 5. CONFETTI ══ */
const cC = $('confCanvas'), cCtx = cC.getContext('2d');
let cPs=[], cAnim=null;
const COLS=['#fbbf24','#e63946','#1d7fd4','#2ec44a','#f4c01e','#f9a8d4','#93c5fd','#fff'];
function resizeC(){ cC.width=window.innerWidth; cC.height=window.innerHeight; }
window.addEventListener('resize', resizeC, { passive: true }); resizeC();
function launchConfetti(){
  resizeC(); cPs=[];
  for(let i=0;i<180;i++) cPs.push({
    x:Math.random()*cC.width, y:-20-Math.random()*260,
    w:Math.random()*10+4, h:Math.random()*5+3,
    color:COLS[Math.floor(Math.random()*COLS.length)],
    angle:Math.random()*Math.PI*2, spin:(Math.random()-.5)*.2,
    vx:(Math.random()-.5)*2.5, vy:Math.random()*2.5+1.5,
    alpha:1, decay:Math.random()*.005+.002
  });
  if(cAnim) cancelAnimationFrame(cAnim);
  animC();
}
function animC(){
  cCtx.clearRect(0,0,cC.width,cC.height);
  cPs=cPs.filter(p=>p.alpha>.02);
  cPs.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;p.vy+=.055;p.alpha=Math.max(0,p.alpha-p.decay);
    cCtx.save();cCtx.globalAlpha=p.alpha;cCtx.translate(p.x,p.y);cCtx.rotate(p.angle);
    cCtx.fillStyle=p.color;cCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cCtx.restore();
  });
  if(cPs.length>0) cAnim=requestAnimationFrame(animC);
  else{cCtx.clearRect(0,0,cC.width,cC.height);cAnim=null;}
}
function stopConfetti(){
  if(cAnim){cancelAnimationFrame(cAnim);cAnim=null;}
  cCtx.clearRect(0,0,cC.width,cC.height);cPs=[];
}

/* ══ 6. CLONE AUTO-TRACK ══ */
function cloneTrack(){
  const track = $('autoTrack');
  if(!track) return;
  // Cards already duplicated in HTML for seamless loop
  // Just add touch interaction
  track.addEventListener('touchstart', ()=>{
    track.style.animationPlayState = 'paused';
  }, { passive: true });
  track.addEventListener('touchend', ()=>{
    // Resume after touch ends - small delay for UX
    setTimeout(()=>{ track.style.animationPlayState = 'running'; }, 1500);
  }, { passive: true });
});
  // Touch pause
  track.addEventListener('touchstart',()=>{ track.style.animationPlayState='paused'; },{passive:true});
  track.addEventListener('touchend',()=>{ setTimeout(()=>track.style.animationPlayState='running',2200); },{passive:true});
}

/* ══ 7. STATS COUNTER ══ */
function initStats(){
  $$('.sn').forEach(el=>{
    const target=parseInt(el.dataset.t,10), dur=1800, step=16;
    const inc=target/(dur/step); let cur=0;
    const io=new IntersectionObserver(e=>{
      if(!e[0].isIntersecting) return; io.disconnect();
      const tick=()=>{ cur=Math.min(cur+inc,target); el.textContent=Math.round(cur).toLocaleString(); if(cur<target) setTimeout(tick,step); };
      tick();
    },{threshold:.5}); io.observe(el);
  });
}



/* ══ 9. GREETING CARD ══ */
(function(){
  const showBtn=$('showCardBtn'),overlay=$('cardOverlay'),closeBtn=$('closeCardBtn'),
        nameIn=$('nameInput'),cName=$('cardName');
  function open(){
    cName.textContent=nameIn.value.trim()||'صديقنا العزيز';
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
    setTimeout(launchConfetti,320);
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow='';
    stopConfetti();
  }
  showBtn.addEventListener('click',open);
  nameIn.addEventListener('keydown',e=>{if(e.key==='Enter') open();});
  closeBtn.addEventListener('click',close);
  overlay.addEventListener('click',e=>{if(e.target===overlay) close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open')) close();});
})();

/* ══ 10. DOWNLOAD — PROFESSIONAL ══ */
(function(){
  const dlBtn=$('dlBtn'),dlIdle=$('dlIdle'),dlLoad=$('dlLoad'),
        actions=$('gcActions'),closeX=$('closeCardBtn'),
        card=$('greetCard'),cName=$('cardName');
  if(!dlBtn) return;
  dlBtn.addEventListener('click', doDownload);

  async function doDownload(){
    if(downloading) return;
    downloading=true;
    dlBtn.disabled=true;
    dlIdle.style.display='none';
    dlLoad.style.display='flex';
    stopConfetti();

    // Hide buttons from screenshot
    actions.style.setProperty('display','none','important');
    closeX.style.setProperty('display','none','important');
    await sleep(220);

    try{
      const rect=card.getBoundingClientRect();
      const canvas=await html2canvas(card,{
        scale:2.5,
        useCORS:true,
        allowTaint:false,
        backgroundColor:null,
        logging:false,
        removeContainer:true,
        width:rect.width,
        height:rect.height,
        windowWidth:document.documentElement.scrollWidth,
        windowHeight:document.documentElement.scrollHeight,
        scrollX:0,
        scrollY:-window.scrollY,
        ignoreElements:el=>
          el.id==='gcActions'||el.id==='closeCardBtn'||
          el.id==='confCanvas'||el.id==='bgCanvas'||el.id==='toast'||el.id==='loader',
      });

      const blob=await new Promise((res,rej)=>{
        canvas.toBlob(b=>b?res(b):rej(new Error('toBlob null')),'image/png',1.0);
      });

      const raw=cName.textContent.trim()||'greeting';
      const safe=raw.replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,'-').replace(/-{2,}/g,'-').substring(0,60)||'greeting';
      const fname=`Eid-Greeting-${safe}.png`;

      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download=fname;a.style.display='none';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url),6000);
      showToast('تم تحميل التهنئة بنجاح ✨');

    }catch(err){
      console.error('[DL]',err);
      showToast('حدث خطأ، حاول مرة أخرى','error');
    }finally{
      actions.style.removeProperty('display');
      closeX.style.removeProperty('display');
      dlBtn.disabled=false;
      dlIdle.style.display='';
      dlLoad.style.display='none';
      downloading=false;
      setTimeout(launchConfetti,400);
    }
  }
})();

/* ══ 11. SHARE ══ */
(function(){
  const btn=$('shareBtn'); if(!btn) return;
  btn.addEventListener('click',async()=>{
    const data={title:'عيد أضحى مبارك ✨',text:'تهنئة خاصة من Business Partners — طارق زهران',url:window.location.href};
    if(navigator.share){ try{await navigator.share(data);}catch{} }
    else{ try{await navigator.clipboard.writeText(window.location.href);showToast('تم نسخ الرابط ✅');}catch{showToast('لا يمكن المشاركة','error');} }
  });
})();

/* ══ 12. MUSIC PLAYER — Web Audio API (no external file needed) ══ */
(function(){
  const widget=$('musicWidget'), mwBtn=$('mwBtn'), mwEq=$('mwEq'), hdrBtn=$('mwHeaderBtn');
  let playing=false, audioCtx=null, masterGain=null, oscs=[];

  setTimeout(()=>{ if(widget) widget.classList.add('visible'); }, 3200);

  // D major pentatonic — pleasant eid-like tones
  const NOTES=[293.66,329.63,369.99,415.30,440.00,493.88,587.33];

  function startMusic(){
    try{
      audioCtx=new(window.AudioContext||window.webkitAudioContext)();
      masterGain=audioCtx.createGain();
      masterGain.gain.setValueAtTime(0,audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(.07,audioCtx.currentTime+1.5);
      masterGain.connect(audioCtx.destination);

      // Create 4 gentle oscillators in harmony
      [0,2,4,6].forEach((ni,i)=>{
        const osc=audioCtx.createOscillator();
        const gain=audioCtx.createGain();
        const lfo=audioCtx.createOscillator();
        const lfoGain=audioCtx.createGain();

        osc.type=['sine','sine','triangle','sine'][i];
        osc.frequency.value=NOTES[ni]*(i===3?2:1); // octave on last

        lfo.frequency.value=.3+i*.07;
        lfoGain.gain.value=.2;
        lfo.connect(lfoGain); lfoGain.connect(gain.gain);
        lfo.start();

        gain.gain.value=.35-i*.05;
        osc.connect(gain); gain.connect(masterGain);
        osc.start(audioCtx.currentTime+i*.4);
        oscs.push(osc,lfo);
      });

      playing=true;
      setPlaying(true);
      showToast('🎵 موسيقى العيد شغّالة ✨');
    }catch(e){ showToast('المتصفح لا يدعم الصوت','error'); }
  }

  function stopMusic(){
    if(masterGain){
      masterGain.gain.linearRampToValueAtTime(0,audioCtx.currentTime+.6);
      setTimeout(()=>{
        oscs.forEach(o=>{try{o.stop();}catch{}});
        oscs=[];
        if(audioCtx){audioCtx.close();audioCtx=null;}
      },700);
    }
    playing=false;
    setPlaying(false);
  }

  function setPlaying(on){
    if(mwBtn) mwBtn.querySelector('i').className=on?'fa-solid fa-pause':'fa-solid fa-play';
    if(mwEq)  mwEq.classList.toggle('active',on);
    if(hdrBtn){ hdrBtn.querySelector('i').className=on?'fa-solid fa-volume-high':'fa-solid fa-music'; hdrBtn.classList.toggle('on',on); }
  }

  function toggle(){ playing?stopMusic():startMusic(); }

  if(mwBtn) mwBtn.addEventListener('click',toggle);
  if(hdrBtn) hdrBtn.addEventListener('click',toggle);
})();

/* ══ 13. SCROLL REVEAL ══ */
(function(){
  if(!('IntersectionObserver' in window)){ $$('.reveal').forEach(el=>el.classList.add('shown')); return; }
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{ if(e.isIntersecting){ setTimeout(()=>e.target.classList.add('shown'),i*110); io.unobserve(e.target); } });
  },{threshold:.15});
  $$('.reveal').forEach(el=>io.observe(el));
})();

/* ══ 14. SMOOTH SCROLL ══ */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href')); if(!t) return;
    e.preventDefault();
    const off=($('header')?.offsetHeight||65)+10;
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-off,behavior:'smooth'});
  });
});

/* ══ 15. TOAST ══ */
let toastT=null;
function showToast(msg,type='success'){
  const el=$('toast');
  $('toast-text').textContent=msg;
  el.className=type==='error'?'error':type==='info'?'info':'';
  el.classList.add('show');
  clearTimeout(toastT);
  toastT=setTimeout(()=>el.classList.remove('show'),3400);
}

/* ══ 16. BODY GRADIENT ══ */
function startGradient(){
  let t=0;
  (function step(){
    t+=.0015;
    const h=220+Math.sin(t)*12;
    document.body.style.background=`radial-gradient(ellipse at 65% 15%, hsl(${h},62%,5%) 0%, hsl(225,72%,3%) 55%, #020710 100%)`;
    requestAnimationFrame(step);
  })();
}
