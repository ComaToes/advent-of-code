function parseData(data) {

    const headReg = /--- scanner (?<id>\d+) ---/;
    const scanners = data.split(/(\r?\n){2}/).map( group => group.split(/\r?\n/) );
    return scanners.filter(arr => arr.length > 2).map( ([header,...beacons]) => 
            ({ 
                id: header.match(headReg).groups.id, 
                beacons: beacons.map( (line,id) => ({ id, coords: line.split(",").map(Number) }) ),
                links: [],
            }) )

}

function m3dist(a, b) {
    return a.reduce( (d,v,i) => d + (Math.abs(v) > Math.abs(b[i]) ? Math.abs(v - b[i]) : Math.abs(b[i] - v)), 0 );
}

function arrDist(a, b) {
    return a.map( (v,i) => v - b[i] );
}

function findMapping(a, b) {
    return a.map( v => {
        let index = b.indexOf(v);
        let sign = 1;
        if( index < 0 ) {
            index = b.indexOf(-v);
            if( index < 0 )
                throw new Error();
            sign = -1;
        }
        return {index, sign};
    } );
}

function fixCoords(scanners) {

    scanners = scanners.map( ({beacons, ...scanner}) => ({
        ...scanner,
        beacons: beacons.map( beacon => ({
            ...beacon,
            dists: beacons.map( other => m3dist( beacon.coords, other.coords ) )
        }) )
    }) );

    const startId = 1;
    scanners[startId].fixed = [0,0,0];
    scanners[startId].beacons.forEach( b => b.fixed = b.coords );

    const fixedScanners = [scanners[startId]];
    while( fixedScanners.length > 0 ) {
        
        const scanner = fixedScanners.shift();

        scanners.forEach( other => {

            if( other == scanner || other.fixed )
                return;

            const pairs = scanner.beacons.reduce( (pairs, beacon) => {
                const match = other.beacons.find( beecon => {
                    const distMatches = beacon.dists.filter( dist => beecon.dists.includes( dist ) );
                    return distMatches.length >= 12;
                });
                if( match )
                    return [...pairs, [beacon, match]];
                return pairs;
            }, []);

            if( pairs.length > 12 )
                throw new Error("bork bork");

            if( pairs.length == 12 ) {

                console.log( `${scanner.id}--${other.id}`);
                const [[a1,b1],[a2,b2]] = pairs;

                const mapping = findMapping( arrDist(a1.fixed, a2.fixed), arrDist(b1.coords, b2.coords) );

                other.fixed = mapping.map( ({index, sign}, i) => a1.fixed[i] - b1.coords[index] * sign );
                
                other.beacons.forEach( beacon => {
                    beacon.fixed = mapping.map( ({index, sign}, i) => other.fixed[i] + beacon.coords[index] * sign );
                });

                fixedScanners.push(other);
               
            }

        });

    }

    return scanners;

}

function part1(data) {

    let scanners = parseData(data);

    scanners = fixCoords(scanners);

    const beaconSet = {};

    scanners.forEach( ({id, fixed, beacons}) => {
        console.log(id)
        console.log(fixed)
        beacons.forEach( beacon => {
            const uid = beacon.fixed.join(",");
            beaconSet[uid] = beacon;
        });
    });

    return Object.keys(beaconSet).length;

}

function part2(data) {

    let scanners = parseData(data);

    scanners = fixCoords(scanners);

    let max = 0;
    scanners.forEach( scanner => {
        scanners.forEach( other => {
            const dist = m3dist( scanner.fixed, other.fixed );
            if( dist > max )
                max = dist;
        });
    });

    return max;

}

module.exports = { part1, part2 }