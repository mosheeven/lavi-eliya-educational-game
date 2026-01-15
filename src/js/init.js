// Initialize on load
window.addEventListener('load', () => {
    // Attach button event listeners
    document.getElementById('btn-sorting').addEventListener('click', startSortingMode);
    document.getElementById('btn-popping').addEventListener('click', startPoppingMode);
    document.getElementById('btn-quiz').addEventListener('click', startQuizMode);
    document.getElementById('btn-math').addEventListener('click', startMathMode);
    
    speak('ברוכים הבאים למשחק הלימודי ללביא ואליה אבן');
});

// Handle window resize
window.addEventListener('resize', () => {
    if (currentMode) {
        // Restart current mode on resize
        if (currentMode === 'sorting') startSortingMode();
        else if (currentMode === 'popping') startPoppingMode();
        else if (currentMode === 'quiz') startQuizMode();
        else if (currentMode === 'math') startMathMode();
    }
});
