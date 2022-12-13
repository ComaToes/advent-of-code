export function part1(data) {

    const pairs = data.split(/\r?\n/).map( 
        line => line.split(",").map( range => range.split("-").map(Number) )
    )

    const contains = (a,b) => a[0] >= b[0] && a[0] <= b[1] && a[1] >= b[0] && a[1] <= b[1]

    const contained = pairs.filter( ([a,b]) => contains(a,b) || contains(b,a) )

    return contained.length

}

export function part2(data) {

    const pairs = data.split(/\r?\n/).map( 
        line => line.split(",").map( range => range.split("-").map(Number) )
    )

    const overlaps = (a,b) => a[0] >= b[0] && a[0] <= b[1] && a[1] >= b[0]

    const overlapped = pairs.filter( ([a,b]) => overlaps(a,b) || overlaps(b,a) )

    return overlapped.length

}
