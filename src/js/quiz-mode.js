// ENGLISH LEARNING MODE - אנגלית
function startQuizMode() {
    currentMode = 'quiz';
    initStage();
    hideScore();
    
    // English words with emoji representations
    const words = [
        { word: 'CAT', emoji: '🐱', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'DOG', emoji: '🐶', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'MOUSE', emoji: '🐭', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'RABBIT', emoji: '🐰', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'TREE', emoji: '🌳', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'FLOWER', emoji: '🌸', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'CACTUS', emoji: '🌵', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'SUN', emoji: '☀️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'MOON', emoji: '🌙', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'STAR', emoji: '⭐', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'CLOUD', emoji: '☁️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'APPLE', emoji: '🍎', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'BANANA', emoji: '🍌', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'ORANGE', emoji: '🍊', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'GRAPES', emoji: '🍇', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'CAR', emoji: '🚗', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'BUS', emoji: '🚌', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'BIKE', emoji: '🚲', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'PLANE', emoji: '✈️', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'HOUSE', emoji: '🏠', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'SCHOOL', emoji: '🏫', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'HOSPITAL', emoji: '🏥', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'STORE', emoji: '🏪', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'BALL', emoji: '⚽', options: ['⚽', '🏀', '🎾', '⚾'] },
        { word: 'BASKETBALL', emoji: '🏀', options: ['⚽', '🏀', '🎾', '⚾'] },
        { word: 'HEART', emoji: '❤️', options: ['❤️', '💙', '💚', '💛'] },
        { word: 'BOOK', emoji: '📚', options: ['📚', '✏️', '📝', '🖍️'] },
        { word: 'PENCIL', emoji: '✏️', options: ['📚', '✏️', '📝', '🖍️'] },
        { word: 'PIZZA', emoji: '🍕', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'BURGER', emoji: '🍔', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'CAKE', emoji: '🍰', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'FISH', emoji: '🐟', options: ['🐟', '🐠', '🦈', '🐙'] },
        { word: 'SHARK', emoji: '🦈', options: ['🐟', '🐠', '🦈', '🐙'] },
        { word: 'BIRD', emoji: '🐦', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'DUCK', emoji: '🦆', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'OWL', emoji: '🦉', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'BEE', emoji: '🐝', options: ['🐝', '🦋', '🐞', '🐛'] },
        { word: 'BUTTERFLY', emoji: '🦋', options: ['🐝', '🦋', '🐞', '🐛'] },
        { word: 'FIRE', emoji: '🔥', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'WATER', emoji: '💧', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'SNOW', emoji: '❄️', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'RAINBOW', emoji: '🌈', options: ['🌈', '⚡', '🌪️', '🌤️'] },
        { word: 'LIGHTNING', emoji: '⚡', options: ['🌈', '⚡', '🌪️', '🌤️'] },
        { word: 'GIFT', emoji: '🎁', options: ['🎁', '🎈', '🎉', '🎊'] },
        { word: 'BALLOON', emoji: '🎈', options: ['🎁', '🎈', '🎉', '🎊'] },
        { word: 'CROWN', emoji: '👑', options: ['👑', '💎', '🔑', '🎩'] },
        { word: 'KEY', emoji: '🔑', options: ['👑', '💎', '🔑', '🎩'] },
        { word: 'CLOCK', emoji: '⏰', options: ['⏰', '⌚', '⏱️', '⏳'] },
        { word: 'WATCH', emoji: '⌚', options: ['⏰', '⌚', '⏱️', '⏳'] },
        { word: 'CAMERA', emoji: '📷', options: ['📷', '📱', '💻', '🖥️'] }
    ];
    
    // Shuffle and select 10 words
    const selectedWords = words.sort(() => Math.random() - 0.5).slice(0, 10);
    let currentWord = 0;
    let correctAnswers = 0;
    
    function showWord() {
        layer.destroyChildren();
        
        if (currentWord >= selectedWords.length) {
            // Session complete
            const finalText = new Konva.Text({
                x: 0,
                y: stage.height() / 2 - 80,
                width: stage.width(),
                text: 'כל הכבוד',
                fontSize: 50,
                fontFamily: 'Arial',
                fill: '#667eea',
                align: 'center',
                fontStyle: 'bold'
            });
            layer.add(finalText);
            
            const scoreText = new Konva.Text({
                x: 0,
                y: stage.height() / 2,
                width: stage.width(),
                text: `ענית נכון על ${correctAnswers} מתוך ${selectedWords.length} מילים`,
                fontSize: 30,
                fontFamily: 'Arial',
                fill: '#764ba2',
                align: 'center'
            });
            layer.add(scoreText);
            
            layer.draw();
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedWords.length} מילים`);
            return;
        }
        
        const wordData = selectedWords[currentWord];
        
        // Instruction text
        const instructionText = new Konva.Text({
            x: 50,
            y: 60,
            width: stage.width() - 100,
            text: 'מצא את האימוג׳י הנכון',
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // English word - large and centered, LTR
        const ltrMark = '\u200E';
        const wordText = new Konva.Text({
            x: 50,
            y: 120,
            width: stage.width() - 100,
            text: ltrMark + wordData.word + ltrMark,
            fontSize: 70,
            fontFamily: 'Arial',
            fill: '#ec4899',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(wordText);
        
        // Progress indicator
        const progressText = new Konva.Text({
            x: 50,
            y: 20,
            width: stage.width() - 100,
            text: `מילה ${currentWord + 1} מתוך ${selectedWords.length}`,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#666',
            align: 'center'
        });
        layer.add(progressText);
        
        // Find correct answer index
        const correctIndex = wordData.options.indexOf(wordData.emoji);
        
        // Options grid (2x2)
        const gridSize = 2;
        const cellWidth = 180;
        const cellHeight = 180;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 250;
        
        wordData.options.forEach((emoji, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            const optionGroup = new Konva.Group({
                x: x,
                y: y
            });
            
            const bg = new Konva.Rect({
                width: cellWidth - 20,
                height: cellHeight - 20,
                fill: 'white',
                stroke: '#ec4899',
                strokeWidth: 4,
                cornerRadius: 20
            });
            optionGroup.add(bg);
            
            const emojiText = new Konva.Text({
                text: emoji,
                fontSize: 80,
                fontFamily: 'Arial',
                width: cellWidth - 20,
                height: cellHeight - 20,
                align: 'center',
                verticalAlign: 'middle'
            });
            optionGroup.add(emojiText);
            
            optionGroup.on('click tap', function() {
                if (index === correctIndex) {
                    // Correct answer
                    bg.fill('#4ade80');
                    layer.draw();
                    playWinSound();
                    speak(getCorrectMessage());
                    correctAnswers++;
                    
                    setTimeout(() => {
                        currentWord++;
                        showWord();
                    }, 1500);
                } else {
                    // Wrong answer
                    bg.fill('#ef4444');
                    layer.draw();
                    playErrorSound();
                    speak(getWrongMessage());
                    
                    setTimeout(() => {
                        bg.fill('white');
                        layer.draw();
                    }, 800);
                }
            });
            
            optionGroup.on('mouseenter', function() {
                bg.strokeWidth(6);
                layer.draw();
            });
            
            optionGroup.on('mouseleave', function() {
                bg.strokeWidth(4);
                layer.draw();
            });
            
            layer.add(optionGroup);
        });
        
        layer.draw();
        
        // Speak the English word
        setTimeout(() => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(wordData.word.toLowerCase());
                utterance.lang = 'en-US';
                utterance.rate = 0.7;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            }
        }, 500);
    }
    
    showWord();
}
