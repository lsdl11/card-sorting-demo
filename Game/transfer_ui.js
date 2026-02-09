/**
 * transfer_ui.js
 * Transfer Phase — drag-and-drop reordering interaction.
 * Depends on: shared_ui.js (SharedUI), trial_logic.js (TrialLogic), config.js (GameConfig).
 *
 * Does NOT self-start — app.js calls TransferUI.run().
 */
const TransferUI = (() => {

    const { delay, createCardElement, clearCards } = SharedUI;

    const FEEDBACK_DURATION = 500;   // ms to show correct/incorrect outline
    const CRITERION         = GameConfig.TRANSFER_CRITERION;

    /* ================================================================
       Centered layout — 3 card positions centred in the game area
       ================================================================ */

    const TRANSFER_SLOT_POSITIONS = [
        { left: '22%',  top: '35%' },   // slot 0 (leftmost)
        { left: '43.5%', top: '35%' },  // slot 1 (centre)
        { left: '65%',  top: '35%' }    // slot 2 (rightmost)
    ];

    /* ================================================================
       Helpers
       ================================================================ */

    /**
     * Show brief visual feedback on the card in slot 0.
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
       Drag-and-drop
       ================================================================ */

    /**
     * Enable pointer-based drag-and-drop on the given card elements.
     * Cards swap positions when dropped near another card's slot.
     *
     * @param {HTMLElement[]} cardEls  — the 3 card DOM elements
     * @param {number[]}      slotMap  — maps cardEls index → current slot index
     * @param {HTMLElement}    gameArea — the .game-area container
     * @returns {{ destroy: Function }} — call destroy() to remove all listeners
     */
    function enableDragAndDrop(cardEls, slotMap, gameArea) {
        const rect = () => gameArea.getBoundingClientRect();
        let dragging = null;

        function onPointerDown(e) {
            const cardIndex = cardEls.indexOf(e.currentTarget);
            if (cardIndex === -1) return;

            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);

            const gar = rect();
            dragging = {
                cardIndex,
                el: e.currentTarget,
                startX: e.clientX,
                startY: e.clientY,
                origLeft: e.currentTarget.offsetLeft,
                origTop:  e.currentTarget.offsetTop,
                gaLeft:   gar.left,
                gaTop:    gar.top,
                gaWidth:  gar.width,
                gaHeight: gar.height
            };
            e.currentTarget.classList.add('dragging');
        }

        function onPointerMove(e) {
            if (!dragging) return;
            e.preventDefault();

            const dx = e.clientX - dragging.startX;
            const dy = e.clientY - dragging.startY;

            dragging.el.style.transition = 'none';
            dragging.el.style.left = (dragging.origLeft + dx) + 'px';
            dragging.el.style.top  = (dragging.origTop  + dy) + 'px';
        }

        function onPointerUp(e) {
            if (!dragging) return;
            e.preventDefault();

            const el = dragging.el;
            el.classList.remove('dragging');

            // Find the nearest slot to drop into
            const elRect   = el.getBoundingClientRect();
            const elCenterX = elRect.left + elRect.width / 2;
            const elCenterY = elRect.top  + elRect.height / 2;

            let bestSlot = slotMap[dragging.cardIndex]; // fallback: stay in place
            let bestDist = Infinity;

            for (let s = 0; s < TRANSFER_SLOT_POSITIONS.length; s++) {
                const pos = TRANSFER_SLOT_POSITIONS[s];
                // Convert slot % position to absolute pixel coordinates
                const slotX = dragging.gaLeft + (parseFloat(pos.left) / 100) * dragging.gaWidth;
                const slotY = dragging.gaTop  + (parseFloat(pos.top)  / 100) * dragging.gaHeight;

                const dist = Math.hypot(elCenterX - slotX, elCenterY - slotY);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestSlot = s;
                }
            }

            const currentSlot = slotMap[dragging.cardIndex];

            if (bestSlot !== currentSlot) {
                // Find the card currently in the target slot
                const otherCardIndex = slotMap.indexOf(bestSlot);

                if (otherCardIndex !== -1) {
                    // Swap: move the other card to the dragged card's old slot
                    const otherEl = cardEls[otherCardIndex];
                    const oldPos  = TRANSFER_SLOT_POSITIONS[currentSlot];
                    otherEl.style.transition = 'left 200ms ease, top 200ms ease';
                    otherEl.style.left = oldPos.left;
                    otherEl.style.top  = oldPos.top;
                    slotMap[otherCardIndex] = currentSlot;
                }

                slotMap[dragging.cardIndex] = bestSlot;
            }

            // Snap dragged card to its (possibly new) slot
            const snapPos = TRANSFER_SLOT_POSITIONS[slotMap[dragging.cardIndex]];
            el.style.transition = 'left 200ms ease, top 200ms ease';
            el.style.left = snapPos.left;
            el.style.top  = snapPos.top;

            dragging = null;
        }

        // Attach listeners
        cardEls.forEach(el => {
            el.addEventListener('pointerdown', onPointerDown);
        });
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup',   onPointerUp);

        function destroy() {
            cardEls.forEach(el => {
                el.removeEventListener('pointerdown', onPointerDown);
            });
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup',   onPointerUp);
        }

        return { destroy };
    }

    /* ================================================================
       Main transfer loop
       ================================================================ */

    /**
     * Run the Transfer Phase.
     * Resolves when the participant achieves CRITERION consecutive correct.
     */
    async function run() {
        const gameArea = document.querySelector('.game-area');
        let consecutiveCorrect = 0;   // explicitly reset — no carryover

        // --- Data logging (passive) ---
        const startTime     = performance.now();
        const trialEndTimes = [];
        let trialCount      = 0;

        // Persistent instruction label
        const label = document.createElement('div');
        label.id = 'transfer-label';
        label.textContent = GameConfig.TRANSFER_LABEL;
        gameArea.appendChild(label);

        // Submit button (reused across trials)
        const submitBtn = document.createElement('button');
        submitBtn.id = 'submit-btn';
        submitBtn.textContent = 'Submit Order';
        submitBtn.style.display = 'none';
        gameArea.appendChild(submitBtn);

        while (consecutiveCorrect < CRITERION) {
            // 1. Generate a fresh trial
            const trial = TrialLogic.generateTransferTrial();

            // 2. Clear previous cards (but keep label and button)
            clearCards(gameArea);

            // 3. Place choice cards in their slots
            const slotMap  = [0, 1, 2];   // cardEls[i] is currently in slot slotMap[i]
            const cardEls  = trial.slots.map((card, i) => {
                const el = createCardElement(card, TRANSFER_SLOT_POSITIONS[i]);
                el.classList.add('draggable');
                gameArea.appendChild(el);
                return el;
            });

            // Show submit button
            submitBtn.style.display = '';
            submitBtn.disabled = false;

            // Force reflow
            gameArea.getBoundingClientRect();

            // 4. Enable drag-and-drop
            const dnd = enableDragAndDrop(cardEls, slotMap, gameArea);

            // 5. Wait for Submit click
            await new Promise(resolve => {
                submitBtn.addEventListener('click', resolve, { once: true });
            });

            // Record trial end timestamp (passive logging)
            trialEndTimes.push(performance.now());
            trialCount++;

            // 6. Disable dragging and button
            dnd.destroy();
            submitBtn.disabled = true;
            cardEls.forEach(el => el.classList.remove('draggable'));

            // 7. Evaluate: does the card in slot 0 carry the incidental feature?
            const cardInSlot0Index = slotMap.indexOf(0);
            const cardInSlot0      = trial.slots[cardInSlot0Index];
            const iAttr            = GameConfig.INCIDENTAL_ATTRIBUTE;
            const isCorrect        = cardInSlot0[iAttr] === GameConfig.INCIDENTAL_VALUE;

            // 8. Show feedback on the card that is in slot 0
            await showFeedback(cardEls[cardInSlot0Index], isCorrect);

            // 9. Update streak
            if (isCorrect) {
                consecutiveCorrect++;
            } else {
                consecutiveCorrect = 0;
            }
        }

        // Clean up
        clearCards(gameArea);
        label.remove();
        submitBtn.remove();

        // Compute derived variables
        const tHit = trialCount;                // 1-indexed trial where criterion was met
        const k0   = tHit - 5;                  // 0-indexed first trial of winning streak

        return {
            totalTransferTrials:          trialCount,
            transfer_trials_to_criterion: tHit - 5,
            transfer_switch_latency_s:    +((trialEndTimes[k0] - startTime) / 1000).toFixed(3),
            transfer_phase_total_time_s:  +((trialEndTimes[trialCount - 1] - startTime) / 1000).toFixed(3)
        };
    }

    return { run };
})();
