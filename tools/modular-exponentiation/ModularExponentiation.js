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

    const baseValue = Number(baseText);
    const exponentValue = Number(exponentText);
    const modulusValue = Number(modulusText);

    if (baseValue < 0 || baseValue % 1 !== 0) {
        throw Error("The base field is not a positive integer.");
    } else if (exponentValue < 0 || exponentValue % 1 !== 0) {
        throw Error("The exponent field is not a positive integer.");
    } else if (modulusValue < 0 || modulusValue % 1 !== 0) {
        throw Error("The modulus field is not a positive integer.");
    }

    // Each value cannot be more than 2^26. Because the largest safe
    // JavaScript integer is 2^53-1, I used 2^26 as the largest integer for
    // this program. The largest possible value you can get by multiplying two
    // integers will thus by 2^52.
    if (baseValue >= 1 << 26) {
        throw Error(
            "The base is too large. Please use a base below " + (1 << 26)
        );
    } else if (exponentValue >= 1 << 26) {
        throw Error(
            "The exponent is too large. Please use a base below " + (1 << 26)
        );
    } else if (modulusValue >= 1 << 26) {
        throw Error(
            "The modulus is too large. Please use a base below " + (1 << 26)
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

    if (modulusValue === 1) {
        return 0;
    }

    let result = 1,
        exponent = exponentValue,
        base = baseValue % modulusValue;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = multiply(result, base, modulusValue);
        }
        exponent = exponent >> 1;
        base = multiply(base, base, modulusValue);
    }

    return result;
};

const outputToPage = (inputValues, remainder) => {
    const {baseValue, exponentValue, modulusValue} = inputValues;
    let str = `${baseValue}<sup>${exponentValue}</sup> = `
            + ` ${remainder} (mod ${modulusValue})`;
    solutionField.innerHTML = str;
    solutionField.style.visibility = "visible";
    setTimeout(() => {solutionDiv.scrollIntoView();}, 50);
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
