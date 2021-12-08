function part1(data) {

    const lines = data.split(/\r?\n/);

    const items = lines.map( line => line.split(" | ") ).map( ([input,output]) => [input.split(" "), output.split(" ")] );

    const outputLengths = items.map( ([input,output]) => output.map( v => v.length ) ).flat();
    
    return outputLengths.filter( len => [2,3,4,7].indexOf(len) >= 0 ).length;

}

function part2(data) {

    // Parse input into [[input, output]] where these are two arrays of strings which have had their characters sorted
    const lines = data.split(/\r?\n/);
    const items = lines.map( line => line.split(" | ") ).map( arr => arr.map( str => str.split(" ").map( str => str.split("").sort().join("") ) ) );

    // Alphabet used in data strings
    const alphabet = "abcdefg".split("");

    // Rules used to determine a digit translation. Must be applied in order.
    // A rule identifies the candidate as `digit` if:
    // - string length matches `length`
    // - a bitwise AND between binary forms of the candidate and `compare` matches the `compare` value
    //   i.e. all of the segments in the comparison are set in the candidate
    // - `matchSelf` modifies the previous step to match against the candidate instead
    //   i.e. all of the segments in the candidate are set in the comparison
    const digitRules = [
        { digit: 1, length: 2 },
        { digit: 4, length: 4 },
        { digit: 7, length: 3 },
        { digit: 8, length: 7 },
        { digit: 3, length: 5, compare: 1 },
        { digit: 9, length: 6, compare: 3 },
        { digit: 5, length: 5, compare: 9, matchSelf: true},
        { digit: 2, length: 5 },
        { digit: 0, length: 6, compare: 1 },
        { digit: 6, length: 6 },
    ];

    // Combine the result for each line with a reducer
    return items.reduce( (count, [input, output]) => {

        // Dictionary of digit string => digit int
        const dict = {};
        // Dictionary of digit int => binary translation of digit string
        const dictBin = {};

        // Pair each digit string with a binary representation
        // Bit positions are determined by character position in alphabet
        const inputWithBin = input.map( digitStr => 
            [ digitStr, 
                alphabet.reduce( (value, char, i) => value + (digitStr.indexOf(char) >= 0 ? 1 << i : 0), 0 ) 
            ]
        );

        digitRules.forEach( rule => {

            // Search input for a digit which obeys the rule
            inputWithBin.some( ([digitStr, digitBin]) => {

                // Skip if we have already defined this digit
                if( dict[digitStr] !== undefined )
                    return;

                // Compare by length first
                if( digitStr.length == rule.length ) {

                    // Determine what to match against
                    const match = rule.matchSelf ? digitBin : dictBin[rule.compare];

                    // Compare via a bitwise AND of the binary translations
                    if ( !rule.compare || (digitBin & dictBin[rule.compare]) == match ) {

                        dict[digitStr] = rule.digit;
                        dictBin[rule.digit] = digitBin;

                        // Break out of some()
                        return true;

                    }
                }

            });

        } );

        // Use the dictionary to translate the output, join as string and convert to number
        return count + Number( output.map( digit => dict[digit] ).join('') );

    }, 0 );

}

module.exports = { part1, part2 }