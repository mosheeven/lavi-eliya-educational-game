# Sound Files

This folder contains audio files for the educational game. The game will work with procedural sounds if these files are not present, but real sound effects provide a much better experience.

## Required Sound Files

Place the following audio files in this directory:

1. **pop.mp3** - Quick pop/click sound for button presses
2. **success.mp3** - Success/win sound for correct answers
3. **error.mp3** - Error/buzzer sound for wrong answers
4. **applause.mp3** - Applause sound for completing challenges
5. **whoosh.mp3** - Whoosh/swipe sound for transitions
6. **background.mp3** - Gentle background music (optional, loops)

## Free Sound Resources

### Recommended Sites (All offer free sounds):

1. **Freesound.org** (https://freesound.org)
   - Requires free account
   - Filter by CC0 (Public Domain) license
   - Search terms: "pop", "success", "error", "applause", "whoosh"

2. **Mixkit.co** (https://mixkit.co/free-sound-effects/)
   - No account needed
   - Free for commercial use
   - Great for UI sounds and music

3. **Zapsplat.com** (https://www.zapsplat.com)
   - Free account required
   - Huge library
   - Search for "game" sounds

4. **Pixabay** (https://pixabay.com/sound-effects/)
   - No account needed
   - CC0 license
   - Good for background music

## Recommended Search Terms

- **pop.mp3**: "button click", "pop", "UI click", "soft click"
- **success.mp3**: "success", "win", "correct", "positive", "ding"
- **error.mp3**: "error", "wrong", "buzzer", "negative"
- **applause.mp3**: "applause", "clapping", "crowd cheer"
- **whoosh.mp3**: "whoosh", "swipe", "transition"
- **background.mp3**: "children music", "playful music", "happy background"

## Tips

- Keep files under 500KB for fast loading
- MP3 format works best for web
- Background music should be gentle (not distracting)
- Test volume levels - sounds should be pleasant, not jarring

## Fallback Behavior

If sound files are not found, the game automatically uses procedural sounds generated with Web Audio API. This ensures the game always works, but real sounds provide a much better experience for children.
