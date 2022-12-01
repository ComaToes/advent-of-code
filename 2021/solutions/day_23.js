function parseData(data) {

    const [wall, hall, row1, row2, wall2] = data.split(/\r?\n/);
    return [
        row1.split("").filter( ch => ch != "#" ),
        row2.split("").filter( ch => ch != "#" && ch != " " )
    ];

}

const distanceCache = {};

// Dijkstra of hallway graph used to create heuristic for A* through game states...
function findDistance(nodes, start, target) {

    if( start == target )
        return {distance: 0, path: []};

    const distanceKey = `${start.id}_${target.id}`;
    if( distanceCache[distanceKey] )
        return distanceCache[distanceKey];

    const unvisited = [...nodes];
    unvisited.forEach( n => n.distance = Infinity );

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
            if( dist < node.distance ) {
                node.distance = dist;
                node.from = current;
            }
        });

    }

    const distance = current.distance;
    const path = [current.id];
    while( current.from ) {
        path.unshift(current.from.id);
        current = current.from;
    }
    path.shift();

    nodes.forEach( n => {
        delete n.distance;
        delete n.visited;
        delete n.from;
    });

    console.log( start.id, target.id, path )

    distanceCache[distanceKey] = {path, distance};

    return {path, distance};

}

function gameStateHeuristic(nodes, rooms, occupantCosts) {
    let h = 0;
    nodes.forEach( node => {
        if( node.occupant /*&& node.occupant != node.desiredOccupant*/ ) {
            const room = rooms[node.occupant];
            let i = room.length-1;
            //while( room[i] != node && room[i].occupant == room[i].desiredOccupant )
              //  i--;
            let {path, distance} = findDistance(nodes, node, room[i]);
            h += distance * occupantCosts[node.occupant];
            //if( node.desiredOccupant && node.desiredOccupant != node.occupant )
            //    h += occupantCosts[node.occupant]*10
            //h += path.reduce( (v,id) => v + (nodes[id].occupant ? occupantCosts[nodes[id].occupant] : 0 ), 0 );
            //h += path.reduce( (v,id) => v + (nodes[id].occupant && (!nodes[id].desiredOccupant || nodes[id].occupant != node.occupant) ? occupantCosts[nodes[id].occupant] : 0 ), 0 );
            //h += path.reduce( (v,id) => v + ((nodes[id].occupant && nodes[id].desiredOccupant == nodes[id].occupant && nodes[id].occupant == node.occupant) ? -occupantCosts[nodes[id].occupant] : 0 ), 0 );
        }
    });
    /*Object.values(rooms).forEach( room => {
        room.forEach( node => {
            if( node.occupant == node.desiredOccupant )
                h -= occupantCosts[node.occupant]
        })
    })*/
    return h;
}

function createRoom(id, size, desiredOccupant) {
    const nodes = [{
        id: id++,
        edges: [],
        desiredOccupant
    }];
    for (let i = 1; i < size; i++) {
        const node = {
            id: id++,
            edges: [{
                node: nodes[i-1],
                weight: 1
            }],
            desiredOccupant
        };
        nodes[i-1].edges.push({
            node,
            weight: 1
        });
        nodes.push(node);
    }
    return {nodes, id};
}

