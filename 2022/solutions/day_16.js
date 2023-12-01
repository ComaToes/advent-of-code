function dijkstra(start) {

    start.gScore = 0
    const openSet = [start]

    const cameFrom = {}

    let current
    while( openSet.length > 0 ) {

        openSet.sort( (a,b) => a.fScore - b.fScore )

        current = openSet.shift()

        current.edges.forEach( ({node, weight}) => {
            const t_gScore = current.gScore + weight
            if( t_gScore < node.gScore ) {
                cameFrom[node.id] = current
                node.gScore = t_gScore
                node.fScore = t_gScore
                if( !openSet.includes(node) )
                    openSet.push(node)
            }
        } )

    }

    return cameFrom

}

function resetNodes(nodes) {
    nodes.forEach( node => {
        node.fScore = Infinity
        node.gScore = Infinity
    })
}

export function part1(data) {

    const valves = data.split(/\r?\n/).map( line => {
        const {id,rate,tunnels} = line.match(/Valve (?<id>-?\w+) has flow rate=(?<rate>-?\d+); tunnels? leads? to valves? (?<tunnels>-?.*)/).groups
        return {
            id,
            rate: Number(rate),
            tunnels: tunnels.split(", ")
        }
    })

    const startNode = "AA"

    const nodeMap = valves.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )
    const routeNodes = valves.filter( ({id,rate}) => id == startNode || rate > 0 )
    const routeNodeMap = routeNodes.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )

    valves.forEach( valve => {
        valve.edges = valve.tunnels.map( id => ({weight: 1, node: nodeMap[id]}) )
    })

    // use dijkstra to collapse routes between important nodes
    // creating a fully connected graph of start node and nodes
    // with rate > 0, edges weighted by distance
    routeNodes.forEach( valve => {
        resetNodes(valves)
        const cameFrom = dijkstra(valve)
        valve.nedges = routeNodes.filter( other => other != valve ).map( other => {
            let id = other.id
            let weight = 0
            do {
                weight++
                id = cameFrom[id].id
            } while( id != valve.id)
            return {weight, node: other}
        })
    })
    routeNodes.forEach( valve => {
        valve.edges = valve.nedges
        delete valve.nedges
    })

    // exhaustive search
    const work = [{
        current: nodeMap[startNode],
        path: [],
        time: 30,
        value: 0,
    }]

    let bestValue = 0

    while( work.length > 0 ) {
        const {current,path,time,value} = work.pop()
        if( time <= 0 )
            continue
        current.edges.forEach( ({weight,node}) => {
            if( path.includes(node.id) )
                return
            const ntime = time - (weight + 1)
            const nvalue = value + Math.max(ntime,0) * node.rate
            bestValue = Math.max(bestValue, nvalue)
            work.push({
                current: node,
                path: [...path, current.id],
                time: ntime,
                value: nvalue,
            })
        })
    }

    return bestValue//nodeMap["BB"].edges.filter(({node}) => node.id == "JJ")

}

