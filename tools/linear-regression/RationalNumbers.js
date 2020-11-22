class Rational
{
    constructor(numerator, denominator)
    {
        const gcd = greatestCommonDivisor(numerator, denominator);
        let numer = numerator / gcd;
        let denom = denominator / gcd;

        // Overflow handler
        let maximum = Math.max(numer, denom);
        if (maximum % (2 << 24) !== 0)
        {

        }
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

    toString ()
    {
        if (this.denominator === 1)
        {
            return `<div class="number monospace">${this.numerator}</div>`;
        }
        else
        {
            return `<div class="fraction monospace">
                <span class="numerator">${this.numerator}</span>
                <span class="denominator">${this.denominator}</span>
                </div>`;
        }
    }

    truncate ()
    {
        this._numerator = this.numerator / 10;
        this._denominator = this.denominator / 10;
    }
}

const addRationals = (rat1, rat2) =>
{
    return new Rational(
        rat1.numerator * rat2.denominator + rat2.numerator * rat1.denominator,
        rat1.denominator * rat2.denominator
    );
}

const subtractRationals = (rat1, rat2) =>
{
    rat2 = new Rational(-1 * rat2.numerator, rat2.denominator);
    return addRationals(rat1, rat2);
}

const multiplyRationals = (rat1, rat2) =>
{
    return new Rational(
        rat1.numerator * rat2.numerator,
        rat1.denominator * rat2.denominator
    );
}

const divideRationals = (rat1, rat2) =>
{
    rat2 = new Rational(rat2. denominator, rat2.numerator);
    return multiplyRationals(rat1, rat2);
}

const reduceRational = (rat) =>
{
    let gcd = greatestCommonDivisor(rat.numerator, rat.denominator);
    if (gcd !== 1)
    {
        return new Rational(rat.numerator / gcd, rat.denominator / gcd);
    }
}

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