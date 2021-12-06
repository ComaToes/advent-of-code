function breedTheFishes(data, duration) {

    const initialFish = data.trim().split(",");

    let pop = Array(7).fill(0);

    initialFish.forEach( age => {
        pop[age]++;
    });

    let time = 7;
    let spawn = [0, 0];
    for( let i = 0; i < duration; i++ ) {
        let j = (i + time) % pop.length;
        spawn.push( pop[j] );
        pop[j] += spawn.shift();
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