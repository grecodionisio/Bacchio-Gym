
const $=s=>document.querySelector(s);const show=id=>$(id).classList.remove('hidden');const hide=id=>$(id).classList.add('hidden');
const DEFAULTS={gender:'M',level:'principiante',duration:30,jointCare:false,rpeHistory:[],lastPlan:null,lastDate:null};
const STORAGE_KEY='bacchio_state_v1';
function load(){try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):{...DEFAULTS}}catch(e){return {...DEFAULTS}}}
function save(s){localStorage.setItem(STORAGE_KEY,JSON.stringify(s))}
let STATE=load();
function today(){return new Date().toISOString().slice(0,10)}

const GIFS={
  "pushup_std": "assets/gifs/pushup_std.gif",
  "pushup_knees": "assets/gifs/pushup_knees.gif",
  "pushup_feet_chair": "assets/gifs/pushup_feet_chair.gif",
  "pushup_diamond": "assets/gifs/pushup_diamond.gif",
  "pike_pushup": "assets/gifs/pike_pushup.gif",
  "dips_chair": "assets/gifs/dips_chair.gif",
  "shoulder_taps": "assets/gifs/shoulder_taps.gif",
  "up_down": "assets/gifs/up_down.gif",
  "towel_row_iso": "assets/gifs/towel_row_iso.gif",
  "curl_bottle": "assets/gifs/curl_bottle.gif",
  "lateral_raise": "assets/gifs/lateral_raise.gif",
  "arnold_press": "assets/gifs/arnold_press.gif",
  "squat": "assets/gifs/squat.gif",
  "box_squat_sofa": "assets/gifs/box_squat_sofa.gif",
  "bulgarian_split": "assets/gifs/bulgarian_split.gif",
  "lunge_back": "assets/gifs/lunge_back.gif",
  "step_up": "assets/gifs/step_up.gif",
  "hip_thrust": "assets/gifs/hip_thrust.gif",
  "glute_bridge": "assets/gifs/glute_bridge.gif",
  "frog_pump": "assets/gifs/frog_pump.gif",
  "good_morning": "assets/gifs/good_morning.gif",
  "wall_sit": "assets/gifs/wall_sit.gif",
  "plank": "assets/gifs/plank.gif",
  "plank_knees": "assets/gifs/plank_knees.gif",
  "side_plank": "assets/gifs/side_plank.gif",
  "dead_bug": "assets/gifs/dead_bug.gif",
  "hollow": "assets/gifs/hollow.gif",
  "tuck_hold": "assets/gifs/tuck_hold.gif",
  "russian_twist": "assets/gifs/russian_twist.gif",
  "mountain_climber": "assets/gifs/mountain_climber.gif",
  "burpee_step": "assets/gifs/burpee_step.gif",
  "no_pushup_burpee": "assets/gifs/no_pushup_burpee.gif",
  "squat_jump": "assets/gifs/squat_jump.gif",
  "jumping_jack": "assets/gifs/jumping_jack.gif",
  "skater": "assets/gifs/skater.gif",
  "high_knees": "assets/gifs/high_knees.gif",
  "inout_squat": "assets/gifs/inout_squat.gif",
  "plank_jacks": "assets/gifs/plank_jacks.gif",
  "sprint_spot": "assets/gifs/sprint_spot.gif"
};
const NAMES={
  "pushup_std": "Push-up",
  "pushup_knees": "Push-up ginocchia",
  "pushup_feet_chair": "Push-up piedi su sedia",
  "pushup_diamond": "Push-up diamante",
  "pike_pushup": "Pike push-up",
  "dips_chair": "Dips su sedia",
  "shoulder_taps": "Plank shoulder taps",
  "up_down": "Plank to push-up (up-down)",
  "towel_row_iso": "Trazione isometrica con asciugamano",
  "curl_bottle": "Curl con bottiglie",
  "lateral_raise": "Alzate laterali (bottiglie)",
  "arnold_press": "Arnold press (bottiglie)",
  "squat": "Squat",
  "box_squat_sofa": "Box squat al divano",
  "bulgarian_split": "Bulgarian split squat",
  "lunge_back": "Affondi indietro",
  "step_up": "Step-up (sedia stabile)",
  "hip_thrust": "Hip thrust al divano",
  "glute_bridge": "Ponte glutei",
  "frog_pump": "Frog pump",
  "good_morning": "Good morning (zaino)",
  "wall_sit": "Wall sit",
  "plank": "Plank",
  "plank_knees": "Plank ginocchia",
  "side_plank": "Side plank",
  "dead_bug": "Dead bug",
  "hollow": "Hollow hold",
  "tuck_hold": "Tuck hold",
  "russian_twist": "Russian twist (bottiglia)",
  "mountain_climber": "Mountain climber",
  "burpee_step": "Burpee step-back",
  "no_pushup_burpee": "Burpee senza push-up",
  "squat_jump": "Squat jump",
  "jumping_jack": "Jumping jack",
  "skater": "Skater jump",
  "high_knees": "High knees",
  "inout_squat": "In-and-out squat",
  "plank_jacks": "Plank jacks",
  "sprint_spot": "Sprint sul posto"
};
const DESCR={
  "pushup_std": "Spinta orizzontale a corpo libero. Mani sotto spalle, corpo in linea.",
  "pushup_knees": "Variante facilitata: appoggia le ginocchia, mantieni addome attivo.",
  "pushup_feet_chair": "Variante avanzata: piedi sollevati su sedia stabile.",
  "pushup_diamond": "Enfasi tricipiti: pollici e indici a rombo, gomiti vicino al corpo.",
  "pike_pushup": "Spalle: bacino alto a V rovesciata, testa tra le braccia.",
  "dips_chair": "Tricipiti: mani su bordo sedia stabile, scendi controllando le spalle.",
  "shoulder_taps": "Stabilità scapole: tocca spalla opposta alternando, bacino stabile.",
  "up_down": "Passa da plank su avambracci a push-up e ritorna.",
  "towel_row_iso": "Afferra un asciugamano e tira senza muoverti, scapole attive.",
  "curl_bottle": "Bicipiti: piega i gomiti senza muovere le spalle.",
  "lateral_raise": "Deltoidi: solleva braccia fino a linea spalle, polsi neutri.",
  "arnold_press": "Spalle: ruota e spingi sopra la testa, tronco stabile.",
  "squat": "Piedi alla larghezza spalle, ginocchia seguono la punta dei piedi.",
  "box_squat_sofa": "Tocca il divano e risali, controlla il tronco.",
  "bulgarian_split": "Piede posteriore su sedia, scendi in affondo controllato.",
  "lunge_back": "Fai un passo indietro, ginocchio in linea, busto stabile.",
  "step_up": "Salita su sedia stabile/gradino, spingi dal tallone.",
  "hip_thrust": "Spingi con i glutei, spalle appoggiate al divano.",
  "glute_bridge": "Sdraiato supino, spingi il bacino verso l’alto, glutei stretti.",
  "frog_pump": "Piante dei piedi a farfalla, piccoli slanci glutei.",
  "good_morning": "Flesso-estensione anca, schiena neutra, zaino sulle spalle.",
  "wall_sit": "Isometria: schiena al muro a 90°, tieni la posizione.",
  "plank": "Linea retta testa-piedi, addome e glutei attivi.",
  "plank_knees": "Variante facilitata: appoggia le ginocchia.",
  "side_plank": "Linea orecchio–spalla–anca–caviglia, spingi l’avambraccio.",
  "dead_bug": "Alterna braccio/gamba opposti, zona lombare a terra.",
  "hollow": "Tenuta a banana, lombi a terra, respira corto.",
  "tuck_hold": "Hollow facilitato con ginocchia raccolte.",
  "russian_twist": "Ruota il tronco controllando il bacino, petto aperto.",
  "mountain_climber": "Ginocchia al petto in plank, ritmo controllato.",
  "burpee_step": "Scendi a terra con passo indietro, ritorna e allunga le braccia.",
  "no_pushup_burpee": "Versione più leggera: niente piegamento.",
  "squat_jump": "Squat + salto morbido, atterra ammortizzando.",
  "jumping_jack": "Apertura/chiusura braccia e gambe, ritmo medio.",
  "skater": "Salti laterali controllati, ginocchio allineato.",
  "high_knees": "Corsa sul posto portando le ginocchia alte.",
  "inout_squat": "Alterna posizione stretta e larga in squat.",
  "plank_jacks": "In plank, apri/chiudi i piedi come un jack.",
  "sprint_spot": "Corsa veloce sul posto, postura alta."
};
const MODE={
  "pushup_std": "reps",
  "pushup_knees": "reps",
  "pushup_feet_chair": "reps",
  "pushup_diamond": "reps",
  "pike_pushup": "reps",
  "dips_chair": "reps",
  "shoulder_taps": "reps",
  "up_down": "reps",
  "towel_row_iso": "sec",
  "curl_bottle": "reps",
  "lateral_raise": "reps",
  "arnold_press": "reps",
  "squat": "reps",
  "box_squat_sofa": "reps",
  "bulgarian_split": "reps",
  "lunge_back": "reps",
  "step_up": "reps",
  "hip_thrust": "reps",
  "glute_bridge": "reps",
  "frog_pump": "reps",
  "good_morning": "reps",
  "wall_sit": "sec",
  "plank": "sec",
  "plank_knees": "sec",
  "side_plank": "sec",
  "dead_bug": "reps",
  "hollow": "sec",
  "tuck_hold": "sec",
  "russian_twist": "reps",
  "mountain_climber": "reps",
  "burpee_step": "reps",
  "no_pushup_burpee": "reps",
  "squat_jump": "reps",
  "jumping_jack": "reps",
  "skater": "reps",
  "high_knees": "sec",
  "inout_squat": "reps",
  "plank_jacks": "reps",
  "sprint_spot": "sec"
};

