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

// Function to calculate all possible sets of tokens of size n that can be drawn from the given tokens
function combinations(tokens, n, prior = []) {
    if (n === 0) {
        return [prior];
    }

    // sum of tokens to choose from
    var sum = 0;
    for (var key in tokens) {
        sum += tokens[key];
    }
    if(sum < n) {
        return [];
    }

    var key = Object.keys(tokens)[0];
    var newTokens = Object.assign({}, tokens);
    newTokens[key]--;
    if (newTokens[key] === 0) {
        delete newTokens[key];
    }
    // copy prior array
    newPrior = prior.slice();

    // pick the token
    var result = combinations(newTokens, n - 1, newPrior.concat([key]));
    // don't pick the token
    result = result.concat(combinations(newTokens, n, prior));
    return result;
}

class ChaosBag {
    constructor() {
        this.tokens = structuredClone(DEFAULT_TOKENS);
    }

    combinations(n) {
        const allTokens = Object.keys(this.tokens).reduce((acc, key) => {
            acc[key] = this.tokens[key].count;
            return acc;
        }, {});
        return combinations(allTokens, n);
    }

    get numberOfTokens() {
        return Object.keys(this.tokens).reduce((acc, key) => {
            return acc + this.tokens[key].count;
        }, 0);
    }

    get defaultValue() {
        var tokenPossibilities = this.combinations(1);
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