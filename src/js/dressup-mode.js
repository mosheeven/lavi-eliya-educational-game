// DRESS UP MODE - הלבשה
function startDressUpMode() {
    currentMode = 'dressup';
    initStage();
    hideScore();
    stopSpeech();
    
    let isProcessing = false;
    
    // Character base (simple person shape)
    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2;
    
    // Head
    const head = new Konva.Circle({
        x: centerX,
        y: centerY - 80,
        radius: 40,
        fill: '#fcd34d',
        stroke: '#000',
        strokeWidth: 2
    });
    layer.add(head);
    
    // Eyes
    const leftEye = new Konva.Circle({ x: centerX - 15, y: centerY - 85, radius: 5, fill: '#000' });
    const rightEye = new Konva.Circle({ x: centerX + 15, y: centerY - 85, radius: 5, fill: '#000' });
    layer.add(leftEye, rightEye);
    
    // Smile
    const smile = new Konva.Arc({
        x: centerX,
        y: centerY - 70,
        innerRadius: 15,
        outerRadius: 16,
        angle: 180,
        rotation: 180,
        fill: '#000'
    });
    layer.add(smile);
    
    // Body
    const body = new Konva.Rect({
        x: centerX - 30,
        y: centerY - 30,
        width: 60,
        height: 80,
        fill: '#fcd34d',
        stroke: '#000',
        strokeWidth: 2,
        name: 'body-slot'
    });
    layer.add(body);
    
    // Arms
    const leftArm = new Konva.Rect({ x: centerX - 50, y: centerY - 20, width: 20, height: 60, fill: '#fcd34d', stroke: '#000', strokeWidth: 2 });
    const rightArm = new Konva.Rect({ x: centerX + 30, y: centerY - 20, width: 20, height: 60, fill: '#fcd34d', stroke: '#000', strokeWidth: 2 });
    layer.add(leftArm, rightArm);
    
    // Legs
    const leftLeg = new Konva.Rect({ x: centerX - 25, y: centerY + 50, width: 20, height: 70, fill: '#fcd34d', stroke: '#000', strokeWidth: 2, name: 'legs-slot' });
    const rightLeg = new Konva.Rect({ x: centerX + 5, y: centerY + 50, width: 20, height: 70, fill: '#fcd34d', stroke: '#000', strokeWidth: 2 });
    layer.add(leftLeg, rightLeg);
    
    // Clothing items
    const clothes = [
        // Hats
        { emoji: '🎩', type: 'hat', x: 50, y: 80, slot: { x: centerX, y: centerY - 120 } },
        { emoji: '👒', type: 'hat', x: 120, y: 80, slot: { x: centerX, y: centerY - 120 } },
        { emoji: '🧢', type: 'hat', x: 190, y: 80, slot: { x: centerX, y: centerY - 120 } },
        
        // Shirts
        { emoji: '👕', type: 'shirt', x: 50, y: 180, slot: { x: centerX, y: centerY } },
        { emoji: '👔', type: 'shirt', x: 120, y: 180, slot: { x: centerX, y: centerY } },
        { emoji: '🎽', type: 'shirt', x: 190, y: 180, slot: { x: centerX, y: centerY } },
        
        // Pants
        { emoji: '👖', type: 'pants', x: 50, y: 280, slot: { x: centerX, y: centerY + 85 } },
        { emoji: '🩳', type: 'pants', x: 120, y: 280, slot: { x: centerX, y: centerY + 85 } },
        { emoji: '👗', type: 'dress', x: 190, y: 280, slot: { x: centerX, y: centerY + 20 } },
        
        // Shoes
        { emoji: '👟', type: 'shoes', x: 50, y: 380, slot: { x: centerX, y: centerY + 140 } },
        { emoji: '👞', type: 'shoes', x: 120, y: 380, slot: { x: centerX, y: centerY + 140 } },
        { emoji: '🥾', type: 'shoes', x: 190, y: 380, slot: { x: centerX, y: centerY + 140 } }
    ];
    
    // Track worn items
    const wornItems = { hat: null, shirt: null, pants: null, dress: null, shoes: null };
    
    // Title
    const title = new Konva.Text({
        x: 50,
        y: 20,
        width: stage.width() - 100,
        text: '👗 הלבשה 👔',
        fontSize: 28,
        fontFamily: 'Varela Round, Arial',
        fill: '#ec4899',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(title);
    
    // Create draggable clothing items
    clothes.forEach(item => {
        const group = new Konva.Group({
            x: item.x,
            y: item.y,
            draggable: true
        });
        
        const bg = new Konva.Circle({
            radius: 35,
            fill: 'white',
            stroke: '#ec4899',
            strokeWidth: 3
        });
        group.add(bg);
        
        const text = new Konva.Text({
            text: item.emoji,
            fontSize: 50,
            offsetX: 25,
            offsetY: 25,
            width: 50,
            height: 50,
            align: 'center',
            verticalAlign: 'middle'
        });
        group.add(text);
        
        group.on('dragstart', () => {
            if (!isProcessing) {
                playPopSound();
                group.moveToTop();
            }
        });
        
        group.on('dragend', () => {
            if (isProcessing) return;
            
            const pos = group.position();
            const distance = Math.sqrt(Math.pow(pos.x - item.slot.x, 2) + Math.pow(pos.y - item.slot.y, 2));
            
            if (distance < 80) {
                isProcessing = true;
                
                // Remove previous item of same type
                if (wornItems[item.type]) {
                    wornItems[item.type].destroy();
                }
                
                // Snap to position
                group.to({
                    x: item.slot.x,
                    y: item.slot.y,
                    duration: 0.2,
                    onFinish: () => {
                        wornItems[item.type] = group;
                        playWinSound();
                        speak(getCorrectMessage());
                        addPoints(10);
                        isProcessing = false;
                        
                        // Check if fully dressed
                        const dressed = Object.values(wornItems).filter(v => v !== null).length;
                        if (dressed >= 4) {
                            setTimeout(() => {
                                speak('כל הכבוד התלבשת מעולה');
                            }, 800);
                        }
                    }
                });
            } else {
                // Return to original position
                group.to({ x: item.x, y: item.y, duration: 0.3 });
            }
        });
        
        group.on('mouseenter', () => {
            document.body.style.cursor = 'pointer';
            group.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
        });
        
        group.on('mouseleave', () => {
            document.body.style.cursor = 'default';
            if (!group.isDragging()) {
                group.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
            }
        });
        
        layer.add(group);
    });
    
    // Clear button
    const clearBtn = new Konva.Group({
        x: stage.width() - 120,
        y: stage.height() - 70
    });
    
    const clearBg = new Konva.Rect({
        width: 100,
        height: 50,
        fill: '#ef4444',
        cornerRadius: 10,
        stroke: '#fff',
        strokeWidth: 2
    });
    clearBtn.add(clearBg);
    
    const clearText = new Konva.Text({
        width: 100,
        height: 50,
        text: '🔄 נקה',
        fontSize: 20,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    clearBtn.add(clearText);
    
    clearBtn.on('click tap', () => {
        Object.keys(wornItems).forEach(key => {
            if (wornItems[key]) {
                const item = clothes.find(c => c.type === key && wornItems[key].x() === c.slot.x);
                if (item) {
                    wornItems[key].to({ x: item.x, y: item.y, duration: 0.3 });
                }
                wornItems[key] = null;
            }
        });
        playPopSound();
        speak('נקה הכל');
    });
    
    clearBtn.on('mouseenter', () => {
        clearBg.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
    });
    
    clearBtn.on('mouseleave', () => {
        clearBg.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    layer.add(clearBtn);
    layer.draw();
    
    setTimeout(() => speak('גרור בגדים על הדמות'), 500);
}