// works but exhaustive too slow
export function part2a(data) {

    const valves = data.split(/\r?\n/).map( line => {
        const {id,rate,tunnels} = line.match(/Valve (?<id>-?\w+) has flow rate=(?<rate>-?\d+); tunnels? leads? to valves? (?<tunnels>-?.*)/).groups
        return {
            id,
            rate: Number(rate),
            tunnels: tunnels.split(", ")
        }
    })

    const startNode = "AA"

    const nodeMap = valves.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )
    const routeNodes = valves.filter( ({id,rate}) => id == startNode || rate > 0 )
    const routeNodeMap = routeNodes.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )

    valves.forEach( valve => {
        valve.edges = valve.tunnels.map( id => ({weight: 1, node: nodeMap[id]}) )
    })

    // use dijkstra to collapse routes between important nodes
    // creating a fully connected graph of start node and nodes
    // with rate > 0, edges weighted by distance
    routeNodes.forEach( valve => {
        resetNodes(valves)
        const cameFrom = dijkstra(valve)
        valve.nedges = routeNodes.filter( other => other != valve ).map( other => {
            let id = other.id
            let weight = 0
            do {
                weight++
                id = cameFrom[id].id
            } while( id != valve.id)
            return {weight, node: other}
        })
    })
    routeNodes.forEach( valve => {
        valve.edges = valve.nedges
        delete valve.nedges
    })

    // exhaustive search
    const work = [{
        explorers: [{current: nodeMap[startNode], path: [], time: 26}, {current: nodeMap[startNode], path: [], time: 26}],
        value: 0,
    }]

    let bestValue = 0

    while( work.length > 0 ) {

        const {explorers,value} = work.pop()
        explorers.forEach( ({current,path,time},i) => {
            if( time <= 0 ) {
                return
            }
            current.edges.forEach( ({weight,node}) => {
                if( explorers.reduce( (b,e) => b || e.path.includes(node.id) || (e.current.id == node.id), false ) )
                    return
                const ntime = time - (weight + 1)
                const nvalue = value + Math.max(ntime,0) * node.rate
                bestValue = Math.max(bestValue, nvalue)
                const nexplorers = structuredClone(explorers)
                nexplorers[i] = {
                    current: node,
                    path: [...path, current.id],
                    time: ntime,
                }
                work.push({
                    explorers: nexplorers,
                    value: nvalue,
                })
            })
        })

    }

    return bestValue

}

function aStar(start, h, found, edges) {

    const openSet = [{
        ...start,
        fScore: h(start),
        gScore: 0,
        depth: 0,
    }]

    const cameFrom = {}

    let count = 0

    let current
    while( openSet.length > 0 ) {

        //openSet.sort( (a,b) => a.fScore - b.fScore )

        current = openSet.shift()

        if( found(current) )
            break

        edges(current).forEach( ({node, weight}) => {
            const t_gScore = current.gScore + weight
            if( t_gScore < node.gScore ) {
                //cameFrom[node.id] = current
                node.gScore = t_gScore
                node.fScore = t_gScore + h(node)
                node.depth = current.depth+1
                if( !openSet.includes(node) )
                    openSet.push(node)
            }
        } )

        openSet.sort( (a,b) => a.fScore - b.fScore )

        //console.log({count})

        if( count++ == 0 ) {
            //console.log(openSet)
            //throw new Error()
        }

    }

    console.log({count})

    return current

}

export function part2(data) {

    const valves = data.split(/\r?\n/).map( line => {
        const {id,rate,tunnels} = line.match(/Valve (?<id>-?\w+) has flow rate=(?<rate>-?\d+); tunnels? leads? to valves? (?<tunnels>-?.*)/).groups
        return {
            id,
            rate: Number(rate),
            tunnels: tunnels.split(", ")
        }
    })

    const startNode = "AA"

    const nodeMap = valves.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )
    const routeNodes = valves.filter( ({id,rate}) => id == startNode || rate > 0 )
    const routeNodeMap = routeNodes.reduce( (nodes,valve) => (nodes[valve.id] = valve) && nodes, {} )

    valves.forEach( valve => {
        valve.edges = valve.tunnels.map( id => ({weight: 1, node: nodeMap[id]}) )
    })

    // use dijkstra to collapse routes between important nodes
    // creating a fully connected graph of start node and nodes
    // with rate > 0, edges weighted by distance
    routeNodes.forEach( valve => {
        resetNodes(valves)
        const cameFrom = dijkstra(valve)
        valve.nedges = routeNodes.filter( other => other != valve ).map( other => {
            let id = other.id
            let weight = 0
            do {
                weight++
                id = cameFrom[id].id
            } while( id != valve.id)
            return {weight, node: other}
        })
    })
    routeNodes.forEach( valve => {
        valve.edges = valve.nedges
        delete valve.nedges
    })
