// MEMORY GAME MODE - זיכרון
function startMemoryMode() {
    currentMode = 'memory';
    initStage();
    hideScore();
    
    // Stop any ongoing speech when starting
    stopSpeech();
    
    // Show level selection screen
    showLevelSelection();
}

function showLevelSelection() {
    layer.destroyChildren();
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 30,
        width: stage.width() - 100,
        text: '🎯 משחק הזיכרון 🎯',
        fontSize: 36,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    const subtitleText = new Konva.Text({
        x: 50,
        y: 80,
        width: stage.width() - 100,
        text: 'בחר רמת קושי:',
        fontSize: 24,
        fontFamily: 'Varela Round, Arial',
        fill: '#333',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(subtitleText);
    
    // Level buttons
    const levels = [
        { name: 'קל', emoji: '😊', pairs: 4, cols: 4, rows: 2, color: '#22c55e' },
        { name: 'בינוני', emoji: '🤔', pairs: 6, cols: 4, rows: 3, color: '#f59e0b' },
        { name: 'קשה', emoji: '😎', pairs: 8, cols: 4, rows: 4, color: '#ef4444' }
    ];
    
    const buttonWidth = Math.min(200, stage.width() - 100);
    const buttonHeight = 100;
    const buttonGap = 30;
    const startY = 150;
    
    levels.forEach((level, index) => {
        const x = (stage.width() - buttonWidth) / 2;
        const y = startY + index * (buttonHeight + buttonGap);
        
        const btnGroup = new Konva.Group({ x, y });
        
        const btn = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: level.color,
            stroke: '#fff',
            strokeWidth: 4,
            cornerRadius: 20,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 }
        });
        btnGroup.add(btn);
        
        const btnText = new Konva.Text({
            width: buttonWidth,
            height: buttonHeight,
            text: `${level.emoji} ${level.name}\n${level.pairs} זוגות`,
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        btnGroup.add(btnText);
        
        btnGroup.on('click tap', () => {
            playPopSound();
            showGameModeSelection(level);
        });
        
        btnGroup.on('mouseenter', () => {
            btn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
        });
        
        btnGroup.on('mouseleave', () => {
            btn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        layer.add(btnGroup);
    });
    
    layer.draw();
    speak('בחר רמת קושי');
}

function showGameModeSelection(level) {
    layer.destroyChildren();
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 30,
        width: stage.width() - 100,
        text: '🎯 בחר מצב משחק 🎯',
        fontSize: 36,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    const subtitleText = new Konva.Text({
        x: 50,
        y: 80,
        width: stage.width() - 100,
        text: `רמה: ${level.name} (${level.pairs} זוגות)`,
        fontSize: 20,
        fontFamily: 'Varela Round, Arial',
        fill: '#666',
        align: 'center'
    });
    layer.add(subtitleText);
    
    // Mode buttons
    const modes = [
        { name: 'שחקן יחיד', emoji: '👤', mode: 'single' },
        { name: 'שני שחקנים', emoji: '👥', mode: 'two-player' }
    ];
    
    const buttonWidth = Math.min(250, stage.width() - 100);
    const buttonHeight = 100;
    const buttonGap = 40;
    const startY = 180;
    
    modes.forEach((modeOption, index) => {
        const x = (stage.width() - buttonWidth) / 2;
        const y = startY + index * (buttonHeight + buttonGap);
        
        const btnGroup = new Konva.Group({ x, y });
        
        const btn = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: modeOption.mode === 'single' ? '#8b5cf6' : '#ec4899',
            stroke: '#fff',
            strokeWidth: 4,
            cornerRadius: 20,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 }
        });
        btnGroup.add(btn);
        
        const btnText = new Konva.Text({
            width: buttonWidth,
            height: buttonHeight,
            text: `${modeOption.emoji}\n${modeOption.name}`,
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        btnGroup.add(btnText);
        
        btnGroup.on('click tap', () => {
            playPopSound();
            startMemoryGame(level, modeOption.mode);
        });
        
        btnGroup.on('mouseenter', () => {
            btn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
        });
        
        btnGroup.on('mouseleave', () => {
            btn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        layer.add(btnGroup);
    });
    
    // Back button
    const backBtn = createBackButton(() => showLevelSelection());
    layer.add(backBtn);
    
    layer.draw();
    speak('בחר מצב משחק');
}

function createBackButton(onClick) {
    const btnGroup = new Konva.Group({
        x: 20,
        y: stage.height() - 80
    });
    
    const btn = new Konva.Rect({
        width: 120,
        height: 50,
        fill: '#94a3b8',
        stroke: '#64748b',
        strokeWidth: 3,
        cornerRadius: 10
    });
    btnGroup.add(btn);
    
    const btnText = new Konva.Text({
        width: 120,
        height: 50,
        text: '🔙 חזור',
        fontSize: 18,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    btnGroup.add(btnText);
    
    btnGroup.on('click tap', () => {
        playPopSound();
        onClick();
    });
    
    btnGroup.on('mouseenter', () => {
        btn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
    });
    
    btnGroup.on('mouseleave', () => {
        btn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    return btnGroup;
}


function startMemoryGame(level, mode) {
    layer.destroyChildren();
    
    // Emoji pairs for memory game
    const allEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄'];
    
    // Select pairs based on level
    const selectedEmojis = allEmojis.slice(0, level.pairs);
    const cards = [...selectedEmojis, ...selectedEmojis]; // Duplicate for pairs
    
    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);
    
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    const cardObjects = [];
    
    // Two-player mode state
    let currentTurn = 1; // 1 or 2
    let player1Matches = 0;
    let player2Matches = 0;
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 10,
        width: stage.width() - 100,
        text: mode === 'two-player' ? '🎯 משחק זיכרון - שני שחקנים 🎯' : '🎯 משחק הזיכרון 🎯',
        fontSize: 28,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    // Score display for two-player mode
    let turnIndicator, player1ScoreText, player2ScoreText;
    if (mode === 'two-player') {
        turnIndicator = new Konva.Text({
            x: 50,
            y: 45,
            width: stage.width() - 100,
            text: `תור: שחקן ${currentTurn}`,
            fontSize: 20,
            fontFamily: 'Varela Round, Arial',
            fill: currentTurn === 1 ? '#22c55e' : '#ec4899',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(turnIndicator);
        
        player1ScoreText = new Konva.Text({
            x: 20,
            y: 75,
            text: `👤 שחקן 1: ${player1Matches} זוגות`,
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: '#22c55e',
            fontStyle: 'bold'
        });
        layer.add(player1ScoreText);
        
        player2ScoreText = new Konva.Text({
            x: Math.max(stage.width() - 200, 20),
            y: 75,
            text: `👤 שחקן 2: ${player2Matches} זוגות`,
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: '#ec4899',
            fontStyle: 'bold',
            align: stage.width() < 400 ? 'left' : 'right'
        });
        layer.add(player2ScoreText);
    }
    
    // Create card grid - responsive sizing
    const cols = level.cols;
    const rows = level.rows;
    const availableWidth = stage.width() - 40; // 20px padding on each side
    const availableHeight = stage.height() - (mode === 'two-player' ? 220 : 180); // Space for UI
    
    // Calculate card size based on available space
    const maxCardWidthByWidth = (availableWidth - (cols - 1) * 10) / cols;
    const maxCardHeightByHeight = (availableHeight - (rows - 1) * 10) / rows;
    const maxCardWidth = Math.min(maxCardWidthByWidth, maxCardHeightByHeight / 1.2);
    
    const cardWidth = Math.max(60, Math.min(100, maxCardWidth)); // Min 60px, max 100px
    const cardHeight = cardWidth * 1.2;
    const gap = Math.max(5, Math.min(10, cardWidth * 0.1)); // Responsive gap
    
    const gridWidth = cols * cardWidth + (cols - 1) * gap;
    const startX = (stage.width() - gridWidth) / 2;
    const startY = mode === 'two-player' ? 110 : 80;
    
    cards.forEach((emoji, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = startX + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);
        
        const cardGroup = new Konva.Group({ x, y });
        
        // Card back (gradient blue)
        const cardBack = new Konva.Rect({
            width: cardWidth,
            height: cardHeight,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 0, y: cardHeight },
            fillLinearGradientColorStops: [0, '#3b82f6', 1, '#1e40af'],
            stroke: '#1e3a8a',
            strokeWidth: 3,
            cornerRadius: 12,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffset: { x: 0, y: 4 }
        });
        cardGroup.add(cardBack);
        
        // Question mark on back
        const questionMark = new Konva.Text({
            text: '?',
            fontSize: cardWidth * 0.5,
            fontFamily: 'Varela Round, Arial',
            fontStyle: 'bold',
            fill: 'white',
            width: cardWidth,
            height: cardHeight,
            align: 'center',
            verticalAlign: 'middle'
        });
        cardGroup.add(questionMark);
        
        // Card front (emoji) - hidden initially
        const cardFront = new Konva.Rect({
            width: cardWidth,
            height: cardHeight,
            fill: 'white',
            stroke: '#10b981',
            strokeWidth: 3,
            cornerRadius: 12,
            visible: false,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 6,
            shadowOffset: { x: 0, y: 3 }
        });
        cardGroup.add(cardFront);
        
        const emojiText = new Konva.Text({
            text: emoji,
            fontSize: cardWidth * 0.6,
            fontFamily: 'Arial',
            width: cardWidth,
            height: cardHeight,
            align: 'center',
            verticalAlign: 'middle',
            visible: false
        });
        cardGroup.add(emojiText);
        
        // Card state
        const cardState = {
            group: cardGroup,
            back: cardBack,
            front: cardFront,
            emoji: emoji,
            emojiText: emojiText,
            questionMark: questionMark,
            isFlipped: false,
            isMatched: false,
            index: index
        };
        
        cardObjects.push(cardState);
        
        // Click handler
        cardGroup.on('click tap', function() {
            if (!canFlip || cardState.isFlipped || cardState.isMatched) return;
            
            // Flip card
            flipCard(cardState, true);
            flippedCards.push(cardState);
            playPopSound();
            
            if (flippedCards.length === 2) {
                canFlip = false;
                
                // Check for match
                setTimeout(() => {
                    if (flippedCards[0].emoji === flippedCards[1].emoji) {
                        // Match found!
                        flippedCards[0].isMatched = true;
                        flippedCards[1].isMatched = true;
                        
                        // Highlight matched cards
                        const highlightColor = mode === 'two-player' 
                            ? (currentTurn === 1 ? '#22c55e' : '#ec4899')
                            : '#10b981';
                        
                        flippedCards[0].front.stroke(highlightColor);
                        flippedCards[0].front.strokeWidth(5);
                        flippedCards[1].front.stroke(highlightColor);
                        flippedCards[1].front.strokeWidth(5);
                        
                        layer.draw();
                        playWinSound();
                        matchedPairs++;
                        
                        // Update scores
                        if (mode === 'two-player') {
                            if (currentTurn === 1) {
                                player1Matches++;
                                player1ScoreText.text(`👤 שחקן 1: ${player1Matches} זוגות`);
                            } else {
                                player2Matches++;
                                player2ScoreText.text(`👤 שחקן 2: ${player2Matches} זוגות`);
                            }
                            speak(`שחקן ${currentTurn} מצא זוג`);
                        } else {
                            addPoints(10);
                        }
                        
                        // Check if game complete
                        if (matchedPairs === level.pairs) {
                            setTimeout(() => {
                                showGameResults(mode, player1Matches, player2Matches, level.pairs);
                            }, 1000);
                        }
                        
                        flippedCards = [];
                        canFlip = true;
                    } else {
                        // No match - flip back and switch turn
                        playErrorSound();
                        setTimeout(() => {
                            flipCard(flippedCards[0], false);
                            flipCard(flippedCards[1], false);
                            flippedCards = [];
                            
                            // Switch turn in two-player mode
                            if (mode === 'two-player') {
                                currentTurn = currentTurn === 1 ? 2 : 1;
                                turnIndicator.text(`תור: שחקן ${currentTurn}`);
                                turnIndicator.fill(currentTurn === 1 ? '#22c55e' : '#ec4899');
                                speak(`תור שחקן ${currentTurn}`);
                                layer.draw();
                            }
                            
                            canFlip = true;
                        }, 1000);
                    }
                }, 600);
            }
        });
        
        cardGroup.on('mouseenter', function() {
            if (!cardState.isMatched && canFlip) {
                cardGroup.to({ scaleX: 1.08, scaleY: 1.08, duration: 0.1 });
            }
        });
        
        cardGroup.on('mouseleave', function() {
            cardGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        layer.add(cardGroup);
    });
    
    // Back button
    const backBtn = createBackButton(() => showGameModeSelection(level));
    layer.add(backBtn);
    
    function flipCard(cardState, show) {
        if (show) {
            cardState.back.visible(false);
            cardState.questionMark.visible(false);
            cardState.front.visible(true);
            cardState.emojiText.visible(true);
            cardState.isFlipped = true;
        } else {
            cardState.back.visible(true);
            cardState.questionMark.visible(true);
            cardState.front.visible(false);
            cardState.emojiText.visible(false);
            cardState.isFlipped = false;
        }
        layer.draw();
    }
    
    layer.draw();
    
    if (mode === 'two-player') {
        speak('משחק זיכרון לשני שחקנים תור שחקן 1');
    } else {
        speak('משחק הזיכרון מצא את הזוגות');
    }
}

function showGameResults(mode, player1Matches, player2Matches, totalPairs) {
    layer.destroyChildren();
    
    let resultText = '';
    let resultColor = '#667eea';
    
    if (mode === 'two-player') {
        if (player1Matches > player2Matches) {
            resultText = `🎉 שחקן 1 ניצח! 🎉\n\n👤 שחקן 1: ${player1Matches} זוגות\n👤 שחקן 2: ${player2Matches} זוגות`;
            resultColor = '#22c55e';
            speak(getCorrectMessage() + ' שחקן 1 ניצח');
        } else if (player2Matches > player1Matches) {
            resultText = `🎉 שחקן 2 ניצח! 🎉\n\n👤 שחקן 1: ${player1Matches} זוגות\n👤 שחקן 2: ${player2Matches} זוגות`;
            resultColor = '#ec4899';
            speak(getCorrectMessage() + ' שחקן 2 ניצח');
        } else {
            resultText = `🤝 תיקו! 🤝\n\nשני השחקנים מצאו ${player1Matches} זוגות`;
            resultColor = '#f59e0b';
            speak('תיקו שני השחקנים שיחקו מצוין');
        }
    } else {
        resultText = `🎉 מעולה!\n\nמצאת את כל ${totalPairs} הזוגות! 🎉`;
        speak(getCorrectMessage() + ' מצאת את כל הזוגות');
    }
    
    const winText = new Konva.Text({
        x: 50,
        y: stage.height() / 2 - 100,
        width: stage.width() - 100,
        text: resultText,
        fontSize: 32,
        fontFamily: 'Varela Round, Arial',
        fill: resultColor,
        align: 'center',
        fontStyle: 'bold',
        lineHeight: 1.5
    });
    layer.add(winText);
    
    // Play again button
    const btnWidth = Math.min(200, stage.width() - 100);
    const playAgainBtn = new Konva.Group({
        x: stage.width() / 2 - btnWidth / 2,
        y: stage.height() / 2 + 80
    });
    
    const btn = new Konva.Rect({
        width: btnWidth,
        height: 60,
        fill: '#8b5cf6',
        stroke: '#fff',
        strokeWidth: 3,
        cornerRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 5 }
    });
    playAgainBtn.add(btn);
    
    const btnText = new Konva.Text({
        width: btnWidth,
        height: 60,
        text: '🔄 שחק שוב',
        fontSize: 22,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    playAgainBtn.add(btnText);
    
    playAgainBtn.on('click tap', () => {
        playPopSound();
        showLevelSelection();
    });
    
    playAgainBtn.on('mouseenter', () => {
        btn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
    });
    
    playAgainBtn.on('mouseleave', () => {
        btn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    layer.add(playAgainBtn);
    layer.draw();
    playWinSound();
}
