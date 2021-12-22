const reg = /(?<on>on|off) x=(?<xmin>-?\d+)..(?<xmax>-?\d+),y=(?<ymin>-?\d+)..(?<ymax>-?\d+),z=(?<zmin>-?\d+)..(?<zmax>-?\d+)/;

function parseCuboids(data) {
    return data.split(/\r?\n/).map( line => line.match(reg).groups ).map( ({on,xmin,xmax,ymin,ymax,zmin,zmax}) => ({
        on: on == "on" ? 1 : 0,
        xmin: BigInt(xmin),
        xmax: BigInt(xmax)+1n,
        ymin: BigInt(ymin),
        ymax: BigInt(ymax)+1n,
        zmin: BigInt(zmin),
        zmax: BigInt(zmax)+1n,
    }));
}

// Super naive impl
function part1(data) {

    const items = parseCuboids(data);

    const grid = Array(101);
    for( let z = 0; z < 101; z++ ) {
        grid[z] = Array(101);
        for( let y = 0; y < 101; y++ )
            grid[z][y] = Array(101).fill(0);
    }

    items.forEach( ({on,xmin,xmax,ymin,ymax,zmin,zmax}) => {
        if( xmin < -50 || xmin > 50 )
            return;
        for( let z = Number(zmin); z < Number(zmax); z++ )
            for( let y = Number(ymin); y < Number(ymax); y++ )
                for( let x = Number(xmin); x < Number(xmax); x++ )
                    grid[z+50][y+50][x+50] = on;
    } );

    let count = 0;
    for( let z = 0; z < grid.length; z++ )
        for( let y = 0; y < grid[z].length; y++ )
            for( let x = 0; x < grid[z][y].length; x++ )
                if( grid[z][y][x] )
                    count++;


    return count;

}

const dimKeys = ["x","y","z"].map( dim => [`${dim}min`, `${dim}max`] );

function intersectCuboids(c, d) {

    return dimKeys.reduce( (cuboid, [minKey, maxKey]) => {
        if( cuboid === false )
            return false;
        const max = c[maxKey] < d[maxKey] ? c[maxKey] : d[maxKey];
        const min = c[minKey] > d[minKey] ? c[minKey] : d[minKey];
        if( min >= max )
            return false;
        cuboid[minKey] = min;
        cuboid[maxKey] = max;
        return cuboid;
    }, {} );

}

function cuboidVolume(c) {
    return dimKeys.reduce( (v, [minKey, maxKey]) => v * (c[maxKey] - c[minKey]), 1n );
}

// Not quite under a second but it'll do
function part2(data) {

    const items = parseCuboids(data);

    let universe = [items.shift()];

    while( items.length > 0 ) {
        const newboid = items.shift();
        universe.forEach( cuboid => {
            const intersection = intersectCuboids(cuboid, newboid);
            if( !intersection )
                return;
            intersection.on = !cuboid.on ? 1 : 0;
            universe.push(intersection);
        });
        if( newboid.on )
            universe.push(newboid);
    }

    return universe.reduce( (count, cuboid) => count + (cuboid.on ? 1n : -1n) * cuboidVolume(cuboid), 0n );

}

module.exports = { part1, part2 }