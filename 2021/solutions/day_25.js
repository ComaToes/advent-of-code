function moveEastumbers(grid) {

    let count = 0;

    const newGrid = grid.map( (row, y) => {
        return row.map( (v, x) => {
            if( v == ">" ) {
                const nx = (x+1) % row.length;
                if( grid[y][nx] == "." ) {
                    count++;
                    return ".";
                }
            } else if( v == "." ) {
                const nx = (x+row.length-1) % row.length;
                if( grid[y][nx] == ">" ) {
                    return ">";
                }
            }
            return v;
        });
    });
    grid.splice(0, grid.length);
    grid.push( ...newGrid );
/*
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if( grid[y][x] == ">" ) {
                const nx = (x+1) % grid[y].length;
                if( grid[y][nx] == "." ) {
                    grid[y][nx] = ">";
                    grid[y][x] = ".";
                    count++;
                }
            }
        }
    }*/
    return count;

}

function moveSouthumbers(grid) {

    let count = 0;

    const newGrid = grid.map( (row, y) => {
        return row.map( (v, x) => {
            if( v == "v" ) {
                const ny = (y+1) % grid.length;
                if( grid[ny][x] == "." ) {
                    count++;
                    return ".";
                }
            } else if( v == "." ) {
                const ny = (y+grid.length-1) % grid.length;
                if( grid[ny][x] == "v" ) {
                    return "v";
                }
            }
            return v;
        });
    });
    grid.splice(0, grid.length);
    grid.push( ...newGrid );
    return count;
/*
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if( grid[y][x] == "v" ) {
                const ny = (y+1) % grid.length;
                if( grid[ny][x] == "." ) {
                    grid[ny][x] = "v";
                    grid[y][x] = ".";
                    count++;
                }
            }
        }
    }
    return count;*/

}

function part1(data) {

    const grid = data.split(/\r?\n/).map( line => line.split("") );

    let steps = 1;
    while( (moveEastumbers(grid) + moveSouthumbers(grid)) > 0 ) {
        steps++;
    }
    /*let res = {grid};
    do {
        res = moveEastumbers(res.grid);
        res = moveSouthumbers(res.grid);
        steps++;
    } while( res.count > 0 )*/

    console.log( grid.map( row => row.join("") ).join("\n") );

    return steps;

}

function part2(data) {



}

module.exports = { part1, part2 }