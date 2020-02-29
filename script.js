const   gridPoints = [[3,1],[3,2],[3,3],[3,4],[3,5],
                      [4,1],[4,2],[4,3],[4,4],[4,5],
                      [5,1],[5,2],[5,3],[5,4],[5,5],
                      [6,1],[6,2],[6,3],[6,4],[6,5],
                      [7,1],[7,2],[7,3],[7,4],[7,5]],                                         // CSS Grid co-ordinates of each button
        buttonIds =  ["memStatus","addToMemory","recallFromMemory","clearMemory","backspace", 
                      "squareRoot","seven", "eight", "nine", "divide",
                      "inverseSign","four","five","six","times",
                      "infinity","one","two","three","minus",
                      "allClear","zero","addDecimal","equals","add"];                         // Button element IDs
let currentNumber, processText, calcComplete, sign, buttonWidth, buttonHeight,bodyWidth, screenHeight,
memFull = false, memStore = 0, chaosMode = false, buttonOrder, 
memBackground = document.getElementById("memStatus"), memUpdate = document.getElementById("updateColour"); // Assigning DOM elements for animation

allClear();                     // Initialise the calculator

function allClear() {           // PURPOSE: reset the calculator (except memory function)
    processText   = '';
    sign          = '';
    currentNumber = '0';
    calcComplete  = true;       // It's important for the calculator to know when the user is likely or unlikely to be part way through a calculation
    updateDisplay();            // Almost all functions conclude by updating the display
    
    buttonWidth = document.getElementById("addToMemory").offsetWidth;
    screenHeight = document.getElementById("calcScreen").offsetHeight;
    document.getElementById("memShow").style.maxWidth = buttonWidth;
    document.getElementById("memoryValue").style.marginTop = -screenHeight;
    
    bodyWidth = document.getElementById("calculatorBody").offsetWidth;
    document.getElementById("memoryValue").style.width = bodyWidth;
}

// MAKING THE DISPLAY WORK

function updateDisplay() {      // PURPOSE: Update the screen, and sometimes the button layout
    document.getElementById("calcProcessText").innerHTML = processText;     // Keeping track of the calculation so far
    document.getElementById("currentSign").innerHTML     = sign;            // The sign of the current number
    document.getElementById("calcScreenText").innerHTML  = currentNumber;   // The current 'active' number

    // The next section is relevant if in Chaos Mode (i.e. when the square root of 42 is calculated). 
    // It sets a new order of button IDs in an array (buttonOrder) and then sets each to the CSS Grid co-ordinates (gridPoints): 
   
    chaosMode ? buttonOrder = shuffleArray(buttonIds.slice()) : // In chaos mode this takes button IDs from the buttonIds array and shuffles them into buttonOrder (see line 46)
    buttonOrder = buttonIds.slice();                            // If not in chaos mode, buttonOrder is set to the unshuffled buttonIds array

    /* The following loop iterates through each button in the newly ordered buttonOrder array and sets it to the next position on the calculator, e.g. if the fourth button has been 
       shuffled into the first position, it will be placed in the grid first. If unshuffled, the first button will be placed first, the second second and so on.                     */ 
    
    for (let i = 0; i < 25; i++){
        document.getElementById(buttonOrder[i]).style.gridArea = `${gridPoints[i][0]} / ${gridPoints[i][1]} / span 1 / span 1`;     // Each button spans one row and one column
    }
}

function shuffleArray(buttons) { // PURPOSE: the Durstenfeld shuffle, a computer-optimized version of Fisher-Yates, of button IDs
    for (let i = buttons.length - 1; i > 0; i--) {        // Work backwards through array from i = 24:
        let j  = Math.floor(Math.random() * (i + 1));     // - generate random integer j between 0 and i
        let store  = buttons[i];                          // - keep the button ID in position i in 'store'
        buttons[i] = buttons[j];                          // - replace it with a random button ID in position j
        buttons[j] = store;                               // - put the stored button in place of the moved random button
    }                                                     // Repeat until only the first button (i = j = 0) is left
    return buttons; 
}

