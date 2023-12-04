export function part1(data) {

    const comparator = (a,b) => a < b ? -1 : 1

    const cards = data.split(/\r?\n/).map( line => {
        const [cardStr,numberStr] = line.split(/:\s+/)
        const [wins,nums] = numberStr.split(" | ").map( str => str.split(/\s+/).map(Number).sort(comparator) )
        return {wins,nums}
    })

    return cards.reduce( (total,{wins,nums}) => {
        let matches = 0
        let j = 0
        for(let i = 0; i < wins.length; i++) {
            while( j < nums.length && nums[j] < wins[i] )
                j++
            if( wins[i] == nums[j] )
                matches++
        }
        return total + (matches ? Math.pow(2,matches-1) : 0)
    }, 0 )

}

export function part2(data) {

    const comparator = (a,b) => a < b ? -1 : 1

    const cards = data.split(/\r?\n/).map( line => {
        const [cardStr,numberStr] = line.split(/:\s+/)
        const [wins,nums] = numberStr.split(" | ").map( str => str.split(/\s+/).map(Number).sort(comparator) )
        return {wins,nums,count:1}
    })

    return cards.reduce( (total,{wins,nums,count},cardId) => {
        let matches = 0
        let j = 0
        for(let i = 0; i < wins.length; i++) {
            while( j < nums.length && nums[j] < wins[i] )
                j++
            if( wins[i] == nums[j] )
                matches++
        }
        for(let i = 1; i <= matches; i++)
            cards[cardId+i].count += count
        return total + count
    }, 0 )

}
