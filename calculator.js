var DIFFICULTY = 3;
var SKILL = 5;
var JACQUELINE_ENABLED = false;
var OLIVE_ENABLED = false;
var CANDLES = 0;

/*
// Function to calculate all possible sets of tokens of size n that can be drawn from the bag
function combinations(bag, n, prior = []) {
    if (n === 0) {
        return [prior];
    }

    // sum of tokens remaining in the bag
    var sum = 0;
    for (var key in bag) {
        sum += bag[key];
    }
    if(sum < n) {
        return [];
    }

    var key = Object.keys(bag)[0];
    var newBag = Object.assign({}, bag);
    newBag[key]--;
    if (newBag[key] === 0) {
        delete newBag[key];
    }
    // copy prior array
    newPrior = prior.slice();

    // pick the token
    var result = combinations(newBag, n - 1, newPrior.concat([key]));
    // don't pick the token
    result = result.concat(combinations(newBag, n, prior));
    return result;
}
    */

// function to remove tokens from the bag
function removeFromBag(bag, tokens) {
    var newBag = Object.assign({}, bag);
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        newBag[token]--;
        if (newBag[token] === 0) {
            delete newBag[token];
        }
    }
    return newBag;
}

// converts array of tokens into a bag format
function tokensToBag(tokens) {
    var bag = {};
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (bag[token] === undefined) {
            bag[token] = 1;
        } else {
            bag[token]++;
        }
    }
    return bag;
}

// function to calculate all possible modifiers after using Jacqueline's ability
function possibilitiesWithJacqueline(tokens, modifiers) {
    // check if tokens has tentacles
    if (tokens.indexOf("tentacles") > -1) {
        // sum the modifier of the other tokens
        var sum = 0;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i] !== "tentacles") {
                sum += modifiers[tokens[i]];
            }
        }
        return [sum];
    }

    var possibleModifiers = [];
    for (var token of tokens) {
        // check if the modifier already exists
        if (possibleModifiers.indexOf(modifiers[token]) === -1) {
            possibleModifiers.push(modifiers[token]);
        }
    }
    return possibleModifiers;
}

// function to calculate all possible modifiers after using Olive's ability
function possibilitiesWithOlive(tokens, modifiers) {
    // check if tokens has tentacles
    if (tokens.indexOf("tentacles") > -1) {
        //remove tentacles from the tokens
        tokens = tokens.slice();
        tokens.splice(tokens.indexOf("tentacles"), 1);
    }

    // calculate all possible modifiers for each pair of tokens
    var possibleModifiers = [];
    var tokenCombinations = combinations(tokensToBag(tokens), 2);
    for (var tokens of tokenCombinations) {
        var sum = 0;
        for (var token of tokens) {
            sum += modifiers[token];
        }
        if (possibleModifiers.indexOf(sum) === -1) {
            possibleModifiers.push(sum);
        }
    }
    return possibleModifiers;
}

// function to calculate all possible modifiers after using both Jacqueline's and Olive's abilities
// first three tokens in the input are drawn with Olive and the last three with Jacqueline
function possibilitiesWithOliveAndJacqueline(tokens, modifiers) {
    var jacquelineTokens = tokens.slice(3);
    var oliveTokens = tokens.slice(0, 3);

    // check if Olive tokens has tentacles
    if (oliveTokens.indexOf("tentacles") > -1) {
        //remove tentacles from the tokens
        oliveTokens.splice(oliveTokens.indexOf("tentacles"), 1);
    }

    var possibleModifiers = [];

    // calculate all possible modifiers without Jacqueline's token
    var tokenCombinations = combinations(tokensToBag(oliveTokens), 2);
    for (var tokens of tokenCombinations) {
        var sum = 0;
        for (var token of tokens) {
            sum += modifiers[token];
        }
        if (possibleModifiers.indexOf(sum) === -1) {
            possibleModifiers.push(sum);
        }
    }

    // calculate all possible modifiers with Jacqueline's token
    var jacquelineModifiers = possibilitiesWithJacqueline(jacquelineTokens);
    for (var token of oliveTokens) {
        for (var jacquelineModifier of jacquelineModifiers) {
            var sum = modifiers[token] + jacquelineModifier;
            if (possibleModifiers.indexOf(sum) === -1) {
                possibleModifiers.push(sum);
            }
        }
    }
    return possibleModifiers;
}

