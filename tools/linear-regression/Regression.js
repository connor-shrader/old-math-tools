const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#coordinates");
const inputForm = document.querySelector("#inputForm");
const equationDiv = document.querySelector("#equation");
const r2Div = document.querySelector("#r2");

const solutionDiv = document.getElementById("solution");
const fractionButton = document.getElementById("fractionButton");
const decimalButton = document.getElementById("decimalButton");

// This function will take a string representing a number and
// returns a Rational object (see RationalNumbers.js)

// Examples:
// convertStringToRational("1") => {_numerator: 1, _denominator: 1}
// convertStringToRational("1.5") => {_numerator: 3, _denominator: 2}
// convertStringToRational("1/2") => {_numerator: 1, _denominator: 2}
convertStringToRational = (str) =>
{
    if (!isNaN(str))
    {
        // str is either an integer or a floating decimal.
        let power = 1;
        let num = Number(str);

        // Keep multiplying num by powers of 10 until it becomes an integer.
        // Then the numerator will be the integer we obtain, and the
        // denominator will be 10 to the same power.

        // Example: For str="1.5", we will create a Rational with
        // numerator 15 and denominator 10.
        while(true)
        {
            if (num * power % 1 === 0)
            {
                return new Rational(num * power, power);
            }
            power *= 10;
        }
    }
    else
    {
        // If we enter this block, the string is a fraction (e.g. "1/2").
        const fraction = str.split("/");
        if (fraction.length !== 2 || isNaN(fraction[0]) || isNaN(fraction[1]))
        {
            throw Error(`The value ${str} is invalid.`);
        }
        else
        {
            return new Rational(fraction[0], fraction[1]);
        }
    }
}

// This function will take the raw input from the text field
// and return a 2D array containing the desired ordered pairs.
// For example, getCoordinates("1 2\n 2 3\n 3 5") will output
// [[1/1, 2/1], [2/1, 3/1], [3/1, 5/1]] (where each element
// is a Rational object).
const getCoordinates = (rawInput) =>
{
    // Separate each row of input.
    const stringRows = rawInput.split("\n");
    const coordinates = [];
    for (let i = 0; i < stringRows.length; i++)
    {
        // Remove whitespace on other side of the line.
        stringRows[i] = stringRows[i].trim();

        // Separate each number in the line (where spaces or commas
        // are delimiters). Then, any empty strings are filtered out
        // (since they are not actual values).
        let stringPair = stringRows[i].trim().split(new RegExp(" +|,+"))
                         .filter(str => {return str});

        let numberPair = [];
        for (let j = 0; j < stringPair.length; j++)
        {
            numberPair.push(convertStringToRational(stringPair[j]))
        }
        if (numberPair.length !== 2)
        {
            throw Error(`Each line must have 2 numbers (line ${i + 1} `
                        + `currently has ${numberPair.length} number`
                        + `${numberPair.length !== 1 ? `s).` : `).`}`);
        }
        coordinates.push(numberPair);
    }
    return coordinates;
}

// This function outputs the ordered pairs to the console. Used
// for debugging.
const logCoordinates = (coordinates) =>
{
    for (let i = 0; i < coordinates.length; i++)
    {
        for (let j = 0; j < coordinates[i].length; j++)
        {
            console.log(coordinates[i][j].numerator + " " + coordinates[i][j].denominator);
        }
    }
}

// This function computes the residual value of a single ordered pair
// using the line of best fit.
const computeResidual = (alpha, beta, x, y) =>
{
    // This line computes (alpha + beta * x).
    const expectedValue = addRationals(alpha, multiplyRationals(beta, x));

    // The residual is defined as the actual value (y) minus
    // the expected value.
    return subtractRationals(y, expectedValue);
}

