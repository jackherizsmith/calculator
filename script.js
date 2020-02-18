const   gridPoints = [[3,1],[3,2],[3,3],[3,4],[3,5],
                      [4,1],[4,2],[4,3],[4,4],[4,5],
                      [5,1],[5,2],[5,3],[5,4],[5,5],
                      [6,1],[6,2],[6,3],[6,4],[6,5],
                      [7,1],[7,2],[7,3],[7,4],[7,5]],                                         // button CSS Grid co-ordinates
        buttonIds =  ["memStatus","addToMemory","recallFromMemory","clearMemory","backspace", 
                      "squareRoot","seven", "eight", "nine", "divide",
                      "inverseSign","four","five","six","times",
                      "infinity","one","two","three","minus",
                      "allClear","zero","addDecimal","equals","add"];                         // button element ids
let currentNumber, processText, calcComplete, sign,
memFull = false, memStore = 0, chaosMode = false, buttonOrder;

allClear();                     // Initialise the calculator

function allClear() {
    processText   = '';
    sign          = '';
    currentNumber = '0';
    calcComplete  = true;       // It's important for the calculator to know when the user is likely or unlikely to be part way through a calculation
    updateDisplay();
}

// MAKING THE DISPLAY WORK

function updateDisplay() {      // Most functions end by updating the display, the most / only important part of which is these first three display elements:
    document.getElementById("calcProcessText").innerHTML = processText;
    document.getElementById("currentSign").innerHTML     = sign;
    document.getElementById("calcScreenText").innerHTML  = currentNumber;

    // The next section is relevant if in chaos mode (i.e. when the square root of 42 is calculated). 
    // It sets a new order of buttons (buttonOrder) and then sets each to the CSS Grid co-ordinates (gridPoints): 
   
    chaosMode ? buttonOrder = shuffleArray(buttonIds.slice()) : // In chaos mode this takes button ids from the buttonIds array and shuffles them into buttonOrder
    buttonOrder = buttonIds.slice();                            // If not in chaos mode, buttonOrder is set to the unshuffled buttonIds array

    /* This loops through each button in the newly ordered array and sets it to the next ach position on the calculator, e.g. if the fourth button has been shuffled into
       the first position, it will be placed in the grid first. If unshuffled, the first button will be placed first, the second second and so on.                */ 
    for (let i = 0; i < 25; i++){
        document.getElementById(buttonOrder[i]).style.gridArea = `${gridPoints[i][0]}  / ${gridPoints[i][1]}  / span 1 / span 1`; // Each button spans one row and one column
    }
}

function shuffleArray(buttons) {                          // A JavaScript implementation of the Durstenfeld shuffle, a computer-optimized version of Fisher-Yate
    for (let i = buttons.length - 1; i > 0; i--) {        // Work backwards through array...
        let j = Math.floor(Math.random() * (i + 1));      // - generate integer between 0 and i
        let store = buttons[i];                           // - keep the current button in 'store'
        buttons[i] = buttons[j];                          // - replace it with a random button
        buttons[j] = store;                               // - put the stored button in place of the random button
    }                                                     // Move backwards through array and repeat until only the first button is left (no need to replace it)
    return buttons; 
}

function roundNumber(){                                                             // This is so the number displays properly on the screen
    if (currentNumber !== 'Infinity'){                                              // Infinity doesn't need editing
        currentNumber < 1 ? currentNumber = +currentNumber.toFixed(7) :             // If number is less than one we can only show it to a certain number of decimal points
        currentNumber > 99999999 ? currentNumber = currentNumber.toPrecision(5) :   // If number is huge it's going to start using e+n so need to chop it off sooner (this starts spilling over from e+99 but hits Infinity before e+1000)
        currentNumber = +currentNumber.toPrecision(8);                              // Otherwise, it can take up a certain number of characters
    }                                                                               // n.b. '+' forces it to be a number, which helps with rounding (e.g. 0.1 + 0.2 = 0.3) 
}

function invSign() {
    if (sign === '') {sign = '-'}
    else {sign = ''}
    calcComplete = false;
    updateDisplay();
}

// PROCESSING INPUTS

function operate(op) {
    ((currentNumber == 0) && (op === ' -')) ? invSign() :             // If there is no number inputted yet, minus will set number to be negative :(
    (currentNumber == 0) && (processText !== '') ?                  // Otherwise, if we are mid way through a calculation ...
    processText = processText.slice(0,processText.length-2) + op : op;// we can replace the latest operation with a new one.

    if (currentNumber > 0) {                                          // If there is in fact a number inputted...
        calculate();                                                  // - update the ongoing sum
        processText   = sign + currentNumber + op;                    // - update the processText
        sign          = '';                                           // - reset the sign
        currentNumber = '0';                                          // - reset currentNumber to 0
    }
    calcComplete = false;                                             // We are now / still mid-calculation
    updateDisplay();
}

