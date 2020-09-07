let canvas;
let canvasContext;

let size = 30;
let gridOffset = [size*4 + 10, 0];
let gridSize = [10, 22];
let grid = [];
let colorGrid = [];
let decsicsionTime = 1;
let holdspeed = 20;
let holdTime = 0.25
let leftHeldTimer = 0;
let rightHeldTimer = 0;
let dropDownSpeed = 20;
let framesPerSecond = 60;
let numberOfPieces = 7;
let nextPiece = [0, 0, 0, 0, 0]
let heldpiece = randomInt(numberOfPieces);
let pause = true;

//let pieceColors = ["orange", "darkblue", "purple", "lightblue", "yellow", "green", "darkred"];
let pieceColors = ["#FFDDCC", "#6EB5FF", "#D5AAFF", "#C4FAF8", "#FFFFD1", "#BFFCC6", "#FFABAB"]; // Pastel
//let pieceColors = ["#e2711d", "#274c77", "#7b2cbf", "#147df5", "#f6aa1c", "#008000", "#a71e34"];   darker pastel
let pieceBorderColors = ["#DDBBAA", "#4C93DD", "#B388DD", "#A2D8D6", "#DDDDA9", "#9DDAA4", "#DD8989"]; // pastel borders
let backGroundColor = "#222222";
let gameBoardColor = "#222222";
let topPieceColor = "#333333";
let scoreBoardColor = "#222222";
let phantomColor = "grey";

let score = 0;
let tetris = 0;
let triple = 0;
let double = 0;
let single = 0;
let lines = 0;
let level = 0;

for (let i = 0; i < nextPiece.length; i++)
{
    nextPiece.shift();
    let temp1 = randomInt(numberOfPieces);
    while (temp1 == nextPiece[nextPiece.length - 1]){temp1 = randomInt(numberOfPieces);}
    nextPiece.push(temp1);
}
let currentPieceNumber = nextPiece[0];

let llPiece = [[0, 0, 1],
               [1, 1, 1],
               [0, 0, 0]];

let lrPiece = [[1, 0, 0],
               [1, 1, 1],
               [0, 0, 0]];

let tPiece = [[0, 1, 0],
              [1, 1, 1],
              [0, 0, 0]];

let iPiece = [[0, 0, 0, 0],
              [1, 1, 1, 1],
              [0, 0, 0, 0],
              [0, 0, 0, 0]];

let bPiece = [[1, 1],
              [1, 1]];
    
let zlPiece = [[1, 1, 0],
               [0, 1, 1],
               [0, 0, 0]];

let zrPiece = [[0, 1, 1],
               [1, 1, 0],
               [0, 0, 0]];

let speed = 1;
let timer = 0;
let timerReset = 0;
let currentPiece = iPiece;
let PieceCoordinates = [[1,0],[1,1],[1,2],[1,3]];
let currentPiecePosition = [4, 0];
let phantomPiecePosition = currentPiecePosition[1];
changePiece();
const leftKey = {"keyCode": 37};
const rightKey = {"keyCode": 39};
let time = 0;
window.onload = () =>
{
    canvas = document.getElementById('tetris');
    canvasContext = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    makeGrid();
    makeColorGrid();
    setInterval(() =>
    {
        draw();
        if (!pause)
        {
            time += 1/framesPerSecond;
            leftHeld();
            rightHeld();
            if (framesPerSecond/speed <= timer)
            {
                if (!nextBottomCollided() || timer/framesPerSecond >= decsicsionTime)
                {
                    update();
                    timer = 0;
                }
                else
                {
                    timer++;
                }
            }
            else
            {
                timer++;
            }
        }
        //console.log(timer)
    }, 1000 / framesPerSecond);

    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);
}

function update()
{
    if(!bottomCollision())
    {
        currentPiecePosition[1] += 1;
    }
    clearLine();
    for (let i = 0; i < gridSize[0]; i++)
    {
        if (grid[i][1] == 1)
        {
            pause = true;
        }
    }
    timerReset = 0;
}

