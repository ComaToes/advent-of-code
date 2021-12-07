function findLeastFuelNaive(crabs, costFn) {

    const [min, max] = crabs.reduce( 
        ([min, max], crab) => [Math.min(min, crab), Math.max(max, crab)], 
        [Number.MAX_SAFE_INTEGER, 0] );

    let leastFuel = Number.MAX_SAFE_INTEGER;
    for( let position = min; position <= max; position++ ) {
        const fuel = crabs.reduce( (fuel, crab) => fuel + costFn(crab, position), 0 );
        if( fuel > leastFuel )
            break;
        leastFuel = fuel;
    }

    return leastFuel;

}

function findLeastFuelBinary(crabs, costFn) {

    const [min, max] = crabs.reduce( 
        ([min, max], crab) => [Math.min(min, crab), Math.max(max, crab)], 
        [Number.MAX_SAFE_INTEGER, 0] );

    let bmin = min, bmax = max;

    let leastFuel = 0;
    while( bmin != bmax ) {
        const mid = Math.floor( (bmin + bmax) / 2 );
        const fuelA = crabs.reduce( (fuel, crab) => fuel + costFn(crab, mid), 0 );
        const fuelB = crabs.reduce( (fuel, crab) => fuel + costFn(crab, mid+1), 0 );
        if( fuelA < fuelB ) {
            bmax = mid;
            leastFuel = fuelA;
        } else {
            bmin = mid + 1;
            leastFuel = fuelB;
        }
    }

    return leastFuel;

}

function part1(data) {

    const crabs = data.trim().split(",").map(Number);

    crabs.sort( (a, b) => a - b );

    const median = crabs[ Math.floor(crabs.length / 2) ];

    return crabs.reduce( (fuel, crab) => fuel + Math.abs(crab - median), 0 );

}

function part2(data) {

    const crabs = data.trim().split(",").map(Number);
    return findLeastFuelBinary( crabs, (a, b) => {
        const d = Math.abs(a - b);
        return d / 2 * (1 + d);
    } );

}

module.exports = { part1, part2 }