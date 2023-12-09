const generateLines = (line) => {
    
    const lines = [line]

    let sum
    do {
        sum = 0
        const newLine = Array(line.length-1).fill(0).map( (x,i) => {
            const v = line[i+1] - line[i]
            sum += v
            return v
         } )
         lines.unshift( newLine )
         line = newLine
    } while( sum != 0 )

    return lines

}

export function part1(data) {

    const values = data.split(/\r?\n/).map( line => line.split(" ").map(Number) )

    const extrapolated = values.map(generateLines).map( pyramid => 
        pyramid.reduce( (total, line) => total + line[line.length-1], 0 )
    )

    return extrapolated.reduce( (total, line) => total + line, 0 )

}

export function part2(data) {

    const values = data.split(/\r?\n/).map( line => line.split(" ").map(Number) )

    const extrapolated = values.map(generateLines).map( pyramid => 
        pyramid.reduce( (total, line) => line[0] - total, 0 )
    )

    return extrapolated.reduce( (total, line) => total + line, 0 )

}
