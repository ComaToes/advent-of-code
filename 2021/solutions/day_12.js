function parseCaves(data) {

    const caves = {};

    const links = data.split(/\r?\n/).map( line => line.split("-") );

    const linkCaves = (name, target) => {

        if( caves[name] )
            caves[name].neighbors.push(target);
        else
            caves[name] = {
                name,
                multipass: name.match(/^[A-Z]+$/) != null,
                neighbors: [target],
            }
        
    }

    links.forEach( ([a, b]) => {

        linkCaves(a, b);
        linkCaves(b, a);

    } );

    return caves;

}

function part1(data) {

    const caves = parseCaves(data);

    const paths = [ [caves["start"]] ];
    let pathCount = 0;

    while( paths.length > 0 ) {

        const path = paths.pop();

        const cave = path[path.length - 1];

        if( cave.name == "end" ) {
            pathCount++;
            continue;
        }

        const nextCaves = cave.neighbors.map( name => caves[name] ).filter( cave => cave.multipass || !path.includes(cave) );

        nextCaves.forEach( cave => {
            paths.push( [...path, cave] );
        } );

    }

    return pathCount;

}

function part2(data) {

    const caves = parseCaves(data);

    const paths = [ [caves["start"]] ];
    let pathCount = 0;

    while( paths.length > 0 ) {

        const path = paths.pop();

        const cave = path[path.length - 1];

        if( cave.name == "end" ) {
            pathCount++;
            continue;
        }

        const hasDoubleSmallVisit = path.reduce( (doubleVisit, cave) => doubleVisit || !cave.multipass && path.filter(c=>c==cave).length > 1, false );

        const nextCaves = cave.neighbors.map( name => caves[name] ).filter( cave => cave.name != "start" && (cave.multipass || !hasDoubleSmallVisit || !path.includes(cave)) );

        nextCaves.forEach( cave => {
            paths.push( [...path, cave] );
        } );

    }

    return pathCount;

}

module.exports = { part1, part2 }