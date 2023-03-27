/* update() is responsible for making the html table reflect the current state of the game. No parameters are 
 * passed, since activeCells array is a global variable. 
*/

// When the user clicks a cell on the grid, colour that cell appopriately. Only allowed when game is paused.
function colourCell(cell){
    if(gameRunning == 0){
        if(document.getElementById(cell).style.backgroundColor != cellColour){
            document.getElementById(cell).style.backgroundColor = cellColour;
        }
        else{
            document.getElementById(cell).style.backgroundColor ="darkgrey";
        }
    }

}

function update(){
    
    clear(); // Clear the board.

    // Iterate over all active cells and colour corrosponding table cell.
    let i = 0;
    while(i<activeCells.length){
        if((activeCells[i].x>-1)&&(activeCells[i].x<NUM_ROWS)&&(activeCells[i].y>-1)&&(activeCells[i].y<NUM_COLS)){
            document.getElementById(activeCells[i].toString()).style.backgroundColor = cellColour; 
        }
        i++;
    }
}

 /* clear() simply sets the board to a blank state. This function is called by the clear button, and also by
  * functions which update the state of the board. It does this by setting every cell to the default colour of
  * the board. It does not change the logical representation of which cells are active or inactive.
 */
function clear(){
    let i = 0;
    while(i<NUM_ROWS){
        let j = 0;
        while(j<NUM_COLS){
            let cellString = "c";
            if(i<10){
                cellString = cellString.concat("0");
            }
            cellString = cellString.concat(String(i));
            if(j<10){
                cellString = cellString.concat("0");
            }   
            cellString = cellString.concat(String(j));
            document.getElementById(cellString).style.backgroundColor = "darkgrey"; 
            j++;
        }
        i++;
    }

}

/* initializeGrid() generates the logical representation of which cells are alive from the grid's state
 * in html/css. When the user selects which cells should be active and runs (or steps-through) the program,
 * this function iterates over the grid and populates the activeCells array with any active cells.
*/
function initializeGrid(){
    activeCells.length = 0;
    let i = 0;
    while(i<NUM_ROWS){
        let j = 0;
        while(j<NUM_COLS){
            let cellString = "c";
            if(i<10){
                cellString = cellString.concat("0");
            }
            cellString = cellString.concat(String(i));
            if(j<10){
                cellString = cellString.concat("0");
            }
            cellString = cellString.concat(String(j));
            if(document.getElementById(cellString).style.backgroundColor == cellColour){                
                const newCell = new Cell(i,j);
                activeCells.push(newCell);
            }
            j = j + 1;
        }
        i = i + 1;
    }
}

/* Function btnRunToggle() is called when the run/pause button is pressed. It starts and stops the timer and 
 * allows the game to run.
 *
*/
function btnRunToggle(){
    gameStepping = 0; // User is no longer stepping-through, since the run button has been pressed.

    // Code to start the game, to be run if game is paused (including on startup).
    if(gameRunning==0){
        gameRunning = 1;
        document.getElementById("iteration").style.backgroundColor ="green";
        document.getElementById("startBtn").innerHTML = "Pause";
        initializeGrid();
        myInterval = setInterval(tick, TICK_MS);
    }

    // Code to pause game, to be run if game is already running. Halts automated execution.
    else{
        gameRunning = 0;
        activeCells.length = 0;
        document.getElementById("iteration").style.backgroundColor ="grey";
        document.getElementById("startBtn").innerHTML = "Run";
        clearInterval(myInterval);
        
    }
}

/* btnStep() is called when the step-through button is pressed. Advances the game one frame at a time.
 *
*/
function btnStep(){

    // If the game is running, it is first paused.
    if(gameRunning == 1){
        btnRunToggle();
    }
    
    // If user hasn't started stepping-through, initialize the array from the board state and then advance one frame.
    if(gameStepping == 0){
        initializeGrid();
        tick();
        gameStepping = 1;
    }

    // If the user has already stepped through, just advance the game by one frame.
    else{
        tick(); 
    }
    

    
}

