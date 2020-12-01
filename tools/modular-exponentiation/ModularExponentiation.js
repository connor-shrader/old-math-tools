// Navigation
const navigation = document.getElementById("nav");

// Form
const inputForm = document.getElementById("input");

// The submit button.
const submitButton = document.getElementById("submit");

const baseField = document.getElementById("base");
const exponentField = document.getElementById("exponent");
const modulusField = document.getElementById("modulus");

const solutionField = document.getElementById("solution");

const convertTextToNumbers = (inputText) => {
    // Validating input:
    const { baseText, exponentText, modulusText } = inputText;
    if (!baseText) {
        throw Error("The base field was left empty.");
    } else if (!exponentText) {
        throw Error("The exponent field was left empty.");
    } else if (!modulusText) {
        throw Error("The modulus field was left empty.");
    }

    // This if-else chain checks if the inputs are all positive integers.
    // I removed all digits 0-9 from each input. If the resulting value
    // is truthy, then the input contains illegal characters.
    if (baseText.replace(/[0-9]+/, "")) {
        throw Error("The base field is not a positive integer.");
    } else if (exponentText.replace(/[0-9]+/, "")) {
        throw Error("The exponent field is not a positive integer.");
    } else if (modulusText.replace(/[0-9]+/, "")) {
        throw Error("The modulus field is not a positive integer.");
    }

    const baseValue = BigInt(baseText);
    const exponentValue = BigInt(exponentText);
    const modulusValue = BigInt(modulusText);

    // This if-else chain checks that all inputs are *positive*
    if (baseValue <= 0n) {
        throw Error("The base field is not a positive integer.");
    } else if (exponentValue <= 0n) {
        throw Error("The exponent field is not a positive integer.");
    } else if (modulusValue <= 0n) {
        throw Error("The modulus field is not a positive integer.");
    }

    const biggestInteger = BigInt("1000000000000");

    // I set an arbitrary limit of 1 trillion for each input.
    // This value fits nicely in the text boxes on the page.
    if (baseValue >= biggestInteger) {
        throw Error(
            "The base is too large. Please use a base below " +
                biggestInteger +
                " (1 trillion)"
        );
    } else if (exponentValue >= biggestInteger) {
        throw Error(
            "The exponent is too large. Please use a base below " +
                biggestInteger +
                " (1 trillion)"
        );
    } else if (modulusValue >= biggestInteger) {
        throw Error(
            "The modulus is too large. Please use a base below " +
                biggestInteger +
                " (1 trillion)"
        );
    }

    return {
        baseValue,
        exponentValue,
        modulusValue,
    };
};

const multiply = (factor1, factor2, modulus) => {
    return (factor1 * factor2) % modulus;
};

const computeRemainder = (inputValues) => {
    const { baseValue, exponentValue, modulusValue } = inputValues;

    if (modulusValue === 1n) {
        return 0n;
    }

    let result = 1n,
        exponent = exponentValue,
        base = baseValue % modulusValue;
    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = multiply(result, base, modulusValue);
        }
        exponent = exponent >> 1n;
        base = multiply(base, base, modulusValue);
    }

    return result;
};

const outputToPage = (inputValues, remainder) => {
    const { baseValue, exponentValue, modulusValue } = inputValues;
    let str =
        `${baseValue}<sup>${exponentValue}</sup> = ` +
        ` ${remainder} (mod ${modulusValue})`;
    solutionField.innerHTML = str;
    solutionField.style.visibility = "visible";
    setTimeout(() => {
        solution.scrollIntoView();
    }, 50);
};

computerModularExponentiation = () => {
    try {
        const baseText = baseField.value;
        const exponentText = exponentField.value;
        const modulusText = modulusField.value;

        const inputText = {
            baseText,
            exponentText,
            modulusText,
        };

        inputValues = convertTextToNumbers(inputText);
        const remainder = computeRemainder(inputValues);
        outputToPage(inputValues, remainder);
    } catch (error) {
        alert(error);
    }
};

// Prevents the submit button from being automatically clicked when the
// page is loaded.
inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
});

// Clicking the submit button will call computerLinearRegression.
submitButton.addEventListener("click", computerModularExponentiation);

function menuClick() {
    if (navigation.className === "closed") {
        navigation.className = "open";
    } else {
        navigation.className = "closed";
    }
}
