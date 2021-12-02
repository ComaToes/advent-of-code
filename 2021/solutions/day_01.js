function part1(data) {

    const items = data.split(/\r?\n/).map(Number);

    let increasedCount = 0;

    for( let i = 1; i < items.length; i++ )
        if( items[i] > items[i-1] )
            increasedCount++;

    return increasedCount;

}

function part2(data) {

    const items = data.split(/\r?\n/).map(Number);

    const windowSize = 3;
    const sumWindow = i => items.slice(i,windowSize).reduce((a,v) => a+v, 0);
    const slideWindow = (i, value) => value - items[i] + items[i+windowSize];

    let increasedCount = 0;
    let windowA = sumWindow(0);
    let windowB = slideWindow(0, windowA);

    for( let i = 0; i < items.length-windowSize; i++ ) {
        if( windowB > windowA )
            increasedCount++;
        windowA = windowB;
        windowB = slideWindow(i+1, windowB);
    }

    return increasedCount;

}

module.exports = { part1, part2 }