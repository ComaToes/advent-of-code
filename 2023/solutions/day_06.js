export function part1(data) {

    const [times,distances] = data.split(/\r?\n/).map( line => {
        const [,...nums] = line.split(/\s+/)
        return nums
    })

    const counts = times.map( (t,i) => {
        let count = 0
        for(let s = 0; s < t; s++) {
            const d = (t-s)*s
            if( d > distances[i] )
                count++
        }
        return count
    })

    return counts.reduce( (sum,c) => sum * c, 1 )

}

export function part2(data) {

    const [t,d] =  data.split(/\r?\n/).map( line => line.split(/:\s+/)[1].replaceAll(/\s/g,"") ).map(Number)

    const sqrtDisc = Math.sqrt( t*t - 4*d )
    const a = Math.ceil( (t + sqrtDisc) / 2 )
    const b = Math.ceil( (t - sqrtDisc) / 2 )

    return a - b

}
