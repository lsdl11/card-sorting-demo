/**
 * trial_logic.js
 * Pure trial-generation logic — zero DOM access.
 * Provides:
 *   - buildTrialSequence()    for the 8-trial demonstration phase
 *   - generateSortTrial()     for on-demand card-sort-phase trials
 *   - generateTransferTrial() for on-demand transfer-phase trials
 * Depends on config.js (GameConfig global).
 */
const TrialLogic = (() => {

    const COLORS  = ['Red', 'Blue', 'Green'];
    const SHAPES  = ['Circle', 'Star', 'Triangle'];
    const NUMBERS = [1, 2, 3];

    /** Return the two values from `arr` that are not `val`, preserving order. */
    function others(arr, val) {
        return arr.filter(v => v !== val);
    }

    /** Return [a, b] or [b, a] with equal probability. */
    function shufflePair(a, b) {
        return Math.random() < 0.5 ? [a, b] : [b, a];
    }

    /**
     * Given a stimulus card, produce three choice cards satisfying all
     * Section 4 constraints:
     *   - One matches stimulus by color only
     *   - One matches stimulus by shape only
     *   - One matches stimulus by number only
     *   - Each color  appears exactly once across the three choices
     *   - Each shape  appears exactly once across the three choices
     *   - Each number appears exactly once across the three choices
     *
     * The two "other" values for each attribute are randomly assigned
     * so that any match-type card can carry any non-stimulus attribute value.
     */
    function generateChoices(stimulus) {
        const [c0, c1] = shufflePair(...others(COLORS,  stimulus.color));
        const [s0, s1] = shufflePair(...others(SHAPES,  stimulus.shape));
        const [n0, n1] = shufflePair(...others(NUMBERS, stimulus.number));

        return [
            { color: stimulus.color, shape: s0, number: n0, matchType: 'color'  },
            { color: c0,             shape: stimulus.shape, number: n1, matchType: 'shape'  },
            { color: c1,             shape: s1,             number: stimulus.number, matchType: 'number' }
        ];
    }

    /**
     * Build the complete 8-trial demonstration sequence.
     *
     * Each trial object contains:
     *   trialNumber          1–8
     *   trialType            'ruleOnly' (1–3) | 'accidental' (4–8)
     *   stimulus             { color, shape, number }
     *   initialSlots         [slot0, slot1, slot2]  cards in their starting positions
     *   correctChoiceIndex   index into initialSlots of the SORTING_RULE-match card
     */
    function buildTrialSequence() {
        const rule  = GameConfig.SORTING_RULE;
        const iAttr = GameConfig.INCIDENTAL_ATTRIBUTE;
        const iVal  = GameConfig.INCIDENTAL_VALUE;

        /*
         * Eight deterministic stimuli chosen so that:
         *   – all three colors, shapes, and numbers appear across stimuli
         *   – variety in which card carries the incidental feature
         *
         * The randomised "other" assignment in generateChoices() means the
         * incidental card can end up as any match-type, including the
         * correct one (SORTING_RULE match).
         */
        const stimuli = [
            { color: 'Red',   shape: 'Star',     number: 3 },   // trial 1
            { color: 'Blue',  shape: 'Circle',   number: 1 },   // trial 2
            { color: 'Green', shape: 'Triangle', number: 2 },   // trial 3
            { color: 'Blue',  shape: 'Star',     number: 3 },   // trial 4
            { color: 'Red',   shape: 'Circle',   number: 2 },   // trial 5
            { color: 'Green', shape: 'Star',     number: 1 },   // trial 6
            { color: 'Blue',  shape: 'Triangle', number: 2 },   // trial 7
            { color: 'Red',   shape: 'Triangle', number: 1 }    // trial 8
        ];

        return stimuli.map((stimulus, i) => {
            const trialNumber = i + 1;
            const trialType   = trialNumber <= 3 ? 'ruleOnly' : 'accidental';
            const choices     = generateChoices(stimulus);

            // Identify the incidental card (drives the accidental pattern)
            const incIdx      = choices.findIndex(c => c[iAttr] === iVal);
            const incidental  = choices[incIdx];
            const others      = choices.filter((_, idx) => idx !== incIdx);

            // Randomise the two non-incidental cards' slot order
            const shuffled = Math.random() < 0.5
                ? [others[0], others[1]]
                : [others[1], others[0]];

            let initialSlots;

            if (trialType === 'ruleOnly') {
                // Incidental card already in slot 0 (leftmost). No movement.
                initialSlots = [incidental, shuffled[0], shuffled[1]];
            } else {
                // Incidental card starts in slot 1 or 2 (random, never slot 0).
                // It will teleport left of slot 0 during animation.
                if (Math.random() < 0.5) {
                    initialSlots = [shuffled[0], incidental, shuffled[1]];
                } else {
                    initialSlots = [shuffled[0], shuffled[1], incidental];
                }
            }

            // Index into initialSlots of the card that matches by the sorting rule
            const correctChoiceIndex = initialSlots.findIndex(
                c => c.matchType === rule
            );

            // Index into initialSlots of the incidental card
            const incidentalIndex = initialSlots.indexOf(incidental);

            return {
                trialNumber,
                trialType,
                stimulus,
                initialSlots,
                correctChoiceIndex,
                incidentalIndex
            };
        });
    }

    /* ================================================================
       Card Sort Phase – on-demand trial generation
       ================================================================ */

    /** Pick a random element from an array. */
    function randomPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /** Fisher-Yates shuffle (returns a new array). */
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /**
     * Generate a single interactive trial for the Card Sort Phase.
     *
     * - Picks a random stimulus from the full 27-card attribute space.
     * - Generates 3 valid choice cards via generateChoices().
     * - Randomly assigns them to slots 0, 1, 2 (no incidental pattern).
     *
     * Returns:
     *   { stimulus, slots: [card0, card1, card2], correctChoiceIndex }
     */
    function generateSortTrial() {
        const rule = GameConfig.SORTING_RULE;

        const stimulus = {
            color:  randomPick(COLORS),
            shape:  randomPick(SHAPES),
            number: randomPick(NUMBERS)
        };

        const choices = generateChoices(stimulus);
        const slots   = shuffle(choices);

        const correctChoiceIndex = slots.findIndex(
            c => c.matchType === rule
        );

        return { stimulus, slots, correctChoiceIndex };
    }

    /* ================================================================
       Transfer Phase – on-demand trial generation
       ================================================================ */

    /** Map attribute names to their possible values. */
    const ATTR_VALUES = { color: COLORS, shape: SHAPES, number: NUMBERS };

    /**
     * Generate a single trial for the Transfer Phase.
     *
     * - 3 unique random cards from the full attribute space.
     * - Exactly one card carries the incidental feature
     *   (GameConfig.INCIDENTAL_ATTRIBUTE === GameConfig.INCIDENTAL_VALUE).
     * - The incidental card is NEVER in slot 0 (randomly slot 1 or 2).
     *
     * Works for any incidental attribute (color, shape, or number).
     *
     * Returns:
     *   { slots: [card0, card1, card2], incidentalIndex }
     */
    function generateTransferTrial() {
        const iAttr = GameConfig.INCIDENTAL_ATTRIBUTE;
        const iVal  = GameConfig.INCIDENTAL_VALUE;

        // For each attribute, prepare 3 values to distribute across 3 cards.
        // For the incidental attribute: cards 0 & 1 get the two non-incidental
        // values (shuffled); card 2 gets the incidental value.
        // For all other attributes: all 3 values are shuffled freely.
        const attrVals = {};
        for (const [attr, allValues] of Object.entries(ATTR_VALUES)) {
            if (attr === iAttr) {
                const nonInc = shuffle(allValues.filter(v => v !== iVal));
                attrVals[attr] = [nonInc[0], nonInc[1], iVal];
            } else {
                attrVals[attr] = shuffle(allValues.slice());
            }
        }

        // Build the 3 cards (card 2 is the incidental card)
        const cards = [];
        for (let i = 0; i < 3; i++) {
            cards.push({
                color:  attrVals.color[i],
                shape:  attrVals.shape[i],
                number: attrVals.number[i]
            });
        }

        // Assign to slots: incidental card (index 2) must NOT be in slot 0
        const incSlot   = Math.random() < 0.5 ? 1 : 2;
        const otherSlot = incSlot === 1 ? 2 : 1;

        // Randomly pick which non-incidental card goes to slot 0 vs the remaining slot
        const nonIncOrder = Math.random() < 0.5 ? [0, 1] : [1, 0];

        const slots = [];
        slots[0]         = cards[nonIncOrder[0]];
        slots[incSlot]   = cards[2];
        slots[otherSlot] = cards[nonIncOrder[1]];

        return { slots, incidentalIndex: incSlot };
    }

    return { buildTrialSequence, generateSortTrial, generateTransferTrial, COLORS, SHAPES, NUMBERS };
})();