function newNum(n){                                             // Throw a number in
    calcComplete ? sign = '' : sign;                            // If we're starting from scratch, the new number will be positive :)
    if (currentNumber == '0' || calcComplete == true) {         // If there isn't an 'active' number already...
        currentNumber = n;                                      // make this new number the number.
        calcComplete  = false;
    } 
    else if (currentNumber.length < 9) {                        // Otherwise (within reason)...
        currentNumber = currentNumber + n;                      // add it on the end of the string (e.g. '5' + '2' becomes '52')
    }
    updateDisplay();
}

function addDec() {
    if (calcComplete) {                                         // If starting again...
        sign = '';
        newNum('0.')                                            // ... make it (+) '0.'
    }
    else {
        (currentNumber.indexOf('.') === -1) ?                   // If there isn't a decimal point already...
        currentNumber = currentNumber + '.' : currentNumber;    // add a decimal point
        updateDisplay();
    }
}

function infinity() {
    if (currentNumber == 0 || calcComplete) {                    // Infinity can only be added as a new 'number'
        currentNumber = Infinity;
        calcComplete  = true;
        updateDisplay();
    }
}

// MEMORY FUNCTIONS

function memAdd() { //TODO add animation to memStatus. https://css-tricks.com/controlling-css-animations-transitions-javascript/
    if (currentNumber > 0 && currentNumber !== 'Stop it.') {                    // If there's something to save into memory...
        calculate();
        document.getElementById("memStatus").style.backgroundColor = '#33CC00'; // ... set colour of memory status to show when memory is in use and...
       // document.getElementById("memStatus").style.
        memStore     = sign + currentNumber;                                    // ... store current number
        calcComplete = true;
    }
}

function memRecall() { // reverse animation for number to return to screen?
    if (memStore !== 0) {                       // If there's something to recall...
        currentNumber = Math.abs(memStore);     // ... display stored number (with sign removed from this display if negative...
        memStore < 0 ? invSign() : memStore;    // ... and in that case make the sign negative)
        calcComplete  = true;
        updateDisplay();
    }
}

function memClear() {   // reset memory
    memStore = '0';
    document.getElementById("memStatus").style.backgroundColor = '#B11100';
}

function backspace(){
    (calcComplete || currentNumber == '0') ? allClear() :                                       // If the calculations are finished, clear the screen
    currentNumber == 'Infinity' ? currentNumber = 0 :                                           // (or if you're lookimg at infinity)
    currentNumber.length > 1 ? currentNumber = currentNumber.slice(0,currentNumber.length-1) :  // If you've got more than one digit, remove one...
    currentNumber = '0';                                                                        // otherwise (i.e. you've got one digit) it becomes 0
 
    updateDisplay();
}

// MAKING CALCULATIONS

function sqRt() { 
    if (currentNumber > 0) {
        if (sign == '-') {
            processText = 'Not an imaginary calculator';
        }
        else {
            calculate();
            processText   = '';
            currentNumber = Math.pow(currentNumber, 0.5);
            roundNumber();
        }
        currentNumber == 6.4807407 ? chaosMode = !chaosMode : chaosMode;  // At the root of the meaning of life is chaos
        processText = '';
        calcComplete = true;
        updateDisplay();
    }
}

function calculate() {
    if ((processText.slice((length-1)) === '-') && (sign === '-')) {    // Correcting a double negative
        processText = processText.slice(0,processText.length-1) + '+';
        sign        = '';
    }
    
    if (currentNumber > 0){
        currentNumber = eval(processText + sign + currentNumber);   // Use JavaScripts handy calculator (executes an expression)
        if (currentNumber >= 0){
            sign = '';
        }
        else {
            currentNumber = Math.abs(currentNumber);                // Correcting sign for display
            sign = '-';
        }
        roundNumber();
        processText = '';
        updateDisplay();
    
        if (isNaN(currentNumber)) {                                 // Correcting for NaN issues
            sign          = '';
            currentNumber = 'Stop it.';
            updateDisplay();
            currentNumber = 0;
        }

        calcComplete = true;
    }
}

// KEYBOARD INTERACTIVITY

document.onkeydown = function(event) {                                           // Listening for key presses
    event.key === '.'                                     ? addDec() :      
    event.key === 'Backspace'                             ? backspace() :                       
    event.key === 'm'                                     ? memAdd() :                                                
    event.key === 'Enter'  || event.key === '='           ? calculate() : 
    event.key === 'Escape' || event.key === 'Delete'      ? allClear() :         // A few options for clearing
    event.key >= 0 && event.key < 10 && event.key !== ' ' ? newNum(event.key) :  // Sends input straight to newNum() 
    event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' ? operate(` ${event.key}`) :  // Sends operator stright in
    event;
}