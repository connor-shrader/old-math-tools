const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#coordinates");
const inputForm = document.querySelector("#inputForm");
const r2Selecter = document.querySelector("#r2");
const solutionSelecter = document.querySelector("#solution");

const fractionButton = document.getElementById("fractionButton");
const decimalButton = document.getElementById("decimalButton");


convertStringToRational = (str) =>
{
    if (!isNaN(str))
    {
        let power = 1;
        let num = Number(str);
        while(true)
        {
            console.log(num * power % 1);
            if (num * power % 1 === 0)
            {
                return new Rational(num * power, power);
            }
            power *= 10;
        }
    }
    else
    {
        //console.log(`${str} is a fraction`);
        const fraction = str.split("/");
        //console.log(`${fraction} are the components`);
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

const getCoordinates = (rawInput) =>
{
    const stringRows = rawInput.split("\n");
    const coordinates = [];
    for (let i = 0; i < stringRows.length; i++)
    {
        stringRows[i] = stringRows[i].trim();
        //console.log(stringRows[i]);
        let stringPair = stringRows[i].trim().split(new RegExp(" +|,+"))
                         .filter(str => {return str});
        //console.log(stringPair);
        let numberPair = [];
        for (let j = 0; j < stringPair.length; j++)
        {
            numberPair.push(convertStringToRational(stringPair[j]))
        }
        if (numberPair.length !== 2)
        {
            //console.log(numberPair);
            throw Error(`Each line must have 2 numbers (line ${i + 1} `
                        + `currently has ${numberPair.length} number`
                        + `${numberPair.length !== 1 ? `s).` : `).`}`);
        }
        coordinates.push(numberPair);
    }
    return coordinates;
}

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

const computeResidual = (alpha, beta, x, y) =>
{
    const expectedValue = addRationals(alpha, multiplyRationals(beta, x));
    return subtractRationals(y, expectedValue);
}

const computeCoefficients = (coordinates) =>
{
    const numCoordinates = coordinates.length;
    const coefficients = [];

    let xBar = new Rational(0, 1);
    let yBar = new Rational(0, 1);

    // Compute xbar and ybar (average x and y values)
    for (let i = 0; i < numCoordinates; i++)
    {
        xBar = addRationals(xBar, coordinates[i][0]);
        yBar = addRationals(yBar, coordinates[i][1]);
    }
    xBar = multiplyRationals(xBar, new Rational(1, numCoordinates));
    yBar = multiplyRationals(yBar, new Rational(1, numCoordinates));

    let covariance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xDiff = subtractRationals(coordinates[i][0], xBar);
        let yDiff = subtractRationals(coordinates[i][1], yBar);
        covariance = addRationals(covariance, multiplyRationals(xDiff, yDiff));
    }

    let xVariance = new Rational(0, 1);
    let yVariance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xDiff = subtractRationals(coordinates[i][0], xBar);
        let yDiff = subtractRationals(coordinates[i][1], yBar);
        xVariance = addRationals(xVariance, multiplyRationals(xDiff, xDiff));
        yVariance = addRationals(yVariance, multiplyRationals(yDiff, yDiff));
    }

    const beta = divideRationals(covariance, xVariance);
    const alpha = subtractRationals(yBar, multiplyRationals(beta, xBar));

    let regressionSumOfSquares = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let residual = computeResidual(alpha, beta, coordinates[i][0], coordinates[i][1]);
        residual = multiplyRationals(residual, residual);
        regressionSumOfSquares = addRationals(regressionSumOfSquares, residual);
    }

    console.log(regressionSumOfSquares);
    console.log(yVariance);

    let r2;
    if (yVariance.numerator !== 0)
    {
        r2 = divideRationals(regressionSumOfSquares, yVariance);
        r2 = subtractRationals(new Rational(1, 1), r2);
    }
    else
    {
        r2 = new Rational(1, 1);
    }

    coefficients.push(alpha);
    coefficients.push(beta);
    
    return {
        alpha: alpha,
        beta: beta,
        r2: r2
    };
}

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

        if (fractionButton.checked === true)
        {
            let lineOfBestFit = `${solution.alpha.toString()} + ${solution.beta.toString()}`
                            + `<span class="fancy"> x</span>`; 
            
            solutionSelecter.innerHTML = lineOfBestFit;
            r2Selecter.innerHTML = solution.r2.toString();
            
        }
        else
        {
            let lineOfBestFit = `${solution.alpha.numerator / solution.alpha.denominator}`
                                + ` + ${solution.beta.numerator / solution.beta.denominator}`
                                + `<span class="fancy"> x</span>`; 

            solutionSelecter.innerHTML = lineOfBestFit;
            r2Selecter.innerHTML = `<span class="math">${solution.r2.numerator / solution.r2.denominator}</span>`;
        }
        
    }
    catch(error)
    {
        alert(error);
    }
}

submitButton.addEventListener("click", computeLinearRegression);
inputForm.addEventListener("submit", (event) => {event.preventDefault();});
