// RationalNumbers.js

// This file contains the Rational class, which is used
// for the computations in Regression.js. This file also
// contains functions necessary to create or manipulate
// Rational objects.

// This function returns the greatest common divisor of two
// numbers.
const greatestCommonDivisor = (a, b) =>
{
    if (a < 0)
    {
        a = -a;
    }
    if (b < 0)
    {
        b = -b;
    }
    if (a === 0 && b === 0)
    {
        throw Error("Numerator and denominator are both 0. Do you have duplicate x values?");
    }
    if (a === 0)
    {
        return b;
    }
    if (b === 0)
    {
        return a;
    }
    if (a < b)
    {
        let temp = a;
        a = b;
        b = temp;
    }

    const remainder = a % b;

    if (remainder !== 0)
    {
        return greatestCommonDivisor(b, remainder);
    }
    else
    {
        return b;
    }
}

// The Rational class contains two properties: _numerator and _denominator.
// The constructor is designed so that a Rational object will always be simplified
// (i.e. the numerator and denominator will be coprime).
class Rational
{
    constructor(numerator, denominator)
    {
        if (denominator < 0)
        {
            numerator = -numerator;
            denominator = -denominator;
        }
        const gcd = greatestCommonDivisor(numerator, denominator);
        this._numerator = numerator / gcd;
        this._denominator = denominator / gcd;
    }

    get numerator ()
    {
        return this._numerator;
    }

    get denominator ()
    {
        return this._denominator;
    }

    // This method returns a string containing the HTML
    // to represent the Rational.
    toString ()
    {
        if (this.denominator === 1)
        {
            return `<div class="number">${this.numerator}</div>`;
        }
        else
        {
            return `<div class="fraction">
                <span class="numerator">${this.numerator}</span>
                <span class="denominator">${this.denominator}</span>
                </div>`;
        }
    }
}

// This method takes two rational numbers and outputs their sum.
const addRationals = (rat1, rat2) =>
{
    return new Rational(
        rat1.numerator * rat2.denominator + rat2.numerator * rat1.denominator,
        rat1.denominator * rat2.denominator
    );
}

// This method takes two rational numbers and outputs their difference.
const subtractRationals = (rat1, rat2) =>
{
    rat2 = new Rational(-1 * rat2.numerator, rat2.denominator);
    return addRationals(rat1, rat2);
}

// This method takes two rational numbers and outputs their product.
const multiplyRationals = (rat1, rat2) =>
{
    return new Rational(
        rat1.numerator * rat2.numerator,
        rat1.denominator * rat2.denominator
    );
}

// This method takes two rational numbers and outputs their quotient.
const divideRationals = (rat1, rat2) =>
{
    rat2 = new Rational(rat2. denominator, rat2.numerator);
    return multiplyRationals(rat1, rat2);
}