const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n]
const aCode = "a".charCodeAt(0)

function encodeString(str) {
    return str.split('').map( ch => primes[ch.charCodeAt(0)-aCode] )
}

function findMarker(encoded, markerLength) {

    let product = 1n
    let start = 0
    let end = 0

    while( end < encoded.length ) {

        // enlarge window to right
        while( end - start < markerLength && product % encoded[end] > 0n )
            product *= encoded[end++]

        // marker found
        if( end - start == markerLength )
            break

        // shrink window from left
        while( start <= end && product % encoded[end] == 0n )
            product /= encoded[start++]

    }

    return end

}

export function part1(data) {

    const encoded = encodeString(data)

    return findMarker(encoded, 4)

}

export function part2(data) {

    const encoded = encodeString(data)

    return findMarker(encoded, 14)

}
