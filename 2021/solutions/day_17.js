// Sum of the first x values in an arithmetic sequence starting at 1 with an increment of 1
const arithSum = (x) => x / 2 * (x + 1);
// Inverse of above
const arithSumInv = (x) => ( Math.sqrt( 8 * x + 1 ) - 1 ) / 2;
// Calculate the time at which a projectile with initial (1d) velocity v passes distance x
// This is intersecting a line and parabola, so the sign allows us to choose which intersection point to use
const calcT = (v, x, sign = 1) => ( sign * Math.sqrt( 4*v*v + 4*v - 8*x + 1 ) + 2*v + 1 ) / 2;

/*
    General approach is to find the time windows (Tmin - Tmax) that any valid vx or vy
    will be within the target x or y range. Then intersect these to find the vx,vy combinations
    that hit the target box.
*/
function doTheMath(target) {

    // Inverse function lets us find the min initial vx that doesn't fall off before the target
    const minVx = Math.ceil( arithSumInv( target.xmin ) );
    const maxVx = target.xmax;

    // minVx <= vx <= maxVxDrop will fall to infinity within the target x range
    const maxVxDrop = Math.floor( arithSumInv( target.xmax ) );

    // These were reverse-engineered from the output when trialling with a wide vy range
    // There's probably a reason for them to have these values
    const maxVy = Math.abs( target.ymin );
    const minVy = target.ymin;

    // Find time windows for all vx that have an integer result in the target x range
    const vxRanges = [];

    for( let vx = minVx; vx <= maxVx; vx++ ) {

        const xTmin = Math.ceil( calcT( vx, target.xmin, -1 ) );
        let xTmax;
        if( vx <= maxVxDrop )
            xTmax = Infinity;
        else
            xTmax = Math.floor( calcT( vx, target.xmax, -1 ) );

        if( xTmin <= xTmax )
            vxRanges.push( [vx, xTmin, xTmax] );

    }

    // Find time windows for all vy that have an integer result in the target y range
    const vyRanges = [];

    for( let vy = minVy; vy <= maxVy; vy++ ) {

        const yTmin = Math.ceil( calcT( vy, target.ymax ) );
        const yTmax = Math.floor( calcT( vy, target.ymin ) );

        if( yTmin <= yTmax )
            vyRanges.push( [vy, yTmin, yTmax] );

    }

    // Intersect vx and vy ranges to find valid vx,vy solutions
    let maxValidVy = 0;
    let count = 0;

    vxRanges.forEach( ([vx, xTmin, xTmax]) => {

        vyRanges.forEach( ([vy, yTmin, yTmax]) => {

            const dTmin = Math.max( xTmin, yTmin );
            const dTmax = Math.min( xTmax, yTmax );

            if( dTmin <= dTmax ) {
                maxValidVy = Math.max( maxValidVy, vy );
                count++;
            }

        } );

    } );

    const maxY = arithSum( maxValidVy );

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