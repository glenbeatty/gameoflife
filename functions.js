function update(){
    clear();
    let i = 0;

    while(i<activeCells.length){
        if((activeCells[i].x>-1)&&(activeCells[i].x<NUM_ROWS)&&(activeCells[i].y>-1)&&(activeCells[i].y<NUM_COLS)){
            document.getElementById(activeCells[i].toString()).style.backgroundColor = cellColour; 
        }
        i++;
    }
}

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

function initializeGrid(){
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

function btnRunToggle(){
    gameStepping = 0;
    if(gameRunning==0){
        console.log(gameRunning);
        activeCells.length = 0;
        gameRunning = 1;
        document.getElementById("startBtn").innerHTML = "Pause";
        initializeGrid();
    myInterval = setInterval(tick, TICK_MS);
    }

    else{
        gameRunning = 0;
        activeCells.length = 0;
        document.getElementById("startBtn").innerHTML = "Run";
        clearInterval(myInterval);
    }
}
function btnStep(){
    if(gameRunning == 1){
        btnRunToggle();
    }
        
    if(gameStepping == 0){
        initializeGrid();
        tick();
        gameStepping = 1;
    }
    else{
        tick(); 
    }
    

    
}
function btnClear(){
    if(gameRunning == 1){
        btnRunToggle();
    }
    if(gameStepping == 1){
        gameStepping = 0;
    }
    clear();
    activeCells.length = 0; 
}

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

class Cell{
    x = 0;
    y = 0;
    constructor(xVal,yVal){
        this.x = xVal;
        this.y = yVal;
    }   

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