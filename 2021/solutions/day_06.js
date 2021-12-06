function breedTheFishes(data, duration) {

    const initialFish = data.trim().split(",");

    let pop = Array(7).fill(0);

    initialFish.forEach( age => {
        pop[age]++;
    });

    let spawn = [0, 0];
    for( let time = 0; time < duration; time++ ) {
        let i = time % pop.length;
        spawn.push( pop[i] );
        pop[i] += spawn.shift();
    }

    return pop.concat(spawn).reduce( (count, p) => count + p, 0 );

}

function part1(data) {

    return breedTheFishes(data, 80);

}

function part2(data) {

    return breedTheFishes(data, 256);

}

module.exports = { part1, part2 }