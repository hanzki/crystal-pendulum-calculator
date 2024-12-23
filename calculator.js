// function to remove tokens from tokens array
function removeTokens(tokens, tokensToRemove) {
    const newTokens = tokens.slice();
    for (const token of tokensToRemove) {
        newTokens.splice(newTokens.indexOf(token), 1);
    }
    return newTokens;
}

// function to calculate all possible modifiers after using candles
function possibilitiesWithCandles(originalModifier, numberOfSymbols, candles) {
    const maxAdjustment = numberOfSymbols * candles;
    const possibilities = [];
    for ( let i = 0; i <= maxAdjustment; i++) {
        possibilities.push(originalModifier + i);
    }
    return possibilities;
}

// function to calculate all possible modifiers after using Jacqueline's ability
function possibilitiesWithJacqueline(tokens, modifiers, candles) {
    // check if tokens has tentacles
    if (tokens.indexOf("tentacles") > -1) {
        // sum the modifier of the other tokens
        let sum = 0;
        let numberOfSymbols = 0;
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== "tentacles") {
                sum += modifiers[tokens[i]];
                if (isSymbol(tokens[i])) {
                    numberOfSymbols++;
                }
            }
        }
        return possibilitiesWithCandles(sum, numberOfSymbols, candles);
    }

    const possibleModifiers = [];
    for (let token of tokens) {
        const possibleModifiersForToken = possibilitiesWithCandles(modifiers[token], isSymbol(token) ? 1 : 0, candles);
        for (const modifier of possibleModifiersForToken) {
            // check if the modifier already exists
            if (possibleModifiers.indexOf(modifier) === -1) {
                possibleModifiers.push(modifier);
            }
        }
    }
    return possibleModifiers;
}

// function to calculate all possible modifiers after using Olive's ability
function possibilitiesWithOlive(tokens, modifiers, candles) {
    // check if tokens has tentacles
    if (tokens.indexOf("tentacles") > -1) {
        //remove tentacles from the tokens
        tokens = tokens.slice();
        tokens.splice(tokens.indexOf("tentacles"), 1);
    }

    // calculate all possible modifiers for each pair of tokens
    const possibleModifiers = [];
    const tokenCombinations = combinations(tokens, 2);
    for (const tokens of tokenCombinations) {
        let sum = 0;
        let numberOfSymbols = 0;
        for (const token of tokens) {
            sum += modifiers[token];
            if (isSymbol(token)) {
                numberOfSymbols++;
            }
        }
        const possibilities = possibilitiesWithCandles(sum, numberOfSymbols, candles);
        for (const possibility of possibilities) {
            // add the possible modifiers to the list if it doesn't exist
            if (possibleModifiers.indexOf(possibility) === -1) {
                possibleModifiers.push(possibility);
            }
        }
    }
    return possibleModifiers;
}

// function to calculate all possible modifiers after using both Jacqueline's and Olive's abilities
// first three tokens in the input are drawn with Olive and the last three with Jacqueline
function possibilitiesWithOliveAndJacqueline(tokens, modifiers, candles) {
    const jacquelineTokens = tokens.slice(3);
    const oliveTokens = tokens.slice(0, 3);

    // check if Olive tokens has tentacles
    if (oliveTokens.indexOf("tentacles") > -1) {
        //remove tentacles from the tokens
        oliveTokens.splice(oliveTokens.indexOf("tentacles"), 1);
    }

    const possibleModifiers = [];

    // calculate all possible modifiers without Jacqueline's token
    const tokenCombinations = combinations(oliveTokens, 2);
    for (const tokens of tokenCombinations) {
        let sum = 0;
        let numberOfSymbols = 0;
        for (const token of tokens) {
            sum += modifiers[token];
            if (isSymbol(token)) {
                numberOfSymbols++;
            }
        }
        const possibilities = possibilitiesWithCandles(sum, numberOfSymbols, candles);
        for (const possibility of possibilities) {
            // add the possible modifiers to the list if it doesn't exist
            if (possibleModifiers.indexOf(possibility) === -1) {
                possibleModifiers.push(possibility);
            }
        }
    }

    // calculate all possible modifiers with Jacqueline's token
    const jacquelineModifiers = possibilitiesWithJacqueline(jacquelineTokens, modifiers, candles);
    for (const token of oliveTokens) {
        for (const jacquelineModifier of jacquelineModifiers) {
            const sum = modifiers[token] + jacquelineModifier;
            // candle adjustments are already included in the Jacqueline's modifier but we need to include them for Olive's token
            const possibilities = possibilitiesWithCandles(sum, isSymbol(token) ? 1 : 0, candles);
            for (const possibility of possibilities) {
                // add the possible modifiers to the list if it doesn't exist
                if (possibleModifiers.indexOf(possibility) === -1) {
                    possibleModifiers.push(possibility);
                }
            }
        }
    }
    return possibleModifiers;
}

