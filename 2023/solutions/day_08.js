export function part1(data) {

    const [moves,nodesStr] = data.split(/\r?\n\r?\n/)

    const nodes = nodesStr.split(/\r?\n/).reduce( (nodes,line) => {
        const [id,dests] = line.split(" = ")
        const [left,right] = dests.substring(1,dests.length-1).split(", ")
        nodes[id] = {id,left,right}
        return nodes
    }, {})

    let count = 0
    let node = nodes["AAA"]
    while( node.id != "ZZZ" )
        node = nodes[ moves[count++%moves.length] == "L" ? node.left : node.right ]

    return count

}

// Slow solution because the LCM shortcut is lame
export function part2(data) {

    const [moves,nodesStr] = data.split(/\r?\n\r?\n/)

    const nodes = nodesStr.split(/\r?\n/).reduce( (nodes,line) => {
        const [id,dests] = line.split(" = ")
        const [left,right] = dests.substring(1,dests.length-1).split(", ")
        nodes[id] = {id,left,right}
        return nodes
    }, {})

    let startNodes = Object.values(nodes).filter( n => n.id.endsWith("A") )

    const paths = startNodes.map( startNode => {

        Object.values(nodes).forEach( n => {
            n.visited = Array(moves.length).fill(0)
            n.path = Array(moves.length).fill("")
        } )

        let node = startNode

        let count = 0
        let path = ""
        while( !node.visited[count%moves.length] ) {
            node.path[count%moves.length] = path
            path += node.id[2]
            node.visited[count%moves.length] = true
            node = nodes[ moves[count%moves.length] == "L" ? node.left : node.right ]
            count++
        }

        const loopStr = path.substring(node.path[count%moves.length].length)
        const z = loopStr.indexOf("Z")
        const loop = loopStr.length
        const pos = node.path[count%moves.length].length + z
        return {loop, pos}
    } )

    const pathComparator = (a,b) => a.pos < b.pos ? 1 : -1

    const done = paths => paths.reduce( (pos,p) => p.pos == pos ? pos : 0, paths[0].pos )

    while( !done(paths) ) {
        paths.sort(pathComparator)
        paths.forEach( p => {
            while( p.pos < paths[0].pos )
                p.pos += p.loop
        } )
    }

    return paths[0].pos

}
