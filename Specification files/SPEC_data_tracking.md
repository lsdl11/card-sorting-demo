Scope

Data logging applies only to the Transfer Phase.

Logging must be passive and must not change task behavior.

Required Timing Definitions

transfer_phase_start_time_ms
Timestamp when the Transfer Phase begins. (When drag and drop becomes available)

For each transfer trial:

trial_end_time_ms
Timestamp of the click event that commits placing a card into the leftmost position.

correct (0/1)

consecutive_correct_after_trial

Dependent Variables
DV1: Transfer trials to criterion (0–100)

Let t_hit = transfer trial index where consecutive_correct_after_trial first reaches 5.

transfer_trials_to_criterion = t_hit - 5

Maximum 100 trials before force phase end

DV2: Switch latency (s) (0–900)

Let k = t_hit - 4 (first trial in the final 5-correct streak).

Let trial_end_time_ms[k] be the click timestamp for trial k.

transfer_switch_latency_s = (trial_end_time_ms[k] - transfer_phase_start_time_ms) / 1000

Maximum 15 minutes before force phase end

Export

At task completion:

Display total trials
Display Total card sort trials
Display Total Transfer trials
Display Switch Latency
Display Trials to criterion(transfer)
Display Total Transfer phase time
Display Download CSV button

When Download CSV button is clicked:

Export one CSV with a single row containing:

transfer_trials_to_criterion

transfer_switch_latency_s