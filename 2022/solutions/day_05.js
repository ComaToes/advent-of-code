function parseData(data) {

    const [rawState, rawMoves] = data.split(/\r?\n\r?\n/)

    const stateLines = rawState.split(/\r?\n/)
    const stackCount = (stateLines.pop().length + 1) / 4

    const stacks = Array(stackCount).fill().map( () => [] )

    stateLines.forEach( line => {
        for (let i = 0; i < stackCount; i++) {
            const ch = line[i*4+1]
            if( ch != " " )
                stacks[i].unshift(ch)
        }
    })
    
    const moves = rawMoves.split(/\r?\n/).map( move => {
        const match = move.match(/move (\d+) from (\d+) to (\d+)/)
        const [count,from,to] = match.slice(1,4).map(Number)
        return {count,from,to}
    })

    return {stacks, moves}
}

function part1(data) {

    const {stacks, moves} = parseData(data)

    moves.forEach( ({count, from, to}) => {
        const elems = stacks[from-1].splice( -count, count ).reverse()
        stacks[to-1].push(...elems)
    })

    return stacks.map( s => s.pop() ).join('')

}

function part2(data) {

    const {stacks, moves} = parseData(data)

    moves.forEach( ({count, from, to}) => {
        const elems = stacks[from-1].splice( -count, count )
        stacks[to-1].push(...elems)
    })

    return stacks.map( s => s.pop() ).join('')

}

module.exports = { part1, part2 }