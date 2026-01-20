// Letter Hunt Mode - English and Hebrew letter/number identification
function startLetterHuntMode() {
    currentMode = 'letterhunt';
    initStage();
    
    // Game state
    let currentLanguage = 'hebrew'; // Start with Hebrew
    let currentRound = 0;
    let targetLetter = '';
    let options = [];
    
    // Hebrew letters (starting with first letters of לביא and אליה)
    const hebrewLetters = [
        'ל', 'א', // First letters of names
        'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
        'י', 'כ', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ',
        'ק', 'ר', 'ש', 'ת'
    ];
    
    // English letters (starting with first letters of Lavia and Elia)
    const englishLetters = [
        'L', 'E', // First letters of names
        'A', 'B', 'C', 'D', 'F', 'G', 'H', 'I',
        'J', 'K', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    
    // Numbers 0-20
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    
    // Create language toggle button
    const toggleBtn = new Konva.Group({
        x: stage.width() - 180,
        y: 20
    });
    
    const toggleBg = new Konva.Rect({
        width: 160,
        height: 60,
        fill: '#ec4899',
        cornerRadius: 15,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.3
    });
    
    const toggleText = new Konva.Text({
        width: 160,
        height: 60,
        text: currentLanguage === 'hebrew' ? '🔤 English' : '🔡 עברית',
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    
    toggleBtn.add(toggleBg, toggleText);
    layer.add(toggleBtn);
    
    // Toggle button interaction
    toggleBtn.on('click tap', () => {
        currentLanguage = currentLanguage === 'hebrew' ? 'english' : 'hebrew';
        toggleText.text(currentLanguage === 'hebrew' ? '🔤 English' : '🔡 עברית');
        playPopSound();
        startNewRound();
    });
    
    toggleBtn.on('mouseenter', () => {
        toggleBg.fill('#db2777');
        stage.container().style.cursor = 'pointer';
        layer.draw();
    });
    
    toggleBtn.on('mouseleave', () => {
        toggleBg.fill('#ec4899');
        stage.container().style.cursor = 'default';
        layer.draw();
    });
    
    // Create floating background shapes
    createFloatingShapes(layer, stage);
    
    function startNewRound() {
        // Clear previous round
        layer.find('.game-element').forEach(node => node.destroy());
        
        // Select target letter based on language
        let letterPool;
        if (currentLanguage === 'hebrew') {
            letterPool = hebrewLetters;
        } else if (currentLanguage === 'english') {
            letterPool = englishLetters;
        } else {
            letterPool = numbers;
        }
        
        // Prioritize first letters of names in early rounds
        if (currentRound < 4) {
            if (currentLanguage === 'hebrew') {
                targetLetter = currentRound % 2 === 0 ? 'ל' : 'א';
            } else if (currentLanguage === 'english') {
                targetLetter = currentRound % 2 === 0 ? 'L' : 'E';
            } else {
                targetLetter = letterPool[Math.floor(Math.random() * letterPool.length)];
            }
        } else {
            targetLetter = letterPool[Math.floor(Math.random() * letterPool.length)];
        }
        
        // Create options (3-4 random letters including the target)
        const numOptions = Math.random() > 0.5 ? 3 : 4;
        options = [targetLetter];
        
        while (options.length < numOptions) {
            const randomLetter = letterPool[Math.floor(Math.random() * letterPool.length)];
            if (!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        
        // Shuffle options
        options = shuffleArray(options);
        
        // Display target letter (huge size at top)
        const targetText = new Konva.Text({
            x: stage.width() / 2,
            y: 120,
            text: targetLetter,
            fontSize: 180,
            fontFamily: 'Arial',
            fill: '#667eea',
            fontStyle: 'bold',
            shadowColor: 'black',
            shadowBlur: 15,
            shadowOpacity: 0.3,
            name: 'game-element'
        });
        targetText.offsetX(targetText.width() / 2);
        layer.add(targetText);
        
        // Animate target letter
        bounceElement(targetText);
        glowElement(targetText);
        
        // Display instruction
        let instructionText;
        if (currentLanguage === 'hebrew') {
            instructionText = `מצא את האות: ${targetLetter}`;
        } else if (currentLanguage === 'english') {
            instructionText = `Find the letter: ${targetLetter}`;
        } else {
            instructionText = `מצא את המספר: ${targetLetter}`;
        }
        
        const instruction = new Konva.Text({
            x: stage.width() / 2,
            y: 320,
            text: instructionText,
            fontSize: 32,
            fontFamily: 'Arial',
            fill: '#764ba2',
            fontStyle: 'bold',
            name: 'game-element'
        });
        instruction.offsetX(instruction.width() / 2);
        layer.add(instruction);
        
        // Speak instruction
        speak(instructionText);
        
        // Display options
        const optionY = 400;
        const spacing = stage.width() / (options.length + 1);
        
        options.forEach((letter, index) => {
            const optionGroup = new Konva.Group({
                x: spacing * (index + 1),
                y: optionY,
                name: 'game-element'
            });
            
            const isCorrect = letter === targetLetter;
            
            // Option background
            const optionBg = new Konva.Rect({
                width: 120,
                height: 120,
                fill: isCorrect ? '#10b981' : '#f59e0b',
                cornerRadius: 25,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOpacity: 0.3,
                stroke: 'white',
                strokeWidth: 5
            });
            optionBg.offsetX(60);
            
            // Option text
            const optionText = new Konva.Text({
                width: 120,
                height: 120,
                text: letter,
                fontSize: 80,
                fontFamily: 'Arial',
                fill: 'white',
                align: 'center',
                verticalAlign: 'middle',
                fontStyle: 'bold'
            });
            optionText.offsetX(60);
            
            optionGroup.add(optionBg, optionText);
            layer.add(optionGroup);
            
            // Hover effect
            optionGroup.on('mouseenter', () => {
                optionBg.strokeWidth(8);
                optionBg.shadowBlur(15);
                stage.container().style.cursor = 'pointer';
                layer.draw();
            });
            
            optionGroup.on('mouseleave', () => {
                optionBg.strokeWidth(5);
                optionBg.shadowBlur(10);
                stage.container().style.cursor = 'default';
                layer.draw();
            });
            
            // Click handler
            optionGroup.on('click tap', () => {
                if (isCorrect) {
                    // Correct answer!
                    playWinSound();
                    updateScore(10);
                    
                    // Visual celebration
                    bounceElement(optionGroup);
                    glowElement(optionGroup);
                    createConfetti(layer, stage, optionGroup.x(), optionGroup.y());
                    createStarBurst(layer, stage, optionGroup.x(), optionGroup.y());
                    createSparkles(layer, stage, optionGroup.x(), optionGroup.y());
                    
                    // Positive reinforcement messages
                    const messages = [
                        'כל הכבוד! 🌟',
                        'מעולה! ⭐',
                        'יפה מאוד! 💫',
                        'אלוף! 🏆',
                        'נהדר! ✨',
                        'Perfect! 🎉',
                        'Excellent! 🌈',
                        'Amazing! 🎊'
                    ];
                    const message = messages[Math.floor(Math.random() * messages.length)];
                    speak(message);
                    
                    // Show success message
                    const successMsg = new Konva.Text({
                        x: stage.width() / 2,
                        y: stage.height() / 2,
                        text: message,
                        fontSize: 60,
                        fontFamily: 'Arial',
                        fill: '#10b981',
                        fontStyle: 'bold',
                        shadowColor: 'black',
                        shadowBlur: 10,
                        shadowOpacity: 0.5,
                        name: 'game-element'
                    });
                    successMsg.offsetX(successMsg.width() / 2);
                    successMsg.offsetY(successMsg.height() / 2);
                    layer.add(successMsg);
                    
                    // Animate and remove success message
                    successMsg.to({
                        scaleX: 1.5,
                        scaleY: 1.5,
                        opacity: 0,
                        duration: 1.5,
                        onFinish: () => {
                            successMsg.destroy();
                        }
                    });
                    
                    // Next round after delay
                    setTimeout(() => {
                        currentRound++;
                        startNewRound();
                    }, 2000);
                    
                } else {
                    // Wrong answer
                    playErrorSound();
                    shakeElement(optionGroup);
                    
                    const errorMsg = currentLanguage === 'hebrew' ? 'נסה שוב! 🤔' : 'Try again! 🤔';
                    speak(errorMsg);
                    
                    // Flash red
                    optionBg.fill('#ef4444');
                    layer.draw();
                    setTimeout(() => {
                        optionBg.fill('#f59e0b');
                        layer.draw();
                    }, 500);
                }
            });
        });
        
        layer.draw();
    }
    
    // Start first round
    startNewRound();
}
