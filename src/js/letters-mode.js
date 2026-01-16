// HEBREW LETTERS MODE - אותיות
function startLettersMode() {
    currentMode = 'letters';
    initStage();
    hideScore();
    
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
    
    function showLetter() {
        layer.destroyChildren();
        
        if (currentLetter >= selectedLetters.length) {
            // Session complete
            const finalText = new Konva.Text({
                x: 0,
                y: stage.height() / 2 - 80,
                width: stage.width(),
                text: '🎉 כל הכבוד 🎉',
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
                text: `ענית נכון על ${correctAnswers} מתוך ${selectedLetters.length} אותיות`,
                fontSize: 30,
                fontFamily: 'Arial',
                fill: '#764ba2',
                align: 'center'
            });
            layer.add(scoreText);
            
            layer.draw();
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedLetters.length} אותיות`);
            return;
        }
        
        const letterData = selectedLetters[currentLetter];
        
        // Instruction text
        const instructionText = new Konva.Text({
            x: 50,
            y: 40,
            width: stage.width() - 100,
            text: 'מצא את התמונה שמתחילה באות',
            fontSize: 28,
            fontFamily: 'Arial',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        // Hebrew letter - extra large
        const letterText = new Konva.Text({
            x: 50,
            y: 90,
            width: stage.width() - 100,
            text: letterData.letter,
            fontSize: 120,
            fontFamily: 'Arial',
            fill: '#f59e0b',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(letterText);
        
        // Word below letter
        const wordText = new Konva.Text({
            x: 50,
            y: 200,
            width: stage.width() - 100,
            text: letterData.word,
            fontSize: 40,
            fontFamily: 'Arial',
            fill: '#666',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(wordText);
        
        // Progress indicator
        const progressText = new Konva.Text({
            x: 50,
            y: 10,
            width: stage.width() - 100,
            text: `אות ${currentLetter + 1} מתוך ${selectedLetters.length}`,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#666',
            align: 'center'
        });
        layer.add(progressText);
        
        // Find correct answer index
        const correctIndex = letterData.options.indexOf(letterData.emoji);
        
        // Options grid (2x2)
        const gridSize = 2;
        const cellWidth = 180;
        const cellHeight = 180;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 270;
        
        letterData.options.forEach((emoji, index) => {
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
                stroke: '#f59e0b',
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
                        currentLetter++;
                        showLetter();
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
        
        // Speak the letter and word
        setTimeout(() => speak(`האות ${letterData.letter} ${letterData.word}`), 500);
    }
    
    showLetter();
}
