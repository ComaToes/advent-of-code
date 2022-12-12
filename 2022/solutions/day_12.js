const aCode = "a".charCodeAt(0)

function parseGrid(data) {

    let start
    let end
    const grid = data.split(/\r?\n/).map( (line,y) => line.split("").map( (ch,x) => {
        const height = ch == "S" ? 0 : ch == "E" ? 25 : (ch.charCodeAt(0) - aCode)
        const node = {
            x,
            y,
            height,
            edges: [],
            id: `${x},${y}`,
            fScore: Infinity,
            gScore: Infinity,
        }
        if( ch == "S" )
            start = node
        if( ch == "E" )
            end = node
        return node
    }))

    return {grid,start,end}

}

function createEdges(grid, shouldCreateEdge) {

    grid.forEach( (row,y) => row.forEach( (node,x) => {
        [[-1,0],[0,-1],[1,0],[0,1]].forEach( ([dx,dy]) => {
            const ny = y + dy, nx = x + dx
            if( ny >= 0 && ny < grid.length && nx >= 0 && nx < row.length ) {
                const nodf = grid[ny][nx]
                if( shouldCreateEdge(node, nodf) )
                    node.edges.push( {weight: 1, node: nodf} )
            }
        })
    }))

}

function aStar(start, h, found) {

    const openSet = [{
        ...start,
        fScore: h(start),
        gScore: 0,
    }]

    const cameFrom = {}

    let current
    while( openSet.length > 0 ) {

        openSet.sort( (a,b) => a.fScore - b.fScore )

        current = openSet.shift()

        if( found(current) )
            break

        current.edges.forEach( ({node, weight}) => {
            const t_gScore = current.gScore + weight
            if( t_gScore < node.gScore ) {
                cameFrom[node.id] = current
                node.gScore = t_gScore
                node.fScore = t_gScore + h(node)
                if( !openSet.includes(node) )
                    openSet.push(node)
            }
        } )

    }

    return current.gScore

}

function part1(data) {

    const {grid, start, end} = parseGrid(data)

    // Edges for valid uphill paths
    createEdges( grid, (a,b) => (b.height - a.height) < 2 )

    // Heuristic is manhatten distance to end
    const h = ({x,y}) => Math.abs(end.x - x) + Math.abs(end.y - y)

    // Stop when we get to the end node
    const found = node => node == end

    // Path from start to end
    return aStar(start, h, found)

}

function part2(data) {

    const {grid, end} = parseGrid(data)

    // Edges for valid downhill paths
    createEdges( grid, (a,b) => (a.height - b.height) < 2 )

    // Heuristic is distance from x = 0 because all the valid starts are there
    // Without this meta-knowledge of the input, a constant heuristic would 
    // make this essentially a Dijkstra/BFS instead
    const h = ({x}) => x

    // Stop at height 0
    const found = node => node.height == 0

    // Start at end and work back to lowest height
    return aStar(end, h, found)

}

module.exports = { part1, part2 }