const shapeScore = {
    A: 1,
    B: 2,
    C: 3,
    X: 1,
    Y: 2,
    Z: 3,
}

const winScore = {
    X: { A: 3, B: 0, C: 6 },
    Y: { A: 6, B: 3, C: 0 },
    Z: { A: 0, B: 6, C: 3 },
}

function part1(data) {

    const moves = data.split(/\r?\n/).map( 
        line =>  line.split(/\s+/)
    )

    return moves.reduce( (score, [them, me]) => score + winScore[me][them] + shapeScore[me], 0 )

}

const tactic = {
    A: { X: "C", Y: "A", Z: "B" },
    B: { X: "A", Y: "B", Z: "C" },
    C: { X: "B", Y: "C", Z: "A" },
}

const objectiveScore = {
    X: 0,
    Y: 3,
    Z: 6,
}

function part2(data) {

    const moves = data.split(/\r?\n/).map( 
        line =>  line.split(/\s+/)
    )

    return moves.reduce( (score, [them, objective]) => score + objectiveScore[objective] + shapeScore[ tactic[them][objective] ], 0 )

}

module.exports = { part1, part2 }