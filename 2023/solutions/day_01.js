export function part1(data) {

    const values = data.split(/\r?\n/).map( line => {
        let firstNum = 0
        while( line.charCodeAt(firstNum) > 0x39 ) { firstNum++ }
        let lastNum = line.length - 1
        while( line.charCodeAt(lastNum) > 0x39 ) { lastNum-- }
        return +line[firstNum] * 10 + +line[lastNum]
    })

    return values.reduce( (a,b) => a+b, 0 )

}

export function part2(data) {

    const digitWords = [, "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

    const getDigit = (line, i) => {

        // Numeric digits
        if( line.charCodeAt(i) < 0x40 )
            return +line[i]

        // Word digits
        outer: for(let j = 1; j < digitWords.length; j++) {
            const word = digitWords[j]
            for(let k = 0; k < word.length; k++)
                if( line[i+k] != word[k] )
                    continue outer
            return j
        }

    }

    const values = data.split(/\r?\n/).map( line => {

        let firstDigit, lastDigit
        for(let i = 0; i < line.length; i++) {
            const digit = getDigit(line, i)
            if( !digit )
                continue
            if( !firstDigit )
                firstDigit = digit
            lastDigit = digit
        }

        return firstDigit * 10 + lastDigit

    })

    return values.reduce( (a,b) => a+b, 0 )

}
