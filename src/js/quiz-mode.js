// ENGLISH LEARNING MODE - אנגלית
function startQuizMode() {
    currentMode = 'quiz';
    initStage();
    hideScore();
    
    // Expanded English words with emoji representations (80+ words)
    const words = [
        // Animals
        { word: 'CAT', emoji: '🐱' },
        { word: 'DOG', emoji: '🐶' },
        { word: 'MOUSE', emoji: '🐭' },
        { word: 'RABBIT', emoji: '🐰' },
        { word: 'FISH', emoji: '🐟' },
        { word: 'SHARK', emoji: '🦈' },
        { word: 'BIRD', emoji: '🐦' },
        { word: 'DUCK', emoji: '🦆' },
        { word: 'OWL', emoji: '🦉' },
        { word: 'BEE', emoji: '🐝' },
        { word: 'BUTTERFLY', emoji: '🦋' },
        { word: 'LION', emoji: '🦁' },
        { word: 'TIGER', emoji: '🐯' },
        { word: 'BEAR', emoji: '🐻' },
        { word: 'PANDA', emoji: '🐼' },
        { word: 'ELEPHANT', emoji: '🐘' },
        { word: 'GIRAFFE', emoji: '🦒' },
        { word: 'MONKEY', emoji: '🐵' },
        { word: 'KOALA', emoji: '🐨' },
        { word: 'FROG', emoji: '🐸' },
        { word: 'TURTLE', emoji: '🐢' },
        
        // Nature
        { word: 'TREE', emoji: '🌳' },
        { word: 'FLOWER', emoji: '🌸' },
        { word: 'CACTUS', emoji: '🌵' },
        { word: 'SUN', emoji: '☀️' },
        { word: 'MOON', emoji: '🌙' },
        { word: 'STAR', emoji: '⭐' },
        { word: 'CLOUD', emoji: '☁️' },
        { word: 'FIRE', emoji: '🔥' },
        { word: 'WATER', emoji: '💧' },
        { word: 'SNOW', emoji: '❄️' },
        { word: 'RAINBOW', emoji: '🌈' },
        { word: 'LIGHTNING', emoji: '⚡' },
        
        // Food
        { word: 'APPLE', emoji: '🍎' },
        { word: 'BANANA', emoji: '🍌' },
        { word: 'ORANGE', emoji: '🍊' },
        { word: 'GRAPES', emoji: '🍇' },
        { word: 'PIZZA', emoji: '🍕' },
        { word: 'BURGER', emoji: '🍔' },
        { word: 'CAKE', emoji: '🍰' },
        { word: 'BREAD', emoji: '🍞' },
        { word: 'CHEESE', emoji: '🧀' },
        { word: 'MILK', emoji: '🥛' },
        { word: 'ICE CREAM', emoji: '🍦' },
        { word: 'COOKIE', emoji: '🍪' },
        { word: 'DONUT', emoji: '🍩' },
        { word: 'CHOCOLATE', emoji: '🍫' },
        
        // Transportation
        { word: 'CAR', emoji: '🚗' },
        { word: 'BUS', emoji: '🚌' },
        { word: 'BIKE', emoji: '🚲' },
        { word: 'PLANE', emoji: '✈️' },
        { word: 'TRAIN', emoji: '🚂' },
        { word: 'HELICOPTER', emoji: '🚁' },
        { word: 'SHIP', emoji: '🚢' },
        { word: 'ROCKET', emoji: '🚀' },
        
        // Buildings
        { word: 'HOUSE', emoji: '🏠' },
        { word: 'SCHOOL', emoji: '🏫' },
        { word: 'HOSPITAL', emoji: '🏥' },
        { word: 'STORE', emoji: '🏪' },
        { word: 'CASTLE', emoji: '🏰' },
        
        // Sports & Activities
        { word: 'BALL', emoji: '⚽' },
        { word: 'BASKETBALL', emoji: '🏀' },
        { word: 'TENNIS', emoji: '🎾' },
        { word: 'BASEBALL', emoji: '⚾' },
        
        // Objects
        { word: 'HEART', emoji: '❤️' },
        { word: 'BOOK', emoji: '📚' },
        { word: 'PENCIL', emoji: '✏️' },
        { word: 'GIFT', emoji: '🎁' },
        { word: 'BALLOON', emoji: '🎈' },
        { word: 'CROWN', emoji: '👑' },
        { word: 'KEY', emoji: '🔑' },
        { word: 'CLOCK', emoji: '⏰' },
        { word: 'WATCH', emoji: '⌚' },
        { word: 'CAMERA', emoji: '📷' },
        { word: 'PHONE', emoji: '📱' },
        { word: 'COMPUTER', emoji: '💻' },
        { word: 'UMBRELLA', emoji: '☂️' },
        { word: 'GLASSES', emoji: '👓' },
        { word: 'HAT', emoji: '👒' },
        { word: 'BACKPACK', emoji: '🎒' }
    ];
    
    // Shuffle and select 15 words (increased from 10)
    const selectedWords = words.sort(() => Math.random() - 0.5).slice(0, 15);
    let currentWord = 0;
    let correctAnswers = 0;
    let isProcessingAnswer = false; // Prevent multiple clicks
    
    // Encouraging messages
    const encouragingMessages = [
        'מעולה! 🌟',
        'כל הכבוד! 🎉',
        'יפה מאוד! ⭐',
        'נהדר! 🎊',
        'מצוין! 💫',
        'אלוף! 🏆',
        'פנטסטי! 🎈',
        'מדהים! ✨'
    ];
    
    const wrongMessages = [
        'נסה שוב! 💪',
        'כמעט! 🤔',
        'לא נורא! 😊',
        'תנסה עוד פעם! 🌈'
    ];
    
    function showWord() {
        layer.destroyChildren();
        isProcessingAnswer = false; // Reset for new question
        
        if (currentWord >= selectedWords.length) {
            // Session complete - ENHANCED CELEBRATION
            const finalBg = new Konva.Rect({
                x: stage.width() / 2 - 250,
                y: stage.height() / 2 - 120,
                width: 500,
                height: 240,
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: 240 },
                fillLinearGradientColorStops: [0, '#ec4899', 1, '#db2777'],
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
                text: `ענית נכון על ${correctAnswers} מתוך ${selectedWords.length} מילים`,
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
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedWords.length} מילים`);
            return;
        }
        
        const wordData = selectedWords[currentWord];
        
        // Generate word options - ensure only correct word matches the emoji
        const allWords = words.map(w => w.word);
        const uniqueWords = [...new Set(allWords)];
        
        // Get wrong words that DON'T match the current emoji
        const wrongWords = uniqueWords.filter(word => {
            // Exclude the correct word
            if (word === wordData.word) return false;
            
            // Ensure this word doesn't match the current emoji
            return !words.some(w => w.word === word && w.emoji === wordData.emoji);
        });
        
        // Shuffle wrong words and pick 3
        const shuffledWrong = shuffleArray(wrongWords).slice(0, 3);
        
        // Create options array with correct answer
        const wordOptions = [...shuffledWrong, wordData.word];
        
        // Shuffle the options
        const shuffledOptions = shuffleArray(wordOptions);
        const correctAnswer = wordData.word;
        
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
            width: ((stage.width() - 100) * (currentWord + 1)) / selectedWords.length,
            height: 12,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: (stage.width() - 100), y: 0 },
            fillLinearGradientColorStops: [0, '#ec4899', 1, '#db2777'],
            cornerRadius: 6
        });
        layer.add(progressFill);
        
        // Progress text
        const progressText = new Konva.Text({
            x: 50,
            y: 40,
            width: stage.width() - 100,
            text: `מילה ${currentWord + 1} מתוך ${selectedWords.length}`,
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
            fill: 'rgba(236, 72, 153, 0.15)',
            cornerRadius: 15
        });
        layer.add(instructionBg);
        
        const instructionText = new Konva.Text({
            x: stage.width() / 2 - 250,
            y: 85,
            width: 500,
            text: 'מה השם באנגלית?',
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#db2777',
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
            fillLinearGradientColorStops: [0, '#ec4899', 1, '#db2777'],
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
            text: wordData.emoji,
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
        const availableWidth = stage.width() - 40;
        const availableHeight = stage.height() - emojiCircleY - emojiCircleRadius - 40;
        const cellWidth = Math.min(maxCellSize, (availableWidth - gap) / gridSize, (availableHeight - gap) / gridSize);
        const cellHeight = cellWidth;
        const totalGridWidth = cellWidth * gridSize + gap;
        const startX = (stage.width() - totalGridWidth) / 2;
        const startY = emojiCircleY + emojiCircleRadius + 30;
        
        shuffledOptions.forEach((word, index) => {
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
                fillLinearGradientColorStops: [0, 'white', 1, '#fdf2f8'],
                stroke: '#ec4899',
                strokeWidth: 5,
                cornerRadius: 25,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 10,
                shadowOffset: { x: 0, y: 5 }
            });
            optionGroup.add(bg);
            
            // English word - LTR
            const ltrMark = '\u200E';
            const wordText = new Konva.Text({
                text: ltrMark + word + ltrMark,
                fontSize: Math.min(28, cellWidth * 0.15),
                fontFamily: 'Arial',
                fontStyle: 'bold',
                fill: '#db2777',
                width: cellWidth,
                height: cellHeight,
                align: 'center',
                verticalAlign: 'middle',
                padding: 10
            });
            optionGroup.add(wordText);
            
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
                    
                    // Speak correct message
                    speak(getCorrectMessage());
                    
                    setTimeout(() => {
                        addPoints(10);
                        correctAnswers++;
                    }, 300);
                    
                    setTimeout(() => {
                        currentWord++;
                        showWord();
                    }, 2000);
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
                        bg.fillLinearGradientColorStops([0, 'white', 1, '#fdf2f8']);
                        bg.stroke('#ec4899');
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
        
        // Speak the question in Hebrew, then the word in English
        setTimeout(() => {
            speak('מה השם באנגלית');
            
            // Then speak the English word
            setTimeout(() => {
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(wordData.word.toLowerCase());
                    utterance.lang = 'en-US';
                    utterance.rate = 0.7;
                    utterance.pitch = 1.0;
                    window.speechSynthesis.speak(utterance);
                }
            }, 1500);
        }, 500);
    }
    
    // Add floating stars background
    createFloatingShapes('stars');
    
    showWord();
}
