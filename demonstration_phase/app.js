/**
 * app.js
 * Top-level orchestrator.
 * Sequences: Intro → Demo → Sort Transition → Card Sort
 *          → Transfer Transition → Transfer → Task Complete.
 * Loaded last — depends on SharedUI, DemoUI, CardSortUI, TransferUI.
 */
(() => {
    const { delay } = SharedUI;

    /** Wait for the "Begin demonstration" button click. */
    function waitForIntroClick() {
        return new Promise(resolve => {
            const btn = document.querySelector('#instruction-overlay .begin-btn');
            btn.addEventListener('click', () => {
                document.getElementById('instruction-overlay').style.display = 'none';
                resolve();
            }, { once: true });
        });
    }

    /** Show transition screen and wait for "Continue" click. */
    function showTransitionScreen() {
        return new Promise(resolve => {
            const overlay = document.getElementById('transition-overlay');
            overlay.style.display = 'flex';

            const btn = overlay.querySelector('.begin-btn');
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
                resolve();
            }, { once: true });
        });
    }

    /** Show transfer transition screen and wait for "Continue" click. */
    function showTransferTransitionScreen() {
        return new Promise(resolve => {
            const overlay = document.getElementById('transfer-transition-overlay');
            overlay.style.display = 'flex';

            const btn = overlay.querySelector('.begin-btn');
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
                resolve();
            }, { once: true });
        });
    }

    /** Show a "Task complete." end screen. */
    function showDoneScreen() {
        const gameArea = document.querySelector('.game-area');

        const done = document.createElement('div');
        done.id = 'done-overlay';
        done.innerHTML =
            '<p class="instruction-text">Task complete.</p>';
        gameArea.appendChild(done);
    }

    /** Main application flow. */
    async function main() {
        // 1. Intro screen — wait for participant to click "Begin demonstration"
        await waitForIntroClick();

        // 2. Demonstration phase (8 automated trials)
        await DemoUI.runDemonstration();

        // 3. Sort transition screen
        await showTransitionScreen();

        // 4. Card Sort Phase (interactive, until 5-in-a-row)
        await CardSortUI.run();

        // 5. Transfer transition screen
        await showTransferTransitionScreen();

        // 6. Transfer Phase (drag-and-drop, until 5-in-a-row)
        await TransferUI.run();

        // 7. Task complete
        showDoneScreen();
    }

    document.addEventListener('DOMContentLoaded', main);
})();
