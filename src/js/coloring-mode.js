// COLORING/DRAWING MODE - צביעה
function startColoringMode() {
    currentMode = 'coloring';
    initStage();
    hideScore();
    
    // Stop any ongoing speech when starting
    stopSpeech();
    
    // Show template selection screen first
    showTemplateSelection();
}

function showTemplateSelection() {
    layer.destroyChildren();
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 30,
        width: stage.width() - 100,
        text: '🎨 בחר דף לצביעה 🎨',
        fontSize: 32,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    const templates = [
        { name: 'דף ריק', emoji: '📄', type: 'blank' },
        { name: 'פרח', emoji: '🌸', type: 'flower' },
        { name: 'בית', emoji: '🏠', type: 'house' },
        { name: 'חתול', emoji: '🐱', type: 'cat' },
        { name: 'מכונית', emoji: '🚗', type: 'car' },
        { name: 'עץ', emoji: '🌳', type: 'tree' },
        { name: 'שמש', emoji: '☀️', type: 'sun' },
        { name: 'לב', emoji: '❤️', type: 'heart' }
    ];
    
    // Calculate responsive grid
    const cols = stage.width() < 600 ? 2 : 4;
    const rows = Math.ceil(templates.length / cols);
    const cardWidth = Math.min(150, (stage.width() - 60 - (cols - 1) * 15) / cols);
    const cardHeight = cardWidth * 1.2;
    const startY = 100;
    const gapX = 15;
    const gapY = 15;
    
    templates.forEach((template, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const totalWidth = cols * cardWidth + (cols - 1) * gapX;
        const startX = (stage.width() - totalWidth) / 2;
        const x = startX + col * (cardWidth + gapX);
        const y = startY + row * (cardHeight + gapY);
        
        const cardGroup = new Konva.Group({
            x: x,
            y: y
        });
        
        const card = new Konva.Rect({
            width: cardWidth,
            height: cardHeight,
            fill: 'white',
            stroke: '#667eea',
            strokeWidth: 3,
            cornerRadius: 15,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 }
        });
        cardGroup.add(card);
        
        const emojiText = new Konva.Text({
            text: template.emoji,
            fontSize: cardWidth * 0.4,
            width: cardWidth,
            height: cardHeight * 0.6,
            align: 'center',
            verticalAlign: 'middle'
        });
        cardGroup.add(emojiText);
        
        const nameText = new Konva.Text({
            x: 0,
            y: cardHeight * 0.65,
            width: cardWidth,
            text: template.name,
            fontSize: Math.min(20, cardWidth * 0.15),
            fontFamily: 'Varela Round, Arial',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        });
        cardGroup.add(nameText);
        
        cardGroup.on('click tap', function() {
            card.fill('#667eea');
            layer.draw();
            playPopSound();
            speak(template.name);
            
            setTimeout(() => {
                startDrawingWithTemplate(template.type);
            }, 300);
        });
        
        cardGroup.on('mouseenter', function() {
            card.strokeWidth(5);
            card.shadowBlur(15);
            cardGroup.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.2 });
        });
        
        cardGroup.on('mouseleave', function() {
            card.strokeWidth(3);
            card.shadowBlur(10);
            cardGroup.to({ scaleX: 1, scaleY: 1, duration: 0.2 });
        });
        
        layer.add(cardGroup);
    });
    
    layer.draw();
    speak('בחר דף לצביעה');
}

