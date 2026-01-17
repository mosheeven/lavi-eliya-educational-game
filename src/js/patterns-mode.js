// PATTERN COMPLETION MODE - השלמת דפוסים
function startPatternsMode() {
    currentMode = 'patterns';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Pattern types organized by difficulty stages
    const easyPatterns = [
        // Simple 2-element patterns (5 items)
        { pattern: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', options: ['🔵', '🔴', '🟡', '🟢'], difficulty: 'easy' },
        { pattern: ['⭐', '❤️', '⭐', '❤️', '⭐'], answer: '❤️', options: ['❤️', '⭐', '🌙', '☀️'], difficulty: 'easy' },
        { pattern: ['🐱', '🐶', '🐱', '🐶', '🐱'], answer: '🐶', options: ['🐶', '🐱', '🐭', '🐰'], difficulty: 'easy' },
        { pattern: ['🍎', '🍌', '🍎', '🍌', '🍎'], answer: '🍌', options: ['🍌', '🍎', '🍊', '🍇'], difficulty: 'easy' },
        { pattern: ['1️⃣', '2️⃣', '1️⃣', '2️⃣', '1️⃣'], answer: '2️⃣', options: ['2️⃣', '1️⃣', '3️⃣', '4️⃣'], difficulty: 'easy' },
        { pattern: ['🟢', '🟡', '🟢', '🟡', '🟢'], answer: '🟡', options: ['🟡', '🟢', '🔴', '🔵'], difficulty: 'easy' }
    ];
    
    const mediumPatterns = [
        // 3-element patterns (6 items)
        { pattern: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡'], answer: '🔴', options: ['🔴', '🔵', '🟡', '🟢'], difficulty: 'medium' },
        { pattern: ['🌟', '🌙', '☀️', '🌟', '🌙', '☀️'], answer: '🌟', options: ['🌟', '🌙', '☀️', '⭐'], difficulty: 'medium' },
        { pattern: ['🦁', '🐘', '🐯', '🦁', '🐘', '🐯'], answer: '🦁', options: ['🦁', '🐘', '🐯', '🐻'], difficulty: 'medium' },
        { pattern: ['🍕', '🍔', '🌭', '🍕', '🍔', '🌭'], answer: '🍕', options: ['🍕', '🍔', '🌭', '🍰'], difficulty: 'medium' },
        { pattern: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣', '3️⃣'], answer: '1️⃣', options: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'], difficulty: 'medium' },
        { pattern: ['🎵', '🎨', '⚽', '🎵', '🎨', '⚽'], answer: '🎵', options: ['🎵', '🎨', '⚽', '🎭'], difficulty: 'medium' },
        { pattern: ['🚗', '🚌', '🚲', '🚗', '🚌', '🚲'], answer: '🚗', options: ['🚗', '🚌', '🚲', '✈️'], difficulty: 'medium' }
    ];
    
    const hardPatterns = [
        // 4-element patterns (7 items)
        { pattern: ['🔴', '🔵', '🟡', '🟢', '🔴', '🔵', '🟡'], answer: '🟢', options: ['🟢', '🔴', '🔵', '🟡'], difficulty: 'hard' },
        { pattern: ['🚗', '🚌', '🚲', '✈️', '🚗', '🚌', '🚲'], answer: '✈️', options: ['✈️', '🚗', '🚌', '🚲'], difficulty: 'hard' },
        { pattern: ['🏠', '🏫', '🏥', '🏪', '🏠', '🏫', '🏥'], answer: '🏪', options: ['🏪', '🏠', '🏫', '🏥'], difficulty: 'hard' },
        { pattern: ['🐟', '🐠', '🦈', '🐙', '🐟', '🐠', '🦈'], answer: '🐙', options: ['🐙', '🐟', '🐠', '🦈'], difficulty: 'hard' },
        { pattern: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '1️⃣', '2️⃣', '3️⃣'], answer: '4️⃣', options: ['4️⃣', '1️⃣', '2️⃣', '3️⃣'], difficulty: 'hard' },
        { pattern: ['🌸', '🌺', '🌻', '🌷', '🌸', '🌺', '🌻'], answer: '🌷', options: ['🌷', '🌸', '🌺', '🌻'], difficulty: 'hard' },
        { pattern: ['⚽', '🏀', '🎾', '⚾', '⚽', '🏀', '🎾'], answer: '⚾', options: ['⚾', '⚽', '🏀', '🎾'], difficulty: 'hard' }
    ];
    
    const expertPatterns = [
        // 5-element complex patterns (8 items)
        { pattern: ['🔴', '🔵', '🟡', '🟢', '⚫', '🔴', '🔵', '🟡'], answer: '🟢', options: ['🟢', '⚫', '🔴', '🔵'], difficulty: 'expert' },
        { pattern: ['🍎', '🍊', '🍌', '🍇', '🍓', '🍎', '🍊', '🍌'], answer: '🍇', options: ['🍇', '🍓', '🍎', '🍊'], difficulty: 'expert' },
        { pattern: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '1️⃣', '2️⃣', '3️⃣'], answer: '4️⃣', options: ['4️⃣', '5️⃣', '1️⃣', '2️⃣'], difficulty: 'expert' },
        { pattern: ['🐶', '🐱', '🐭', '🐹', '🐰', '🐶', '🐱', '🐭'], answer: '🐹', options: ['🐹', '🐰', '🐶', '🐱'], difficulty: 'expert' },
        { pattern: ['⭐', '🌟', '✨', '💫', '🌠', '⭐', '🌟', '✨'], answer: '💫', options: ['💫', '🌠', '⭐', '🌟'], difficulty: 'expert' },
        { pattern: ['🎸', '🎹', '🥁', '🎺', '🎻', '🎸', '🎹', '🥁'], answer: '🎺', options: ['🎺', '🎻', '🎸', '🎹'], difficulty: 'expert' },
        { pattern: ['🌈', '☁️', '⛈️', '🌤️', '🌧️', '🌈', '☁️', '⛈️'], answer: '🌤️', options: ['🌤️', '🌧️', '🌈', '☁️'], difficulty: 'expert' },
        { pattern: ['🦖', '🦕', '🐊', '🐢', '🦎', '🦖', '🦕', '🐊'], answer: '🐢', options: ['🐢', '🦎', '🦖', '🦕'], difficulty: 'expert' }
    ];
    
    // Combine patterns with progressive difficulty - 15 rounds total
    // Rounds 1-3: easy, 4-7: medium, 8-11: hard, 12-15: expert
    const selectedPatterns = [
        ...easyPatterns.sort(() => Math.random() - 0.5).slice(0, 3),
        ...mediumPatterns.sort(() => Math.random() - 0.5).slice(0, 4),
        ...hardPatterns.sort(() => Math.random() - 0.5).slice(0, 4),
        ...expertPatterns.sort(() => Math.random() - 0.5).slice(0, 4)
    ];
    
    let currentPattern = 0;
    let correctAnswers = 0;
    let isProcessingAnswer = false;
    
    function showPattern() {
        layer.destroyChildren();
        isProcessingAnswer = false;
        
        if (currentPattern >= selectedPatterns.length) {
            // Game complete
            const finalBg = new Konva.Rect({
                x: stage.width() / 2 - 250,
                y: stage.height() / 2 - 120,
                width: 500,
                height: 240,
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: 240 },
                fillLinearGradientColorStops: [0, '#8b5cf6', 1, '#6366f1'],
                cornerRadius: 30,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 20,
                shadowOffset: { x: 0, y: 10 }
            });
            layer.add(finalBg);
            
            const finalText = new Konva.Text({
                x: stage.width() / 2 - 250,
                y: stage.height() / 2 - 80,
                width: 500,
                text: '🎉 מעולה! 🎉',
                fontSize: 60,
                fontFamily: 'Varela Round, Arial',
                fill: 'white',
                align: 'center',
                fontStyle: 'bold',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 5
            });
            layer.add(finalText);
            
            const scoreText = new Konva.Text({
                x: stage.width() / 2 - 250,
                y: stage.height() / 2 + 10,
                width: 500,
                text: `השלמת ${correctAnswers} מתוך ${selectedPatterns.length} דפוסים`,
                fontSize: 28,
                fontFamily: 'Varela Round, Arial',
                fill: 'white',
                align: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 3
            });
            layer.add(scoreText);
            
            layer.draw();
            playWinSound();
            speak(`כל הכבוד השלמת ${correctAnswers} מתוך ${selectedPatterns.length} דפוסים`);
            return;
        }
        
        const patternData = selectedPatterns[currentPattern];
        
        // Randomize options array to prevent answer always being in same position
        const shuffledOptions = [...patternData.options].sort(() => Math.random() - 0.5);
        
        // Show difficulty indicator
        let difficultyText = '';
        let difficultyColor = '';
        if (currentPattern < 3) {
            difficultyText = 'קל 😊';
            difficultyColor = '#4ade80';
        } else if (currentPattern < 7) {
            difficultyText = 'בינוני 🤔';
            difficultyColor = '#fbbf24';
        } else if (currentPattern < 11) {
            difficultyText = 'קשה 🧠';
            difficultyColor = '#ef4444';
        } else {
            difficultyText = 'מומחה 🔥';
            difficultyColor = '#a855f7';
        }
        
        // Progress bar
        const progressBg = new Konva.Rect({
            x: 50,
            y: 20,
            width: stage.width() - 100,
            height: 12,
            fill: '#e5e7eb',
            cornerRadius: 6
        });
        layer.add(progressBg);
        
        const progressFill = new Konva.Rect({
            x: 50,
            y: 20,
            width: ((stage.width() - 100) * (currentPattern + 1)) / selectedPatterns.length,
            height: 12,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: (stage.width() - 100), y: 0 },
            fillLinearGradientColorStops: [0, '#8b5cf6', 1, '#6366f1'],
            cornerRadius: 6
        });
        layer.add(progressFill);
        
        // Progress text with difficulty
        const progressText = new Konva.Text({
            x: 50,
            y: 40,
            width: stage.width() - 100,
            text: `דפוס ${currentPattern + 1} מתוך ${selectedPatterns.length} - רמה: ${difficultyText}`,
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: difficultyColor,
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(progressText);
        
        // Title
        const titleText = new Konva.Text({
            x: 50,
            y: 75,
            width: stage.width() - 100,
            text: 'מה חסר בדפוס? 🤔',
            fontSize: 32,
            fontFamily: 'Varela Round, Arial',
            fill: '#8b5cf6',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(titleText);
        
        // Display pattern with missing element
        const patternY = 140;
        const itemSize = Math.min(70, (stage.width() - 100) / (patternData.pattern.length + 2));
        const totalPatternWidth = itemSize * (patternData.pattern.length + 1) + 10 * patternData.pattern.length;
        let startX = (stage.width() - totalPatternWidth) / 2;
        
        patternData.pattern.forEach((item, index) => {
            const itemGroup = new Konva.Group({
                x: startX,
                y: patternY
            });
            
            const itemBg = new Konva.Rect({
                width: itemSize,
                height: itemSize,
                fill: 'white',
                stroke: '#8b5cf6',
                strokeWidth: 3,
                cornerRadius: 12,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 8,
                shadowOffset: { x: 0, y: 4 }
            });
            itemGroup.add(itemBg);
            
            const itemText = new Konva.Text({
                text: item,
                fontSize: itemSize * 0.6,
                width: itemSize,
                height: itemSize,
                align: 'center',
                verticalAlign: 'middle'
            });
            itemGroup.add(itemText);
            
            layer.add(itemGroup);
            startX += itemSize + 10;
        });
        
        // Question mark for missing element
        const questionGroup = new Konva.Group({
            x: startX,
            y: patternY
        });
        
        const questionBg = new Konva.Rect({
            width: itemSize,
            height: itemSize,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 0, y: itemSize },
            fillLinearGradientColorStops: [0, '#fbbf24', 1, '#f59e0b'],
            stroke: '#f59e0b',
            strokeWidth: 4,
            cornerRadius: 12,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 }
        });
        questionGroup.add(questionBg);
        
        const questionText = new Konva.Text({
            text: '?',
            fontSize: itemSize * 0.7,
            fontFamily: 'Arial',
            fill: 'white',
            width: itemSize,
            height: itemSize,
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        questionGroup.add(questionText);
        
        // Pulse animation for question mark
        questionGroup.to({
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 0.5,
            onFinish: () => {
                questionGroup.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.5
                });
            }
        });
        
        layer.add(questionGroup);
        
        // Options
        const optionsY = patternY + itemSize + 60;
        const optionSize = Math.min(90, (stage.width() - 100) / 5);
        const totalOptionsWidth = optionSize * shuffledOptions.length + 15 * (shuffledOptions.length - 1);
        let optionX = (stage.width() - totalOptionsWidth) / 2;
        
        shuffledOptions.forEach((option, index) => {
            const optionGroup = new Konva.Group({
                x: optionX,
                y: optionsY
            });
            
            const optionBg = new Konva.Rect({
                width: optionSize,
                height: optionSize,
                fill: 'white',
                stroke: '#d1d5db',
                strokeWidth: 4,
                cornerRadius: 15,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 8,
                shadowOffset: { x: 0, y: 4 }
            });
            optionGroup.add(optionBg);
            
            const optionText = new Konva.Text({
                text: option,
                fontSize: optionSize * 0.6,
                width: optionSize,
                height: optionSize,
                align: 'center',
                verticalAlign: 'middle'
            });
            optionGroup.add(optionText);
            
            optionGroup.on('click tap', function() {
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (option === patternData.answer) {
                    // Correct!
                    optionBg.fill('#4ade80');
                    optionBg.stroke('#22c55e');
                    layer.draw();
                    playWinSound();
                    speak('נכון מאוד');
                    
                    optionGroup.to({
                        scaleX: 1.3,
                        scaleY: 1.3,
                        duration: 0.2,
                        onFinish: () => {
                            optionGroup.to({
                                scaleX: 1,
                                scaleY: 1,
                                duration: 0.2
                            });
                        }
                    });
                    
                    correctAnswers++;
                    addPoints(10);
                    
                    setTimeout(() => {
                        currentPattern++;
                        showPattern();
                    }, 1500);
                } else {
                    // Wrong
                    optionBg.fill('#ef4444');
                    optionBg.stroke('#dc2626');
                    layer.draw();
                    playErrorSound();
                    speak('נסה שוב');
                    
                    // Shake animation
                    const originalX = optionGroup.x();
                    optionGroup.to({
                        x: originalX - 10,
                        duration: 0.05,
                        onFinish: () => {
                            optionGroup.to({
                                x: originalX + 10,
                                duration: 0.05,
                                onFinish: () => {
                                    optionGroup.to({
                                        x: originalX,
                                        duration: 0.05
                                    });
                                }
                            });
                        }
                    });
                    
                    setTimeout(() => {
                        optionBg.fill('white');
                        optionBg.stroke('#d1d5db');
                        layer.draw();
                        isProcessingAnswer = false;
                    }, 800);
                }
            });
            
            optionGroup.on('mouseenter', function() {
                document.body.style.cursor = 'pointer';
                optionBg.strokeWidth(6);
                optionGroup.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
            });
            
            optionGroup.on('mouseleave', function() {
                document.body.style.cursor = 'default';
                optionBg.strokeWidth(4);
                optionGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
            });
            
            layer.add(optionGroup);
            optionX += optionSize + 15;
        });
        
        layer.draw();
        speak('מה חסר בדפוס');
    }
    
    showPattern();
}
