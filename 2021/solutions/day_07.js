function findLeastFuel(crabs, costFn) {

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

function part1(data) {

    const crabs = data.trim().split(",").map(Number);
    return findLeastFuel( crabs, (a, b) => Math.abs(a - b) );

}

function part2(data) {

    const crabs = data.trim().split(",").map(Number);
    return findLeastFuel( crabs, (a, b) => {
        const d = Math.abs(a - b);
        return d / 2 * (1 + d);
    } );

}

module.exports = { part1, part2 }