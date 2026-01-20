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
    'numbers': '🔢 מספרים',
    'letterhunt': '🔍 ציד אותיות'
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

// Enhanced Audio System with Real Sounds
const audioFiles = {
    pop: null,
    win: null,
    error: null,
    applause: null,
    whoosh: null,
    bgMusic: null
};

// Preload audio files (will fallback to procedural sounds if files don't exist)
function preloadAudio() {
    const soundPaths = {
        pop: 'src/sounds/pop.mp3',
        win: 'src/sounds/success.mp3',
        error: 'src/sounds/error.mp3',
        applause: 'src/sounds/applause.mp3',
        whoosh: 'src/sounds/whoosh.mp3',
        bgMusic: 'src/sounds/background.mp3'
    };
    
    Object.keys(soundPaths).forEach(key => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = soundPaths[key];
        
        // Only store if file loads successfully
        audio.addEventListener('canplaythrough', () => {
            audioFiles[key] = audio;
        }, { once: true });
        
        // Silently fail if file doesn't exist - will use procedural sounds
        audio.addEventListener('error', () => {
            console.log(`Audio file ${soundPaths[key]} not found, using procedural sound`);
        });
    });
    
    // Set background music properties
    if (audioFiles.bgMusic) {
        audioFiles.bgMusic.loop = true;
        audioFiles.bgMusic.volume = 0.2;
    }
}

// Play audio file with fallback to procedural sound
function playAudioFile(type, fallbackFn) {
    if (audioFiles[type]) {
        try {
            audioFiles[type].currentTime = 0;
            audioFiles[type].play().catch(() => fallbackFn());
        } catch (e) {
            fallbackFn();
        }
    } else {
        fallbackFn();
    }
}

// Background music control
function startBackgroundMusic() {
    if (audioFiles.bgMusic) {
        audioFiles.bgMusic.play().catch(() => {
            console.log('Background music autoplay blocked');
        });
    }
}

function stopBackgroundMusic() {
    if (audioFiles.bgMusic) {
        audioFiles.bgMusic.pause();
        audioFiles.bgMusic.currentTime = 0;
    }
}

// Particle Effects System
function createConfetti(x, y, count = 30) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
    const shapes = ['circle', 'rect', 'star'];
    
    for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 5 + Math.random() * 10;
        
        let particle;
        if (shape === 'circle') {
            particle = new Konva.Circle({
                x: x,
                y: y,
                radius: size,
                fill: color
            });
        } else if (shape === 'rect') {
            particle = new Konva.Rect({
                x: x,
                y: y,
                width: size * 2,
                height: size * 2,
                fill: color,
                rotation: Math.random() * 360
            });
        } else {
            particle = new Konva.Star({
                x: x,
                y: y,
                numPoints: 5,
                innerRadius: size / 2,
                outerRadius: size,
                fill: color
            });
        }
        
        layer.add(particle);
        
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 100 + Math.random() * 200;
        const targetX = x + Math.cos(angle) * velocity;
        const targetY = y + Math.sin(angle) * velocity + 100; // Add gravity effect
        
        const anim = registerAnimation(particle.to({
            x: targetX,
            y: targetY,
            rotation: Math.random() * 720,
            opacity: 0,
            duration: 0.8 + Math.random() * 0.4,
            easing: Konva.Easings.EaseOut,
            onFinish: () => particle.destroy()
        }));
    }
}

function createStarBurst(x, y, count = 8) {
    const colors = ['#ffd700', '#ffed4e', '#fff44f'];
    
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const star = new Konva.Star({
            x: x,
            y: y,
            numPoints: 5,
            innerRadius: 10,
            outerRadius: 20,
            fill: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1
        });
        
        layer.add(star);
        
        const distance = 150;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        
        const anim = registerAnimation(star.to({
            x: targetX,
            y: targetY,
            scaleX: 0,
            scaleY: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.6,
            easing: Konva.Easings.EaseOut,
            onFinish: () => star.destroy()
        }));
    }
}

function createSparkles(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
        const sparkle = new Konva.Star({
            x: x + (Math.random() - 0.5) * 100,
            y: y + (Math.random() - 0.5) * 100,
            numPoints: 4,
            innerRadius: 2,
            outerRadius: 8,
            fill: '#ffffff',
            opacity: 1
        });
        
        layer.add(sparkle);
        
        const anim = registerAnimation(sparkle.to({
            scaleX: 2,
            scaleY: 2,
            opacity: 0,
            duration: 0.5 + Math.random() * 0.3,
            onFinish: () => sparkle.destroy()
        }));
    }
}

// Enhanced button animations
function bounceElement(element, scale = 1.2) {
    const anim = registerAnimation(element.to({
        scaleX: scale,
        scaleY: scale,
        duration: 0.1,
        onFinish: () => {
            registerAnimation(element.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            }));
        }
    }));
}