function drawTemplate(templateType, drawingArea) {
    const centerX = drawingArea.x() + drawingArea.width() / 2;
    const centerY = drawingArea.y() + drawingArea.height() / 2;
    const scale = Math.min(drawingArea.width(), drawingArea.height()) / 300;
    
    const templateLines = [];
    
    switch(templateType) {
        case 'flower':
            // Draw a simple flower
            // Center circle
            templateLines.push(createCircle(centerX, centerY, 30 * scale, '#000000'));
            // Petals
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2) / 8;
                const petalX = centerX + Math.cos(angle) * 50 * scale;
                const petalY = centerY + Math.sin(angle) * 50 * scale;
                templateLines.push(createCircle(petalX, petalY, 25 * scale, '#000000'));
            }
            // Stem
            templateLines.push(createLine([
                centerX, centerY + 30 * scale,
                centerX, centerY + 120 * scale
            ], '#000000', 4));
            // Leaves
            templateLines.push(createLine([
                centerX, centerY + 60 * scale,
                centerX - 30 * scale, centerY + 80 * scale,
                centerX, centerY + 90 * scale
            ], '#000000', 4));
            templateLines.push(createLine([
                centerX, centerY + 70 * scale,
                centerX + 30 * scale, centerY + 90 * scale,
                centerX, centerY + 100 * scale
            ], '#000000', 4));
            break;
            
        case 'house':
            // Base
            templateLines.push(createRect(centerX - 60 * scale, centerY - 20 * scale, 120 * scale, 100 * scale, '#000000'));
            // Roof
            templateLines.push(createLine([
                centerX - 70 * scale, centerY - 20 * scale,
                centerX, centerY - 70 * scale,
                centerX + 70 * scale, centerY - 20 * scale
            ], '#000000', 4));
            // Door
            templateLines.push(createRect(centerX - 15 * scale, centerY + 30 * scale, 30 * scale, 50 * scale, '#000000'));
            // Windows
            templateLines.push(createRect(centerX - 45 * scale, centerY - 5 * scale, 25 * scale, 25 * scale, '#000000'));
            templateLines.push(createRect(centerX + 20 * scale, centerY - 5 * scale, 25 * scale, 25 * scale, '#000000'));
            break;
            
        case 'cat':
            // Head
            templateLines.push(createCircle(centerX, centerY - 20 * scale, 50 * scale, '#000000'));
            // Ears
            templateLines.push(createLine([
                centerX - 35 * scale, centerY - 50 * scale,
                centerX - 20 * scale, centerY - 70 * scale,
                centerX - 10 * scale, centerY - 50 * scale
            ], '#000000', 4));
            templateLines.push(createLine([
                centerX + 10 * scale, centerY - 50 * scale,
                centerX + 20 * scale, centerY - 70 * scale,
                centerX + 35 * scale, centerY - 50 * scale
            ], '#000000', 4));
            // Eyes
            templateLines.push(createCircle(centerX - 20 * scale, centerY - 25 * scale, 8 * scale, '#000000'));
            templateLines.push(createCircle(centerX + 20 * scale, centerY - 25 * scale, 8 * scale, '#000000'));
            // Nose
            templateLines.push(createCircle(centerX, centerY - 10 * scale, 5 * scale, '#000000'));
            // Mouth
            templateLines.push(createLine([
                centerX - 15 * scale, centerY,
                centerX, centerY + 5 * scale,
                centerX + 15 * scale, centerY
            ], '#000000', 3));
            // Body
            templateLines.push(createCircle(centerX, centerY + 50 * scale, 40 * scale, '#000000'));
            // Tail
            templateLines.push(createLine([
                centerX + 35 * scale, centerY + 60 * scale,
                centerX + 60 * scale, centerY + 40 * scale,
                centerX + 70 * scale, centerY + 60 * scale
            ], '#000000', 4));
            break;
            
        case 'car':
            // Body
            templateLines.push(createRect(centerX - 70 * scale, centerY, 140 * scale, 50 * scale, '#000000'));
            // Top
            templateLines.push(createRect(centerX - 40 * scale, centerY - 30 * scale, 80 * scale, 30 * scale, '#000000'));
            // Wheels
            templateLines.push(createCircle(centerX - 40 * scale, centerY + 50 * scale, 20 * scale, '#000000'));
            templateLines.push(createCircle(centerX + 40 * scale, centerY + 50 * scale, 20 * scale, '#000000'));
            // Windows
            templateLines.push(createRect(centerX - 35 * scale, centerY - 25 * scale, 30 * scale, 20 * scale, '#000000'));
            templateLines.push(createRect(centerX + 5 * scale, centerY - 25 * scale, 30 * scale, 20 * scale, '#000000'));
            break;
            
        case 'tree':
            // Trunk
            templateLines.push(createRect(centerX - 15 * scale, centerY + 20 * scale, 30 * scale, 60 * scale, '#000000'));
            // Leaves (3 circles)
            templateLines.push(createCircle(centerX, centerY - 30 * scale, 50 * scale, '#000000'));
            templateLines.push(createCircle(centerX - 30 * scale, centerY, 40 * scale, '#000000'));
            templateLines.push(createCircle(centerX + 30 * scale, centerY, 40 * scale, '#000000'));
            break;
            
        case 'sun':
            // Center
            templateLines.push(createCircle(centerX, centerY, 50 * scale, '#000000'));
            // Rays
            for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI * 2) / 12;
                const startX = centerX + Math.cos(angle) * 60 * scale;
                const startY = centerY + Math.sin(angle) * 60 * scale;
                const endX = centerX + Math.cos(angle) * 90 * scale;
                const endY = centerY + Math.sin(angle) * 90 * scale;
                templateLines.push(createLine([startX, startY, endX, endY], '#000000', 4));
            }
            break;
            
        case 'heart':
            // Heart shape using bezier-like curves
            const heartPoints = [];
            for (let i = 0; i <= 100; i++) {
                const t = (i / 100) * Math.PI * 2;
                const x = centerX + 16 * Math.pow(Math.sin(t), 3) * scale * 3;
                const y = centerY - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale * 3;
                heartPoints.push(x, y);
            }
            templateLines.push(createLine(heartPoints, '#000000', 4));
            break;
    }
    
    return templateLines;
}

