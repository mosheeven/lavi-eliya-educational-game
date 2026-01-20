// HEBREW LETTERS MODE - אותיות
function startLettersMode() {
    currentMode = 'letters';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Hebrew letters with matching words and emojis
    const letters = [
        { letter: 'א', word: 'אריה', emoji: '🦁' },
        { letter: 'א', word: 'אוטובוס', emoji: '🚌' },
        { letter: 'א', word: 'אופניים', emoji: '🚲' },
        { letter: 'ב', word: 'בננה', emoji: '🍌' },
        { letter: 'ב', word: 'בית', emoji: '🏠' },
        { letter: 'ב', word: 'בלון', emoji: '🎈' },
        { letter: 'ג', word: 'גמל', emoji: '🐫' },
        { letter: 'ג', word: 'גבינה', emoji: '🧀' },
        { letter: 'ד', word: 'דג', emoji: '🐟' },
        { letter: 'ד', word: 'דוב', emoji: '🐻' },
        { letter: 'ד', word: 'דלת', emoji: '🚪' },
        { letter: 'ה', word: 'הר', emoji: '⛰️' },
        { letter: 'ה', word: 'הליקופטר', emoji: '🚁' },
        { letter: 'ו', word: 'ורד', emoji: '🌹' },
        { letter: 'ז', word: 'זברה', emoji: '🦓' },
        { letter: 'ז', word: 'זוג', emoji: '👫' },
        { letter: 'ח', word: 'חתול', emoji: '🐱' },
        { letter: 'ח', word: 'חלב', emoji: '🥛' },
        { letter: 'ח', word: 'חלון', emoji: '🪟' },
        { letter: 'ט', word: 'טלפון', emoji: '📱' },
        { letter: 'ט', word: 'טיל', emoji: '🚀' },
        { letter: 'י', word: 'ירח', emoji: '🌙' },
        { letter: 'י', word: 'יונה', emoji: '🕊️' },
        { letter: 'כ', word: 'כלב', emoji: '🐶' },
        { letter: 'כ', word: 'כוכב', emoji: '⭐' },
        { letter: 'כ', word: 'כדור', emoji: '⚽' },
        { letter: 'ל', word: 'לב', emoji: '❤️' },
        { letter: 'ל', word: 'לחם', emoji: '🍞' },
        { letter: 'מ', word: 'מטוס', emoji: '✈️' },
        { letter: 'מ', word: 'מכונית', emoji: '🚗' },
        { letter: 'מ', word: 'מתנה', emoji: '🎁' },
        { letter: 'ן', word: 'חלון', emoji: '🪟' },
        { letter: 'נ', word: 'נר', emoji: '🕯️' },
        { letter: 'נ', word: 'נחש', emoji: '🐍' },
        { letter: 'ס', word: 'סוס', emoji: '🐴' },
        { letter: 'ס', word: 'ספר', emoji: '📚' },
        { letter: 'ע', word: 'עץ', emoji: '🌳' },
        { letter: 'ע', word: 'עוגה', emoji: '🍰' },
        { letter: 'ע', word: 'ענן', emoji: '☁️' },
        { letter: 'פ', word: 'פיל', emoji: '🐘' },
        { letter: 'פ', word: 'פרח', emoji: '🌸' },
        { letter: 'ץ', word: 'עץ', emoji: '🌳' },
        { letter: 'צ', word: 'צב', emoji: '🐢' },
        { letter: 'צ', word: 'צבע', emoji: '🎨' },
        { letter: 'צ', word: 'ציפור', emoji: '🐦' },
        { letter: 'ק', word: 'קוף', emoji: '🐵' },
        { letter: 'ק', word: 'קשת', emoji: '🌈' },
        { letter: 'ר', word: 'רכבת', emoji: '🚂' },
        { letter: 'ר', word: 'רקטה', emoji: '🚀' },
        { letter: 'ש', word: 'שמש', emoji: '☀️' },
        { letter: 'ש', word: 'שעון', emoji: '⏰' },
        { letter: 'ש', word: 'שוקולד', emoji: '🍫' },
        { letter: 'ת', word: 'תפוח', emoji: '🍎' },
        { letter: 'ת', word: 'תרנגול', emoji: '🐔' }
    ];
    
    // Shuffle and select 10 letters
    const selectedLetters = letters.sort(() => Math.random() - 0.5).slice(0, 10);
    let currentLetter = 0;
    let correctAnswers = 0;
    let isProcessingAnswer = false; // Prevent multiple clicks
    
    function showLetter() {
        layer.destroyChildren();
        isProcessingAnswer = false; // Reset for new question
        
        if (currentLetter >= selectedLetters.length) {
            // Session complete - ENHANCED CELEBRATION
            const finalBg = new Konva.Rect({
                x: stage.width() / 2 - 250,
                y: stage.height() / 2 - 120,
                width: 500,
                height: 240,
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: 240 },
                fillLinearGradientColorStops: [0, '#4ade80', 1, '#22c55e'],
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
                text: '🎉 כל הכבוד 🎉',
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
                text: `ענית נכון על ${correctAnswers} מתוך ${selectedLetters.length} אותיות`,
                fontSize: 28,
                fontFamily: 'Varela Round, Arial',
                fill: 'white',
                align: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 3
            });
            layer.add(scoreText);
            
            layer.draw();
            
            // Big celebration effects
            createConfetti(stage.width() / 2, stage.height() / 2, 50);
            createStarBurst(stage.width() / 2, stage.height() / 2, 12);
            createSparkles(stage.width() / 2, stage.height() / 2, 30);
            
            playApplauseSound();
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedLetters.length} אותיות`);
            return;
        }
        
        const letterData = selectedLetters[currentLetter];
        
        // Generate letter options - ensure only correct letter matches the emoji
        const allLetters = letters.map(l => l.letter);
        const uniqueLetters = [...new Set(allLetters)];
        
        // Get wrong letters that DON'T match any word starting with them in our dataset
        const wrongLetters = uniqueLetters.filter(letter => {
            // Exclude the correct letter
            if (letter === letterData.letter) return false;
            
            // Check if this letter matches the first letter of the current word
            // This ensures we don't show letters that could be ambiguous
            return letter !== letterData.word[0];
        });
        
        // Shuffle wrong letters and pick 3
        const shuffledWrong = shuffleArray(wrongLetters).slice(0, 3);
        
        // Create options array with correct answer
        const letterOptions = [...shuffledWrong, letterData.letter];
        
        // Shuffle the options
        const shuffledOptions = shuffleArray(letterOptions);
        const correctAnswer = letterData.letter;
        
        // Progress bar background
        const progressBg = new Konva.Rect({
            x: 50,
            y: 20,
            width: stage.width() - 100,
            height: 12,
            fill: '#e5e7eb',
            cornerRadius: 6
        });
        layer.add(progressBg);
        
        // Progress bar fill
        const progressFill = new Konva.Rect({
            x: 50,
            y: 20,
            width: ((stage.width() - 100) * (currentLetter + 1)) / selectedLetters.length,
            height: 12,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: (stage.width() - 100), y: 0 },
            fillLinearGradientColorStops: [0, '#f59e0b', 1, '#ea580c'],
            cornerRadius: 6
        });
        layer.add(progressFill);
        
        // Progress text
        const progressText = new Konva.Text({
            x: 50,
            y: 40,
            width: stage.width() - 100,
            text: `אות ${currentLetter + 1} מתוך ${selectedLetters.length}`,
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: '#666',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(progressText);
        
        // Instruction text with background
        const instructionBg = new Konva.Rect({
            x: stage.width() / 2 - 250,
            y: 75,
            width: 500,
            height: 50,
            fill: 'rgba(245, 158, 11, 0.15)',
            cornerRadius: 15
        });
        layer.add(instructionBg);
        
        const instructionText = new Konva.Text({
            x: stage.width() / 2 - 250,
            y: 85,
            width: 500,
            text: 'באיזו אות מתחילה המילה?',
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#ea580c',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // Calculate responsive sizes
        const emojiCircleY = 160;
        const emojiCircleRadius = Math.min(70, (stage.height() - 400) / 4);
        
        // Large colorful emoji circle
        const emojiCircle = new Konva.Circle({
            x: stage.width() / 2,
            y: emojiCircleY,
            radius: emojiCircleRadius,
            fillLinearGradientStartPoint: { x: -emojiCircleRadius, y: -emojiCircleRadius },
            fillLinearGradientEndPoint: { x: emojiCircleRadius, y: emojiCircleRadius },
            fillLinearGradientColorStops: [0, '#fbbf24', 1, '#f59e0b'],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 20,
            shadowOffset: { x: 0, y: 10 }
        });
        layer.add(emojiCircle);
        
        // White inner circle
        const innerCircle = new Konva.Circle({
            x: stage.width() / 2,
            y: emojiCircleY,
            radius: emojiCircleRadius - 10,
            fill: 'white'
        });
        layer.add(innerCircle);
        
        // Emoji - responsive size
        const emojiFontSize = Math.min(100, emojiCircleRadius * 1.4);
        const emojiText = new Konva.Text({
            x: stage.width() / 2 - emojiFontSize / 2,
            y: emojiCircleY - emojiFontSize / 2,
            width: emojiFontSize,
            height: emojiFontSize,
            text: letterData.emoji,
            fontSize: emojiFontSize,
            fontFamily: 'Arial',
            align: 'center',
            verticalAlign: 'middle'
        });
        layer.add(emojiText);
        
        // Find correct answer index in shuffled options
        const correctIndex = shuffledOptions.indexOf(correctAnswer);
        
        // Options grid (2x2) with responsive design
        const gridSize = 2;
        const gap = 15;
        const maxCellSize = 160;
        const availableWidth = stage.width() - 40; // 20px padding on each side
        const availableHeight = stage.height() - emojiCircleY - emojiCircleRadius - 40; // Space below emoji
        const cellWidth = Math.min(maxCellSize, (availableWidth - gap) / gridSize, (availableHeight - gap) / gridSize);
        const cellHeight = cellWidth; // Keep square
        const totalGridWidth = cellWidth * gridSize + gap;
        const startX = (stage.width() - totalGridWidth) / 2;
        // Position grid below the emoji circle with proper spacing
        const startY = emojiCircleY + emojiCircleRadius + 30;
        
        shuffledOptions.forEach((letter, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = startX + col * (cellWidth + gap);
            const y = startY + row * (cellHeight + gap);
            
            const optionGroup = new Konva.Group({
                x: x,
                y: y
            });
            
            // Shadow
            const shadow = new Konva.Rect({
                x: 5,
                y: 5,
                width: cellWidth,
                height: cellHeight,
                fill: 'rgba(0, 0, 0, 0.15)',
                cornerRadius: 25,
                blur: 10
            });
            optionGroup.add(shadow);
            
            // Background with gradient
            const bg = new Konva.Rect({
                width: cellWidth,
                height: cellHeight,
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: cellHeight },
                fillLinearGradientColorStops: [0, 'white', 1, '#f9fafb'],
                stroke: '#f59e0b',
                strokeWidth: 5,
                cornerRadius: 25,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10,
                shadowOffset: { x: 0, y: 5 }
            });
            optionGroup.add(bg);
            
            // Hebrew letter
            const letterText = new Konva.Text({
                text: letter,
                fontSize: Math.min(100, cellWidth * 0.6), // Responsive font size
                fontFamily: 'Arial',
                fontStyle: 'bold',
                fill: '#f59e0b',
                width: cellWidth,
                height: cellHeight,
                align: 'center',
                verticalAlign: 'middle'
            });
            optionGroup.add(letterText);
            
            optionGroup.on('click tap', function() {
                // Prevent multiple clicks while processing
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (index === correctIndex) {
                    // Correct answer - ENHANCED EFFECTS
                    bg.fill('#4ade80');
                    bg.stroke('#22c55e');
                    layer.draw();
                    
                    // Visual effects
                    bounceElement(optionGroup, 1.3);
                    glowElement(bg, '#4ade80');
                    createConfetti(x + cellWidth / 2, y + cellHeight / 2, 25);
                    createStarBurst(x + cellWidth / 2, y + cellHeight / 2, 10);
                    
                    // Audio
                    playWinSound();
                    playWhooshSound();
                    
                    // Speak the word name
                    speak(letterData.word);
                    
                    setTimeout(() => {
                        speak(getCorrectMessage());
                        addPoints(10);
                        correctAnswers++;
                    }, 800);
                    
                    setTimeout(() => {
                        currentLetter++;
                        showLetter();
                    }, 2500);
                } else {
                    // Wrong answer - ENHANCED EFFECTS
                    bg.fill('#ef4444');
                    bg.stroke('#dc2626');
                    layer.draw();
                    
                    // Visual effects
                    shakeElement(optionGroup);
                    
                    // Audio
                    playErrorSound();
                    speak(getWrongMessage());
                    
                    setTimeout(() => {
                        bg.fill('white');
                        bg.fillLinearGradientStartPoint({ x: 0, y: 0 });
                        bg.fillLinearGradientEndPoint({ x: 0, y: cellHeight });
                        bg.fillLinearGradientColorStops([0, 'white', 1, '#f9fafb']);
                        bg.stroke('#f59e0b');
                        layer.draw();
                        isProcessingAnswer = false; // Reset after wrong answer
                    }, 800);
                }
            });
            
            optionGroup.on('mouseenter', function() {
                document.body.style.cursor = 'pointer';
                bg.strokeWidth(7);
                optionGroup.to({
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 0.1
                });
                layer.draw();
            });
            
            optionGroup.on('mouseleave', function() {
                document.body.style.cursor = 'default';
                bg.strokeWidth(5);
                optionGroup.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.1
                });
                layer.draw();
            });
            
            layer.add(optionGroup);
        });
        
        layer.draw();
        
        // Speak the question with the word name
        setTimeout(() => speak(`באיזו אות מתחילה המילה ${letterData.word}`), 500);
    }
    
    // Add floating letters background
    createFloatingShapes('letters');
    
    showLetter();
}
