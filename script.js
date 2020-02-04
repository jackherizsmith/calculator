let currentNumber, processText, decInNumber, calcComplete, sign, 
memFull = false, memStore = 0;

allClear();

function allClear() {
    currentNumber = '0';
    processText = '';
    decInNumber = false;
    calcComplete = true;
    sign = '';
    updateScreen();
}

function updateScreen() {
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML = sign;
    document.getElementById("calcScreenText").innerHTML = currentNumber;
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
        }
        else {processText = processText.slice(0,processText.length-2) + op;}
    }
    else if (currentNumber !== '0.') {
        calculate();
        calcComplete = false;
        processText = sign + currentNumber + op;
        sign = '';
        currentNumber = '0';
        decInNumber = false;
    }
    updateScreen();
}

function newNum(n){
    if (currentNumber === '0' || calcComplete == true) {
        if (processText === '') {sign = '';}
        currentNumber = n;
        calcComplete = false;
    } 
    else {
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

function memAdd() {
    calculate();
    memStore = currentNumber;
    document.getElementById("memStatus").style.color = 'rgb(47, 231, 47)';
    calcComplete = true;
}

function memRecall() {
    if (memStore !== 0) {
        currentNumber = memStore;
        updateScreen();
        calcComplete = true;
    }
}

function memClear() {
    memStore = 0;
    document.getElementById("memStatus").style.color = 'tomato';
}

function backspace(){
    if (calcComplete || currentNumber == 0) {allClear()}
    else if (currentNumber == 'Infinity') {currentNumber = 0;}
    else {
        if (currentNumber.length > 1) {
            currentNumber = currentNumber.slice(0,currentNumber.length-1);
            decInNumber = currentNumber.indexOf('.') === -1 ? false : true;
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
            processText = 'Not an imaginary calculator';
            calcComplete = false;
        }
        else {
            currentNumber = Math.pow(currentNumber, 0.5)
            processText = '';
        }
        updateScreen();
        processText = '';
        calcComplete = true;
    }
}

function calculate() {
    if ((processText.slice((length-1)) === '-') && (sign === '-')) {
        processText = processText.slice(0,processText.length-1) + '+';
        sign = '';
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
        processText = '';
        updateScreen();
        if (isNaN(currentNumber)) {
            currentNumber = 'Stop it.';
            sign = '';
            updateScreen();
            currentNumber = 0;
        }
        calcComplete = true;
    }
}

function infinity() {
    currentNumber = 'Infinity';
    updateScreen();
    calcComplete = true;
}

document.onkeydown = function(event) {
    if ((event.key >= 0) && (event.key < 10) && (event.key !== ' ')) {newNum(event.key);}
    else if (event.key === '.') {addDec()}
    else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {operate(` ${event.key}`)}
    else if (event.key === 'Backspace') {backspace()}
    else if (event.key === 'Escape' || event.key === 'Delete') {allClear()}
    else if (event.key === 'Enter' || event.key === '=') {calculate()}
    else if (event.key === 'm') {memAdd()}
}