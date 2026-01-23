// Shake Mix Mode - Follow recipe instructions in English

// Constants
const SHAKE_CONFIG = {
    RECIPE_MIN_LENGTH: 3,
    RECIPE_MAX_LENGTH: 4,
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 2,
    TITLE_FONT_SIZE: 36,
    RECIPE_TITLE_FONT_SIZE: 26,
    RECIPE_ITEM_FONT_SIZE: 20,
    INSTRUCTION_FONT_SIZE: 28,
    BLEND_BUTTON_FONT_SIZE: 28,
    FRUIT_BUTTON_WIDTH: 120,
    FRUIT_BUTTON_HEIGHT: 80,
    FRUIT_EMOJI_SIZE: 50,
    BLENDER_WIDTH: 200,
    BLENDER_HEIGHT: 250,
    BLEND_DURATION: 1500,
    ANIMATION_DURATION_SHORT: 0.1,
    ANIMATION_DURATION_MEDIUM: 0.3,
    ANIMATION_DURATION_LONG: 1,
    CONFETTI_COUNT: 30,
    STAR_COUNT: 5
};

const FRUITS = [
    { name: 'Strawberry', emoji: '🍓', color: '#FF6B6B', hebrew: 'תות' },
    { name: 'Banana', emoji: '🍌', color: '#FFE66D', hebrew: 'בננה' },
    { name: 'Orange', emoji: '🍊', color: '#FF9F1C', hebrew: 'תפוז' },
    { name: 'Grapes', emoji: '🍇', color: '#9D4EDD', hebrew: 'ענבים' },
    { name: 'Kiwi', emoji: '🥝', color: '#06FFA5', hebrew: 'קיווי' },
    { name: 'Peach', emoji: '🍑', color: '#FFB5E8', hebrew: 'אפרסק' },
    { name: 'Blueberry', emoji: '🫐', color: '#4361EE', hebrew: 'אוכמניות' },
    { name: 'Mango', emoji: '🥭', color: '#FFD60A', hebrew: 'מנגו' }
];

/**
 * Generate a random recipe with unique fruits and quantities
 * @returns {Array} Recipe array with fruit objects including quantities
 */
function generateRecipe() {
    const recipeLength = SHAKE_CONFIG.RECIPE_MIN_LENGTH + 
        Math.floor(Math.random() * (SHAKE_CONFIG.RECIPE_MAX_LENGTH - SHAKE_CONFIG.RECIPE_MIN_LENGTH + 1));
    const recipe = [];
    const usedFruits = new Set();
    
    while (recipe.length < recipeLength) {
        const randomFruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
        if (!usedFruits.has(randomFruit.name)) {
            usedFruits.add(randomFruit.name);
            const quantity = SHAKE_CONFIG.MIN_QUANTITY + 
                Math.floor(Math.random() * (SHAKE_CONFIG.MAX_QUANTITY - SHAKE_CONFIG.MIN_QUANTITY + 1));
            recipe.push({ ...randomFruit, quantity });
        }
    }
    
    return recipe;
}