// This function inputs the 2D array of ordered pairs from getCoordinates,
// and returns an object with properties alpha, beta, and r2
// alpha represents the coefficient of the constant term in the line of best fit.
// beta represents the coefficient of the linear term in the line of best fit.
// r2 represents the coefficient of determination (goodness of fit).
const computeCoefficients = (coordinates) =>
{
    const numCoordinates = coordinates.length;

    // xBar and yBar will be the average values for
    // the x-coordinate and y-coordinate, respectively.

    // xBar = (1 / numCoordinates) * sum (x) for all x.
    // xBar = (1 / numCoordinates) * sum (y) for all y.
    let xBar = new Rational(0, 1);
    let yBar = new Rational(0, 1);

    for (let i = 0; i < numCoordinates; i++)
    {
        xBar = addRationals(xBar, coordinates[i][0]);
        yBar = addRationals(yBar, coordinates[i][1]);
    }
    xBar = multiplyRationals(xBar, new Rational(1, numCoordinates));
    yBar = multiplyRationals(yBar, new Rational(1, numCoordinates));

    // The covariance will represent the sum of the products of differences
    // between each variable and the mean of that variable.

    // covariance = sum (x - xBar)(y - yBar) for all ordered pairs (x, y).
    let covariance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xDiff = subtractRationals(coordinates[i][0], xBar);
        let yDiff = subtractRationals(coordinates[i][1], yBar);
        covariance = addRationals(covariance, multiplyRationals(xDiff, yDiff));
    }

    // The variance for x or y represents the sum of the squares
    // of the difference between each variable and the mean.currDir

    // xVariance = sum((x - xBar)^2) for all x.
    // xVariance = sum((y - yBar)^2) for all y.
    let xVariance = new Rational(0, 1);
    let yVariance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xDiff = subtractRationals(coordinates[i][0], xBar);
        let yDiff = subtractRationals(coordinates[i][1], yBar);
        xVariance = addRationals(xVariance, multiplyRationals(xDiff, xDiff));
        yVariance = addRationals(yVariance, multiplyRationals(yDiff, yDiff));
    }

    // alpha is the constant coefficient in the line of best fit,
    // and beta is the linear coefficient.
    const beta = divideRationals(covariance, xVariance);
    const alpha = subtractRationals(yBar, multiplyRationals(beta, xBar));

    // The regression sum of squares is the sum of the residuals for each
    // ordered pair.

    // regressionSumOfSquares = sum((residual(x, y))^2) for all ordered pairs (x, y).
    let regressionSumOfSquares = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let residual = computeResidual(alpha, beta, coordinates[i][0], coordinates[i][1]);
        residual = multiplyRationals(residual, residual);
        regressionSumOfSquares = addRationals(regressionSumOfSquares, residual);
    }

    // r2 will be the coefficient of determination.

    // r2 = 1 - regressionSumOfSquares / yVariance
    let r2;
    if (yVariance.numerator !== 0)
    {
        r2 = divideRationals(regressionSumOfSquares, yVariance);
        r2 = subtractRationals(new Rational(1, 1), r2);
    }
    else
    {
        // If all of the y values are the same, then r^2 equals 1.
        // This avoids division by 0.
        r2 = new Rational(1, 1);
    }

    // Return an object containing alpha, beta, and r2.
    return {
        alpha: alpha,
        beta: beta,
        r2: r2
    };
}

// This function inputs a solution object (containing alpha and beta)
// and returns a string representing the HTML that will be used as output.
const getLineOfBestFit = (solution) =>
{
    const alpha = solution.alpha;
    const beta = solution.beta;
    let lineOfBestFit;

    if (fractionButton.checked)
    {
        // The output will use fractions.
        lineOfBestFit = `${solution.alpha.toString()} + ${solution.beta.toString()}`
                        + `<span class="fancy"> x</span>`; 
    }
    else
    {
        // The output will use a decimal value.
        lineOfBestFit = `${solution.alpha.numerator / solution.alpha.denominator}`
                + ` + ${solution.beta.numerator / solution.beta.denominator}`
                + `<span class="fancy"> x</span>`; 
    }

    lineOfBestFit = `<span class="fancy">y&nbsp;=&nbsp;</span><span class="math">${lineOfBestFit}</span>`;

    return lineOfBestFit;
}

// This function inputs a solution object (containing r2) and returns
// a string representing the HTML that will be used as output.
const getR2 = (solution) =>
{
    let r2 = `<span class="math">${solution.r2.numerator / solution.r2.denominator}</span>`;
    r2 = `<span class="fancy">r<sup>2</sup>&nbsp;=&nbsp;</span>${r2}`;

    return r2;
}

// This function alters the HTML to show the output.
const outputToPage = (solution) =>
{
    const lineOfBestFit = getLineOfBestFit(solution);
    const r2 = getR2(solution);

    equationDiv.innerHTML = lineOfBestFit;
    r2Div.innerHTML = r2;

    solutionDiv.scrollIntoView();
    solutionDiv.style.visibility = "visible";
}

// This function performs all of the steps needed to process the input
// and present the output. It uses all of the functions presented above.
const computeLinearRegression = () =>
{
    try {
        const rawInput = inputField.value;
        if (!rawInput)
        {
            throw Error("Please enter coordinates in the text field.");
        }
        const coordinates = getCoordinates(rawInput);
        logCoordinates(coordinates);
        const solution = computeCoefficients(coordinates);
        outputToPage(solution);  
    }
    catch(error)
    {
        alert(error);
    }
}

// Clicking the submit button will call computerLinearRegression.
submitButton.addEventListener("click", computeLinearRegression);

// Prevents the submit button from being automatically clicked when the
// page is loaded.
inputForm.addEventListener("submit", (event) => {event.preventDefault();});
