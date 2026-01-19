// SORTING MODE
function startSortingMode() {
    currentMode = 'sorting';
    initStage();
    hideScore();
    
    // Stop any ongoing speech when starting
    stopSpeech();
    
    let isProcessingDrop = false; // Prevent multiple simultaneous drops
    let isInitializing = true; // Prevent sounds during setup
    
    const categories = [
        { name: 'דינוזאורים', emoji: '🦕', items: ['🦕', '🦖', '🦴'], color: '#10b981' },
        { name: 'חלל', emoji: '🚀', items: ['🚀', '🌙', '⭐', '🪐'], color: '#3b82f6' },
        { name: 'מספרים', emoji: '🔢', items: ['1️⃣', '2️⃣', '3️⃣'], color: '#f59e0b' },
        { name: 'אנגלית', emoji: '🔤', items: ['🅰️', '🅱️', '🆎'], color: '#ec4899' }
    ];
    
    const basketWidth = stage.width() / 4;
    const basketHeight = 140;
    const basketY = stage.height() - basketHeight - 20;
    
    // Create colorful baskets with better design
    categories.forEach((cat, index) => {
        const x = index * basketWidth;
        const centerX = x + basketWidth / 2;
        
        // Basket shadow
        const shadow = new Konva.Rect({
            x: x + 15,
            y: basketY + 5,
            width: basketWidth - 30,
            height: basketHeight - 10,
            fill: 'rgba(0, 0, 0, 0.15)',
            cornerRadius: 20,
            blur: 10
        });
        layer.add(shadow);
        
        // Basket background with gradient effect
        const basket = new Konva.Rect({
            x: x + 15,
            y: basketY,
            width: basketWidth - 30,
            height: basketHeight - 10,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 0, y: basketHeight - 10 },
            fillLinearGradientColorStops: [0, cat.color, 1, cat.color + 'dd'],
            stroke: 'white',
            strokeWidth: 4,
            cornerRadius: 20,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 },
            name: cat.name
        });
        layer.add(basket);
        
        // Inner glow effect
        const innerGlow = new Konva.Rect({
            x: x + 20,
            y: basketY + 5,
            width: basketWidth - 40,
            height: basketHeight - 20,
            stroke: 'rgba(255, 255, 255, 0.5)',
            strokeWidth: 2,
            cornerRadius: 18
        });
        layer.add(innerGlow);
        
        // Large emoji icon
        const emojiIcon = new Konva.Text({
            x: x + 15,
            y: basketY + 15,
            width: basketWidth - 30,
            text: cat.emoji,
            fontSize: 50,
            fontFamily: 'Arial',
            align: 'center'
        });
        layer.add(emojiIcon);
        
        // Category label with white background
        const labelBg = new Konva.Rect({
            x: centerX - 60,
            y: basketY + basketHeight - 50,
            width: 120,
            height: 35,
            fill: 'white',
            cornerRadius: 10,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 }
        });
        layer.add(labelBg);
        
        const label = new Konva.Text({
            x: centerX - 60,
            y: basketY + basketHeight - 45,
            width: 120,
            text: cat.name,
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fontStyle: 'bold',
            fill: cat.color,
            align: 'center'
        });
        layer.add(label);
    });
    
    // Create draggable items with improved design
    const allItems = categories.flatMap(cat => 
        cat.items.map(item => ({ emoji: item, category: cat.name, color: cat.color }))
    );
    
    // Shuffle items using Fisher-Yates algorithm
    const shuffledItems = shuffleArray(allItems);
    
    const itemsPerRow = 4;
    const itemSpacing = Math.min(140, stage.width() / (itemsPerRow + 1));
    const startX = (stage.width() - (itemsPerRow - 1) * itemSpacing) / 2;
    
    shuffledItems.forEach((item, index) => {
        const col = index % itemsPerRow;
        const row = Math.floor(index / itemsPerRow);
        const x = startX + col * itemSpacing;
        const y = 60 + row * 110;
        
        const itemGroup = new Konva.Group({
            x: x,
            y: y,
            draggable: true
        });
        
        // Shadow for depth
        const shadowCircle = new Konva.Circle({
            radius: 48,
            fill: 'rgba(0, 0, 0, 0.2)',
            offsetY: -3,
            blur: 8
        });
        itemGroup.add(shadowCircle);
        
        // Colorful background circle
        const bg = new Konva.Circle({
            radius: 45,
            fillLinearGradientStartPoint: { x: -45, y: -45 },
            fillLinearGradientEndPoint: { x: 45, y: 45 },
            fillLinearGradientColorStops: [0, 'white', 1, '#f0f0f0'],
            stroke: item.color,
            strokeWidth: 5,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 3 }
        });
        itemGroup.add(bg);
        
        // White inner circle for contrast
        const innerCircle = new Konva.Circle({
            radius: 38,
            fill: 'white'
        });
        itemGroup.add(innerCircle);
        
        // Emoji
        const text = new Konva.Text({
            text: item.emoji,
            fontSize: 55,
            fontFamily: 'Arial',
            width: 76,
            height: 76,
            x: -38,
            y: -38,
            align: 'center',
            verticalAlign: 'middle'
        });
        itemGroup.add(text);
        
        // Hover and drag effects
        itemGroup.on('mouseenter', function() {
            document.body.style.cursor = 'pointer';
            itemGroup.to({
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.1
            });
        });
        
        itemGroup.on('mouseleave', function() {
            document.body.style.cursor = 'default';
            if (!itemGroup.isDragging()) {
                itemGroup.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.1
                });
            }
        });
        
        itemGroup.on('dragstart', function() {
            if (!isInitializing) {
                playPopSound();
            }
            itemGroup.moveToTop();
            itemGroup.to({
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 0.1
            });
        });
        
        itemGroup.on('dragend', function() {
            // Prevent processing during initialization or multiple drops simultaneously
            if (isInitializing || isProcessingDrop) {
                itemGroup.to({
                    x: x,
                    y: y,
                    duration: 0.3
                });
                return;
            }
            
            itemGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            });
            
            const pos = itemGroup.position();
            let placed = false;
            
            categories.forEach((cat, index) => {
                const basketX = index * basketWidth;
                const basketCenterX = basketX + basketWidth / 2;
                const basketCenterY = basketY + basketHeight / 2;
                
                if (pos.x > basketX + 15 && pos.x < basketX + basketWidth - 15 &&
                    pos.y > basketY && pos.y < basketY + basketHeight) {
                    
                    if (cat.name === item.category) {
                        // Correct placement - celebrate!
                        isProcessingDrop = true;
                        playWinSound();
                        speak(getCorrectMessage());
                        addPoints(10);
                        
                        // Animate to basket center with celebration
                        itemGroup.to({
                            x: basketCenterX,
                            y: basketCenterY - 20,
                            scaleX: 1.3,
                            scaleY: 1.3,
                            rotation: 360,
                            duration: 0.3,
                            onFinish: () => {
                                itemGroup.to({
                                    scaleX: 0,
                                    scaleY: 0,
                                    duration: 0.2,
                                    onFinish: () => {
                                        itemGroup.destroy();
                                        layer.draw();
                                        isProcessingDrop = false; // Reset after animation
                                        
                                        // Check if all items are sorted
                                        const remainingItems = layer.find('Group').filter(g => g.draggable());
                                        if (remainingItems.length === 0) {
                                            registerTimer(setTimeout(() => {
                                                speak('כל הכבוד סיימתם את המשחק');
                                            }, 500));
                                        }
                                    }
                                });
                            }
                        });
                        placed = true;
                    } else {
                        // Wrong placement - shake and return
                        isProcessingDrop = true;
                        playErrorSound();
                        speak(getWrongMessage());
                        
                        // Shake animation
                        const originalX = itemGroup.x();
                        itemGroup.to({
                            x: originalX - 10,
                            duration: 0.05,
                            onFinish: () => {
                                itemGroup.to({
                                    x: originalX + 10,
                                    duration: 0.05,
                                    onFinish: () => {
                                        itemGroup.to({
                                            x: originalX,
                                            duration: 0.05,
                                            onFinish: () => {
                                                // Return to original position
                                                itemGroup.to({
                                                    x: x,
                                                    y: y,
                                                    duration: 0.3,
                                                    onFinish: () => {
                                                        isProcessingDrop = false; // Reset after animation
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        placed = true;
                    }
                }
            });
            
            if (!placed) {
                // Return to original position
                itemGroup.to({
                    x: x,
                    y: y,
                    duration: 0.3
                });
            }
        });
        
        layer.add(itemGroup);
    });
    
    layer.draw();
    
    // Allow interactions after initialization with registered timer
    registerTimer(setTimeout(() => {
        isInitializing = false;
        speak('גררו את הפריטים לסלים המתאימים');
    }, 100));
}
