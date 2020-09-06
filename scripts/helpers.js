function colorRect(leftX, topY, width, height, color)
{
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(leftX, topY, width, height);
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX + 0.5, topY + 0.5, width - 1, height - 1);
}

function colorRectTetramino(leftX, topY, width, height, colorout, colorin)
{
    canvasContext.fillStyle = colorout;
    canvasContext.fillRect(leftX, topY, width, height);
    canvasContext.fillStyle = colorin;
    canvasContext.fillRect(leftX + 2, topY + 2, width - 4, height - 4);
    canvasContext.fillStyle = colorout;
    canvasContext.fillRect(leftX + 5, topY + 5, width - 10, height- 10);
    //canvasContext.fillStyle = colorin;
    //canvasContext.fillRect(leftX + 10, topY + 10, width - 20, height - 20);
}

function randomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max))
}

let upKeyDown = false;
let downKeyDown = false;
let rightKeyDown = false;
let leftKeyDown = false;
let spaceKeyDown = false;
let cKeyDown = false;
let xKeyDown = false;
let zKeyDown = false;

function keyUp(evt)
{
    switch(evt.keyCode)
    {
        case 32:
            spaceKeyDown = false;
            break
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
            speed = (level * 1.5)+ 1;
            downKeyDown = false;
            break
        case 67:
            cKeyDown = false;
            break
        case 88:
            xKeyDown = false;
            break
        case 90:
            zKeyDown = false;
            break
    }
    
}

let changed = false;
function keyPressed(evt)
{   

        switch(evt.keyCode)
        {
            case 32:
                if (!spaceKeyDown)
                {
                    while(!bottomCollision())
                    {
                        currentPiecePosition[1] += 1;
                    }
                    clearLine();
                    for (let i = 0; i < gridSize[0]; i++)
                    {
                        if (grid[i][1] == 1)
                        {
                            resetGrid();
                        }
                    }
                    spaceKeyDown = true;
                }      
                break
            case 37:
                if (!leftKeyDown)
                {  
                    if(!leftCollision())
                    {
                        currentPiecePosition[0] -= 1;
                    }
                    leftKeyDown = true;
                }
                break
            case 38:
                if (!upKeyDown)
                {
                    rotateClockwise();
                    upKeyDown = true;
                }
                break
            case 39:
                if (!rightKeyDown)
                {
                    
                    if(!rightCollision())
                    {
                        currentPiecePosition[0] += 1;
                    }
                    rightKeyDown = true;
                }
                break
            case 40:
                if (!downKeyDown)
                {
                    speed = dropDownSpeed;
                    downKeyDown = true;
                }
                break
            case 67:
                if (!cKeyDown)
                {
                    if(!changed)
                    {
                        switchPiece();
                    }
                    changed = true;
                    cKeyDown = true;
                }
                break
            case 88:
                if (!xKeyDown)
                {
                    rotateClockwise();
                    xKeyDown = true;
                }
                break
            case 90:
                if (!zKeyDown)
                {
                    rotateCounterClockwise();
                    zKeyDown = true;
                }
                break
        }
}

function clearLine()
{
    let linesCleared = 0;
    let temp = 0;
    for (let i = 0; i < gridSize[1]; i++)
    {
        temp = 0;
        for (let j = 0; j < gridSize[0]; j++)
        {
            if (grid[j][i] == 1)
            {
                temp++;
            }
        }
        if (temp == gridSize[0])
        {
            linesCleared++;
            for (let j = 0; j < gridSize[0]; j++)
            {
                grid[j][i] = 0;
                colorGrid[j][i] = backGroundColor;
            }
            for (let k = i; k >= 0; k--)
            {
                for (let j = 0; j < gridSize[0]; j++)
                {
                    grid[j][k] = grid[j][k-1];
                    colorGrid[j][k] = colorGrid[j][k-1];
                }
            }
        }
    }
    if (linesCleared == 1)
    {
        score += 50 * (level + 1);
        single++;
        lines++;
    }
    else if (linesCleared == 2)
    {
        score += 150 * (level + 1);
        double++;
        lines += 2;
    }
    else if (linesCleared == 3)
    {
        score += 350 * (level + 1);
        triple++;
        lines += 3;
    }
    else if (linesCleared == 4)
    {
        score += 1000 * (level + 1);
        tetris++;
        lines += 4;
    }
    if (score >= 2000 * Math.pow(1.5, level))
    {
        level++;
        speed = (level * 1.5)+ 1;
    }
    
}

