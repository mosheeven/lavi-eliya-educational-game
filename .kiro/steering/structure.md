---
inclusion: always
---

# Project Structure

## File Organization
Single-file architecture: `single-file-game.html` contains all HTML, CSS, and JavaScript.

## Code Structure Within File

### HTML Structure
- `#game-container`: Main wrapper with header and canvas
- `.game-header`: Title, player names, and mode selection buttons
- `#canvas-container`: Konva stage rendering area
- `.score-display`: Fixed position score overlay (shown in Popping mode)
- `.parent-guide`: Fixed bottom panel with instructions for parents

### CSS Organization
- Inline `<style>` block in `<head>`
- RTL-specific styling throughout
- Gradient background with purple theme (`#667eea`, `#764ba2`)
- Responsive design with max-width constraints
- Mode-specific button colors (green/sorting, orange/popping, pink/quiz)

### JavaScript Architecture

**Global State:**
- `stage`, `layer`: Konva canvas objects
- `currentMode`: Active game mode tracker
- `score`: Current score counter
- `audioContext`: Web Audio API context

**Core Functions:**
- `initAudio()`: Initialize audio context
- `playPopSound()`, `playWinSound()`, `playErrorSound()`: Sound generation
- `speak(text)`: Hebrew TTS wrapper
- `initStage()`: Create/reset Konva canvas
- `updateParentGuide(text)`: Update instruction panel
- `updateScore()`, `showScore()`, `hideScore()`: Score management

**Game Modes:**
- `startSortingMode()`: Drag-and-drop categorization
- `startPoppingMode()`: Timed balloon clicking
- `startQuizMode()`: Multiple-choice questions

**Event Handlers:**
- Window load: Initial welcome message
- Window resize: Restart current mode with new dimensions

## Conventions
- All user-facing text in Hebrew
- Emoji used extensively for visual communication
- Audio feedback on all interactions (success/error/pop sounds)
- Konva animations for smooth transitions
- Parent guidance updates with each mode change
