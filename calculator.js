var DIFFICULTY = 3;
var SKILL = 5;
var CHAOS_BAG = {
    tentacles: 1,
    star: 1,
    tablet: 1,
    cultist: 1,
    skull: 2,
    minus_four: 1,
    minus_three: 1,
    minus_two: 2,
    minus_one: 3,
    zero: 2,
    plus_one: 1
};
var JACQUELINE_ENABLED = false;
var OLIVIA_ENABLED = true;
var CANDLES = 0;
var MODIFIERS = {
    star: 1,
    tablet: -2,
    cultist: -1,
    skull: -1,
    minus_four: -4,
    minus_three: -3,
    minus_two: -2,
    minus_one: -1,
    zero: 0,
    plus_one: 1
}

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
function possibilitiesWithJacqueline(tokens) {
    // check if tokens has tentacles
    if (tokens.indexOf("tentacles") > -1) {
        // sum the modifier of the other tokens
        var sum = 0;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i] !== "tentacles") {
                sum += MODIFIERS[tokens[i]];
            }
        }
        return [sum];
    }

    var possibleModifiers = [];
    for (var token of tokens) {
        // check if the modifier already exists
        if (possibleModifiers.indexOf(MODIFIERS[token]) === -1) {
            possibleModifiers.push(MODIFIERS[token]);
        }
    }
    return possibleModifiers;
}

// function to calculate all possible modifiers after using Olivia's ability
function possibilitiesWithOlivia(tokens) {
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
            sum += MODIFIERS[token];
        }
        if (possibleModifiers.indexOf(sum) === -1) {
            possibleModifiers.push(sum);
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

function calculateProbabilities() {
    var winningPossibilities = 0;
    var fulfillsPredictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    console.log(`Calculating probabilities... [Difficulty: ${DIFFICULTY}, Skill: ${SKILL}, Jacqueline: ${JACQUELINE_ENABLED}, Olivia: ${OLIVIA_ENABLED}]`);

    if (JACQUELINE_ENABLED && !OLIVIA_ENABLED) {
        // draw three tokens
        var tokenCombinations = combinations(CHAOS_BAG, 3);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            var possibilities = possibilitiesWithJacqueline(tokens);
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

    if (OLIVIA_ENABLED && !JACQUELINE_ENABLED) {
        // draw four tokens
        var tokenCombinations = combinations(CHAOS_BAG, 4);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            var possibilities = possibilitiesWithOlivia(tokens);
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

    if (JACQUELINE_ENABLED && OLIVIA_ENABLED) {
        // first draw three tokens with Olivia
        var tokenCombinations = combinations(CHAOS_BAG, 3);
        var numberOfCombinations = tokenCombinations.length;

        for (var tokens of tokenCombinations) {
            // then draw three tokens with Jacqueline
            var newBag = removeFromBag(CHAOS_BAG, tokens);
            var jacquelineTokenCombinations = combinations(newBag, 3);
            var jacquelineModifierPropabilities = {};
            for (var jacquelineTokens of jacquelineTokenCombinations) {
                // for each combination of Jacqueline's tokens, calculate the possible modifiers
                var possibilities = possibilitiesWithJacqueline(jacquelineTokens);
                for (var i = 0; i < possibilities.length; i++) {
                    if (jacquelineModifierPropabilities[possibilities[i]] === undefined) {
                        jacquelineModifierPropabilities[possibilities[i]] = 1;
                    } else {
                        jacquelineModifierPropabilities[possibilities[i]]++;
                    }
                }
            }
            // calculate the odds of each modifier being an option
            for (var modifier in jacquelineModifierPropabilities) {
                jacquelineModifierPropabilities[modifier] /= jacquelineTokenCombinations.length;
            }

            // for each combination of Olivia's tokens, calculate the possible modifiers
            

        }
    }

    return {
        winning: winningPossibilities / numberOfCombinations,
        predictions: fulfillsPredictions.map(x => x / numberOfCombinations)
    };
}