# Another calculator

> This is another JavaScript calculator. It is modelled on a real calculator and more or less works like a real calculator, with a couple of flashy / temperamental additions.

You can see it here on the left - it is based on a real calculator that is similar but not identical to this other one I just found at work, on the right. It does regular functions including square root and the normal operators. It uses memory to overcome the limitations of Immediate Execution Logic, for example that `3 + 5 x 6 - 2 / 4` calculates as `11.5` rather than `32.5`.

![My calculator next to a real one](https://github.com/jackherizsmith/calculator/blob/master/Calculator%20template.jpeg)

## Using my calculator
This calculator works intuitively by clicking the buttons you want, hopefully no matter what device you are using. If on desktop, you can also use the keyboard. Because the calculations are processed as you go, the total is accummulated e.g. `5 + 7 +` displays as `12 +`.

You can change your mind when using the calculator, using the backspace for errors in typing the number or just changing the operator for example when showing `54 *` pressing the divide button updates your calculation to `54 /`. Clicking subtract when there is no number to operate on also prepares your input number to be negative, so that you can for example calculate `5 / (- 8)` in the way you're familiar with.

The memory buttons that are (almost always) along the top of the keyboard help you add, recall, and clear numbers from past calculations.

### All features
You can do quite a lot with this calculator:
* Add, subtract, divide, multiply
* Find square root (of, for example, 42)
* Delete / clear using backspace
* Clear using AC
* Use infinity as a number if you want
* Add to memory, recall from memory, and clear memory

## Design process
I first sketched out the skeleton of what I wanted for the HTML framework, and then added some basic CSS to go back to once I had JavaScript working. I ended up more or less sticking with this original style in the end as I quite like the simple aesthetic.

![My first calculator sketch](https://github.com/jackherizsmith/calculator/blob/master/Calc%20sketch.jpeg)

It behaves slightly differently on mobile - where the focus on a button is when it is clicked rather than hovered over (which is not a useful state on mobile). 

Each calculation takes the process, sign and current number and evaulates it in the following way: 

`currentNumber = eval(processText + sign + currentNumber)`

> "eval() ... evaluates JavaScript code represented as a string." ~ [_MDN web docs_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

Previously I had a simple colour change for adding to or removing from memory, which was problematic when overwriting an existing stored value as thre was no feedback for the user to identify the update. Therefore, the top left panel labelled `M` has three layers:
* a base layer that changes colour depending on whether or not there is a number stored in memory
* a circular layer that grows to cover the base layer by animating when the M+ or MC buttons are pressed (see [lines 86 - 125](https://github.com/jackherizsmith/calculator/blob/master/styles.css))
* a layer that sits over everything, simply with the label `M`.

Finally, the number stored in memory can be found by hovering over the `M`, or by clicking on mobile. This is done by using tooltips, and has been implemented in a way that is fine but definitely needs more thought to be truly valuable. It is definitely more valuable in its current form than not having it at all. 

### Accessibility
Where possible the font size has been set to the maximum within the available space. I have restricted user resizing which could be a problem for people who need to zoom in, especially on smaller screens.

The colour scheme is very pleasing, but more importantly it passes WCAG readability / contrast tests and colourblindness assessment.

I'm not confident that I have effectively implemented what I learned about semantic HTML, but I have treid by using `<label>` instead of `<div>`.

## Further considerations
I only allow selection on the current number, which is to make copying the calculated number straightforward. There are at least two issues with this:
1. It doesn't automatically select the sign as well so negative numbers will copy as positive
2. People might want to select the calculation in process

I added the ability to hover / click to see what is in memory quite last minute and would like to revisit that to make it work better, including drawing attention to that functionality as well as thinking about how I could make the text more readable / bigger.

I also wanted to introduce a running 'history' to the right of / below the calculator whereby a user could more easily access past calculations: they could click the calculation to input the solution as the current number, click a copy button to add the whole formula to the clipboard, and a 'bin' button to delete it from history.