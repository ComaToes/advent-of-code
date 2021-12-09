const deltas = [[-1,0],[1,0],[0,-1],[0,1]];

function findLows(grid) {

    const lows = [];

    for( let y = 0; y < grid.length; y++ ) {

        for( let x = 0; x < grid[y].length; x++ ) {

            const isLow = deltas.reduce( (isLow, [dy, dx]) => {

                if( !isLow )
                    return isLow;

                const gx = x + dx, gy = y + dy;

                if( gx >= 0 && gx < grid[y].length && gy >= 0 && gy < grid.length )
                    return grid[gy][gx] > grid[y][x];

                return isLow;

            }, true );

            if( isLow )
                lows.push([y, x]);

        }
    }

    return lows;

}

function findBasins(grid) {

    const lows = findLows(grid);

    return lows.map( (start) => {

        const basin = {};
        const toExplore = [start];
        const explored = {};

        while( toExplore.length > 0 ) {

            const [y, x] = toExplore.shift();

            if( y < 0 || y >= grid.length || x < 0 || x >= grid[y].length )
                continue;

            const i = y * grid[y].length + x;

            if( explored[i] )
                continue;

            if( grid[y][x] < 9 ) {

                if( !basin[i] )
                    basin[i] = true;
                
                deltas.forEach( ([dy, dx]) => {
                    toExplore.push([y + dy, x + dx]);
                } );

            }

            explored[i] = true;

        }

        return Object.keys(basin);

    } );

}

function part1(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("").map(Number) );

    const lows = findLows(grid);

    return lows.reduce( (count, [y, x]) => count + grid[y][x] + 1, 0 );

}

function part2(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("").map(Number) );

    const basins = findBasins(grid);

    const topThree = basins.map( basin => basin.length ).sort( (a, b) => b - a ).slice(0, 3);

    return topThree.reduce( (count, size) => count * size, 1 );

}

module.exports = { part1, part2 }