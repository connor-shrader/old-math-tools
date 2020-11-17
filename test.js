const url = 'http://api.datamuse.com/words';
const paramType = '?rel_rhy=';
const inputValue = 'dog';

const getSuggestions = () =>
{
    const endpoint = url + paramType + inputValue;
    console.log(endpoint);

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.onreadystatechange = () =>
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            displayOutput(xhr.response);
        }
    };
    xhr.open('GET', endpoint);
    xhr.send();
}

const getSuggestions2 = async () =>
{
    const endpoint = url + paramType + inputValue;

    try
    {
        const response = await fetch(endpoint);
        if (response.ok)
        {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

const displayOutput = (response) =>
{
    console.log(response);
}

getSuggestions2();