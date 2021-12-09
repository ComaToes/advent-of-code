function breedTheFishes(data, duration) {

    const initialFish = data.trim().split(",");

    const pop = Array(7).fill(0);

    initialFish.forEach( age => {
        pop[age]++;
    });

    const spawn = [0, 0];
    for( let time = 0; time < duration; time++ ) {
        const i = time % pop.length;
        const j = time % spawn.length;
        const matured = spawn[j];
        spawn[j] = pop[i];
        pop[i] += matured;
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