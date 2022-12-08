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

function multGrids(a, b) {
    return a.map( (row, i) => row.map( (value, j) => value * b[i][j] ) )
}

function createZeroGrid(width, height) {
    return Array(height).fill().map( () => Array(width).fill(0) )
}

function part2(data) {

    const grid = data.split(/\r?\n/).map( row => row.split('').map(Number) )
    const width = grid[0].length
    const height = grid.length

    let stepGrid = createZeroGrid(width, height)
    for( let row = 0; row < grid.length; row++ ) {
        let work = []
        for( let i = 0; i < grid[row].length; i++ ) {
            const height = grid[row][i]
            work.forEach( w => {
                stepGrid[row][w.i]++
            })
            work = work.filter( ({max}) => max > height )
            work.push({i,max: height})
        }
    }
    let scoreGrid = stepGrid

    stepGrid = createZeroGrid(width, height)
    for( let row = 0; row < grid.length; row++ ) {
        let work = []
        
        for( let i = grid[row].length-1; i >= 0 ; i-- ) {
            const height = grid[row][i]
            work.forEach( w => {
                stepGrid[row][w.i]++
            })
            work = work.filter( ({max}) => max > height )
            work.push({i,max: height})
        }
    }
    scoreGrid = multGrids(scoreGrid, stepGrid)

    stepGrid = createZeroGrid(width, height)
    for( let col = 0; col < grid[0].length; col++ ) {
        let work = []
        for( let i = 0; i < grid.length; i++ ) {
            const height = grid[i][col]
            work.forEach( w => {
                stepGrid[w.i][col]++
            })
            work = work.filter( ({max}) => max > height )
            work.push({i,max: height})
        }
    }
    scoreGrid = multGrids(scoreGrid, stepGrid)

    stepGrid = createZeroGrid(width, height)
    for( let col = 0; col < grid[0].length; col++ ) {
        let work = []
        for( let i = grid.length-1; i >= 0 ; i-- ) {
            const height = grid[i][col]
            work.forEach( w => {
                stepGrid[w.i][col]++
            })
            work = work.filter( ({max}) => max > height )
            work.push({i,max: height})
        }
    }
    scoreGrid = multGrids(scoreGrid, stepGrid)

    return scoreGrid.flat().reduce( (max,v) => max > v ? max : v, 0 )

}

module.exports = { part1, part2 }