/*let canvas;
let canvasContext;

let grid = new Array(20).fill(new Array(10).fill(0));

let llPiece = [[1, 1, 0],
               [0, 1, 0],
               [0, 1, 0]];

let lrPiece = [[0, 1, 1],
               [0, 1, 0],
               [0, 1, 0]];

let tPiece = [[0, 1, 0],
              [1, 1, 1],
              [0, 0, 0]];

let iPiece = [[0, 0, 0, 0],
              [1, 1, 1, 1],
              [0, 0, 0, 0],
              [0, 0, 0, 0]];

let bPiece = [[1, 1],
              [1, 1]];
    
let zlPiece = [[0, 0, 0],
               [1, 1, 0],
               [0, 1, 1]];

let zrPiece = [[0, 0, 0],
               [0, 1, 1],
               [1, 1, 0]];

let timer = 0;
window.onload = () =>
{
    canvas = document.getElementById('tetris');
    canvasContext = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let framesPerSecond = 60;
    setInterval(() =>
    {
        //console.log(edges(currentPiece))
        timer++;
        draw();
        update();
    }, 1000 / framesPerSecond);

    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);
}
let allPieces = [llPiece, lrPiece, tPiece, iPiece, bPiece, zlPiece, zrPiece];
let currentPiece = iPiece;
let currentPiecePosition = [550, 50 - (40*edges(currentPiece)[1])];
let speed = 5; // squares per second
function update()
{
    if (timer % (60 / speed) == 0)
    {
        currentPiecePosition[1] += 40;
    } 

    if (currentPiecePosition[0] < 550  - (40*edges(currentPiece)[0]))
    {
        currentPiecePosition[0] = 550  - (40*edges(currentPiece)[0]);
    }
    if (currentPiecePosition[0] > 910 - (40*edges(currentPiece)[3]))
    {
        currentPiecePosition[0] = 910  - (40*edges(currentPiece)[3]);
    }
    if (currentPiecePosition[1] >= 660  - (40*edges(currentPiece)[2]))
    {
        currentPiecePosition[1] = 660  - (40*edges(currentPiece)[2]);
        for (let i = 0; i < grid.length; i++)
        {
            for (let j = 0; j < grid[0].length; j++)
            {

            }
        }
        currentPiece = allPieces[randomInt(allPieces.length)];
        currentPiecePosition = [550, 50 - (40*edges(currentPiece)[1])];
    }

}

function draw()
{
    colorRect(550, 0, 400, 850, "lightblue");
    for (let i = 0; i < currentPiece.length; i++)
    {
        for (let j = 0; j < currentPiece.length; j++)
        {
            if (currentPiece[i][j])
            {
                colorRect(currentPiecePosition[0] + (j*40),currentPiecePosition[1] + (i*40), 40, 40, "red");
            }
        }
    }
}

function colorRect(leftX, topyY, width, height, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topyY, width, height);
}

function randomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max))
}


function rotateClockwise(piece)
{

    let temp = [...Array(piece.length)].map(e => Array(piece.length));;
    for (let i = 0; i < piece.length; i++)
    {
        for (let j = 0; j < piece.length; j++)
        {
            temp[j][(piece.length - 1) - i] = piece[i][j];
        }
    }
    return temp
}

function rotateAntiClockwise(piece)
{

    let temp = [...Array(piece.length)].map(e => Array(piece.length));;
    for (let i = 0; i < piece.length; i++)
    {
        for (let j = 0; j < piece.length; j++)
        {
            temp[i][j] = piece[j][(piece.length - 1) - i];
        }
    }
    return temp
}

function edges(piece)
{
    //      left up down right
    let edges = [piece.length, piece.length, 0, 0];
    for (let i = 0; i < piece.length; i++)
    {
        for (let j = 0; j < piece.length; j++)
        {
            if (edges[0] > j && piece[i][j])
            {
                edges[0] = j;
            }

            if (edges[1] > i && piece[i][j])
            {
                edges[1] = i;
            }

            if (edges[2] < i && piece[i][j])
            {
                edges[2] = i;
            }

            if (edges[3] < j && piece[i][j])
            {
                edges[3] = j;
            }
        }
    }
    return edges
}

let upKeyDown = false;
let downKeyDown = false;
let rightKeyDown = false;
let leftKeyDown = false;

function keyUp(evt)
{
    switch(evt.keyCode)
    {
        case 37:
            leftKeyDown = false;
            break
        case 38:
            upKeyDown = false;
            break
        case 39:
            rightKeyDown = false;
            break
        case 40:
            downKeyDown = false;
            break
    }
    
}

function keyPressed(evt)
{   

        switch(evt.keyCode)
        {
            case 37:
                if (!leftKeyDown)
                {
                    currentPiecePosition[0] += -40;
                    if (currentPiecePosition[0] < 550  - (40*edges(currentPiece)[0]))
                    {
                        currentPiecePosition[0] = 550  - (40*edges(currentPiece)[0]);
                    }
                    leftKeyDown = true;
                }
                break
            case 38:
                if (!upKeyDown)
                {
                    currentPiece = rotateClockwise(currentPiece);
                    upKeyDown = true;
                    if (currentPiecePosition[0] < 550  - (40*edges(currentPiece)[0]))
                    {
                        currentPiecePosition[0] = 550  - (40*edges(currentPiece)[0]);
                    }
                    if (currentPiecePosition[0] > 910 - (40*edges(currentPiece)[3]))
                    {
                        currentPiecePosition[0] = 910  - (40*edges(currentPiece)[3]);
                    }
                }
                break
            case 39:
                if (!rightKeyDown)
                {
                    currentPiecePosition[0] += 40;
                    if (currentPiecePosition[0] > 910 - (40*edges(currentPiece)[3]))
                    {
                        currentPiecePosition[0] = 910  - (40*edges(currentPiece)[3]);
                    }
                    rightKeyDown = true;
                }
                break
            case 40:
                if (!downKeyDown)
                {
                    currentPiece = rotateAntiClockwise(currentPiece);
                    downKeyDown = true;
                    if (currentPiecePosition[0] < 550  - (40*edges(currentPiece)[0]))
                    {
                        currentPiecePosition[0] = 550  - (40*edges(currentPiece)[0]);
                    }
                    if (currentPiecePosition[0] > 910 - (40*edges(currentPiece)[3]))
                    {
                        currentPiecePosition[0] = 910  - (40*edges(currentPiece)[3]);
                    }
                }
                break
        }
        

} */