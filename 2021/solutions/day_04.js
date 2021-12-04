// Messy implementation as I was trying to score a quick submission

const CALLED = "x";

function parseData(data) {

    const [drawsStr, , ...boardLines] = data.split(/\r?\n/);
    const draws = drawsStr.split(',').map(Number);

    const boards = [];

    for( let i = 0; i < boardLines.length; i += 6 ) {
        const board = [];
        for( let j = 0; j < 5; j++ ) {
            board.push( boardLines[i+j].trim().split(/\s+/).map(Number) );
        }
        boards.push( board );
    }
    return {boards, draws};

}

function checkWin(board) {
    const rowWin = board.reduce( (win, row) => win || row.reduce( (nogap, cell) => nogap && (cell == CALLED), true ), false );
    if( rowWin )
        return rowWin;
    outer: for( let i = 0; i < board[0].length; i++ ) {
        for( let j = 0; j < board.length; j++ ) {
            if( board[j][i] != CALLED )
                continue outer;
        }
        return true;
    }
    return false;
}

function part1(data) {

    const {boards, draws} = parseData(data);

    let result;

    draws.some( draw => {

        return boards.some( (board,idx) => {

            for( let i = 0; i < board[0].length; i++ ) {
                for( let j = 0; j < board.length; j++ ) {
                    if( board[j][i] == draw )
                        board[j][i] = CALLED
                }
            }

            if( checkWin(board) ) {
                let count = 0;
                for( let i = 0; i < board[0].length; i++ ) {
                    for( let j = 0; j < board.length; j++ ) {
                        if( board[j][i] != CALLED )
                            count += board[j][i];
                    }
                }
                result = count * draw;
                return true;
            }

        });

    });

    return result;

}

function part2(data) {

    const {boards, draws} = parseData(data);

    let result;

    draws.some( draw => {

        return boards.some( (board,idx) => {

            for( let i = 0; i < board[0].length; i++ ) {
                for( let j = 0; j < board.length; j++ ) {
                    if( board[j][i] == draw )
                        board[j][i] = CALLED
                }
            }

            if( checkWin(board) ) {
                let count = 0;
                for( let i = 0; i < board[0].length; i++ ) {
                    for( let j = 0; j < board.length; j++ ) {
                        if( board[j][i] != CALLED )
                            count += board[j][i];
                    }
                }
                result = count * draw;
                delete boards[idx];
            }

        });

    });

    return result;

}

module.exports = { part1, part2 }