// SORTING MODE
function startSortingMode() {
    currentMode = 'sorting';
    initStage();
    hideScore();
    
    const categories = [
        { name: 'דינוזאורים', emoji: '🦕', items: ['🦕', '🦖', '🦴'] },
        { name: 'חלל', emoji: '🚀', items: ['🚀', '🌙', '⭐', '🪐'] },
        { name: 'מספרים', emoji: '🔢', items: ['1️⃣', '2️⃣', '3️⃣'] },
        { name: 'אנגלית', emoji: '🔤', items: ['🅰️', '🅱️', '🆎'] }
    ];
    
    const basketWidth = stage.width() / 4;
    const basketHeight = 120;
    const basketY = stage.height() - basketHeight - 10;
    
    // Create baskets
    categories.forEach((cat, index) => {
        const x = index * basketWidth;
        
        // Basket background
        const basket = new Konva.Rect({
            x: x + 10,
            y: basketY,
            width: basketWidth - 20,
            height: basketHeight,
            fill: '#f0f0f0',
            stroke: '#667eea',
            strokeWidth: 3,
            cornerRadius: 15,
            name: cat.name
        });
        layer.add(basket);
        
        // Basket label
        const label = new Konva.Text({
            x: x + 10,
            y: basketY + 10,
            width: basketWidth - 20,
            text: cat.emoji + '\n' + cat.name,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#333',
            align: 'center'
        });
        layer.add(label);
    });
    
    // Create draggable items
    const allItems = categories.flatMap(cat => 
        cat.items.map(item => ({ emoji: item, category: cat.name }))
    );
    
    // Shuffle items
    allItems.sort(() => Math.random() - 0.5);
    
    allItems.forEach((item, index) => {
        const x = 100 + (index % 4) * 150;
        const y = 80 + Math.floor(index / 4) * 120;
        
        const itemGroup = new Konva.Group({
            x: x,
            y: y,
            draggable: true
        });
        
        const bg = new Konva.Circle({
            radius: 40,
            fill: 'white',
            stroke: '#764ba2',
            strokeWidth: 3
        });
        itemGroup.add(bg);
        
        const text = new Konva.Text({
            text: item.emoji,
            fontSize: 50,
            fontFamily: 'Arial',
            fill: '#333',
            width: 80,
            height: 80,
            x: -40,
            y: -40,
            align: 'center',
            verticalAlign: 'middle'
        });
        itemGroup.add(text);
        
        itemGroup.on('dragend', function() {
            const pos = itemGroup.position();
            let placed = false;
            
            categories.forEach((cat, index) => {
                const basketX = index * basketWidth;
                if (pos.x > basketX && pos.x < basketX + basketWidth &&
                    pos.y > basketY && pos.y < basketY + basketHeight) {
                    
                    if (cat.name === item.category) {
                        // Correct placement
                        playWinSound();
                        speak('כל הכבוד');
                        itemGroup.to({
                            x: basketX + basketWidth / 2,
                            y: basketY + basketHeight / 2,
                            scaleX: 0.5,
                            scaleY: 0.5,
                            duration: 0.3,
                            onFinish: () => {
                                itemGroup.destroy();
                                layer.draw();
                            }
                        });
                        placed = true;
                    } else {
                        // Wrong placement
                        playErrorSound();
                        speak('נסו שוב');
                        itemGroup.to({
                            x: x,
                            y: y,
                            duration: 0.3
                        });
                        placed = true;
                    }
                }
            });
            
            if (!placed) {
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
}
