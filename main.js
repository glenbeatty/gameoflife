// comment
const NUM_ROWS = 20;
const NUM_COLS = 40;
const TICK_MS = 250;
const cellColour = "yellow";
var myInterval = 0;
let gameRunning = 0;
let gameStepping = 0;
let activeCells = [];
let numActiveCells = 0;
let iterationCounter = 0;

function tick() {

    let numActiveCells = activeCells.length;

    let numNeighbours = 0;
    let newActiveCells = [];
    let candidateCells = getCandidates();
    let numCandidateCells = candidateCells.length;
    
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
            newActiveCells.push(activeCells[i]);
        }
        numNeighbours = 0;
        i = i + 1;
    }

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
            newActiveCells.push(candidateCells[i]);
        }
        numNeighbours = 0;
        i++;
    }
    activeCells.length = 0; 
    activeCells = newActiveCells.slice();
    newActiveCells.length = 0;
    update();
    iterationCounter++;        
    document.getElementById("iteration").innerHTML = iterationCounter;

    
}   
