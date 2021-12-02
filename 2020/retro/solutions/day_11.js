const EMPTY = 'L';
const OCCUPIED = '#';
const FLOOR = '.';

function parseGrid(data) {

    const lines = data.split(/\r?\n/);
    return lines.map( line => line.split('') );

}

function printGrid(grid) {

    return grid.reduce( (str,row) => str + row.reduce( (str,seat) => str + (seat == OCCUPIED ? '#' : (seat == EMPTY ? 'L' : ".")) , "" ) + "\n", "" );

}

function countAdjacentOccupied(grid, row, col) {
    let count = 0;
    for( let y = row-1; y <= row+1; y++ ) {
        for( let x = col-1; x <= col+1; x++ ) {
            if( y >= 0 && y < grid.length && 
                x >= 0 && x < grid[y].length && 
                (y != row || x != col) &&
                grid[y][x] == OCCUPIED ) {

                count++;
                    
            }
        }
    }
    return count;
}

function countVisiblyOccupied(grid, row, col) {

    let count = 0;
    for( let dy = -1; dy < 2; dy++ ) {
        for( let dx = -1; dx < 2; dx++ ) {
            if( dx == 0 && dy == 0 )
                continue;
            let y = row + dy;
            let x = col + dx;
            while( y >= 0 && y < grid.length && x >= 0 && x < grid[0].length ) {
                if( grid[y][x] == OCCUPIED ) {
                    count++;
                    break;
                } else if( grid[y][x] == EMPTY )
                    break;
                x += dx;
                y += dy;
            }
        }
    }
    return count;
}

function solveSeating(data, countOccupied, occupiedThreshold) {

    let grid = parseGrid(data);

    let changed = true;
    while( changed ) {

        changed = false;

        let nextGrid = grid.map( row => [...row] );

        for( let row = 0; row < grid.length; row++ ) {
            for( let col = 0; col < grid[row].length; col++ ) {

                const count = countOccupied(grid, row, col);

                switch( grid[row][col] ) {
                    case EMPTY:
                        if( count == 0 ) {
                            nextGrid[row][col] = OCCUPIED;
                            changed = true;
                        }
                        break;
                    case OCCUPIED:
                        if( count >= occupiedThreshold ) {
                            nextGrid[row][col] = EMPTY;
                            changed = true;
                        }
                        break;
                    default:
                        break;
                }

            }
        }

        grid = nextGrid;

    }

    const count = grid.reduce( (count,row) => row.reduce( (count,seat) => count + (seat == OCCUPIED ? 1 : 0) , count ), 0 );
    return count;

}



function part1(data) {
    return solveSeating(data, countAdjacentOccupied, 4);
}

function part2(data) {
    return solveSeating(data, countVisiblyOccupied, 5);
}

module.exports = { part1, part2 }