function leftHeld()
{
    if (leftKeyDown && !rightKeyDown)
    {
        leftHeldTimer++;
    }
    else
    {
        leftHeldTimer = 0;
    }
    if (leftHeldTimer/framesPerSecond >= holdTime && leftHeldTimer % Math.round(framesPerSecond / holdspeed) == 0)
    {
        keyUp(leftKey);
        keyPressed(leftKey);
    }
}

function rightHeld()
{
    if (rightKeyDown && !leftKeyDown)
    {
        rightHeldTimer++;
    }
    else
    {
        rightHeldTimer = 0;
    }
    if (rightHeldTimer/framesPerSecond >= holdTime && rightHeldTimer % Math.round(framesPerSecond / holdspeed) == 0)
    {
        keyUp(rightKey);
        keyPressed(rightKey);
    }
}

function makeGrid()
{
    for (let i = 0; i < gridSize[0]; i++)
    {
        let temp = [];
        for (let j = 0; j < gridSize[1]; j++)
        {
            temp.push(0);
        }
        grid.push(temp);
    }
}

function makeColorGrid()
{
    for (let i = 0; i < gridSize[0]; i++)
    {
        let temp = [];
        for (let j = 0; j < gridSize[1]; j++)
        {
            temp.push(backGroundColor);
        }
        colorGrid.push(temp);
    }
}

function resetGrid()
{
    for (let i = 0; i < gridSize[0]; i++)
    {
        for (let j = 0; j < gridSize[1]; j++)
        {
            grid[i][j] = 0;
        }
    }
    score = 0;
    level = 0;
    speed = (level * 1.5)+ 1;
    lines = 0;
    tetris = 0;
    triple = 0;
    double = 0;
    single = 0;
    time = 0;
}

function rotateClockwise()
{
    let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));
    for (let i = 0; i < currentPiece.length; i++)
    {
        for (let j = 0; j < currentPiece.length; j++)
        {
            temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
        }
    }
    currentPiece = temp;
    getPieceCoordinates();
    while (rotateRightCollided())
    {
        //console.log("right")
        currentPiecePosition[0] -= 1;
    }
    while (rotateLeftCollided())
    {
        //console.log("left")
        currentPiecePosition[0] += 1;
    }
    let numberDisplacements = 0;
    while (rotateBottomCollided())
    {
        //console.log("bottom")
        currentPiecePosition[1] -= 1;
        numberDisplacements++;
    }
    if (numberDisplacements > 2)
    {
        currentPiecePosition[1] += numberDisplacements;
        for (let k = 0; k < 3; k++)
        {
            let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));
            for (let i = 0; i < currentPiece.length; i++)
            {
                for (let j = 0; j < currentPiece.length; j++)
                {
                    temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
                }
            }
            currentPiece = temp;
            getPieceCoordinates();
        }
    }
}

function rotateCounterClockwise()
{
    for (let k = 0; k < 3; k++)
    {
        let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));
        for (let i = 0; i < currentPiece.length; i++)
        {
            for (let j = 0; j < currentPiece.length; j++)
            {
                temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
            }
        }
        currentPiece = temp;
        getPieceCoordinates();
    }

    while (rotateRightCollided())
    {
        //console.log("right")
        currentPiecePosition[0] -= 1;
    }
    while (rotateLeftCollided())
    {
        //console.log("left")
        currentPiecePosition[0] += 1;
    }
    let numberDisplacements = 0;
    while (rotateBottomCollided())
    {
        //console.log("bottom")
        currentPiecePosition[1] -= 1;
        numberDisplacements++;
    }
    if (numberDisplacements > 2)
    {
        currentPiecePosition[1] += numberDisplacements;

        let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));
        for (let i = 0; i < currentPiece.length; i++)
        {
            for (let j = 0; j < currentPiece.length; j++)
            {
                temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
            }
        }
        currentPiece = temp;
        getPieceCoordinates();
    }
}

