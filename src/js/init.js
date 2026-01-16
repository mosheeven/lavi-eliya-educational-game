// Initialize on load
window.addEventListener('load', () => {
    // Player selection buttons
    const playerButtons = {
        'btn-player-lavia': 'לביא',
        'btn-player-elia': 'אליה'
    };
    
    Object.keys(playerButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        
        btn.addEventListener('click', () => {
            // Set current player
            currentPlayer = playerButtons[btnId];
            
            // Remove active class from all player buttons
            document.querySelectorAll('.player-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Play sound and speak welcome
            playPopSound();
            speak(getWelcomeMessage());
        });
    });
    
    // Attach game mode button event listeners
    const buttons = {
        'btn-sorting': { mode: 'sorting', func: startSortingMode },
        'btn-quiz': { mode: 'quiz', func: startQuizMode },
        'btn-math': { mode: 'math', func: startMathMode },
        'btn-letters': { mode: 'letters', func: startLettersMode },
        'btn-memory': { mode: 'memory', func: startMemoryMode },
        'btn-puzzle': { mode: 'puzzle', func: startPuzzleMode },
        'btn-coloring': { mode: 'coloring', func: startColoringMode }
    };
    
    Object.keys(buttons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        const { mode, func } = buttons[btnId];
        
        // Click handler
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Navigate to game page
            showGamePage(mode);
            
            // Start the mode
            func();
        });
        
        // Hover sound effect
        btn.addEventListener('mouseenter', () => {
            if (audioContext) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }
        });
    });
    
    // Back button
    const backBtn = document.getElementById('btn-back');
    backBtn.addEventListener('click', () => {
        showHomePage();
        playPopSound();
    });
    
    speak(getWelcomeMessage());
});

// Handle window resize
window.addEventListener('resize', () => {
    if (currentMode) {
        // Restart current mode on resize
        if (currentMode === 'sorting') startSortingMode();
        else if (currentMode === 'quiz') startQuizMode();
        else if (currentMode === 'math') startMathMode();
        else if (currentMode === 'letters') startLettersMode();
        else if (currentMode === 'memory') startMemoryMode();
        else if (currentMode === 'puzzle') startPuzzleMode();
        else if (currentMode === 'coloring') startColoringMode();
    }
});