// btnClear() pauses the game, clears the board, and resets the iteration counter. 
function btnClear(){

    // Pause the game if it's running.
    if(gameRunning == 1){
        btnRunToggle();
    }
    // Stop step-through mode.
    if(gameStepping == 1){
        gameStepping = 0;
    }

    clear(); // Clear the table of any coloured cells. 
    activeCells.length = 0; // Empty activeCells array.
    iterationCounter = 0; // Reset iteration counter to 0.
    document.getElementById("iteration").innerHTML = "0";

}

// Helper function determins if two cells are adjacent (horizontally, vertically, or diagonally).
function cellsAdjacent(a, b){
    let xDiff = Math.abs(a.x-b.x);
    let yDiff = Math.abs(a.y-b.y);
   if((xDiff == 0)&&(yDiff ==0)){
    return 0;
   }
   if((xDiff<2)&&yDiff<2){
    return 1;
   }
    return 0;
}

function cellInArray(c,arr){
    let i = 0;
    while(i<arr.length){
        if((c.x==arr[i].x)&&(c.y==arr[i].y)){
            return 1;
        }
        i++;
    }
    return 0;
}

function duplicateCandidate(candArr,x,y){
    let i = 0;
    while (i<candArr.length){
        if((candArr[i].x==x)&&(candArr[i].y==y)){
            return 1
        }
        i++;
    }
    i = 0;
    while(i<activeCells.length){
        if((activeCells[i].x==x)&&(activeCells[i].y==y)){
            return 1;
        }
        i++;
    }
    return 0;
}

function getCandidates(){

    let candArray = [];
    let i = 0;
    while(i<activeCells.length){
        c = new Cell(activeCells[i].x,activeCells[i].y);
        var topValid = 0;
        var leftValid = 0;
        var bottomValid = 0;
        var rightValid = 0;
        if(c.x>-2){
            topValid = 1;
        }
        if(c.x<(NUM_ROWS+1)){
            bottomValid = 1;
        }
        if(c.y>-2){
            leftValid = 1;
        }
        if(c.x<(NUM_COLS+1)){
            rightValid = 1;
        }

        if((topValid == 1)&&(leftValid == 1)){
            if(duplicateCandidate(candArray,c.x-1,c.y-1)==0){
                c1 = new Cell((c.x-1),(c.y-1));
                candArray.push(c1);
            }
        }


        if(topValid == 1){
            if(duplicateCandidate(candArray,c.x-1,c.y)==0){
                c2 = new Cell(c.x-1,c.y);
                candArray.push(c2);
            }
        }

        if((topValid == 1)&&(rightValid == 1)){
            if(duplicateCandidate(candArray,c.x-1,c.y+1)==0){
                c3 = new Cell(c.x-1,c.y+1);
                candArray.push(c3);
            }
        }

        if(leftValid == 1){
            if(duplicateCandidate(candArray,c.x,c.y-1)==0){
                c4 = new Cell(c.x,c.y-1);
                candArray.push(c4);
            }
        }

        if(rightValid == 1){
            if(duplicateCandidate(candArray,c.x,c.y+1)==0){
                c5 = new Cell(c.x,c.y+1);
                candArray.push(c5);
            }
        }
        if((bottomValid == 1)&&(leftValid == 1)){
            if(duplicateCandidate(candArray,c.x+1,c.y-1)==0){
                c6 = new Cell(c.x+1,c.y-1);
                candArray.push(c6);
            }
        }
        if(bottomValid == 1){
            if(duplicateCandidate(candArray,c.x+1,c.y)==0){
                c7 = new Cell(c.x+1,c.y);
                candArray.push(c7);
            }
        }
        if((bottomValid == 1)&&(rightValid == 1)){
            if(duplicateCandidate(candArray,c.x+1,c.y+1)==0){
                c8= new Cell(c.x+1,c.y+1);
                candArray.push(c8);
            }
        }

        i++;
    }
    return candArray;
}

function loadPreset(preset){
    btnClear();

    activeCells.length = 0;
    window[preset]();
    update();
}

function generatePreset(){
    initializeGrid();
    let i = 0;
    let msg = "";
    while (i<activeCells.length){
        msg = msg.concat("activeCells.push(new Cell(");
        msg = msg.concat(activeCells[i].x);
        msg = msg.concat(",");
        msg = msg.concat(activeCells[i].y);
        msg = msg.concat("));<br />");
        i++;
    }
    document.getElementById("presetOutput").innerHTML = msg;
}