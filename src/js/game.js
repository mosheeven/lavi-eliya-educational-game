// Game state
let stage, layer;
let currentMode = null;
let score = 0;
let audioContext;
let currentPlayer = null; // Track current player: 'לביא' or 'אליה'

// Player scores - persistent across game modes
let playerScores = {
    'לביא': 0,
    'אליה': 0
};

// Sound rate limiting - prevent overlapping sounds
let lastSoundTime = {
    pop: 0,
    win: 0,
    error: 0,
    score: 0,
    speech: 0
};
const SOUND_COOLDOWN = 150; // milliseconds between same sound type
const SPEECH_COOLDOWN = 300; // milliseconds between speech calls

// Game mode titles
const gameModeTitles = {
    'sorting': '🗂️ מצב מיון',
    'quiz': '🇬🇧 אנגלית',
    'math': '🔢 חשבון',
    'letters': '🔤 אותיות',
    'memory': '🎯 זיכרון',
    'coloring': '🎨 צביעה',
    'spider': '🕷️ עכביש',
    'patterns': '🧩 דפוסים',
    'plant': '🌱 גידול צמח',
    'numbers': '🔢 מספרים'
};

// Page navigation
function showHomePage() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('game-page').style.display = 'none';
    currentMode = null;
    
    // Stop all speech when returning home
    stopSpeech();
    
    // Clear active state from mode buttons
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
}

function showGamePage(mode) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';
    
    // Stop any ongoing speech when starting new game
    stopSpeech();
    
    // Update game mode title
    document.getElementById('game-mode-title').textContent = gameModeTitles[mode] || '';
    
    // Update current player display
    updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
    const playerNameEl = document.getElementById('current-player-name');
    const playerScoreEl = document.getElementById('current-player-score');
    
    if (currentPlayer) {
        playerNameEl.textContent = currentPlayer;
        playerScoreEl.textContent = playerScores[currentPlayer];
    } else {
        playerNameEl.textContent = 'בחר שחקן';
        playerScoreEl.textContent = '0';
    }
}

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound effects with proper cleanup and rate limiting
function playPopSound() {
    const now = Date.now();
    if (now - lastSoundTime.pop < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.pop = now;
    
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    const startTime = audioContext.currentTime;
    const stopTime = startTime + 0.1;
    
    oscillator.start(startTime);
    oscillator.stop(stopTime);
    
    // Clean up after sound finishes
    oscillator.onended = function() {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}

function playWinSound() {
    const now = Date.now();
    if (now - lastSoundTime.win < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.win = now;
    
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    const startTime = audioContext.currentTime;
    const stopTime = startTime + 0.5;
    
    oscillator.start(startTime);
    oscillator.stop(stopTime);
    
    // Clean up after sound finishes
    oscillator.onended = function() {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}

function playErrorSound() {
    const now = Date.now();
    if (now - lastSoundTime.error < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.error = now;
    
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    const startTime = audioContext.currentTime;
    const stopTime = startTime + 0.2;
    
    oscillator.start(startTime);
    oscillator.stop(stopTime);
    
    // Clean up after sound finishes
    oscillator.onended = function() {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}

// Text-to-Speech with proper cleanup and rate limiting
function speak(text) {
    if ('speechSynthesis' in window) {
        try {
            const now = Date.now();
            if (now - lastSoundTime.speech < SPEECH_COOLDOWN) {
                return; // Skip if called too soon
            }
            lastSoundTime.speech = now;
            
            // Cancel any ongoing speech to prevent overlapping
            window.speechSynthesis.cancel();
            
            // Fix pronunciation of "אליה" to sound like "Eli-ya"
            let spokenText = text.replace(/אליה/g, 'אלי-יה');
            
            const utterance = new SpeechSynthesisUtterance(spokenText);
            utterance.lang = 'he-IL';
            utterance.rate = 0.85; // Slightly slower for better pronunciation
            
            // Add error handling
            utterance.onerror = function(event) {
                console.error('Speech synthesis error:', event);
            };
            
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Speech synthesis failed:', error);
        }
    }
}

// Stop all speech
function stopSpeech() {
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (error) {
            console.error('Failed to stop speech:', error);
        }
    }
}

// Personalized feedback messages
function getCorrectMessage() {
    const messages = [
        'נכון כל הכבוד',
        'מעולה',
        'נכון מצוין',
        'יפה מאוד',
        'כל הכבוד'
    ];
    const baseMessage = messages[Math.floor(Math.random() * messages.length)];
    return currentPlayer ? `${baseMessage} ${currentPlayer}` : baseMessage;
}

function getWrongMessage() {
    const messages = [
        'נסו שוב',
        'כמעט',
        'לא נורא נסה שוב'
    ];
    const baseMessage = messages[Math.floor(Math.random() * messages.length)];
    return currentPlayer ? `${baseMessage} ${currentPlayer}` : baseMessage;
}

function getWelcomeMessage() {
    if (currentPlayer) {
        return `שלום ${currentPlayer} בואו נתחיל לשחק`;
    }
    return 'ברוכים הבאים למשחק הלימודי ללביא ואליה אבן';
}

// Initialize Konva stage
function initStage() {
    const container = document.getElementById('canvas-container');
    container.innerHTML = '';
    
    const width = Math.min(1200, window.innerWidth - 40);
    const height = 600;
    
    stage = new Konva.Stage({
        container: 'canvas-container',
        width: width,
        height: height
    });
    
    layer = new Konva.Layer();
    stage.add(layer);
}

// Update score display
function updateScore(newScore) {
    score = newScore;
    document.getElementById('score-value').textContent = score;
}

function showScore() {
    document.getElementById('score-display').style.display = 'block';
}

function hideScore() {
    document.getElementById('score-display').style.display = 'none';
}

// Add points to current player's score
function addPoints(points = 10) {
    if (!currentPlayer) return;
    
    playerScores[currentPlayer] += points;
    updatePlayerScoreDisplay();
    updateCurrentPlayerDisplay(); // Update game page display
    showScoreAnimation(points);
    playScoreSound();
}

// Update player score display in header
function updatePlayerScoreDisplay() {
    const laviaScore = document.getElementById('score-lavia');
    const eliaScore = document.getElementById('score-elia');
    
    if (laviaScore) laviaScore.textContent = playerScores['לביא'];
    if (eliaScore) eliaScore.textContent = playerScores['אליה'];
}

// Show animated score popup
function showScoreAnimation(points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points} 🌟`;
    document.body.appendChild(popup);
    
    // Remove after animation
    setTimeout(() => {
        popup.remove();
    }, 1500);
}

// Play score sound effect with proper cleanup and rate limiting
function playScoreSound() {
    const now = Date.now();
    if (now - lastSoundTime.score < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.score = now;
    
    initAudio();
    
    // Play a pleasant ascending tone
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * 0.1);
        const stopTime = startTime + 0.2;
        
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
        
        oscillator.start(startTime);
        oscillator.stop(stopTime);
        
        // Clean up after sound finishes
        oscillator.onended = function() {
            oscillator.disconnect();
            gainNode.disconnect();
        };
    });
}