/*
    const h = (node) => node.rate
    const found = (node) => node.depth > 3

    resetNodes(valves)
    const {cameFrom,current} = aStar( nodeMap[startNode], h, found )

    //return {cameFrom,current}

    const path = []
    let id = current.id
    while( cameFrom[id].id != startNode ) {
        path.push(id)
        id = cameFrom[id].id
    }

    return path

/*
    const work = [ [nodeMap[startNode]] ]

    const paths = []

    while( work.length > 0 ) {
        const path = work.pop()
        paths.push( path.map(n=>n.id).join(" ") )
        const head = path[path.length-1]
        head.edges.forEach( ({node,weight}) => {
            if( !path.includes(node) )
                work.push( [...path,node] )
        })
    }

    return paths.length

    return routeNodes.map(r=>r.edges)
/**/

    const maxTime = 26

    const maxPossible = routeNodes.reduce( (x,n) => x + n.rate * maxTime, 0 )

    const start = {
        explorers: [{current: nodeMap[startNode], path: [], time: maxTime}, {current: nodeMap[startNode], path: [], time: maxTime}],
        value: 0,
        fScore: Infinity,
        gScore: Infinity,
    }

    const stateMap = {}

    const edges = ({explorers, value}) => {

        const nextStateEdges = []

        explorers.forEach( ({current,path,time},i) => {
            if( time <= 0 )
                return

            const validEdges = current.edges.filter( ({node}) => !explorers.reduce( (b,e) => b || e.path.includes(node.id) || (e.current.id == node.id), false ) )
            validEdges.forEach( ({weight,node}) => {
                const ntime = time - (weight + 1)
                const dv = Math.max(ntime,0) * node.rate
                const nvalue = value + dv
                const nexplorers = structuredClone(explorers)
                nexplorers[i] = {
                    current: node,
                    path: [...path, current.id],
                    time: ntime,
                }
                const id = nexplorers.map( e => e.path.concat(e.current.id).join("") ).join(",")
                if( !stateMap[id] ) {
                    stateMap[id] = {
                        id,
                        fScore: Infinity,
                        gScore: Infinity,
                    }
                }
                const maxRate = validEdges.filter( e => e.node.id != node.id ).reduce( (r,{node}) => Math.max( r, node.rate ), 0 )

                //const nweight = validEdges.filter( e => e.node.id != node.id ).reduce( (w,e) => w + Math.max(weight-e.weight+1,0) * e.node.rate, 0 )

                //const nweight = validEdges.filter( e => e.node.id != node.id ).reduce( (w,e) => w + (weight-e.weight+1) * e.node.rate, 0 )
                //const nweight = validEdges.filter( e => e.node.id != node.id ).reduce( (w,e) => Math.max(w, Math.max(weight-e.weight+1,0) * e.node.rate), 0 )
                //const nweight = validEdges.filter( e => e.node.id != node.id ).reduce( (w,e) => w + (weight+1) * e.node.rate, 0 )
                //const nweight = validEdges.filter( e => e.node.id != node.id ).reduce( (w,e) => Math.max(w, e.node.rate), 0 ) * (weight+1)
                //const nweight = weight+1
                const nweight = routeNodes.filter( e => e.id != node.id ).reduce( (w,e) => w + (weight+1) * e.rate, 0 )
                const nextState = stateMap[id]
                nextState.explorers = nexplorers
                nextState.value = nvalue
                nextStateEdges.push({
                    weight: nweight,
                    node: nextState,
                })
            })
        })

        //console.log(nextStateEdges)
        //throw new Error()

        return nextStateEdges

    }

    const h = (state) => maxPossible - state.value
