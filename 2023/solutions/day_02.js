export function part1(data) {

    const games = data.split(/\r?\n/).map( line => {
        const [gameStr,listStr] = line.split(": ")
        const [,id] = gameStr.split(" ")
        const sets = listStr.split("; ").map( set => set.split(", ").map( x => x.split(" ") ).reduce( (set,[count,color]) => (set[color] = +count) && set, {} ) )

        return {id,sets}
    })

    const limits = {
        red: 12,
        green: 13,
        blue: 14
    }

    const validGames = games.filter( ({id,sets}) =>
        sets.reduce( (valid,set) => valid && Object.keys(limits).reduce( 
            (setValid,key) => setValid && (!set[key] || set[key] <= limits[key]), true 
        ), true )
    )

    return validGames.reduce( (sum,{id}) => sum + +id, 0 )

}

export function part2(data) {

    const games = data.split(/\r?\n/).map( line => {
        const [gameStr,listStr] = line.split(": ")
        const [,id] = gameStr.split(" ")
        const sets = listStr.split("; ").map( set => set.split(", ").map( x => x.split(" ") ).reduce( (set,[count,color]) => (set[color] = +count) && set, {} ) )

        return {id,sets}
    })

    const colors = ["red","blue","green"]

    const gameMins = games.map( ({sets}) => 
        sets.reduce( (max,set) => 
            colors.map( color => max[color] = Math.max(max[color], set[color] || 0) ) && max, 
            {red: 0, green: 0, blue: 0} 
        )
    )

    return gameMins.reduce( (total, game) => 
        total + colors.reduce( (x, color) => x * game[color], 1 ), 
        0
    )

}