function roundNumber(){     // PURPOSE: ensure that the number displays properly on the screen
    if (currentNumber !== 'Infinity'){                                              // Infinity doesn't need editing
        currentNumber < 1 ? currentNumber = +currentNumber.toFixed(7) :             // If number is less than 1 it can only be shown to a certain number of decimal points
        currentNumber > 99999999 ? currentNumber = currentNumber.toPrecision(5) :   // Else if number is huge it's going to start using e+n (where n = 10 ^ n) so need to chop it off sooner (this starts spilling over from e+99 but hits Infinity before e+1000)
        currentNumber = +currentNumber.toPrecision(8);                              // Else it can take up a certain number of characters
    }                                                                               // n.b. '+' forces the variable to be a number, which helps with rounding (e.g. so that 0.1 + 0.2 = 0.3) 
}

window.onresize = function() {
    buttonWidth = document.getElementById("addToMemory").offsetWidth;
    screenHeight = document.getElementById("calcScreen").offsetHeight;
    bodyWidth = document.getElementById("calculatorBody").offsetWidth;

    document.getElementById("memShow").style.maxWidth = buttonWidth;
    document.getElementById("memoryValue").style.marginTop = -screenHeight;
    document.getElementById("memoryValue").style.width = bodyWidth;
}

// PROCESSING INPUTS

function newNum(n){         // PURPOSE: take a number 0-9
    calcComplete ? sign = '' : sign;                    // If we're starting from scratch, the new number will be positive :)
    if (currentNumber == '0' || calcComplete == true) { // If there isn't a current active number...
        currentNumber = n;                              // ... this is now it.
        calcComplete  = false;                          // A calculation is now in progress
    } 
    else if (currentNumber.length < 9) {                // Otherwise (within reason)...
        currentNumber = currentNumber + n;              // ... add it on to the end of the string (e.g. '5' + '2' becomes '52')
    }
    updateDisplay();
}

function operate(op) {      // PURPOSE: process the various operations including how they interact
    ((currentNumber == 0) && (op === ' -')) ? invSign() :               // If there is no current number, a minus input will prepare the new number to be negative :(
     (currentNumber == 0) && (processText !== '') ?                     // Otherwise, if we are mid way through a calculation ...
    processText = processText.slice(0,processText.length-2) + op : op;  // ... we can replace the latest operation with a new one.

    if (currentNumber > 0) {                                            // If there is in fact a number inputted:
        calculate();                                                    // - update the ongoing sum
        processText   = sign + currentNumber + op;                      // - update the processText including the new operation
        sign          = '';                                             // - reset the sign
        currentNumber = '0';                                            // - reset current number to 0
    }
    calcComplete = false;                                               // We are now / still mid-calculation
    updateDisplay();
}

function invSign() {        // PURPOSE: invert the current sign
    calcComplete = false;                   // Calculation now in progress
    sign === '' ? sign = '-' : sign = '';   // Ternary operator to invert sign
    updateDisplay();
}

function addDec() {         // PURPOSE: add a decimal point
    if (calcComplete) {     // If starting a new number...
        sign = '';
        newNum('0.')        // ... adding a decimal point means (+)'0.'
    }
    else {
        (currentNumber.indexOf('.') === -1) ?                   // If there isn't a decimal point already...
        currentNumber = currentNumber + '.' : currentNumber;    // ... add a decimal point
        updateDisplay();
    }
}

function backspace(){       // PURPOSE: remove the last digit / reset the calculator
    (calcComplete || currentNumber == '0') ? allClear() :                                       // If there is no current active number, clear the screen
    currentNumber == 'Infinity' ? currentNumber = 0 :                                           // Else if infinity, change to 0
    currentNumber.length > 1 ? currentNumber = currentNumber.slice(0,currentNumber.length-1) :  // If you've got more than one digit, remove one...
    currentNumber = '0';                                                                        // otherwise (i.e. you've got one digit) it becomes 0
 
    updateDisplay();
}

