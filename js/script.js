document.addEventListener('DOMContentLoaded', function() {
    const output = document.getElementById('output');
    const history = document.getElementById('history');
    let previousValue = null; //for storing the previous value
    let currentOperation = null;
    let equalPressed = false;
    let calculationHistory = ''; //for storing the calculation history
    let calc = null;
    let operationSign = null;

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'c') {
            navigator.clipboard.writeText(history.innerText)
                .then(() => {
                    console.log('History copied to clipboard');
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        } else if (event.ctrlKey && event.key === 'v') {
            navigator.clipboard.readText()
                .then(text => {
                    output.innerText = text;
                    calc = text;
                })
                .catch(err => {
                    console.error('Could not paste text: ', err);
                });
        }
    });

    document.querySelectorAll('p').forEach(p => {
        const id = p.id; //for switch case

        p.addEventListener('click', function() {
            // ... existing code ...

            switch (id) {
                case 'convert':
                    const type = prompt('Enter type of conversion (length, weight, area):');
                    const from = prompt('Enter unit to convert from:');
                    const to = prompt('Enter unit to convert to:');
                    const value = parseFloat(prompt('Enter value to convert:'));
                    let result;

                    if (type === 'length') {
                        if (from === 'cm' && to === 'm') {
                            result = value / 100;
                        } else if (from === 'm' && to === 'km') {
                            result = value / 1000;
                        } else if (from === 'cm' && to === 'km') {
                            result = value / 100000;
                        } else if (from === 'm' && to === 'cm') {
                            result = value * 100;
                        } else if (from === 'km' && to === 'm') {
                            result = value * 1000;
                        }
                        // Add more length conversions as needed
                    } else if (type === 'weight') {
                        if (from === 'g' && to === 'kg') {
                            result = value / 1000;
                        } else if (from === 'kg' && to === 'tonne') {
                            result = value / 1000;
                        }
                        // Add more weight conversions as needed
                    } else if (type === 'area') {
                        if (from === 'sqcm' && to === 'sqm') {
                            result = value / 10000;
                        } else if (from === 'sqm' && to === 'sqkm') {
                            result = value / 1000000;
                        } else if (from === 'sqm' && to === 'hectare') {
                            result = value / 10000;
                        }
                        // Add more area conversions as needed
                    }

                    if (result !== undefined) {
                        output.innerText = result;
                        calc = result.toString();
                    } else {
                        output.innerText = 'Invalid conversion';
                    }
                    break;
                default:
                    break;
            }
        });
    });

    document.querySelectorAll('button').forEach(button => {
        const id = button.id; //for switch case
        const value = button.innerText;

        button.addEventListener('click', function() {
            if (equalPressed && !isNaN(parseFloat(value))) {
                output.innerText = '';
                calculationHistory = '';
                calc = '';
                equalPressed = false;
            }

            if (!isNaN(parseFloat(value))) {
                if (output.innerText === '0') {
                    output.innerText = value;
                    calc = value;
                } else {
                    output.innerText += value;
                    calc += value;
                }
                calculationHistory = output.innerText;
            }

            switch (id) {
                case 'c':
                    output.innerText = '0';
                    history.innerText = '...';
                    calc = '';
                    previousValue = null;
                    currentOperation = null;
                    break;
                case 'plus':
                case 'minus':
                case 'multiply':
                case 'divide':
                    operationSign = value;
                    previousValue = parseFloat(calc);
                    currentOperation = id;
                    output.innerText += value;
                    if (equalPressed) {
                        calculationHistory = output.innerText;
                        equalPressed = false;
                    } else {
                        calculationHistory += output.innerText;
                    }
                    calc = '';
                    break;
                case 'factorial':
                    previousValue = parseFloat(calc);
                    currentOperation = id;
                    output.innerText += value.charAt(1);
                    calculationHistory = output.innerText;
                    calc = '';
                    break;
                case 'power':
                    previousValue = parseFloat(calc);
                    currentOperation = id;
                    if (equalPressed) {
                        output.innerText = calc + '^';
                        calculationHistory = output.innerText;
                        equalPressed = false;
                    } else {
                        output.innerText += '^';
                    }
                    calc = '';
                    break;
                case 'percent':
                    if (calc && !isNaN(parseFloat(calc)) && previousValue !== null) {
                        output.innerText += value;
                        switch (currentOperation) {
                            case 'plus':
                            case 'minus':
                                calc = (previousValue * parseFloat(calc) / 100).toString();
                                break;
                            case 'multiply':
                            case 'divide':
                                calc = (parseFloat(calc) / 100).toString();
                                break;
                        }
                    } else if (calc && !isNaN(parseFloat(calc))) {
                        previousValue = parseFloat(calc);
                        currentOperation = id;
                        calculationHistory = output.innerText;
                        output.innerText += value;
                        calc = (parseFloat(calc) / 100).toString();
                    }
                    calculationHistory += value;
                    break;
                case 'sqrt':
                    if (calc && !isNaN(parseFloat(calc)) && previousValue !== null) {
                        output.innerText = previousValue + operationSign + value.charAt(0) + calc;
                        calculationHistory = output.innerText;
                        calc = Math.sqrt(parseFloat(calc)).toString();
                    } else if (calc && !isNaN(parseFloat(calc))) {
                        previousValue = parseFloat(calc);
                        currentOperation = id;
                        output.innerText = value.charAt(0) + calc;
                        calculationHistory = output.innerText;
                        calc = Math.sqrt(parseFloat(calc)).toString();
                    }
                    break;
                case 'module':
                    if (calc && !isNaN(parseFloat(calc)) && previousValue !== null) {
                        output.innerText = previousValue + operationSign + '|' + calc + '|';
                        calculationHistory = output.innerText;
                        calc = Math.abs(parseFloat(calc)).toString();
                    } else if (calc && !isNaN(parseFloat(calc))) {
                        previousValue = parseFloat(calc);
                        currentOperation = id;
                        output.innerText = '|' + calc + '|';
                        calculationHistory = output.innerText;
                        calc = Math.abs(parseFloat(calc)).toString();
                    }
                    break;
                case 'backspace':
                    if (['+', '-', '×', '÷', '%'].includes(output.innerText.charAt(output.innerText.length - 1))) {
                        currentOperation = null;
                    }
                    output.innerText = output.innerText.slice(0, -1);
                    if (calc.length > 0) {
                        calc = calc.slice(0, -1);
                    } else {
                        calc = output.innerText;
                    }
                    break;
                case 'plus-minus':
                    if (calc && !isNaN(parseFloat(calc))) {
                        calc = (-parseFloat(calc)).toString();
                        output.innerText = calc;
                    }
                    break;
                case 'equal':
                    calculate();
                    equalPressed = true;
                    break;
                default:
                    break;
            }
        });
    });

    function calculate() {
        if (previousValue !== null && currentOperation !== null && calc !== null) {
            switch (currentOperation) {
                case 'plus':
                    previousValue = parseFloat(previousValue) + parseFloat(calc);
                    output.innerText = previousValue;
                    break;
                case 'minus':
                    previousValue = parseFloat(previousValue) - parseFloat(calc);
                    output.innerText = previousValue;
                    break;
                case 'multiply':
                    previousValue = parseFloat(previousValue) * parseFloat(calc);
                    output.innerText = previousValue;
                    break;
                case 'divide':
                    previousValue = parseFloat(previousValue) / parseFloat(calc);
                    output.innerText = previousValue;
                    break;
                case 'factorial':
                    previousValue = factorial(parseFloat(previousValue));
                    output.innerText = previousValue;
                    break;
                case 'power':
                    previousValue = Math.pow(parseFloat(previousValue), parseFloat(calc));
                    output.innerText = previousValue;
                    break;
                case 'percent':
                    previousValue = calc;
                    output.innerText = previousValue;
                    break;
                case 'sqrt':
                    output.innerText = calc;
                    break;
                case 'module':
                    output.innerText = calc;
                    break;
            }
            history.innerText = calculationHistory + ' = ' + output.innerText;
            currentOperation = null;
            calc = output.innerText;
        }
    }

    function factorial(n) {
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
});