function rotateRightCollided()
{
    let rightCollided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[0] + PieceCoordinates[i][1]) == gridSize[0])
        {
            rightCollided = true;
            break;
        }
        /*else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][currentPiecePosition[1] + PieceCoordinates[i][0]] == 1)
        {
            rightCollided = true;
            break;
        }*/
    }
    return rightCollided
}

function rotateLeftCollided()
{
    let leftCollided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[0] + PieceCoordinates[i][1]) == -1)
        {
            leftCollided = true;
            break;
        }
        /*else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][currentPiecePosition[1] + PieceCoordinates[i][0]] == 1)
        {
            leftCollided = true;
            break;
        }*/
    }
    return leftCollided
}

function rotateBottomCollided()
{
    let bottomCollided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[1] + PieceCoordinates[i][0]) == gridSize[1])
        {
            bottomCollided = true;
            break;
        }
        else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][currentPiecePosition[1] + PieceCoordinates[i][0]] == 1)
        {
            bottomCollided = true;
            break;
        }
    }
    return bottomCollided
}

function nextBottomCollided()
{
    let bottomCollided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[1] + PieceCoordinates[i][0]) == gridSize[1] - 1)
        {
            bottomCollided = true;
            break;
        }
        else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][currentPiecePosition[1] + 1 + PieceCoordinates[i][0]] == 1)
        {
            bottomCollided = true;
            break;
        }
    }
    return bottomCollided
}

function phantomBottomCollided()
{
    let bottomCollided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((phantomPiecePosition + PieceCoordinates[i][0]) == gridSize[1] - 1)
        {
            //console.log("border")
            //console.log(phantomPiecePosition)
            bottomCollided = true;
            break;
        }
        else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][phantomPiecePosition + 1 + PieceCoordinates[i][0]] == 1)
        {
            //console.log("grid")
            //console.log(phantomPiecePosition)
            bottomCollided = true;
            break;
        }
    }
    return bottomCollided
}


function bottomCollision()
{
    let collided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[1] + PieceCoordinates[i][0]) == gridSize[1] - 1)
        {
            collided = true;
            for (let j = 0; j < PieceCoordinates.length; j++)
            {
                grid[currentPiecePosition[0] + PieceCoordinates[j][1]][currentPiecePosition[1] + PieceCoordinates[j][0]] = 1;
                colorGrid[currentPiecePosition[0] + PieceCoordinates[j][1]][currentPiecePosition[1] + PieceCoordinates[j][0]] = currentPieceNumber;
            }
            changePiece();
            break;
        }
        else if (grid[currentPiecePosition[0] + PieceCoordinates[i][1]][currentPiecePosition[1]+1 + PieceCoordinates[i][0]] == 1)
        {
            collided = true;
            for (let j = 0; j < PieceCoordinates.length; j++)
            {
                grid[currentPiecePosition[0] + PieceCoordinates[j][1]][currentPiecePosition[1] + PieceCoordinates[j][0]] = 1;
                colorGrid[currentPiecePosition[0] + PieceCoordinates[j][1]][currentPiecePosition[1] + PieceCoordinates[j][0]] = currentPieceNumber;
            }
            changePiece();
            break;
        }
    }
    return collided;
}

function rightCollision()
{
    let collided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[0] + PieceCoordinates[i][1]) == gridSize[0] - 1)
        {
            collided = true;
            break;
        }
        else if (grid[currentPiecePosition[0] + 1 + PieceCoordinates[i][1]][currentPiecePosition[1] + PieceCoordinates[i][0]] == 1)
        {
            collided = true;
            break;
        }
    }
    return collided
}

