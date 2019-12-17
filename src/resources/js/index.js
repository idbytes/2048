/* pseudo code
-> Initialize table with two cells filled with 2 or 4
-> Click on either of the four arrows to make the elements move
-> Create a common function for row and column, if a cell is empty shift the element, or add the number if same number is presen in adjacent cell 
-> Eg: On left arrow key press move all the elements in that possible (left)-most direction, add wherever applies
*/

let matrixSize = 4;
let randomNumArray = [2, 4];
let gameState;
let doGenerateRandom = true;
let score = 0;
let bestScore = 0;
let isGameEnd = false;
let isGameWon = false;
let gameOverDiv = document.getElementById("gameoverDiv");

// Initializes the grid
function initializeGrid() {
    gameState = [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    genRandom(gameState);
    createMatrix();
}

// Reset grid and initialize
function resetGrid(){
  gameState = [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  score=0;
  isGameEnd=false;
  isGameWon=false;
  doGenerateRandom=true;
  gameOverDiv.style.display  = "none";
  genRandom(gameState);
  renderMatrix();
}

// Generates random number at random empty cell of the 2D array
function genRandom() {
    let RandomNumber;
    let RandomIndex;
    const nonZeroindexArr = [];

    RandomNumber = randomNumArray[Math.floor(Math.random() * randomNumArray.length)];

    for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
            if (gameState[r][c] === 0) {
                nonZeroindexArr.push(r + "_" + c);
            }
        }
    }
    if (nonZeroindexArr.length > 0) {
      if(doGenerateRandom){
        RandomIndex = nonZeroindexArr[Math.floor(Math.random() * nonZeroindexArr.length)];
        gameState[RandomIndex.split("_")[0]][RandomIndex.split("_")[1]] = RandomNumber;
      }
    } else {
        isGameEnd = true;
        gameOverDiv.style.display  = "block";
    }
}

// function to create empty 4X4 table
function createMatrix() {
    let containerDiv = document.getElementById("containerDiv");
    let tbl = document.createElement("table");
    tbl.id = "tableId";

    // create rows in table
    for (var r = 0; r < matrixSize; r++) {
        var row = document.createElement("tr");

        // create cells in row
        for (let c = 0; c < matrixSize; c++) {
            let cell = document.createElement("td");
            cell.id = r + "_" + c;
            let cellText = document.createTextNode("");
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tbl.appendChild(row);
    }

    containerDiv.appendChild(tbl);
    renderMatrix();

    
}

// render matrix in HTML
function renderMatrix() {
    let containerDiv = document.getElementById("containerDiv");
    let tbl = document.createElement("table");
    tbl.id = "tableId";

    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            document.getElementById("tableId").rows[i].cells[j].innerHTML = gameState[i][j] === 0 ? null : gameState[i][j];
        }
    }

    let scoreDiv = document.getElementById("scoreDiv");
    scoreDiv.innerHTML = "Your score: "+ score + " Best score: "+ bestScore;
}

// Moves the elements in either of the 4 direction
document.onkeydown = handleKeyStroke;

function handleKeyStroke(e) {
    doGenerateRandom = false;
    if (!isGameEnd && !isGameWon) {
        if (e.keyCode == '38') {
            // up arrow
            let tansposedGameState;
            tansposedGameState = transpose(gameState);
            for (let i = 0; i < matrixSize; i++) {
                tansposedGameState[i] = addRows(tansposedGameState[i]);
            }
            gameState = transpose(tansposedGameState);
        } else if (e.keyCode == '40') {
            // down arrow
            let tansposedGameState;

            tansposedGameState = transpose(gameState);
            for (let i = 0; i < matrixSize; i++) {
                tansposedGameState[i] = addRows(tansposedGameState[i].reverse()).reverse();
            }
            gameState = transpose(tansposedGameState);
        } else if (e.keyCode == '37') {
            // left arrow
            for (let i = 0; i < matrixSize; i++) {
                gameState[i] = addRows(gameState[i]);
            }
        } else if (e.keyCode == '39') {
            // right arrow
            for (let i = 0; i < matrixSize; i++) {
                gameState[i] = addRows(gameState[i].reverse()).reverse();
            }

        }
        genRandom();
        renderMatrix();
    }
}

//
function transpose(a) {
    return a[0].map((_, c) => {
        return a.map((r) => {
            return r[c];
        });
    });
}

// function to add element of row
function addRows(arr) {
    const rowArr = [];
    const rowArr1 = [];
    let arrayLength;

    // remove all the the 0 from the row
    arr.map((val, i) => {
        if (val !== 0) {
            rowArr.push(val);
            //todo: doGenerateRandom = true; 
        }
    })

    // add the same numbers present in adjacent cell starting from left
    let i = 1;
    while (rowArr.length > 1 && rowArr[i]) {
        if (rowArr[i] === rowArr[i - 1]) {
            score += rowArr[i - 1];
            bestScore = bestScore >= score ? bestScore : score;
            rowArr[i] += rowArr[i - 1];
            if (rowArr[i] === 2048) {
                isGameWon = true;
            } else {
                rowArr[i - 1] = 0;
                doGenerateRandom = true;
            }
        } else {
            i++;
        }
    }

    // remove added 0 in above loop and push in new array
    rowArr.map((val, i) => {
        if (val !== 0) {
            rowArr1.push(val);
        }
    })

    // add 0 to all the empty cells in the row
    arrayLength = rowArr1.length;
    for (let c = 0; c < matrixSize - arrayLength; c++) {
        rowArr1.push(0);
    }

    if (JSON.stringify(rowArr1) !== JSON.stringify(arr)) {
        doGenerateRandom = true;
    }

    return rowArr1;
}

