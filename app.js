// Bacchio Gym - App client-only (no backend), PWA offline
// State & storage
const $ = sel => document.querySelector(sel);
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');

const DEFAULTS = {
  gender: 'M', level: 'principiante', duration: 30, jointCare: false,
  rpeHistory: [], lastPlan: null, lastDate: null
};

const STORAGE_KEY = 'bacchio_state_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {...DEFAULTS};
    const s = JSON.parse(raw);
    return {...DEFAULTS, ...s};
  } catch(e){ return {...DEFAULTS}; }
}

function saveState(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

let STATE = loadState();

// Bias by gender
function biasFor(g){
  return g === 'M' ? {upper:0.5, lower:0.3, core:0.2} : {upper:0.3, lower:0.5, core:0.2};
}

// Exercises data (embedded minimal, could be loaded from JSON)
const EXERCISES = [
  {
    "id": "pushup_std",
    "nome": "Push-up",
    "categoria": "upper",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "pushup_knees",
        "nome": "Push-up ginocchia",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "pushup_std",
        "nome": "Push-up standard",
        "scalata": 0
      },
      {
        "id": "pushup_feet_chair",
        "nome": "Push-up piedi su sedia",
        "scalata": 1
      }
    ],
    "note_sicurezza": "Polsi in linea, addome attivo."
  },
  {
    "id": "pushup_diamond",
    "nome": "Push-up diamante",
    "categoria": "upper",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "pushup_diamond_knees",
        "nome": "Diamante ginocchia",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "pushup_diamond",
        "nome": "Diamante",
        "scalata": 0
      }
    ]
  },
  {
    "id": "pike_pushup",
    "nome": "Pike push-up",
    "categoria": "upper",
    "attrezzi": [
      "divano"
    ],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "pike_high",
        "nome": "Pike alto al divano",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "pike_pushup",
        "nome": "Pike",
        "scalata": 0
      }
    ]
  },
  {
    "id": "dips_chair",
    "nome": "Dips su sedia",
    "categoria": "upper",
    "attrezzi": [
      "sedia"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "dips_chair_easy",
        "nome": "Dips ROM ridotto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "dips_chair",
        "nome": "Dips sedia",
        "scalata": 0
      }
    ]
  },
  {
    "id": "shoulder_taps",
    "nome": "Plank shoulder taps",
    "categoria": "upper",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "shoulder_taps_knees",
        "nome": "Shoulder taps ginocchia",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "shoulder_taps",
        "nome": "Shoulder taps",
        "scalata": 0
      }
    ]
  },
  {
    "id": "up_down",
    "nome": "Plank to push-up (up-down)",
    "categoria": "upper",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "up_down_knees",
        "nome": "Up-down ginocchia",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "up_down",
        "nome": "Up-down",
        "scalata": 0
      }
    ]
  },
  {
    "id": "towel_row_iso",
    "nome": "Trazione isometrica con asciugamano",
    "categoria": "upper",
    "attrezzi": [
      "asciugamano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "towel_row_light",
        "nome": "Trazione leggera",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "towel_row_iso",
        "nome": "Trazione isometrica",
        "scalata": 0
      }
    ]
  },
  {
    "id": "curl_bottle",
    "nome": "Curl con bottiglie",
    "categoria": "upper",
    "attrezzi": [
      "bottiglie"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "curl_light",
        "nome": "Curl leggero",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "curl_bottle",
        "nome": "Curl",
        "scalata": 0
      },
      {
        "id": "curl_backpack",
        "nome": "Curl con zaino",
        "scalata": 1
      }
    ]
  },
  {
    "id": "lateral_raise",
    "nome": "Alzate laterali bottiglie",
    "categoria": "upper",
    "attrezzi": [
      "bottiglie"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "lat_raise_light",
        "nome": "Alzate leggere",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "lateral_raise",
        "nome": "Alzate laterali",
        "scalata": 0
      }
    ]
  },
  {
    "id": "arnold_press",
    "nome": "Arnold press seduto (bottiglie)",
    "categoria": "upper",
    "attrezzi": [
      "divano",
      "bottiglie"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "arnold_light",
        "nome": "Arnold leggero",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "arnold_press",
        "nome": "Arnold press",
        "scalata": 0
      }
    ]
  },
  {
    "id": "squat",
    "nome": "Squat a corpo libero",
    "categoria": "lower",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "box_squat_sofa",
        "nome": "Box squat al divano",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "squat",
        "nome": "Squat",
        "scalata": 0
      }
    ]
  },
  {
    "id": "bulgarian_split",
    "nome": "Bulgarian split squat",
    "categoria": "lower",
    "attrezzi": [
      "sedia"
    ],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "lunge_static",
        "nome": "Affondi statici",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "bulgarian_split",
        "nome": "Bulgarian",
        "scalata": 0
      }
    ]
  },
  {
    "id": "lunge_back",
    "nome": "Affondi indietro",
    "categoria": "lower",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "lunge_short",
        "nome": "Affondo corto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "lunge_back",
        "nome": "Affondi indietro",
        "scalata": 0
      }
    ]
  },
  {
    "id": "step_up",
    "nome": "Step-up (sedia stabile)",
    "categoria": "lower",
    "attrezzi": [
      "sedia"
    ],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "step_low",
        "nome": "Step basso (gradino)",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "step_up",
        "nome": "Step-up",
        "scalata": 0
      }
    ]
  },
  {
    "id": "hip_thrust",
    "nome": "Hip thrust al divano",
    "categoria": "lower",
    "attrezzi": [
      "divano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "glute_bridge",
        "nome": "Ponte glutei",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "hip_thrust",
        "nome": "Hip thrust",
        "scalata": 0
      }
    ]
  },
  {
    "id": "frog_pump",
    "nome": "Frog pump",
    "categoria": "lower",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "frog_small",
        "nome": "Frog pump ridotto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "frog_pump",
        "nome": "Frog pump",
        "scalata": 0
      }
    ]
  },
  {
    "id": "good_morning",
    "nome": "Good morning (zaino)",
    "categoria": "lower",
    "attrezzi": [
      "zaino"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "good_morning_noload",
        "nome": "Good morning senza carico",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "good_morning",
        "nome": "Good morning",
        "scalata": 0
      }
    ]
  },
  {
    "id": "wall_sit",
    "nome": "Wall sit",
    "categoria": "lower",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "wall_sit_short",
        "nome": "Wall sit breve",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "wall_sit",
        "nome": "Wall sit",
        "scalata": 0
      }
    ]
  },
  {
    "id": "plank",
    "nome": "Plank",
    "categoria": "core",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "plank_knees",
        "nome": "Plank ginocchia",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "plank",
        "nome": "Plank",
        "scalata": 0
      },
      {
        "id": "plank_pack",
        "nome": "Plank con zaino",
        "scalata": 1
      }
    ]
  },
  {
    "id": "side_plank",
    "nome": "Side plank",
    "categoria": "core",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "side_plank_knee",
        "nome": "Side plank ginocchio",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "side_plank",
        "nome": "Side plank",
        "scalata": 0
      }
    ]
  },
  {
    "id": "dead_bug",
    "nome": "Dead bug",
    "categoria": "core",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "dead_bug_short",
        "nome": "Dead bug ridotto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "dead_bug",
        "nome": "Dead bug",
        "scalata": 0
      }
    ]
  },
  {
    "id": "hollow",
    "nome": "Hollow hold",
    "categoria": "core",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "tuck_hold",
        "nome": "Tuck hold",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "hollow",
        "nome": "Hollow hold",
        "scalata": 0
      }
    ]
  },
  {
    "id": "russian_twist",
    "nome": "Russian twist (bottiglia)",
    "categoria": "core",
    "attrezzi": [
      "bottiglie"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "twist_bodyweight",
        "nome": "Twist senza carico",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "russian_twist",
        "nome": "Russian twist",
        "scalata": 0
      }
    ]
  },
  {
    "id": "mountain_climber",
    "nome": "Mountain climber",
    "categoria": "core",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "mountain_slow",
        "nome": "Climber lento",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "mountain_climber",
        "nome": "Mountain climber",
        "scalata": 0
      }
    ]
  },
  {
    "id": "burpee_step",
    "nome": "Burpee step-back",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "no_pushup_burpee",
        "nome": "Burpee senza push-up",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "burpee_step",
        "nome": "Burpee step-back",
        "scalata": 0
      }
    ]
  },
  {
    "id": "squat_jump",
    "nome": "Squat jump",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "squat_no_jump",
        "nome": "Squat senza salto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "squat_jump",
        "nome": "Squat jump",
        "scalata": 0
      }
    ]
  },
  {
    "id": "jumping_jack",
    "nome": "Jumping jack",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "low_jack",
        "nome": "Jack basso",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "jumping_jack",
        "nome": "Jumping jack",
        "scalata": 0
      }
    ]
  },
  {
    "id": "skater",
    "nome": "Skater jump",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "skater_step",
        "nome": "Passo laterale",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "skater",
        "nome": "Skater jump",
        "scalata": 0
      }
    ]
  },
  {
    "id": "high_knees",
    "nome": "High knees",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "march",
        "nome": "Marcia veloce",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "high_knees",
        "nome": "High knees",
        "scalata": 0
      }
    ]
  },
  {
    "id": "inout_squat",
    "nome": "In-and-out squat",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "inout_no_jump",
        "nome": "Senza salto",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "inout_squat",
        "nome": "In-and-out squat",
        "scalata": 0
      }
    ]
  },
  {
    "id": "plank_jacks",
    "nome": "Plank jacks",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "plank_open_alt",
        "nome": "Apertura alternata",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "plank_jacks",
        "nome": "Plank jacks",
        "scalata": 0
      }
    ]
  },
  {
    "id": "sprint_spot",
    "nome": "Sprint sul posto",
    "categoria": "full",
    "attrezzi": [],
    "gif": "",
    "livello_base": "intermedio",
    "varianti": [
      {
        "id": "march_fast",
        "nome": "Marcia molto veloce",
        "scalata": -1,
        "articolazioniDelicate": true
      },
      {
        "id": "sprint_spot",
        "nome": "Sprint sul posto",
        "scalata": 0
      }
    ]
  },
  {
    "id": "cat_cow",
    "nome": "Cat-cow",
    "categoria": "mobility",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "cat_cow",
        "nome": "Cat-cow",
        "scalata": 0
      }
    ]
  },
  {
    "id": "hip_flexor",
    "nome": "Stretch flessori anca",
    "categoria": "mobility",
    "attrezzi": [
      "divano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "hip_flexor",
        "nome": "Stretch flessori",
        "scalata": 0
      }
    ]
  },
  {
    "id": "pigeon",
    "nome": "Pigeon stretch",
    "categoria": "mobility",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "pigeon",
        "nome": "Pigeon",
        "scalata": 0
      }
    ]
  },
  {
    "id": "hamstring_towel",
    "nome": "Stretch ischiocrurali (asciugamano)",
    "categoria": "mobility",
    "attrezzi": [
      "asciugamano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "hamstring_towel",
        "nome": "Hamstring towel",
        "scalata": 0
      }
    ]
  },
  {
    "id": "child_pose",
    "nome": "Child's pose + thread the needle",
    "categoria": "mobility",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "child_pose",
        "nome": "Child pose + needle",
        "scalata": 0
      }
    ]
  },
  {
    "id": "ankle_dorsi",
    "nome": "Dorsiflessione caviglia al muro",
    "categoria": "mobility",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "ankle_dorsi",
        "nome": "Ankle dorsiflexion",
        "scalata": 0
      }
    ]
  },
  {
    "id": "figure4_sofa",
    "nome": "Figure-4 al divano",
    "categoria": "mobility",
    "attrezzi": [
      "divano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "figure4_sofa",
        "nome": "Figure-4",
        "scalata": 0
      }
    ]
  },
  {
    "id": "tspine_opener",
    "nome": "Apertura T-spine sul divano",
    "categoria": "mobility",
    "attrezzi": [
      "divano"
    ],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "tspine_opener",
        "nome": "T-spine opener",
        "scalata": 0
      }
    ]
  },
  {
    "id": "shoulder_cars",
    "nome": "Shoulder CARs lenti",
    "categoria": "mobility",
    "attrezzi": [],
    "gif": "",
    "livello_base": "principiante",
    "varianti": [
      {
        "id": "shoulder_cars",
        "nome": "Shoulder CARs",
        "scalata": 0
      }
    ]
  }
];

