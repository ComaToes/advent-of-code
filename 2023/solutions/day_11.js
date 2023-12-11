const doTheThing = (data, expansion) => {
    
    const galaxies = []
    const grid = data.split(/\r?\n/).map( (line,y) =>
        line.split("").map( (ch,x) => {
            if( ch == "#") {
                galaxies.push( {y,x,ox:x,oy:y} )
                return 1
            }
            return 0
        })
    )

    grid.forEach( (row,y) => {
        if( row.reduce( (a,x) => a + x, 0 ) < 1 )
            galaxies.forEach( g => {
                if( g.oy > y )
                    g.y += expansion
            } )
    } )

    for(let x = 0; x < grid[0].length; x++ ) {
        if( grid.reduce( (a,row) => a + row[x], 0 ) < 1 )
            galaxies.forEach( g => {
                if( g.ox > x )
                    g.x += expansion
            } )
    }

    let count = 0
    for(let i = 0; i < galaxies.length; i++)
        for(let j = i+1; j < galaxies.length; j++) {
            const g1 = galaxies[i]
            const g2 = galaxies[j]
            count += Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y)
        }
    
    return count

}

export function part1(data) {

    return doTheThing(data, 1)

}

export function part2(data) {

    return doTheThing(data, 999999)

}
