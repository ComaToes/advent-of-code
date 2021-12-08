function part1(data) {

    const lines = data.split(/\r?\n/);

    const items = lines.map( line => line.split(" | ") ).map( ([input,output]) => [input.split(" "), output.split(" ")] );

    const outputLengths = items.map( ([input,output]) => output.map( v => v.length ) ).flat();
    
    return outputLengths.filter( len => [2,3,4,7].indexOf(len) >= 0 ).length;

}

function part2(data) {

    const lines = data.split(/\r?\n/);
    const items = lines.map( line => line.split(" | ") ).map( arr => arr.map( str => str.split(" ").map( str => str.split("").sort().join("") ) ) );
    const alphabet = "abcdefg".split("");

    return items.reduce( (count, [input, output]) => {

        const dict = {};
        const dictBin = {};

        const all = input.concat(output).map( digit => 
            [ digit, 
                alphabet.reduce( (value, char, i) => value + (digit.indexOf(char) >= 0 ? 1 << i : 0), 0 ) 
            ]
        );

        const digitRules = [
            { digit: 3, length: 5, compare: 1 },
            { digit: 9, length: 6, compare: 3 },
            { digit: 5, length: 5, compare: 9, matchSelf: true, else: 2 },
            { digit: 0, length: 6, compare: 1, else: 6 },
        ];

        // 1, 4, 7, 8 by length
        all.forEach( ([digit, digitBin]) => {
            if( dict[digit] )
                return;
            let value = false;
            switch( digit.length ) {
                case 2: value = 1; break;
                case 3: value = 7; break;
                case 4: value = 4; break;
                case 7: value = 8; break;
            }
            if( value ) {
                dict[digit] = value;
                dict[value] = digit;
                dictBin[digitBin] = value;
                dictBin[value] = digitBin;
            }
        });

        // Other digits by rules
        digitRules.forEach( rule => {
            all.forEach( ([digit, digitBin]) => {
                if( dict[digit] )
                    return;
                const match = rule.matchSelf ? digitBin : dictBin[rule.compare];
                if( digit.length == rule.length ) {
                    if ( (digitBin & dictBin[rule.compare]) == match ) {
                        dict[digit] = rule.digit;
                        dictBin[rule.digit] = digitBin;
                    } else if( rule.else ) {
                        dict[digit] = rule.else;
                        dictBin[rule.else] = digitBin;
                    }
                }
            });
        } );

        return count + Number( output.map( digit => dict[digit] ).join('') );

    }, 0 );

}

module.exports = { part1, part2 }