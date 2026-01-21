// Shake Mix Mode - Follow recipe instructions in English

function startShakeMode() {
    currentMode = 'shake';
    score = 0;
    hideScore();
    
    initStage();
    
    const fruits = [
        { name: 'Strawberry', emoji: '🍓', color: '#FF6B6B', hebrew: 'תות' },
        { name: 'Banana', emoji: '🍌', color: '#FFE66D', hebrew: 'בננה' },
        { name: 'Orange', emoji: '🍊', color: '#FF9F1C', hebrew: 'תפוז' },
        { name: 'Grapes', emoji: '🍇', color: '#9D4EDD', hebrew: 'ענבים' },
        { name: 'Kiwi', emoji: '🥝', color: '#06FFA5', hebrew: 'קיווי' },
        { name: 'Peach', emoji: '🍑', color: '#FFB5E8', hebrew: 'אפרסק' },
        { name: 'Blueberry', emoji: '🫐', color: '#4361EE', hebrew: 'אוכמניות' },
        { name: 'Mango', emoji: '🥭', color: '#FFD60A', hebrew: 'מנגו' }
    ];
    
    // Generate random recipe (3-4 unique fruits with quantities)
    const recipeLength = 3 + Math.floor(Math.random() * 2);
    const recipe = [];
    const usedFruits = new Set();
    
    while (recipe.length < recipeLength) {
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        if (!usedFruits.has(randomFruit.name)) {
            usedFruits.add(randomFruit.name);
            const quantity = 1 + Math.floor(Math.random() * 2); // 1 or 2
            recipe.push({ ...randomFruit, quantity });
        }
    }
    
    let currentStep = 0;
    let currentQuantityAdded = 0;
    const blenderFruits = [];
    const fruitEmojisInBlender = []; // Track emoji objects for blend animation
    let isBlending = false;
    let blendButtonAnim = null; // Track blend button animation
    
    // Title with animation
    const title = new Konva.Text({
        x: 0,
        y: 15,
        width: stage.width(),
        text: '🥤 Follow the Recipe! 🥤',
        fontSize: 36,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        fontStyle: 'bold',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        shadowOffset: { x: 2, y: 2 }
    });
    layer.add(title);
    
    // Animate title
    const titleAnim = new Konva.Animation((frame) => {
        title.scaleX(1 + Math.sin(frame.time / 500) * 0.05);
        title.scaleY(1 + Math.sin(frame.time / 500) * 0.05);
    }, layer);
    titleAnim.start();
    
    // Recipe panel (LEFT side) - bigger and more colorful
    const recipeX = 120;
    const recipeY = 120;
    
    const recipePanel = new Konva.Rect({
        x: recipeX - 90,
        y: recipeY - 30,
        width: 180,
        height: recipe.length * 80 + 80,
        fill: 'rgba(255, 255, 255, 0.98)',
        cornerRadius: 20,
        stroke: '#fb923c',
        strokeWidth: 4,
        shadowColor: 'black',
        shadowBlur: 15,
        shadowOpacity: 0.4
    });
    layer.add(recipePanel);
    
    const recipeTitle = new Konva.Text({
        x: recipeX - 80,
        y: recipeY,
        width: 160,
        text: '📋 Recipe',
        fontSize: 26,
        fontFamily: 'Arial',
        fill: '#fb923c',
        fontStyle: 'bold',
        align: 'center'
    });
    layer.add(recipeTitle);
    
    // Recipe items - bigger and more spaced
    const recipeItems = [];
    recipe.forEach((fruit, index) => {
        const itemY = recipeY + 50 + index * 80;
        
        const itemBg = new Konva.Rect({
            x: recipeX - 80,
            y: itemY - 5,
            width: 160,
            height: 70,
            fill: 'rgba(251, 146, 60, 0.1)',
            cornerRadius: 15,
            stroke: '#fb923c',
            strokeWidth: 2
        });
        layer.add(itemBg);
        
        const itemEmoji = new Konva.Text({
            x: recipeX - 70,
            y: itemY + 5,
            text: fruit.emoji,
            fontSize: 45
        });
        layer.add(itemEmoji);
        
        const itemName = new Konva.Text({
            x: recipeX - 10,
            y: itemY + 15,
            text: `${fruit.quantity}x ${fruit.name}`,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#333',
            fontStyle: 'bold'
        });
        layer.add(itemName);
        
        const checkmark = new Konva.Text({
            x: recipeX + 60,
            y: itemY + 10,
            text: '',
            fontSize: 35,
            fill: '#22c55e'
        });
        layer.add(checkmark);
        
        recipeItems.push({ bg: itemBg, emoji: itemEmoji, name: itemName, checkmark: checkmark });
    });

    
    // Blender container (CENTER) - bigger and more prominent
    const blenderX = stage.width() / 2;
    const blenderY = stage.height() / 2 + 20;
    const blenderWidth = 200;
    const blenderHeight = 250;
    
    // Blender base - more detailed
    const blenderBase = new Konva.Rect({
        x: blenderX - blenderWidth / 2,
        y: blenderY + blenderHeight / 2,
        width: blenderWidth,
        height: 50,
        fill: '#2C3E50',
        cornerRadius: 8,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.5
    });
    layer.add(blenderBase);
    
    // Blender button decoration
    const blenderButton = new Konva.Circle({
        x: blenderX,
        y: blenderY + blenderHeight / 2 + 25,
        radius: 12,
        fill: '#e74c3c',
        stroke: '#c0392b',
        strokeWidth: 2
    });
    layer.add(blenderButton);
    
    // Blender glass - more visible
    const blenderGlass = new Konva.Rect({
        x: blenderX - blenderWidth / 2,
        y: blenderY - blenderHeight / 2,
        width: blenderWidth,
        height: blenderHeight,
        fill: 'rgba(255, 255, 255, 0.4)',
        stroke: '#34495E',
        strokeWidth: 5,
        cornerRadius: [8, 8, 0, 0],
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.3
    });
    layer.add(blenderGlass);
    
    // Instruction text above blender - bigger and more colorful
    const instructionBg = new Konva.Rect({
        x: blenderX - 180,
        y: blenderY - blenderHeight / 2 - 80,
        width: 360,
        height: 60,
        fill: 'rgba(251, 146, 60, 0.95)',
        cornerRadius: 30,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.4
    });
    layer.add(instructionBg);
    
    const instructionText = new Konva.Text({
        x: blenderX - 170,
        y: blenderY - blenderHeight / 2 - 65,
        width: 340,
        text: '',
        fontSize: 28,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(instructionText);
    
    // Fruit shelf (RIGHT side) - bigger buttons
    const shelfX = stage.width() - 140;
    const shelfStartY = 120;
    const fruitSpacing = Math.min(75, (stage.height() - 200) / fruits.length);
    
    fruits.forEach((fruit, index) => {
        const fruitY = shelfStartY + index * fruitSpacing;
        
        // Create group for fruit button
        const fruitGroup = new Konva.Group({
            x: shelfX - 60,
            y: fruitY - 35
        });
        
        // Fruit button background - bigger and more colorful
        const fruitBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: 120,
            height: 80,
            fill: 'rgba(255, 255, 255, 0.95)',
            cornerRadius: 20,
            stroke: fruit.color,
            strokeWidth: 3,
            shadowColor: 'black',
            shadowBlur: 8,
            shadowOpacity: 0.3
        });
        fruitGroup.add(fruitBg);
        
        // Fruit emoji - bigger
        const fruitEmoji = new Konva.Text({
            x: 35,
            y: 15,
            text: fruit.emoji,
            fontSize: 50
        });
        fruitGroup.add(fruitEmoji);
        
        layer.add(fruitGroup);
        
        // Make entire group clickable with better feedback
        fruitGroup.on('click tap', () => {
            if (isBlending || currentStep >= recipe.length) return;
            
            // Button press animation
            fruitGroup.to({
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 0.1,
                onFinish: () => {
                    fruitGroup.to({
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.1
                    });
                }
            });
            
            handleFruitClick(fruit);
        });
        
        fruitGroup.on('mouseenter', () => {
            document.body.style.cursor = 'pointer';
            fruitBg.strokeWidth(5);
            fruitBg.fill('rgba(255, 255, 255, 1)');
            fruitGroup.to({
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.15
            });
        });
        
        fruitGroup.on('mouseleave', () => {
            document.body.style.cursor = 'default';
            fruitBg.strokeWidth(3);
            fruitBg.fill('rgba(255, 255, 255, 0.95)');
            fruitGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.15
            });
        });
    });
    
    // Blend button - bigger and more exciting
    const blendButton = new Konva.Group({
        x: blenderX,
        y: blenderY + blenderHeight / 2 + 100,
        visible: false
    });
    
    const blendButtonBg = new Konva.Rect({
        x: -100,
        y: -30,
        width: 200,
        height: 60,
        fill: '#27AE60',
        cornerRadius: 30,
        shadowColor: 'black',
        shadowBlur: 15,
        shadowOpacity: 0.5
    });
    
    const blendButtonText = new Konva.Text({
        x: -100,
        y: -12,
        width: 200,
        text: '🔄 BLEND! 🔄',
        fontSize: 28,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        fontStyle: 'bold'
    });
    
    blendButton.add(blendButtonBg, blendButtonText);
    layer.add(blendButton);
    
    blendButton.on('click tap', () => {
        if (isBlending) return;
        if (blendButtonAnim) blendButtonAnim.stop();
        blendShake();
    });
    
    blendButton.on('mouseenter', () => {
        document.body.style.cursor = 'pointer';
        blendButtonBg.fill('#2ECC71');
        blendButton.to({
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 0.2
        });
    });
    
    blendButton.on('mouseleave', () => {
        document.body.style.cursor = 'default';
        blendButtonBg.fill('#27AE60');
        blendButton.to({
            scaleX: 1,
            scaleY: 1,
            duration: 0.2
        });
    });
    
    // Reset button
    const resetButton = new Konva.Group({
        x: stage.width() - 100,
        y: stage.height() - 50
    });
    
    const resetButtonBg = new Konva.Rect({
        x: -70,
        y: -20,
        width: 140,
        height: 40,
        fill: '#E74C3C',
        cornerRadius: 20
    });
    
    const resetButtonText = new Konva.Text({
        x: -70,
        y: -8,
        width: 140,
        text: '🔄 New Recipe',
        fontSize: 16,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center'
    });
    
    resetButton.add(resetButtonBg, resetButtonText);
    layer.add(resetButton);
    
    resetButton.on('click tap', () => {
        startShakeMode();
    });
    
    resetButton.on('mouseenter', () => {
        document.body.style.cursor = 'pointer';
        resetButtonBg.fill('#C0392B');
        layer.draw();
    });
    
    resetButton.on('mouseleave', () => {
        document.body.style.cursor = 'default';
        resetButtonBg.fill('#E74C3C');
        layer.draw();
    });
    
    function handleFruitClick(fruit) {
        // Prevent clicks after recipe is complete or while blending
        if (currentStep >= recipe.length || isBlending) return;
        
        const expectedFruit = recipe[currentStep];
        
        if (fruit.name === expectedFruit.name) {
            // Correct fruit!
            currentQuantityAdded++;
            
            playPopSound();
            speakEnglish(`Good job! ${fruit.name}!`);
            
            // Add to blender
            blenderFruits.push(fruit);
            
            // Add fruit emoji to blender with animation
            const fruitInBlender = new Konva.Text({
                x: blenderX - 25 + (Math.random() - 0.5) * 60,
                y: blenderY + blenderHeight / 2 - 40 - blenderFruits.length * 35,
                text: fruit.emoji,
                fontSize: 45,
                opacity: 0
            });
            layer.add(fruitInBlender);
            fruitEmojisInBlender.push(fruitInBlender); // Track for blend animation
            
            fruitInBlender.to({
                opacity: 1,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 0.3,
                onFinish: () => {
                    fruitInBlender.to({
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.2
                    });
                }
            });
            
            // Show stars animation
            for (let i = 0; i < 5; i++) {
                const star = new Konva.Text({
                    x: blenderX + (Math.random() - 0.5) * 100,
                    y: blenderY - 50,
                    text: '⭐',
                    fontSize: 30,
                    opacity: 1
                });
                layer.add(star);
                
                star.to({
                    y: star.y() - 100,
                    opacity: 0,
                    rotation: 360,
                    duration: 1,
                    onFinish: () => star.destroy()
                });
            }
            
            // Check if we've added enough of this fruit
            if (currentQuantityAdded >= expectedFruit.quantity) {
                // Mark as complete in recipe with animation
                const completedStepIndex = currentStep; // Save before incrementing
                
                recipeItems[completedStepIndex].checkmark.text('✓');
                recipeItems[completedStepIndex].bg.fill('rgba(34, 197, 94, 0.3)');
                recipeItems[completedStepIndex].bg.stroke('#22c55e');
                recipeItems[completedStepIndex].bg.strokeWidth(4);
                
                // Animate checkmark
                recipeItems[completedStepIndex].checkmark.scale({ x: 0, y: 0 });
                recipeItems[completedStepIndex].checkmark.to({
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 0.3,
                    onFinish: () => {
                        recipeItems[completedStepIndex].checkmark.to({
                            scaleX: 1,
                            scaleY: 1,
                            duration: 0.2
                        });
                    }
                });
                
                // Move to next step
                currentStep++;
                currentQuantityAdded = 0;
                
                if (currentStep < recipe.length) {
                    // Ask for next fruit
                    setTimeout(() => {
                        const nextFruit = recipe[currentStep];
                        const quantityText = nextFruit.quantity > 1 ? `${nextFruit.quantity} ` : '';
                        const pluralS = nextFruit.quantity > 1 ? 's' : '';
                        instructionText.text(`Add ${quantityText}${nextFruit.name}${pluralS}`);
                        instructionBg.fill('rgba(251, 146, 60, 0.95)');
                        speakEnglish(`Now add ${quantityText}${nextFruit.name}${pluralS}`);
                        layer.draw();
                    }, 1000);
                } else {
                    // Recipe complete!
                    instructionText.text('🎉 Ready to blend! 🎉');
                    instructionBg.fill('rgba(34, 197, 94, 0.95)');
                    blendButton.visible(true);
                    
                    // Animate blend button
                    blendButtonAnim = new Konva.Animation((frame) => {
                        blendButton.scaleX(1 + Math.sin(frame.time / 200) * 0.1);
                        blendButton.scaleY(1 + Math.sin(frame.time / 200) * 0.1);
                    }, layer);
                    blendButtonAnim.start();
                    
                    setTimeout(() => {
                        speakEnglish('Great! Now press blend!');
                    }, 1000);
                }
            } else {
                // Need more of this fruit
                const remaining = expectedFruit.quantity - currentQuantityAdded;
                const pluralS = remaining > 1 ? 's' : '';
                instructionText.text(`Add ${remaining} more ${expectedFruit.name}${pluralS}`);
                setTimeout(() => {
                    speakEnglish(`Add ${remaining} more ${expectedFruit.name}${pluralS}`);
                }, 500);
            }
            
            layer.draw();
        } else {
            // Wrong fruit - big visual feedback
            playErrorSound();
            speakEnglish(`No, we need ${expectedFruit.name}`);
            
            // Flash instruction red
            instructionBg.fill('rgba(239, 68, 68, 0.95)');
            setTimeout(() => {
                instructionBg.fill('rgba(251, 146, 60, 0.95)');
                layer.draw();
            }, 500);
            
            // Shake the recipe item
            const item = recipeItems[currentStep];
            const originalX = item.bg.x();
            const shakeAnim = () => {
                item.bg.to({
                    x: originalX - 15,
                    duration: 0.05,
                    onFinish: () => {
                        item.bg.to({
                            x: originalX + 15,
                            duration: 0.05,
                            onFinish: () => {
                                item.bg.to({
                                    x: originalX - 10,
                                    duration: 0.05,
                                    onFinish: () => {
                                        item.bg.to({
                                            x: originalX + 10,
                                            duration: 0.05,
                                            onFinish: () => {
                                                item.bg.to({ x: originalX, duration: 0.05 });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            };
            shakeAnim();
            
            // Show X mark
            const xMark = new Konva.Text({
                x: blenderX - 30,
                y: blenderY - 50,
                text: '❌',
                fontSize: 60,
                opacity: 1
            });
            layer.add(xMark);
            
            xMark.to({
                y: xMark.y() - 50,
                opacity: 0,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 0.8,
                onFinish: () => xMark.destroy()
            });
        }
    }
    
    function blendShake() {
        isBlending = true;
        blendButton.visible(false);
        instructionText.text('Blending...');
        layer.draw();
        
        playBlendSound();
        
        // Animate all fruit emojis in blender
        const animations = [];
        fruitEmojisInBlender.forEach(fruitNode => {
            const anim = new Konva.Animation((frame) => {
                fruitNode.rotation(frame.time / 5);
                fruitNode.y(fruitNode.y() - 0.5);
            }, layer);
            anim.start();
            animations.push(anim);
        });
        
        // Stop animations and destroy fruits after 1.5 seconds
        setTimeout(() => {
            animations.forEach(anim => anim.stop());
            fruitEmojisInBlender.forEach(fruitNode => fruitNode.destroy());
            fruitEmojisInBlender.length = 0; // Clear array
        }, 1500);
        
        // Show mixed color after blending
        setTimeout(() => {
            // Mix colors
            let r = 0, g = 0, b = 0;
            blenderFruits.forEach(fruit => {
                const color = fruit.color;
                r += parseInt(color.slice(1, 3), 16);
                g += parseInt(color.slice(3, 5), 16);
                b += parseInt(color.slice(5, 7), 16);
            });
            
            r = Math.floor(r / blenderFruits.length);
            g = Math.floor(g / blenderFruits.length);
            b = Math.floor(b / blenderFruits.length);
            
            const mixedColor = `rgb(${r}, ${g}, ${b})`;
            
            // Fill blender with color
            const liquid = new Konva.Rect({
                x: blenderX - blenderWidth / 2 + 10,
                y: blenderY + blenderHeight / 2 - 10,
                width: blenderWidth - 20,
                height: 0,
                fill: mixedColor,
                cornerRadius: [0, 0, 0, 0]
            });
            layer.add(liquid);
            blenderGlass.moveToTop();
            
            liquid.to({
                height: blenderHeight - 20,
                y: blenderY - blenderHeight / 2 + 10,
                duration: 1,
                onFinish: () => {
                    showResult();
                }
            });
        }, 1600);
    }
    
    function showResult() {
        playWinSound();
        instructionText.text('🎉 Perfect Smoothie! 🎉');
        instructionBg.fill('rgba(34, 197, 94, 0.95)');
        
        // Big celebration with confetti
        for (let i = 0; i < 30; i++) {
            const confetti = new Konva.Text({
                x: blenderX + (Math.random() - 0.5) * 200,
                y: blenderY - 100,
                text: ['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)],
                fontSize: 30,
                opacity: 1,
                rotation: Math.random() * 360
            });
            layer.add(confetti);
            
            confetti.to({
                y: confetti.y() + 300 + Math.random() * 200,
                x: confetti.x() + (Math.random() - 0.5) * 300,
                opacity: 0,
                rotation: confetti.rotation() + 360 + Math.random() * 360,
                duration: 2 + Math.random(),
                onFinish: () => confetti.destroy()
            });
        }
        
        // Announce all fruits
        const fruitNames = blenderFruits.map(f => f.name).join(', ');
        setTimeout(() => {
            speakEnglish(`Delicious! You made a smoothie with ${fruitNames}!`);
        }, 500);
        
        layer.draw();
    }
    
    // Start the game
    setTimeout(() => {
        const firstFruit = recipe[0];
        const quantityText = firstFruit.quantity > 1 ? `${firstFruit.quantity} ` : '';
        const pluralS = firstFruit.quantity > 1 ? 's' : '';
        instructionText.text(`Add ${quantityText}${firstFruit.name}${pluralS}`);
        speakEnglish(`Let's make a smoothie! First, add ${quantityText}${firstFruit.name}${pluralS}`);
        layer.draw();
    }, 1000);
    
    layer.draw();
}

function speakEnglish(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

function playBlendSound() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 1.5);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
}
