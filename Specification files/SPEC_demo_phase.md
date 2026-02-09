0. Status & Scope (READ FIRST)

Purpose of this file

This file defines the authoritative experimental specification for the Non-agentic × Accidental condition.

This file currently applies ONLY to the Demonstration Phase.

No assumptions beyond what is written here are permitted.

Out of scope

Card sorting phase (participant interaction)

Transfer phase

Data logging

Randomization across participants

UI polish beyond what is required to show the demonstration 

1. Experimental Condition

Condition name: Non-agentic × Accidental

Source of instruction: Non-agentive (computerized animation)

Cue type: Accidental (incidental pattern not framed as intentional)

2. Task Overview

Task type: Computerized card sorting game

Goal of task: Sort the stimulus card with the correct choice card

Correct sorting rule in this condition: Match by number

3. Card & Deck Specification (GLOBAL CONSTRAINTS)
Card attributes

Each card has exactly three attributes:

Color: {Red, Blue, Green}

Shape: {Circle, Star, Triangle}

Number: {1, 2, 3}

Deck

Total unique cards: 27 (3 × 3 × 3)

No duplicate cards exist.

4. Trial Construction Rules (CRITICAL)

For each trial, the system must construct:

4.1 Stimulus Card

One card displayed in the stimulus position.

4.2 Choice Cards

Exactly three choice cards are displayed.

They must satisfy all of the following:

One choice card matches the stimulus only by color

One choice card matches the stimulus only by shape

One choice card matches the stimulus only by number

Across the three choice cards:

Each color appears exactly once

Each shape appears exactly once

Each number appears exactly once

There is exactly one correct match per trial

5. Spatial Layout (FIXED)
Stimulus Card

Displayed in a fixed position near the bottom center of the screen.

Choice Cards

Three fixed screen positions (“choice slots”)

Positioned above and to the right of the stimulus

Left-to-right ordering matters for the incidental pattern

6. Demonstration Phase Overview

Total trials: 8

User interaction: None

The system controls all card movements.

Purpose: Demonstrate the sorting rule and the incidental pattern

7. Demonstration Phase Instructions (TEXT)
Initial screen text

“This is a card sorting game. The goal is to correctly sort the bottom card with one of three possible options. Before you begin the game, you will watch a demonstration.”

After “Begin demonstration”

“Watch carefully and learn the rule.”

8. Demonstration Trial Types

The 8 trials are divided into two types:

8.1 Trials 1–3: Rule-Only Demonstration

The incidental card is already in the leftmost position

No incidental movement occurs

Only the correct sorting action is shown

8.2 Trials 4–8: Accidental Pattern Demonstration

The incidental card is not initially in the leftmost position

Before sorting occurs:

The incidental card moves to the leftmost position

After the movement:

The stimulus card is sorted according to the sorting rule

9. Animation Ordering (NON-NEGOTIABLE)

For trials 4–8, the sequence must be:

Cards appear in initial positions

Incidental card moves to the leftmost slot

Stimulus card moves to the correct choice card 

The sorting action must never occur before the incidental movement.

10. Prohibited Interpretations

The demonstration must not:

Mention intentions, goals, or reasons for the incidental movement

Suggest that incidental pattern is relevant to the sorting rule

Allow multiple correct matches

11. Implementation Guidance for Cursor

When uncertain, prefer deterministic behavior over randomness

Do not simplify constraints

If a conflict arises, defer to this file

