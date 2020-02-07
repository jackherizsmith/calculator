const   gridPoints = [[3,1],[3,2],[3,3],[3,4],[3,5],
                    [4,1],[4,2],[4,3],[4,4],[4,5],
                    [5,1],[5,2],[5,3],[5,4],[5,5],
                    [6,1],[6,2],[6,3],[6,4],[6,5],
                    [7,1],[7,2],[7,3],[7,4],[7,5]],
        arrayPosition = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; // for hard mode...
let currentNumber, processText, decInNumber, calcComplete, sign, rand,
memFull = false, memStore = 0, hardMode = false;

allClear();

function allClear() { //toggle hard mode (long press)
    processText   = '';
    sign          = '';
    currentNumber = '0';
    decInNumber   = false;
    calcComplete  = true;
    updateScreen();
}

// MAKING THE DISPLAY WORK

function updateScreen() {
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML     = sign;
    document.getElementById("calcScreenText").innerHTML  = currentNumber;
    if (hardMode) {    
        rand = shuffleArray(arrayPosition);
        document.getElementById("memStatus").style.gridArea       = `${gridPoints[rand[0]][0]} / ${gridPoints[rand[0]][1]} / span 1 / span 1`;
        document.getElementById("addToMemory").style.gridArea     = `${gridPoints[rand[1]][0]} / ${gridPoints[rand[1]][1]} / span 1 / span 1`;
        document.getElementById("recallFromMemory").style.gridArea= `${gridPoints[rand[2]][0]} / ${gridPoints[rand[2]][1]} / span 1 / span 1`;
        document.getElementById("clearMemory").style.gridArea     = `${gridPoints[rand[3]][0]} / ${gridPoints[rand[3]][1]} / span 1 / span 1`;
        document.getElementById("backspace").style.gridArea       = `${gridPoints[rand[4]][0]} / ${gridPoints[rand[4]][1]} / span 1 / span 1`;
        document.getElementById("squareRoot").style.gridArea      = `${gridPoints[rand[5]][0]} / ${gridPoints[rand[5]][1]} / span 1 / span 1`;
        document.getElementById("seven").style.gridArea           = `${gridPoints[rand[6]][0]} / ${gridPoints[rand[6]][1]} / span 1 / span 1`;
        document.getElementById("eight").style.gridArea           = `${gridPoints[rand[7]][0]} / ${gridPoints[rand[7]][1]} / span 1 / span 1`;
        document.getElementById("nine").style.gridArea            = `${gridPoints[rand[8]][0]} / ${gridPoints[rand[8]][1]} / span 1 / span 1`;
        document.getElementById("divide").style.gridArea          = `${gridPoints[rand[9]][0]} / ${gridPoints[rand[9]][1]} / span 1 / span 1`;
        document.getElementById("inverseSign").style.gridArea     = `${gridPoints[rand[10]][0]} / ${gridPoints[rand[10]][1]} / span 1 / span 1`;
        document.getElementById("four").style.gridArea            = `${gridPoints[rand[11]][0]} / ${gridPoints[rand[11]][1]} / span 1 / span 1`;
        document.getElementById("five").style.gridArea            = `${gridPoints[rand[12]][0]} / ${gridPoints[rand[12]][1]} / span 1 / span 1`;
        document.getElementById("six").style.gridArea             = `${gridPoints[rand[13]][0]} / ${gridPoints[rand[13]][1]} / span 1 / span 1`;
        document.getElementById("times").style.gridArea           = `${gridPoints[rand[14]][0]} / ${gridPoints[rand[14]][1]} / span 1 / span 1`;
        document.getElementById("infinity").style.gridArea        = `${gridPoints[rand[15]][0]} / ${gridPoints[rand[15]][1]} / span 1 / span 1`;
        document.getElementById("one").style.gridArea             = `${gridPoints[rand[16]][0]} / ${gridPoints[rand[16]][1]} / span 1 / span 1`;
        document.getElementById("two").style.gridArea             = `${gridPoints[rand[17]][0]} / ${gridPoints[rand[17]][1]} / span 1 / span 1`;
        document.getElementById("three").style.gridArea           = `${gridPoints[rand[18]][0]} / ${gridPoints[rand[18]][1]} / span 1 / span 1`;
        document.getElementById("minus").style.gridArea           = `${gridPoints[rand[19]][0]} / ${gridPoints[rand[19]][1]} / span 1 / span 1`;
        document.getElementById("allClear").style.gridArea        = `${gridPoints[rand[20]][0]} / ${gridPoints[rand[20]][1]} / span 1 / span 1`;
        document.getElementById("zero").style.gridArea            = `${gridPoints[rand[21]][0]} / ${gridPoints[rand[21]][1]} / span 1 / span 1`;
        document.getElementById("addDecimal").style.gridArea      = `${gridPoints[rand[22]][0]} / ${gridPoints[rand[22]][1]} / span 1 / span 1`;
        document.getElementById("equals").style.gridArea          = `${gridPoints[rand[23]][0]} / ${gridPoints[rand[23]][1]} / span 1 / span 1`;
        document.getElementById("add").style.gridArea             = `${gridPoints[rand[24]][0]} / ${gridPoints[rand[24]][1]} / span 1 / span 1`;
    }
    //else {rand = gridPoints}
}

