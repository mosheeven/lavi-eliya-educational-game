// POPPING MODE
function startPoppingMode() {
    currentMode = 'popping';
    initStage();
    showScore();
    updateScore(0);
    updateParentGuide('עודדו את הילדים ללחוץ מהר על הבלונים לפני שהם נעלמים! כל לחיצה מוסיפה נקודה.');
    
    const items = ['🎈', '🎪', '🎨', '🎭', '🎯', '🎁', '⭐', '🌟', '💫', '✨'];
    let itemsPopped = 0;
    const totalItems = 15;
    let itemsCreated = 0;
    
    function createFloatingItem() {
        if (itemsCreated >= totalItems) return;
        itemsCreated++;
        
        const emoji = items[Math.floor(Math.random() * items.length)];
        const x = Math.random() * (stage.width() - 100) + 50;
        const startY = stage.height() + 50;
        
        const itemGroup = new Konva.Group({
            x: x,
            y: startY
        });
        
        const circle = new Konva.Circle({
            radius: 35,
            fill: '#fff',
            stroke: '#f59e0b',
            strokeWidth: 3
        });
        itemGroup.add(circle);
        
        const text = new Konva.Text({
            text: emoji,
            fontSize: 45,
            fontFamily: 'Arial',
            x: -22,
            y: -22,
            width: 44,
            height: 44,
            align: 'center'
        });
        itemGroup.add(text);
        
        layer.add(itemGroup);
        
        const anim = new Konva.Animation((frame) => {
            const newY = startY - (frame.time / 1000) * 150;
            itemGroup.y(newY);
            
            if (newY < -50) {
                anim.stop();
                itemGroup.destroy();
                layer.draw();
            }
        }, layer);
        
        itemGroup.on('click tap', function() {
            anim.stop();
            playPopSound();
            itemsPopped++;
            updateScore(itemsPopped);
            
            itemGroup.to({
                scaleX: 1.5,
                scaleY: 1.5,
                opacity: 0,
                duration: 0.2,
                onFinish: () => {
                    itemGroup.destroy();
                    layer.draw();
                    
                    if (itemsPopped === totalItems) {
                        setTimeout(() => {
                            playWinSound();
                            speak('כל הכבוד קיבלתם ' + itemsPopped + ' נקודות');
                        }, 300);
                    }
                }
            });
        });
        
        anim.start();
        layer.draw();
    }
    
    // Create items at intervals
    let interval = setInterval(() => {
        createFloatingItem();
        if (itemsCreated >= totalItems) {
            clearInterval(interval);
        }
    }, 800);
}