// function to check if there is a winning possibility in the given modifiers
function hasWinningPossibility(possibilities) {
    for (var i = 0; i < possibilities.length; i++) {
        if (possibilities[i] + SKILL >= DIFFICULTY) {
            return true;
        }
    }
    return false;
}

// function to check if the possibilities can fulfill the given crystal pendulum prediction
function canFulfillPrediction(possibilities, prediction) {
    for (var i = 0; i < possibilities.length; i++) {
        if (Math.abs(possibilities[i] + SKILL - DIFFICULTY) === prediction) {
            return true;
        }
    }
    return false;
}

function calculateProbabilities(bag) {
    var winningPossibilities = 0;
    var fulfillsPredictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const allTokens = Object.keys(bag.tokens).reduce((acc, key) => {
        acc[key] = bag.tokens[key].count;
        return acc;
    }, {});
    const modifiers = Object.keys(bag.tokens).reduce((acc, key) => {
        if (key !== 'tentacles') {
            acc[key] = bag.tokens[key].modifier;
        }
        return acc;
    }, {});

    console.log(`Calculating probabilities... [Difficulty: ${DIFFICULTY}, Skill: ${SKILL}, Jacqueline: ${JACQUELINE_ENABLED}, Olive: ${OLIVE_ENABLED}]`);
    console.log({allTokens, modifiers});

    if (!JACQUELINE_ENABLED && !OLIVE_ENABLED) {
        // draw one token
        var tokenCombinations = combinations(allTokens, 1);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            if(tokens[0] === "tentacles") {
                continue;
            }
            var possibilities = [modifiers[tokens[0]]];
            if (hasWinningPossibility(possibilities)) {
                winningPossibilities++;
            }
            for (var i = 0; i < fulfillsPredictions.length; i++) {
                if (canFulfillPrediction(possibilities, i)) {
                    fulfillsPredictions[i]++;
                }
            }
        }
    }

    if (JACQUELINE_ENABLED && !OLIVE_ENABLED) {
        // draw three tokens
        var tokenCombinations = combinations(allTokens, 3);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            var possibilities = possibilitiesWithJacqueline(tokens, modifiers);
            if (hasWinningPossibility(possibilities)) {
                winningPossibilities++;
            }
            for (var i = 0; i < fulfillsPredictions.length; i++) {
                if (canFulfillPrediction(possibilities, i)) {
                    fulfillsPredictions[i]++;
                }
            }
        }
    }

    if (OLIVE_ENABLED && !JACQUELINE_ENABLED) {
        // draw four tokens
        var tokenCombinations = combinations(allTokens, 4);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            var possibilities = possibilitiesWithOlive(tokens, modifiers);
            if (hasWinningPossibility(possibilities)) {
                winningPossibilities++;
            }
            for (var i = 0; i < fulfillsPredictions.length; i++) {
                if (canFulfillPrediction(possibilities, i)) {
                    fulfillsPredictions[i]++;
                }
            }
        }
    }

    if (JACQUELINE_ENABLED && OLIVE_ENABLED) {
        // first draw three tokens with Olive
        var oliveTokenCombinations = combinations(allTokens, 3);

        var oliveAndJacquelineTokens = [];
        for (var oliveTokens of oliveTokenCombinations) {
            // then draw three tokens with Jacqueline
            var newBag = removeFromBag(allTokens, oliveTokens);
            var jacquelineTokens = combinations(newBag, 3, oliveTokens);
            oliveAndJacquelineTokens.push(...jacquelineTokens);
        }
        var numberOfCombinations = oliveAndJacquelineTokens.length;

        for (var tokens of oliveAndJacquelineTokens) {
            var possibilities = possibilitiesWithOliveAndJacqueline(tokens, modifiers);
            if (hasWinningPossibility(possibilities)) {
                winningPossibilities++;
            }
            for (var i = 0; i < fulfillsPredictions.length; i++) {
                if (canFulfillPrediction(possibilities, i)) {
                    fulfillsPredictions[i]++;
                }
            }
        }
    }

    return {
        winning: winningPossibilities / numberOfCombinations,
        predictions: fulfillsPredictions.map(x => x / numberOfCombinations)
    };
}