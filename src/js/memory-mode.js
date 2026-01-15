// MEMORY GAME MODE - זיכרון
function startMemoryMode() {
    currentMode = 'memory';
    initStage();
    hideScore();
    
    // Emoji pairs for memory game
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
    
    // Select 6 pairs (12 cards)
    const selectedEmojis = emojis.slice(0, 6);
    const cards = [...selectedEmojis, ...selectedEmojis]; // Duplicate for pairs
    
    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);
    
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    const cardObjects = [];
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 20,
        width: stage.width() - 100,
        text: '🎯 משחק הזיכרון 🎯',
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    const instructionText = new Konva.Text({
        x: 50,
        y: 60,
        width: stage.width() - 100,
        text: 'מצא את הזוגות!',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#333',
        align: 'center'
    });
    layer.add(instructionText);
    
    // Create card grid (4x3)
    const cols = 4;
    const rows = 3;
    const cardWidth = 120;
    const cardHeight = 140;
    const gap = 15;
    const gridWidth = cols * cardWidth + (cols - 1) * gap;
    const gridHeight = rows * cardHeight + (rows - 1) * gap;
    const startX = (stage.width() - gridWidth) / 2;
    const startY = 120;
    
    cards.forEach((emoji, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = startX + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);
        
        const cardGroup = new Konva.Group({
            x: x,
            y: y
        });
        
        // Card back (blue)
        const cardBack = new Konva.Rect({
            width: cardWidth,
            height: cardHeight,
            fill: '#3b82f6',
            stroke: '#1e40af',
            strokeWidth: 4,
            cornerRadius: 15,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 },
            shadowOpacity: 0.3
        });
        cardGroup.add(cardBack);
        
        // Question mark on back
        const questionMark = new Konva.Text({
            text: '?',
            fontSize: 60,
            fontFamily: 'Arial',
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
            strokeWidth: 4,
            cornerRadius: 15,
            visible: false
        });
        cardGroup.add(cardFront);
        
        const emojiText = new Konva.Text({
            text: emoji,
            fontSize: 70,
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
            
            if (flippedCards.length === 2) {
                canFlip = false;
                
                // Check for match
                setTimeout(() => {
                    if (flippedCards[0].emoji === flippedCards[1].emoji) {
                        // Match found!
                        flippedCards[0].isMatched = true;
                        flippedCards[1].isMatched = true;
                        
                        // Highlight matched cards
                        flippedCards[0].front.stroke('#10b981');
                        flippedCards[0].front.strokeWidth(6);
                        flippedCards[1].front.stroke('#10b981');
                        flippedCards[1].front.strokeWidth(6);
                        
                        layer.draw();
                        playWinSound();
                        matchedPairs++;
                        
                        // Check if game complete
                        if (matchedPairs === 6) {
                            setTimeout(() => {
                                layer.destroyChildren();
                                
                                const winText = new Konva.Text({
                                    x: 0,
                                    y: stage.height() / 2 - 40,
                                    width: stage.width(),
                                    text: '🎉 מעולה! מצאת את כל הזוגות! 🎉',
                                    fontSize: 40,
                                    fontFamily: 'Arial',
                                    fill: '#667eea',
                                    align: 'center',
                                    fontStyle: 'bold'
                                });
                                layer.add(winText);
                                layer.draw();
                                
                                playWinSound();
                                speak('מעולה מצאת את כל הזוגות');
                            }, 1000);
                        }
                        
                        flippedCards = [];
                        canFlip = true;
                    } else {
                        // No match - flip back
                        playErrorSound();
                        setTimeout(() => {
                            flipCard(flippedCards[0], false);
                            flipCard(flippedCards[1], false);
                            flippedCards = [];
                            canFlip = true;
                        }, 1000);
                    }
                }, 600);
            }
        });
        
        cardGroup.on('mouseenter', function() {
            if (!cardState.isMatched && canFlip) {
                cardGroup.to({
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 0.1
                });
            }
        });
        
        cardGroup.on('mouseleave', function() {
            cardGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            });
        });
        
        layer.add(cardGroup);
    });
    
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
    speak('משחק הזיכרון מצא את הזוגות');
}
