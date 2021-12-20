function parseData(data) {

    let [translator, input] = data.split(/\r?\n\r?\n/);

    translator = translator.split("").map( c => c == "#" ? 1 : 0 );

    input = input.split(/\r?\n/).map( line => line.split("").map( c => c == "#" ? 1 : 0 ) );

    return {translator, input};

}

function padGrid(grid, value, amount) {

    const rowPad = Array(amount).fill(value);
    grid = grid.map( row => [...rowPad,...row,...rowPad] );
    for( let i = 0; i < amount; i++ ) {
        grid.unshift( Array(grid[0].length).fill(value) );
        grid.push( Array(grid[0].length).fill(value) );
    }
    return grid;

}

function pixelValue(grid, y, x) {
    let value = "";
    for( let gy = y - 1; gy <= y + 1; gy++ )
        value += grid[gy].slice( x - 1, x + 2 ).join("");
    return parseInt( value, 2 );
}

function gridString(grid) {
    return grid.map( row => row.map(v => v ? "#" : ".").join(" ") ).join("\n");
}

function translateGrid(grid, translator, voidValue) {

    return grid.map( (row, y) => {
        if( y < 1 || y > grid.length - 2 )
            return row.map( () => translator[voidValue] );
        return row.map( (_, x) => {
            if( x < 1 || x > grid[y].length - 2 )
                return translator[voidValue];
            const v = pixelValue(grid, y, x);
            return translator[v];
        } );
    });

}

function processImage(input, translator, steps) {

    let voidValue = 0;
    let grid = padGrid(input, voidValue, 1);

    for( let i = 0; i < steps; i++ ) {
        grid = padGrid(grid, voidValue, 1);
        grid = translateGrid(grid, translator, voidValue);
        voidValue = translator[voidValue];
    }

    return grid;

}

function part1(data) {

    const {translator, input} = parseData(data);

    const grid = processImage(input, translator, 2)

    let count = grid.reduce( (count, row) => count + row.reduce( (count, v) => count + v, 0 ), 0 );
    
    return count;

}

function part2(data) {

    const {translator, input} = parseData(data);

    const grid = processImage(input, translator, 50)

    let count = grid.reduce( (count, row) => count + row.reduce( (count, v) => count + v, 0 ), 0 );
    
    return count;

}

module.exports = { part1, part2 }