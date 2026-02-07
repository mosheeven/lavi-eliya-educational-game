// NUMBERS IDENTIFICATION MODE - מספרים
let numbersRange = '1-10'; // '1-10', '1-20', '1-50', '1-100'

function startNumbersMode() {
    currentMode = 'numbers';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Start activity monitoring to prevent stuck states
    startActivityMonitoring();
    
    // Show range selection
    showNumbersRangeSelection();
}

function showNumbersRangeSelection() {
    const layer = new Konva.Layer();
    stage.add(layer);
    
    // Title
    const title = new Konva.Text({
        x: 0,
        y: 40,
        width: stage.width(),
        text: 'בחר טווח מספרים',
        fontSize: 40,
        fontFamily: 'Arial',
        fill: '#8b5cf6',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(title);
    
    const ranges = [
        { range: '1-10', text: '1-10 (קל)', color: '#4ade80' },
        { range: '1-20', text: '1-20 (בינוני)', color: '#fbbf24' },
        { range: '1-50', text: '1-50 (קשה)', color: '#f87171' },
        { range: '1-100', text: '1-100 (מאתגר)', color: '#8b5cf6' }
    ];
    
    const buttonWidth = 250;
    const buttonHeight = 70;
    const spacing = 20;
    const startY = 140;
    
    ranges.forEach((rangeData, index) => {
        const x = (stage.width() - buttonWidth) / 2;
        const y = startY + index * (buttonHeight + spacing);
        
        const buttonGroup = new Konva.Group({ x, y });
        
        const button = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: rangeData.color,
            cornerRadius: 15,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.3
        });
        
        const text = new Konva.Text({
            width: buttonWidth,
            height: buttonHeight,
            text: rangeData.text,
            fontSize: 28,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        
        buttonGroup.add(button, text);
        layer.add(buttonGroup);
        
        buttonGroup.on('mouseenter', () => {
            button.shadowBlur(15);
            buttonGroup.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
            stage.container().style.cursor = 'pointer';
            layer.draw();
        });
        
        buttonGroup.on('mouseleave', () => {
            button.shadowBlur(10);
            buttonGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
            stage.container().style.cursor = 'default';
            layer.draw();
        });
        
        buttonGroup.on('click tap', () => {
            updateActivity();
            numbersRange = rangeData.range;
            layer.destroy();
            startNumbersGame();
        });
    });
    
    layer.draw();
}

function startNumbersGame() {
    // Generate numbers based on selected range
    let maxNumber;
    if (numbersRange === '1-10') maxNumber = 10;
    else if (numbersRange === '1-20') maxNumber = 20;
    else if (numbersRange === '1-50') maxNumber = 50;
    else maxNumber = 100;
    
    // For higher ranges, use number recognition instead of counting
    const useCountingMode = maxNumber <= 10;
    
    // Numbers with visual counting aids (emojis) for 1-10
    const countingNumbers = [
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
    
    let selectedNumbers;
    
    if (useCountingMode) {
        // Use counting mode for 1-10
        selectedNumbers = shuffleArray(countingNumbers).slice(0, 10);
    } else {
        // Use number recognition mode for higher ranges
        selectedNumbers = [];
        for (let i = 0; i < 15; i++) {
            const num = Math.floor(Math.random() * maxNumber) + 1;
            const options = generateNumberOptions(num, maxNumber);
            selectedNumbers.push({
                number: num,
                options: options,
                useCountingMode: false
            });
        }
    }
    
    function generateNumberOptions(correctNum, max) {
        const options = [correctNum];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 20) - 10;
            const option = Math.max(1, Math.min(max, correctNum + offset));
            if (!options.includes(option)) {
                options.push(option);
            }
        }
        return shuffleArray(options);
    }
    
    // Shuffle and select numbers
    selectedNumbers = shuffleArray(selectedNumbers).slice(0, useCountingMode ? 10 : 15);
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
        
        const isCountingMode = numberData.useCountingMode !== false;
        
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
            text: isCountingMode ? 'כמה יש? בחר את המספר הנכון' : 'איזה מספר זה?',
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#6366f1',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // Display counting emojis in a nice grid OR large number
        const emojiDisplayY = 160;
        
        if (isCountingMode && numberData.count > 0) {
            const emojiSize = 50;
            const maxPerRow = 5;
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
        } else if (isCountingMode && numberData.count === 0) {
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
        } else {
            // For number recognition mode, show large number
            const numberCircle = new Konva.Circle({
                x: stage.width() / 2,
                y: emojiDisplayY + 50,
                radius: 80,
                fillLinearGradientStartPoint: { x: -80, y: -80 },
                fillLinearGradientEndPoint: { x: 80, y: 80 },
                fillLinearGradientColorStops: [0, '#8b5cf6', 1, '#6366f1'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 20,
                shadowOffset: { x: 0, y: 10 }
            });
            layer.add(numberCircle);
            
            const innerCircle = new Konva.Circle({
                x: stage.width() / 2,
                y: emojiDisplayY + 50,
                radius: 70,
                fill: 'white'
            });
            layer.add(innerCircle);
            
            const largeNumber = new Konva.Text({
                x: stage.width() / 2,
                y: emojiDisplayY + 50,
                text: numberData.number.toString(),
                fontSize: 80,
                fontFamily: 'Arial',
                fill: '#8b5cf6',
                fontStyle: 'bold',
                align: 'center',
                verticalAlign: 'middle'
            });
            largeNumber.offsetX(largeNumber.width() / 2);
            largeNumber.offsetY(largeNumber.height() / 2);
            layer.add(largeNumber);
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
                updateActivity(); // Track user interaction
                
                // Safety timeout in case animations fail
                const safetyTimeout = registerTimer(setTimeout(() => {
                    if (isProcessingAnswer) {
                        isProcessingAnswer = false;
                        currentNumber++;
                        showNumber();
                    }
                }, 3000));
                
                if (index === correctIndex) {
                    // Correct answer - simplified feedback (sound only)
                    bg.fill('#4ade80');
                    bg.stroke('#22c55e');
                    layer.draw();
                    
                    playWinSound();
                    addPoints(10);
                    correctAnswers++;
                    
                    clearTimeout(safetyTimeout);
                    registerTimer(setTimeout(() => {
                        currentNumber++;
                        showNumber();
                    }, 800));
                } else {
                    // Wrong answer - simplified feedback (sound only)
                    bg.fill('#ef4444');
                    bg.stroke('#dc2626');
                    layer.draw();
                    
                    playErrorSound();
                    
                    clearTimeout(safetyTimeout);
                    registerTimer(setTimeout(() => {
                        bg.fill('white');
                        bg.fillLinearGradientStartPoint({ x: 0, y: 0 });
                        bg.fillLinearGradientEndPoint({ x: 0, y: cellHeight - 20 });
                        bg.fillLinearGradientColorStops([0, 'white', 1, '#f9fafb']);
                        bg.stroke('#8b5cf6');
                        layer.draw();
                        isProcessingAnswer = false;
                    }, 600));
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
        if (isCountingMode) {
            registerTimer(setTimeout(() => speak(`כמה ${numberData.emoji || ''} יש`), 500));
        } else {
            registerTimer(setTimeout(() => speak(`איזה מספר זה ${numberData.number}`), 500));
        }
    }
    
    showNumber();
}
