const   gridPoints = [[3,1],[3,2],[3,3],[3,4],[3,5],
                      [4,1],[4,2],[4,3],[4,4],[4,5],
                      [5,1],[5,2],[5,3],[5,4],[5,5],
                      [6,1],[6,2],[6,3],[6,4],[6,5],
                      [7,1],[7,2],[7,3],[7,4],[7,5]],
        numbers =     [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,
                       12,13,14,15,16,17,18,19,20,21,22,23,24]; // for hard mode...
let currentNumber, processText, decInNumber, calcComplete, sign, arrayPosition,
memFull = false, memStore = 0, hardMode = false;

allClear();

function allClear() {
    processText   = '';
    sign          = '';
    currentNumber = '0';
    decInNumber   = false;
    calcComplete  = true;
    updateDisplay();
}

// MAKING THE DISPLAY WORK

function updateDisplay() {
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML     = sign;
    document.getElementById("calcScreenText").innerHTML  = currentNumber;
    
    if (hardMode) {arrayPosition = shuffleArray(numbers.slice())}
    else {arrayPosition = numbers.slice();}
    document.getElementById("memStatus").style.gridArea       = `${gridPoints[arrayPosition[0]][0]}  / ${gridPoints[arrayPosition[0]][1]}  / span 1 / span 1`;
    document.getElementById("addToMemory").style.gridArea     = `${gridPoints[arrayPosition[1]][0]}  / ${gridPoints[arrayPosition[1]][1]}  / span 1 / span 1`;
    document.getElementById("recallFromMemory").style.gridArea= `${gridPoints[arrayPosition[2]][0]}  / ${gridPoints[arrayPosition[2]][1]}  / span 1 / span 1`;
    document.getElementById("clearMemory").style.gridArea     = `${gridPoints[arrayPosition[3]][0]}  / ${gridPoints[arrayPosition[3]][1]}  / span 1 / span 1`;
    document.getElementById("backspace").style.gridArea       = `${gridPoints[arrayPosition[4]][0]}  / ${gridPoints[arrayPosition[4]][1]}  / span 1 / span 1`;
    document.getElementById("squareRoot").style.gridArea      = `${gridPoints[arrayPosition[5]][0]}  / ${gridPoints[arrayPosition[5]][1]}  / span 1 / span 1`;
    document.getElementById("seven").style.gridArea           = `${gridPoints[arrayPosition[6]][0]}  / ${gridPoints[arrayPosition[6]][1]}  / span 1 / span 1`;
    document.getElementById("eight").style.gridArea           = `${gridPoints[arrayPosition[7]][0]}  / ${gridPoints[arrayPosition[7]][1]}  / span 1 / span 1`;
    document.getElementById("nine").style.gridArea            = `${gridPoints[arrayPosition[8]][0]}  / ${gridPoints[arrayPosition[8]][1]}  / span 1 / span 1`;
    document.getElementById("divide").style.gridArea          = `${gridPoints[arrayPosition[9]][0]}  / ${gridPoints[arrayPosition[9]][1]}  / span 1 / span 1`;
    document.getElementById("inverseSign").style.gridArea     = `${gridPoints[arrayPosition[10]][0]} / ${gridPoints[arrayPosition[10]][1]} / span 1 / span 1`;
    document.getElementById("four").style.gridArea            = `${gridPoints[arrayPosition[11]][0]} / ${gridPoints[arrayPosition[11]][1]} / span 1 / span 1`;
    document.getElementById("five").style.gridArea            = `${gridPoints[arrayPosition[12]][0]} / ${gridPoints[arrayPosition[12]][1]} / span 1 / span 1`;
    document.getElementById("six").style.gridArea             = `${gridPoints[arrayPosition[13]][0]} / ${gridPoints[arrayPosition[13]][1]} / span 1 / span 1`;
    document.getElementById("times").style.gridArea           = `${gridPoints[arrayPosition[14]][0]} / ${gridPoints[arrayPosition[14]][1]} / span 1 / span 1`;
    document.getElementById("infinity").style.gridArea        = `${gridPoints[arrayPosition[15]][0]} / ${gridPoints[arrayPosition[15]][1]} / span 1 / span 1`;
    document.getElementById("one").style.gridArea             = `${gridPoints[arrayPosition[16]][0]} / ${gridPoints[arrayPosition[16]][1]} / span 1 / span 1`;
    document.getElementById("two").style.gridArea             = `${gridPoints[arrayPosition[17]][0]} / ${gridPoints[arrayPosition[17]][1]} / span 1 / span 1`;
    document.getElementById("three").style.gridArea           = `${gridPoints[arrayPosition[18]][0]} / ${gridPoints[arrayPosition[18]][1]} / span 1 / span 1`;
    document.getElementById("minus").style.gridArea           = `${gridPoints[arrayPosition[19]][0]} / ${gridPoints[arrayPosition[19]][1]} / span 1 / span 1`;
    document.getElementById("allClear").style.gridArea        = `${gridPoints[arrayPosition[20]][0]} / ${gridPoints[arrayPosition[20]][1]} / span 1 / span 1`;
    document.getElementById("zero").style.gridArea            = `${gridPoints[arrayPosition[21]][0]} / ${gridPoints[arrayPosition[21]][1]} / span 1 / span 1`;
    document.getElementById("addDecimal").style.gridArea      = `${gridPoints[arrayPosition[22]][0]} / ${gridPoints[arrayPosition[22]][1]} / span 1 / span 1`;
    document.getElementById("equals").style.gridArea          = `${gridPoints[arrayPosition[23]][0]} / ${gridPoints[arrayPosition[23]][1]} / span 1 / span 1`;
    document.getElementById("add").style.gridArea             = `${gridPoints[arrayPosition[24]][0]} / ${gridPoints[arrayPosition[24]][1]} / span 1 / span 1`;
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
    calcComplete = false;
    updateDisplay();
}

