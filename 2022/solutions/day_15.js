export function part1(data) {

    const sensors = data.split(/\r?\n/).map( line => {
        const groups = line.match(/Sensor at x=(?<x>-?\d+), y=(?<y>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/).groups
        return Object.entries(groups).reduce( (res,[key,value]) => {
            res[key] = Number(value)
            return res
        }, {} )
    })

    //const testY = 10
    const testY = 2000000
    let lines = []
    const beacons = new Set()

    sensors.forEach( ({x,y,bx,by}) => {
        const md = Math.abs(x-bx) + Math.abs(y-by)
        const diff = Math.abs(testY-y)
        if( diff <= md ) {
            const dx = md - diff
            const nx1 = x-dx, nx2 = x+dx
            const overlaps = lines.filter( ([x1,x2]) => (x2 >= nx1 && x2 <= nx2) || (x1 >= nx1 && x1 <= nx2) )
            if( overlaps.length > 0 ) {
                lines = lines.filter( ([x1,x2]) => !((x2 >= nx1 && x2 <= nx2) || (x1 >= nx1 && x1 <= nx2)) )
                const cx1 = Math.min( nx1, ...overlaps.map( ([x1,x2]) => x1 ) )
                const cx2 = Math.max( nx2, ...overlaps.map( ([x1,x2]) => x2 ) )
                lines.push([cx1,cx2])
            } else {
                lines.push([nx1,nx2])
            }
        }
        if( by == testY )
            beacons.add(bx)
    })

    return lines.map( ([x1,x2]) => x2 - x1 + 1 ).reduce( (count,v) => count + v, 0 ) - beacons.size

}


export function part2(data) {

    const sensors = data.split(/\r?\n/).map( line => {
        const groups = line.match(/Sensor at x=(?<x>-?\d+), y=(?<y>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/).groups
        return Object.entries(groups).reduce( (res,[key,value]) => {
            res[key] = Number(value)
            return res
        }, {} )
    })

    const minXY = 0
    //const maxXY = 20
    const maxXY = 4000000

    let allLines = {}
    const beacons = new Set()

    sensors.forEach( ({x,y,bx,by}) => {
        const md = Math.abs(x-bx) + Math.abs(y-by)
        const minY = Math.max( y - md, minXY )
        const maxY = Math.min( y + md, maxXY )
        for( let lineY = minY; lineY <= maxY; lineY++ ) {
            allLines[lineY] = allLines[lineY] || []
            const dx = md - Math.abs(lineY-y)
            const nx1 = Math.max( x-dx, minXY )
            const nx2 = Math.min( x+dx, maxXY )
            const overlaps = allLines[lineY].filter( ([x1,x2]) => (x2 >= nx1 && x2 <= nx2) || (x1 >= nx1 && x1 <= nx2) || (x1 <= nx1 && x2 >= nx2) || (x2 == nx1-1 || x1 == nx2+1 ) )
            if( overlaps.length > 0 ) {
                allLines[lineY] = allLines[lineY].filter( ([x1,x2]) => !((x2 >= nx1 && x2 <= nx2) || (x1 >= nx1 && x1 <= nx2) || (x1 <= nx1 && x2 >= nx2) || (x2 == nx1-1 || x1 == nx2+1 )) )
                const cx1 = Math.min( nx1, ...overlaps.map( ([x1,x2]) => x1 ) )
                const cx2 = Math.max( nx2, ...overlaps.map( ([x1,x2]) => x2 ) )
                allLines[lineY].push([cx1,cx2])
            } else {
                allLines[lineY].push([nx1,nx2])
            }
        }
    })

    const [y,ranges] = Object.entries(allLines).filter( ([y,line]) => line.length > 1 ).flat()
    const x = BigInt( ranges.filter(([x1,x2])=>x1==0)[0][1] + 1 )
    return x * 4000000n + BigInt(y)

}