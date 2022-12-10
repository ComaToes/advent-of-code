function parseMoves(data) {
    return data.split(/\r?\n/).map(
        str => {
            const [direction, distance] = str.split(/\s/)
            return {direction, distance}
        }
    )
}

const directionVectors = {
    "R": [1,0],
    "L": [-1,0],
    "U": [0,1],
    "D": [0,-1],
}

function applyVector(obj, vector) {
    obj.forEach( (v,i) => obj[i] += vector[i] )
}

function moveRope(knotCount, moves) {

    const tailVisited = { "0,0": true }
    const knots = Array(knotCount).fill().map( () => [0,0] )

    moves.forEach( ({direction, distance}) => {

        for (let i = 0; i < distance; i++) {

            applyVector( knots[0], directionVectors[direction] )

            for( let j = 1; j < knots.length; j++ ) {

                const knot = knots[j]
                const previous = knots[j-1]

                const dx = previous[0] - knot[0]
                const dy = previous[1] - knot[1]

                if( Math.abs(dx) > 1 || Math.abs(dy) > 1 ) {

                    const vector = [
                        dx > 0 ? 1 : dx < 0 ? -1 : 0,
                        dy > 0 ? 1 : dy < 0 ? -1 : 0
                    ]

                    applyVector( knot, vector )

                }

            }

            tailVisited[ knots[knots.length-1].join(",") ] = true

        }

    })

    return tailVisited

}

function part1(data) {

    const moves = parseMoves(data)

    const tailVisited = moveRope(2, moves)

    return Object.keys( tailVisited ).length

}

function part2(data) {

    const moves = parseMoves(data)

    const tailVisited = moveRope(10, moves)

    return Object.keys( tailVisited ).length


}

module.exports = { part1, part2 }