const EX_FORZA=['pushup_std','squat','hip_thrust','curl_bottle','lateral_raise','dips_chair','good_morning'];
const EX_META=['jumping_jack','mountain_climber','inout_squat','plank_jacks','skater','burpee_step','sprint_spot'];
const EX_MOB=['glute_bridge','wall_sit'];

function pick(a){return a[Math.floor(Math.random()*a.length)]}
function rnd(a,b){return Math.round(a+Math.random()*(b-a))}
function prescribe(level,id){
  const m=MODE[id];
  const cfg = level==='principiante' ? {reps:[8,12], sec:[20,30]} : level==='intermedio' ? {reps:[10,14], sec:[30,40]} : {reps:[12,16], sec:[40,50]};
  return m==='sec' ? `${rnd(cfg.sec[0],cfg.sec[1])}″` : `${rnd(cfg.reps[0],cfg.reps[1])} rep`;
}

function generatePlan(){
  const d=Number(STATE.duration);
  const forza=[pick(EX_FORZA), pick(EX_FORZA)];
  const meta=[pick(EX_META), pick(EX_META)];
  const mob=[pick(EX_MOB)];
  const presForza = forza.map(id=>({id, text: prescribe(STATE.level,id)}));
  const presMeta = {minutes: (d===30?12:6), items: meta};
  return {forza, meta, mob, presForza, presMeta, duration:d};
}

