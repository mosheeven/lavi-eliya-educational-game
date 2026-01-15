---
inclusion: always
---

# Technology Stack

## Architecture
Single-file HTML application with embedded CSS and JavaScript - no build system required.

## Core Libraries
- **Konva.js v9**: Canvas-based graphics and animations (via CDN)
- **Tailwind CSS**: Utility-first styling (via CDN)
- **Web Audio API**: Sound effects generation
- **Web Speech API**: Hebrew text-to-speech (`he-IL`)

## Language & Localization
- **Primary Language**: Hebrew (RTL layout)
- All UI text, instructions, and speech output in Hebrew
- Direction set to RTL (`dir="rtl"`) at document level

## Browser APIs Used
- Canvas rendering via Konva
- AudioContext for procedural sound generation
- SpeechSynthesis for voice feedback
- Drag-and-drop interactions
- Touch and mouse event handling

## Running the Application
Open `index.html` in a modern web browser. No compilation, bundling, or server required.

The legacy single-file version (`single-file-game.html`) is kept as a backup.

## Development Notes
- All dependencies loaded from CDN (no npm/package manager)
- Responsive design with window resize handling
- Mobile-friendly with touch event support
