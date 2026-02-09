0. Status & Scope (READ FIRST)

Purpose of this file

This file defines the authoritative experimental specification for the Transfer Phase.

This phase occurs after the Card Sort Phase and is the final phase of the task.

Out of scope

Demonstration Phase

Card Sort Phase

Any additional learning or instruction phases

Data logging, scoring summaries, or debrief text

1. Phase Overview

Phase name: Transfer Phase

Phase type: Interactive

Participant role: Actively reorder cards

Purpose:

Assess whether participants transfer the incidental pattern demonstrated earlier

2. Transition / Instruction Screen

Before the Transfer Phase begins, show a brief instruction screen.

Instruction text:

“New Task!
Great job! Now, you will see three cards. Your task is to move the correct card into the leftmost position. Once you have arranged the cards, click the "Submit Order" button.”

3. Card Set (DIFFERENT FROM PRIOR PHASES)
3.1 Choice Cards Only

There is no stimulus card in this phase.

Each trial displays only a set of choice cards.

3.2 Card Attributes

Cards still use the same attribute space:

Color: {Red, Blue, Green}

Shape: {Circle, Star, Triangle}

Number: {1, 2, 3}

4. Trial Construction

For each trial:

A randomly generated set of three choice cards is displayed.

The incidental card:

Is not initially in the leftmost position.

5. Task Rule (TRANSFER TARGET)

The correct action in this phase is:
Move the incidental card to the leftmost position.

This rule is never stated explicitly to the participant.

Correctness is defined solely by final position, not by movement path or speed.

6. Participant Interaction
6.1 Input

Participants may:

Click and drag a card

click the "submit order" button

6.2 Completion of a Trial

A trial is considered complete once:

the "submit order" button is clicked

7. Response Evaluation

A response is correct if:

The card placed in the leftmost position is the incidental card

A response is incorrect if:

Any non-incidental card is placed in the leftmost position

No partial credit or alternative success conditions exist.

8. Feedback

Same as Cart sort phase

Feedback duration is brief (e.g., ~500 ms).

9. Trial Progression

After feedback:

The next trial begins automatically

Card sets are regenerated for each trial.

The red card’s initial position must vary but never start leftmost.

10. Stopping Rule (CRITERION)

The Transfer Phase continues until the participant achieves:
5 consecutive correct orderings

10.1 Streak Logic

Maintain a counter: consecutiveCorrect

On a correct trial:

Increment consecutiveCorrect by 1

On an incorrect trial:

Reset consecutiveCorrect to 0

The phase ends immediately when consecutiveCorrect == 5

11. Phase Termination

Upon reaching criterion:

End the task

Display a simple completion screen (e.g., “Task complete.”)

No performance summary or explanation is required.

12. Prohibited Behaviors

The Transfer Phase must not:

Reintroduce the card-sorting-by-number rule

Include a stimulus card

Include instructional cues about color

Include incidental or accidental animations

Allow the red card to begin in the leftmost position

Continue after criterion is met