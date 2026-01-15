---
inclusion: always
---

# Project Structure

## File Organization
Modular architecture with separated concerns:

```
├── index.html                    # Main HTML entry point
├── single-file-game.html         # Legacy single-file version (backup)
├── src/
│   ├── css/
│   │   └── styles.css           # All game styles
│   └── js/
│       ├── game.js              # Core game functions & state
│       ├── sorting-mode.js      # Sorting game mode
│       ├── popping-mode.js      # Popping game mode
│       ├── quiz-mode.js         # Quiz game mode
│       └── init.js              # Event listeners & initialization
├── README.md
└── .gitignore
```

## Code Structure

### HTML Structure (index.html)
- `#game-container`: Main wrapper with header and canvas
- `.game-header`: Title, player names, and mode selection buttons
- `#canvas-container`: Konva stage rendering area
- `.score-display`: Fixed position score overlay (shown in Popping mode)
- `.parent-guide`: Fixed bottom panel with instructions for parents

### CSS Organization (src/css/styles.css)
- RTL-specific styling throughout
- Gradient background with purple theme (`#667eea`, `#764ba2`)
- Responsive design with max-width constraints
- Mode-specific button colors (green/sorting, orange/popping, pink/quiz)

### JavaScript Architecture

**game.js - Core Functions:**
- Global state: `stage`, `layer`, `currentMode`, `score`, `audioContext`
- `initAudio()`: Initialize audio context
- `playPopSound()`, `playWinSound()`, `playErrorSound()`: Sound generation
- `speak(text)`: Hebrew TTS wrapper
- `initStage()`: Create/reset Konva canvas
- `updateParentGuide(text)`: Update instruction panel
- `updateScore()`, `showScore()`, `hideScore()`: Score management

**Game Mode Files:**
- `sorting-mode.js`: `startSortingMode()` - Drag-and-drop categorization
- `popping-mode.js`: `startPoppingMode()` - Timed balloon clicking
- `quiz-mode.js`: `startQuizMode()` - Multiple-choice questions

**init.js - Event Handlers:**
- Window load: Button event listeners and welcome message
- Window resize: Restart current mode with new dimensions

## Conventions
- All user-facing text in Hebrew
- Emoji used extensively for visual communication
- Audio feedback on all interactions (success/error/pop sounds)
- Konva animations for smooth transitions
- Parent guidance updates with each mode change
