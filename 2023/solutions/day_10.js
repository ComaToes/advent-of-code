
const pipes = {
    "|": [ [-1,0], [1,0] ],
    "-": [ [0,-1], [0,1] ],
    "L": [ [-1,0], [0,1] ],
    "J": [ [-1,0], [0,-1] ],
    "7": [ [0,-1], [1,0] ],
    "F": [ [0,1], [1,0] ],
    ".": [],
    "S": [-1,0,1].map( y => (y == 0 ? [-1,1] : [-1,0,1]).map( x => [y,x] ) ).flat(1)
}

const getNext = (grid, cell, range) => {

    const [y,x] = cell

    grid[y][x].visited = true

    return range.map( ([dy,dx]) => {
        const ny = y+dy
        const nx = x+dx
        if( ny < 0 || ny >= grid.length || nx < 0 || nx >= grid[0].length )
            return false
        const ncell = grid[ny][nx]
        if( ncell.visited )
            return false
        const cellpipes = pipes[ncell.type]
        for(let i = 0; i < cellpipes.length; i++) {
            const [doy,dox] = cellpipes[i]
            if( doy+ny == y && dox+nx == x )
                return [ny,nx]
        }
    } ).filter( x => x )

}

export function part1(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("").map( type => ({type}) ) )

    let start;
    outer: for(let y = 0; y < grid.length; y++)
        for(let x = 0; x < grid[0].length; x++)
            if( grid[y][x].type == "S" ) {
                start = [y,x]
                break outer
            }

    let next = getNext(grid, start, pipes["S"])

    let count = 0

    while( next.length > 0 ) {
        const cell = next.shift()
        const [y,x] = cell
        next.push( ...getNext(grid, cell, pipes[ grid[y][x].type ]) )
        count++
    }

    return count / 2

}

export function part2(data) {

    // Pad one cell empty border, because it's easier than fixing the alg
    const padcell = {type:"."}
    const innerGrid = data.split(/\r?\n/).map( line => [{...padcell},...line.split("").map( type => ({type}) ),{...padcell}] )
    const toprow = Array(innerGrid[0].length).fill(0).map( x => ({...padcell}))
    const botrow = Array(innerGrid[0].length).fill(0).map( x => ({...padcell}))
    const grid = [toprow,...innerGrid,botrow]

    // Find start
    let start;
    outer: for(let y = 0; y < grid.length; y++)
        for(let x = 0; x < grid[0].length; x++)
            if( grid[y][x].type == "S" ) {
                start = [y,x]
                break outer
            }

    // Create connectivity tables for grid edges
    let edgeHGrid = Array(grid.length).fill().map( () => Array(grid[0].length).fill(1) )
    let edgeVGrid = Array(grid.length).fill().map( () => Array(grid[0].length).fill(1) )

    edgeHGrid = edgeHGrid.map( (row,y) => row.map( (_,x) => {
        if( y >= edgeHGrid.length-1 )
            return 1
        const p1 = pipes[ grid[y][x].type ]
        const p2 = pipes[ grid[y+1][x].type ]
        let connectable = true
        p1.forEach( ([y1,x1]) => {
            p2.forEach( ([y2,x2]) => {
                if( x1 == 0 && x2 == 0 && y1 == 1 && y2 == -1 )
                    connectable = false
            } )
        } )
        return connectable ? 1 : 0
    } ) )

    edgeVGrid = edgeVGrid.map( (row,y) => row.map( (_,x) => {
        if( x >= row.length-1 )
            return 1
        const p1 = pipes[ grid[y][x].type ]
        const p2 = pipes[ grid[y][x+1].type ]
        let connectable = true
        p1.forEach( ([y1,x1]) => {
            p2.forEach( ([y2,x2]) => {
                if( x1 == 1 && x2 == -1 && y1 == 0 && y2 == 0 )
                    connectable = false
            } )
        } )
        return connectable ? 1 : 0
    } ) )

    // Find 'outside' cells by flood filling vertices, traversing connectable edges

    const vertexVisited = Array(grid.length).fill().map( _ => Array(grid[0].length).fill(0) )

    const search = [[1,1]]
    while( search.length > 0 ) {
        const [y,x] = search.shift()

        if( vertexVisited[y][x] )
            continue

        vertexVisited[y][x] = true

        ;[-1,0].forEach( (dy) => {
            [-1,0].forEach( dx => {
                const nx = x+dx
                const ny = y+dy
                grid[ny][nx].connectable = true
            } )
        })

        if( x > 1 && edgeHGrid[y-1][x-1] )
            search.push( [y,x-1] )
        if( x < grid[0].length-1 && edgeHGrid[y-1][x] )
            search.push( [y,x+1] )
        if( y > 1 && edgeVGrid[y-1][x-1] )
            search.push( [y-1,x] )
        if( y < grid.length-1 && edgeVGrid[y][x-1] )
            search.push( [y+1,x] )

    }

    return grid.reduce( (a,row) => a + row.reduce( (b,c) => b + (c.connectable ? 0 : 1), 0 ), 0 )

}