function startShakeMode() {
    currentMode = 'shake';
    score = 0;
    hideScore();
    initStage();
    
    const recipe = generateRecipe();
    
    // Game state
    let currentStep = 0;
    let currentQuantityAdded = 0;
    const blenderFruits = [];
    const fruitEmojisInBlender = [];
    let isBlending = false;
    let blendButtonAnim = null;
    
    // UI Elements
    const title = createTitle();
    const recipeItems = createRecipePanel(recipe);
    const { blenderGlass, instructionText, instructionBg } = createBlenderArea();
    const blendButton = createBlendButton();
    const resetButton = createResetButton();
    createFruitButtons();
    
    // Event handlers
    blendButton.on('click tap', handleBlendClick);
    resetButton.on('click tap', () => startShakeMode());
    
    // Start game
    startGame();
    layer.draw();
    
    /**
     * Create and animate the title
     */
    function createTitle() {
        const title = new Konva.Text({
            x: 0,
            y: 15,
            width: stage.width(),
            text: '🥤 Follow the Recipe! 🥤',
            fontSize: SHAKE_CONFIG.TITLE_FONT_SIZE,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            fontStyle: 'bold',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
            shadowOffset: { x: 2, y: 2 }
        });
        layer.add(title);
        
        const titleAnim = new Konva.Animation((frame) => {
            title.scaleX(1 + Math.sin(frame.time / 500) * 0.05);
            title.scaleY(1 + Math.sin(frame.time / 500) * 0.05);
        }, layer);
        titleAnim.start();
        
        return title;
    }
    
    /**
     * Create the recipe panel on the left side
     */
    function createRecipePanel(recipe) {
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
            fontSize: SHAKE_CONFIG.RECIPE_TITLE_FONT_SIZE,
            fontFamily: 'Arial',
            fill: '#fb923c',
            fontStyle: 'bold',
            align: 'center'
        });
        layer.add(recipeTitle);
        
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
                fontSize: SHAKE_CONFIG.RECIPE_ITEM_FONT_SIZE,
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
        
        return recipeItems;
    }

    /**
     * Create the blender area in the center
     */
    function createBlenderArea() {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        
        // Blender base
        const blenderBase = new Konva.Rect({
            x: blenderX - SHAKE_CONFIG.BLENDER_WIDTH / 2,
            y: blenderY + SHAKE_CONFIG.BLENDER_HEIGHT / 2,
            width: SHAKE_CONFIG.BLENDER_WIDTH,
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
            y: blenderY + SHAKE_CONFIG.BLENDER_HEIGHT / 2 + 25,
            radius: 12,
            fill: '#e74c3c',
            stroke: '#c0392b',
            strokeWidth: 2
        });
        layer.add(blenderButton);
        
        // Blender glass
        const blenderGlass = new Konva.Rect({
            x: blenderX - SHAKE_CONFIG.BLENDER_WIDTH / 2,
            y: blenderY - SHAKE_CONFIG.BLENDER_HEIGHT / 2,
            width: SHAKE_CONFIG.BLENDER_WIDTH,
            height: SHAKE_CONFIG.BLENDER_HEIGHT,
            fill: 'rgba(255, 255, 255, 0.4)',
            stroke: '#34495E',
            strokeWidth: 5,
            cornerRadius: [8, 8, 0, 0],
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.3
        });
        layer.add(blenderGlass);
        
        // Instruction text above blender
        const instructionBg = new Konva.Rect({
            x: blenderX - 180,
            y: blenderY - SHAKE_CONFIG.BLENDER_HEIGHT / 2 - 80,
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
            y: blenderY - SHAKE_CONFIG.BLENDER_HEIGHT / 2 - 65,
            width: 340,
            text: '',
            fontSize: SHAKE_CONFIG.INSTRUCTION_FONT_SIZE,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(instructionText);
        
        return { blenderGlass, instructionText, instructionBg };
    }
    
    /**
     * Create fruit selection buttons on the right side
     */
    function createFruitButtons() {
        const shelfX = stage.width() - 140;
        const shelfStartY = 120;
        const fruitSpacing = Math.min(75, (stage.height() - 200) / FRUITS.length);
        
        FRUITS.forEach((fruit, index) => {
            const fruitY = shelfStartY + index * fruitSpacing;
            
            const fruitGroup = new Konva.Group({
                x: shelfX - 60,
                y: fruitY - 35
            });
            
            const fruitBg = new Konva.Rect({
                x: 0,
                y: 0,
                width: SHAKE_CONFIG.FRUIT_BUTTON_WIDTH,
                height: SHAKE_CONFIG.FRUIT_BUTTON_HEIGHT,
                fill: 'rgba(255, 255, 255, 0.95)',
                cornerRadius: 20,
                stroke: fruit.color,
                strokeWidth: 3,
                shadowColor: 'black',
                shadowBlur: 8,
                shadowOpacity: 0.3
            });
            fruitGroup.add(fruitBg);
            
            const fruitEmoji = new Konva.Text({
                x: 35,
                y: 15,
                text: fruit.emoji,
                fontSize: SHAKE_CONFIG.FRUIT_EMOJI_SIZE
            });
            fruitGroup.add(fruitEmoji);
            
            layer.add(fruitGroup);
            
            // Click handler
            fruitGroup.on('click tap', () => {
                if (isBlending || currentStep >= recipe.length) return;
                
                animateButtonPress(fruitGroup);
                handleFruitClick(fruit);
            });
            
            // Hover effects
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
    }
    
    /**
     * Create the blend button
     */
    function createBlendButton() {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        
        const blendButton = new Konva.Group({
            x: blenderX,
            y: blenderY + SHAKE_CONFIG.BLENDER_HEIGHT / 2 + 100,
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
            fontSize: SHAKE_CONFIG.BLEND_BUTTON_FONT_SIZE,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            fontStyle: 'bold'
        });
        
        blendButton.add(blendButtonBg, blendButtonText);
        layer.add(blendButton);
        
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
        
        return blendButton;
    }
    
    /**
     * Create the reset button
     */
    function createResetButton() {
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
        
        return resetButton;
    }
    
    /**
     * Animate button press effect
     */
    function animateButtonPress(button) {
        button.to({
            scaleX: 0.9,
            scaleY: 0.9,
            duration: SHAKE_CONFIG.ANIMATION_DURATION_SHORT,
            onFinish: () => {
                button.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: SHAKE_CONFIG.ANIMATION_DURATION_SHORT
                });
            }
        });
    }
    
    /**
     * Show stars animation at a position
     */
    function showStarsAnimation(x, y) {
        for (let i = 0; i < SHAKE_CONFIG.STAR_COUNT; i++) {
            const star = new Konva.Text({
                x: x + (Math.random() - 0.5) * 100,
                y: y,
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
    }
    
    /**
     * Animate checkmark for completed recipe item
     */
    function animateCheckmark(stepIndex) {
        const item = recipeItems[stepIndex];
        item.checkmark.text('✓');
        item.bg.fill('rgba(34, 197, 94, 0.3)');
        item.bg.stroke('#22c55e');
        item.bg.strokeWidth(4);
        
        item.checkmark.scale({ x: 0, y: 0 });
        item.checkmark.to({
            scaleX: 1.5,
            scaleY: 1.5,
            duration: SHAKE_CONFIG.ANIMATION_DURATION_MEDIUM,
            onFinish: () => {
                item.checkmark.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.2
                });
            }
        });
    }
    
    /**
     * Shake animation for wrong fruit selection
     */
    function shakeRecipeItem(stepIndex) {
        const item = recipeItems[stepIndex];
        const originalX = item.bg.x();
        
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
    }
    
    /**
     * Show X mark for wrong selection
     */
    function showXMark() {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        
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
    
    /**
     * Add fruit to blender with animation
     */
    function addFruitToBlender(fruit) {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        
        const fruitInBlender = new Konva.Text({
            x: blenderX - 25 + (Math.random() - 0.5) * 60,
            y: blenderY + SHAKE_CONFIG.BLENDER_HEIGHT / 2 - 40 - blenderFruits.length * 35,
            text: fruit.emoji,
            fontSize: 45,
            opacity: 0
        });
        layer.add(fruitInBlender);
        fruitEmojisInBlender.push(fruitInBlender);
        
        fruitInBlender.to({
            opacity: 1,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: SHAKE_CONFIG.ANIMATION_DURATION_MEDIUM,
            onFinish: () => {
                fruitInBlender.to({
                    scaleX: 1,
                    scaleY: 1,
                    duration: 0.2
                });
            }
        });
    }
    
    /**
     * Update instruction text for next step
     */
    function updateInstructionForNextStep() {
        const nextFruit = recipe[currentStep];
        const quantityText = nextFruit.quantity > 1 ? `${nextFruit.quantity} ` : '';
        const pluralS = nextFruit.quantity > 1 ? 's' : '';
        instructionText.text(`Add ${quantityText}${nextFruit.name}${pluralS}`);
        instructionBg.fill('rgba(251, 146, 60, 0.95)');
        speakEnglish(`Now add ${quantityText}${nextFruit.name}${pluralS}`);
        layer.draw();
    }
    
    /**
     * Update instruction for remaining quantity
     */
    function updateInstructionForRemainingQuantity() {
        const expectedFruit = recipe[currentStep];
        const remaining = expectedFruit.quantity - currentQuantityAdded;
        const pluralS = remaining > 1 ? 's' : '';
        instructionText.text(`Add ${remaining} more ${expectedFruit.name}${pluralS}`);
        speakEnglish(`Add ${remaining} more ${expectedFruit.name}${pluralS}`);
    }
    
    /**
     * Show recipe complete state
     */
    function showRecipeComplete() {
        instructionText.text('🎉 Ready to blend! 🎉');
        instructionBg.fill('rgba(34, 197, 94, 0.95)');
        blendButton.visible(true);
        
        blendButtonAnim = new Konva.Animation((frame) => {
            blendButton.scaleX(1 + Math.sin(frame.time / 200) * 0.1);
            blendButton.scaleY(1 + Math.sin(frame.time / 200) * 0.1);
        }, layer);
        blendButtonAnim.start();
        
        setTimeout(() => {
            speakEnglish('Great! Now press blend!');
        }, 1000);
    }
    
    /**
     * Flash instruction background red for error
     */
    function flashInstructionError() {
        instructionBg.fill('rgba(239, 68, 68, 0.95)');
        setTimeout(() => {
            instructionBg.fill('rgba(251, 146, 60, 0.95)');
            layer.draw();
        }, 500);
    }
    
    /**
     * Handle fruit button click
     */
    function handleFruitClick(fruit) {
        if (currentStep >= recipe.length || isBlending) return;
        
        const expectedFruit = recipe[currentStep];
        
        if (fruit.name === expectedFruit.name) {
            handleCorrectFruit(fruit, expectedFruit);
        } else {
            handleWrongFruit(expectedFruit);
        }
    }
    
    /**
     * Handle correct fruit selection
     */
    function handleCorrectFruit(fruit, expectedFruit) {
        currentQuantityAdded++;
        
        playPopSound();
        speakEnglish(`Good job! ${fruit.name}!`);
        
        blenderFruits.push(fruit);
        addFruitToBlender(fruit);
        
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        showStarsAnimation(blenderX, blenderY - 50);
        
        if (currentQuantityAdded >= expectedFruit.quantity) {
            const completedStepIndex = currentStep;
            animateCheckmark(completedStepIndex);
            
            currentStep++;
            currentQuantityAdded = 0;
            
            if (currentStep < recipe.length) {
                setTimeout(() => updateInstructionForNextStep(), 1000);
            } else {
                showRecipeComplete();
            }
        } else {
            setTimeout(() => updateInstructionForRemainingQuantity(), 500);
        }
        
        layer.draw();
    }
    
    /**
     * Handle wrong fruit selection
     */
    function handleWrongFruit(expectedFruit) {
        playErrorSound();
        speakEnglish(`No, we need ${expectedFruit.name}`);
        
        flashInstructionError();
        shakeRecipeItem(currentStep);
        showXMark();
    }
    
    /**
     * Handle blend button click
     */
    function handleBlendClick() {
        if (isBlending) return;
        if (blendButtonAnim) blendButtonAnim.stop();
        blendShake();
    }
    
    /**
     * Calculate mixed color from fruits
     */
    function calculateMixedColor() {
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
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    /**
     * Animate blending process
     */
    function blendShake() {
        isBlending = true;
        blendButton.visible(false);
        instructionText.text('Blending...');
        layer.draw();
        
        playBlendSound();
        
        // Animate fruit emojis spinning
        const animations = [];
        fruitEmojisInBlender.forEach(fruitNode => {
            const anim = new Konva.Animation((frame) => {
                fruitNode.rotation(frame.time / 5);
                fruitNode.y(fruitNode.y() - 0.5);
            }, layer);
            anim.start();
            animations.push(anim);
        });
        
        // Stop animations and clear fruits
        setTimeout(() => {
            animations.forEach(anim => anim.stop());
            fruitEmojisInBlender.forEach(fruitNode => fruitNode.destroy());
            fruitEmojisInBlender.length = 0;
        }, SHAKE_CONFIG.BLEND_DURATION);
        
        // Fill blender with mixed color
        setTimeout(() => {
            fillBlenderWithColor();
        }, SHAKE_CONFIG.BLEND_DURATION + 100);
    }
    
    /**
     * Fill blender with mixed color animation
     */
    function fillBlenderWithColor() {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        const mixedColor = calculateMixedColor();
        
        const liquid = new Konva.Rect({
            x: blenderX - SHAKE_CONFIG.BLENDER_WIDTH / 2 + 10,
            y: blenderY + SHAKE_CONFIG.BLENDER_HEIGHT / 2 - 10,
            width: SHAKE_CONFIG.BLENDER_WIDTH - 20,
            height: 0,
            fill: mixedColor,
            cornerRadius: [0, 0, 0, 0]
        });
        layer.add(liquid);
        blenderGlass.moveToTop();
        
        liquid.to({
            height: SHAKE_CONFIG.BLENDER_HEIGHT - 20,
            y: blenderY - SHAKE_CONFIG.BLENDER_HEIGHT / 2 + 10,
            duration: SHAKE_CONFIG.ANIMATION_DURATION_LONG,
            onFinish: () => showResult()
        });
    }
    
    /**
     * Show confetti celebration
     */
    function showConfetti() {
        const blenderX = stage.width() / 2;
        const blenderY = stage.height() / 2 + 20;
        
        for (let i = 0; i < SHAKE_CONFIG.CONFETTI_COUNT; i++) {
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
    }
    
    /**
     * Show final result with celebration
     */
    function showResult() {
        playWinSound();
        instructionText.text('🎉 Perfect Smoothie! 🎉');
        instructionBg.fill('rgba(34, 197, 94, 0.95)');
        
        showConfetti();
        
        const fruitNames = blenderFruits.map(f => f.name).join(', ');
        setTimeout(() => {
            speakEnglish(`Delicious! You made a smoothie with ${fruitNames}!`);
        }, 500);
        
        layer.draw();
    }
    
    /**
     * Start the game with initial instruction
     */
    function startGame() {
        setTimeout(() => {
            const firstFruit = recipe[0];
            const quantityText = firstFruit.quantity > 1 ? `${firstFruit.quantity} ` : '';
            const pluralS = firstFruit.quantity > 1 ? 's' : '';
            instructionText.text(`Add ${quantityText}${firstFruit.name}${pluralS}`);
            speakEnglish(`Let's make a smoothie! First, add ${quantityText}${firstFruit.name}${pluralS}`);
            layer.draw();
        }, 1000);
    }
} // End of startShakeMode()

/**
 * Speak text in English using Web Speech API
 */
function speakEnglish(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

/**
 * Play blending sound effect
 */
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