// PROCESSING INPUTS
 
function operate(op) {
    if ((currentNumber == 0) && (op === ' -')) {invSign();}
    else if (processText !== '' && op !== ' -') {processText = processText.slice(0,processText.length-2) + op;}
    else if (currentNumber !== '0.') {
        calculate();
        processText   = sign + currentNumber + op;
        sign          = '';
        currentNumber = '0';
        decInNumber   = false;
    }
    calcComplete = false;
    updateDisplay();
}

function newNum(n){
    if (calcComplete == true) {sign = '';}
    if (currentNumber === '0' || calcComplete == true) {
        currentNumber = n;
        calcComplete  = false;
    } 
    else if (currentNumber.length < 9) {
        currentNumber = currentNumber + n;
    }
    updateDisplay();
}

function addDec() {
    if (calcComplete) {
        sign = '';
        newNum('0.')
    }
    else {
        decInNumber ? decInNumber : currentNumber = currentNumber + '.';
        updateDisplay();
    }
    decInNumber = true;
}

function infinity() {
    currentNumber = Infinity;
    calcComplete  = true;
    updateDisplay();
}

// MEMORY FUNCTIONS

function memAdd() { //add animation to memStatus. Set CSSKeyFrameRule(?) to growing circle fading to transparent and overflow:hidden on me
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
        updateDisplay();
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
    updateDisplay();
}

// MAKING CALCULATIONS

function sqRt() { 
    if (currentNumber !== 0) {
        if (sign == '-') {
            processText = 'Not an imaginary calculator';
        }
        else {
            calculate();
            processText   = '';
            currentNumber = Math.pow(currentNumber, 0.5);
            roundNumber();
        }
        updateDisplay();
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
        if (currentNumber == 42) {hardMode = !hardMode}
        updateDisplay();
    
        if (isNaN(currentNumber)) {
            sign          = '';
            currentNumber = 'Stop it.';
            updateDisplay();
            currentNumber = 0;
        }
        calcComplete = true;
    }
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