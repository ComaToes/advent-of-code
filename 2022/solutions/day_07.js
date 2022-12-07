function parseCommands(data) {

    return data.split(/\$/).filter( str => str ).map( raw => {
        const [cmdLine,...output] = raw.split(/\r?\n/).filter( str => str ).map( str => str.trim() )
        const [cmd,...args] = cmdLine.split(/\s+/)
        return {cmd, args, output}
    })

}

function buildFilesystem(commands) {

    const root = { children: {} }
    let current = root

    commands.forEach( ({cmd, args, output}) => {

        if( cmd == "cd" ) {

            const name = args[0]

            if( name == ".." ) {
                current = current.parent
                return
            }

            if( !current.children[name] )
                current.children[name] = {name, parent: current, children: {}}

            current = current.children[name]

        } else {
            // ls
            current.children = output.map( str => {
                const strs = str.split(/\s+/)
                if( strs[0] == "dir" )
                    return { dir: true, name: strs[1], parent: current }
                return { file: true, name: strs[1], parent: current, size: Number(strs[0]) }
            }).reduce( (children, child) => (children[child.name] = child) && children, {} )

        }

    })

    return root

}

function labelDirSizes(fs) {

    let queue = Object.values(fs.children)

    while( queue.length > 0 ) {
        const dir = queue.pop()
        const dirs = Object.values(dir.children).filter( x => x.dir )
        if( dirs.length > 0 && dirs[0].size == undefined )
            queue.push(dir, ...dirs)
        else
            dir.size = Object.values(dir.children).reduce( (total, x) => total + x.size, 0 )
    }

}

function part1(data) {

    const commands = parseCommands(data)
    const fs = buildFilesystem(commands)
    labelDirSizes(fs)

    let count = 0
    let queue = Object.values(fs.children)

    while( queue.length > 0 ) {
        const dir = queue.pop()

        if( dir.size < 100000 )
            count += dir.size

        const childDirs = Object.values(dir.children).filter( x => x.dir )
        if( childDirs.length )
            queue.push(...childDirs)
    }

    return count

}

function part2(data) {

    const commands = parseCommands(data)
    const fs = buildFilesystem(commands)
    labelDirSizes(fs)

    const capacity = 70000000
    const requiredSpace = 30000000
    const currentUsage = fs.children["/"].size
    const requiredReduction = requiredSpace - (capacity - currentUsage)

    let bestCandidate = fs.children["/"]

    let queue = Object.values(fs.children)

    while( queue.length > 0 ) {
        const dir = queue.pop()

        if( dir.size > requiredReduction && dir.size < bestCandidate.size )
            bestCandidate = dir

        const childDirs = Object.values(dir.children).filter( x => x.dir )
        if( childDirs.length )
            queue.push(...childDirs)
    }

    return bestCandidate.size

}

module.exports = { part1, part2 }