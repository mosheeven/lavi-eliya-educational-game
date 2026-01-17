// HEBREW LETTERS MODE - אותיות
function startLettersMode() {
    currentMode = 'letters';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Hebrew letters with matching words and emojis
    const letters = [
        { letter: 'א', word: 'אריה', emoji: '🦁', options: ['🦁', '🐘', '🐻', '🐯'] },
        { letter: 'ב', word: 'בננה', emoji: '🍌', options: ['🍌', '🍎', '🍊', '🍇'] },
        { letter: 'ג', word: 'גמל', emoji: '🐫', options: ['🐫', '🐴', '🦒', '🐄'] },
        { letter: 'ד', word: 'דג', emoji: '🐟', options: ['🐟', '🐠', '🦈', '🐙'] },
        { letter: 'ה', word: 'הר', emoji: '⛰️', options: ['⛰️', '🏔️', '🌋', '🏖️'] },
        { letter: 'ו', word: 'ורד', emoji: '🌹', options: ['🌹', '🌻', '🌷', '🌸'] },
        { letter: 'ז', word: 'זברה', emoji: '🦓', options: ['🦓', '🦒', '🐴', '🦌'] },
        { letter: 'ח', word: 'חתול', emoji: '🐱', options: ['🐱', '🐶', '🐭', '🐰'] },
        { letter: 'ט', word: 'טלפון', emoji: '📱', options: ['📱', '💻', '⌚', '📷'] },
        { letter: 'י', word: 'ירח', emoji: '🌙', options: ['🌙', '⭐', '☀️', '☁️'] },
        { letter: 'כ', word: 'כלב', emoji: '🐶', options: ['🐶', '🐱', '🐭', '🐰'] },
        { letter: 'ל', word: 'לב', emoji: '❤️', options: ['❤️', '💙', '💚', '💛'] },
        { letter: 'מ', word: 'מטוס', emoji: '✈️', options: ['✈️', '🚗', '🚌', '🚲'] },
        { letter: 'ן', word: 'חלון', emoji: '🪟', options: ['🪟', '🚪', '🏠', '🏢'] },
        { letter: 'נ', word: 'נר', emoji: '🕯️', options: ['🕯️', '💡', '🔦', '🔥'] },
        { letter: 'ס', word: 'סוס', emoji: '🐴', options: ['🐴', '🦓', '🦒', '🐄'] },
        { letter: 'ע', word: 'עץ', emoji: '🌳', options: ['🌳', '🌲', '🌴', '🌵'] },
        { letter: 'פ', word: 'פיל', emoji: '🐘', options: ['🐘', '🦏', '🦛', '🐃'] },
        { letter: 'ץ', word: 'עץ', emoji: '🌳', options: ['🌳', '🌲', '🌴', '🌵'] },
        { letter: 'צ', word: 'צב', emoji: '🐢', options: ['🐢', '🐸', '🦎', '🐊'] },
        { letter: 'ק', word: 'קוף', emoji: '🐵', options: ['🐵', '🦍', '🐒', '🦧'] },
        { letter: 'ר', word: 'רכבת', emoji: '🚂', options: ['🚂', '🚗', '🚌', '✈️'] },
        { letter: 'ש', word: 'שמש', emoji: '☀️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { letter: 'ת', word: 'תפוח', emoji: '🍎', options: ['🍎', '🍌', '🍊', '🍇'] }
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
            // Session complete
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
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedLetters.length} אותיות`);
            return;
        }
        
        const letterData = selectedLetters[currentLetter];
        
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
            x: stage.width() / 2 - 200,
            y: 75,
            width: 400,
            height: 50,
            fill: 'rgba(245, 158, 11, 0.15)',
            cornerRadius: 15
        });
        layer.add(instructionBg);
        
        const instructionText = new Konva.Text({
            x: stage.width() / 2 - 200,
            y: 85,
            width: 400,
            text: 'מצא את התמונה שמתחילה באות',
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#ea580c',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // Calculate responsive sizes
        const letterCircleY = 160;
        const letterCircleRadius = Math.min(60, (stage.height() - 400) / 4);
        
        // Large colorful letter circle
        const letterCircle = new Konva.Circle({
            x: stage.width() / 2,
            y: letterCircleY,
            radius: letterCircleRadius,
            fillLinearGradientStartPoint: { x: -letterCircleRadius, y: -letterCircleRadius },
            fillLinearGradientEndPoint: { x: letterCircleRadius, y: letterCircleRadius },
            fillLinearGradientColorStops: [0, '#fbbf24', 1, '#f59e0b'],
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 20,
            shadowOffset: { x: 0, y: 10 }
        });
        layer.add(letterCircle);
        
        // White inner circle
        const innerCircle = new Konva.Circle({
            x: stage.width() / 2,
            y: letterCircleY,
            radius: letterCircleRadius - 10,
            fill: 'white'
        });
        layer.add(innerCircle);
        
        // Hebrew letter - responsive size
        const letterFontSize = Math.min(80, letterCircleRadius * 1.3);
        const letterText = new Konva.Text({
            x: stage.width() / 2 - letterFontSize / 2,
            y: letterCircleY - letterFontSize / 2,
            width: letterFontSize,
            height: letterFontSize,
            text: letterData.letter,
            fontSize: letterFontSize,
            fontFamily: 'Arial',
            fill: '#f59e0b',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        layer.add(letterText);
        
        // Find correct answer index
        const correctIndex = letterData.options.indexOf(letterData.emoji);
        
        // Options grid (2x2) with responsive design
        const gridSize = 2;
        const gap = 15;
        const maxCellSize = 160;
        const availableWidth = stage.width() - 40; // 20px padding on each side
        const availableHeight = stage.height() - letterCircleY - letterCircleRadius - 40; // Space below letter
        const cellWidth = Math.min(maxCellSize, (availableWidth - gap) / gridSize, (availableHeight - gap) / gridSize);
        const cellHeight = cellWidth; // Keep square
        const totalGridWidth = cellWidth * gridSize + gap;
        const totalGridHeight = cellHeight * gridSize + gap;
        const startX = (stage.width() - totalGridWidth) / 2;
        // Position grid below the letter circle with proper spacing
        const startY = letterCircleY + letterCircleRadius + 30;
        
        letterData.options.forEach((emoji, index) => {
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
            
            // Emoji
            const emojiText = new Konva.Text({
                text: emoji,
                fontSize: Math.min(100, cellWidth * 0.5), // Responsive font size
                fontFamily: 'Arial',
                width: cellWidth,
                height: cellHeight,
                align: 'center',
                verticalAlign: 'middle'
            });
            optionGroup.add(emojiText);
            
            optionGroup.on('click tap', function() {
                // Prevent multiple clicks while processing
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (index === correctIndex) {
                    // Correct answer - celebrate!
                    bg.fill('#4ade80');
                    bg.stroke('#22c55e');
                    layer.draw();
                    playWinSound();
                    
                    // Speak the word name
                    speak(letterData.word);
                    
                    // Animate celebration
                    optionGroup.to({
                        scaleX: 1.2,
                        scaleY: 1.2,
                        duration: 0.2,
                        onFinish: () => {
                            optionGroup.to({
                                scaleX: 1,
                                scaleY: 1,
                                duration: 0.2
                            });
                        }
                    });
                    
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
                    // Wrong answer - shake
                    bg.fill('#ef4444');
                    bg.stroke('#dc2626');
                    layer.draw();
                    playErrorSound();
                    speak(getWrongMessage());
                    
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
                                        duration: 0.05,
                                        onFinish: () => {
                                            // Reset flag after wrong answer animation
                                            isProcessingAnswer = false;
                                        }
                                    });
                                }
                            });
                        }
                    });
                    
                    setTimeout(() => {
                        bg.fill('white');
                        bg.fillLinearGradientStartPoint({ x: 0, y: 0 });
                        bg.fillLinearGradientEndPoint({ x: 0, y: cellHeight });
                        bg.fillLinearGradientColorStops([0, 'white', 1, '#f9fafb']);
                        bg.stroke('#f59e0b');
                        layer.draw();
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
        
        // Only speak the letter, not the word
        setTimeout(() => speak(`האות ${letterData.letter}`), 500);
    }
    
    showLetter();
}
