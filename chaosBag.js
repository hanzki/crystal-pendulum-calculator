const DEFAULT_TOKENS = {
    tentacles: {
        count: 1,
        modifier: undefined,
    },
    star: {
        count: 1,
        modifier: 1,
    },
    tablet: {
        count: 1,
        modifier: -2,
    },
    cultist: {
        count: 1,
        modifier: -1,
    },
    skull: {
        count: 2,
        modifier: -1,
    },
    minus_four: {
        count: 1,
        modifier: -4,
    },
    minus_three: {
        count: 1,
        modifier: -3,
    },
    minus_two: {
        count: 2,
        modifier: -2,
    },
    minus_one: {
        count: 3,
        modifier: -1,
    },
    zero: {
        count: 2,
        modifier: 0,
    },
    plus_one: {
        count: 1,
        modifier: 1,
    }
};

function combinations(tokens, n, prior = []) {
    console.assert(n > 0 && n <= 6, "n must be between 1 and 6");

    switch (n) {
        case 1:
            return tokens.map(t => [...prior, t]);
        case 2:
            return tokens.flatMap((t1, i1) => (
                tokens.slice(i1 + 1).map(t2 => [...prior, t1, t2])));
        case 3:
            return tokens.flatMap((t1, i1) => (
                tokens.slice(i1 + 1).flatMap((t2, i2) => (
                    tokens.slice(i1 + i2 + 2).map(t3 => [...prior, t1, t2, t3])))));
        case 4:
            return tokens.flatMap((t1, i1) => (
                tokens.slice(i1 + 1).flatMap((t2, i2) => (
                    tokens.slice(i1 + i2 + 2).flatMap((t3, i3) => (
                        tokens.slice(i1 + i2 + i3 + 3).map(t4 => [...prior, t1, t2, t3, t4])))))));
        case 5:
            return tokens.flatMap((t1, i1) => (
                tokens.slice(i1 + 1).flatMap((t2, i2) => (
                    tokens.slice(i1 + i2 + 2).flatMap((t3, i3) => (
                        tokens.slice(i1 + i2 + i3 + 3).flatMap((t4, i4) => (
                            tokens.slice(i1 + i2 + i3 + i4 + 4).map(t5 => [...prior, t1, t2, t3, t4, t5])))))))));
        case 6:
            return tokens.flatMap((t1, i1) => (
                tokens.slice(i1 + 1).flatMap((t2, i2) => (
                    tokens.slice(i1 + i2 + 2).flatMap((t3, i3) => (
                        tokens.slice(i1 + i2 + i3 + 3).flatMap((t4, i4) => (
                            tokens.slice(i1 + i2 + i3 + i4 + 4).flatMap((t5, i5) => (
                                tokens.slice(i1 + i2 + i3 + i4 + i5 + 5).map(t6 => [...prior, t1, t2, t3, t4, t5, t6])))))))))));
    }
}

function isTentacles(token) {
    return token === 'tentacles';
}

function isSymbol(token) {
    return ['tentacles','star','tablet','cultist','skull'].includes(token);
}

function isNumber(token) {
    return ['minus_four','minus_three','minus_two','minus_one','zero','plus_one'].includes(token);
}

class ChaosBag {
    constructor() {
        this.tokens = structuredClone(DEFAULT_TOKENS);
    }

    get listOfTokens() {
        return Object.keys(this.tokens).reduce((acc, key) => {
            for (let i = 0; i < this.tokens[key].count; i++) {
                acc.push(key);
            }
            return acc;
        }, []);
    }

    get numberOfTokens() {
        return Object.keys(this.tokens).reduce((acc, key) => {
            return acc + this.tokens[key].count;
        }, 0);
    }

    get defaultValue() {
        var tokenPossibilities = combinations(this.listOfTokens, 1);
        var sumOfModifiers = 0;

        for (var token of tokenPossibilities) {
            if(token[0] === "tentacles") {
                continue;
            }
            sumOfModifiers += this.tokens[token[0]].modifier;
        }

        return sumOfModifiers / this.numberOfTokens;
    }
};