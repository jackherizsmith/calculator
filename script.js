let currentNumber, processText, decInNumber, calcComplete, sign, 
memFull = false, memStore = 0;

allClear();

function allClear() { //toggle hard mode (long press)
    processText   = '';
    sign          = '';
    currentNumber = '0';
    decInNumber   = false;
    calcComplete  = true;
    updateScreen();
}

function updateScreen() {
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML     = sign;
    document.getElementById("calcScreenText").innerHTML  = currentNumber;
}

function invSign() {
    if (sign === '') {sign = '-'}
    else {sign = ''}
    updateScreen();
}

function operate(op) {
    if ((currentNumber === '0' || currentNumber === '0.') && processText !== '') {
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

function newNum(n){//new numbers keep negativity
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

function memAdd() { //add animation of number floating into memory
    if (currentNumber !== 0 && currentNumber !== '0' && currentNumber !== 'Stop it.') {
        calculate();
        document.getElementById("memStatus").style.color = 'LimeGreen';
        memStore     = currentNumber;
        calcComplete = true;
    }
}

function memRecall() { // reverse animation for number to return to screen?
    if (memStore !== 0) {
        currentNumber = memStore;
        calcComplete  = true;
        updateScreen();
    }
}

function memClear() {
    memStore = 0;
    document.getElementById("memStatus").style.color = 'tomato';
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

function sqRt() { 
    if (currentNumber !== 0) {
        calculate();
        if (sign === '-') {
            processText  = 'Not an imaginary calculator'; //negative infinity
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
}

function roundNumber(){
    if (currentNumber < 1) {
        currentNumber = +currentNumber.toFixed(7)
    }
    else if (currentNumber > 99999999) {
        currentNumber = currentNumber.toPrecision(5)
    }
    else if (currentNumber == 'Infinity'){}
    else {
        currentNumber = +currentNumber.toPrecision(8)
    }
}

function infinity() { //toggle hard mode (long press)
    sign = '';
    currentNumber = Infinity;
    calcComplete  = true;
    updateScreen();
}

document.onkeydown = function(event) {
    if ((event.key >= 0) && (event.key < 10) && (event.key !== ' '))                                {newNum(event.key);}
    else if (event.key === '.')                                                                     {addDec()}
    else if (event.key === '+'      || event.key === '-' || event.key === '*' || event.key === '/') {operate(` ${event.key}`)}
    else if (event.key === 'Backspace')                                                             {backspace()}
    else if (event.key === 'Escape' || event.key === 'Delete')                                      {allClear()}
    else if (event.key === 'Enter'  || event.key === '=')                                           {calculate()}
    else if (event.key === 'm')                                                                     {memAdd()}
}