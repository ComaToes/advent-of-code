function parseData(data) {

    return data.split(/\r?\n/).map( line => {
        const [,x1,y1,x2,y2] = line.match(/(\d+),(\d+) -> (\d+),(\d+)/);
        return {x1: +x1, y1: +y1, x2: +x2, y2: +y2};
    });

}

function part1(data) {

    const lines = parseData(data);

    const straightLines = lines.filter( ({x1,y1,x2,y2}) => x1 == x2 || y1 == y2 );

    const maxX = straightLines.reduce( (maxX,{x1,x2}) => Math.max(maxX, x1, x2), 0 );
    const maxY = straightLines.reduce( (maxY,{y1,y2}) => Math.max(maxY, y1, y2), 0 );

    const grid = [];
    for( let i = 0; i <= maxY; i++ )
        grid.push( Array(maxX+1).fill(0) );

    straightLines.forEach( ({x1,y1,x2,y2}) => {
        for( let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++ )
            for( let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++ ) {
                grid[y][x]++;
            }
    });

    const count = grid.reduce( (count, row) => count + row.reduce( (count, value) => count + (value > 1 ? 1 : 0), 0), 0);

    return count;

}

function part2(data) {

    const lines = parseData(data);

    const maxX = lines.reduce( (maxX,{x1,x2}) => Math.max(maxX, x1, x2), 0 );
    const maxY = lines.reduce( (maxY,{y1,y2}) => Math.max(maxY, y1, y2), 0 );

    const grid = [];
    for( let i = 0; i <= maxY; i++ )
        grid.push( Array(maxX+1).fill(0) );

    lines.forEach( ({x1,y1,x2,y2}) => {
        let dx = x2 - x1;
        dx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        let dy = y2 - y1;
        dy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        let x = x1, y = y1;
        do {
            grid[y][x]++;
            x += dx;
            y += dy;
        } while( x != x2 || y != y2 )
        grid[y][x]++;
    });

    const count = grid.reduce( (count, row) => count + row.reduce( (count, value) => count + (value > 1 ? 1 : 0), 0), 0);

    return count;

}

module.exports = { part1, part2 }