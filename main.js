const expression = document.getElementById("expression")
const resultDisplay = document.getElementById("result")
const buttons = document.querySelectorAll(".btn")

const operators = ["+", "-", "*", "/"]

let currentInput = ""
let justCalculated = false
let lastExpression = ""

const actions = {
    "AC": clearDisplay,
    "⌫": backspace,
    "%": percentage,
    "=": calculate
}

function updateDisplay() {
    if (justCalculated) {
        expression.value = formatExpression(lastExpression)
        resultDisplay.textContent = currentInput

        expression.classList.add("calculated")
        resultDisplay.classList.add("final-result")

        expression.classList.remove("active-expression")
        resultDisplay.classList.remove("preview-result")

        expression.scrollTop = expression.scrollHeight

        return
    }

    expression.value = formatExpression(currentInput || "0")

    expression.classList.add("active-expression")
    resultDisplay.classList.add("preview-result")

    expression.classList.remove("calculated")
    resultDisplay.classList.remove("final-result")

    updatePreview()

    expression.scrollTop = expression.scrollHeight
}

function findLastOperator() {
    return Math.max(
        currentInput.lastIndexOf("+"),
        currentInput.lastIndexOf("-"),
        currentInput.lastIndexOf("*"),
        currentInput.lastIndexOf("/")
    )
}

function getCurrentNumber() {
    const operatorIndex = findLastOperator()
    return currentInput.slice(operatorIndex + 1)
}

function isNegativeSign() {
    const lastCharacter = currentInput.at(-1)

    if (lastCharacter !== "-") {
        return false
    }

    const previousCharacter = currentInput.at(-2)

    if (previousCharacter === undefined) {
        return true
    }

    return operators.includes(previousCharacter)
}

function isDigitLimitReached(value) {
    const currentNumber = getCurrentNumber()

    const digitCount = currentNumber.replace(/\D/g, "").length

    return digitCount >= 20 && value !== "."
}

function updatePreview() {
    if (currentInput === "") {
        resultDisplay.textContent = ""
        return
    }

    const lastCharacter = currentInput.at(-1)

    if (
        operators.includes(lastCharacter) ||
        lastCharacter === "."
    ) {
        resultDisplay.textContent = ""
        return
    }

    try {
        const result = eval(currentInput)

        if (!Number.isFinite(result)) {
            resultDisplay.textContent = ""
            return
        }

        resultDisplay.textContent = `= ${result}`
    } catch {
        resultDisplay.textContent = ""
    }
}

function formatExpression(value) {
    return value
        .replaceAll("*", "×")
        .replaceAll("/", "÷")
}



function clearDisplay() {
    currentInput = "" 
    justCalculated = false
    updateDisplay()
}

function backspace() {
    if (justCalculated) {
        return
    }

    currentInput = currentInput.slice(0, -1)
    updateDisplay()
}

function percentage() {
    if (currentInput === "") {
        return
    }

    const operatorIndex = findLastOperator()

    if (operatorIndex === -1) {
        currentInput = (Number(currentInput) / 100).toString()
        updateDisplay()
        return
    } 

    const operator = currentInput[operatorIndex]
    const numberBefore = currentInput.slice(0, operatorIndex)
    const currentNumber = getCurrentNumber()

    const firstNumber = Number(numberBefore)
    const secondNumber = Number(currentNumber)

    let result

    if (operator === "+" || operator === "-") {
        result = firstNumber * (secondNumber / 100)
    }

    if (operator === "*" || operator === "/") {
        result = secondNumber / 100
    }

    currentInput = numberBefore + operator + result
    updateDisplay()
}

function calculate() {
    if (currentInput === "") {
        return
    }

    const lastCharacter = currentInput.at(-1)

    if (lastCharacter === ".") {
        currentInput = currentInput.slice(0, -1) + "0"
    }

    if (operators.includes(currentInput.at(-1))) {
        currentInput = currentInput.slice(0, -1)
    }

    try {
        const result = eval(currentInput)

        if (!Number.isFinite(result)) {
            lastExpression = currentInput
            currentInput = "Can't Divide by Zero"
            justCalculated = true
            updateDisplay()
            return
        }

        lastExpression = currentInput
        currentInput = result.toString()
        justCalculated = true

        updateDisplay()
    } catch {
        currentInput = ""
        return
    }
}

function appendValue(value) {
    if (justCalculated) {
        currentInput = ""
        justCalculated = false
    }

    if (isDigitLimitReached(value)) {
        return
    }

    // validasi titik
    if (value === ".") {
        if (currentInput === "") {
            currentInput = "0."
            updateDisplay()
            return
        }

        const currentNumber = getCurrentNumber()

        if (currentNumber.includes(".")) {
            return
        }
    }

    if (value !== ".") {
        const currentNumber = getCurrentNumber()

        if (currentNumber === "0") {
            if (value === "0") {
                return
            }
            const operatorIndex = findLastOperator()
            currentInput = currentInput.slice(0, operatorIndex + 1)
        }
    }

    currentInput += value
    updateDisplay()
}

function handleOperator(value) {
    if (justCalculated) {
        justCalculated = false
    }
    
    if (currentInput === "") {
        if (value === "-") {
            currentInput += value
            updateDisplay()
        }

        return
    }

    if (currentInput === "-") {
        if (value === "-") {
            return
        }

        currentInput = "0"
    }
        
    const currentNumber = getCurrentNumber()

    if (currentNumber === ".") {
        const operatorIndex = findLastOperator()
        currentInput = currentInput.slice(0, operatorIndex + 1) + "0"
    }

    if (isNegativeSign()) {
        if (value === "-") {
            return
        }

        currentInput = currentInput.slice(0, -2)
        currentInput += value
        updateDisplay()
        return
    }

    const lastCharacter = currentInput.at(-1)

    if (operators.includes(lastCharacter)) {
        if (lastCharacter === "-" && value === "-") {
            return
        }
        if (value === "-") {
            currentInput += value
            updateDisplay()
            return
        }

        currentInput = currentInput.slice(0, -1)
    }

    currentInput += value
    updateDisplay()
}

function handleInput(value) {
    if (actions[value]) {
        actions[value]()
        return
    }

    if (operators.includes(value)) {
        handleOperator(value)
        return
    }

    appendValue(value)
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value

        handleInput(value)

    })
})

updateDisplay()