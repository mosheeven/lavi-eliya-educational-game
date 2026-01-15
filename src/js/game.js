// Game state
let stage, layer;
let currentMode = null;
let score = 0;
let audioContext;

// Initialize audio context
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Sound effects
function playPopSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playWinSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playErrorSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Text-to-Speech
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
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

// Update parent guide
function updateParentGuide(text) {
    document.getElementById('parent-guide-text').textContent = text;
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
