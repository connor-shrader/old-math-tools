const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#coordinates");
const inputForm = document.querySelector("#inputForm");

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

const computeCoefficients = (coordinates) =>
{
    const numCoordinates = coordinates.length;
    const coefficients = [];

    let xbar = new Rational(0, 1);
    let ybar = new Rational(0, 1);

    // Compute xbar and ybar (average x and y values)
    for (let i = 0; i < numCoordinates; i++)
    {
        xbar = addRationals(xbar, coordinates[i][0]);
        ybar = addRationals(ybar, coordinates[i][1]);
        console.log("ybar: " + ybar.numerator + "/" + ybar.denominator);
    }
    console.log("ybar: " + ybar.numerator + "/" + ybar.denominator);
    xbar = multiplyRationals(xbar, new Rational(1, numCoordinates));
    ybar = multiplyRationals(ybar, new Rational(1, numCoordinates));
    console.log("xbar: " + xbar.numerator + "/" + xbar.denominator);
    console.log("ybar: " + ybar.numerator + "/" + ybar.denominator);

    let covariance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xdiff = subtractRationals(coordinates[i][0], xbar);
        let ydiff = subtractRationals(coordinates[i][1], ybar);
        covariance = addRationals(covariance, multiplyRationals(xdiff, ydiff));
    }

    let variance = new Rational(0, 1);
    for (let i = 0; i < numCoordinates; i++)
    {
        let xdiff = subtractRationals(coordinates[i][0], xbar);
        variance = addRationals(variance, multiplyRationals(xdiff, xdiff));
    }

    const beta = divideRationals(covariance, variance);
    const alpha = subtractRationals(ybar, multiplyRationals(beta, xbar));
    coefficients.push(beta);
    coefficients.push(alpha);
    return {
        coefficients: coefficients
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

        const coefficients = computeCoefficients(coordinates);

        console.log(coefficients);
    }
    catch(error)
    {
        alert(error);
    }
}

submitButton.addEventListener("click", computeLinearRegression);

inputForm.addEventListener("submit", (event) => {event.preventDefault();});

