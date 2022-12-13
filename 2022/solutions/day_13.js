function zip(a,b) {
    return Array(Math.max(a.length, b.length)).fill().map( (_,i) => [a[i],b[i]] )
}

function compare(a, b) {

    const stack = [[a, b]]

    while( stack.length > 0 ) {

        const [left, right] = stack.shift()

        const leftIsArr = Array.isArray(left)
        const rightIsArr = Array.isArray(right)

        // Zip array pairs onto the stack
        if( leftIsArr && rightIsArr )
            stack.unshift( ...zip(left, right) )

        // Left has run out of items
        else if( left == undefined )
            return -1
        // Right has run out of items
        else if( right == undefined )
            return 1

        // Comparing array vs int, wrap the int
        else if( rightIsArr )
            stack.unshift( [[left], right] )
        else if( leftIsArr )
            stack.unshift( [left, [right]] )

        // Comparing ints
        else if( left < right )
            return -1
        else if( right < left )
            return 1
        
    }

    return 0

}

function part1(data) {

    const pairs = data.split(/\r?\n\r?\n/).map( str => str.split(/\r?\n/).map(JSON.parse) )

    const correctIndices = []

    pairs.forEach( ([a, b], i) => {

        if( compare(a, b) < 0 )
            correctIndices.push(i+1)

    })

    return correctIndices.reduce( (sum, a) => sum + a, 0 )

}

function part2(data) {

    const pairs = data.split(/\r?\n\r?\n/).map( str => str.split(/\r?\n/).map(JSON.parse) ).flat()

    const dividerA = [[2]]
    const dividerB = [[6]]

    pairs.push(dividerA, dividerB)

    pairs.sort(compare)

    return (pairs.indexOf(dividerA) + 1) * (pairs.indexOf(dividerB) + 1)

}

module.exports = { part1, part2 }