function shakeElement(element) {
    const originalX = element.x();
    const shakeAmount = 10;
    const shakeDuration = 0.05;
    
    const anim1 = registerAnimation(element.to({
        x: originalX - shakeAmount,
        duration: shakeDuration,
        onFinish: () => {
            const anim2 = registerAnimation(element.to({
                x: originalX + shakeAmount,
                duration: shakeDuration,
                onFinish: () => {
                    const anim3 = registerAnimation(element.to({
                        x: originalX - shakeAmount / 2,
                        duration: shakeDuration,
                        onFinish: () => {
                            const anim4 = registerAnimation(element.to({
                                x: originalX,
                                duration: shakeDuration
                            }));
                        }
                    }));
                }
            }));
        }
    }));
}

function glowElement(element, color = '#ffd700') {
    element.shadowColor(color);
    element.shadowBlur(30);
    element.shadowOpacity(1);
    
    const anim = registerAnimation(element.to({
        shadowBlur: 0,
        shadowOpacity: 0,
        duration: 0.5
    }));
}

// Floating background elements
function createFloatingShapes(type = 'numbers') {
    const shapes = [];
    const count = 15;
    
    for (let i = 0; i < count; i++) {
        let shape;
        const x = Math.random() * stage.width();
        const y = Math.random() * stage.height();
        const size = 20 + Math.random() * 30;
        
        if (type === 'numbers') {
            const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷'];
            shape = new Konva.Text({
                x: x,
                y: y,
                text: numbers[Math.floor(Math.random() * numbers.length)],
                fontSize: size,
                fill: 'rgba(255, 255, 255, 0.1)',
                fontFamily: 'Arial'
            });
        } else if (type === 'letters') {
            const letters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
            shape = new Konva.Text({
                x: x,
                y: y,
                text: letters[Math.floor(Math.random() * letters.length)],
                fontSize: size,
                fill: 'rgba(255, 255, 255, 0.1)',
                fontFamily: 'Arial'
            });
        } else if (type === 'stars') {
            shape = new Konva.Star({
                x: x,
                y: y,
                numPoints: 5,
                innerRadius: size / 2,
                outerRadius: size,
                fill: 'rgba(255, 255, 255, 0.1)'
            });
        }
        
        layer.add(shape);
        shape.moveToBottom();
        shapes.push(shape);
        
        // Animate floating
        const duration = 10 + Math.random() * 10;
        const targetY = y + (Math.random() - 0.5) * 200;
        
        const anim = registerAnimation(shape.to({
            y: targetY,
            rotation: (Math.random() - 0.5) * 180,
            opacity: 0.05 + Math.random() * 0.1,
            duration: duration,
            easing: Konva.Easings.EaseInOut,
            onFinish: () => {
                // Loop animation
                shape.y(Math.random() * stage.height());
                createFloatingShapes(type);
            }
        }));
    }
    
    return shapes;
}

// Initialize audio on first user interaction
let audioInitialized = false;
function ensureAudioInitialized() {
    if (!audioInitialized) {
        preloadAudio();
        audioInitialized = true;
    }
}

// Sound effects with proper cleanup and rate limiting
function playPopSound() {
    const now = Date.now();
    if (now - lastSoundTime.pop < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.pop = now;
    
    ensureAudioInitialized();
    
    // Try to play audio file, fallback to procedural sound
    playAudioFile('pop', () => {
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
        
        oscillator.onended = function() {
            oscillator.disconnect();
            gainNode.disconnect();
        };
    });
}

function playWinSound() {
    const now = Date.now();
    if (now - lastSoundTime.win < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.win = now;
    
    ensureAudioInitialized();
    
    // Try to play audio file, fallback to procedural sound
    playAudioFile('win', () => {
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
        
        oscillator.onended = function() {
            oscillator.disconnect();
            gainNode.disconnect();
        };
    });
}

function playErrorSound() {
    const now = Date.now();
    if (now - lastSoundTime.error < SOUND_COOLDOWN) {
        return; // Skip if called too soon
    }
    lastSoundTime.error = now;
    
    ensureAudioInitialized();
    
    // Try to play audio file, fallback to procedural sound
    playAudioFile('error', () => {
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
        
        oscillator.onended = function() {
            oscillator.disconnect();
            gainNode.disconnect();
        };
    });
}

function playApplauseSound() {
    ensureAudioInitialized();
    playAudioFile('applause', () => {
        // Fallback: play win sound
        playWinSound();
    });
}

function playWhooshSound() {
    ensureAudioInitialized();
    playAudioFile('whoosh', () => {
        // Fallback: play pop sound
        playPopSound();
    });
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
    
    // Add confetti effect at center of stage
    if (stage && layer) {
        createConfetti(stage.width() / 2, stage.height() / 2, 20);
    }
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
