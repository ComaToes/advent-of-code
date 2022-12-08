function part1(data) {

    const grid = data.split(/\r?\n/).map( row => row.split('').map(Number) )
    const visibilityGrid = Array(grid.length).fill().map( () => Array(grid[0].length) )

    for( let row = 0; row < grid.length; row++ ) {
        let highest = -1
        for( let i = 0; i < grid[row].length; i++ ) {
            if( grid[row][i] > highest ) {
                visibilityGrid[row][i] = true
                highest = grid[row][i]
            }
        }
        highest = -1
        for( let i = grid[row].length-1; i >= 0 ; i-- ) {
            if( grid[row][i] > highest ) {
                visibilityGrid[row][i] = true
                highest = grid[row][i]
            }
        }
    }

    for( let col = 0; col < grid.length; col++ ) {
        let highest = -1
        for( let i = 0; i < grid[col].length; i++ ) {
            if( grid[i][col] > highest ) {
                visibilityGrid[i][col] = true
                highest = grid[i][col]
            }
        }
        highest = -1
        for( let i = grid.length-1; i >= 0 ; i-- ) {
            if( grid[i][col] > highest ) {
                visibilityGrid[i][col] = true
                highest = grid[i][col]
            }
        }
    }

    return visibilityGrid.flat().length

}

function getViewsAlong(arr) {
    let work = []
    let res = Array(arr.length).fill(0)
    arr.forEach( (height, j) => {
        work = work.filter( w => {
            if( w.height <= height ) {
                res[w.j] = j - w.j
                return false
            }
            return true
        })
        work.push({j,height})
    })
    work.forEach( w => res[w.j] = arr.length - w.j - 1 )
    return res
}

function part2(data) {

    const gridRows = data.split(/\r?\n/).map( row => row.split('').map(Number) )
    const width = gridRows[0].length
    const height = gridRows.length

    const gridCols = Array(width).fill().map( () => Array(height).fill() )
                     .map( (col, i) => col.map( (x,j) => gridRows[j][i] ) )

    const horizontalViews = gridRows.map( (row, i) => {

        const viewsToRight = getViewsAlong(row)
        const viewsToLeft = getViewsAlong(row.reverse()).reverse()
        return viewsToRight.map( (score,i) => score * viewsToLeft[i] )

    })

    const verticalViews = gridCols.map( (col, i) => {

        const viewsDown = getViewsAlong(col)
        const viewsUp = getViewsAlong(col.reverse()).reverse()
        return viewsDown.map( (score,i) => score * viewsUp[i] )

    })

    const combinedViews = horizontalViews.map( (row,i) => 
        row.map( (value,j) => value * verticalViews[j][i] ) 
    )

    return combinedViews.flat().reduce( (max,v) => max > v ? max : v, 0 )

}

module.exports = { part1, part2 }