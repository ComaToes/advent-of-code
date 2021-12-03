function part1(data) {

    const lines = data.split(/\r?\n/);
    const bitWidth = lines[0].length;
    const readings = lines.map( x => parseInt(x,2) );

    const bitCounts = readings.reduce( (bitCounts, reading) => {

        let mask = 1;
        for( let i = 0; i < bitWidth; i++ ) {
            if( (reading & mask) > 0 )
                bitCounts[i]++;
            mask <<= 1;
        }
        return bitCounts;

    }, Array(bitWidth).fill(0) );

    const gammaBits = bitCounts.map( count => (count > readings.length / 2) ? 1 : 0 );

    const gamma = gammaBits.reduce( (gamma, bit, i) => gamma | (bit << i), 0 );

    const epsilon = ~gamma & (1 << bitWidth)-1;

    return gamma * epsilon;

}

function countSetBits(readings, i) {
    const mask = 1 << i;
    return readings.reduce( (count, reading) => count + ( (reading & mask) > 0 ? 1 : 0 ), 0 );
}

function findRating(candidates, bitWidth, popularityFn) {

    for( let i = bitWidth-1; i >= 0; i-- ) {

        const setBits = countSetBits(candidates, i);
        const popularBit = popularityFn( setBits, candidates.length );

        const mask = 1 << i;
        candidates = candidates.filter( reading => ( (reading & mask) > 0 ? 1 : 0 ) == popularBit );

        if( candidates.length < 2 )
            break;

    }

    if( candidates.length != 1 )
        throw new Error("Unable to find unique candidate");

    return candidates[0];

}

function part2(data) {

    const lines = data.split(/\r?\n/);
    const bitWidth = lines[0].length;
    const readings = lines.map( x => parseInt(x,2) );

    const oxygenPopularityFn = (setBits, candidateCount) => setBits >= candidateCount / 2 ? 1 : 0;
    const scrubberPopularityFn = (setBits, candidateCount) => setBits < candidateCount / 2 ? 1 : 0;

    const oxygenRating = findRating( readings, bitWidth, oxygenPopularityFn );
    const scrubberRating = findRating( readings, bitWidth, scrubberPopularityFn );

    return oxygenRating * scrubberRating;

}

module.exports = { part1, part2 }