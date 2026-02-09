# Card Sorting Demo

A browser-based card sorting game designed for cognitive psychology research. Participants learn a sorting rule through observation, practice it interactively, and then complete a transfer task to assess learning.

## How It Works

The game is divided into three phases:

### 1. Demonstration Phase
Participants watch an automated demonstration of the card sorting rule. A stimulus card appears at the bottom of the screen and is matched to one of three choice cards above. No interaction is required -- the system animates the sorting process so participants can learn the rule by observation.

### 2. Card Sort Phase
Participants apply the sorting rule they observed. On each trial a stimulus card is displayed alongside three choice cards, each matching the stimulus on exactly one attribute (color, shape, or number). The participant clicks the correct match and receives brief feedback. The phase continues until the participant achieves **5 consecutive correct responses**.

### 3. Transfer Phase
Participants complete a new task: arranging cards by dragging the correct one into the leftmost position and clicking "Submit Order." This phase tests whether participants transfer incidental patterns from the demonstration. The phase ends after **5 consecutive correct orderings**.

## Card Attributes

Every card has three attributes:

| Attribute | Values               |
|-----------|----------------------|
| Color     | Red, Blue, Green     |
| Shape     | Circle, Star, Triangle |
| Number    | 1, 2, 3             |

The full deck consists of 27 unique cards (3 x 3 x 3).

## Running the Game

1. Open `demonstration_phase/index.html` in a modern web browser.
2. The game loads with no dependencies -- it is purely client-side HTML, CSS, and JavaScript.

### Condition Selection

Different experimental conditions can be selected via URL parameter:

```
index.html?condition=NA_V1   # Default
index.html?condition=NA_V2   # Alternate attributes
index.html?condition=A_V1    # Skip demonstration
index.html?condition=A_V2    # Skip demonstration, alternate attributes
```

## Data Export

At the end of the task a summary screen displays key metrics including total trials, switch latency, and trials to criterion. A CSV file can be downloaded for number of trasnfer trials to criterion and switch latency(s).

## Project Structure

```
card-sorting-demo/
  demonstration_phase/
    index.html        # Entry point
    config.js         # Condition parameters
    app.js            # Phase orchestration
    demo_ui.js        # Demonstration phase UI
    card_sort_ui.js   # Card sort phase UI
    transfer_ui.js    # Transfer phase UI
    shared_ui.js      # Shared rendering helpers
    trial_logic.js    # Trial generation logic
    styles.css        # Styling
  reference/          # Reference materials
```