function leftCollision()
{
    let collided = false;
    for (let i = 0; i < PieceCoordinates.length; i++)
    {
        if ((currentPiecePosition[0] + PieceCoordinates[i][1]) == 0)
        {
            collided = true;
            break;
        }
        else if (grid[currentPiecePosition[0] - 1 + PieceCoordinates[i][1]][currentPiecePosition[1] + PieceCoordinates[i][0]] == 1)
        {
            collided = true;
            break;
        }
    }
    return collided
}


function getPieceCoordinates()
{   
    let tempCoords = []
    for (let i = 0; i < currentPiece.length; i++)
    {
        for (let j = 0; j < currentPiece[0].length; j++)
        {
            if(currentPiece[i][j] == 1)
            {
                tempCoords.push([i, j])
            }
        }
    }

    PieceCoordinates = tempCoords;
}


function changePiece()
{
    switch(nextPiece[0])
    {
        case 0:
            currentPiece = [[1, 1, 0],
                            [0, 1, 0],
                            [0, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 1:
            currentPiece = [[0, 1, 0],
                            [0, 1, 0],
                            [1, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 2:
            currentPiece = [[0, 1, 0],
                            [1, 1, 0],
                            [0, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 3:
            currentPiece = [[0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0]];
            currentPiecePosition = [3, 0];
            break
        case 4:
            currentPiece = [[1, 1],
                            [1, 1]];
            currentPiecePosition = [4, 0];
            break
        case 5:
        currentPiece = [[1, 0, 0],
                        [1, 1, 0],
                        [0, 1, 0]];
        currentPiecePosition = [3, 0];
        break
        case 6:
        currentPiece = [[0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]];
        currentPiecePosition = [3, 0];
        break
    }
    let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));;
    for (let i = 0; i < currentPiece.length; i++)
    {
        for (let j = 0; j < currentPiece.length; j++)
        {
            temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
        }
    }
    currentPiece = temp;
    getPieceCoordinates();

    currentPieceNumber = nextPiece[0];
    changed = false;
    nextPiece.shift();
    let temp1 = randomInt(numberOfPieces);
    while (temp1 == nextPiece[nextPiece.length - 1]){temp1 = randomInt(numberOfPieces);}
    nextPiece.push(temp1);
}

function switchPiece()
{
    switch(heldpiece)
    {
        case 0:
            currentPiece = [[1, 1, 0],
                            [0, 1, 0],
                            [0, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 1:
            currentPiece = [[0, 1, 0],
                            [0, 1, 0],
                            [1, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 2:
            currentPiece = [[0, 1, 0],
                            [1, 1, 0],
                            [0, 1, 0]];
            currentPiecePosition = [3, 0];
            break
        case 3:
            currentPiece = [[0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0]];
            currentPiecePosition = [3, 0];
            break
        case 4:
            currentPiece = [[1, 1],
                            [1, 1]];
            currentPiecePosition = [4, 0];
            break
        case 5:
        currentPiece = [[1, 0, 0],
                        [1, 1, 0],
                        [0, 1, 0]];
        currentPiecePosition = [3, 0];
        break
        case 6:
        currentPiece = [[0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]];
        currentPiecePosition = [3, 0];
        break
    }
    let temp = [...Array(currentPiece.length)].map(e => Array(currentPiece.length));;
    for (let i = 0; i < currentPiece.length; i++)
    {
        for (let j = 0; j < currentPiece.length; j++)
        {
            temp[j][(currentPiece.length - 1) - i] = currentPiece[i][j];
        }
    }
    currentPiece = temp;
    getPieceCoordinates();
    let temp1 = heldpiece;
    heldpiece = currentPieceNumber;
    currentPieceNumber = temp1;
}

function Piece(number)
{
    switch(number)
    {
        case 0:
            return [[0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]];
        case 1:
            return [[0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]];
        case 2:
            return [[0, 0, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]];
        case 3:
            return [[0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]];
        case 4:
            return [[0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]];
        case 5:
            return [[0, 0, 1, 0],
                    [0, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]];
        case 6:
            return [[0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]];
    }
}