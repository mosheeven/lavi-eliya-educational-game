// Initialize on load
window.addEventListener('load', () => {
    // Prevent pull-to-refresh on mobile
    let lastTouchY = 0;
    let preventPullToRefresh = false;

    document.body.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        // Prevent pull-to-refresh if at the top of the page
        preventPullToRefresh = window.pageYOffset === 0;
    }, { passive: false });

    document.body.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const touchYDelta = touchY - lastTouchY;
        lastTouchY = touchY;

        if (preventPullToRefresh) {
            // Prevent pull-to-refresh if scrolling up at the top
            if (touchYDelta > 0) {
                e.preventDefault();
                return;
            }
        }
    }, { passive: false });

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
        'btn-coloring': { mode: 'coloring', func: startColoringMode },
        'btn-spider': { mode: 'spider', func: startSpiderMode },
        'btn-numbers': { mode: 'numbers', func: startNumbersMode },
        'btn-letterhunt': { mode: 'letterhunt', func: startLetterHuntMode },
        'btn-shake': { mode: 'shake', func: startShakeMode }
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
        else if (currentMode === 'coloring') startColoringMode();
        else if (currentMode === 'spider') startSpiderMode();
        else if (currentMode === 'numbers') startNumbersMode();
        else if (currentMode === 'letterhunt') startLetterHuntMode();
        else if (currentMode === 'shake') startShakeMode();
    }
});
