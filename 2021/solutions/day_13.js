function parseData(data) {

    const [coordLines, foldLines] = data.split(/\r?\n\r?\n/);
    const coords = coordLines.split(/\r?\n/).map( line => line.split(",").map(Number) );
    const folds = foldLines.split(/\r?\n/).map( line => {
        const [, axis, position] = line.match(/fold along ([xy])=(\d+)/);
        return {axis, position: Number(position)};
    } );
    return [coords, folds];

}

// Considering each row as a binary value is fast for y folds, but bit reversal for x folds is messy
function foldThePaper(coords, folds) {

    let [maxX, maxY] = coords.reduce( ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)], [0, 0] );

    let rows = Array(maxY + 1).fill(0n);

    coords.forEach( ([x, y]) => {
        rows[y] |= 1n << BigInt(maxX - x);
    } );

    folds.forEach( ({axis, position}) => {

        if( axis == "y" ) {

            const topRows = rows.slice(0, position);
            const bottomRows = rows.slice(position+1);
            const reversedBottom = bottomRows.reverse();
            const ofs = topRows.length - reversedBottom.length;
            for( let y = 0; y < reversedBottom.length; y++ ) {
                topRows[y+ofs] |= reversedBottom[y];
            }
            rows = topRows;

        } else {

            const xofs = BigInt(maxX - position);
            maxX = position - 1;
            const leftRow = rows.map( row => row >> (xofs + 1n) );
            const rightRows = rows.map( row => row & ((1n << (xofs+1n))-1n) );
            const pad = Number(xofs);
            const reversedRight = rightRows.map( row => BigInt( "0b" + row.toString(2).padStart(pad, "0").split("").reverse().join("") ) );
            const ofs = leftRow.length - rightRows.length;
            for( let x = 0; x < reversedRight.length; x++ ) {
                leftRow[x+ofs] |= reversedRight[x];
            }
            rows = leftRow;

        }
        
    } );

    return rows;

}

const zip = (a,b) => a.map( (x,i) => [x, b[i]] );
const unzip = (arr) => arr.reduce( ([a,b], [c,d]) => [[...a, c], [...b,d]], [[],[]] );

// A more sensible, but slower implementation - grid of bools
function foldThePaperSensible(coords, folds) {

    let [maxX, maxY] = coords.reduce( ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)], [0, 0] );

    let grid = Array(maxY + 1).fill(false).map( () => Array(maxX + 1).fill(false) );

    coords.forEach( ([x, y]) => {
        grid[y][x] = true;
    } );

    folds.forEach( ({axis, position}) => {

        if( axis == "y" ) {

            const topRows = grid.slice(0, position);
            const bottomRows = grid.slice(position+1);
            const reversedBottom = bottomRows.reverse();
            grid = zip(topRows, reversedBottom).map( ([a,b]) => a.map( (v,i) => v || b[i]) );

        } else {

            const [leftRows, rightRows] = unzip( grid.map( row => [row.slice(0, position), row.slice(position+1)] ) );
            const reversedRight = rightRows.map( row => row.reverse() );
            grid = zip(leftRows, reversedRight).map( ([a,b]) => a.map( (v,i) => v || b[i]) );

        }

    } );

    return grid;

}

// Turns out this is much better
function foldThePaperWithoutAStupidGrid(coords, folds) {

    folds.forEach( ({axis, position}) => {

        coords = coords.map( ([x, y]) => {

            if( axis == "y" ) {
                if( y > position )
                    return [x, position-(y-position)]
            } else if( x > position )
                return [position-(x-position), y]

            return [x, y];
            
        } );

    });

    let [maxX, maxY] = coords.reduce( ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)], [0, 0] );

    let grid = Array(maxY + 1).fill(false).map( () => Array(maxX + 1).fill(false) );

    coords.forEach( ([x, y]) => {
        grid[y][x] = true;
    } );

    return grid;

}

function part1(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaperWithoutAStupidGrid(coords, [folds[0]]);

    // For the Sensible/non-grid implementations
    return rows.reduce( (count, row) => count + row.reduce( (count, cell) => count + (cell ? 1 : 0), 0 ), 0 );

    return rows.reduce( (count, row) => count + row.toString(2).split("").filter( bit => bit == "1" ).length, 0 );

}

function part2(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaperWithoutAStupidGrid(coords, folds);

    // For the Sensible/non-grid implementations
    return rows.map( row => row.map( cell => cell ? "#" : "." ).join("") ).join("\n");;

    return rows.map( row => row.toString(2).replace(/1/g,"#").replace(/0/g,".") ).join("\n");

}

module.exports = { part1, part2 }