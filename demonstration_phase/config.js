/**
 * config.js
 * Single source of truth for all condition-specific parameters.
 * Edit ONLY this file to create a new experimental condition.
 * Must be loaded before all other JS files.
 */
const GameConfig = {

    /* =============================================================
       Behavioral parameters
       ============================================================= */

    /**
     * The correct sorting rule for this condition.
     * Valid values: 'color' | 'shape' | 'number'
     */
    SORTING_RULE: 'number',

    /**
     * The attribute dimension of the incidental (accidental) pattern.
     * Valid values: 'color' | 'shape' | 'number'
     */
    INCIDENTAL_ATTRIBUTE: 'color',

    /**
     * The specific value of the incidental feature.
     * Must be a valid value for INCIDENTAL_ATTRIBUTE:
     *   color  → 'Red' | 'Blue' | 'Green'
     *   shape  → 'Circle' | 'Star' | 'Triangle'
     *   number → 1 | 2 | 3
     */
    INCIDENTAL_VALUE: 'Red',

    /**
     * When true, skip the intro overlay and demo phase entirely.
     * The game starts at the card-sort transition screen.
     */
    SKIP_DEMO: false,

    /**
     * Ordered stimulus cards for the demonstration phase.
     * Length determines the number of demo trials.
     */
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

    /**
     * How many of the first demo trials are "rule-only" (no incidental
     * movement). The rest are "accidental" (incidental card teleports).
     */
    DEMO_RULE_ONLY_COUNT: 3,

    /**
     * How the incidental card moves during accidental demo trials.
     *   'accidental'  — instant teleport (subtle, not attention-drawing)
     *   'pedagogical'  — smooth slide with a glow highlight (deliberate, salient)
     */
    INCIDENTAL_ANIMATION_CUE: 'pedagogical',

    /** Consecutive correct answers needed to pass the Card Sort Phase. */
    CARD_SORT_CRITERION: 5,

    /** Consecutive correct answers needed to pass the Transfer Phase. */
    TRANSFER_CRITERION: 5,

    /* =============================================================
       Instruction texts
       ============================================================= */

    /** Label shown above cards during the demonstration phase. */
    DEMO_LABEL: 'Watch carefully and learn the rule.',

    /** Label shown above cards during the transfer phase. */
    TRANSFER_LABEL: 'Drag the correct card to the leftmost position.',

    /** Intro overlay paragraph (shown before demo). */
    INTRO_TEXT: 'This is a card sorting game. The goal is to correctly sort the bottom card with one of three possible options. Before you begin the game, you will watch a demonstration.',

    /** Transition overlay paragraph (shown between demo and card sort). */
    SORT_TRANSITION_TEXT: 'Now its your turn! Click the correct card match for the card at the bottom.',

    /** Transition overlay paragraph (shown between card sort and transfer). */
    TRANSFER_TRANSITION_TEXT: 'New Task! Now, you will see three cards. Your task is to move the correct card into the leftmost position. Once you have arranged the cards, click the "Submit Order" button.'
};
