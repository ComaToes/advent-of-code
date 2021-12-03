function part1(data) {

    let [start, buses] = data.split(/\r?\n/);

    start = Number(start);
    buses = buses.split(",").filter( id => id != "x" );

    const waitTimes = buses.map( id => id - (start % id) );

    let soonestBus = 0;
    for( let i = 1; i < waitTimes.length; i++ )
        if( waitTimes[i] < waitTimes[soonestBus] )
            soonestBus = i;

    return buses[soonestBus] * waitTimes[soonestBus];

}

// Had to look this up. Very specific knowledge required!
function part2(data) {

    let [, buses] = data.split(/\r?\n/);
    buses = buses.split(",").map( bus => bus == "x" ? 0 : Number(bus) );

    const mods = buses.map( (id,i) => id ? (id*id-i) % id : 0 );

    let iter = 0;
    let incr = 1;

    for( let i = 0; i < buses.length; i++ ) {
        if( !buses[i] )
            continue;
        while( (iter % buses[i]) != mods[i] )
            iter += incr;
        incr *= buses[i];
    }

    return iter;

}

module.exports = { part1, part2 }