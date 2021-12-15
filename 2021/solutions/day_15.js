function part1(data) {

    const grid = data.split(/\r?\n/).map( row => row.split("").map(Number) );

    // Build graph
    const nodeGrid = grid.map( row => row.map( () => ({ edges:[], distance: Infinity, visited: false }) ) );

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            const node = nodeGrid[y][x];
            [ [y, x+1], [y+1, x], [y, x-1], [y-1, x] ].forEach( ([ny, nx]) => {
                if( ny < 0 || nx < 0 || ny > grid.length - 1 || nx > grid.length - 1 )
                    return;
                node.edges.push( {
                    node: nodeGrid[ny][nx],
                    weight: grid[ny][nx]
                } );
            } )
        }
    }

    // Dijkstra
    const start = nodeGrid[0][0];
    const target = nodeGrid[nodeGrid.length-1][nodeGrid.length-1];
    const unvisited = nodeGrid.flat();

    start.distance = 0;

    let current = start;
    while( unvisited.length > 0 ) {

        unvisited.sort( (a, b) => a.distance - b.distance );
        current = unvisited.shift();
        current.visited = true;

        if( current == target )
            break;

        current.edges.filter( ({node}) => !node.visited ).forEach( ({node, weight}) => {
            const dist = current.distance + weight;
            if( dist < node.distance )
                node.distance = dist;
        });

    }

    return current.distance;

}

function part2(data) {

    let grid = data.split(/\r?\n/).map( row => row.split("").map(Number) );

    // Expand rows 5x width
    grid = grid.map( row => {
        let newRow = row;
        for (let i = 1; i < 5; i++) {
            newRow = newRow.concat( row.map( n => ((n+i-1) % 9)+1 ) );
        }
        return newRow;
    } );

    // Expand 5x height
    let newGrid = grid;
    for (let i = 1; i < 5; i++) {
        newGrid = newGrid.concat( grid.map( row => row.map( n => ((n+i-1) % 9)+1 ) ) );
    }
    grid = newGrid;

    // Build graph
    const nodeGrid = grid.map( (row,y) => row.map( (_,x) => ({ x, y, id: `${y},${x}`, edges:[], fScore: Infinity, gScore: Infinity }) ) );

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            const node = nodeGrid[y][x];
            [ [y, x+1], [y+1, x], [y, x-1], [y-1, x] ].forEach( ([ny, nx]) => {
                if( ny < 0 || nx < 0 || ny > grid.length - 1 || nx > grid.length - 1 )
                    return;
                node.edges.push( {
                    node: nodeGrid[ny][nx],
                    weight: grid[ny][nx]
                } );
            } )
        }
    }

    // Heuristic is manhatten distance from bottom right
    const h = ({x,y}) => {
        return grid.length * 2 - (x + y);
    }

    // A*
    const start = nodeGrid[0][0];
    const target = nodeGrid[nodeGrid.length-1][nodeGrid.length-1];

    const openSet = [{
        ...start,
        fScore: h(start),
        gScore: 0,
    }];

    const cameFrom = {};

    let current;
    while( openSet.length > 0 ) {

        openSet.sort( (a,b) => a.fScore - b.fScore );

        current = openSet.shift();

        if( current == target )
            break;

        current.edges.forEach( ({node, weight}) => {
            const t_gScore = current.gScore + weight;
            if( t_gScore < node.gScore ) {
                cameFrom[node.id] = current;
                node.gScore = t_gScore;
                node.fScore = t_gScore + h(node);
                if( !openSet.includes(node) )
                    openSet.push(node);
            }
        } );

    }

    return current.gScore;

}

module.exports = { part1, part2 }