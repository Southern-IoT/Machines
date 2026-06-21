// Hand-curated taxonomy of ~30-40 sewing-machine part concepts.
//
// Goal: every part row in src/content/machines/*.json should map to ONE concept
// (or stay as a model-specific orphan). The lookup logic is:
//
//   1. Scan partName + partId + category for matching patterns.
//   2. First match wins (order matters: more specific patterns first).
//   3. If no concept matches, the part stays as a "model-specific orphan"
//      and won't appear in the inventory (it's already known to be unique).
//
// The `generic` flag means: this concept's image is uploaded ONCE with no
// brand prefix, and every machine that uses this part (regardless of brand)
// gets the same image. Used for industry-standard parts like Needle DC×27,
// 608ZZ bearings, V-belts.
//
// The `appliesToCategories` filter (optional) restricts the concept to
// machines in those categories. E.g. "Upper Looper" only matches Overlock /
// Chain Stitch machines — it would be a false match on a lockstitch machine.

export interface ConceptDef {
  /** Stable identifier — used as the lookup key in the parts library. */
  key: string;
  /** Display name in TinaCMS. */
  label: string;
  /** One or more regex patterns tested against the part's partName. */
  patterns: RegExp[];
  /** Industry-standard parts (Needle, Bearing, V-Belt) share across brands. */
  generic: boolean;
  /** Optional: only match parts in machines of these categories. */
  appliesToCategories?: string[];
  /** Optional: only match parts with these brands (else any brand). */
  appliesToBrands?: string[];
}

