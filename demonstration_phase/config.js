/**
 * config.js
 * Game configuration — swap these values to create alternate conditions.
 * Must be loaded before trial_logic.js and demo_ui.js.
 */
const GameConfig = {

    /**
     * The correct sorting rule for this condition.
     * Which attribute the stimulus must match on.
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
     *
     * The card carrying this feature always ends up in the leftmost slot
     * during the demonstration phase.
     */
    INCIDENTAL_VALUE: 'Red'
};