function renderSummary(plan){
  const w=document.getElementById('workoutSummary'); w.innerHTML='';
  const b1=document.createElement('div'); b1.className='block'; b1.innerHTML='<h3>Forza</h3>';
  plan.presForza.forEach(x=>{const row=document.createElement('div');row.className='ex-item';
    const link=document.createElement('a'); link.className='ex-name'; link.href='#'; link.textContent=NAMES[x.id]; link.onclick=(e)=>{e.preventDefault();openGif(x.id)};
    const left=document.createElement('span'); left.appendChild(link);
    const right=document.createElement('span'); right.className='badge'; right.textContent=x.text;
    row.appendChild(left); row.appendChild(right); b1.appendChild(row);
  });
  w.appendChild(b1);

  const b2=document.createElement('div'); b2.className='block'; b2.innerHTML=`<h3>Metabolico</h3><div class="ex-item"><span>Circuito</span><span class="badge">${plan.presMeta.minutes}′ AMRAP</span></div>`;
  plan.meta.forEach(id=>{const row=document.createElement('div');row.className='ex-item';
    const link=document.createElement('a'); link.className='ex-name'; link.href='#'; link.textContent=NAMES[id]; link.onclick=(e)=>{e.preventDefault();openGif(id)};
    const left=document.createElement('span'); left.appendChild(link);
    const right=document.createElement('span'); right.className='badge'; right.textContent='libere';
    row.appendChild(left); row.appendChild(right); b2.appendChild(row);
  });
  w.appendChild(b2);

  const b3=document.createElement('div'); b3.className='block'; b3.innerHTML='<h3>Mobilità (opzionale, 5′)</h3>';
  plan.mob.forEach(id=>{const row=document.createElement('div');row.className='ex-item';
    const link=document.createElement('a'); link.className='ex-name'; link.href='#'; link.textContent=NAMES[id]; link.onclick=(e)=>{e.preventDefault();openGif(id)};
    const left=document.createElement('span'); left.appendChild(link);
    const right=document.createElement('span'); right.className='badge'; right.textContent='30–40″';
    row.appendChild(left); row.appendChild(right); b3.appendChild(row);
  });
  w.appendChild(b3);
}

