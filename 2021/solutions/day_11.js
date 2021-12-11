function powerTheOctopodes(grid, flashValue) {

    const flashers = [];
    let flashCount = 0;

    for( let y = 0; y < grid.length; y++ ) {
        for( let x = 0; x < grid[y].length; x++ ) {
            if( grid[y][x] == flashValue )
                flashers.push([y, x]);
        }
    }

    while( flashers.length > 0 ) {

        const [y, x] = flashers.shift();
        flashCount++;

        for( let dy = -1; dy < 2 ; dy++ ) {

            const cy = y + dy;
            if( !grid[cy] )
                continue;
            
            for( let dx = -1; dx < 2 ; dx++ ) {

                const cx = x + dx;
                if( grid[cy][cx] == undefined || (cx == x && cy == y) )
                    continue;

                if( grid[cy][cx] != flashValue ) {

                    grid[cy][cx] += 9;
                    grid[cy][cx] %= 10;
                    if( grid[cy][cx] == flashValue )
                        flashers.push([cy, cx]);

                }

            }

        }

    }

    return flashCount;

}

function part1(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("").map(Number).map( x => 9 - x ) );

    let flashCount = 0;

    for( let tick = 0; tick < 100; tick++ ) {

        flashCount += powerTheOctopodes(grid, tick % 10);

    }

    return flashCount;

}

function part2(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("").map(Number).map( x => 9 - x ) );

    const gridSize = grid.length * grid[0].length;

    for( let tick = 0; tick < 1000; tick++ ) {

        const flashCount = powerTheOctopodes(grid, tick % 10);

        if( flashCount == gridSize )
            return tick + 1;

    }

}

module.exports = { part1, part2 }