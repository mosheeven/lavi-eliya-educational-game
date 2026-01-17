// COLORING/DRAWING MODE - צביעה
function startColoringMode() {
    currentMode = 'coloring';
    initStage();
    hideScore();
    
    // Stop any ongoing speech when starting
    stopSpeech();
    
    let isDrawing = false;
    let currentColor = '#000000';
    let currentTool = 'brush'; // 'brush', 'eraser', or 'sticker'
    let currentSticker = null;
    let brushSize = 8;
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 10,
        width: stage.width() - 100,
        text: '🎨 לוח ציור 🎨',
        fontSize: 28,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    // Drawing area - responsive height
    const toolbarHeight = 140; // Space for two rows of tools
    const drawingAreaY = 50;
    const drawingAreaHeight = stage.height() - drawingAreaY - toolbarHeight - 10;
    
    const drawingArea = new Konva.Rect({
        x: 20,
        y: drawingAreaY,
        width: stage.width() - 40,
        height: drawingAreaHeight,
        fill: 'white',
        stroke: '#d1d5db',
        strokeWidth: 3,
        cornerRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 5 }
    });
    layer.add(drawingArea);
    
    // Expanded color palette with more options
    const colors = [
        { color: '#000000', name: 'שחור' },
        { color: '#ffffff', name: 'לבן' },
        { color: '#ef4444', name: 'אדום' },
        { color: '#f97316', name: 'כתום' },
        { color: '#eab308', name: 'צהוב' },
        { color: '#84cc16', name: 'ירוק בהיר' },
        { color: '#22c55e', name: 'ירוק' },
        { color: '#14b8a6', name: 'טורקיז' },
        { color: '#06b6d4', name: 'תכלת' },
        { color: '#3b82f6', name: 'כחול' },
        { color: '#6366f1', name: 'סגול כחול' },
        { color: '#8b5cf6', name: 'סגול' },
        { color: '#a855f7', name: 'סגול בהיר' },
        { color: '#ec4899', name: 'ורוד' },
        { color: '#f43f5e', name: 'ורוד כהה' },
        { color: '#78716c', name: 'חום' }
    ];
    
    // Stickers/Emojis
    const stickers = [
        '⭐', '❤️', '😊', '🌈', '🌸', '🦋', 
        '🐶', '🐱', '🦁', '🐘', '🚗', '✈️'
    ];
    
    const toolbarY = stage.height() - toolbarHeight;
    const buttonGap = 5;
    const maxButtonSize = 45;
    
    // Calculate responsive button size for colors (first row)
    const totalColorButtons = colors.length + 2; // colors + eraser + clear
    const availableWidth = stage.width() - 40;
    const colorButtonSize = Math.min(maxButtonSize, (availableWidth - (totalColorButtons - 1) * buttonGap) / totalColorButtons);
    
    // First row: Colors + Eraser + Clear
    const firstRowY = toolbarY + 5;
    let currentX = 20;
    
    colors.forEach((colorData, index) => {
        const colorGroup = new Konva.Group({
            x: currentX,
            y: firstRowY
        });
        
        const colorBox = new Konva.Rect({
            width: colorButtonSize,
            height: colorButtonSize,
            fill: colorData.color,
            stroke: currentColor === colorData.color && currentTool === 'brush' ? '#000000' : '#d1d5db',
            strokeWidth: currentColor === colorData.color && currentTool === 'brush' ? 4 : 2,
            cornerRadius: 8,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 }
        });
        colorGroup.add(colorBox);
        
        // Add border for white color visibility
        if (colorData.color === '#ffffff') {
            const innerBorder = new Konva.Rect({
                width: colorButtonSize - 4,
                height: colorButtonSize - 4,
                x: 2,
                y: 2,
                stroke: '#d1d5db',
                strokeWidth: 1,
                cornerRadius: 6
            });
            colorGroup.add(innerBorder);
        }
        
        colorGroup.on('click tap', function() {
            currentColor = colorData.color;
            currentTool = 'brush';
            currentSticker = null;
            
            // Update all buttons
            updateToolSelection();
            speak(colorData.name);
        });
        
        colorGroup.on('mouseenter', function() {
            colorBox.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
        });
        
        colorGroup.on('mouseleave', function() {
            colorBox.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        colorBox.name('color-box');
        colorBox.setAttr('colorData', colorData.color);
        layer.add(colorGroup);
        
        currentX += colorButtonSize + buttonGap;
    });
    
    // Eraser button
    const eraserGroup = new Konva.Group({
        x: currentX,
        y: firstRowY
    });
    
    const eraserButton = new Konva.Rect({
        width: colorButtonSize,
        height: colorButtonSize,
        fill: '#f3f4f6',
        stroke: currentTool === 'eraser' ? '#000000' : '#d1d5db',
        strokeWidth: currentTool === 'eraser' ? 4 : 2,
        cornerRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 2 }
    });
    eraserGroup.add(eraserButton);
    
    const eraserText = new Konva.Text({
        text: '🧹',
        fontSize: Math.min(28, colorButtonSize * 0.6),
        width: colorButtonSize,
        height: colorButtonSize,
        align: 'center',
        verticalAlign: 'middle'
    });
    eraserGroup.add(eraserText);
    
    eraserGroup.on('click tap', function() {
        currentTool = 'eraser';
        currentSticker = null;
        updateToolSelection();
        speak('מחק');
    });
    
    eraserButton.name('eraser-button');
    layer.add(eraserGroup);
    
    currentX += colorButtonSize + buttonGap;
    
    // Clear button
    const clearGroup = new Konva.Group({
        x: currentX,
        y: firstRowY
    });
    
    const clearButton = new Konva.Rect({
        width: colorButtonSize,
        height: colorButtonSize,
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 2,
        cornerRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 2 }
    });
    clearGroup.add(clearButton);
    
    const clearText = new Konva.Text({
        text: '🗑️',
        fontSize: Math.min(28, colorButtonSize * 0.6),
        width: colorButtonSize,
        height: colorButtonSize,
        align: 'center',
        verticalAlign: 'middle'
    });
    clearGroup.add(clearText);
    
    clearGroup.on('click tap', function() {
        layer.find('.drawing-line, .sticker-item').forEach(item => item.destroy());
        layer.draw();
        speak('נקה הכל');
    });
    
    clearGroup.on('mouseenter', function() {
        clearButton.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
    });
    
    clearGroup.on('mouseleave', function() {
        clearButton.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    layer.add(clearGroup);
    
    // Second row: Stickers
    const secondRowY = firstRowY + colorButtonSize + buttonGap + 5;
    const totalStickerButtons = stickers.length;
    const stickerButtonSize = Math.min(maxButtonSize, (availableWidth - (totalStickerButtons - 1) * buttonGap) / totalStickerButtons);
    currentX = 20;
    
    stickers.forEach((emoji, index) => {
        const stickerGroup = new Konva.Group({
            x: currentX,
            y: secondRowY
        });
        
        const stickerBg = new Konva.Rect({
            width: stickerButtonSize,
            height: stickerButtonSize,
            fill: 'white',
            stroke: currentSticker === emoji ? '#667eea' : '#d1d5db',
            strokeWidth: currentSticker === emoji ? 4 : 2,
            cornerRadius: 8,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 }
        });
        stickerGroup.add(stickerBg);
        
        const stickerText = new Konva.Text({
            text: emoji,
            fontSize: Math.min(32, stickerButtonSize * 0.7),
            width: stickerButtonSize,
            height: stickerButtonSize,
            align: 'center',
            verticalAlign: 'middle'
        });
        stickerGroup.add(stickerText);
        
        stickerGroup.on('click tap', function() {
            currentTool = 'sticker';
            currentSticker = emoji;
            updateToolSelection();
            speak('מדבקה');
        });
        
        stickerGroup.on('mouseenter', function() {
            stickerBg.to({ scaleX: 1.1, scaleY: 1.1, duration: 0.1 });
        });
        
        stickerGroup.on('mouseleave', function() {
            stickerBg.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        stickerBg.name('sticker-button');
        stickerBg.setAttr('stickerEmoji', emoji);
        layer.add(stickerGroup);
        
        currentX += stickerButtonSize + buttonGap;
    });
    
    // Update tool selection visual feedback
    function updateToolSelection() {
        // Update color boxes
        layer.find('.color-box').forEach(box => {
            const boxColor = box.getAttr('colorData');
            if (currentTool === 'brush' && boxColor === currentColor) {
                box.stroke('#000000');
                box.strokeWidth(4);
            } else {
                box.stroke('#d1d5db');
                box.strokeWidth(2);
            }
        });
        
        // Update eraser
        const eraserBtn = layer.find('.eraser-button')[0];
        if (eraserBtn) {
            if (currentTool === 'eraser') {
                eraserBtn.stroke('#000000');
                eraserBtn.strokeWidth(4);
            } else {
                eraserBtn.stroke('#d1d5db');
                eraserBtn.strokeWidth(2);
            }
        }
        
        // Update stickers
        layer.find('.sticker-button').forEach(btn => {
            const emoji = btn.getAttr('stickerEmoji');
            if (currentTool === 'sticker' && emoji === currentSticker) {
                btn.stroke('#667eea');
                btn.strokeWidth(4);
            } else {
                btn.stroke('#d1d5db');
                btn.strokeWidth(2);
            }
        });
        
        layer.draw();
    }
    
    // Drawing functionality
    let lastLine;
    
    stage.on('mousedown touchstart', function(e) {
        const pos = stage.getPointerPosition();
        
        // Check if click is within drawing area
        if (pos.x >= drawingArea.x() && pos.x <= drawingArea.x() + drawingArea.width() &&
            pos.y >= drawingArea.y() && pos.y <= drawingArea.y() + drawingArea.height()) {
            
            if (currentTool === 'sticker' && currentSticker) {
                // Place sticker
                const sticker = new Konva.Text({
                    x: pos.x,
                    y: pos.y,
                    text: currentSticker,
                    fontSize: 40,
                    fontFamily: 'Arial',
                    offsetX: 20,
                    offsetY: 20
                });
                sticker.name('sticker-item');
                layer.add(sticker);
                layer.draw();
                playPopSound();
            } else {
                // Start drawing
                isDrawing = true;
                
                lastLine = new Konva.Line({
                    stroke: currentTool === 'eraser' ? 'white' : currentColor,
                    strokeWidth: currentTool === 'eraser' ? brushSize * 3 : brushSize,
                    globalCompositeOperation: currentTool === 'eraser' ? 'destination-out' : 'source-over',
                    lineCap: 'round',
                    lineJoin: 'round',
                    points: [pos.x, pos.y]
                });
                
                lastLine.name('drawing-line');
                layer.add(lastLine);
            }
        }
    });
    
    stage.on('mousemove touchmove', function(e) {
        if (!isDrawing || currentTool === 'sticker') return;
        
        const pos = stage.getPointerPosition();
        
        // Check if still within drawing area
        if (pos.x >= drawingArea.x() && pos.x <= drawingArea.x() + drawingArea.width() &&
            pos.y >= drawingArea.y() && pos.y <= drawingArea.y() + drawingArea.height()) {
            
            const newPoints = lastLine.points().concat([pos.x, pos.y]);
            lastLine.points(newPoints);
            layer.batchDraw();
        }
    });
    
    stage.on('mouseup touchend', function() {
        isDrawing = false;
    });
    
    layer.draw();
    
    setTimeout(() => {
        speak('לוח ציור בחר צבע או מדבקה והתחל לצייר');
    }, 100);
}
