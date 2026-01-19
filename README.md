# משחק לימודי ללביא ואליה אבן

🎮 **Play Now**: [https://mosheeven.github.io/lavi-eliya-educational-game/](https://mosheeven.github.io/lavi-eliya-educational-game/)

Educational game for Lavia and Elia Even featuring ten interactive learning modes in Hebrew.

## Game Modes

- **🗂️ מצב מיון (Sorting Mode)**: Drag-and-drop categorization (dinosaurs, space, numbers, English letters)
- **🇬🇧 אנגלית (English Mode)**: Learn English words by matching them with emoji representations
- **🔢 חשבון (Math Mode)**: Simple addition and subtraction problems for ages 5-6
- **🔤 אותיות (Hebrew Letters)**: Learn Hebrew alphabet with matching words and emojis
- **🎯 זיכרון (Memory Game)**: Classic card matching game with 6 pairs
- **🎨 צביעה (Coloring Mode)**: Free drawing canvas with 10 colors and eraser
- **🕷️ עכביש (Spider Mode)**: Interactive spider web drawing game
- **🔷 דפוסים (Patterns Mode)**: Pattern recognition and completion challenges
- **🌱 צמח (Plant Growing Mode)**: Virtual plant growing and care simulation
- **🔢 מספרים (Numbers Mode)**: Number identification game (0-10) with visual counting aids

## Features

- **Player Selection**: Choose between לביא (Lavia) and אליה (Elia)
- **Scoring System**: Earn +10 points for each correct answer with visual effects
- **Two-Page Structure**: Home page with game selection, separate game page for each mode
- **Audio Feedback**: Sound effects and Hebrew text-to-speech for all interactions
- **Personalized Messages**: Success and error messages include player names
- **Persistent Scores**: Player scores are maintained across all game modes

## How to Run

Simply open `index.html` in any modern web browser. No installation or build process required!

The legacy single-file version is available in `single-file-game.html` as a backup.

## Technologies

- **Konva.js v9**: Canvas-based graphics and animations (via CDN)
- **Tailwind CSS**: Utility-first styling (via CDN)
- **Web Audio API**: Procedural sound effects generation
- **Web Speech API**: Hebrew text-to-speech (`he-IL`) and English pronunciation

## Project Structure

```
├── index.html                    # Main HTML entry point
├── single-file-game.html         # Legacy single-file version (backup)
├── src/
│   ├── css/
│   │   └── styles.css           # All game styles
│   └── js/
│       ├── game.js              # Core game functions & state
│       ├── sorting-mode.js      # Sorting game mode
│       ├── quiz-mode.js         # English learning mode
│       ├── math-mode.js         # Math game mode
│       ├── letters-mode.js      # Hebrew letters mode
│       ├── memory-mode.js       # Memory card game
│       ├── coloring-mode.js     # Drawing/coloring mode
│       ├── spider-mode.js       # Spider web drawing game
│       ├── patterns-mode.js     # Pattern recognition game
│       ├── plant-mode.js        # Plant growing simulation
│       ├── numbers-mode.js      # Numbers identification game
│       └── init.js              # Event listeners & initialization
├── README.md
└── .gitignore
```

## Language

All content is in Hebrew (עברית) with RTL layout support. English words in the English learning mode are pronounced using English TTS.
