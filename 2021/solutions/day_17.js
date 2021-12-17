const arithSum = (x) => x / 2 * (x + 1);

const calcT = (v, x, sign = 1) => ( sign * Math.sqrt( 4*v*v + 4*v - 8*x + 1 ) + 2*v + 1 ) / 2;

function doTheMath(target) {

    let minVx = 1;
    while( arithSum(minVx) < target.xmin )
        minVx++;
    const maxVx = target.xmax;

    let maxVxDrop = minVx;
    while( arithSum(maxVxDrop) < target.xmax )
        maxVxDrop++;

    const maxVy = Math.abs( target.ymin );
    const minVy = target.ymin;

    let maxY = 0;
    let count = 0;

    for( let vx = minVx; vx <= maxVx; vx++ ) {

        const xTmin = Math.ceil( calcT( vx, target.xmin, -1 ) );
        let xTmax;
        if( vx < maxVxDrop )
            xTmax = Infinity;
        else
            xTmax = Math.floor( calcT( vx, target.xmax, -1 ) );

        for( let vy = minVy; vy < maxVy; vy++ ) {

            const yTmin = Math.ceil( calcT( vy, target.ymax ) );
            const yTmax = Math.floor( calcT( vy, target.ymin ) );

            const dTmin = Math.max( xTmin, yTmin );
            const dTmax = Math.min( xTmax, yTmax );

            if( dTmin <= dTmax ) {
                const thisMaxY = arithSum(vy);
                maxY = Math.max(thisMaxY, maxY);
                count++;
            }

        }

    }

    return { maxY, count };

}

function parseTarget(data) {

    const target = {...data.match( /target area: x=(?<xmin>-?\d+)..(?<xmax>-?\d+), y=(?<ymin>-?\d+)..(?<ymax>-?\d+)/ ).groups};
    Object.keys(target).forEach( key => target[key] = Number(target[key]) );
    return target;

}

function part1(data) {

    const target = parseTarget(data);

    const {maxY} = doTheMath( target );

    return maxY;

}

function part2(data) {

    const target = parseTarget(data);

    const {count} = doTheMath( target );

    return count;

}

module.exports = { part1, part2 }