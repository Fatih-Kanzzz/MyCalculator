const display = document.getElementById("display")
const buttons = document.querySelectorAll(".btn")

const operators = ["+", "-", "*", "/"]

let currentInput = ""
let justCalculated = false

const actions = {
    "AC": clearDisplay,
    "⌫": backspace,
    "%": percentage,
    "=": calculate
}

function updateDisplay() {
    display.value = currentInput || "0"
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

    const operatorIndex = Math.max(
        currentInput.lastIndexOf("+"),
        currentInput.lastIndexOf("-"),
        currentInput.lastIndexOf("*"),
        currentInput.lastIndexOf("/")
    )

    if (operatorIndex === -1) {
        currentInput = (Number(currentInput) / 100).toString()
        updateDisplay()
        return
    } 

    const operator = currentInput[operatorIndex]
    const numberBefore = currentInput.slice(0, operatorIndex)
    const currentNumber = currentInput.slice(operatorIndex + 1)

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

    if (operators.includes(lastCharacter)) {
        currentInput = currentInput.slice(0, -1)  
    }

    try {
        const result = eval(currentInput)

        if (!Number.isFinite(result)) {
            currentInput = "Can't Divide by Zero"
            updateDisplay()
            return
        }

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

    // validasi titik
    if (value === ".") {
        if (currentInput === "") {
            currentInput = "0."
            updateDisplay()
            return
        }

        const operatorIndex = Math.max(
            currentInput.lastIndexOf("+"),
            currentInput.lastIndexOf("-"),
            currentInput.lastIndexOf("*"),
            currentInput.lastIndexOf("/")
        )

        const currentNumber = currentInput.slice(operatorIndex + 1)

        if (currentNumber.includes(".")) {
            return
        }

        
    }

    if (value !== ".") {
        const operatorIndex = Math.max(
            currentInput.lastIndexOf("+"),
            currentInput.lastIndexOf("-"),
            currentInput.lastIndexOf("*"),
            currentInput.lastIndexOf("/")
        )

        const currentNumber = currentInput.slice(operatorIndex + 1)

        if (currentNumber === "0") {
            if (value === "0") {
                return
            }

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

    const operatorIndex = Math.max(
            currentInput.lastIndexOf("+"),
            currentInput.lastIndexOf("-"),
            currentInput.lastIndexOf("*"),
            currentInput.lastIndexOf("/")
        )
        
    const currentNumber = currentInput.slice(operatorIndex + 1)

    if (currentNumber === ".") {
        currentInput = currentInput.slice(0, operatorIndex + 1) + "0"
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

        if (lastCharacter === "-") {
            const previousCharacter = currentInput.at(-2)

            if (operators.includes(previousCharacter)) {
                if (value === "-") {
                    return
                }
            }

            currentInput = currentInput.slice(0, -2)
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