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
    const PAUSE_APPEAR  = 1500;
    const PAUSE_SWAP    = 1500;
    const PAUSE_SORT    = 800;

    /* Dealing animation constants */
    const DEAL_ORIGIN   = { left: '50%', top: '-50%' };
    const DEAL_DURATION = 350;
    const DEAL_STAGGER  = 0;

    /* Sweep-off animation constants */
    const SWEEP_LEFT    = '-20%';
    const SWEEP_DURATION = 800;

    /* ================================================================
       Trial animation
       ================================================================ */

    async function runTrial(gameArea, trial) {
        // 1. Clear any cards from the previous trial
        clearCards(gameArea);

        // 2. Create choice cards at the off-screen deal origin
        const choiceEls = trial.initialSlots.map((card) => {
            const el = createCardElement(card, DEAL_ORIGIN);
            gameArea.appendChild(el);
            return el;
        });

        if (trial.trialType === 'ruleOnly' && GameConfig.INCIDENTAL_ANIMATION_CUE === 'pedagogical') {
            choiceEls[trial.incidentalIndex].style.transform = 'rotate(180deg)';
        }

        // 3. Create stimulus card at the off-screen deal origin
        const stimEl = createCardElement(trial.stimulus, DEAL_ORIGIN);
        gameArea.appendChild(stimEl);

        // Force reflow so the initial off-screen positions are committed
        gameArea.getBoundingClientRect();

        // 4. Deal choice cards one by one, left to right
        for (let i = 0; i < choiceEls.length; i++) {
            await moveCard(choiceEls[i], SLOT_POSITIONS[i].left, SLOT_POSITIONS[i].top, DEAL_DURATION);
            if (i < choiceEls.length - 1) await delay(DEAL_STAGGER);
        }

        // 5. Deal the stimulus card
        await delay(DEAL_STAGGER);
        await moveCard(stimEl, STIMULUS_POS.left, STIMULUS_POS.top, DEAL_DURATION);

        await delay(PAUSE_APPEAR);

        // 6. Accidental trials: animate incidental card
        if (trial.trialType === 'accidental') {
            const incEl = choiceEls[trial.incidentalIndex];

            if (GameConfig.INCIDENTAL_ANIMATION_CUE === 'pedagogical') {
                incEl.classList.add('pedagogical-glow');
                await delay(600 + PAUSE_SWAP);
                incEl.style.transition = 'transform 1250ms ease-in-out';
                incEl.style.transform  = 'rotate(180deg)';
                await delay(600 + PAUSE_SWAP);
                incEl.classList.remove('pedagogical-glow');
                await delay(PAUSE_SWAP);
            } else {
                incEl.style.transition = 'none';
                incEl.style.left = INCIDENTAL_SLOT.left;
                incEl.style.top  = INCIDENTAL_SLOT.top;
                await delay(PAUSE_SWAP);
            }
        }

        // 7. Sort: move stimulus to the correct choice card's current position
        const targetEl = choiceEls[trial.correctChoiceIndex];
        await moveCard(stimEl, targetEl.style.left, targetEl.style.top);

        await delay(PAUSE_SORT);

        // 8. Sweep all cards off-screen to the left simultaneously
        const allCards = gameArea.querySelectorAll('.card');
        allCards.forEach(el => {
            el.style.transition = `left ${SWEEP_DURATION}ms ease-in`;
            el.style.left = SWEEP_LEFT;
        });
        await delay(1250);
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
