const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';

const cellElements = document.querySelectorAll(".cell");
const board = document.getElementById("board");
const winningMessage = document.querySelector("#winningMessage");
const winningMessageText = document.querySelector("#winningMessageText");
const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
] 
let xTurn;
const resetButton = document.getElementById("resetButton");
const playerChoiceForm = document.getElementById("playerChoices");
const playerChoices = { 
    player1: {
        symbol: '',
        playsFirst: ''
    },
    player2: {
        symbol: '',
        playsFirst: ''
    }
}



resetButton.addEventListener('click', initializeGame);

playerChoiceForm.addEventListener('submit', initializeGame);

function initializeGame(e){
    
    e.preventDefault(); 
    window.scrollBy(0, 1000);
    const playerMode = playerChoiceForm.elements.playerMode.value;

    playerChoices.player1.symbol = playerChoiceForm.elements.player1SymbolChoice.value;
    playerChoices.player2.symbol = playerChoices.player1.symbol=='x' ? 'circle' : 'x';
    playerChoices.player1.playsFirst = playerChoiceForm.elements.whoFirst.value=='player1' ? true : false;
    playerChoices.player2.playsFirst = !playerChoices.player1.playsFirst;

    if ( playerChoices.player1.playsFirst && playerChoices.player1.symbol=='x'){
        xTurn = true;
    } else if ( playerChoices.player2.playsFirst && playerChoices.player1.symbol=='x'){
        xTurn = false;
    } else if ( playerChoices.player1.playsFirst && playerChoices.player1.symbol=='circle'){
        xTurn = false;
    } else if (  playerChoices.player2.playsFirst &&  playerChoices.player1.symbol=='circle'){
        xTurn = true;
    }
    console.log(xTurn);

    clearBoard();
    if (playerMode==='twoPlayer'){
        twoPlayerStartGame();
    } else if (playerMode==='onePlayer'){
        onePlayerStartGame();
    }

}


function setBoardHoverClass(){   

    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (xTurn){
        board.classList.add(X_CLASS);
    } else {
        board.classList.add(CIRCLE_CLASS);
    }    

}

function placeMark(cell, classTurn){
    cell.classList.add(classTurn);
}

function switchTurn (){
    xTurn = !xTurn;
}

function handleClick(e){
    const cell = e.target;
    const classTurn = xTurn? X_CLASS : CIRCLE_CLASS;
    placeMark (cell, classTurn);

    if (checkWin(classTurn)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    } else { 
    switchTurn ();
    setBoardHoverClass();
    }
}

function checkWin(classTurn) {
    for (combinations of winningCombinations){

        if ((cellElements[combinations[0]].classList.contains(classTurn)) && (cellElements[combinations[1]].classList.contains(classTurn)) && (cellElements[combinations[2]].classList.contains(classTurn))){
            console.log("yay! This works!")
            return true;
        }   
    
    }
    return false;

}

function isDraw(){
    for (const cell of cellElements) {
        
        if (!( cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS))){
                return false;
        }
    }
    return true;

}

function endGame(draw){
    if (draw){
        winningMessageText.innerText = `Draw!`;
    } else{
        winningMessageText.innerText = `${xTurn ? "X" : "O"} Wins!`;       
    }
    winningMessage.classList.add('show');

}


function clearBoard(){

    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);

    for (const cell of cellElements) {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS); 
        cell.removeEventListener('click', handleClick);       
    }

    winningMessage.classList.remove('show');

}


function twoPlayerStartGame(){

    cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick, {once:true})        
    })
    console.log(xTurn)
    setBoardHoverClass();
}


function createBoardArray(){

    let boardArray = [];
    let tempArray = []

    for (let index = 0; index < cellElements.length; index++) {
        
        if (cellElements[index].classList.contains(X_CLASS)){
            tempArray.push(X_CLASS);

        } else if (cellElements[index].classList.contains(CIRCLE_CLASS)){
            tempArray.push(CIRCLE_CLASS);
        } else{
            tempArray.push('_');
        }


        if (index==2 || index==5 || index==8){
            boardArray.push(tempArray);
            tempArray = []; 
        }             
    
    }
    return boardArray;
}

