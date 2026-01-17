// PLANT GROWING MODE - גידול צמח
function startPlantMode() {
    currentMode = 'plant';
    initStage();
    hideScore();
    
    // Stop any ongoing speech
    stopSpeech();
    
    // Plant growth stages
    let growthStage = 0; // 0=seed, 1=sprout, 2=small, 3=medium, 4=flower
    let waterLevel = 50;
    let sunLevel = 50;
    let daysPassed = 0;
    let isGrowing = false;
    
    const maxWater = 100;
    const maxSun = 100;
    const waterDecayRate = 5; // per day
    const sunDecayRate = 5; // per day
    
    function drawScene() {
        layer.destroyChildren();
        
        // Title
        const titleText = new Konva.Text({
            x: 50,
            y: 15,
            width: stage.width() - 100,
            text: '🌱 גידול צמח 🌱',
            fontSize: 28,
            fontFamily: 'Varela Round, Arial',
            fill: '#22c55e',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(titleText);
        
        // Days counter
        const daysText = new Konva.Text({
            x: 50,
            y: 50,
            width: stage.width() - 100,
            text: `יום ${daysPassed}`,
            fontSize: 20,
            fontFamily: 'Varela Round, Arial',
            fill: '#666',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(daysText);
        
        // Sky background
        const skyHeight = stage.height() * 0.6;
        const sky = new Konva.Rect({
            x: 20,
            y: 85,
            width: stage.width() - 40,
            height: skyHeight,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 0, y: skyHeight },
            fillLinearGradientColorStops: [0, '#87ceeb', 1, '#e0f2fe'],
            cornerRadius: 20
        });
        layer.add(sky);
        
        // Sun
        const sunSize = 50;
        const sun = new Konva.Circle({
            x: stage.width() - 80,
            y: 120,
            radius: sunSize / 2,
            fillRadialGradientStartPoint: { x: 0, y: 0 },
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndPoint: { x: 0, y: 0 },
            fillRadialGradientEndRadius: sunSize / 2,
            fillRadialGradientColorStops: [0, '#fef08a', 0.5, '#fbbf24', 1, '#f59e0b'],
            opacity: sunLevel / 100
        });
        layer.add(sun);
        
        // Sun rays
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const rayLength = 15;
            const ray = new Konva.Line({
                points: [
                    stage.width() - 80 + Math.cos(angle) * (sunSize / 2 + 5),
                    120 + Math.sin(angle) * (sunSize / 2 + 5),
                    stage.width() - 80 + Math.cos(angle) * (sunSize / 2 + rayLength),
                    120 + Math.sin(angle) * (sunSize / 2 + rayLength)
                ],
                stroke: '#fbbf24',
                strokeWidth: 3,
                lineCap: 'round',
                opacity: sunLevel / 100
            });
            layer.add(ray);
        }
        
        // Ground
        const groundY = 85 + skyHeight;
        const ground = new Konva.Rect({
            x: 20,
            y: groundY,
            width: stage.width() - 40,
            height: stage.height() - groundY - 150,
            fill: '#92400e',
            cornerRadius: 20
        });
        layer.add(ground);
        
        // Grass on ground
        const grass = new Konva.Rect({
            x: 20,
            y: groundY,
            width: stage.width() - 40,
            height: 20,
            fill: '#22c55e',
            cornerRadius: 20
        });
        layer.add(grass);
        
        // Plant center position
        const plantX = stage.width() / 2;
        const plantBaseY = groundY + 10;
        
        // Draw plant based on growth stage
        drawPlant(plantX, plantBaseY, growthStage, waterLevel);
        
        // Water level indicator
        const indicatorY = stage.height() - 130;
        const indicatorWidth = 150;
        const indicatorHeight = 25;
        const indicatorX = 30;
        
        // Water indicator
        const waterBg = new Konva.Rect({
            x: indicatorX,
            y: indicatorY,
            width: indicatorWidth,
            height: indicatorHeight,
            fill: '#e5e7eb',
            stroke: '#06b6d4',
            strokeWidth: 2,
            cornerRadius: 12
        });
        layer.add(waterBg);
        
        const waterFill = new Konva.Rect({
            x: indicatorX + 2,
            y: indicatorY + 2,
            width: (indicatorWidth - 4) * (waterLevel / maxWater),
            height: indicatorHeight - 4,
            fill: '#06b6d4',
            cornerRadius: 10
        });
        layer.add(waterFill);
        
        const waterIcon = new Konva.Text({
            x: indicatorX,
            y: indicatorY - 25,
            text: '💧 מים',
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: '#06b6d4',
            fontStyle: 'bold'
        });
        layer.add(waterIcon);
        
        // Sun level indicator
        const sunIndicatorX = stage.width() - indicatorX - indicatorWidth;
        const sunBg = new Konva.Rect({
            x: sunIndicatorX,
            y: indicatorY,
            width: indicatorWidth,
            height: indicatorHeight,
            fill: '#e5e7eb',
            stroke: '#f59e0b',
            strokeWidth: 2,
            cornerRadius: 12
        });
        layer.add(sunBg);
        
        const sunFill = new Konva.Rect({
            x: sunIndicatorX + 2,
            y: indicatorY + 2,
            width: (indicatorWidth - 4) * (sunLevel / maxSun),
            height: indicatorHeight - 4,
            fill: '#f59e0b',
            cornerRadius: 10
        });
        layer.add(sunFill);
        
        const sunIcon = new Konva.Text({
            x: sunIndicatorX,
            y: indicatorY - 25,
            text: '☀️ שמש',
            fontSize: 18,
            fontFamily: 'Varela Round, Arial',
            fill: '#f59e0b',
            fontStyle: 'bold'
        });
        layer.add(sunIcon);
        
        // Control buttons
        const buttonY = stage.height() - 80;
        const buttonWidth = Math.min(120, (stage.width() - 80) / 3);
        const buttonHeight = 50;
        const buttonGap = 15;
        
        // Water button
        const waterButtonX = (stage.width() - buttonWidth * 3 - buttonGap * 2) / 2;
        createButton(waterButtonX, buttonY, buttonWidth, buttonHeight, '💧 השקה', '#06b6d4', () => {
            if (waterLevel < maxWater) {
                waterLevel = Math.min(maxWater, waterLevel + 20);
                playPopSound();
                speak('השקית את הצמח');
                drawScene();
            }
        });
        
        // Sun button
        const sunButtonX = waterButtonX + buttonWidth + buttonGap;
        createButton(sunButtonX, buttonY, buttonWidth, buttonHeight, '☀️ שמש', '#f59e0b', () => {
            if (sunLevel < maxSun) {
                sunLevel = Math.min(maxSun, sunLevel + 20);
                playPopSound();
                speak('נתת שמש לצמח');
                drawScene();
            }
        });
        
        // Next day button
        const dayButtonX = sunButtonX + buttonWidth + buttonGap;
        createButton(dayButtonX, buttonY, buttonWidth, buttonHeight, '⏰ יום חדש', '#8b5cf6', () => {
            nextDay();
        });
        
        layer.draw();
    }
    
    function createButton(x, y, width, height, text, color, onClick) {
        const buttonGroup = new Konva.Group({ x, y });
        
        const buttonBg = new Konva.Rect({
            width: width,
            height: height,
            fill: color,
            cornerRadius: 12,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 8,
            shadowOffset: { x: 0, y: 4 }
        });
        buttonGroup.add(buttonBg);
        
        const buttonText = new Konva.Text({
            text: text,
            fontSize: Math.min(16, width / 8),
            fontFamily: 'Varela Round, Arial',
            fill: 'white',
            width: width,
            height: height,
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        buttonGroup.add(buttonText);
        
        buttonGroup.on('click tap', onClick);
        
        buttonGroup.on('mouseenter', function() {
            document.body.style.cursor = 'pointer';
            buttonBg.fill(adjustColor(color, -20));
            buttonGroup.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
        });
        
        buttonGroup.on('mouseleave', function() {
            document.body.style.cursor = 'default';
            buttonBg.fill(color);
            buttonGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
        });
        
        layer.add(buttonGroup);
    }
    
    function adjustColor(color, amount) {
        // Simple color darkening
        return color;
    }
    
    function drawPlant(x, y, stage, water) {
        const scale = Math.min(1, water / 50); // Plant wilts if not enough water
        
        switch(stage) {
            case 0: // Seed
                const seed = new Konva.Ellipse({
                    x: x,
                    y: y + 20,
                    radiusX: 8,
                    radiusY: 12,
                    fill: '#92400e',
                    stroke: '#78350f',
                    strokeWidth: 2
                });
                layer.add(seed);
                break;
                
            case 1: // Sprout
                const sprout = new Konva.Line({
                    points: [x, y + 20, x, y - 20],
                    stroke: '#22c55e',
                    strokeWidth: 4,
                    lineCap: 'round'
                });
                layer.add(sprout);
                
                const leaf1 = new Konva.Ellipse({
                    x: x - 10,
                    y: y,
                    radiusX: 8 * scale,
                    radiusY: 12 * scale,
                    fill: '#4ade80',
                    rotation: -30
                });
                layer.add(leaf1);
                break;
                
            case 2: // Small plant
                const stem2 = new Konva.Line({
                    points: [x, y + 20, x, y - 40],
                    stroke: '#22c55e',
                    strokeWidth: 6,
                    lineCap: 'round'
                });
                layer.add(stem2);
                
                // Leaves
                for (let i = 0; i < 3; i++) {
                    const leafY = y + 10 - i * 15;
                    const leafLeft = new Konva.Ellipse({
                        x: x - 15,
                        y: leafY,
                        radiusX: 12 * scale,
                        radiusY: 18 * scale,
                        fill: '#4ade80',
                        rotation: -40
                    });
                    layer.add(leafLeft);
                    
                    const leafRight = new Konva.Ellipse({
                        x: x + 15,
                        y: leafY,
                        radiusX: 12 * scale,
                        radiusY: 18 * scale,
                        fill: '#4ade80',
                        rotation: 40
                    });
                    layer.add(leafRight);
                }
                break;
                
            case 3: // Medium plant
                const stem3 = new Konva.Line({
                    points: [x, y + 20, x, y - 70],
                    stroke: '#16a34a',
                    strokeWidth: 8,
                    lineCap: 'round'
                });
                layer.add(stem3);
                
                // More leaves
                for (let i = 0; i < 5; i++) {
                    const leafY = y + 15 - i * 15;
                    const leafLeft = new Konva.Ellipse({
                        x: x - 20,
                        y: leafY,
                        radiusX: 15 * scale,
                        radiusY: 22 * scale,
                        fill: '#22c55e',
                        rotation: -45
                    });
                    layer.add(leafLeft);
                    
                    const leafRight = new Konva.Ellipse({
                        x: x + 20,
                        y: leafY,
                        radiusX: 15 * scale,
                        radiusY: 22 * scale,
                        fill: '#22c55e',
                        rotation: 45
                    });
                    layer.add(leafRight);
                }
                break;
                
            case 4: // Flower!
                const stem4 = new Konva.Line({
                    points: [x, y + 20, x, y - 90],
                    stroke: '#16a34a',
                    strokeWidth: 8,
                    lineCap: 'round'
                });
                layer.add(stem4);
                
                // Leaves
                for (let i = 0; i < 4; i++) {
                    const leafY = y + 10 - i * 20;
                    const leafLeft = new Konva.Ellipse({
                        x: x - 20,
                        y: leafY,
                        radiusX: 15 * scale,
                        radiusY: 22 * scale,
                        fill: '#22c55e',
                        rotation: -45
                    });
                    layer.add(leafLeft);
                    
                    const leafRight = new Konva.Ellipse({
                        x: x + 20,
                        y: leafY,
                        radiusX: 15 * scale,
                        radiusY: 22 * scale,
                        fill: '#22c55e',
                        rotation: 45
                    });
                    layer.add(leafRight);
                }
                
                // Flower center
                const flowerCenter = new Konva.Circle({
                    x: x,
                    y: y - 90,
                    radius: 15,
                    fill: '#fbbf24'
                });
                layer.add(flowerCenter);
                
                // Petals
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const petal = new Konva.Ellipse({
                        x: x + Math.cos(angle) * 20,
                        y: y - 90 + Math.sin(angle) * 20,
                        radiusX: 12,
                        radiusY: 18,
                        fill: '#ec4899',
                        rotation: (angle * 180) / Math.PI
                    });
                    layer.add(petal);
                }
                break;
        }
    }
    
    function nextDay() {
        daysPassed++;
        
        // Decay water and sun
        waterLevel = Math.max(0, waterLevel - waterDecayRate);
        sunLevel = Math.max(0, sunLevel - sunDecayRate);
        
        // Check if plant can grow
        if (waterLevel >= 30 && sunLevel >= 30 && growthStage < 4) {
            growthStage++;
            playWinSound();
            
            const messages = [
                'הזרע נבט!',
                'הצמח גדל!',
                'הצמח ממשיך לגדול!',
                'הצמח כמעט מוכן!',
                'פרח יפה! כל הכבוד!'
            ];
            speak(messages[growthStage]);
            
            if (growthStage === 4) {
                addPoints(50);
            }
        } else if (waterLevel < 20 || sunLevel < 20) {
            playErrorSound();
            speak('הצמח צריך יותר מים ושמש');
        } else {
            playPopSound();
            speak('יום חדש');
        }
        
        drawScene();
    }
    
    drawScene();
    speak('גדל צמח יפה תן לו מים ושמש');
}
