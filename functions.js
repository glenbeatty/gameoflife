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

    // If xDiff and yDiff both equal zero, the two cells are identical.
   if((xDiff == 0)&&(yDiff ==0)){
    return 0;
   }
   // If they are not identical cells and have a yDiff and xDiff of (1,1), (1,0), and (0,1), the cells are adjacent.
   if((xDiff<2)&&(yDiff<2)){
    return 1;
   }
   // In all other cases, the cells are not adjacent.
    return 0;
}

// Helper function to determine if a cell already exists in our array.
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

/* Helper function to determine if a candidate cell already exists in the candidate cell array.
 * It is necessary for candidateArray to contain only unique cells, so this function is called 
 * to determine if a cell already exists in our array. Returns 1 if cell is in array and 0 otherwise.
*/
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

/* getCandidates() generates and returns the completed candidates array, which contains any
 * cell that is adjacent to at least one active cell and could itself become active. This 
 * candidates array is then used in main.js to determine which inactive cells become activated.
*/
function getCandidates(){

    // Create empty candidates array:
    let candArray = [];

    // Iterate over array of already active cells.
    let i = 0;
    while(i<activeCells.length){
        // Cell c is created and is equal to the current active cell.
        c = new Cell(activeCells[i].x,activeCells[i].y);

        /* Boolean values. A true value for each side means a cell generated on that side.
         * without going off the edge of our logical grid. The logical grid is 4 cells larger on each side 
         * than the table which will be rendered, so that cell groups near the edge of the grid behave as 
         * if the grid were infinite. 
        */
        var topValid = 0;
        var leftValid = 0;
        var bottomValid = 0;
        var rightValid = 0;

        /* If the current cell is +- 4 cells of our display grid, it is possible that a new cell should 
         * be generated, so we set the according variable to 1 accordingly. 
        */
        if(c.x>-5){
            topValid = 1;
        }
        if(c.x<(NUM_ROWS+4)){
            bottomValid = 1;
        }
        if(c.y>-5){
            leftValid = 1;
        }
        if(c.x<(NUM_COLS+4)){
            rightValid = 1;
        }

        /* Each of the following 8 condiitons represents an adjacent cell to the active cell which 
         * could become active. If the candidate cell would be within the bounds of our logical grid,
         * it is added to the array of candidate cells.
        */
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

    // Return the array we just populated. 
    return candArray;
}

/* pruneCells() is called with each iteration and is responsible for clearing any stable clusters
 * of cells which exist in the buffer between the edges of the visual grid and the edge of our logical grid. 
 * Due to the game rules, if the grid becomes finite in any dimension, stable clusters can develop on the edge
 * of the grid. These stable clusters can then influence the visible grid when more cells colide with them,
 * which can result in improper behaviour exibited in the application.
 * 
 * pruneCells() deletes any cell which is outside the bounds of our visual grid and is not connected to any visible
 * cells. This allows our application to avoid the appearance of any improper behaviour.
*/
function pruneCells(){

    /* Boolean values represent whether there are any active cells in the edge columns and rows. If there are
     * no cells occupying the final row or column on either side, we can safely delete any out-of-bounds cells without
    * affecting the visible behaviour of the program. 
    */
    let topRowCell = 0;
    let bottomRowCell = 0;
    let leftColCell = 0;
    let rightColCell = 0;
    let i = 0;

    // Iterate over all active cells to see if any are on the edges. If any are, set the appopriate variable to 1.
    while(i<activeCells.length){
        if(activeCells[i].x == 0){
            topRowCell = 1;
        }
        if(activeCells[i].x == NUM_ROWS - 1){
            bottomRowCell = 1;
        }
        if(activeCells[i].y == 0){
            leftColCell = 1;
        }
        if(activeCells[i].y == NUM_COLS - 1){
            rightColCell = 1;
        }
        i++;

    }

    /* If there are no cells on any of the 4 edge rows or columns, iterate over all active cells and delete 
     * any that are outside of the visible grid. 
    */
    i = 0;
    if(topRowCell == 0){
        while(i<activeCells.length){
            if(activeCells[i].x<0){
                // If a cell is outside of the active bounds, remove it from the array using the splice method.
                activeCells.splice(i,1);
            }
            i++;
        }
    }

    i = 0;
    if(bottomRowCell == 0){
        while(i<activeCells.length){
            if(activeCells[i].x>(NUM_ROWS-1)){
                activeCells.splice(i,1);
            }
            i++;
        }
    }

    i = 0;
    if(leftColCell == 0){
        while(i<activeCells.length){
            if(activeCells[i].y<0){
                activeCells.splice(i,1);

            }
            i++;
        }
    }

    i = 0;
    if(rightColCell == 0){
        while(i<activeCells.length){
            if(activeCells[i].y>(NUM_COLS-1)){
                activeCells.splice(i,1);
            }
            i++;
        }
    }
}

/* loadPreset() is called by a select box within presetForm in index.html. This function is used to help
 * generate a grid state from pre-defined presets that we have created. It accomplishes this by accepting
 * the preset name as a function argument, clearing the board, and then calling a preset function. It 
 * calls the preset function using the JavaScript window object, which allows us to call a function based
 * on a provided string. The string parameter provided is idential to a preset function in presets.js, so
 * a preset function with the same name as the provided argument is called with no arguments.
*/
function loadPreset(preset){
    btnClear();
    activeCells.length = 0;

    // Call the function with the same name as the supplied string argument with no function arguments.
    window[preset]();

    // Update the board state with the activeCells array which has been generated from a preset function.
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