function createHallwayGraph(desiredRoomOccupants, roomSize) {

    const nodes = [];
    const rooms = {};

    // construct hallway graph
    let id = 0;
    let node = { id: id++, edges: [], canStop: true };
    nodes.push( node );
    const nextNode = { id: id++, edges: [ {node, weight: 1} ], canStop: true };
    node.edges.push( {node: nextNode, weight: 1} );
    nodes.push( nextNode );
    node = nextNode;

    for( let roomId = 0; roomId < desiredRoomOccupants.length; roomId++ ) {
        const desiredOccupant = desiredRoomOccupants[roomId];
        const room = createRoom(id, roomSize, desiredOccupant);
        id = room.id;
        const nextHallNode = { id: id++, edges: [ {node: room.nodes[0], weight: 2}, {node, weight: 2} ], canStop: true };
        room.nodes[0].edges.push( {node, weight: 2}, {node: nextHallNode, weight: 2} );
        node.edges.push( {node: room.nodes[0], weight: 2}, {node: nextHallNode, weight: 2} );
        nodes.push( ...room.nodes, nextHallNode );
        rooms[desiredOccupant] = room.nodes;
        node = nextHallNode;
    }

    const lastNode = { id: id++, edges: [ {node, weight: 1} ], canStop: true };
    node.edges.push( {node: lastNode, weight: 1} );
    nodes.push( lastNode );

    return {nodes, rooms};

}

function generateMovesFromNode(nodes, startNode, occupantCosts) {

    const movingOccupant = startNode.occupant;
    const moves = [];
    const work = [{node: startNode, cost: 0}];
    while( work.length > 0 ) {
        const current = work.pop();
        current.node.edges.forEach( ({node, weight}) => {
            if( node.occupant || node.visited )
                return;
            const cost = current.cost + weight * occupantCosts[movingOccupant];
            if( node.canStop || node.desiredOccupant == movingOccupant ) {
                moves.push( {from: startNode.id, to: node.id, cost} );
            }
            node.visited = true;
            work.push( {node, cost} );
        });
    }

    nodes.forEach( n => {
        delete n.visited;
    });

    return moves;

}

function generateLegalMoves(nodes, occupantCosts) {

    const startNodes = nodes.filter( n => n.occupant );
    return startNodes.map( startNode => generateMovesFromNode(nodes, startNode, occupantCosts) ).flat();

}

function gameIsComplete(rooms) {
    return Object.values(rooms).reduce( (complete, room) => 
        complete && 
        room.reduce( (v,node) => v && node.occupant == node.desiredOccupant, true ), true);
}

function cloneHallway(nodes, desiredRoomsOccupants, roomSize) {
    const newGraph = createHallwayGraph(desiredRoomsOccupants, roomSize);
    nodes.forEach( (node, i) => {
        newGraph.nodes[i].occupant = node.occupant;
    });
    return newGraph;
}

function stateString(nodes) {
    return nodes.map( n => n.occupant || "." ).join("");
}

function hallwayFromStateString(stateStr, desiredRoomOccupants, roomSize) {
    const {nodes, rooms} = createHallwayGraph(desiredRoomOccupants, roomSize);
    for (let i = 0; i < stateStr.length; i++) {
        if( stateStr[i] != "." )
            nodes[i].occupant = stateStr[i];
    }
    return {nodes, rooms}
}

