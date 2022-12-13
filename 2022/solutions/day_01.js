export function part1(data) {

    const elves = data.split(/(\r?\n){2}/).map( 
        elf =>  elf.split(/\r?\n/)
                .map(Number)
                .reduce( (total, cal) => total + cal, 0 ) 
    )

    return Math.max(...elves)

}

export function part2(data) {

    const elves = data.split(/(\r?\n){2}/).map( 
        elf =>  elf.split(/\r?\n/)
                .map(Number)
                .reduce( (total, cal) => total + cal, 0 ) 
    )

    elves.sort( (a,b) => a > b ? -1 : 1 )

    return elves.slice(0, 3).reduce( (total, elf) => total + elf, 0 )

}