// Utilities
function todayStr(){ return new Date().toISOString().slice(0,10); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function filterByCat(cat){ return EXERCISES.filter(e => e.categoria === cat); }

function variantFor(e, level, jointCare){
  // Choose variant based on level and jointCare
  let v = e.varianti.find(v=>v.scalata===0) || e.varianti[0];
  if (jointCare){
    const del = e.varianti.find(v=>v.articolazioniDelicate);
    if (del) v = del;
  }
  if (level === 'principiante'){
    const easy = e.varianti.find(v=>v.scalata===-1);
    if (easy) v = easy;
  } else if (level === 'esperto'){
    const hard = e.varianti.find(v=>v.scalata===1);
    if (hard) v = hard;
  }
  return v;
}

// Generator
function generatePlan(state){
  const duration = Number(state.duration);
  const bias = biasFor(state.gender);

  // Avoid repeating same exercise more than 3x/week => track lastPlan only (simplified)
  // We'll rotate among pools respecting 'no heavy lower two days in a row' by limiting lower density if yesterday focused lower.

  const forza = [];
  const metabolico = [];
  const mobility = [];

  // Select strength: prefer cat according to bias
  const cats = ['upper','lower','core'];
  const weighted = [];
  cats.forEach(c => {
    const count = Math.round(bias[c]*10);
    for(let i=0;i<count;i++) weighted.push(c);
  });
  // Make sure we don't choose heavy lower two days in a row -> we control with a flag
  const yesterday = state.lastPlan && state.lastDate === todayStr() ? state.lastPlan : null;
  const avoidLowerHeavy = state.lastPlan && state.lastPlan.lowerHeavy;

  // Choose 2 exercises for forza (upper-biased for M; lower-biased for F)
  for (let i=0;i<2;i++){
    let cat = pick(weighted);
    if (avoidLowerHeavy && cat==='lower') cat = pick(['upper','core']);
    const pool = EXERCISES.filter(e => e.categoria === cat && e.categoria!=='mobility');
    const ex = pick(pool);
    const v = variantFor(ex, state.level, state.jointCare);
    forza.push({ ex, variante: v });
  }

  // Metabolic circuit (2 or 3 exercises based on duration)
  const metaSize = duration===30 ? 3 : 2;
  const poolMeta = EXERCISES.filter(e => ['full','core','upper','lower'].includes(e.categoria));
  const chosen = new Set();
  while (metabolico.length < metaSize){
    const ex = pick(poolMeta);
    if (chosen.has(ex.id)) continue;
    chosen.add(ex.id);
    const v = variantFor(ex, state.level, state.jointCare);
    metabolico.push({ ex, variante: v });
  }

  // Mobility micro-dose always present as optional
  const mobPool = EXERCISES.filter(e => e.categoria==='mobility');
  for (let i=0;i<2;i++){
    const ex = pick(mobPool);
    mobility.push({ ex, variante: ex.varianti[0] });
  }

  // Tag if lower heavy (heuristic: if forza includes squat/bulgarian/lunge/step_up)
  const lowerIds = ['squat','bulgarian_split','lunge_back','step_up','hip_thrust'];
  const lowerHeavy = forza.some(f => lowerIds.includes(f.ex.id));

  const plan = {
    forza,
    metabolico,
    mobility,
    duration,
    prescriptions: prescribe(state, forza, metabolico, duration),
    lowerHeavy
  };
  return plan;
}

// Prescriptions (reps/time) & auto-progression based on last RPE
function prescribe(state, forza, metabolico, duration){
  const lastRPE = state.rpeHistory.slice(-1)[0] || 7;
  let scale = 1;
  if (lastRPE <= 6) scale = 1.1;
  if (lastRPE >= 9) scale = 0.85;

  const level = state.level;
  const cfg = level === 'principiante' ? {sets:3, reps:[8,12], hold:[20,30], rest:60}
            : level === 'intermedio' ? {sets:3, reps:[10,14], hold:[30,40], rest:45}
            : {sets:4, reps:[12,16], hold:[40,50], rest:40};

  function rnd(a,b){ return Math.round(a + Math.random()*(b-a)); }

  const forzaPresc = forza.map(f => {
    const reps = rnd(cfg.reps[0], cfg.reps[1]);
    const hold = rnd(cfg.hold[0], cfg.hold[1]);
    return { id:f.ex.id, nome:f.variante.nome, sets:cfg.sets, reps, holdSec:hold, restSec:cfg.rest, tipo:(f.ex.categoria==='core'?'tempo':'reps') };
  });

  const metaTime = duration===30 ? 12 : 6;
  const metaPresc = { type:'AMRAP', minutes: Math.round(metaTime*scale), items: metabolico.map(m => ({ id:m.ex.id, nome:m.variante.nome, target:'tempo/reps libere' })) };

  const mobility = { minutes: 5, items: [] };

  return { forza:forzaPresc, metabolico:metaPresc, mobility };
}

// UI bindings
function renderSummary(plan){
  const wrap = $('#workoutSummary');
  wrap.innerHTML = '';

  const forzaDiv = document.createElement('div');
  forzaDiv.className = 'block';
  forzaDiv.innerHTML = '<h3>Forza</h3>';
  plan.prescriptions.forza.forEach(p => {
    const row = document.createElement('div'); row.className='ex-item';
    row.innerHTML = `<span>${p.nome}</span><span class="badge">${p.sets}×${p.tipo==='reps'?p.reps: p.holdSec+'″'} • riposi ${p.restSec}″</span>`;
    forzaDiv.appendChild(row);
  });
  wrap.appendChild(forzaDiv);

  const metaDiv = document.createElement('div');
  metaDiv.className = 'block';
  metaDiv.innerHTML = `<h3>Metabolico</h3><div class="ex-item"><span>Circuito</span><span class="badge">${plan.prescriptions.metabolico.minutes}′ AMRAP</span></div>`;
  plan.metabolico.forEach(m => {
    const row = document.createElement('div'); row.className='ex-item';
    row.innerHTML = `<span>${m.variante.nome}</span><span class="badge">libere</span>`;
    metaDiv.appendChild(row);
  });
  wrap.appendChild(metaDiv);

  const mobDiv = document.createElement('div');
  mobDiv.className = 'block';
  mobDiv.innerHTML = `<h3>Mobilità (opzionale, 5′)</h3>`;
  plan.mobility.forEach(m => {
    const row = document.createElement('div'); row.className='ex-item';
    row.innerHTML = `<span>${m.variante.nome}</span><span class="badge">30–40″</span>`;
    mobDiv.appendChild(row);
  });
  wrap.appendChild(mobDiv);
}

// Simple workout runner (one block at a time)
let currentBlock = null;
let blockIndex = 0;
let timerInt = null;
let seconds = 0;

function fmt(mmss){
  const m = Math.floor(mmss/60).toString().padStart(2,'0');
  const s = (mmss%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function beep(){
  // WebAudio beep offline
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = 880;
  o.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime+0.01);
  o.start();
  setTimeout(()=>{ g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+0.2); o.stop(); ctx.close(); }, 300);
}

function sayCue(txt){
  $('#cue').textContent = txt;
  beep();
}

function startTimer(){
  seconds = 0;
  $('#timer').textContent = fmt(seconds);
  if (timerInt) clearInterval(timerInt);
  timerInt = setInterval(()=>{
    seconds++;
    $('#timer').textContent = fmt(seconds);
  }, 1000);
}

function stopTimer(){
  if (timerInt) clearInterval(timerInt);
  timerInt = null;
}

function goHome(){
  hide('#workout'); hide('#rpe'); hide('#settingsPanel'); show('#home');
}

function startWorkoutFlow(plan){
  hide('#home'); show('#workout');
  currentBlock = 'forza';
  blockIndex = 0;
  runStrength(plan.prescriptions.forza);
}

function runStrength(list){
  sayCue('Inizio Forza');
  startTimer();
  const panel = $('#exercisePanel');
  panel.innerHTML = '';
  let i = 0;

  function renderItem(){
    if (i >= list.length){ // next block
      stopTimer();
      sayCue('Forza completata');
      $('#endBlock').onclick = () => runMetcon();
      return;
    }
    const item = list[i];
    panel.innerHTML = `<h3>${item.nome}</h3><p>${item.sets} serie × ${item.tipo==='reps'? item.reps+' ripetizioni' : item.holdSec+' secondi'}. Riposo ${item.restSec}″</p>`;
    $('#scaleDown').onclick = ()=>{ item.reps = Math.max( (item.reps||10)-2, 4 ); sayCue('Scala'); };
    $('#scaleUp').onclick = ()=>{ item.reps = (item.reps||10)+2; sayCue('Spingi'); };
    $('#skip').onclick = ()=>{ i++; renderItem(); };
    $('#endBlock').onclick = ()=>{ i++; renderItem(); };
  }
  renderItem();
}

function runMetcon(){
  sayCue('Inizio Metabolico');
  startTimer();
  const p = STATE.lastPlan.prescriptions.metabolico;
  const exs = STATE.lastPlan.metabolico;
  const panel = $('#exercisePanel');
  panel.innerHTML = `<h3>Circuito AMRAP ${p.minutes}′</h3>` + exs.map(e=>`<div class="ex-item"><span>${e.variante.nome}</span><span class="badge">libere</span></div>`).join('');
  $('#scaleDown').onclick = ()=> sayCue('Scala');
  $('#scaleUp').onclick = ()=> sayCue('Spingi');
  $('#skip').onclick = ()=> sayCue('Continua');
  let total = p.minutes * 60;
  if (timerInt) clearInterval(timerInt);
  seconds = total;
  $('#timer').textContent = fmt(seconds);
  timerInt = setInterval(()=>{
    seconds--;
    $('#timer').textContent = fmt(seconds);
    if (seconds===30) sayCue('30 secondi');
    if (seconds<=0){
      clearInterval(timerInt);
      sayCue('Fine Metabolico');
      $('#endBlock').onclick = () => finishWorkout();
    }
  }, 1000);
}

function finishWorkout(){
  stopTimer();
  hide('#workout'); show('#rpe');
}

// RPE handling
$('#rpeInput').addEventListener('input', e => $('#rpeVal').textContent = e.target.value);
$('#saveRpe').addEventListener('click', ()=>{
  const r = Number($('#rpeInput').value);
  STATE.rpeHistory.push(r);
  saveState(STATE);
  hide('#rpe'); goHome();
});

// Settings
function openSettings(){
  const gSel = $('#genderSet'), lSel = $('#levelSet'), dSel = $('#durationSet');
  gSel.innerHTML = `<option value="M">Maschio</option><option value="F">Femmina</option>`;
  lSel.innerHTML = `<option value="principiante">Principiante</option><option value="intermedio">Intermedio</option><option value="esperto">Esperto</option>`;
  dSel.innerHTML = `<option value="30">30 minuti</option><option value="10">10 minuti</option>`;
  gSel.value = STATE.gender;
  lSel.value = STATE.level;
  dSel.value = String(STATE.duration);
  $('#jointCareSet').checked = STATE.jointCare;
  hide('#home'); show('#settingsPanel');
}
$('#settings').addEventListener('click', openSettings);
$('#backHome').addEventListener('click', goHome);
$('#saveSettings').addEventListener('click', ()=>{
  STATE.gender = $('#genderSet').value;
  STATE.level = $('#levelSet').value;
  STATE.duration = Number($('#durationSet').value);
  STATE.jointCare = $('#jointCareSet').checked;
  saveState(STATE);
  goHome();
  refreshHome();
});

// Home & Onboarding
function refreshHome(){
  const today = todayStr();
  if (STATE.lastDate !== today){
    const plan = generatePlan(STATE);
    STATE.lastPlan = plan;
    STATE.lastDate = today;
    saveState(STATE);
  }
  renderSummary(STATE.lastPlan);
}

function init(){
  // PWA install handling
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    const btn = $('#installBtn');
    btn.hidden = false;
    btn.onclick = async ()=>{
      btn.hidden = true;
      deferredPrompt.prompt();
      deferredPrompt = null;
    };
  });

  if (!localStorage.getItem(STORAGE_KEY)){
    // First time → show onboarding
    show('#onboarding');
    $('#startApp').addEventListener('click', ()=>{
      const gender = $('#gender').value;
      const level = $('#level').value;
      const duration = Number($('#duration').value);
      const jointCare = $('#jointCare').checked;
      const safety = $('#safetyAck').checked;
      if (!safety){ alert('Conferma la checklist di sicurezza.'); return; }
      STATE = {...DEFAULTS, gender, level, duration, jointCare};
      saveState(STATE);
      hide('#onboarding'); show('#home'); refreshHome();
    });
  } else {
    show('#home'); refreshHome();
  }

  $('#regenerate').addEventListener('click', ()=>{
    STATE.lastPlan = generatePlan(STATE);
    saveState(STATE);
    renderSummary(STATE.lastPlan);
  });

  $('#startWorkout').addEventListener('click', ()=>{
    startWorkoutFlow(STATE.lastPlan);
  });

  $('#endBlock').addEventListener('click', ()=>{
    // fallback handler overwritten by blocks
  });

  if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service-worker.js');
  }
}

document.addEventListener('DOMContentLoaded', init);
