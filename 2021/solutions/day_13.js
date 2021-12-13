function parseData(data) {

    const [coordLines, foldLines] = data.split(/\r?\n\r?\n/);
    const coords = coordLines.split(/\r?\n/).map( line => line.split(",").map(Number) );
    const folds = foldLines.split(/\r?\n/).map( line => {
        const [, axis, position] = line.match(/fold along ([xy])=(\d+)/);
        return {axis, position: Number(position)};
    } );
    return [coords, folds];

}

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

function part1(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaper(coords, [folds[0]]);

    return rows.reduce( (count, row) => count + row.toString(2).split("").filter( bit => bit == "1" ).length, 0 );

}

function part2(data) {

    const [coords, folds] = parseData(data);

    const rows = foldThePaper(coords, folds);

    return rows.map( row => row.toString(2).replace(/1/g,"#").replace(/0/g,".") ).join("\n");

}

module.exports = { part1, part2 }