function infinity() {   // I thought since infinity can come up in calculations I might as well introduce it as a button to make it official
    if (calcComplete) {sign = ''}
    if (currentNumber == 0 || calcComplete) {   // Infinity can only be added as a new 'number'
        currentNumber = Infinity;
        calcComplete  = true;
        updateDisplay();
    }
}

// MEMORY FUNCTIONS

function memAdd() {         // PURPOSE: add current / calculated number to memory
    if (currentNumber > 0 && currentNumber !== 'Stop it.') {    // If there's something to save into memory...
        calculate();
        memUpdate.classList.add("add-to-memory");               // Add the class that has an animation in styles.css
        setTimeout(function(){                                  // Allow it to run for it's duration and then:
            memBackground.style.backgroundColor = '#33CC00';    // - set the below element to the final colour
            memUpdate.classList.remove("add-to-memory");        // - remove the class so it can be rerun in the future
        }, 800);                                                // Length of animation 
        memStore     = sign + currentNumber;                    // Store current number
        memBackground.classList.add("tooltip");                 // Add class to access stored number with hover (PC) or click (mobile)
        document.getElementById("memoryValue").innerHTML = memStore;  // Update hidden text to indicate what number is stored in memory  
        calcComplete = true;
    }
}

function memRecall() {      // PURPOSE: recall stored number from memory
    if (memStore > 0 || memStore < 0) {         // If there's something to recall...
        currentNumber = Math.abs(memStore);     // ... display stored number (with sign removed from this display if negative...
        memStore < 0 ? invSign() : memStore;    // ... and in that case make the sign negative)
        calcComplete  = true;
        updateDisplay();
    }
}

function memClear() {   // PURPOSE: Clear stored number in memory
    if (memStore > 0 || memStore < 0) {                         // Inverse of memAdd(), see line 131
        memUpdate.classList.add("remove-from-memory");
        setTimeout(function(){
            memBackground.style.backgroundColor = '#B11100';
            memUpdate.classList.remove("remove-from-memory");
        }, 800);  
        memBackground.classList.remove("tooltip");
        document.getElementById("memoryValue").innerHTML = '';  // Remove hidden number  
    }
    memStore = '0';
}

// MAKING CALCULATIONS

function sqRt() {       // PURPOSE: Find square root of current / calculated number
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
        calcComplete = true;
        updateDisplay();
        processText = '';
    }
}

function calculate() {  //PURPOSE: Process calculation
    if ((processText.slice((length-1)) === '-') && (sign === '-')) {    // Correcting a double negative
        processText = processText.slice(0,processText.length-1) + '+';
        sign        = '';
    }
    
    if (currentNumber > 0){
        currentNumber = eval(processText + sign + currentNumber);   // Use JavaScript's handy calculator (executes an expression)
        if (currentNumber >= 0){
            sign = '';
        }
        else {
            currentNumber = Math.abs(currentNumber);    // Correcting sign for display
            sign = '-';
        }
        roundNumber();
        processText = '';
        updateDisplay();
    
        if (isNaN(currentNumber)) {     // Correcting for NaN issues
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
    event.key === '.'                                     ? addDec()    :      
    event.key === 'Backspace'                             ? backspace() :                       
    event.key === 'm'                                     ? memAdd()    :                                                
    event.key === 'Enter'  || event.key === '='           ? calculate() : 
    event.key === 'Escape' || event.key === 'Delete'      ? allClear()  :        // A few options for clearing
    event.key >= 0 && event.key < 10 && event.key !== ' ' ? newNum(event.key) :  // Sends input straight to newNum() 
    event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/' ? operate(` ${event.key}`) :  // Sends operator stright in
    event;
}