let currentNumber, processText, decInNumber, calcComplete, sign;

allClear();

function allClear() {
    processText = '';
    sign = '';
    currentNumber = '0';
    decInNumber = false;
    calcComplete = true;
    updateScreen();
}

function updateScreen() { //work out how to round, eg 0.667
    currentNumber = currentNumber.toString(10);
    checkDec();
    if ((decInNumber == false) && (currentNumber.length > 9)){
        sign = '';
        processText = currentNumber;
        currentNumber = 'Ur 2 much'; // this moves into the next equation
        calcComplete = true;
    }
    else if (currentNumber.length > 9) {
        document.getElementById("calcProcessText").innerHTML = processText;
    }
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML = sign;
    document.getElementById("calcScreenText").innerHTML = currentNumber;
}

function newNum(n){
    if ((currentNumber.length > 8) && (calcComplete == false)) {}
    else {
        if (currentNumber === '0' || calcComplete == true) {
            currentNumber = n;
            calcComplete = false;
        } 
        else {
            currentNumber = currentNumber + n;
        }
        updateScreen();
    }
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

function checkDec() {
    decInNumber = currentNumber.indexOf('.') == -1 ? false : true;
}

function invSign() {
    if (sign === '') {sign = '-'}
    else {sign = ''}
//    if (calcComplete){currentNumber = '0'}
    updateScreen();
}

function sqRt() {
    if (currentNumber == 0){}
    else {
        calculate();
        if (sign === '-') {
            processText = 'This is not an imaginary calculator';
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

function operate(op) {
    if ((currentNumber === '0' || currentNumber === '0.') && (op === ' -')) {
        invSign();
    }
    else if ((currentNumber === '0' || currentNumber === '0.') && processText !== '') {
        processText = processText.slice(0,processText.length-2) + op;
    } 
    else {
        calculate();
        calcComplete = false;
        processText = sign + currentNumber + op;
        currentNumber = '0';
        sign = '';
        decInNumber = false;
    }
    updateScreen();
}

function backspace(){
    if (calcComplete) {allClear()}
    else {
        if (currentNumber.length > 1) {
            currentNumber = currentNumber.slice(0,currentNumber.length-1);
            updateScreen();
            checkDec();
        }
        else {
            currentNumber = '0';
            updateScreen();
        }  
    } 
}

function calculate() { // round up number / remove 0s eg 0.1 + 0.2, also decimal point eg 983.
    if ((processText.slice((length-1)) === '-') && (sign === '-')) {
        processText = processText.slice(0,processText.length-1) + '+';
        sign = '';
    }
    if (currentNumber === '0' || currentNumber === '0.'){}
    else {
        currentNumber = eval(processText + sign + currentNumber)
        if (currentNumber >= 0){
            sign = '';
        }
        else {
            currentNumber = -currentNumber;
            sign = '-';
        }
        processText = '';
        updateScreen();
        calcComplete = true;
    }
}

document.onkeydown = function(event) {
    if ((event.key >= 0) && (event.key < 10) && (event.key !== ' ')) {newNum(event.key);}
    else if (event.key === '.') {addDec()}
    else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {operate(` ${event.key}`)}
    else if (event.key === 'Backspace') {backspace()}
    else if (event.key === 'Escape' || event.key === 'Delete') {allClear()}
    else if (event.key === 'Enter' || event.key === '=') {calculate()}
}

// add memory functionality...