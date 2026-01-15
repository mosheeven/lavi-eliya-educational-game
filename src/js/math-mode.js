// MATH MODE - חשבון
function startMathMode() {
    currentMode = 'math';
    initStage();
    hideScore();
    
    // Math problems for ages 5-6 (results 0-10)
    const mathProblems = [
        // Addition - Simple
        { question: '1 + 1', answer: 2, options: [1, 2, 3, 4] },
        { question: '1 + 2', answer: 3, options: [2, 3, 4, 5] },
        { question: '2 + 1', answer: 3, options: [2, 3, 4, 5] },
        { question: '2 + 2', answer: 4, options: [2, 3, 4, 5] },
        { question: '3 + 1', answer: 4, options: [2, 3, 4, 5] },
        { question: '1 + 3', answer: 4, options: [2, 3, 4, 5] },
        { question: '3 + 2', answer: 5, options: [3, 4, 5, 6] },
        { question: '2 + 3', answer: 5, options: [3, 4, 5, 6] },
        { question: '4 + 1', answer: 5, options: [3, 4, 5, 6] },
        { question: '1 + 4', answer: 5, options: [3, 4, 5, 6] },
        { question: '3 + 3', answer: 6, options: [4, 5, 6, 7] },
        { question: '4 + 2', answer: 6, options: [4, 5, 6, 7] },
        { question: '2 + 4', answer: 6, options: [4, 5, 6, 7] },
        { question: '5 + 1', answer: 6, options: [4, 5, 6, 7] },
        { question: '5 + 2', answer: 7, options: [5, 6, 7, 8] },
        { question: '2 + 5', answer: 7, options: [5, 6, 7, 8] },
        { question: '4 + 3', answer: 7, options: [5, 6, 7, 8] },
        { question: '3 + 4', answer: 7, options: [5, 6, 7, 8] },
        { question: '4 + 4', answer: 8, options: [6, 7, 8, 9] },
        { question: '5 + 3', answer: 8, options: [6, 7, 8, 9] },
        { question: '3 + 5', answer: 8, options: [6, 7, 8, 9] },
        { question: '6 + 2', answer: 8, options: [6, 7, 8, 9] },
        { question: '5 + 4', answer: 9, options: [7, 8, 9, 10] },
        { question: '4 + 5', answer: 9, options: [7, 8, 9, 10] },
        { question: '6 + 3', answer: 9, options: [7, 8, 9, 10] },
        { question: '5 + 5', answer: 10, options: [8, 9, 10, 11] },
        { question: '6 + 4', answer: 10, options: [8, 9, 10, 11] },
        { question: '7 + 3', answer: 10, options: [8, 9, 10, 11] },
        
        // Subtraction - Simple
        { question: '2 - 1', answer: 1, options: [0, 1, 2, 3] },
        { question: '3 - 1', answer: 2, options: [1, 2, 3, 4] },
        { question: '3 - 2', answer: 1, options: [0, 1, 2, 3] },
        { question: '4 - 1', answer: 3, options: [2, 3, 4, 5] },
        { question: '4 - 2', answer: 2, options: [1, 2, 3, 4] },
        { question: '4 - 3', answer: 1, options: [0, 1, 2, 3] },
        { question: '5 - 1', answer: 4, options: [3, 4, 5, 6] },
        { question: '5 - 2', answer: 3, options: [2, 3, 4, 5] },
        { question: '5 - 3', answer: 2, options: [1, 2, 3, 4] },
        { question: '5 - 4', answer: 1, options: [0, 1, 2, 3] },
        { question: '6 - 1', answer: 5, options: [4, 5, 6, 7] },
        { question: '6 - 2', answer: 4, options: [3, 4, 5, 6] },
        { question: '6 - 3', answer: 3, options: [2, 3, 4, 5] },
        { question: '6 - 4', answer: 2, options: [1, 2, 3, 4] },
        { question: '7 - 2', answer: 5, options: [4, 5, 6, 7] },
        { question: '7 - 3', answer: 4, options: [3, 4, 5, 6] },
        { question: '7 - 4', answer: 3, options: [2, 3, 4, 5] },
        { question: '8 - 2', answer: 6, options: [5, 6, 7, 8] },
        { question: '8 - 3', answer: 5, options: [4, 5, 6, 7] },
        { question: '8 - 4', answer: 4, options: [3, 4, 5, 6] },
        { question: '9 - 4', answer: 5, options: [4, 5, 6, 7] },
        { question: '10 - 5', answer: 5, options: [4, 5, 6, 7] },
        { question: '10 - 3', answer: 7, options: [6, 7, 8, 9] }
    ];
    
    // Shuffle and select 10 problems
    const selectedProblems = mathProblems.sort(() => Math.random() - 0.5).slice(0, 10);
    let currentProblem = 0;
    let correctAnswers = 0;
    
    function showProblem() {
        layer.destroyChildren();
        
        if (currentProblem >= selectedProblems.length) {
            // Math session complete
            const finalText = new Konva.Text({
                x: 0,
                y: stage.height() / 2 - 80,
                width: stage.width(),
                text: 'כל הכבוד',
                fontSize: 50,
                fontFamily: 'Arial',
                fill: '#667eea',
                align: 'center',
                fontStyle: 'bold'
            });
            layer.add(finalText);
            
            const scoreText = new Konva.Text({
                x: 0,
                y: stage.height() / 2,
                width: stage.width(),
                text: `ענית נכון על ${correctAnswers} מתוך ${selectedProblems.length} שאלות`,
                fontSize: 30,
                fontFamily: 'Arial',
                fill: '#764ba2',
                align: 'center'
            });
            layer.add(scoreText);
            
            layer.draw();
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedProblems.length} שאלות`);
            return;
        }
        
        const problem = selectedProblems[currentProblem];
        
        // Problem text with large numbers
        const problemText = new Konva.Text({
            x: 50,
            y: 80,
            width: stage.width() - 100,
            text: `כמה זה?`,
            fontSize: 32,
            fontFamily: 'Arial',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(problemText);
        
        // Math equation - extra large, forced LTR with Unicode markers
        const ltrMark = '\u200E'; // Left-to-Right Mark
        const equationText = new Konva.Text({
            x: 50,
            y: 140,
            width: stage.width() - 100,
            text: ltrMark + problem.question + ' = ?' + ltrMark,
            fontSize: 60,
            fontFamily: 'Arial',
            fill: '#667eea',
            align: 'center',
            fontStyle: 'bold'
        });
        layer.add(equationText);
        
        // Progress indicator
        const progressText = new Konva.Text({
            x: 50,
            y: 30,
            width: stage.width() - 100,
            text: `שאלה ${currentProblem + 1} מתוך ${selectedProblems.length}`,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#666',
            align: 'center'
        });
        layer.add(progressText);
        
        // Find correct answer index
        const correctIndex = problem.options.indexOf(problem.answer);
        
        // Options grid (2x2)
        const gridSize = 2;
        const cellWidth = 180;
        const cellHeight = 180;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 250;
        
        problem.options.forEach((option, index) => {
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
                stroke: '#f59e0b',
                strokeWidth: 4,
                cornerRadius: 20
            });
            optionGroup.add(bg);
            
            const numberText = new Konva.Text({
                text: option.toString(),
                fontSize: 90,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                width: cellWidth - 20,
                height: cellHeight - 20,
                align: 'center',
                verticalAlign: 'middle',
                fill: '#333'
            });
            optionGroup.add(numberText);
            
            optionGroup.on('click tap', function() {
                if (index === correctIndex) {
                    // Correct answer
                    bg.fill('#4ade80');
                    layer.draw();
                    playWinSound();
                    speak('נכון כל הכבוד');
                    correctAnswers++;
                    
                    setTimeout(() => {
                        currentProblem++;
                        showProblem();
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
        
        // Speak the problem
        setTimeout(() => speak(`כמה זה ${problem.question}`), 500);
    }
    
    showProblem();
}