function buildGallery(){
  const keys = Object.keys(NAMES).sort((a,b)=>NAMES[a].localeCompare(NAMES[b],'it'));
  const grid = document.getElementById('galleryGrid'); grid.innerHTML='';
  keys.forEach(id=>{
    const card = document.createElement('div'); card.className='card g-item';
    const img = document.createElement('img'); img.loading='lazy'; img.decoding='async'; img.alt=NAMES[id]; img.src = GIFS[id] || '';
    const h4 = document.createElement('h4'); h4.textContent = NAMES[id];
    const p = document.createElement('p'); p.textContent = DESCR[id] + ' • ' + (MODE[id]==='sec' ? 'Consiglio: 20–40″' : 'Consiglio: 8–14 rep');
    card.appendChild(img); card.appendChild(h4); card.appendChild(p); grid.appendChild(card);
  });
}

function openGif(id){
  buildGallery();
  document.getElementById('home').classList.add('hidden');
  document.getElementById('gallery').classList.remove('hidden');
  const grid = document.getElementById('galleryGrid');
  const idx = Object.keys(NAMES).sort((a,b)=>NAMES[a].localeCompare(NAMES[b],'it')).indexOf(id);
  if (idx>=0){ const el = grid.children[idx]; el.scrollIntoView({behavior:'smooth', block:'center'}); }
}

function goHome(){ document.getElementById('gallery').classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); }
function refresh(){ if(STATE.lastDate!==today()){ STATE.lastPlan=generatePlan(); STATE.lastDate=today(); save(STATE); } renderSummary(STATE.lastPlan); }

document.addEventListener('DOMContentLoaded',()=>{
  let deferred=null; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const b=document.getElementById('installBtn');b.hidden=false;b.onclick=()=>{b.hidden=true; deferred.prompt(); deferred=null;};});
  if(!localStorage.getItem(STORAGE_KEY)){ document.getElementById('onboarding').classList.remove('hidden'); document.getElementById('startApp').onclick=()=>{
      if(!document.getElementById('safetyAck').checked){ alert('Conferma la checklist di sicurezza.'); return; }
      STATE.gender=document.getElementById('gender').value;
      STATE.level=document.getElementById('level').value;
      STATE.duration=Number(document.getElementById('duration').value);
      STATE.jointCare=document.getElementById('jointCare').checked;
      save(STATE);
      document.getElementById('onboarding').classList.add('hidden');
      document.getElementById('home').classList.remove('hidden');
      refresh();
    };
  } else { document.getElementById('home').classList.remove('hidden'); refresh(); }

  document.getElementById('regenerate').onclick=()=>{ STATE.lastPlan=generatePlan(); save(STATE); renderSummary(STATE.lastPlan); };
  document.getElementById('galleryBtn').onclick=()=>{ buildGallery(); document.getElementById('home').classList.add('hidden'); document.getElementById('gallery').classList.remove('hidden'); };
  document.getElementById('backHome').onclick=goHome;

  // settings
  document.getElementById('settings').onclick=()=>{
    document.getElementById('home').classList.add('hidden'); document.getElementById('settingsPanel').classList.remove('hidden');
    document.getElementById('genderSet').innerHTML='<option value="M">Maschio</option><option value="F">Femmina</option>';
    document.getElementById('levelSet').innerHTML='<option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="esperto">Esperto</option>';
    document.getElementById('durationSet').innerHTML='<option value="30">30 minuti</option><option value="10">10 minuti</option>';
    document.getElementById('genderSet').value=STATE.gender; document.getElementById('levelSet').value=STATE.level; document.getElementById('durationSet').value=String(STATE.duration);
    document.getElementById('jointCareSet').checked=STATE.jointCare;
  };
  document.getElementById('backHome2').onclick=()=>{ document.getElementById('settingsPanel').classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); };
  document.getElementById('saveSettings').onclick=()=>{ STATE.gender=document.getElementById('genderSet').value; STATE.level=document.getElementById('levelSet').value; STATE.duration=Number(document.getElementById('durationSet').value); STATE.jointCare=document.getElementById('jointCareSet').checked; save(STATE); document.getElementById('settingsPanel').classList.add('hidden'); document.getElementById('home').classList.remove('hidden'); refresh(); };

  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./service-worker.js'); }
});
