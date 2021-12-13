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
            const leftCols = rows.map( row => row >> (xofs + 1n) );
            const rightCols = rows.map( row => row & ((1n << (xofs+1n))-1n) );
            const pad = Number(xofs);
            const reversedRight = rightCols.map( row => BigInt( "0b" + row.toString(2).padStart(pad, "0").split("").reverse().join("") ) );
            const ofs = leftCols.length - rightCols.length;
            for( let x = 0; x < reversedRight.length; x++ ) {
                leftCols[x+ofs] |= reversedRight[x];
            }
            rows = leftCols;

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

            const [leftCols, rightCols] = unzip( grid.map( row => [row.slice(0, position), row.slice(position+1)] ) );
            const reversedRight = rightCols.map( row => row.reverse() );
            grid = zip(leftCols, reversedRight).map( ([a,b]) => a.map( (v,i) => v || b[i]) );

        }

    } );

    return grid;

}

function part1(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaper(coords, [folds[0]]);

    // For the Sensible implementation
    //return rows.reduce( (count, row) => count + row.reduce( (count, cell) => count + (cell ? 1 : 0), 0 ), 0 );

    return rows.reduce( (count, row) => count + row.toString(2).split("").filter( bit => bit == "1" ).length, 0 );

}

function part2(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaper(coords, folds);

    // For the Sensible implementation
    //return rows.map( row => row.map( cell => cell ? "#" : "." ).join("") ).join("\n");;

    return rows.map( row => row.toString(2).replace(/1/g,"#").replace(/0/g,".") ).join("\n");

}

module.exports = { part1, part2 }