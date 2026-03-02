/**
 * config.js
 * Single source of truth for all condition-specific parameters.
 *
 * Condition selection:
 *   - Default: uses NA_V1 config (current behavior).
 *   - URL override: append ?condition=<name> to select from the registry.
 *   - Unknown names fall back to default with a console.warn.
 *
 * To add a new condition, add an entry to CONDITIONS below.
 * Must be loaded before all other JS files.
 */

/* =============================================================
   Default condition: NA_V1
   ============================================================= */

const _DEFAULT_CONFIG = {

    /* --- Behavioral parameters --- */
    CONDITION_NAME: 'NS x A',

    /** Valid values: 'color' | 'shape' | 'number' */
    SORTING_RULE: 'number',

    /** Valid values: 'color' | 'shape' | 'number' */
    INCIDENTAL_ATTRIBUTE: 'color',

    /**
     * Must match INCIDENTAL_ATTRIBUTE dimension:
     *   color → 'Red'|'Blue'|'Green', shape → 'Circle'|'Star'|'Triangle', number → 1|2|3
     */
    INCIDENTAL_VALUE: 'Red',

    /** When true, skip intro overlay and demo phase entirely. */
    SKIP_DEMO: false,

    /** Ordered stimulus cards for the demo; length = number of demo trials. */
    DEMO_STIMULI: [
        { color: 'Red',   shape: 'Star',     number: 3 },
        { color: 'Blue',  shape: 'Circle',   number: 1 },
        { color: 'Green', shape: 'Triangle', number: 2 },
        { color: 'Blue',  shape: 'Star',     number: 3 },
        { color: 'Red',   shape: 'Circle',   number: 2 },
        { color: 'Green', shape: 'Star',     number: 1 },
        { color: 'Blue',  shape: 'Triangle', number: 2 },
        { color: 'Red',   shape: 'Triangle', number: 1 }
    ],

    /** First N demo trials are rule-only (no incidental movement). */
    DEMO_RULE_ONLY_COUNT: 3,

    /**
     * Incidental card animation during accidental demo trials.
     *   'accidental'  — instant teleport
     *   'pedagogical' — smooth slide with glow
     */
    INCIDENTAL_ANIMATION_CUE: 'accidental',

    /** Consecutive correct to pass Card Sort Phase. */
    CARD_SORT_CRITERION: 5,

    /** Consecutive correct to pass Transfer Phase. */
    TRANSFER_CRITERION: 5,

    /* --- Instruction texts --- */

    DEMO_LABEL:      'Watch carefully and learn the rule.',
    TRANSFER_LABEL:  'Drag the correct card to the leftmost position.',
    INTRO_TEXT:       'This is a card sorting game. The goal of the game is to match the card on the bottom with a card on the top row. Before you begin the game, you will watch a demonstration.',
    SORT_TRANSITION_TEXT:     'Now its your turn! Click the correct card match for the card at the bottom.',
    TRANSFER_TRANSITION_TEXT: 'New Task! You will now see three cards. Your task is to move the correct card into the leftmost position. Once you have arranged the cards, click the "Submit Order" button.'
};

/* =============================================================
   Condition registry
   Add new conditions here. Each entry can override any subset of
   _DEFAULT_CONFIG fields; unspecified fields inherit the defaults.
   ============================================================= */

const CONDITIONS = {
    'NA_V1': {},    // default config, no overrides
    'NA_V2': {
        CONDITION_NAME: 'NS x P',
        INCIDENTAL_ANIMATION_CUE: 'pedagogical',
        INCIDENTAL_ATTRIBUTE: 'shape',
        INCIDENTAL_VALUE: 'Circle',
        SORTING_RULE: 'color',
        TRANSFER_LABEL: 'Select the correct card and use the right arrow key to rotate it.',
        TRANSFER_TRANSITION_TEXT: 'New Task! You will now see three cards. Your task is to select the correct card, then use the right arrow key to rotate it upside down. When you are done, click the "Submit" button.'
    },
    'A_V1': {
        CONDITION_NAME: 'S x A',
        SKIP_DEMO: true
    },
    'A_V2': {
        CONDITION_NAME: 'S x P',
        SKIP_DEMO: true,
        INCIDENTAL_ANIMATION_CUE: 'pedagogical',
        INCIDENTAL_ATTRIBUTE: 'shape',
        INCIDENTAL_VALUE: 'Circle',
        SORTING_RULE: 'color',
        TRANSFER_LABEL: 'Select the correct card and use the right arrow key to rotate it.',
        TRANSFER_TRANSITION_TEXT: 'New Task! You will now see three cards. Your task is to select the correct card, then use the right arrow key to rotate it upside down. When you are done, click the "Submit" button.'
    },
    'temp' : {
        SKIP_DEMO: true,
        CARD_SORT_CRITERION: 1,
        TRANSFER_CRITERION: 1
    }
};

/* =============================================================
   Condition resolution (runs once at script load)
   ============================================================= */

const GameConfig = (() => {
    const params   = new URLSearchParams(window.location.search);
    const condName = params.get('condition');

    let overrides = {};

    if (condName !== null) {
        if (CONDITIONS.hasOwnProperty(condName)) {
            overrides = CONDITIONS[condName];
        } else {
            console.warn(
                `[config] Unknown condition "${condName}". Falling back to default.`
            );
        }
    }

    return Object.assign({}, _DEFAULT_CONFIG, overrides);
})();
