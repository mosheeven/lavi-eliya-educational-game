// Game state
let stage, layer;
let currentMode = null;
let score = 0;
let audioContext;
let currentPlayer = null; // Track current player: 'לביא' or 'אליה'

// Animation and timer cleanup tracking
let activeAnimations = [];
let activeTimers = [];

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
    'numbers': '🔢 מספרים',
    'dressup': '👗 הלבשה'
};

// Fisher-Yates shuffle algorithm for proper randomization
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Cleanup functions for proper mode transitions
function cleanupAnimations() {
    // Stop all active Konva animations
    activeAnimations.forEach(anim => {
        if (anim && typeof anim.stop === 'function') {
            anim.stop();
        }
    });
    activeAnimations = [];
}

function cleanupTimers() {
    // Clear all active timers
    activeTimers.forEach(timerId => {
        clearTimeout(timerId);
    });
    activeTimers = [];
}

function registerTimer(timerId) {
    activeTimers.push(timerId);
    return timerId;
}

function registerAnimation(animation) {
    activeAnimations.push(animation);
    return animation;
}

function cleanupMode() {
    // Stop all speech
    stopSpeech();
    
    // Clean up animations and timers
    cleanupAnimations();
    cleanupTimers();
    
    // Destroy stage and layer if they exist
    if (layer) {
        layer.destroyChildren();
        layer.destroy();
        layer = null;
    }
    if (stage) {
        stage.destroy();
        stage = null;
    }
}

// Common UI Components

// Create a styled button with consistent design
function createStyledButton(config) {
    const {
        x, y, width, height,
        text, fontSize = 24,
        color = '#667eea',
        textColor = 'white',
        onClick,
        cornerRadius = 20
    } = config;
    
    const buttonGroup = new Konva.Group({
        x: x,
        y: y
    });
    
    // Shadow
    const shadow = new Konva.Rect({
        x: 3,
        y: 3,
        width: width,
        height: height,
        fill: 'rgba(0, 0, 0, 0.2)',
        cornerRadius: cornerRadius,
        blur: 8
    });
    buttonGroup.add(shadow);
    
    // Button background with gradient
    const bg = new Konva.Rect({
        width: width,
        height: height,
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 0, y: height },
        fillLinearGradientColorStops: [0, color, 1, adjustColorBrightness(color, -20)],
        cornerRadius: cornerRadius,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 4 }
    });
    buttonGroup.add(bg);
    
    // Button text
    const buttonText = new Konva.Text({
        width: width,
        height: height,
        text: text,
        fontSize: fontSize,
        fontFamily: 'Varela Round, Arial',
        fontStyle: 'bold',
        fill: textColor,
        align: 'center',
        verticalAlign: 'middle'
    });
    buttonGroup.add(buttonText);
    
    // Interaction handlers
    buttonGroup.on('click tap', function() {
        playPopSound();
        if (onClick) onClick();
    });
    
    buttonGroup.on('mouseenter', function() {
        document.body.style.cursor = 'pointer';
        const anim = registerAnimation(buttonGroup.to({
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 0.1
        }));
    });
    
    buttonGroup.on('mouseleave', function() {
        document.body.style.cursor = 'default';
        const anim = registerAnimation(buttonGroup.to({
            scaleX: 1,
            scaleY: 1,
            duration: 0.1
        }));
    });
    
    return buttonGroup;
}

// Create a color picker circle
function createColorPicker(config) {
    const {
        x, y, radius = 30,
        color,
        isSelected = false,
        onClick
    } = config;
    
    const colorGroup = new Konva.Group({
        x: x,
        y: y
    });
    
    // Shadow
    const shadow = new Konva.Circle({
        radius: radius + 2,
        fill: 'rgba(0, 0, 0, 0.2)',
        offsetY: -2,
        blur: 6
    });
    colorGroup.add(shadow);
    
    // Outer ring (selection indicator)
    const outerRing = new Konva.Circle({
        radius: radius + 5,
        stroke: '#667eea',
        strokeWidth: isSelected ? 4 : 0,
        shadowColor: 'rgba(102, 126, 234, 0.5)',
        shadowBlur: isSelected ? 10 : 0
    });
    colorGroup.add(outerRing);
    
    // Color circle
    const colorCircle = new Konva.Circle({
        radius: radius,
        fill: color,
        stroke: 'white',
        strokeWidth: 3,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 8,
        shadowOffset: { x: 0, y: 2 }
    });
    colorGroup.add(colorCircle);
    
    // Interaction handlers
    colorGroup.on('click tap', function() {
        playPopSound();
        if (onClick) onClick(color);
    });
    
    colorGroup.on('mouseenter', function() {
        document.body.style.cursor = 'pointer';
        const anim = registerAnimation(colorGroup.to({
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 0.1
        }));
    });
    
    colorGroup.on('mouseleave', function() {
        document.body.style.cursor = 'default';
        const anim = registerAnimation(colorGroup.to({
            scaleX: 1,
            scaleY: 1,
            duration: 0.1
        }));
    });
    
    // Method to update selection state
    colorGroup.setSelected = function(selected) {
        outerRing.strokeWidth(selected ? 4 : 0);
        outerRing.shadowBlur(selected ? 10 : 0);
        layer.draw();
    };
    
    return colorGroup;
}

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
    // Simple hex color brightness adjustment
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// Page navigation
function showHomePage() {
    // Clean up current mode before returning home
    cleanupMode();
    
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('game-page').style.display = 'none';
    currentMode = null;
    
    // Clear active state from mode buttons
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
}

function showGamePage(mode) {
    // Clean up previous mode before starting new one
    cleanupMode();
    
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';
    
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
