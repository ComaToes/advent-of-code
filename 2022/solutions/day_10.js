export function part1(data) {

    const instructions = data.split(/\r?\n/).map( str => {
        const [instr, valueStr] = str.split(/\s/)
        const value = Number(valueStr)
        return {instr,value}
    })

    let x = 1
    let cycle = 0
    let nextPoll = 20
    let pollSum = 0

    instructions.forEach( ({instr,value}) => {
        if( instr == "addx" )
            cycle++
        cycle++
        if( cycle >= nextPoll ) {
            pollSum += x * nextPoll
            nextPoll += 40
        }
        if( instr == "addx" )
            x += value
    })

    return pollSum

}

function printScreen(screen) {
    return screen.map( row => row.join("") ).join("\n")
}

export function part2(data) {

    const instructions = data.split(/\r?\n/).map( str => {
        const [instr, valueStr] = str.split(/\s/)
        const value = Number(valueStr)
        return {instr,value}
    })

    let x = 0
    let cycle = 0

    const screenWidth = 40
    const screenHeight = 6
    const spriteWidth = 3

    const screen = Array(screenHeight).fill().map( () => Array(screenWidth).fill(".") )

    const plinkScreen = (cycle, x) => {
        const screenX = cycle % screenWidth
        const screenY = Math.floor(cycle / screenWidth)
        if( screenX >= x && screenX < x + spriteWidth )
            screen[screenY][screenX] = "#"
    }

    instructions.forEach( ({instr,value}) => {
        plinkScreen(cycle++, x)
        if( instr == "addx" ) {
            plinkScreen(cycle++, x)
            x += value
        }
    })

    return printScreen(screen)

}
