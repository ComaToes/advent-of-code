const reg = /Player \d starting position: (?<start>\d)/;
function parsePositions(data) {
    return data.split(/\r?\n/).map( line => line.match(reg).groups.start ).map(Number).map( n => n-1 );
}

function part1(data) {

    const positions = parsePositions(data);

    let nextPlayer = 0;
    let nextMidRoll = 2;
    let rollCount = 0;
    const numPositions = 10;
    const scores = Array(positions.length).fill(0);
    while( scores.filter( s => s >= 1000 ).length < 1 ) {
        const roll = nextMidRoll * 3;

        const nextPosition = (positions[nextPlayer] + roll) % numPositions;
        positions[nextPlayer] = nextPosition;
        scores[nextPlayer] += nextPosition + 1;

        nextMidRoll += 3;
        nextPlayer++;
        nextPlayer %= positions.length;
        rollCount++;
    }

    return Math.min( ...scores ) * rollCount * 3;

}

const diracRolls = {
    3: 1,
    4: 3,
    5: 6,
    6: 7,
    7: 6,
    8: 3,
    9: 1
}

function round(currentPosition, currentScore, currentOccurances, currentRolls) {

    return Object.entries(diracRolls).reduce( (scores, [roll, occurances]) => {
        const position = (currentPosition + Number(roll)) % 10;
        const score = currentScore + position + 1;
        const rolls = currentRolls + 3;
        occurances *= currentOccurances;
        scores[score] = scores[score] || [];
        scores[score].push( {position, occurances, rolls} );
        return scores;
    }, {});

}

function getScores(scores, gameCount, winCounts, winScore) {

    let nextGameCount = 0;
    const nextScores = Object.entries(scores).reduce( (scores, [score, posOcc]) => {

        score = Number(score);
        posOcc.forEach( ({position, occurances, rolls}) => {
            const roundScores = round(position, score, occurances, rolls);
            Object.entries(roundScores).forEach( ([score, posOcc]) => {
                score = Number(score);
                if( score >= winScore ) {
                    posOcc.forEach( ({position, occurances, rolls}) => {
                        winCounts[rolls] = winCounts[rolls] || 0;
                        winCounts[rolls] += occurances * gameCount;
                    });
                } else {
                    scores[score] = posOcc.concat( scores[score] || [] );
                    posOcc.forEach( ({position, occurances, rolls}) => {
                        nextGameCount += occurances;
                    });
                }
            });
        });
        return scores;

    }, {} );

    return [nextScores, nextGameCount];

}

function rollSomeDices(winScore, initialPositions) {

    const playerWins = initialPositions.map( () => ({}) );
    const scores = initialPositions.map( (position) => ({
        0: [ {position, occurances: 1, rolls: 0} ]
    }));
    const nextGames = [1, ...Array(initialPositions.length-1).fill(0)];

    do {

        for( let i = 0; i < scores.length; i++ )
            [scores[i], nextGames[(i+1)%nextGames.length]] = getScores(scores[i], nextGames[i], playerWins[i], winScore);

    } while( nextGames.reduce( (count,c) => count + c, 0 ) > 0 );

    return playerWins;

}

function part2(data) {

    const winScore = 21;
    const initialPositions = parsePositions(data);

    const results = rollSomeDices(winScore, initialPositions);

    const winCounts = results.map( res => Object.entries(res).reduce( (wins, [score, count]) => {
        return wins + BigInt( count );
    }, 0n) );

    winCounts.sort( (a,b) => a < b ? 1 : a > b ? -1 : 0 );

    return winCounts[0];

}

module.exports = { part1, part2 }