/*
    const h = (state) => {
        const time = state.explorers.reduce( (t,e) => Math.max(t,e.time), 0 )
        const ids = state.explorers.map( e => e.path.concat(e.current.id) ).flat()
        const unvisited = routeNodes.filter(n=>!ids.includes(n.id))
        return maxPossible - unvisited.reduce( (x,n) => x + n.rate * time, 0 ) - state.value
    }
    /*
    const h = (state) => {
        const ids = state.explorers.map( e => e.path.concat(e.current.id) ).flat()
        const unvisited = routeNodes.filter(n=>!ids.includes(n.id))
        const unvisitedIds = unvisited.map(n=>n.id)
        const maxWeight = state.explorers.map( e => e.current ).flat().reduce( (max,{edges}) => Math.min(max, edges.filter(({node})=>unvisitedIds.includes(node.id)).reduce( (max,{weight}) => Math.min(max,weight), 99 ) ), 99 )
        console.log({maxWeight})
        return unvisited.reduce( (v,{rate}) => v + rate, 0 ) * (state.explorers.reduce( (v,{time}) => Math.max(v,time), 0 )-maxWeight*unvisited.length )
    }
    /** */
    const found = (state) => {
        const ids = state.explorers.map( e => e.path.concat(e.current.id) ).flat()
        //console.log(routeNodes.filter(n=>!ids.includes(n.id)).map(n=>n.id))
        return (routeNodes.filter(n=>!ids.includes(n.id)).length < 1) || (state.explorers.reduce( (v,{time}) => v && (time < 0), true ))
    } 
    
    /**/

    const state = aStar(start,h,found,edges)

    console.log({maxPossible})

    return state

    /*

    const mst = (arr) => {
        const nodes = [...arr]
        const treeNodes = [nodes.shift()]
        let mstWeight = 0
        while( nodes.length > 0 ) {
            const node = nodes.shift()
            const cheapest = treeNodes.reduce( (cheapest,tnode) => {
                const weight = node.edges.filter(n=>n.id == tnode.id)[0].weight
                if( weight < cheapest.weight ) {
                    cheapest.node = tnode
                    cheapest.weight = weight
                }
                return cheapest
            }, {weight:Infinity} )
            treeNodes.push( cheapest.node )
            mstWeight += cheapest.weight
        }
        return mstWeight
    }

    const work = [{
        explorers: [{current: nodeMap[startNode], path: [], time: 26}, {current: nodeMap[startNode], path: [], time: 26}],
        value: 0,
    }]

    let bestValue = 0
    let best = null
    let count = 0
    let bval = 0

    const potentialExtraValue = (path, time) => {
        //console.log({path})
        const remaining = routeNodes.filter( n => !path.includes(n.id) )
        const edgeCost = remaining
        return remaining.reduce( (v,n) => v + time * n.rate, 0 )
    }

    while( work.length > 0 ) {

        const {explorers,value,extra} = work.pop()
        count++
        if( value + extra < bestValue - 100 ) {
            //continue
        }
        bestValue = value + extra

        if( value > bval ) {
            bval = value
            best = explorers.map( e => e.path.concat(e.current.id) )
            console.log(bval)
        }
        //console.log(value, extra)
        //console.log(explorers.map( e => e.path.concat(e.current.id) ))

        const next = []

        explorers.forEach( ({current,path,time},i) => {
            if( time <= 0 ) {
                return
            }
            let bestNextValue = 0
            let bestNext = null
            //if( value >= bestValue ) {
                current.edges.forEach( ({weight,node}) => {
                    if( explorers.reduce( (b,e) => b || e.path.includes(node.id) || (e.current.id == node.id), false ) )
                        return
                    const ntime = time - (weight + 1)
                    const dv = Math.max(ntime,0) * node.rate
                    const nvalue = value + dv
                    bestNextValue = Math.max(bestNextValue, nvalue)
                    const nexplorers = structuredClone(explorers)
                    nexplorers[i] = {
                        current: node,
                        path: [...path, current.id],
                        time: ntime,
                    }
                    const extra = potentialExtraValue( explorers.reduce( (p,e) => ([...p,...e.path,node.id]), [] ),time)
                    //console.log({extra})
                    //const extra = nexplorers.reduce( (v,{path,time}) => v + potentialExtraValue(path,time), 0 )
                    next.push({
                        explorers: nexplorers,
                        value: nvalue,
                        extra: extra - dv,
                    })
                    
                })
            //}
            //bestValue = Math.max(bestValue, bestNextValue)
        })

        if( next.length > 0 ) {
            next.sort( (a,b) => b.value - a.value )
            console.log(next.map( n => n.explorers.map(e=> e.path.concat(e.current.id)).concat(n.value) ))
            const n0 = next.shift()
            let n = n0
            while( n && n.value == n0.value ) {
                work.push( n )
                n = next.shift()
            }
        }

    }

    return {bval,best}

    return best.explorers.map( e => e.path.concat(e.current.id) )

    /***/

}