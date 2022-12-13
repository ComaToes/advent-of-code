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

    const queue = Object.values(fs.children)
    const dirs = []

    while( queue.length > 0 ) {
        const dir = queue.pop()
        const childDirs = Object.values(dir.children).filter( x => x.dir )
        if( childDirs.length > 0 && childDirs[0].size == undefined )
            queue.push(dir, ...childDirs)
        else {
            dir.size = Object.values(dir.children).reduce( (total, x) => total + x.size, 0 )
            dirs.push(dir)
        }
    }

    return dirs

}

export function part1(data) {

    const commands = parseCommands(data)
    const fs = buildFilesystem(commands)
    const dirs = labelDirSizes(fs)

    let count = 0
    
    dirs.forEach( dir => {
        if( dir.size < 100000 )
            count += dir.size
    })

    return count

}

export function part2(data) {

    const commands = parseCommands(data)
    const fs = buildFilesystem(commands)
    const dirs = labelDirSizes(fs)

    const capacity = 70000000
    const requiredSpace = 30000000
    const currentUsage = fs.children["/"].size
    const requiredReduction = requiredSpace - (capacity - currentUsage)

    let bestCandidate = fs.children["/"]
    
    dirs.forEach( dir => {
        if( dir.size > requiredReduction && dir.size < bestCandidate.size )
            bestCandidate = dir
    })

    return bestCandidate.size

}
