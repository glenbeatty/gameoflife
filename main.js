// Constants:

const NUM_ROWS = 20; // Number of rows (not maximum index). Must match number in table.
const NUM_COLS = 40; // Number of columns (not maximum index). Must match number in table.
const TICK_MS = 500; // Time between updates when game running in milliseconds.
const cellColour = "yellow"; //Colour of active cells.

// Necessary global variables. None should be changed here.
var myInterval = 0; // Timing interval, which is set in functions.js.
let gameRunning = 0; // 1 if game is running continously, 0 otherwise.
let gameStepping = 0; // 1 If user has begun stepping through, 0 otherwise.
let activeCells = []; // Empty array which will contain all active cells at a given time.
let numActiveCells = 0; // The number of active cells at a given time.
let iterationCounter = 0; // The number of iterations completed since last reset.

/* Tick represents one executed iteration of the game. When set to run, this function is called every TICK_MS 
* milliseconds. Tick is also called each time the Step Through button is pressed.
 *
*/

/* Each cell class represents a single active cell, and is stored in activeCells array. Inactive cells are simply
 * removed from the array, so there is no representation of whether a cell is active or not in this class.
 *
*/
class Cell{
    // x and y values for the active cell.
    x = 0;
    y = 0;

    // Constructor takes an x and y value.
    constructor(xVal,yVal){
        this.x = xVal;
        this.y = yVal;
    }   

    // toString method generates the string containing the table cell id necessary to colour the cell.
    toString(){
       let outputString = "c";
       if(this.x<10){
            outputString = outputString.concat(String(0));
       }
       outputString = outputString.concat(String(this.x));
       if(this.y<10){
            outputString = outputString.concat(String(0));
         }
       outputString = outputString.concat(String(this.y));
       return outputString;
    }
}

function tick() {

    let numActiveCells = activeCells.length; // Determine number of active cells.
    let numNeighbours = 0; // Variable for the number of adjacent active cells a cell has.
    let newActiveCells = []; // Array for the next frame of our game. 
    
    /* Call getCandidates to generate a unique list of all inactive cells that are adjacent to at least one active cell.
     * This array will be used to determine which inactive cells become active.
    */
    let candidateCells = getCandidates();

    let numCandidateCells = candidateCells.length; // Number of candidate cells that could become active. 
    
    /* First iteration determines which currently active cells will remain active in the next frame. Each active cell
     * with either 2 or 3 active neighbours will remain active in the next frame. Because active cells are not affected
     * by inactive cells, we don't need to consider candidate cells right now.
    */
    let i = 0;
    while(i<numActiveCells){
        let j = 0;
        while(j<numActiveCells){
            if(cellsAdjacent(activeCells[i],activeCells[j])){
                numNeighbours++;
            }
            j++;
        }
        if((numNeighbours >1)&&(numNeighbours<4)){
            // If an active cell has more than 1 and less than 4 actice neighbours, put it in the new array.
            newActiveCells.push(activeCells[i]);
        }
        numNeighbours = 0;
        i = i + 1;
    }

    /* Now we need to determine which candidate cells, which are inactive but adjacent to at least one active cell,
     * will become active for the next frame. We already generated the array of candidates, so we now iterate over
     * that array to see if each candidate cell becomes active.
    */
    numNeighbours = 0;
    i = 0;
    while(i<numCandidateCells){
        let j = 0;
       while(j<numActiveCells){
            if(cellsAdjacent(candidateCells[i],activeCells[j])){
                numNeighbours++;
            }
            j++;
        }
        if(numNeighbours==3){
            // If a candidate cell has exactly 3 active neighbours, it becomes active and is pushed into the new array.
            newActiveCells.push(candidateCells[i]);
        }
        numNeighbours = 0;
        i++;
    }
    activeCells.length = 0; // clear activeCells array, since we've generated the next frame.
    activeCells = newActiveCells.slice(); // Update activeCells to contain the array of newActiveCells we generated.
    newActiveCells.length = 0; // Clear the newActiveCells array so it's empty for the next iteration.
    pruneCells();
    update(); // Update the grid with the next frame, now that we've generated it.

    // Increment the iteration counter and set the html element to the new value, so it's reflected to the user. 
    iterationCounter++;    
    document.getElementById("iteration").innerHTML = iterationCounter;
}   
