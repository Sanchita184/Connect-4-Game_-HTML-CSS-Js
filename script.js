const board = document.querySelector("#board");
const msgContainer = document.querySelector(".msg-container-1");
const msg = document.querySelector("#msg");
const reset = document.querySelector("#reset-game");

const RED_TURN = 1;
const GREEN_TURN = 2;

const pieces = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0
]

function hasPlayerWon(playerTurn, pieces){
    for (let index = 0; index < 42; index++) {

       //horizontal pattern
       if(
            index % 7 < 4 &&
            pieces[index] === playerTurn &&
            pieces[index+1] === playerTurn &&
            pieces[index+2] === playerTurn &&
            pieces[index+3] === playerTurn
            ){
                return true;
            }

       //vertical pattern
       if(
            index < 21 &&
            pieces[index] === playerTurn &&
            pieces[index+7] === playerTurn &&
            pieces[index+14] === playerTurn &&
            pieces[index+21] === playerTurn
        ){
            return true;
        }

       //diagonal left-right pattern
       if(
            index % 7 < 4 &&
            index < 18 && 
            pieces[index] === playerTurn &&
            pieces[index+8] === playerTurn &&
            pieces[index+16] === playerTurn &&
            pieces[index+24] === playerTurn
        ){
            return true;
        }


       //diagonal right-left pattern
       if(
            index % 7 >=3 &&
            index < 21 &&
            pieces[index] === playerTurn &&
            pieces[index+6] === playerTurn &&
            pieces[index+12] === playerTurn &&
            pieces[index+18] === playerTurn
        ){
            return true;
        }
    }

    return false;
}

let playerTurn = RED_TURN;
let hoverColumn = -1;
let animating = false;

for(let i=0; i<42; i++){
    
    let cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
    cell.onmouseenter = () =>{
        onMouseEnteredColumn(i%7);
    }

    cell.onclick = () => {
        if(!animating) {
            onColumnClicked(i%7);
        }
    }
}

function onColumnClicked(column){
    let availableRow = pieces.filter( (_, index) => index%7 ===column).lastIndexOf(0);
    if(availableRow ===-1) {
        return;     //no space left in the coloumn
    }

    pieces[(availableRow*7) + column] = playerTurn;
    let  cell = board.children[(availableRow*7) + column];
    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = true;
    piece.dataset.player = playerTurn;
    cell.appendChild(piece);

    let unplacedPiece = document.querySelector("[data-placed='false']");
    let unplacedY = unplacedPiece.getBoundingClientRect().y;
    let placedY = piece.getBoundingClientRect().y;
    let yDiff = unplacedY-placedY;

    animating = true;
    removeUnplacedPiece();

    let animation = piece.animate(
        [
            { tranform:`translateY(${yDiff}px)`, offset:0},
            { tranform:`translateY(0px)`, offset:0.6},
            { tranform:`translateY(${yDiff/20}px)`, offset:0.8},
            { tranform:`translateY(0px)`, offset:0.95}
        ],
        {
            duration: 400,
            easing: "linear",
            iterations: 1
        }
    );
    animation.addEventListener('finish', checkGame)
}

function checkGame() {
    animating = false;

    // check if game is a draw
    if(!pieces.includes(0)) {
        // draw
        msg.innerText="Match draw!!!";
        msg.classList.remove("hide");
    }

    // check if the current player is the winner
    if(hasPlayerWon(playerTurn, pieces)) {

        msg.innerText=`Congratulatons! Player ${playerTurn === RED_TURN ? "Red" : "Green"} Wins!!!`;
        msg.classList.remove("hide");
        //playerTurn = 0;
    }
    if(playerTurn === RED_TURN) {
        playerTurn = GREEN_TURN;
    } 
    else {
        playerTurn = RED_TURN;
    }

    //update the colour of the piece on placing
    updateHover();
}

reset.addEventListener('click', resetGame);

 function resetGame(){
    animating = false;
   msgContainer.classList.add("hide");
   location.reload();

}

function updateHover(){
    //remove existing piece
    removeUnplacedPiece(); 

    //add piece
    if(pieces[hoverColumn] === 0) {
        let cell = board.children[hoverColumn];
        let piece = document.createElement("div");
        piece.className = "piece";
        piece.dataset.placed = false;
        piece.dataset.player = playerTurn;
        cell.appendChild(piece); 
    }
}

function removeUnplacedPiece() {
    //remove existing piece
    let unplacedPiece = document.querySelector("[data-placed='false']");
    if(unplacedPiece){
        unplacedPiece.parentElement.removeChild(unplacedPiece);
    }

}

function onMouseEnteredColumn(column){
    hoverColumn = column;
    if(!animating){
        updateHover();
    }

}