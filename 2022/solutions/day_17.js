const shapeBounds = [
    [
        [1,1,1,1],
        [0,0,0,0],
        [0],
        [4]
    ],
    [
        [2,3,2],
        [1,0,1],
        [1,0,1],
        [1,2,1],
    ],
    [
        [1,1,3],
        [0,0,0],
        [0,2,2],
        [2,2,2],
    ],
    [
        [4],
        [0],
        [0,0,0,0],
        [1,1,1,1],
    ],
    [
        [2,2],
        [0,0],
        [0,0],
        [2,2],
    ],
]

export function part1(data) {

    const wind = data.trim().split("").map( m => m == ">" ? 1 : -1 )

    const shapes = shapeBounds.map( ([top,bottom,left,right]) => ({
        top,
        bottom,
        left,
        right,
        width: top.length,
        height: left.length,
    }) )

    const hallWidth = 7
    const floor = Array(hallWidth).fill(0)

    const desiredRocks = 8
    let windIndex = 0

    for( let count = 0; count < desiredRocks; count++ ) {

        const shape = shapes[count % shapes.length]
        const rock = {
            ...shape,
            x: 2,
            y: Math.max(...floor) + 4,
        }

        // Apply 4 wind and -3 y

        for( let i = 0; i < 4; i++ ) {
            const dx = wind[windIndex++ % wind.length]
            rock.x = Math.min( Math.max( rock.x + dx, 0 ), hallWidth - rock.width )
            console.log( dx > 0 ? "right" : "left" )
        }
        rock.y -= 3

        console.log( {rock} )
        console.log({floor})

        // Check if bottom touching floor
        const touching = rock => rock.bottom.reduce( (b,dy,i) => b || (rock.y + dy - floor[rock.x+i] <= 1), false )

        // Check if raised floor blocks move
        const blockedRight = rock => rock.right.reduce( (b,dx,i) => b || (rock.y + i - floor[rock.x+dx] < 1 ), false )
        const blockedLeft = rock => rock.left.reduce( (b,dx,i) => b || (rock.y + i - floor[rock.x+dx] < 1 ), false )

        // Apply more wind if need to fall further
        while( !touching(rock) ) {
            const dx = wind[windIndex++ % wind.length]
            const oldX = rock.x
            // bound by walls
            const nx = Math.min( Math.max( rock.x + rock.width + dx, 0 ), hallWidth - rock.width )
            // bound by "floor"
            if( (dx > 0 && blockedRight(rock)) || (dx < 0 && blockedLeft(rock)) )
                rock.x = oldX
            rock.y--
        }

        // Raise floor
        rock.top.forEach( (dy,i) => {
            const x = rock.x + i
            floor[x] = rock.y + dy - 1
        })

        console.log()
        console.log()
        console.log()

    }

    return floor

}


export function part2(data) {

}