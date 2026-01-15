// PUZZLE MODE - פאזל
function startPuzzleMode() {
    currentMode = 'puzzle';
    initStage();
    hideScore();
    
    // Puzzle images using emojis (4 pieces - 2x2 grid)
    const puzzles = [
        { name: 'פרפר', emojis: ['🦋', '🌸', '🌿', '☀️'] },
        { name: 'חתול', emojis: ['🐱', '🎀', '🐾', '❤️'] },
        { name: 'מכונית', emojis: ['🚗', '🛞', '🚦', '🛣️'] },
        { name: 'בית', emojis: ['🏠', '🌳', '☁️', '🌈'] },
        { name: 'ים', emojis: ['🌊', '🐠', '⛵', '☀️'] },
        { name: 'גן', emojis: ['🌻', '🦋', '🌳', '🌈'] }
    ];
    
    const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let completedPieces = 0;
    
    // Title
    const titleText = new Konva.Text({
        x: 50,
        y: 20,
        width: stage.width() - 100,
        text: '🧩 פאזל 🧩',
        fontSize: 32,
        fontFamily: 'Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(titleText);
    
    const instructionText = new Konva.Text({
        x: 50,
        y: 60,
        width: stage.width() - 100,
        text: `גרור את החלקים למקום הנכון - ${selectedPuzzle.name}`,
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#333',
        align: 'center'
    });
    layer.add(instructionText);
    
    // Puzzle grid (target area) - 2x2
    const pieceSize = 140;
    const gap = 10;
    const gridSize = 2;
    const gridWidth = gridSize * pieceSize + (gridSize - 1) * gap;
    const gridStartX = (stage.width() - gridWidth) / 2;
    const gridStartY = 120;
    
    // Create target slots
    const targetSlots = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = gridStartX + col * (pieceSize + gap);
            const y = gridStartY + row * (pieceSize + gap);
            const index = row * gridSize + col;
            
            const slot = new Konva.Rect({
                x: x,
                y: y,
                width: pieceSize,
                height: pieceSize,
                fill: '#f3f4f6',
                stroke: '#d1d5db',
                strokeWidth: 3,
                cornerRadius: 15,
                dash: [10, 5]
            });
            layer.add(slot);
            
            targetSlots.push({
                x: x,
                y: y,
                index: index,
                occupied: false
            });
        }
    }
    
    // Create puzzle pieces (shuffled at bottom)
    const pieces = selectedPuzzle.emojis.map((emoji, index) => ({ emoji, correctIndex: index }));
    pieces.sort(() => Math.random() - 0.5); // Shuffle
    
    const piecesStartY = gridStartY + gridSize * (pieceSize + gap) + 40;
    const piecesWidth = pieces.length * (pieceSize + gap);
    const piecesStartX = (stage.width() - piecesWidth) / 2;
    
    pieces.forEach((piece, displayIndex) => {
        const x = piecesStartX + displayIndex * (pieceSize + gap);
        const y = piecesStartY;
        
        const pieceGroup = new Konva.Group({
            x: x,
            y: y,
            draggable: true
        });
        
        const pieceBg = new Konva.Rect({
            width: pieceSize,
            height: pieceSize,
            fill: 'white',
            stroke: '#8b5cf6',
            strokeWidth: 4,
            cornerRadius: 15,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 5 },
            shadowOpacity: 0.3
        });
        pieceGroup.add(pieceBg);
        
        const emojiText = new Konva.Text({
            text: piece.emoji,
            fontSize: 80,
            fontFamily: 'Arial',
            width: pieceSize,
            height: pieceSize,
            align: 'center',
            verticalAlign: 'middle'
        });
        pieceGroup.add(emojiText);
        
        // Store original position
        pieceGroup.originalX = x;
        pieceGroup.originalY = y;
        pieceGroup.correctIndex = piece.correctIndex;
        pieceGroup.isPlaced = false;
        
        // Drag events
        pieceGroup.on('dragstart', function() {
            pieceGroup.moveToTop();
            pieceBg.shadowBlur(20);
            layer.draw();
        });
        
        pieceGroup.on('dragend', function() {
            pieceBg.shadowBlur(10);
            
            // Check if dropped on correct slot
            const pos = pieceGroup.position();
            let snapped = false;
            
            for (let slot of targetSlots) {
                const dx = Math.abs(pos.x - slot.x);
                const dy = Math.abs(pos.y - slot.y);
                
                if (dx < pieceSize / 2 && dy < pieceSize / 2) {
                    // Check if correct position
                    if (slot.index === pieceGroup.correctIndex && !slot.occupied) {
                        // Correct placement!
                        pieceGroup.position({ x: slot.x, y: slot.y });
                        pieceGroup.draggable(false);
                        pieceGroup.isPlaced = true;
                        slot.occupied = true;
                        
                        pieceBg.stroke('#10b981');
                        pieceBg.strokeWidth(6);
                        
                        playWinSound();
                        completedPieces++;
                        
                        // Check if puzzle complete
                        if (completedPieces === 4) {
                            setTimeout(() => {
                                layer.destroyChildren();
                                
                                const winText = new Konva.Text({
                                    x: 0,
                                    y: stage.height() / 2 - 40,
                                    width: stage.width(),
                                    text: '🎉 מעולה! השלמת את הפאזל! 🎉',
                                    fontSize: 40,
                                    fontFamily: 'Arial',
                                    fill: '#667eea',
                                    align: 'center',
                                    fontStyle: 'bold'
                                });
                                layer.add(winText);
                                layer.draw();
                                
                                playWinSound();
                                speak('מעולה השלמת את הפאזל');
                            }, 500);
                        }
                        
                        snapped = true;
                        break;
                    }
                }
            }
            
            if (!snapped && !pieceGroup.isPlaced) {
                // Return to original position
                pieceGroup.to({
                    x: pieceGroup.originalX,
                    y: pieceGroup.originalY,
                    duration: 0.3
                });
                playErrorSound();
            }
            
            layer.draw();
        });
        
        pieceGroup.on('mouseenter', function() {
            if (pieceGroup.draggable()) {
                pieceBg.strokeWidth(6);
                layer.draw();
            }
        });
        
        pieceGroup.on('mouseleave', function() {
            if (!pieceGroup.isPlaced) {
                pieceBg.strokeWidth(4);
                layer.draw();
            }
        });
        
        layer.add(pieceGroup);
    });
    
    layer.draw();
    speak(`פאזל ${selectedPuzzle.name} גרור את החלקים למקום הנכון`);
}