function onePlayerStartGame(){
    


    // create board array from actual cells
    // implement minmax function to make best move
    // replicate best move on actual cell, change css property of relevant cell
    //  


    if (playerChoices.player2.playsFirst){
        implementBestMove();
        switchTurn();
    } 


    cellElements.forEach(cell => {
        cell.addEventListener('click', onePlayerHandleClick, {once:true})        
    })
    setBoardHoverClass();
}

function onePlayerHandleClick(e){

    const cell = e.target;
    console.log(cell);
    const playerClass = playerChoices.player1.symbol;
    placeMark (cell, playerClass);
    if (checkWin(playerClass)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    } else { 
    switchTurn();
    implementBestMove();    
    switchTurn();
    setBoardHoverClass();
    } 


}

function implementBestMove(){

    let board = createBoardArray();
    let bestMove = findBestMove(board);
    console.log(bestMove.row, bestMove.col);
    let cellElementIndex = (3*(bestMove.row)+1)+ bestMove.col -1;
    let computerClass = playerChoices.player2.symbol
    cellElements[cellElementIndex].classList.add(computerClass);
    if (checkWin(computerClass)){
        endGame(false);
    }  else if (isDraw()) {
        endGame(true);
    }
}

class Move{
    constructor()
    {
        let row,col;
    }
}
 
function isMovesLeft(board){

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j]=='_'){
                return true;
            }
        }
    }
    return false;
}

function evaluateBoardConditions(b){

    // Checking for Rows for X or O victory.
    for(let row = 0; row < 3; row++)
    {
        if (b[row][0] == b[row][1] &&
            b[row][1] == b[row][2])
        {
            if (b[row][0] == playerChoices.player2.symbol)
                return +10;
                    
            else if (b[row][0] == playerChoices.player1.symbol)
                return -10;
        }
    }
    

    for(let col = 0; col < 3; col++)
    {
        if (b[0][col] == b[1][col] &&
            b[1][col] == b[2][col])
        {
            if (b[0][col] == playerChoices.player2.symbol)
                return +10;
    
            else if (b[0][col] == playerChoices.player1.symbol)
                return -10;
        }
    }
    

    if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
    {
        if (b[0][0] == playerChoices.player2.symbol)
            return +10;
                
        else if (b[0][0] == playerChoices.player1.symbol)
            return -10;
    }
    
    if (b[0][2] == b[1][1] &&
        b[1][1] == b[2][0])
    {
        if (b[0][2] == playerChoices.player2.symbol)
            return +10;
                
        else if (b[0][2] == playerChoices.player1.symbol)
            return -10;
    }
    

    return 0;
}


function minimax(board, depth, isMax)
{
    let score = evaluateBoardConditions(board);
  

    if (score == 10)
        return score;
  

    if (score == -10)
        return score;
  

    if (isMovesLeft(board) == false)
        return 0;
  
    // If this maximizer's move
    if (isMax)
    {
        let best = -1000;
  
        // Traverse all cells
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                 
                // Check if cell is empty
                if (board[i][j]=='_')
                {
                     

                    board[i][j] = playerChoices.player2.symbol;
  

                    best = Math.max(best, minimax(board,
                                    depth + 1, !isMax));
  

                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
  

    else
    {
        let best = 1000;
  

        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                 
                if (board[i][j] == '_')
                {
                     

                    board[i][j] = playerChoices.player1.symbol; 

                    best = Math.min(best, minimax(board,
                                    depth + 1, !isMax));
  

                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
}

function findBestMove(board)
{
    let bestVal = -1000;
    let bestMove = new Move();
    bestMove.row = -1;
    bestMove.col = -1;
  

    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 3; j++)
        {
             
            // Check if cell is empty
            if (board[i][j] == '_')
            {
                 

                board[i][j] = playerChoices.player2.symbol;
  

                let moveVal = minimax(board, 0, false);
  

                board[i][j] = '_';
  

                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    } 
    return bestMove;
}

