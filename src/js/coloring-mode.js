// COLORING/DRAWING MODE - צביעה
function startColoringMode() {
    currentMode = 'coloring';
    initStage();
    hideScore();
    
    let isDrawing = false;
    let currentColor = '#000000';
    let currentTool = 'brush'; // 'brush' or 'eraser'
    let brushSize = 8;
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 10,
        width: stage.width() - 100,
        text: '🎨 לוח ציור 🎨',
        fontSize: 28,
        fontFamily: 'Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    // Drawing area
    const drawingAreaY = 50;
    const drawingAreaHeight = stage.height() - 150;
    
    const drawingArea = new Konva.Rect({
        x: 20,
        y: drawingAreaY,
        width: stage.width() - 40,
        height: drawingAreaHeight,
        fill: 'white',
        stroke: '#d1d5db',
        strokeWidth: 3,
        cornerRadius: 15
    });
    layer.add(drawingArea);
    
    // Color palette
    const colors = [
        { color: '#000000', name: 'שחור' },
        { color: '#ef4444', name: 'אדום' },
        { color: '#f59e0b', name: 'כתום' },
        { color: '#eab308', name: 'צהוב' },
        { color: '#22c55e', name: 'ירוק' },
        { color: '#3b82f6', name: 'כחול' },
        { color: '#8b5cf6', name: 'סגול' },
        { color: '#ec4899', name: 'ורוד' },
        { color: '#a855f7', name: 'סגול בהיר' },
        { color: '#ffffff', name: 'לבן' }
    ];
    
    const paletteY = stage.height() - 90;
    const colorSize = 50;
    const colorGap = 10;
    const paletteWidth = colors.length * (colorSize + colorGap);
    const paletteStartX = (stage.width() - paletteWidth) / 2;
    
    colors.forEach((colorData, index) => {
        const x = paletteStartX + index * (colorSize + colorGap);
        
        const colorGroup = new Konva.Group({
            x: x,
            y: paletteY
        });
        
        const colorBox = new Konva.Rect({
            width: colorSize,
            height: colorSize,
            fill: colorData.color,
            stroke: currentColor === colorData.color ? '#000000' : '#d1d5db',
            strokeWidth: currentColor === colorData.color ? 4 : 2,
            cornerRadius: 10,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.3
        });
        colorGroup.add(colorBox);
        
        // Add white border for white color visibility
        if (colorData.color === '#ffffff') {
            const innerBorder = new Konva.Rect({
                width: colorSize - 4,
                height: colorSize - 4,
                x: 2,
                y: 2,
                stroke: '#d1d5db',
                strokeWidth: 1,
                cornerRadius: 8
            });
            colorGroup.add(innerBorder);
        }
        
        colorGroup.on('click tap', function() {
            currentColor = colorData.color;
            currentTool = 'brush';
            
            // Update all color boxes
            layer.find('.color-box').forEach(box => {
                box.stroke('#d1d5db');
                box.strokeWidth(2);
            });
            colorBox.stroke('#000000');
            colorBox.strokeWidth(4);
            
            // Update eraser button
            eraserButton.stroke('#d1d5db');
            eraserButton.strokeWidth(2);
            
            layer.draw();
            speak(colorData.name);
        });
        
        colorGroup.on('mouseenter', function() {
            colorBox.to({
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 0.1
            });
        });
        
        colorGroup.on('mouseleave', function() {
            colorBox.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            });
        });
        
        colorBox.name('color-box');
        layer.add(colorGroup);
    });
    
    // Eraser button
    const eraserX = paletteStartX + colors.length * (colorSize + colorGap) + 20;
    const eraserGroup = new Konva.Group({
        x: eraserX,
        y: paletteY
    });
    
    const eraserButton = new Konva.Rect({
        width: colorSize,
        height: colorSize,
        fill: '#f3f4f6',
        stroke: '#d1d5db',
        strokeWidth: 2,
        cornerRadius: 10,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.3
    });
    eraserGroup.add(eraserButton);
    
    const eraserText = new Konva.Text({
        text: '🧹',
        fontSize: 30,
        width: colorSize,
        height: colorSize,
        align: 'center',
        verticalAlign: 'middle'
    });
    eraserGroup.add(eraserText);
    
    eraserGroup.on('click tap', function() {
        currentTool = 'eraser';
        eraserButton.stroke('#000000');
        eraserButton.strokeWidth(4);
        
        // Update color boxes
        layer.find('.color-box').forEach(box => {
            box.stroke('#d1d5db');
            box.strokeWidth(2);
        });
        
        layer.draw();
        speak('מחק');
    });
    
    layer.add(eraserGroup);
    
    // Clear button
    const clearX = eraserX + colorSize + 20;
    const clearGroup = new Konva.Group({
        x: clearX,
        y: paletteY
    });
    
    const clearButton = new Konva.Rect({
        width: colorSize,
        height: colorSize,
        fill: '#ef4444',
        stroke: '#dc2626',
        strokeWidth: 2,
        cornerRadius: 10,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.3
    });
    clearGroup.add(clearButton);
    
    const clearText = new Konva.Text({
        text: '🗑️',
        fontSize: 30,
        width: colorSize,
        height: colorSize,
        align: 'center',
        verticalAlign: 'middle'
    });
    clearGroup.add(clearText);
    
    clearGroup.on('click tap', function() {
        // Remove all drawing lines
        layer.find('.drawing-line').forEach(line => line.destroy());
        layer.draw();
        speak('נקה הכל');
    });
    
    clearGroup.on('mouseenter', function() {
        clearButton.to({
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 0.1
        });
    });
    
    clearGroup.on('mouseleave', function() {
        clearButton.to({
            scaleX: 1,
            scaleY: 1,
            duration: 0.1
        });
    });
    
    layer.add(clearGroup);
    
    // Drawing functionality
    let lastLine;
    
    stage.on('mousedown touchstart', function(e) {
        const pos = stage.getPointerPosition();
        
        // Check if click is within drawing area
        if (pos.x >= drawingArea.x() && pos.x <= drawingArea.x() + drawingArea.width() &&
            pos.y >= drawingArea.y() && pos.y <= drawingArea.y() + drawingArea.height()) {
            
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
    });
    
    stage.on('mousemove touchmove', function(e) {
        if (!isDrawing) return;
        
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
    speak('לוח ציור בחר צבע והתחל לצייר');
}
