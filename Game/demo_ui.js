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

        // Pedagogical ruleOnly: incidental card appears already rotated 180°
        if (trial.trialType === 'ruleOnly' && GameConfig.INCIDENTAL_ANIMATION_CUE === 'pedagogical') {
            choiceEls[trial.incidentalIndex].style.transform = 'rotate(180deg)';
        }

        // 3. Place stimulus card
        const stimEl = createCardElement(trial.stimulus, STIMULUS_POS);
        gameArea.appendChild(stimEl);

        // Force reflow so positions are committed before transitions fire
        gameArea.getBoundingClientRect();

        await delay(PAUSE_APPEAR);

        // 4. Accidental trials: animate incidental card
        if (trial.trialType === 'accidental') {
            const incEl = choiceEls[trial.incidentalIndex];

            if (GameConfig.INCIDENTAL_ANIMATION_CUE === 'pedagogical') {
                // Pedagogical: rotate 180° CW in place with glow highlight
                incEl.classList.add('pedagogical-glow');
                incEl.style.transition = 'transform 600ms ease-in-out';
                incEl.style.transform  = 'rotate(180deg)';
                await delay(600 + PAUSE_SWAP);
                incEl.classList.remove('pedagogical-glow');
            } else {
                // Accidental (default): instant teleport
                incEl.style.left = INCIDENTAL_SLOT.left;
                incEl.style.top  = INCIDENTAL_SLOT.top;
                await delay(PAUSE_SWAP);
            }
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
        ruleLabel.textContent = GameConfig.DEMO_LABEL;
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