// function to check if there is a winning possibility in the given modifiers
function hasWinningPossibility(config, possibilities) {
    for (const possibility of possibilities) {
        if (possibility + config.skill >= config.difficulty) {
            return true;
        }
    }
    return false;
}

// function to check if the possibilities can fulfill the given crystal pendulum prediction
function canFulfillPrediction(config, possibilities, prediction) {
    let canFulfill = false;

    for (const possibility of possibilities) {
        if (Math.abs(possibility + config.skill - config.difficulty) === prediction) {
            if(possibility + config.skill - config.difficulty >= 0) {
                return {fulfill: true, positive: true};
            } else {
                canFulfill = true;
            }
        }
    }
    return {fulfill: canFulfill, positive: false};
}

function calculateProbabilities(config, bag) {
    let winningPossibilities = 0;
    const fulfillsPredictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const fulfillsAndWinsPredictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let numberOfCombinations = 0;

    const allTokens = bag.listOfTokens;
    const modifiers = Object.keys(bag.tokens).reduce((acc, key) => {
        if (key !== 'tentacles') {
            acc[key] = bag.tokens[key].modifier;
        }
        return acc;
    }, {});

    console.debug(`Calculating probabilities... Config: ${JSON.stringify(config)}`);
    console.debug({allTokens, modifiers});

    if (!config.jacqueline && !config.olive) {
        // draw one token
        const tokenCombinations = combinations(allTokens, 1);
        numberOfCombinations = tokenCombinations.length;

        for (const tokens of tokenCombinations) {
            if(tokens[0] === "tentacles") {
                continue;
            }
            const possibilities = possibilitiesWithCandles(modifiers[tokens[0]], isSymbol(tokens[0]) ? 1 : 0, config.candles);
            if (hasWinningPossibility(config, possibilities)) {
                winningPossibilities++;
            }
            for (let i = 0; i < fulfillsPredictions.length; i++) {
                const {fulfill, positive} = canFulfillPrediction(config, possibilities, i);
                if (fulfill) {
                    fulfillsPredictions[i]++;
                }
                if (positive) {
                    fulfillsAndWinsPredictions[i]++;
                }
            }
        }
    }

    if (config.jacqueline && !config.olive) {
        // draw three tokens
        const tokenCombinations = combinations(allTokens, 3);
        numberOfCombinations = tokenCombinations.length;

        for (const tokens of tokenCombinations) {
            const possibilities = possibilitiesWithJacqueline(tokens, modifiers, config.candles);
            if (hasWinningPossibility(config, possibilities)) {
                winningPossibilities++;
            }
            for (let i = 0; i < fulfillsPredictions.length; i++) {
                const {fulfill, positive} = canFulfillPrediction(config, possibilities, i);
                if (fulfill) {
                    fulfillsPredictions[i]++;
                }
                if (positive) {
                    fulfillsAndWinsPredictions[i]++;
                }
            }
        }
    }

    if (config.olive && !config.jacqueline) {
        // draw four tokens
        const tokenCombinations = combinations(allTokens, 4);
        numberOfCombinations = tokenCombinations.length;

        for (const tokens of tokenCombinations) {
            const possibilities = possibilitiesWithOlive(tokens, modifiers, config.candles);
            if (hasWinningPossibility(config, possibilities)) {
                winningPossibilities++;
            }
            for (let i = 0; i < fulfillsPredictions.length; i++) {
                const {fulfill, positive} = canFulfillPrediction(config, possibilities, i);
                if (fulfill) {
                    fulfillsPredictions[i]++;
                }
                if (positive) {
                    fulfillsAndWinsPredictions[i]++;
                }
            }
        }
    }

    if (config.jacqueline && config.olive) {
        // first draw three tokens with Olive
        const oliveTokenCombinations = combinations(allTokens, 3);

        const oliveAndJacquelineTokens = [];
        for (const oliveTokens of oliveTokenCombinations) {
            // then draw three tokens with Jacqueline
            const tokensWithoutOliveTokens = removeTokens(allTokens, oliveTokens);
            const jacquelineTokens = combinations(tokensWithoutOliveTokens, 3, oliveTokens);
            oliveAndJacquelineTokens.push(...jacquelineTokens);
        }
        numberOfCombinations = oliveAndJacquelineTokens.length;

        for (const tokens of oliveAndJacquelineTokens) {
            const possibilities = possibilitiesWithOliveAndJacqueline(tokens, modifiers, config.candles);
            if (hasWinningPossibility(config, possibilities)) {
                winningPossibilities++;
            }
            for (let i = 0; i < fulfillsPredictions.length; i++) {
                const {fulfill, positive} = canFulfillPrediction(config, possibilities, i);
                if (fulfill) {
                    fulfillsPredictions[i]++;
                }
                if (positive) {
                    fulfillsAndWinsPredictions[i]++;
                }
            }
        }
    }

    return {
        winning: winningPossibilities / numberOfCombinations,
        predictions: fulfillsPredictions.map(x => x / numberOfCombinations),
        predictionsAndWins: fulfillsAndWinsPredictions.map(x => x / numberOfCombinations)
    };
}