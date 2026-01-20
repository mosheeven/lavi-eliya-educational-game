// Letter Hunt Mode - English and Hebrew letter/number identification
function startLetterHuntMode() {
    currentMode = 'letterhunt';
    initStage();
    showScore(); // Show score display
    
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
    
    // Create language toggle buttons container
    const toggleContainer = new Konva.Group({
        x: stage.width() / 2,
        y: 20
    });
    
    const buttonWidth = 110;
    const buttonHeight = 55;
    const buttonGap = 10;
    const totalWidth = (buttonWidth * 3) + (buttonGap * 2);
    
    // Hebrew button
    const hebrewBtn = createLanguageButton(-totalWidth/2, 0, buttonWidth, buttonHeight, '🔡 עברית', 'hebrew');
    
    // English button
    const englishBtn = createLanguageButton(-totalWidth/2 + buttonWidth + buttonGap, 0, buttonWidth, buttonHeight, '🔤 English', 'english');
    
    // Numbers button
    const numbersBtn = createLanguageButton(-totalWidth/2 + (buttonWidth + buttonGap) * 2, 0, buttonWidth, buttonHeight, '🔢 מספרים', 'numbers');
    
    toggleContainer.add(hebrewBtn, englishBtn, numbersBtn);
    layer.add(toggleContainer);
    
    // Update button states
    function updateButtonStates() {
        [hebrewBtn, englishBtn, numbersBtn].forEach(btn => {
            const bg = btn.findOne('Rect');
            const lang = btn.getAttr('language');
            if (lang === currentLanguage) {
                bg.fill('#10b981');
                bg.strokeWidth(4);
                bg.stroke('#ffffff');
            } else {
                bg.fill('#6b7280');
                bg.strokeWidth(0);
                bg.stroke(null);
            }
        });
        layer.draw();
    }
    
    function createLanguageButton(x, y, width, height, text, language) {
        const btn = new Konva.Group({
            x: x,
            y: y
        });
        btn.setAttr('language', language);
        
        const bg = new Konva.Rect({
            width: width,
            height: height,
            fill: language === currentLanguage ? '#10b981' : '#6b7280',
            cornerRadius: 12,
            shadowColor: 'black',
            shadowBlur: 8,
            shadowOpacity: 0.3,
            stroke: language === currentLanguage ? '#ffffff' : null,
            strokeWidth: language === currentLanguage ? 4 : 0
        });
        
        const label = new Konva.Text({
            width: width,
            height: height,
            text: text,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        
        btn.add(bg, label);
        
        // Button interaction
        btn.on('click tap', () => {
            if (currentLanguage !== language) {
                currentLanguage = language;
                currentRound = 0; // Reset round when switching language
                updateButtonStates();
                playPopSound();
                startNewRound();
            }
        });
        
        btn.on('mouseenter', () => {
            if (currentLanguage !== language) {
                bg.opacity(0.8);
            }
            bg.shadowBlur(12);
            stage.container().style.cursor = 'pointer';
            layer.draw();
        });
        
        btn.on('mouseleave', () => {
            bg.opacity(1);
            bg.shadowBlur(8);
            stage.container().style.cursor = 'default';
            layer.draw();
        });
        
        return btn;
    }
    
    // Initialize button states
    updateButtonStates();
    
    // Create floating background shapes
    createFloatingShapes(layer, stage);
    
    function startNewRound() {
        // Clear previous round
        layer.find('.game-element').forEach(node => node.destroy());
        
        // Select target letter based on language
        let letterPool;
        let languageName;
        if (currentLanguage === 'hebrew') {
            letterPool = hebrewLetters;
            languageName = 'עברית';
        } else if (currentLanguage === 'english') {
            letterPool = englishLetters;
            languageName = 'English';
        } else {
            letterPool = numbers;
            languageName = 'מספרים';
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
        
        // Display target letter (huge size at top with animation)
        const targetText = new Konva.Text({
            x: stage.width() / 2,
            y: 120,
            text: targetLetter,
            fontSize: 200,
            fontFamily: 'Arial',
            fill: '#667eea',
            fontStyle: 'bold',
            shadowColor: 'black',
            shadowBlur: 20,
            shadowOpacity: 0.4,
            name: 'game-element',
            opacity: 0
        });
        targetText.offsetX(targetText.width() / 2);
        layer.add(targetText);
        
        // Animate target letter entrance
        targetText.to({
            opacity: 1,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 0.5,
            easing: Konva.Easings.BackEaseOut,
            onFinish: () => {
                targetText.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.3
                });
            }
        });
        
        // Continuous floating animation for target letter
        const floatAnim = new Konva.Animation((frame) => {
            const time = frame.time / 1000;
            targetText.y(120 + Math.sin(time * 2) * 15);
            targetText.rotation(Math.sin(time * 1.5) * 5);
        }, layer);
        floatAnim.start();
        
        // Pulsing glow effect
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
            y: 340,
            text: instructionText,
            fontSize: 36,
            fontFamily: 'Arial',
            fill: '#764ba2',
            fontStyle: 'bold',
            name: 'game-element',
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 5,
            opacity: 0
        });
        instruction.offsetX(instruction.width() / 2);
        layer.add(instruction);
        
        // Fade in instruction
        instruction.to({
            opacity: 1,
            duration: 0.4
        });
        
        // Speak instruction
        speak(instructionText);
        
        // Display options with staggered animation
        const optionY = 420;
        const spacing = stage.width() / (options.length + 1);
        
        options.forEach((letter, index) => {
            setTimeout(() => {
                createOptionButton(letter, spacing * (index + 1), optionY, index);
            }, index * 150);
        });
        
        layer.draw();
    }
    
    function createOptionButton(letter, x, y, index) {
        const isCorrect = letter === targetLetter;
        
        const optionGroup = new Konva.Group({
            x: x,
            y: y,
            name: 'game-element',
            opacity: 0,
            scaleX: 0.5,
            scaleY: 0.5
        });
        
        // Option background with gradient effect
        const optionBg = new Konva.Rect({
            width: 130,
            height: 130,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 130, y: 130 },
            fillLinearGradientColorStops: [0, '#f59e0b', 1, '#d97706'],
            cornerRadius: 25,
            shadowColor: 'black',
            shadowBlur: 12,
            shadowOpacity: 0.3,
            stroke: 'white',
            strokeWidth: 5
        });
        optionBg.offsetX(65);
        
        // Option text
        const optionText = new Konva.Text({
            width: 130,
            height: 130,
            text: letter,
            fontSize: 90,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold',
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 5
        });
        optionText.offsetX(65);
        
        optionGroup.add(optionBg, optionText);
        layer.add(optionGroup);
        
        // Entrance animation
        optionGroup.to({
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 0.4,
            easing: Konva.Easings.BackEaseOut
        });
        
        // Continuous floating animation with more movement
        const floatAnim = new Konva.Animation((frame) => {
            const time = frame.time / 1000;
            const offset = index * 0.7; // Stagger the animation
            optionGroup.y(y + Math.sin(time * 2 + offset) * 15);
            optionGroup.x(x + Math.cos(time * 1.5 + offset) * 8);
            optionGroup.rotation(Math.sin(time * 1.2 + offset) * 3);
        }, layer);
        floatAnim.start();
        
        // Hover effect
        optionGroup.on('mouseenter', () => {
            optionBg.strokeWidth(8);
            optionBg.shadowBlur(20);
            optionGroup.to({
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.2
            });
            stage.container().style.cursor = 'pointer';
            layer.draw();
        });
        
        optionGroup.on('mouseleave', () => {
            optionBg.strokeWidth(5);
            optionBg.shadowBlur(12);
            optionGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.2
            });
            stage.container().style.cursor = 'default';
            layer.draw();
        });
        
        // Click handler
        optionGroup.on('click tap', () => {
            // Disable all options during animation
            layer.find('.game-element').forEach(node => {
                if (node.getType() === 'Group') {
                    node.off('click tap');
                }
            });
            
            if (isCorrect) {
                // Correct answer!
                playWinSound();
                updateScore(10);
                
                // Visual celebration
                optionGroup.to({
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 0.3,
                    easing: Konva.Easings.BackEaseOut
                });
                
                createConfetti(layer, stage, optionGroup.x(), optionGroup.y());
                createStarBurst(layer, stage, optionGroup.x(), optionGroup.y());
                createSparkles(layer, stage, optionGroup.x(), optionGroup.y());
                
                // Use global feedback function
                const message = getCorrectMessage();
                speak(message);
                
                // Show success message with emoji
                const successEmojis = ['🌟', '⭐', '💫', '🏆', '✨', '🎉', '🌈', '🎊', '💪', '🌠'];
                const emoji = successEmojis[Math.floor(Math.random() * successEmojis.length)];
                const successMsg = new Konva.Text({
                    x: stage.width() / 2,
                    y: stage.height() / 2 - 50,
                    text: `${message} ${emoji}`,
                    fontSize: 70,
                    fontFamily: 'Arial',
                    fill: '#10b981',
                    fontStyle: 'bold',
                    shadowColor: 'black',
                    shadowBlur: 15,
                    shadowOpacity: 0.5,
                    name: 'game-element',
                    opacity: 0
                });
                successMsg.offsetX(successMsg.width() / 2);
                successMsg.offsetY(successMsg.height() / 2);
                layer.add(successMsg);
                
                // Animate success message
                successMsg.to({
                    opacity: 1,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 0.3,
                    onFinish: () => {
                        successMsg.to({
                            scaleX: 1.5,
                            scaleY: 1.5,
                            opacity: 0,
                            y: successMsg.y() - 50,
                            duration: 1.2,
                            onFinish: () => {
                                successMsg.destroy();
                            }
                        });
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
                
                // Use global feedback function
                const errorMsg = getWrongMessage();
                speak(errorMsg);
                
                // Flash red
                optionBg.fillLinearGradientColorStops([0, '#ef4444', 1, '#dc2626']);
                layer.draw();
                
                setTimeout(() => {
                    optionBg.fillLinearGradientColorStops([0, '#f59e0b', 1, '#d97706']);
                    layer.draw();
                    
                    // Re-enable click handlers
                    layer.find('.game-element').forEach(node => {
                        if (node.getType() === 'Group' && node !== optionGroup) {
                            const letter = node.findOne('Text').text();
                            const isCorrectOption = letter === targetLetter;
                            node.on('click tap', () => {
                                createClickHandler(node, letter, isCorrectOption);
                            });
                        }
                    });
                }, 600);
            }
        });
    }
    
    function createClickHandler(group, letter, isCorrect) {
        // This is a helper to avoid code duplication
        group.fire('click');
    }
    
    // Start first round
    startNewRound();
}
