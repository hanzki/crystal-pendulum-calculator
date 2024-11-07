# crystal-pendulum-calculator
trying to see the future with the crystal pendulum

## Things to consider
* Jacqueline can reveal extra 2 tokens and cancel 2 except when cancelling the tentacle token in which case she can only cancel 1.
* Ritual Candles can give a +1 for each symbol revealed.
* Olive McBride can reveal extra 3 tokens and then cancel 2. This results in two tokens still taking an effect.
* If Dark Future is in play Jacqueline cannot cancel or ignore symbols except bless and curse.
* Bless and curse tokens result in drawing another token."

## What do I want?
* List of probabilities for different Crystal Pendulum choices of coming true
* Seeing easily the choice with highest probability
* Option to enable Ritual Candles (1 or 2) and Olive McBride for the calculation"

## How to calculate the ods
1. Generate all possible combinations of revealed tokens
2. For each combination calculate the following:
    1. List of possible final modifiers that can be chosen (consider ritual candles)
    2. Whether there is a winning choice
3. For each ritual candle choice check how many combinations could match it and from that calculate the probability
4. Calculate total possibility to win the check

## How to handle Olivia and Jacqueline
* Alone both are easy.
    * For Olivia pick 4 and choose any two.
    * For Jacqueline pick 3 and choose any 1 or if tentacles was drawn choose the two others.
* When used together need to choose the order. Either Olivia first or Jacqueline first.
* Olivia first:
    * Reveal 3 normally.
    * For last reveal 3 and pick 1 (or 2 if tentacles would get cancelled)
    * With olivia then choose two (if I understood correctly, if Jacqueline resulted into 2 tokens olivia cannot split them)
* Jacqueline first:
    * Reveal 2 normally.
    * for last reveal instead 4 and pick any 2.
    * now for Jacqueline need to cancel two of revealed tokens, but if cancelling the olivia tokens they need to be cancelled or resolved both.
* Feels that the Olivia first option is better