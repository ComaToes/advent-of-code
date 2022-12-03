const upperPriority = [...Array(26).keys()].reduce( (p,i) => (p[String.fromCharCode(65+i)] = i+27) && p, {} )
const priority = [...Array(26).keys()].reduce( (p,i) => (p[String.fromCharCode(97+i)] = i+1) && p, upperPriority )

function part1(data) {

    const packs = data.split(/\r?\n/).map( 
        line => [line.slice(0, line.length/2).split("").sort(), line.slice(line.length/2).split("").sort()]
    )

    const matches = packs.map( ([first, second]) => {
        for (let i = 0; i < first.length; i++) {
            let j = 0;
            const ch = first[i]
            do {
                if( ch == second[j] )
                    return ch
                j++
            } while( j < second.length )
        }
    })

    return matches.reduce( (score, ch) => score + priority[ch], 0 )

}


function part2(data) {

    const packs = data.split(/\r?\n/)

    const groups = []
    while( packs.length > 0 )
        groups.push( packs.splice(0, 3).map( a => a.split("").sort() ) )

    const scores = groups.map( ([a,b,c]) => {
        for (let i = 0; i < a.length; i++) {
            let j = 0
            const ch = a[i]
            do {
                if( ch == b[j] ) {
                    let k = 0
                    do {
                        if( ch == c[k] )
                            return ch
                        k++
                    } while( k < c.length )
                }
                j++
            } while( j < b.length )
        }
    } ).map( ch => priority[ch] )

    return scores.reduce( (c, s) => c + s, 0 )

}

module.exports = { part1, part2 }