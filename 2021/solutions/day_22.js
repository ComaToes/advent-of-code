const reg = /(?<on>on|off) x=(?<xmin>-?\d+)..(?<xmax>-?\d+),y=(?<ymin>-?\d+)..(?<ymax>-?\d+),z=(?<zmin>-?\d+)..(?<zmax>-?\d+)/;

// Super naive impl
function part1(data) {

    const items = data.split(/\r?\n/).map( line => line.match(reg).groups ).map( ({on,xmin,xmax,ymin,ymax,zmin,zmax}) => ({
        on: on == "on" ? 1 : 0,
        xmin: Number(xmin),
        xmax: Number(xmax),
        ymin: Number(ymin),
        ymax: Number(ymax),
        zmin: Number(zmin),
        zmax: Number(zmax),
    }));

    const grid = Array(101);
    for( let z = 0; z < 101; z++ ) {
        grid[z] = Array(101);
        for( let y = 0; y < 101; y++ )
            grid[z][y] = Array(101).fill(0);
    }

    items.forEach( ({on,xmin,xmax,ymin,ymax,zmin,zmax}) => {
        if( xmin < -50 || xmin > 50 )
            return;
        for( let z = zmin; z <= zmax; z++ )
            for( let y = ymin; y <= ymax; y++ )
                for( let x = xmin; x <= xmax; x++ )
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

// Do it more better
function part2(data) {


}

module.exports = { part1, part2 }