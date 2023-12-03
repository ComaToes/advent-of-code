const parseData = (data) => {
    const grid = data.split(/\r?\n/).map( line => line.split("") )

    // Find numbers
    const numbers = grid.reduce( (nums,row,y) => {
        let num = ""
        let start = 0
        row.forEach( (cell, x) => {
            if( !num )
                start = x
            if( +cell || cell === "0" )
                num += cell
            else if( num ) {
                nums.push({
                    value: +num,
                    y,
                    x1: start,
                    x2: x-1
                })
                num = ""
            }
        })
        if( num )
            nums.push({
                value: +num,
                y,
                x1: start,
                x2: row.length-1
            })
        return nums
    }, [] )

    // Find symbols
    const symbols = grid.reduce( (syms,row,y) => {
        row.forEach( (cell, x) => {
            if( !(+cell) && cell != "." && cell !== "0" )
                syms.push({
                    symbol: cell,
                    x,
                    y,
                    numbers: []
                })
        })
        return syms
    }, [] )

    // Attach numbers to symbols
    numbers.forEach( number => {
        symbols.forEach( symbol => {
            const dy = number.y - symbol.y
            if( dy < -1 || dy > 1 )
                return
            if( symbol.x < number.x1 - 1 || symbol.x > number.x2 + 1 )
                return
            symbol.numbers.push( number )
        })
    })

    return {symbols, numbers}    
}

export function part1(data) {

    const {symbols} = parseData(data)

    return symbols.map( s => s.numbers ).flat().reduce( (sum,n) => sum + n.value, 0 )

}

export function part2(data) {

    const {symbols} = parseData(data)

    return symbols.filter( s => s.symbol == "*" && s.numbers.length == 2 )
            .map( ({numbers}) => numbers[0].value * numbers[1].value )
            .reduce( (sum,n) => sum + n, 0 )

}
