// ENGLISH LEARNING MODE - אנגלית
function startQuizMode() {
    currentMode = 'quiz';
    initStage();
    hideScore();
    
    // Expanded English words with emoji representations (80+ words)
    const words = [
        // Animals
        { word: 'CAT', emoji: '🐱', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'DOG', emoji: '🐶', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'MOUSE', emoji: '🐭', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'RABBIT', emoji: '🐰', options: ['🐱', '🐶', '🐭', '🐰'] },
        { word: 'FISH', emoji: '🐟', options: ['🐟', '🐠', '🦈', '🐙'] },
        { word: 'SHARK', emoji: '🦈', options: ['🐟', '🐠', '🦈', '🐙'] },
        { word: 'BIRD', emoji: '🐦', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'DUCK', emoji: '🦆', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'OWL', emoji: '🦉', options: ['🐦', '🦅', '🦆', '🦉'] },
        { word: 'BEE', emoji: '🐝', options: ['🐝', '🦋', '🐞', '🐛'] },
        { word: 'BUTTERFLY', emoji: '🦋', options: ['🐝', '🦋', '🐞', '🐛'] },
        { word: 'LION', emoji: '🦁', options: ['🦁', '🐯', '🐻', '🐼'] },
        { word: 'TIGER', emoji: '🐯', options: ['🦁', '🐯', '🐻', '🐼'] },
        { word: 'BEAR', emoji: '🐻', options: ['🦁', '🐯', '🐻', '🐼'] },
        { word: 'PANDA', emoji: '🐼', options: ['🦁', '🐯', '🐻', '🐼'] },
        { word: 'ELEPHANT', emoji: '🐘', options: ['🐘', '🦒', '🦏', '🦛'] },
        { word: 'GIRAFFE', emoji: '🦒', options: ['🐘', '🦒', '🦏', '🦛'] },
        { word: 'MONKEY', emoji: '🐵', options: ['🐵', '🦍', '🐨', '🦘'] },
        { word: 'KOALA', emoji: '🐨', options: ['🐵', '🦍', '🐨', '🦘'] },
        { word: 'FROG', emoji: '🐸', options: ['🐸', '🐢', '🦎', '🐍'] },
        { word: 'TURTLE', emoji: '🐢', options: ['🐸', '🐢', '🦎', '🐍'] },
        
        // Nature
        { word: 'TREE', emoji: '🌳', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'FLOWER', emoji: '🌸', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'CACTUS', emoji: '🌵', options: ['🌳', '🌸', '🌵', '🌻'] },
        { word: 'SUN', emoji: '☀️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'MOON', emoji: '🌙', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'STAR', emoji: '⭐', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'CLOUD', emoji: '☁️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'FIRE', emoji: '🔥', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'WATER', emoji: '💧', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'SNOW', emoji: '❄️', options: ['🔥', '💧', '🌊', '❄️'] },
        { word: 'RAINBOW', emoji: '🌈', options: ['🌈', '⚡', '🌪️', '🌤️'] },
        { word: 'LIGHTNING', emoji: '⚡', options: ['🌈', '⚡', '🌪️', '🌤️'] },
        
        // Food
        { word: 'APPLE', emoji: '🍎', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'BANANA', emoji: '🍌', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'ORANGE', emoji: '🍊', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'GRAPES', emoji: '🍇', options: ['🍎', '🍌', '🍊', '🍇'] },
        { word: 'PIZZA', emoji: '🍕', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'BURGER', emoji: '🍔', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'CAKE', emoji: '🍰', options: ['🍕', '🍔', '🌭', '🍰'] },
        { word: 'BREAD', emoji: '🍞', options: ['🍞', '🥐', '🥖', '🥯'] },
        { word: 'CHEESE', emoji: '🧀', options: ['🧀', '🥛', '🍦', '🥤'] },
        { word: 'MILK', emoji: '🥛', options: ['🧀', '🥛', '🍦', '🥤'] },
        { word: 'ICE CREAM', emoji: '🍦', options: ['🧀', '🥛', '🍦', '🥤'] },
        { word: 'COOKIE', emoji: '🍪', options: ['🍪', '🍩', '🧁', '🍫'] },
        { word: 'DONUT', emoji: '🍩', options: ['🍪', '🍩', '🧁', '🍫'] },
        { word: 'CHOCOLATE', emoji: '🍫', options: ['🍪', '🍩', '🧁', '🍫'] },
        
        // Transportation
        { word: 'CAR', emoji: '🚗', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'BUS', emoji: '🚌', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'BIKE', emoji: '🚲', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'PLANE', emoji: '✈️', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'TRAIN', emoji: '🚂', options: ['🚂', '🚁', '🚢', '🚀'] },
        { word: 'HELICOPTER', emoji: '🚁', options: ['🚂', '🚁', '🚢', '🚀'] },
        { word: 'SHIP', emoji: '🚢', options: ['🚂', '🚁', '🚢', '🚀'] },
        { word: 'ROCKET', emoji: '🚀', options: ['🚂', '🚁', '🚢', '🚀'] },
        
        // Buildings
        { word: 'HOUSE', emoji: '🏠', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'SCHOOL', emoji: '🏫', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'HOSPITAL', emoji: '🏥', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'STORE', emoji: '🏪', options: ['🏠', '🏫', '🏥', '🏪'] },
        { word: 'CASTLE', emoji: '🏰', options: ['🏰', '🏛️', '🗼', '🌉'] },
        
        // Sports & Activities
        { word: 'BALL', emoji: '⚽', options: ['⚽', '🏀', '🎾', '⚾'] },
        { word: 'BASKETBALL', emoji: '🏀', options: ['⚽', '🏀', '🎾', '⚾'] },
        { word: 'TENNIS', emoji: '🎾', options: ['⚽', '🏀', '🎾', '⚾'] },
        { word: 'BASEBALL', emoji: '⚾', options: ['⚽', '🏀', '🎾', '⚾'] },
        
        // Objects
        { word: 'HEART', emoji: '❤️', options: ['❤️', '💙', '💚', '💛'] },
        { word: 'BOOK', emoji: '📚', options: ['📚', '✏️', '📝', '🖍️'] },
        { word: 'PENCIL', emoji: '✏️', options: ['📚', '✏️', '📝', '🖍️'] },
        { word: 'GIFT', emoji: '🎁', options: ['🎁', '🎈', '🎉', '🎊'] },
        { word: 'BALLOON', emoji: '🎈', options: ['🎁', '🎈', '🎉', '🎊'] },
        { word: 'CROWN', emoji: '👑', options: ['👑', '💎', '🔑', '🎩'] },
        { word: 'KEY', emoji: '🔑', options: ['👑', '💎', '🔑', '🎩'] },
        { word: 'CLOCK', emoji: '⏰', options: ['⏰', '⌚', '⏱️', '⏳'] },
        { word: 'WATCH', emoji: '⌚', options: ['⏰', '⌚', '⏱️', '⏳'] },
        { word: 'CAMERA', emoji: '📷', options: ['📷', '📱', '💻', '🖥️'] },
        { word: 'PHONE', emoji: '📱', options: ['📷', '📱', '💻', '🖥️'] },
        { word: 'COMPUTER', emoji: '💻', options: ['📷', '📱', '💻', '🖥️'] },
        { word: 'UMBRELLA', emoji: '☂️', options: ['☂️', '👓', '👒', '🎒'] },
        { word: 'GLASSES', emoji: '👓', options: ['☂️', '👓', '👒', '🎒'] },
        { word: 'HAT', emoji: '👒', options: ['☂️', '👓', '👒', '🎒'] },
        { word: 'BACKPACK', emoji: '🎒', options: ['☂️', '👓', '👒', '🎒'] }
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
                // Prevent multiple clicks while processing
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (index === correctIndex) {
                    // Correct answer
                    bg.fill('#4ade80');
                    layer.draw();
                    playWinSound();
                    speak(getCorrectMessage());
                    addPoints(10); // Award 10 points
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
                        isProcessingAnswer = false; // Reset after wrong answer
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