function createCircle(x, y, radius, color) {
    return new Konva.Circle({
        x: x,
        y: y,
        radius: radius,
        stroke: color,
        strokeWidth: 3,
        name: 'template-shape'
    });
}

function createRect(x, y, width, height, color) {
    return new Konva.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        stroke: color,
        strokeWidth: 3,
        name: 'template-shape'
    });
}

function createLine(points, color, strokeWidth = 3) {
    return new Konva.Line({
        points: points,
        stroke: color,
        strokeWidth: strokeWidth,
        lineCap: 'round',
        lineJoin: 'round',
        name: 'template-shape'
    });
}

function startDrawingWithTemplate(templateType) {
    layer.destroyChildren();
    
    let isDrawing = false;
    let currentColor = '#000000';
    let currentTool = 'brush'; // 'brush', 'eraser', or 'sticker'
    let currentSticker = null;
    let brushSize = 8;
    
    // Title with back button
    const titleGroup = new Konva.Group();
    
    // Back button
    const backButton = new Konva.Group({
        x: 20,
        y: 10
    });
    
    const backBg = new Konva.Rect({
        width: 80,
        height: 35,
        fill: '#667eea',
        cornerRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5
    });
    backButton.add(backBg);
    
    const backText = new Konva.Text({
        text: '← חזור',
        fontSize: 18,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        width: 80,
        height: 35,
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    backButton.add(backText);
    
    backButton.on('click tap', function() {
        showTemplateSelection();
    });
    
    backButton.on('mouseenter', function() {
        backBg.fill('#5568d3');
        layer.draw();
    });
    
    backButton.on('mouseleave', function() {
        backBg.fill('#667eea');
        layer.draw();
    });
    
    layer.add(backButton);
    
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
    
    // Draw template if not blank
    if (templateType !== 'blank') {
        const templateShapes = drawTemplate(templateType, drawingArea);
        templateShapes.forEach(shape => layer.add(shape));
    }
    
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
        // Only clear user drawings, not template shapes
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
