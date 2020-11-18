const submitButton = document.querySelector("#submit");
const inputField = document.querySelector("#coordinates");
const inputForm = document.querySelector("#inputForm");

convertStringToInteger = (str) =>
{
    if (!isNaN(str))
    {
        return Number(str);
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
            return Number(fraction[0]) / Number(fraction[1]);
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
            numberPair.push(convertStringToInteger(stringPair[j]))
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

const computeLinearRegression = () =>
{
    try {
        const rawInput = inputField.value;
        if (!rawInput)
        {
            throw Error("Please enter coordinates in the text field.");
        }

        const coordinates = getCoordinates(rawInput);
        
        for (let i = 0; i < coordinates.length; i++)
        {
            for (let j = 0; j < coordinates[i].length; j++)
            {
                console.log(coordinates[i][j]);
            }
        }
    }
    catch(error)
    {
        alert(error);
    }
}

submitButton.addEventListener("click", computeLinearRegression);

inputForm.addEventListener("submit", (event) => {event.preventDefault();});

