const arithSum = (x) => x / 2 * (x + 1);
const arithSumInv = (x) => ( Math.sqrt( 8 * x + 1 ) - 1 ) / 2;

const calcT = (v, x, sign = 1) => ( sign * Math.sqrt( 4*v*v + 4*v - 8*x + 1 ) + 2*v + 1 ) / 2;

function doTheMath(target) {

    const minVx = Math.ceil( arithSumInv( target.xmin ) );
    const maxVx = target.xmax;

    const maxVxDrop = Math.floor( arithSumInv( target.xmax ) );

    const maxVy = Math.abs( target.ymin );
    const minVy = target.ymin;

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

    const vyRanges = [];

    for( let vy = minVy; vy < maxVy; vy++ ) {

        const yTmin = Math.ceil( calcT( vy, target.ymax ) );
        const yTmax = Math.floor( calcT( vy, target.ymin ) );

        if( yTmin <= yTmax )
            vyRanges.push( [vy, yTmin, yTmax] );

    }

    let maxY = 0;
    let count = 0;

    vxRanges.forEach( ([vx, xTmin, xTmax]) => {

        vyRanges.forEach( ([vy, yTmin, yTmax]) => {

            const dTmin = Math.max( xTmin, yTmin );
            const dTmax = Math.min( xTmax, yTmax );

            if( dTmin <= dTmax ) {
                const thisMaxY = arithSum(vy);
                maxY = Math.max(thisMaxY, maxY);
                count++;
            }

        } );

    } )

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