// NUMBERS IDENTIFICATION MODE - מספרים
function startNumbersMode() {
    currentMode = 'numbers';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Numbers 0-10 with visual counting aids (emojis)
    const numbers = [
        { number: 0, emoji: '', count: 0, options: [0, 1, 2, 3] },
        { number: 1, emoji: '⭐', count: 1, options: [1, 2, 3, 4] },
        { number: 2, emoji: '🎈', count: 2, options: [1, 2, 3, 4] },
        { number: 3, emoji: '🍎', count: 3, options: [2, 3, 4, 5] },
        { number: 4, emoji: '🌟', count: 4, options: [3, 4, 5, 6] },
        { number: 5, emoji: '🎁', count: 5, options: [4, 5, 6, 7] },
        { number: 6, emoji: '🌸', count: 6, options: [5, 6, 7, 8] },
        { number: 7, emoji: '🦋', count: 7, options: [6, 7, 8, 9] },
        { number: 8, emoji: '🍓', count: 8, options: [7, 8, 9, 10] },
        { number: 9, emoji: '💎', count: 9, options: [8, 9, 10, 11] },
        { number: 10, emoji: '🌈', count: 10, options: [9, 10, 11, 12] }
    ];
    
    // Shuffle and select 10 numbers using Fisher-Yates
    const selectedNumbers = shuffleArray(numbers).slice(0, 10);
    let currentNumber = 0;
    let correctAnswers = 0;
    let isProcessingAnswer = false;
    
    function showNumber() {
        layer.destroyChildren();
        isProcessingAnswer = false;
        
        if (currentNumber >= selectedNumbers.length) {
            // Session complete
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
                text: `זיהית נכון ${correctAnswers} מתוך ${selectedNumbers.length} מספרים`,
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
            speak(`כל הכבוד זיהית נכון ${correctAnswers} מתוך ${selectedNumbers.length} מספרים`);
            return;
        }
        
        const numberData = selectedNumbers[currentNumber];
        
        // Randomize options array using Fisher-Yates
        const shuffledOptions = shuffleArray([...numberData.options]);
        const correctAnswer = numberData.number;
        
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
            width: ((stage.width() - 100) * (currentNumber + 1)) / selectedNumbers.length,
            height: 12,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: (stage.width() - 100), y: 0 },
            fillLinearGradientColorStops: [0, '#8b5cf6', 1, '#6366f1'],
            cornerRadius: 6
        });
        layer.add(progressFill);
        
        // Progress text
        const progressText = new Konva.Text({
            x: 50,
            y: 40,
            width: stage.width() - 100,
            text: `מספר ${currentNumber + 1} מתוך ${selectedNumbers.length}`,
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
            fill: 'rgba(139, 92, 246, 0.15)',
            cornerRadius: 15
        });
        layer.add(instructionBg);
        
        const instructionText = new Konva.Text({
            x: stage.width() / 2 - 200,
            y: 85,
            width: 400,
            text: 'כמה יש? בחר את המספר הנכון',
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#6366f1',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // Display counting emojis in a nice grid
        const emojiDisplayY = 160;
        const emojiSize = 50;
        const maxPerRow = 5;
        
        if (numberData.count > 0) {
            for (let i = 0; i < numberData.count; i++) {
                const row = Math.floor(i / maxPerRow);
                const col = i % maxPerRow;
                const totalInRow = Math.min(maxPerRow, numberData.count - row * maxPerRow);
                const rowWidth = totalInRow * (emojiSize + 10);
                const startX = (stage.width() - rowWidth) / 2;
                
                const emojiText = new Konva.Text({
                    x: startX + col * (emojiSize + 10),
                    y: emojiDisplayY + row * (emojiSize + 10),
                    text: numberData.emoji,
                    fontSize: emojiSize,
                    fontFamily: 'Arial'
                });
                layer.add(emojiText);
            }
        } else {
            // For zero, show empty box
            const emptyBox = new Konva.Rect({
                x: stage.width() / 2 - 100,
                y: emojiDisplayY,
                width: 200,
                height: 100,
                stroke: '#d1d5db',
                strokeWidth: 3,
                dash: [10, 5],
                cornerRadius: 10
            });
            layer.add(emptyBox);
            
            const emptyText = new Konva.Text({
                x: stage.width() / 2 - 100,
                y: emojiDisplayY + 35,
                width: 200,
                text: 'אין כלום',
                fontSize: 28,
                fontFamily: 'Varela Round, Arial',
                fill: '#9ca3af',
                align: 'center'
            });
            layer.add(emptyText);
        }
        
        // Find correct answer index in shuffled options
        const correctIndex = shuffledOptions.indexOf(correctAnswer);
        
        // Options grid (2x2) - matching quiz/math game layout
        const gridSize = 2;
        const cellWidth = 180;
        const cellHeight = 180;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 280; // Lower position to fit in 600px canvas
        
        shuffledOptions.forEach((num, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            const optionGroup = new Konva.Group({
                x: x,
                y: y
            });
            
            // Shadow
            const shadow = new Konva.Rect({
                x: 5,
                y: 5,
                width: cellWidth - 20,
                height: cellHeight - 20,
                fill: 'rgba(0, 0, 0, 0.15)',
                cornerRadius: 25,
                blur: 10
            });
            optionGroup.add(shadow);
            
            // Background with gradient
            const bg = new Konva.Rect({
                width: cellWidth - 20,
                height: cellHeight - 20,
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: cellHeight - 20 },
                fillLinearGradientColorStops: [0, 'white', 1, '#f9fafb'],
                stroke: '#8b5cf6',
                strokeWidth: 5,
                cornerRadius: 25,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10,
                shadowOffset: { x: 0, y: 5 }
            });
            optionGroup.add(bg);
            
            // Number - large and bold
            const numberText = new Konva.Text({
                text: num.toString(),
                fontSize: 90,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                width: cellWidth - 20,
                height: cellHeight - 20,
                align: 'center',
                verticalAlign: 'middle',
                fill: '#6366f1'
            });
            optionGroup.add(numberText);
            
            optionGroup.on('click tap', function() {
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (index === correctIndex) {
                    // Correct answer - celebrate!
                    bg.fill('#4ade80');
                    bg.stroke('#22c55e');
                    layer.draw();
                    playWinSound();
                    
                    // Speak the number
                    speak(`נכון המספר ${numberData.number}`);
                    
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
                    
                    registerTimer(setTimeout(() => {
                        currentNumber++;
                        showNumber();
                    }, 2500));
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
                        bg.fillLinearGradientEndPoint({ x: 0, y: cellHeight - 20 });
                        bg.fillLinearGradientColorStops([0, 'white', 1, '#f9fafb']);
                        bg.stroke('#8b5cf6');
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
        
        // Speak instruction with registered timer
        registerTimer(setTimeout(() => speak(`כמה ${numberData.emoji} יש`), 500));
    }
    
    showNumber();
}
