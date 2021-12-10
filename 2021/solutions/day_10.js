const braces = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
}

function part1(data) {

    const lines = data.split(/\r?\n/);
   
    const points = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137,
    }

    return lines.reduce( (score, line) => {

        const stack = [];

        for( let i = 0; i < line.length; i++ ) {
            const ch = line[i];
            if( braces[ch] ) {
                stack.push( braces[ch] );
                continue;
            }
            const expected = stack.pop();
            if( ch != expected ) {
                return score + points[ch];
            }
        }

        return score;

    }, 0);

}

function part2(data) {

    const lines = data.split(/\r?\n/);

    const points = {
        ")": 1,
        "]": 2,
        "}": 3,
        ">": 4,
    }

    const scores = lines.map( (line) => {

        const stack = [];

        for( let i = 0; i < line.length; i++ ) {
            const ch = line[i];
            if( braces[ch] ) {
                stack.push( braces[ch] );
                continue;
            }
            const expected = stack.pop();
            if( ch != expected ) {
                return 0;
            }
        }

        return stack.reverse().reduce( (score, ch) => score * 5 + points[ch], 0 );

    }).filter( score => score > 0 ).sort( (a, b) => a - b );

    return scores[ Math.floor(scores.length / 2) ];

}

module.exports = { part1, part2 }