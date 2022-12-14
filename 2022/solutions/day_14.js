function parseData(data) {

    const lines = data.split(/\r?\n/).map( line => line.split(/\s->\s/).map( coords => coords.split(",").map(Number) ) )

    const {minX,maxX,minY,maxY} = lines.flat().reduce( (extents, [x,y]) => {
        if( x < extents.minX )
            extents.minX = x
        if( x > extents.maxX )
            extents.maxX = x
        if( y < extents.minY )
            extents.minY = y
        if( y > extents.maxY )
            extents.maxY = y
        return extents
    }, {minX: Infinity, maxX: 0, minY: Infinity, maxY: 0} )

    const width = maxX - minX + 4
    const height = maxY + 2
    const xOffset = -minX + 1

    const grid = Array(height).fill().map( () => Array(width).fill(0) )

    // draw lines
    lines.forEach( points => {
        let [x,y] = points.shift()
        while( points.length > 0 ) {
            let [nx,ny] = points.shift()
            grid[y][x+xOffset] = 1
            while( x != nx ) {
                x += Math.sign(nx - x)
                grid[y][x+xOffset] = 1
            }
            while( y != ny ) {
                y += Math.sign(ny - y)
                grid[y][x+xOffset] = 1
            }
            x = nx
            y = ny
        }
    })

    return {grid, width, height, xOffset}

}

function printGrid(grid) {
    console.log(grid.map( row => row.map( v => v == 1 ? "#" : v == 2 ? "o" : "." ).join("") ).join("\n"))
    console.log()
}

function dropSand({grid, width, height, xOffset}, stopOnOverflow = false) {

    let count = 0
    let leftHeight = 0, rightHeight = 0

    let filling = true
    while( filling ) {

        let x = 500+xOffset, y = 0
        let falling = true

        while( falling ) {

            // drop down
            while( y < grid.length - 1 && grid[y+1][x] == 0 )
                y++

            // overflow bottom
            if( y >= grid.length - 1 ) {
                if( stopOnOverflow )
                    filling = false
                else {
                    grid[y][x] = 2
                    count++
                }
                break
            }

            // slide
            if( grid[y+1][x-1] == 0 ) {
                y++
                x--
            } else if( grid[y+1][x+1] == 0  ) {
                y++
                x++
            } else {
                // stop falling
                grid[y][x] = 2
                count++
                falling = false

                // overflow left/right
                if( x == 0 ) {
                    leftHeight = height - y - 1
                } else if( x == width-1 )
                    rightHeight = height - y - 1

                // end simulation if stopping at spawn
                if(y == 0)
                    filling = false
            }

        }

    }

    const arithSum = (x) => x / 2 * (x + 1)

    const leftCount = arithSum(leftHeight)
    const rightCount = arithSum(rightHeight)

    return count + leftCount + rightCount

}

export function part1(data) {

    return dropSand( parseData(data), true )

}

export function part2(data) {

    return dropSand( parseData(data) )

}