export const CONCEPTS: ConceptDef[] = [
  // ═══════════════════════════════════════════════════════════════════
  // NEEDLES (generic — system codes transcend brand)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "needle-dc27",
    label: "Needle (DC×27 system)",
    patterns: [/\bdc\s*[×x]\s*27\b/i, /needle\s*\(dc\s*[×x]\s*27/i],
    generic: true,
  },
  {
    key: "needle-db1",
    label: "Needle (DB×1 system)",
    patterns: [/\bdb\s*[×x]\s*1\b/i, /needle\s*\(db\s*[×x]\s*1/i],
    generic: true,
  },
  {
    key: "needle-135x17",
    label: "Needle (135×17 system)",
    patterns: [/135\s*[×x]\s*17/i],
    generic: true,
  },
  {
    key: "needle-tvx64",
    label: "Needle (TV×64 / TVX64 system)",
    patterns: [/tv\s*[×x]\s*64/i, /tvx\s*64/i, /tvx64/i],
    generic: true,
  },
  {
    key: "needle-generic",
    label: "Needle (generic / unspecified system)",
    patterns: [/^needle(\s*\(\s*x\d+\s*\))?$/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // BEARINGS (generic — 608ZZ, 6200ZZ are industry-standard sizes)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "bearing-608zz",
    label: "Ball Bearing 608ZZ",
    patterns: [/608\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6200zz",
    label: "Ball Bearing 6200ZZ",
    patterns: [/6200\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6201zz",
    label: "Ball Bearing 6201ZZ",
    patterns: [/6201\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6202zz",
    label: "Ball Bearing 6202ZZ",
    patterns: [/6202\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6203zz",
    label: "Ball Bearing 6203ZZ",
    patterns: [/6203\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6204zz",
    label: "Ball Bearing 6204ZZ",
    patterns: [/6204\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-6302vv",
    label: "Ball Bearing 6302VV (thrust)",
    patterns: [/6302\s*vv/i, /thrust\s*6302/i],
    generic: true,
  },
  {
    key: "bearing-6904zz",
    label: "Ball Bearing 6904ZZ",
    patterns: [/6904\s*zz/i],
    generic: true,
  },
  {
    key: "bearing-generic",
    label: "Ball Bearing (generic / unspecified size)",
    patterns: [/\bbearing(s)?\b/i, /radial\s*ball/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // BELTS (generic within type)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "v-belt",
    label: "V-Belt (Drive Belt)",
    patterns: [/v\s*-?\s*belt/i, /drive\s*belt/i],
    generic: true,
  },
  {
    key: "timing-belt",
    label: "Timing Belt (Synchronous Toothed Belt)",
    patterns: [/timing\s*belt/i, /synchronous\s*toothed/i, /toothed\s*belt/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // BOBBIN (L-style industrial — same across brands, brand-scoped)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "bobbin",
    label: "Bobbin (assembly with case)",
    patterns: [/^bobbin(\s+and\s+bobbin\s+case)?$/i, /^bobbin\s*case$/i, /^bobbin\s*$/i],
    generic: false,
    appliesToCategories: [
      "Sewing Machine",
      "Bartacking Machine",
      "Buttonhole Machine",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // MOTORS (generic — industry-standard 550W/750W servo, clutched)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "motor-ac-servo",
    label: "AC Servo Motor (Direct-Drive)",
    patterns: [/ac\s*servo\s*motor/i, /direct\s*-?\s*drive\s*motor/i, /servo\s*motor/i],
    generic: true,
  },
  {
    key: "motor-clutch",
    label: "Electric Motor (Clutch type)",
    patterns: [/clutch\s*motor/i, /electric\s*motor/i, /main\s*drive\s*motor/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // PRESSER FOOT (standard snap-on — generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "presser-foot",
    label: "Presser Foot (standard snap-on)",
    patterns: [/^presser\s*foot(\s*\(.*\))?$/i],
    generic: true,
  },
  {
    key: "presser-bar",
    label: "Presser Bar (mechanical assembly)",
    patterns: [/presser\s*bar/i, /presser\s*holding/i, /presser\s*\/\s*work\s*clamp/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD TENSION (3-disc stack — generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-tension",
    label: "Thread Tension Assembly (disc stack)",
    patterns: [
      /thread\s*tension\s*(disc|assy|assembly|mechanism|unit)/i,
      /tension\s*disc/i,
      /tension\s*mechanism/i,
      /tension\s*unit/i,
      /active\s*tension/i,
      /disc\s*tension/i,
    ],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD STAND / SPOOL PIN (universal)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-spool-pin",
    label: "Thread Spool Pin (thread stand)",
    patterns: [/thread\s*spool\s*pin/i, /spool\s*pin/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // NEEDLE BAR + CLAMP (brand-scoped — geometry differs)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "needle-bar",
    label: "Needle Bar (with clamp)",
    patterns: [/needle\s*bar(\s*\(.*\))?$/i, /needle\s*clamp/i, /needle\s*bar\s*and\s*needle\s*clamp/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LOOPER (overlock / chain stitch — model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "looper",
    label: "Looper (main)",
    patterns: [
      /^looper(\s+holder)?(\s+assy)?$/i,
      /upper\s*looper/i,
      /lower\s*looper/i,
      /chain\s*looper/i,
      /lapper/i,
      /looper\s*m\b/i,
    ],
    generic: false,
    appliesToCategories: [
      "Overlock Machine",
      "Chain Stitch Machine",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // KNIFE (overlock — model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "knife",
    label: "Knife (upper / lower / cloth cutting)",
    patterns: [/^knife$/i, /upper\s*knife/i, /lower\s*knife/i, /moving\s*knife/i, /cloth\s*cutting\s*knife/i],
    generic: false,
    appliesToCategories: [
      "Overlock Machine",
      "Cutting Machine",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FEED DOG (model-specific — geometry differs)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "feed-dog",
    label: "Feed Dog (main or differential)",
    patterns: [/feed\s*dog/i, /differential\s*feed\s*dog/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // OIL PUMP / LUBRICATION (pump is generic, reservoir is not)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "oil-pump",
    label: "Oil Pump (lubrication)",
    patterns: [/oil\s*pump/i, /oil\s*filter/i, /oil\s*distribution/i],
    generic: true,
  },
  {
    key: "oil-reservoir",
    label: "Oil Reservoir / Pan",
    patterns: [/oil\s*reservoir/i, /oil\s*pan/i, /oil\s*level\s*viewer/i, /oil\s*gauge/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONTROL BOX / PCB (model-specific firmware)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "control-box",
    label: "Control Box (smart / electronic)",
    patterns: [/control\s*box/i, /control\s*panel/i, /pcb/i, /microcontroller/i, /servo\s*motor\s*controller/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // OPERATION PANEL (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "operation-panel",
    label: "Operation Panel (display / buttons)",
    patterns: [/operation\s*panel/i, /display/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOOT PEDAL (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "foot-pedal",
    label: "Foot Pedal (Foot Controller)",
    patterns: [/foot\s*pedal/i, /foot\s*controller/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // EMERGENCY STOP / INDICATOR (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "emergency-stop",
    label: "Emergency Stop Switch / Indicator",
    patterns: [/emergency\s*stop/i, /e-?stop/i, /indicator/i, /led/i, /work\s*light/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD TAKE-UP LEVER (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-takeup",
    label: "Thread Take-Up Lever",
    patterns: [/take\s*-?\s*up\s*lever/i, /take\s*-?\s*up\s*thread\s*guide/i, /thread\s*take\s*-?\s*up/i, /take-?up\s*lever/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD GUIDE (small parts, generic where applicable)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-guide",
    label: "Thread Guide / Eyelet",
    patterns: [/thread\s*guide/i, /thread\s*eyelet/i, /tension\s*guide/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD TENSION POST / BRACKET (small assembly)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-tension-bracket",
    label: "Thread Tension Bracket / Post",
    patterns: [/tension\s*(post|bracket|holder)/i, /thread\s*tension\s*(post|bracket|holder)/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // BOBBIN WINDER (small accessory, generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "bobbin-winder",
    label: "Bobbin Winder",
    patterns: [/bobbin\s*winder/i, /winder/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD STAND (full unit with spool pins)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-stand",
    label: "Thread Stand (full unit)",
    patterns: [/thread\s*stand/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // KNEE LIFTER (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "knee-lifter",
    label: "Knee Lifter (knee lever)",
    patterns: [/knee\s*lift/i, /knee\s*lever/i, /knee\s*control/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // THREAD TRIMMER / Cutter (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "thread-trimmer",
    label: "Thread Trimmer (auto / knife)",
    patterns: [/thread\s*trim(mer|ming)?/i, /auto\s*trim/i, /trim\s*knife/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // MAIN SHAFT (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "main-shaft",
    label: "Main Shaft (upper shaft)",
    patterns: [/main\s*shaft/i, /upper\s*shaft/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // HANDWHEEL (generic — same across machines)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "handwheel",
    label: "Handwheel / Balance Wheel",
    patterns: [/hand\s*wheel/i, /handwheel/i, /balance\s*wheel/i, /balance\s*weight/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // ROTARY HOOK (model-specific — geometry varies)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "rotary-hook",
    label: "Rotary Hook (full-rotary / semi-rotary)",
    patterns: [/rotary\s*hook/i, /semi\s*-?\s*rotary\s*hook/i, /hook\s*assy/i, /looper\s*\/\s*hook\s*assembly/i],
    generic: false,
    appliesToCategories: [
      "Sewing Machine",
      "Bartacking Machine",
      "Buttonhole Machine",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SOLENOID (generic — industry-standard)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "solenoid",
    label: "Solenoid (electromagnetic)",
    patterns: [/solenoid/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SWITCH (generic — push button / toggle)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "switch",
    label: "Switch (push / toggle / micro)",
    patterns: [/^switch(\s*\(.*\))?$/i, /push\s*button/i, /micro\s*switch/i, /limit\s*switch/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FACE PLATE / COVER (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "face-plate",
    label: "Face Plate (front cover)",
    patterns: [/face\s*plate/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // COVER (model-specific)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "cover",
    label: "Cover (top / side / belt / face)",
    patterns: [/^cover$/i, /belt\s*cover/i, /top\s*cover/i, /side\s*cover/i],
    generic: false,
  },

  // ═══════════════════════════════════════════════════════════════════
  // HINGE PIN (generic small hardware)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "pin",
    label: "Pin / Hinge Pin (small hardware)",
    patterns: [/^pin$/i, /hinge\s*pin/i, /tension\s*release\s*pin/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPRING (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "spring",
    label: "Spring (generic small hardware)",
    patterns: [/^spring(\s*\(.*\))?$/i, /tension\s*spring/i, /return\s*spring/i, /knife\s*pressure\s*spring/i, /presser\s*spring/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // GASKET / PACKING / OIL SEAL (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "gasket",
    label: "Gasket / Packing / Oil Seal",
    patterns: [/gasket/i, /packing/i, /oil\s*seal/i, /felt/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // COUNTER (generic)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "counter",
    label: "Stitch Counter (mechanical / digital)",
    patterns: [/stitch\s*counter/i, /counter/i],
    generic: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // EYE GUARD (generic — safety)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: "eye-guard",
    label: "Eye Guard (needle guard / finger guard)",
    patterns: [/eye\s*guard/i, /finger\s*guard/i, /needle\s*guard/i, /safety\s*guard/i],
    generic: true,
  },
];

/**
 * Find the matching concept for a given part row.
 * Returns undefined if no concept matches (the part stays as a model-specific orphan).
 */
export function matchesConcept(
  partName: string,
  partId: string,
  category: string,
  brand: string
): ConceptDef | undefined {
  for (const concept of CONCEPTS) {
    if (concept.appliesToCategories && !concept.appliesToCategories.includes(category)) {
      continue;
    }
    if (concept.appliesToBrands && !concept.appliesToBrands.includes(brand)) {
      continue;
    }
    for (const pat of concept.patterns) {
      if (pat.test(partName) || pat.test(partId)) {
        return concept;
      }
    }
  }
  return undefined;
}

/**
 * Build the lookup key for a concept match.
 * - Generic concepts: just the concept key (e.g. "needle-dc27")
 * - Brand-scoped concepts: brand + concept key (e.g. "juki-bobbin")
 */
export function conceptLookupKey(concept: ConceptDef, brand: string): string {
  if (concept.generic) {
    return concept.key;
  }
  return `${brand.toLowerCase()}-${concept.key}`;
}
