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
    const itemsBin = items.map( arr => arr.map( digits => digits.map( digit =>
        alphabet.reduce( (value, char, i) => value + (digit.indexOf(char) >= 0 ? 1 << i : 0), 0 )
    ) ) );

    return items.reduce( (count, [input, output]) => {

        const dict = {};
        const dictBin = {};

        const all = input.concat(output).map( digit => 
            [ digit, 
                alphabet.reduce( (value, char, i) => value + (digit.indexOf(char) >= 0 ? 1 << i : 0), 0 ) 
            ]
        );

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

        // Find 3 by length and matching 1
        all.forEach( ([digit, digitBin]) => {
            if( dict[digit] )
                return;
            if( digit.length == 5 && (digitBin & dictBin[1]) == dictBin[1] ) {
                dict[digit] = 3;
                dict[3] = digit;
                dictBin[digitBin] = 3;
                dictBin[3] = digitBin;
            }
        });

        // Find 9
        all.forEach( ([digit, digitBin]) => {
            if( dict[digit] )
                return;
            if( digit.length == 6 && (digitBin & dictBin[3]) == dictBin[3] ) {
                dict[digit] = 9;
                dict[9] = digit;
                dictBin[digitBin] = 9;
                dictBin[9] = digitBin;
            }
        });

        // Use 9 to determine 5 or 2
        all.forEach( ([digit, digitBin]) => {
            if( dict[digit] )
                return;
            if( digit.length == 5 ) {
                if( (digitBin & dictBin[9]) == digitBin )
                    value = 5
                else
                    value = 2;
                dict[digit] = value;
                dict[value] = digit;
                dictBin[digitBin] = value;
                dictBin[value] = digitBin;
            }            
        });

        // 0 and 6
        all.forEach( ([digit, digitBin]) => {
            if( dict[digit] )
                return;
            if( (digitBin & dictBin[1]) == dictBin[1] )
                value = 0
            else
                value = 6;
            dict[digit] = value;
            dict[value] = digit;
            dictBin[digitBin] = value;
            dictBin[value] = digitBin;
        });

        return count + Number( output.map( digit => dict[digit] ).join('') );

    }, 0 );

}

module.exports = { part1, part2 }