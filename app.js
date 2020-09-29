//change cheat activation to a button



document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const startBtn = document.querySelector('#start_button')
    let isGamePaused = false

    startBtn.addEventListener('click', () =>{
        if(isGameOver !== true){
            if(timerID){
                clearInterval(timerID)
                timerID = null
                isGamePaused = true
                startBtn.innerHTML = 'Unpause'
            }else{
                draw()
                timerID = setInterval(moveDown, speed)
                isGamePaused = false
                startBtn.innerHTML = 'Pause';
                displayShape()
           }
        }else{
            gameRestart()
        }
        
    })
    
    const width = 10;
    let nextRandom = 0;
    let timerID;
    let score = 0;
    let speed = 1000;
    // let eventInput = null
    
   
    const devCompleteBtn = document.querySelector('#dev_complete_row');
    const devCompleteFourBtn = document.querySelector('#dev_complete_four');
   


    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]
    
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]
    
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const colors = [
        '#F0CF65',
        '#FBFF12',
        '#41EAD4',
        '#AAAAAA',
        '#E71D36',

    ]

    // const myShape = [
    //     [0,1,2,width, width + 2,width * 2,width * 2 + 1,width * 2 + 2],
    //     [0,1,2,width, width + 2,width * 2,width * 2 + 1,width * 2 + 2],
    //     [0,1,2,width, width + 2,width * 2,width * 2 + 1,width * 2 + 2],
    //     [0,1,2,width, width + 2,width * 2,width * 2 + 1,width * 2 + 2],
    // ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    
    let currentPosition = 4
    let currentRotation = 0
    
    let random =  Math.floor(Math.random()*theTetrominos.length)
    let currentShape = theTetrominos[random][currentRotation]


    function draw(){
        //console.log(currentShape)
        currentShape.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        } );
    }

    function undraw(){
        currentShape.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    function freeze() {
        if(currentShape.some(index => squares[currentPosition + width + index].classList.contains('taken'))){
            currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //new tetrimino
            newTetromino()
            displayShape(); 
            rowRemove();
            updateScore();
            draw();
            gameOver();
        }
    }
    function newTetromino(){
        currentPosition = 4;
        currentRotation = 0
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominos.length)
        currentShape = theTetrominos[random][currentRotation]
    }
    function moveLeft(){
        undraw();
        const isAtLeftEdge = currentShape.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge){currentPosition -= 1 }

        if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){currentPosition += 1};
        emojiGenerator(0);
        draw()
    }

    function moveRight(){
        undraw();

        const isAtRightEdge = currentShape.some(index => (currentPosition + index) % width === width-1)

        if(!isAtRightEdge){currentPosition += 1 }

        if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){currentPosition -= 1};
        emojiGenerator(0);
        draw()

    }

    function rotate(){
        undraw()

        const isAtRightEdge = currentShape.some(index => (currentPosition + index) % width === width-1)
        const isAtLeftEdge = currentShape.some(index => (currentPosition + index) % width === 0)
        
        if(currentRotation < 3 && !isAtLeftEdge &&!isAtRightEdge){
            if(currentPosition % width === width-3 && checkBadRotation(currentShape,iTetromino[0])){
                currentPosition --;
            };    
            currentRotation++;
            
           }else if(currentRotation == 3 && !isAtLeftEdge && !isAtRightEdge){
            currentRotation = 0;
           }
       
        currentShape = theTetrominos[random][currentRotation];

        draw()
    }

    function checkBadPlacement(){
        if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){
            return true;
        }else{
            return false;
        }
    }

    function checkBadRotation(shape,arr){
        if(shape.length !== arr.length){
            return false;
        }for(let i = shape.length -1; i > 0; i--) {
            if(shape[i] !== arr[i]){
                return false;
            }return true;
        }
    }
       //return shape.every(index => {shape[index] == array[index]}) ? true : false
    
    //assign functions to keyCodes
  function control(e) {
      if(!isGameOver && !isGamePaused){
        if(e.keyCode === 37) {
        moveLeft()
        } else if (e.keyCode === 39) {
        moveRight()
        } else if (e.keyCode === 38) {
        rotate()
        } else if (e.keyCode === 40) {
        moveDown()
        } 
    }
  }
    document.addEventListener('keyup', control)
    
    function moveDown() {
        if(isGameOver !== true){
        undraw();
        currentPosition += width;
        if(checkBadPlacement()){
            currentPosition -= width
        };
        emojiGenerator(null)
        checkStackHeight()
        draw();
        freeze();}
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
  
    //the Tetrominos without rotations
    const upNextTetrominoes = [
      [displayWidth +1, displayWidth +2, displayWidth*2+1, displayWidth*3 +1], //lTetromino
      [displayWidth*3 + 1, displayWidth * 2 +1, displayWidth *2 +2, displayWidth+2], //zTetromino
      [displayWidth *2, displayWidth *2 +1, displayWidth *2 +2, displayWidth+1], //tTetromino
      [displayWidth +1, displayWidth+2, displayWidth*2+1, displayWidth*2 +2], //oTetromino
      [, displayWidth*2, displayWidth*2+1, displayWidth*2+2, displayWidth*2+3] //iTetromino
    ]
  
    //display the shape in the mini-grid display
    function displayShape() {
      //remove any trace of a tetromino form the entire grid
      displaySquares.forEach(square => {
        square.classList.remove('tetrimino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetrimino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }

    devCompleteBtn.addEventListener('click', () => {
        let i = 200 - width;
        const row = [i, i +1, i +2,i +3,i +4,i +5,i +6,i +7,i +8,i +9]

        row.forEach(index => {
                squares[index].classList.add('taken')
                squares[index].classList.add('tetrimino');
            })
        })

        devCompleteFourBtn.addEventListener('click', () => {
            for(let i = 200 - width; i >= (200 - (width * 4)); i -=width){;
                const row = [i, i +1, i +2,i +3,i +4,i +5,i +6,i +7,i +8,i +9];
                row.forEach(index => {
                    squares[index].classList.add('taken')
                    squares[index].classList.add('tetrimino');
                })
            }
        })

    

    function rowRemove() {
        let numOfRows = 0
        for(let i = 0; i < 199; i += width){
             
            const row = [i, i +1, i +2,i +3,i +4,i +5,i +6,i +7,i +8,i +9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                levelUp()
                numOfRows++
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetrimino');
                    squares[index].style.backgroundColor = '';
                })
                
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell=> grid.appendChild(cell))
                
                
            }     
           
        }   
        rowDeleteEmoji(numOfRows)
        numOfRows = 0;
    }

    function rowDeleteEmoji(numOfRows){
        if(numOfRows >= 4){
            emojiGenerator(3)
        }else if(numOfRows > 0){
            emojiGenerator(2)
        }
    }

    let isGameOver = false
    function gameOver(){
        if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){
            emojiGenerator(666);
            isGameOver = true
            setTimeout(() => {alert('GameOver! Final Score:' + score)}, 500)
            startBtn.innerHTML = 'try Again..'
            clearInterval(timerID)
             
        };
    }

    function levelUp(){
            score += 10;
            updateScore()
            clearInterval(timerID)
            if(speed >= 500){
                speed *= 0.85;
                score += 10;
            }else if( speed >= 300 && speed < 500){
                speed *= 0.90;
                score += 25;
            }else if( speed <= 300 && speed > 100){
                speed *= 0.95
                score += 50;
            }else if( speed <= 100){
                score += 150;
            }
            timerID = setInterval(moveDown, speed);
            
    }

    let cheatsActive = false;
    const activateCheats = document.getElementById('activateCheats')
    const cheatsBox = document.getElementById('cheats')

    activateCheats.onclick = () => {
        if(cheatsActive !== true){
            cheatsActive = true
            cheatsBox.classList.remove('hidden')
            cheatsBox.classList.add('inline')
            console.log(cheatsActive)

        }else{
            cheatsBox.classList.remove('inline');
            cheatsBox.classList.add('hidden');
            cheatsActive = false;
            console.log(cheatsActive)
        }
    }
    function updateScore(){
        const ScoreDisplay = document.querySelector('#score')
        ScoreDisplay.innerHTML = score
    }

    function checkStackHeight(){
        for(let i = 0; i < 10 * width; i+= width ){
            const row = [i, i +1, i +2,i +3,i +4,i +5,i +6,i +7,i +8,i +9]
            if(row.some(index => squares[index].classList.contains('taken'))){
                emojiGenerator(5);
            }
        }
        
    }
    

    const hardnessEmoji = [
        '🐌', //snail 0
        '🐇', //rabbit 1 
        '🏃', //man running 2
        '🏎️',//racecar3
    ]
    const events = {
        0: {
            emoji: '🦀',
            type: "movement",
            layer: 1, //sideways crab 1
            time: 250,
        },

        1: {
            emoji: '🙃',
            type: "movement",
            layer: 1, 
            time: 500,
        },

        2: {
            emoji: '👍',
            type: "reward",
            layer: 3,
            time: 5000
        },

        3:  {
            emoji: '🌟',
            type: "reward",
            layer: 4, 
            time: 5000,
        },

        4: {
            emoji: '😬',
            type: "status",
            layer: 2, 
            time: 2000,
        },

        5: {
            emoji: '😱',
            type: "status",
            layer: 2, 
            time: 1000,
        },

        6: {
            emoji: '🔥',
            type: "reward",
            layer: 5, 
            time: 5000,
        },

        7: {
            emoji: '🙏',
            type: "status",
            layer: 1, 
            time: 3500,
        },

        666: {
            emoji: '⚰️',
            type: "end",
            layer: 10, 
            time: "10000",
        }

    }


    function gameRestart(){
        for(let i = 0; i < 199; i += width){
            const row = [i, i +1, i+2,i +3,i +4,i +5,i +6,i +7,i +8,i +9]
            row.forEach(cell => {
                squares[cell].classList.remove('taken');
                squares[cell].classList.remove('tetrimino')
                squares[cell].style.backgroundColor = '';
            })
        }
        newTetromino()
        
        timerID = setInterval(moveDown, speed)
        startBtn.innerHTML = 'Pause'
        isGameOver = false;
        score = 0;
        speed = 1000;
        updateScore();
        displayShape()
        draw()
    }
    

    let output = null;

   function emojiGenerator(eventInput){
       const view = document.getElementById('response');
        if(eventInput == null && output == null){
            if(speed > 500){
                view.innerHTML= hardnessEmoji[0]
            }else if( speed >= 300 && speed < 500){
                view.innerHTML= hardnessEmoji[1]
            }else if( speed <= 300 && speed > 100){
                view.innerHTML= hardnessEmoji[2]
            }else if( speed <= 100){
                view.innerHTML= hardnessEmoji[3]
            }
        }else if(eventInput !== null && events[eventInput].layer >= output){
            view.innerHTML= events[eventInput].emoji
            output = events[eventInput].layer
            setTimeout(() =>{output = null}, events[eventInput].time)
        }

        
   }

   


    //restore default after x seconds   
})