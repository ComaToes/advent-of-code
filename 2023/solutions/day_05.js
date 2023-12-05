export function part1(data) {

    const sectionLines = data.split(/\r?\n\r?\n/)

    const seedsLine = sectionLines.shift()
    const seeds = seedsLine.split(": ")[1].split(" ").map(Number)

    const sections = sectionLines.map( sec => {
        const [nameLine,...mappingLines] = sec.split(/\r?\n/)
        return mappingLines.map( line => {
            const [dest,src,length] = line.split(" ").map(Number)
            return {dest,src,length}
        } )
    } )

    const locs = seeds.map( seed => {
        sections.forEach( maps => {
            let done = false
            maps.forEach( ({src,dest,length}) => {
                if( !done && seed >= src && seed < src + length ) {
                    seed = dest + (seed - src)
                    done = true
                }
            } )
        } )
        return seed
    })

    return locs.reduce( (min,x) => x < min ? x : min, Number.MAX_SAFE_INTEGER )
}

export function part2(data) {

    const sectionLines = data.split(/\r?\n\r?\n/)

    const seedsLine = sectionLines.shift()
    const seeds = seedsLine.split(": ")[1].split(" ").map(Number)

    const sections = sectionLines.map( sec => {
        const [nameLine,...mappingLines] = sec.split(/\r?\n/)
        return mappingLines.map( line => {
            const [dest,src,length] = line.split(" ").map(Number)
            return {dest,src,length}
        } )
    } )

    let ranges = []
    for(let i = 0; i < seeds.length - 1; i += 2 )
        ranges.push( [seeds[i], seeds[i] + seeds[i+1]] )

    sections.forEach( maps => {
        
        ranges = ranges.map( (range) => {

            let srcRanges = [range]
            const destRanges = []

            maps.forEach( ({src,dest,length}) => {
                const newSrcRanges = []
                srcRanges.forEach( ([start,end]) => {
                    if( start >= src ) {
                        if( end <= src + length ) {
                            const newStart = dest + start - src
                            destRanges.push( [newStart, newStart + end - start] )
                        } else if( start < src + length ) {
                            destRanges.push( [dest + start - src, dest + length] )
                            newSrcRanges.push( [src + length, end] )
                        } else
                            newSrcRanges.push( [start, end] )
                    } else if( end > src && end <= src + length ) {
                        newSrcRanges.push( [start, src] )
                        destRanges.push( [dest, dest + end - src] )
                    } else if( end > src + length ) {
                        newSrcRanges.push( [start, src] )
                        destRanges.push( [dest, dest + length] )
                        newSrcRanges.push( [src + length, end] )
                    } else
                        newSrcRanges.push( [start, end] )
                } )
                srcRanges = newSrcRanges
            } )

            return srcRanges.concat(destRanges)

        } ).flat(1)

    } )

    return ranges.reduce( (min,[start,]) => Math.min(min, start), Number.MAX_SAFE_INTEGER)

}