function findOptimalMoves(nodes, rooms, occupantCosts, desiredRoomOccupants, roomSize) {

    let id = 0;
    const initialStateStr = stateString(nodes);
    const start = {
        id: id++,
        nodes,
        rooms,
        fScore: gameStateHeuristic(nodes, rooms, occupantCosts),
        gScore: 0,
        state: initialStateStr
    };

    const openSet = [start];

    const stateNodes = {};
    stateNodes[initialStateStr] = start;
    const cameFrom = {};

    let current;
    while( openSet.length > 0 ) {

        //openSet.sort( (a,b) => a.fScore - b.fScore );

        current = openSet.shift();

        //if( current.fScore % 100 == 0 )
        //console.log(current.state);
        //console.log(current.fScore, current.fScore-current.gScore, openSet.length);

        if( gameIsComplete(current.rooms) )
            break;

        const edges = generateLegalMoves(current.nodes, occupantCosts).map( ({from, to, cost}) => {

            const newNodes = current.nodes.map(n => ({...n}));
            newNodes[to].occupant = newNodes[from].occupant;
            delete newNodes[from].occupant;
            const stateStr = stateString(newNodes);
            if( stateNodes[stateStr] )
                return {node: stateNodes[stateStr], weight: cost};

            const hallway = cloneHallway(current.nodes, desiredRoomOccupants, roomSize);
            hallway.nodes[to].occupant = hallway.nodes[from].occupant;
            delete hallway.nodes[from].occupant;
            const stateNode = { ...hallway, id: id++, fScore: Infinity, gScore: Infinity, state: stateStr };
            stateNodes[stateStr] = stateNode;
            return {node: stateNode, weight: cost};
        });

        edges.forEach( ({node, weight}) => {
            const t_gScore = current.gScore + weight;
            if( t_gScore < node.gScore ) {

                /*if( !node.nodes ) {
                    hallway = hallwayFromStateString(node.state, desiredRoomOccupants, roomSize);
                    node.nodes = hallway.nodes;
                    node.rooms = hallway.rooms;
                }*/

                cameFrom[node.id] = current;
                node.gScore = t_gScore;
                node.fScore = t_gScore + gameStateHeuristic(node.nodes, node.rooms, occupantCosts);

                const idx = openSet.indexOf(node);
                if( idx >= 0 )
                    openSet.splice(idx,1);
                //if( !openSet.includes(node) ) {

                    let min = 0, max = openSet.length, mid = 1;
                    while( max > min && openSet.length > 0 ) {
                        mid = Math.floor((max+min)/2);
                        //console.log(`mid ${min}, ${mid}, ${max}`)
                        if( openSet[mid].fScore >= node.fScore ) {
                            max = mid;
                        } else
                            min = mid + 1;
                    }
                    openSet.splice( mid, 0, node );
/*
                    let done = false;
                    for( let i = 0; i < openSet.length; i++ ) {
                        if( openSet[i].fScore >= node.fScore ) {
                            //if( i != max )
                            //    throw new Error(`bork ${i} != ${min}, ${mid}, ${max}`)
                            openSet.splice( i, 0, node );
                            done = true;
                            break;
                        }
                    }
                    if( !done ) {
                        //console.log(`${mid} ${openSet.length}`)
                        openSet.push(node);
                    }*/
                //}
            }
        } );

        /*const state = stateNodes[current.state];
        delete state.nodes;
        delete state.rooms;*/

    }

    console.log(Object.keys(stateNodes))

    console.log( stateString(current.nodes) )

    return current.gScore;

}

function part1(data) {

    const [frontOccupants, backOccupants] = parseData(data);

    const desiredRoomsOccupants = ["A","B","C","D"];

    const roomSize = 2;

    const {nodes, rooms} = createHallwayGraph(desiredRoomsOccupants, roomSize);

    desiredRoomsOccupants.forEach( (occ, i) => {
        rooms[occ][0].occupant = frontOccupants[i];
        rooms[occ][1].occupant = backOccupants[i];
    });

    const occupantCosts = {
        "A": 1,
        "B": 10,
        "C": 100,
        "D": 1000
    }

    return findOptimalMoves(nodes, rooms, occupantCosts, desiredRoomsOccupants, roomSize);

}

function part2(data) {

    return;

    const [frontOccupants, backOccupants] = parseData(data);

    const midOccupants1 = ["D","C","B","A"];
    const midOccupants2 = ["D","B","A","C"];

    const desiredRoomsOccupants = ["A","B","C","D"];

    const roomSize = 4;

    const {nodes, rooms} = createHallwayGraph(desiredRoomsOccupants, roomSize);

    desiredRoomsOccupants.forEach( (occ, i) => {
        rooms[occ][0].occupant = frontOccupants[i];
        rooms[occ][1].occupant = midOccupants1[i];
        rooms[occ][2].occupant = midOccupants2[i];
        rooms[occ][3].occupant = backOccupants[i];
    });

    const occupantCosts = {
        "A": 1,
        "B": 10,
        "C": 100,
        "D": 1000
    }

    return findOptimalMoves(nodes, rooms, occupantCosts, desiredRoomsOccupants, roomSize);

}

module.exports = { part1, part2 }