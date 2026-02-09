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

    /** Show results screen with stats and CSV download. */
    function showDoneScreen(cardSortResult, transferResult) {
        const gameArea = document.querySelector('.game-area');

        const DEMO_TRIALS = 8;
        const totalTrials = DEMO_TRIALS
            + cardSortResult.trialCount
            + transferResult.totalTransferTrials;

        const done = document.createElement('div');
        done.id = 'done-overlay';

        done.innerHTML = [
            '<p class="instruction-text">Task complete.</p>',
            '<table class="results-table">',
            `<tr><td>Total trials</td><td>${totalTrials}</td></tr>`,
            `<tr><td>Card sort trials</td><td>${cardSortResult.trialCount}</td></tr>`,
            `<tr><td>Transfer trials</td><td>${transferResult.totalTransferTrials}</td></tr>`,
            `<tr><td>Switch latency</td><td>${transferResult.transfer_switch_latency_s} s</td></tr>`,
            `<tr><td>Trials to criterion (transfer)</td><td>${transferResult.transfer_trials_to_criterion}</td></tr>`,
            `<tr><td>Total transfer phase time</td><td>${transferResult.transfer_phase_total_time_s} s</td></tr>`,
            '</table>',
            '<button id="download-csv-btn">Download CSV</button>'
        ].join('\n');

        gameArea.appendChild(done);

        // CSV download handler
        document.getElementById('download-csv-btn').addEventListener('click', () => {
            const header = 'transfer_trials_to_criterion,transfer_switch_latency_s';
            const row    = `${transferResult.transfer_trials_to_criterion},${transferResult.transfer_switch_latency_s}`;
            const csv    = header + '\n' + row + '\n';

            const blob = new Blob([csv], { type: 'text/csv' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = 'transfer_results.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
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
        const cardSortResult = await CardSortUI.run();

        // 5. Transfer transition screen
        await showTransferTransitionScreen();

        // 6. Transfer Phase (drag-and-drop, until 5-in-a-row)
        const transferResult = await TransferUI.run();

        // 7. Task complete — show results + CSV download
        showDoneScreen(cardSortResult, transferResult);
    }

    document.addEventListener('DOMContentLoaded', main);
})();