function shuffleArray(array) {                          // a JavaScript implementation of the Durstenfeld shuffle, a computer-optimized version of Fisher-Yate
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  return array; 
}

function roundNumber(){
    if (currentNumber !== 'Infinity'){
        if (currentNumber < 1) {
            currentNumber = +currentNumber.toFixed(7)
        }
        else if (currentNumber > 99999999) {
            currentNumber = currentNumber.toPrecision(5)
        }
        else {
            currentNumber = +currentNumber.toPrecision(8)
        }
    }
}

function invSign() {
    if (sign === '') {sign = '-'}
    else {sign = ''}
    updateScreen();
}

// PROCESSING INPUTS

function operate(op) { // minus makes '0-' not negative sign
    if ((currentNumber == 0) && processText !== '') {
        if (op === ' -') {
            invSign();
            calcComplete = false;
        }
        else {processText = processText.slice(0,processText.length-2) + op;}
    }
    else if (currentNumber !== '0.') {
        calculate();
        processText   = sign + currentNumber + op;
        sign          = '';
        currentNumber = '0';
        decInNumber   = false;
        calcComplete  = false;
    }
    updateScreen();
}

function newNum(n){//new numbers keep negativity - THE ONLY REAL PROBLEM
    if ((currentNumber.length < 9 && currentNumber === '0') || calcComplete == true) {
        currentNumber = n;
        calcComplete  = false;
    } 
    else if (currentNumber.length < 9) {
        currentNumber = currentNumber + n;
    }
    updateScreen();
}

function addDec() {
    if (calcComplete) {
        sign = '';
        newNum('0.')
    }
    else {
        decInNumber ? decInNumber : currentNumber = currentNumber + '.';
        updateScreen();
    }
    decInNumber = true;
}

function infinity() {
    sign = '';
    currentNumber = Infinity;
    calcComplete  = true;
    updateScreen();
}

// MEMORY FUNCTIONS

function memAdd() { //add animation to memStatus
    if (currentNumber !== 0 && currentNumber !== '0' && currentNumber !== '0.' && currentNumber !== 'Stop it.') {
        calculate();
        document.getElementById("memStatus").style.backgroundColor = '#33CC00';
        memStore     = sign + currentNumber;
        calcComplete = true;
    }
}

function memRecall() { // reverse animation for number to return to screen?
    if (memStore !== 0) {
        if (memStore < 0) {
            sign = '-';
            currentNumber = -memStore;
        }
        else {currentNumber = memStore;}
        calcComplete  = true;
        updateScreen();
    }
}

function memClear() {
    memStore = '0';
    document.getElementById("memStatus").style.backgroundColor = '#B11100';
}

function backspace(){
    if (calcComplete || currentNumber === '0') {allClear()}
    else if (currentNumber == 'Infinity') {currentNumber = 0;}
    else {
        if (currentNumber.length > 1) {
            currentNumber = currentNumber.slice(0,currentNumber.length-1);
            decInNumber   = currentNumber.indexOf('.') === -1 ? false : true;
        }
        else {
            currentNumber = '0';
        }  
    } 
    updateScreen();
}

// MAKING CALCULATIONS

function sqRt() { 
    if (currentNumber !== 0) {
        calculate();
        if (sign === '-') {
            processText  = 'Not an imaginary calculator';
        }
        else {
            processText   = '';
            currentNumber = Math.pow(currentNumber, 0.5)
        }
        roundNumber();
        updateScreen();
        processText = '';
        calcComplete = true;
    }
}

function calculate() {
    if ((processText.slice((length-1)) === '-') && (sign === '-')) {
        processText = processText.slice(0,processText.length-1) + '+';
        sign        = '';
    }
    
    if (currentNumber !== '0' && currentNumber !== '0.'){
        currentNumber = eval(processText + sign + currentNumber);
        if (currentNumber >= 0){
            sign = '';
        }
        else {
            currentNumber = Math.abs(currentNumber);
            sign = '-';
        }
        roundNumber();
        processText = '';
        updateScreen();
    
        if (isNaN(currentNumber)) {
            sign          = '';
            currentNumber = 'Stop it.';
            updateScreen();
            currentNumber = 0;
        }
        calcComplete = true;
    }
    if (currentNumber == 42) {hardMode = !hardMode}
}

// KEYBOARD INTERACTIVITY

document.onkeydown = function(event) {
    if ((event.key >= 0) && (event.key < 10) && (event.key !== ' '))                                {newNum(event.key);}
    else if (event.key === '.')                                                                     {addDec()}
    else if (event.key === '+'      || event.key === '-' || event.key === '*' || event.key === '/') {operate(` ${event.key}`)}
    else if (event.key === 'Backspace')                                                             {backspace()}
    else if (event.key === 'Escape' || event.key === 'Delete')                                      {allClear()}
    else if (event.key === 'Enter'  || event.key === '=')                                           {calculate()}
    else if (event.key === 'm')                                                                     {memAdd()}
}