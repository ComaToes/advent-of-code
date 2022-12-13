function zip(a,b) {
    return Array(Math.max(a.length, b.length)).fill().map( (_,i) => [a[i],b[i]] )
}

function compare(a, b) {

    const stack = [[a,b]]

    while( stack.length > 0 ) {

        const [left, right] = stack.shift()

        const leftIsArr = Array.isArray(left)
        const rightIsArr = Array.isArray(right)

        if( leftIsArr && rightIsArr )
            stack.unshift( ...zip(left, right) )
        else if( rightIsArr && left != undefined )
            stack.unshift( [[left], right] )
        else if( leftIsArr && right != undefined )
            stack.unshift( [left, [right]] )
        else {
            if( left == undefined || left < right )
                return -1
            if( right == undefined || right < left )
                return 1
        }
        
    }

    return 0

}

function part1(data) {

    const pairs = data.split(/\r?\n\r?\n/).map( str => str.split(/\r?\n/).map(eval) )

    const correctIndices = []

    pairs.forEach( ([a,b],i) => {

        if( compare(a, b) < 0 )
            correctIndices.push(i+1)

    })

    return correctIndices.reduce( (sum,a) => sum + a, 0 )

}

function part2(data) {

    const pairs = data.split(/\r?\n\r?\n/).map( str => str.split(/\r?\n/).map(eval) ).flat()

    const dividerA = [[2]]
    const dividerB = [[6]]

    pairs.push( dividerA, dividerB )

    pairs.sort( compare )

    return (pairs.indexOf( dividerA ) + 1) * (pairs.indexOf( dividerB ) + 1)

}

module.exports = { part1, part2 }