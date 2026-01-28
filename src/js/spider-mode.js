// SPIDER GAME MODE - עכביש
function startSpiderMode() {
    currentMode = 'spider';
    initStage();
    hideScore();
    
    // Stop any ongoing speech when starting
    stopSpeech();
    
    // Start activity monitoring to prevent stuck states
    startActivityMonitoring();
    
    let isDrawing = false;
    let webLines = [];
    let gameScore = 0;
    let gamePhase = 'drawing'; // 'drawing' or 'testing'
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 10,
        width: stage.width() - 100,
        text: '🕷️ משחק רשת העכביש 🕷️',
        fontSize: 28,
        fontFamily: 'Varela Round, Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    // Instructions
    const instructionText = new Konva.Text({
        x: 50,
        y: 50,
        width: stage.width() - 100,
        text: 'צייר רשת עכביש! גרור את העכביש כדי ליצור קווים',
        fontSize: 20,
        fontFamily: 'Varela Round, Arial',
        fill: '#22c55e',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(instructionText);
    
    // Score display
    const scoreText = new Konva.Text({
        x: 20,
        y: 90,
        text: `זבובים שנתפסו: ${gameScore}`,
        fontSize: 24,
        fontFamily: 'Varela Round, Arial',
        fill: '#22c55e',
        fontStyle: 'bold'
    });
    layer.add(scoreText);
    
    // Drawing area
    const drawingArea = new Konva.Rect({
        x: 20,
        y: 130,
        width: stage.width() - 40,
        height: stage.height() - 250,
        fill: 'rgba(255, 255, 255, 0.3)',
        stroke: '#d1d5db',
        strokeWidth: 3,
        cornerRadius: 15
    });
    layer.add(drawingArea);
    
    // Spider for drawing
    const spider = new Konva.Group({
        x: stage.width() / 2,
        y: 200,
        draggable: true
    });
    
    const spiderBody = new Konva.Text({
        text: '🕷️',
        fontSize: 50,
        offsetX: 25,
        offsetY: 25
    });
    spider.add(spiderBody);
    
    // Constrain spider to drawing area
    spider.dragBoundFunc(function(pos) {
        return {
            x: Math.max(drawingArea.x() + 30, Math.min(pos.x, drawingArea.x() + drawingArea.width() - 30)),
            y: Math.max(drawingArea.y() + 30, Math.min(pos.y, drawingArea.y() + drawingArea.height() - 30))
        };
    });
    
    layer.add(spider);
    
    // Current line being drawn
    let currentLine = null;
    
    // Spider drag events for drawing web
    spider.on('dragstart', function() {
        if (gamePhase !== 'drawing') return;
        
        updateActivity(); // Track user interaction
        isDrawing = true;
        currentLine = new Konva.Line({
            points: [spider.x(), spider.y()],
            stroke: '#94a3b8',
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round'
        });
        currentLine.name('web-line');
        layer.add(currentLine);
        currentLine.moveToBottom();
        drawingArea.moveToBottom();
    });
    
    spider.on('dragmove', function() {
        if (gamePhase !== 'drawing' || !isDrawing || !currentLine) return;
        
        const newPoints = currentLine.points().concat([spider.x(), spider.y()]);
        currentLine.points(newPoints);
        layer.batchDraw();
    });
    
    spider.on('dragend', function() {
        if (gamePhase !== 'drawing') return;
        
        isDrawing = false;
        if (currentLine) {
            webLines.push(currentLine);
            playPopSound();
        }
        currentLine = null;
    });
    
    // Release Flies button
    const buttonY = stage.height() - 100;
    const releaseBtnGroup = new Konva.Group({
        x: stage.width() / 2 - 100,
        y: buttonY
    });
    
    const releaseBtn = new Konva.Rect({
        width: 200,
        height: 60,
        fill: '#22c55e',
        stroke: '#16a34a',
        strokeWidth: 3,
        cornerRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 5 }
    });
    releaseBtnGroup.add(releaseBtn);
    
    const releaseBtnText = new Konva.Text({
        width: 200,
        height: 60,
        text: '🪰 שחרר זבובים! 🪰',
        fontSize: 20,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    releaseBtnGroup.add(releaseBtnText);
    
    layer.add(releaseBtnGroup);
    
    // Restart button (initially hidden)
    const restartBtnGroup = new Konva.Group({
        x: stage.width() / 2 + 120,
        y: buttonY,
        visible: false
    });
    
    const restartBtn = new Konva.Rect({
        width: 180,
        height: 60,
        fill: '#f59e0b',
        stroke: '#d97706',
        strokeWidth: 3,
        cornerRadius: 15,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffset: { x: 0, y: 5 }
    });
    restartBtnGroup.add(restartBtn);
    
    const restartBtnText = new Konva.Text({
        width: 180,
        height: 60,
        text: '🔄 התחל מחדש',
        fontSize: 20,
        fontFamily: 'Varela Round, Arial',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        fontStyle: 'bold'
    });
    restartBtnGroup.add(restartBtnText);
    
    layer.add(restartBtnGroup);
    
    restartBtnGroup.on('click tap', function() {
        playPopSound();
        startSpiderMode();
    });
    
    restartBtnGroup.on('mouseenter', function() {
        restartBtn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
    });
    
    restartBtnGroup.on('mouseleave', function() {
        restartBtn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    // Release flies function
    releaseBtnGroup.on('click tap', function() {
        if (gamePhase !== 'drawing') return;
        
        gamePhase = 'testing';
        spider.draggable(false);
        instructionText.text('הזבובים עפים! בוא נראה כמה נתפסו ברשת');
        releaseBtn.fill('#94a3b8');
        releaseBtnText.text('ממתין...');
        restartBtnGroup.visible(true);
        layer.draw();
        
        speak('הזבובים עפים');
        playWinSound();
        
        // Release flies
        releaseFlies();
    });
    
    releaseBtnGroup.on('mouseenter', function() {
        if (gamePhase === 'drawing') {
            releaseBtn.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
        }
    });
    
    releaseBtnGroup.on('mouseleave', function() {
        releaseBtn.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
    });
    
    // Release flies and check collisions
    function releaseFlies() {
        const numFlies = 15;
        const flies = [];
        
        // Debug: Check if we have web lines
        console.log('Web lines count:', webLines.length);
        if (webLines.length === 0) {
            speak('אין רשת! צייר רשת קודם');
            gamePhase = 'drawing';
            spider.draggable(true);
            releaseBtn.fill('#22c55e');
            releaseBtnText.text('🪰 שחרר זבובים! 🪰');
            restartBtnGroup.visible(false);
            layer.draw();
            return;
        }
        
        // Create flies at random positions
        for (let i = 0; i < numFlies; i++) {
            setTimeout(() => {
                const fly = new Konva.Group({
                    x: Math.random() * (drawingArea.width() - 60) + drawingArea.x() + 30,
                    y: Math.random() * (drawingArea.height() - 60) + drawingArea.y() + 30
                });
                
                const flyText = new Konva.Text({
                    text: '🪰',
                    fontSize: 40,
                    offsetX: 20,
                    offsetY: 20
                });
                fly.add(flyText);
                
                // Random movement direction
                fly.vx = (Math.random() - 0.5) * 4;
                fly.vy = (Math.random() - 0.5) * 4;
                fly.caught = false;
                
                layer.add(fly);
                flies.push(fly);
                layer.draw();
                
                playPopSound();
            }, i * 100);
        }
        
        // Animate flies
        let frameCount = 0;
        const maxFrames = 180; // 3 seconds at 60fps
        
        const anim = new Konva.Animation(function() {
            frameCount++;
            
            flies.forEach(fly => {
                if (!fly || fly.destroyed) return;
                
                // Move fly
                fly.x(fly.x() + fly.vx);
                fly.y(fly.y() + fly.vy);
                
                // Bounce off walls
                if (fly.x() < drawingArea.x() + 30 || fly.x() > drawingArea.x() + drawingArea.width() - 30) {
                    fly.vx *= -1;
                }
                if (fly.y() < drawingArea.y() + 30 || fly.y() > drawingArea.y() + drawingArea.height() - 30) {
                    fly.vy *= -1;
                }
                
                // Check collision with web lines and count immediately
                if (!fly.caught) {
                    webLines.forEach(line => {
                        if (checkFlyWebCollision(fly, line)) {
                            fly.caught = true;
                            gameScore++;
                            scoreText.text(`זבובים שנתפסו: ${gameScore}`);
                            
                            // Stick to web
                            fly.vx = 0;
                            fly.vy = 0;
                            fly.to({
                                scaleX: 0.7,
                                scaleY: 0.7,
                                rotation: Math.random() * 360,
                                duration: 0.3
                            });
                            
                            // Visual feedback when caught
                            playWinSound();
                            
                            const flash = new Konva.Circle({
                                x: fly.x(),
                                y: fly.y(),
                                radius: 30,
                                fill: '#22c55e',
                                opacity: 0.8
                            });
                            layer.add(flash);
                            flash.to({
                                radius: 60,
                                opacity: 0,
                                duration: 0.5,
                                onFinish: () => flash.destroy()
                            });
                            
                            const successText = new Konva.Text({
                                x: fly.x() - 20,
                                y: fly.y() - 50,
                                text: '✓',
                                fontSize: 40,
                                fill: '#22c55e',
                                fontStyle: 'bold'
                            });
                            layer.add(successText);
                            successText.to({
                                y: fly.y() - 80,
                                opacity: 0,
                                duration: 0.8,
                                onFinish: () => successText.destroy()
                            });
                        }
                    });
                }
            });
            
            // End animation after time limit
            if (frameCount >= maxFrames) {
                anim.stop();
                showFinalResults(flies.length);
            }
            
            layer.batchDraw();
        }, layer);
        
        anim.start();
    }
    
    // Check if fly collides with web line
    function checkFlyWebCollision(fly, line) {
        const points = line.points();
        const flyX = fly.x();
        const flyY = fly.y();
        const threshold = 35; // Increased from 25 for easier catching
        
        // Check distance to each line segment
        for (let i = 0; i < points.length - 2; i += 2) {
            const x1 = points[i];
            const y1 = points[i + 1];
            const x2 = points[i + 2];
            const y2 = points[i + 3];
            
            const dist = distanceToLineSegment(flyX, flyY, x1, y1, x2, y2);
            if (dist < threshold) {
                return true;
            }
        }
        return false;
    }
    
    // Calculate distance from point to line segment
    function distanceToLineSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSquared = dx * dx + dy * dy;
        
        if (lengthSquared === 0) {
            return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
        }
        
        let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
        t = Math.max(0, Math.min(1, t));
        
        const closestX = x1 + t * dx;
        const closestY = y1 + t * dy;
        
        return Math.sqrt((px - closestX) * (px - closestX) + (py - closestY) * (py - closestY));
    }
    
    // Show final results
    function showFinalResults(totalFlies) {
        const percentage = Math.round((gameScore / totalFlies) * 100);
        
        // Overlay
        const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            fill: 'rgba(0, 0, 0, 0.7)'
        });
        layer.add(overlay);
        
        // Results box
        const boxWidth = 400;
        const boxHeight = 300;
        const resultsBox = new Konva.Rect({
            x: stage.width() / 2 - boxWidth / 2,
            y: stage.height() / 2 - boxHeight / 2,
            width: boxWidth,
            height: boxHeight,
            fill: 'white',
            stroke: '#667eea',
            strokeWidth: 4,
            cornerRadius: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 15,
            shadowOffset: { x: 0, y: 5 }
        });
        layer.add(resultsBox);
        
        const resultsText = new Konva.Text({
            x: stage.width() / 2 - boxWidth / 2 + 20,
            y: stage.height() / 2 - boxHeight / 2 + 40,
            width: boxWidth - 40,
            text: `🎮 תוצאות המשחק! 🎮\n\nתפסת ${gameScore} מתוך ${totalFlies} זבובים!\n\n${percentage}% הצלחה! 🎉\n\n👆 לחץ לשחק שוב`,
            fontSize: 24,
            fontFamily: 'Varela Round, Arial',
            fill: '#667eea',
            align: 'center',
            fontStyle: 'bold',
            lineHeight: 1.6
        });
        layer.add(resultsText);
        
        // Add points to player
        if (currentPlayer && gameScore > 0) {
            addPoints(gameScore * 10);
        }
        
        speak(`${getCorrectMessage()} תפסת ${gameScore} זבובים`);
        playWinSound();
        
        // Click to restart
        overlay.on('click tap', () => startSpiderMode());
        resultsBox.on('click tap', () => startSpiderMode());
        resultsText.on('click tap', () => startSpiderMode());
        
        layer.draw();
    }
    
    layer.draw();
    
    setTimeout(() => {
        speak('צייר רשת עכביש ואז שחרר את הזבובים');
    }, 100);
}
