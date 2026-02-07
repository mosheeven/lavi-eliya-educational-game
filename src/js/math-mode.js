// MATH MODE - חשבון
let mathDifficulty = 'easy'; // easy, medium, hard
let mathOperation = 'mixed'; // addition, subtraction, multiplication, mixed

function startMathMode() {
    currentMode = 'math';
    initStage();
    hideScore();
    startActivityMonitoring();
    updateActivity();
    
    // Show difficulty and operation selection
    showMathSettings();
}

function showMathSettings() {
    const layer = new Konva.Layer();
    stage.add(layer);
    
    // Title
    const title = new Konva.Text({
        x: 0,
        y: 30,
        width: stage.width(),
        text: 'בחר הגדרות',
        fontSize: 40,
        fontFamily: 'Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(title);
    
    // Difficulty section
    const diffTitle = new Konva.Text({
        x: 0,
        y: 90,
        width: stage.width(),
        text: 'רמת קושי:',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#333',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(diffTitle);
    
    const difficulties = [
        { level: 'easy', text: 'קל (1-10)', color: '#4ade80' },
        { level: 'medium', text: 'בינוני (1-20)', color: '#fbbf24' },
        { level: 'hard', text: 'קשה (1-50)', color: '#f87171' }
    ];
    
    const buttonWidth = 200;
    const buttonHeight = 60;
    const spacing = 15;
    let startY = 130;
    
    difficulties.forEach((diff, index) => {
        const x = (stage.width() - buttonWidth) / 2;
        const y = startY + index * (buttonHeight + spacing);
        
        const buttonGroup = new Konva.Group({ x, y });
        
        const button = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: diff.color,
            cornerRadius: 12,
            shadowColor: 'black',
            shadowBlur: 8,
            shadowOpacity: 0.3
        });
        
        const text = new Konva.Text({
            width: buttonWidth,
            height: buttonHeight,
            text: diff.text,
            fontSize: 22,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        
        buttonGroup.add(button, text);
        layer.add(buttonGroup);
        
        buttonGroup.on('mouseenter', () => {
            button.shadowBlur(12);
            buttonGroup.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
            stage.container().style.cursor = 'pointer';
            layer.draw();
        });
        
        buttonGroup.on('mouseleave', () => {
            button.shadowBlur(8);
            buttonGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
            stage.container().style.cursor = 'default';
            layer.draw();
        });
        
        buttonGroup.on('click tap', () => {
            updateActivity();
            mathDifficulty = diff.level;
            layer.destroy();
            showOperationSelection();
        });
    });
    
    layer.draw();
}

function showOperationSelection() {
    const layer = new Konva.Layer();
    stage.add(layer);
    
    // Title
    const title = new Konva.Text({
        x: 0,
        y: 50,
        width: stage.width(),
        text: 'בחר פעולה:',
        fontSize: 36,
        fontFamily: 'Arial',
        fill: '#667eea',
        align: 'center',
        fontStyle: 'bold'
    });
    layer.add(title);
    
    const operations = [
        { op: 'addition', text: 'חיבור (+)', color: '#22c55e' },
        { op: 'subtraction', text: 'חיסור (-)', color: '#f59e0b' },
        { op: 'multiplication', text: 'כפל (×)', color: '#8b5cf6' },
        { op: 'mixed', text: 'מעורב', color: '#ec4899' }
    ];
    
    const buttonWidth = 220;
    const buttonHeight = 70;
    const spacing = 20;
    const startY = 130;
    
    operations.forEach((opData, index) => {
        const x = (stage.width() - buttonWidth) / 2;
        const y = startY + index * (buttonHeight + spacing);
        
        const buttonGroup = new Konva.Group({ x, y });
        
        const button = new Konva.Rect({
            width: buttonWidth,
            height: buttonHeight,
            fill: opData.color,
            cornerRadius: 15,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.3
        });
        
        const text = new Konva.Text({
            width: buttonWidth,
            height: buttonHeight,
            text: opData.text,
            fontSize: 26,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            fontStyle: 'bold'
        });
        
        buttonGroup.add(button, text);
        layer.add(buttonGroup);
        
        buttonGroup.on('mouseenter', () => {
            button.shadowBlur(15);
            buttonGroup.to({ scaleX: 1.05, scaleY: 1.05, duration: 0.1 });
            stage.container().style.cursor = 'pointer';
            layer.draw();
        });
        
        buttonGroup.on('mouseleave', () => {
            button.shadowBlur(10);
            buttonGroup.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
            stage.container().style.cursor = 'default';
            layer.draw();
        });
        
        buttonGroup.on('click tap', () => {
            updateActivity();
            mathOperation = opData.op;
            layer.destroy();
            speak('בואו נתחיל');
            createFloatingShapes('numbers');
            startMathProblems();
        });
    });
    
    layer.draw();
}

function startMathProblems() {
    
    // Generate math problems based on difficulty and operation
    const mathProblems = generateMathProblems();
    
    function generateMathProblems() {
        const problems = [];
        let maxNum, minNum;
        
        // Set range based on difficulty
        if (mathDifficulty === 'easy') {
            maxNum = 10;
            minNum = 0;
        } else if (mathDifficulty === 'medium') {
            maxNum = 20;
            minNum = 0;
        } else { // hard
            maxNum = 50;
            minNum = 0;
        }
        
        // Generate 15 problems
        for (let i = 0; i < 15; i++) {
            let problem;
            let opType = mathOperation;
            
            // If mixed, randomly choose operation
            if (mathOperation === 'mixed') {
                const ops = ['addition', 'subtraction'];
                if (mathDifficulty !== 'easy') ops.push('multiplication');
                opType = ops[Math.floor(Math.random() * ops.length)];
            }
            
            if (opType === 'addition') {
                const a = Math.floor(Math.random() * (maxNum / 2)) + 1;
                const b = Math.floor(Math.random() * (maxNum / 2)) + 1;
                const answer = a + b;
                problem = {
                    question: `${a} + ${b}`,
                    answer: answer,
                    options: generateOptions(answer, minNum, maxNum + maxNum / 2)
                };
            } else if (opType === 'subtraction') {
                const a = Math.floor(Math.random() * maxNum) + 1;
                const b = Math.floor(Math.random() * a);
                const answer = a - b;
                problem = {
                    question: `${a} - ${b}`,
                    answer: answer,
                    options: generateOptions(answer, minNum, maxNum)
                };
            } else if (opType === 'multiplication') {
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                const answer = a * b;
                problem = {
                    question: `${a} × ${b}`,
                    answer: answer,
                    options: generateOptions(answer, 0, 100)
                };
            }
            
            problems.push(problem);
        }
        
        return problems;
    }
    
    function generateOptions(answer, min, max) {
        const options = [answer];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const option = Math.max(min, Math.min(max, answer + offset));
            if (!options.includes(option) && option !== answer) {
                options.push(option);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }
    
    // Old static problems array (kept for reference but not used)
    const oldMathProblems = [
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
    let isProcessingAnswer = false; // Prevent multiple clicks
    
    function showProblem() {
        layer.destroyChildren();
        isProcessingAnswer = false; // Reset for new question
        
        if (currentProblem >= selectedProblems.length) {
            // Math session complete - ENHANCED CELEBRATION
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
            
            // Big celebration effects
            createConfetti(stage.width() / 2, stage.height() / 2, 50);
            createStarBurst(stage.width() / 2, stage.height() / 2, 12);
            createSparkles(stage.width() / 2, stage.height() / 2, 30);
            
            playApplauseSound();
            playWinSound();
            speak(`כל הכבוד ענית נכון על ${correctAnswers} מתוך ${selectedProblems.length} שאלות`);
            return;
        }
        
        const problem = selectedProblems[currentProblem];
        
        // Randomize options array to prevent answer always being in same position
        const shuffledOptions = [...problem.options].sort(() => Math.random() - 0.5);
        const correctAnswer = problem.answer;
        
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
        
        // Find correct answer index in shuffled options
        const correctIndex = shuffledOptions.indexOf(correctAnswer);
        
        // Options grid (2x2)
        const gridSize = 2;
        const cellWidth = 180;
        const cellHeight = 180;
        const startX = (stage.width() - cellWidth * gridSize) / 2;
        const startY = 250;
        
        shuffledOptions.forEach((option, index) => {
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
                // Prevent multiple clicks while processing
                if (isProcessingAnswer) return;
                isProcessingAnswer = true;
                
                if (index === correctIndex) {
                    // Correct answer - minimal feedback
                    bg.fill('#4ade80');
                    layer.draw();
                    
                    // Just sound, no animations
                    playWinSound();
                    
                    // 🎯 USE STREAK SYSTEM - handles points, multipliers, achievements
                    const points = handleCorrectAnswer();
                    correctAnswers++;
                    
                    // Move to next problem quickly
                    registerTimer(setTimeout(() => {
                        currentProblem++;
                        showProblem();
                    }, 800));
                    
                    // Safety timeout to reset flag if animation fails
                    registerTimer(setTimeout(() => {
                        if (isProcessingAnswer) {
                            isProcessingAnswer = false;
                        }
                    }, 2000));
                } else {
                    // Wrong answer - minimal feedback
                    bg.fill('#ef4444');
                    layer.draw();
                    
                    // Just sound
                    playErrorSound();
                    
                    // 🎯 RESET STREAK on wrong answer
                    handleWrongAnswer();
                    
                    // Reset quickly
                    registerTimer(setTimeout(() => {
                        bg.fill('white');
                        layer.draw();
                        isProcessingAnswer = false; // Reset after wrong answer
                    }, 600));
                    
                    // Safety timeout to reset flag if animation fails
                    registerTimer(setTimeout(() => {
                        if (isProcessingAnswer) {
                            isProcessingAnswer = false;
                        }
                    }, 2000));
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
