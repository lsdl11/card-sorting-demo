/**
 * card_sort_ui.js
 * Interactive Card Sort Phase.
 * Depends on: shared_ui.js (SharedUI), trial_logic.js (TrialLogic), config.js (GameConfig).
 *
 * Does NOT self-start — app.js calls CardSortUI.run().
 */
const CardSortUI = (() => {

    const {
        SLOT_POSITIONS, STIMULUS_POS,
        delay, createCardElement, clearCards
    } = SharedUI;

    const FEEDBACK_DURATION = 500;   // ms to show correct/incorrect outline
    const CRITERION         = GameConfig.CARD_SORT_CRITERION;

    /* ================================================================
       Helpers
       ================================================================ */

    /**
     * Wait for a click on one of the choice card elements.
     * Resolves with the index (0, 1, or 2) of the clicked card.
     * Clicks are disabled immediately after the first one.
     */
    function waitForChoice(choiceEls) {
        return new Promise(resolve => {
            function handler(index) {
                // Remove all listeners so only one click registers
                choiceEls.forEach(el => {
                    el.removeEventListener('click', el._clickHandler);
                    el.classList.remove('clickable');
                });
                resolve(index);
            }

            choiceEls.forEach((el, i) => {
                el._clickHandler = () => handler(i);
                el.addEventListener('click', el._clickHandler);
                el.classList.add('clickable');
            });
        });
    }

    /**
     * Show brief visual feedback on the clicked card.
     *   correct  → green outline + checkmark
     *   incorrect → red outline + X
     */
    async function showFeedback(cardEl, isCorrect) {
        const cls  = isCorrect ? 'card-correct' : 'card-incorrect';
        const icon = isCorrect ? '\u2713' : '\u2717';   // ✓ or ✗

        cardEl.classList.add(cls);

        const iconEl = document.createElement('div');
        iconEl.className = 'feedback-icon';
        iconEl.textContent = icon;
        cardEl.appendChild(iconEl);

        await delay(FEEDBACK_DURATION);

        cardEl.classList.remove(cls);
        iconEl.remove();
    }

    /* ================================================================
       Main card-sort loop
       ================================================================ */

    /**
     * Run the Card Sort Phase.
     * Resolves when the participant achieves CRITERION consecutive correct.
     */
    async function run() {
        const gameArea = document.querySelector('.game-area');
        let consecutiveCorrect = 0;
        let trialCount = 0;

        while (consecutiveCorrect < CRITERION) {
            trialCount++;

            // 1. Generate a fresh trial
            const trial = TrialLogic.generateSortTrial();

            // 2. Clear previous cards
            clearCards(gameArea);

            // 3. Place choice cards
            const choiceEls = trial.slots.map((card, slot) => {
                const el = createCardElement(card, SLOT_POSITIONS[slot]);
                gameArea.appendChild(el);
                return el;
            });

            // 4. Place stimulus card
            const stimEl = createCardElement(trial.stimulus, STIMULUS_POS);
            gameArea.appendChild(stimEl);

            // Force reflow
            gameArea.getBoundingClientRect();

            // 5. Wait for participant's click
            const chosenIndex = await waitForChoice(choiceEls);
            const isCorrect   = chosenIndex === trial.correctChoiceIndex;

            // 6. Show feedback
            await showFeedback(choiceEls[chosenIndex], isCorrect);

            // 7. Update streak
            if (isCorrect) {
                consecutiveCorrect++;
            } else {
                consecutiveCorrect = 0;
            }
        }

        // Clean up
        clearCards(gameArea);

        return { trialCount };
    }

    return { run };
})();
