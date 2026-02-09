0. Status & Scope (READ FIRST)

Purpose of this file

This file defines the authoritative experimental specification for the Card Sort Phase.

This phase occurs after the Demonstration Phase and before the Transfer Phase.

Out of scope

Demonstration Phase (already implemented)

Transfer Phase

Data logging or persistence

Participant-level randomization

Any incidental or inefficient action patterns

1. Phase Overview

Phase name: Card Sort Phase

Phase type: Interactive

Participant role: Actively select the correct card match

Purpose:

Assess whether participants learned the sorting rule demonstrated previously

Measure persistence with the learned rule until criterion is met

2. Transition / Instruction Screen

Before the Card Sort Phase begins, show a brief transition screen with the following text exactly:

“Now its your turn! Click the correct card match for the card at the bottom.”

No additional explanation is provided.

No mention of rules, colors, shapes, or numbers.

Participant advances automatically or via a single “continue” action.

3. Sorting Rule (FIXED)

The correct sorting rule in this phase is:
Match the stimulus card to the choice card with the same number.

This rule is identical to the rule demonstrated in the Demonstration Phase.

4. Card & Trial Construction (INHERITED CONSTRAINTS)

Each trial must follow exactly the same construction rules as in the Demonstration Phase:

4.1 Card Attributes

Each card has exactly three attributes:

Color: {Red, Blue, Green}

Shape: {Circle, Star, Triangle}

Number: {1, 2, 3}

4.2 Choice Cards

For each trial:

One choice card matches the stimulus only by color

One choice card matches the stimulus only by shape

One choice card matches the stimulus only by number

Across the three choice cards:

Each color appears exactly once

Each shape appears exactly once

Each number appears exactly once

There is exactly one correct match per trial

5. Spatial Layout (UNCHANGED)

The same layout used in the Demonstration Phase is reused:

One stimulus card at the bottom

Three choice cards in fixed positions above and to the right

6. Incidental Pattern (EXPLICITLY ABSENT)

No incidental pattern is present in this phase.

The incidental choice card:

Does not move prior to sorting

Does not receive any special treatment

Does not reposition automatically

This phase must not reproduce or suggest the accidental inefficiency shown in the Demonstration Phase.

7. Participant Interaction
7.1 Input

Participants select one of the three choice cards by clicking it.

Only one selection is allowed per trial.

7.2 Response Evaluation

A response is correct if the selected choice card matches the stimulus card by number.

All other selections are incorrect.

8. Feedback

After a choice is selected:

The selected card is briefly highlighted:

Green outline and checkmark for correct

Red outline and X for incorrect

Duration: brief (e.g., ~500 ms)

9. Trial Progression

After feedback, the next trial begins automatically.

Trial order may be deterministic or sequential.

No changes to trial difficulty or structure occur across trials.

10. Stopping Rule (CRITERION)

The Card Sort Phase continues until the participant achieves:
5 correct responses in a row (consecutive correct).

10.1 Streak Logic

Maintain a counter: consecutiveCorrect

On a correct response:

Increment consecutiveCorrect by 1

On an incorrect response:

Reset consecutiveCorrect to 0

The phase ends immediately when consecutiveCorrect == 5