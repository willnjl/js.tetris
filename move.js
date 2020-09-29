function moveLeft(){
    undraw();

    const isAtLeftEdge = currentShape.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge){currentPosition -= 1 }

    if(currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))){currentPosition += 1};

    draw()
}

function draw(){
    currentShape.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino');
    } );
}

function undraw(){
    currentShape.forEach(index => {
        squares[currentPosition + index].classList.remove('tetrimino');
    });
}

function freeze() {
    if(currentShape.some(index => squares[currentPosition + width + index].classList.contains('taken'))){
        currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //new tetrimino
        random = Math.floor(Math.random()*theTetriminos.length)
        currentPosition = 4;
        currentShape = theTetriminos[random][currentRotation]
        draw();
    }
}



//assign functions to keyCodes
function control(e) {
if(e.keyCode === 37) {
  moveLeft()
}
// } else if (e.keyCode === 38) {
//   rotate()
// } else if (e.keyCode === 39) {
//   moveRight()
// } else if (e.keyCode === 40) {
//   moveDown()
// }
}