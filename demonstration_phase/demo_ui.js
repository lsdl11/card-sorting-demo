/**
 * demo_ui.js
 * Rendering and animation for the demonstration phase.
 * Depends on: shared_ui.js (SharedUI), trial_logic.js (TrialLogic).
 *
 * Does NOT self-start — app.js calls DemoUI.runDemonstration().
 */
const DemoUI = (() => {

    const {
        SLOT_POSITIONS, INCIDENTAL_SLOT, STIMULUS_POS,
        delay, moveCard, createCardElement, clearCards
    } = SharedUI;

    /* Timing (ms) */
    const PAUSE_APPEAR  = 1000;
    const PAUSE_SWAP    = 500;
    const PAUSE_SORT    = 1500;

    /* ================================================================
       Trial animation
       ================================================================ */

    async function runTrial(gameArea, trial) {
        // 1. Clear any cards from the previous trial
        clearCards(gameArea);

        // 2. Place choice cards in their initial slots
        const choiceEls = trial.initialSlots.map((card, slot) => {
            const el = createCardElement(card, SLOT_POSITIONS[slot]);
            gameArea.appendChild(el);
            return el;
        });

        // 3. Place stimulus card
        const stimEl = createCardElement(trial.stimulus, STIMULUS_POS);
        gameArea.appendChild(stimEl);

        // Force reflow so positions are committed before transitions fire
        gameArea.getBoundingClientRect();

        await delay(PAUSE_APPEAR);

        // 4. Accidental trials: teleport incidental card to left of slot 0
        if (trial.trialType === 'accidental') {
            const incEl = choiceEls[trial.incidentalIndex];
            incEl.style.left = INCIDENTAL_SLOT.left;
            incEl.style.top  = INCIDENTAL_SLOT.top;

            await delay(PAUSE_SWAP);
        }

        // 5. Sort: move stimulus to the correct choice card's current position
        const targetEl = choiceEls[trial.correctChoiceIndex];
        await moveCard(stimEl, targetEl.style.left, targetEl.style.top);

        await delay(PAUSE_SORT);
    }

    /* ================================================================
       Main demonstration flow
       ================================================================ */

    async function runDemonstration() {
        const gameArea = document.querySelector('.game-area');
        const trials   = TrialLogic.buildTrialSequence();

        // Show persistent rule label above the choice cards
        const ruleLabel = document.createElement('div');
        ruleLabel.id = 'rule-label';
        ruleLabel.textContent = 'Watch carefully and learn the rule.';
        gameArea.appendChild(ruleLabel);

        // Run all 8 trials (label stays visible throughout)
        for (const trial of trials) {
            await runTrial(gameArea, trial);
        }

        // Clean up
        ruleLabel.remove();
        clearCards(gameArea);
    }

    return { runDemonstration };
})();
