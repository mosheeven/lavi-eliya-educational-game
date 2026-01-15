// QUIZ MODE
function startQuizMode() {
    currentMode = 'quiz';
    initStage();
    hideScore();
    
    const questions = [
        {
            question: 'איפה הדינוזאור?',
            options: ['🦕', '🚀', '🐱', '🌳'],
            correct: 0
        },
        {
            question: 'כמה זה 1+1?',
            options: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
            correct: 1
        },
        {
            question: 'איפה הירח?',
            options: ['☀️', '🌙', '🌍', '⭐'],
            correct: 1
        },
        {
            question: 'איפה הרקטה?',
            options: ['🚗', '✈️', '🚀', '🚢'],
            correct: 2
        },
        {
            question: 'כמה זה 2+2?',
            options: ['2️⃣', '3️⃣', '4️⃣', '5️⃣'],
            correct: 2
        },
        {
            question: 'איפה הכוכב?',
            options: ['⭐', '🌙', '☀️', '🌍'],
            correct: 0
        },
        {
            question: 'איפה האות A?',
            options: ['🅰️', '🅱️', '🆎', '🔤'],
            correct: 0
        },
        {
            question: 'כמה זה 3+1?',
            options: ['2️⃣', '3️⃣', '4️⃣', '5️⃣'],
            correct: 2
        }
    ];
    
    let currentQuestion = 0;
    
    function showQuestion() {
        layer.destroyChildren();
        
        if (currentQuestion >= questions.length) {
            // Quiz complete
            const finalText = new Konva.Text({
                x: 0,
                y: stage.height() / 2 - 50,
                width: stage.width(),
                text: 'כל הכבוד סיימתם את החידון',
                fontSize: 40,
                fontFamily: 'Arial',
                fill: '#667eea',
                align: 'center'
            });
            layer.add(finalText);
            layer.draw();
            playWinSound();
            speak('כל הכבוד סיימתם את החידון');
            return;
        }
        
        const q = questions[currentQuestion];
        
        // Question text
        const questionText = new Konva.Text({
            x: 50,
            y: 50,
            width: stage.width() - 100,
            text: q.question,
            fontSize: 36,
            fontFamily: 'Arial',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(questionText);
        
        // Progress indicator
        const progressText = new Konva.Text({
            x: 50,
            y: 120,
            width: stage.width() - 100,
            text: `שאלה ${currentQuestion + 1} מתוך ${questions.length}`,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#666',
            align: 'center'
        });
        layer.add(progressText);
        
        // Options grid (2x2)
        const gridSize = 2;
        const cellWidth = 200;
        const cellHeight = 200;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 200;
        
        q.options.forEach((option, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;
            
            const optionGroup = new Konva.Group({
                x: x,
                y: y
            });
            
            const bg = new Konva.Rect({
                width: cellWidth - 20,
                height: cellHeight - 20,
                fill: 'white',
                stroke: '#764ba2',
                strokeWidth: 4,
                cornerRadius: 20
            });
            optionGroup.add(bg);
            
            const emoji = new Konva.Text({
                text: option,
                fontSize: 80,
                fontFamily: 'Arial',
                width: cellWidth - 20,
                height: cellHeight - 20,
                align: 'center',
                verticalAlign: 'middle'
            });
            optionGroup.add(emoji);
            
            optionGroup.on('click tap', function() {
                if (index === q.correct) {
                    // Correct answer
                    bg.fill('#4ade80');
                    layer.draw();
                    playWinSound();
                    speak('נכון כל הכבוד');
                    
                    setTimeout(() => {
                        currentQuestion++;
                        showQuestion();
                    }, 1500);
                } else {
                    // Wrong answer
                    bg.fill('#ef4444');
                    layer.draw();
                    playErrorSound();
                    speak('נסו שוב');
                    
                    setTimeout(() => {
                        bg.fill('white');
                        layer.draw();
                    }, 800);
                }
            });
            
            optionGroup.on('mouseenter', function() {
                bg.strokeWidth(6);
                layer.draw();
            });
            
            optionGroup.on('mouseleave', function() {
                bg.strokeWidth(4);
                layer.draw();
            });
            
            layer.add(optionGroup);
        });
        
        layer.draw();
        
        // Speak the question
        setTimeout(() => speak(q.question), 500);
    }
    
    showQuestion();
}