function draw()
{
    colorRect(gridOffset[0], gridOffset[1], size*gridSize[0], size*gridSize[1], gameBoardColor);
    for (let i = 0; i < gridSize[0]; i++)
    {
        for (let j = 0; j < gridSize[1]; j++)
        {
            //colorRect(gridOffset[0] + (i*size), gridOffset[1] + (j*size), size, size, "DarkSlateGray");
            if (grid[i][j] == 1)
            {
                colorRectTetramino(gridOffset[0] + (i*size), gridOffset[1] + (j*size), size, size, pieceBorderColors[colorGrid[i][j]], pieceColors[colorGrid[i][j]]);
            }
        }
    }
    colorRect(gridOffset[0], gridOffset[1], size*gridSize[0], size*2, topPieceColor);
    phantomPiecePosition = currentPiecePosition[1];
    while(!phantomBottomCollided())
    {
        phantomPiecePosition += 1;
    }
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        colorRect(gridOffset[0] + ((currentPiecePosition[0] + PieceCoordinates[i][1])*size), gridOffset[1] + ((phantomPiecePosition + PieceCoordinates[i][0])*size), size, size, phantomColor);
        colorRectTetramino(gridOffset[0] + ((currentPiecePosition[0] + PieceCoordinates[i][1])*size), gridOffset[1] + ((currentPiecePosition[1] + PieceCoordinates[i][0])*size), size, size, pieceBorderColors[currentPieceNumber], pieceColors[currentPieceNumber]);
    }


    
    colorRect(gridOffset[0] + size*gridSize[0], gridOffset[1] + size*2, (size*4) + 10, (size*4*nextPiece.length)+ (nextPiece.length*0), backGroundColor);
    colorRect(gridOffset[0] + size*gridSize[0], gridOffset[1], (size*4) + 10, (size*2), topPieceColor);
    canvasContext.fillStyle = "white";
    canvasContext.font = '25px roboto condensed';
    canvasContext.fillText("Next Piece", gridOffset[0] + size*gridSize[0] + 10, 40 + gridOffset[1]);
    for (let k = 0; k < nextPiece.length; k++)
    {
        for (let i = 0; i < Piece(nextPiece[k]).length; i++)
        {
            for (let j = 0; j < Piece(nextPiece[k])[0].length; j++)
            {
                //colorRect(gridOffset[0] + (i*size), gridOffset[1] + (j*size), size, size, "DarkSlateGray");
                if (nextPiece[k] == 4)
                {
                    //colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5, gridOffset[1] + (j*size) + (size*2) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], "black");
                    if (Piece(nextPiece[k])[i][j] == 1)
                    {
                        colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5, gridOffset[1] + (j*size) + (size*2) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], pieceColors[nextPiece[k]]);
                    }
                }
                else if (nextPiece[k] == 3)
                {
                    //colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5, gridOffset[1] + (j*size) + (size*2.5) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], "black");
                    if (Piece(nextPiece[k])[i][j] == 1)
                    {
                        colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5, gridOffset[1] + (j*size) + (size*2.5) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], pieceColors[nextPiece[k]]);
                    }
                }
                else
                {
                    //colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5 + (0.5*size), gridOffset[1] + (j*size) + (size*2) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], "black");
                    if (Piece(nextPiece[k])[i][j] == 1)
                    {
                        colorRectTetramino(gridOffset[0] + (i*size) + size*gridSize[0] + 5 + (0.5*size), gridOffset[1] + (j*size) + (size*2) + (size*k*4), size, size, pieceBorderColors[nextPiece[k]], pieceColors[nextPiece[k]]);
                    }
                }
                
            }
        }
    }
    colorRect(0, gridOffset[1], (size*4) + 10, (size*2), topPieceColor);
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Held Piece", 10, 40 + gridOffset[1]);
    colorRect(0, gridOffset[1] + size*2, (size*4) + 10, (size*4) + 10, backGroundColor);
    for (let i = 0; i < Piece(heldpiece).length; i++)
    {
        for (let j = 0; j < Piece(heldpiece)[0].length; j++)
        {
            //colorRect((i*size)+ 5, gridOffset[1] + (j*size) + (size*2) + 5, size, size, "Gray");
            /*if (Piece(heldpiece)[i][j] == 1)
            {
                colorRectTetramino(5 + (i*size), gridOffset[1] + (j*size) + (size*3) + 5, size, size, pieceBorderColors[heldpiece], pieceColors[heldpiece]);
            }*/
            if (heldpiece == 4)
                {
                    //colorRectTetramino((i*size) + 5, 5 + gridOffset[1] + (j*size) + (size*2), size, size, pieceBorderColors[heldpiece], "black");
                    if (Piece(heldpiece)[i][j] == 1)
                    {
                        colorRectTetramino((i*size) + 5, 5 + gridOffset[1] + (j*size) + (size*2), size, size, pieceBorderColors[heldpiece], pieceColors[heldpiece]);
                    }
                }
                else if (heldpiece == 3)
                {
                    //colorRectTetramino((i*size) + 5, gridOffset[1] + (j*size) + (size*2.5) + 5, size, size, pieceBorderColors[heldpiece], "black");
                    if (Piece(heldpiece)[i][j] == 1)
                    {
                        colorRectTetramino((i*size) + 5, gridOffset[1] + (j*size) + (size*2.5) + 5, size, size, pieceBorderColors[heldpiece], pieceColors[heldpiece]);
                    }
                }
                else
                {
                    //colorRectTetramino((i*size) + 5 + (0.5*size), gridOffset[1] + (j*size) + (size*2) + 5, size, size, pieceBorderColors[heldpiece], "black");
                    if (Piece(heldpiece)[i][j] == 1)
                    {
                        colorRectTetramino((i*size) + 5 + (0.5*size), gridOffset[1] + (j*size) + (size*2) + 5, size, size, pieceBorderColors[heldpiece], pieceColors[heldpiece]);
                    }
                }

        }
    }
    colorRect(0, gridOffset[1] + (size*6) + 10, (size*4) + 10, (size*16) - 10, scoreBoardColor);
    canvasContext.fillStyle = "white";
    canvasContext.font = '20px roboto condensed';
    canvasContext.fillText("Score", 10, (size*7) + gridOffset[1]);
    canvasContext.fillText(score, 10, 25 + (size*7) + gridOffset[1]);

    canvasContext.fillText("Level", 10, (size*9) + gridOffset[1]);
    canvasContext.fillText(level, 10, 25 + (size*9) + gridOffset[1]);

    canvasContext.fillText("Lines", 10, (size*11) + gridOffset[1]);
    canvasContext.fillText(lines, 10, 25 + (size*11) + gridOffset[1]);

    canvasContext.fillText("Tetris", 10, (size*13) + gridOffset[1]);
    canvasContext.fillText(tetris, 10, 25 + (size*13) + gridOffset[1]);

    canvasContext.fillText("Triples", 10, (size*15) + gridOffset[1]);
    canvasContext.fillText(triple, 10, 25 + (size*15) + gridOffset[1]);

    canvasContext.fillText("Doubles", 10, (size*17) + gridOffset[1]);
    canvasContext.fillText(double, 10, 25 + (size*17) + gridOffset[1]);

    canvasContext.fillText("Singles", 10, (size*19) + gridOffset[1]);
    canvasContext.fillText(single, 10, 25 + (size*19) + gridOffset[1]);

    canvasContext.fillText("Time(s)", 10, (size*21) + gridOffset[1]);
    canvasContext.fillText((Math.round(time * 100) / 100).toFixed(2), 10, 25 + (size*21) + gridOffset[1]);

    if (pause)
    {
        canvasContext.fillStyle = "white";
        canvasContext.font = '49px roboto condensed';
        canvasContext.fillText("Press S to Start", gridOffset[0] + (size*gridSize[0]/2) - 151, (size*gridSize[1]/2) + gridOffset[1]);
    }
    
}

