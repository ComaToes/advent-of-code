function part1(data) {

    const monkeys = data.split(/\r?\n\r?\n/).map( str => {
        const [monkeyId,itemsStr,opStr,testStr,trueStr,falseStr] = str.split(/\r?\n/)
        const items = itemsStr.match(/Starting items: (.*)/  )[1].split(", ").map(Number)
        const op = {...opStr.match(/Operation: new = (?<left>\S+)\s(?<op>.)\s(?<right>\S+)/ ).groups}
        const test = Number( testStr.match(/Test: divisible by (.*)/  )[1] )
        const pass = Number( trueStr.match(/If true: throw to monkey (.*)/  )[1] )
        const fail = Number( falseStr.match(/If false: throw to monkey (.*)/  )[1] )
        return {items, op, test, pass, fail, inspections: 0}
    })

    const rounds = 20

    for (let i = 0; i < rounds; i++) {
        monkeys.forEach( monkey => {

            const {left,op,right} = monkey.op

            monkey.items.forEach( worry => {
                
                const a = left == "old" ? worry : Number(left)
                const b = right == "old" ? worry : Number(right)
                
                if(op == "+")
                    worry = a + b
                else
                    worry = a * b

                worry = Math.floor( worry / 3 )

                if( worry % monkey.test == 0 )
                    monkeys[ monkey.pass ].items.push( worry )
                else
                    monkeys[ monkey.fail ].items.push( worry )

                monkey.inspections++

            })

            monkey.items = []

        })
    }

    return monkeys.sort( (a,b) => b.inspections - a.inspections ).slice(0,2).reduce( (x,m) => x * m.inspections, 1 )


}

function part2(data) {

    const monkeys = data.split(/\r?\n\r?\n/).map( str => {
        const [monkeyId,itemsStr,opStr,testStr,trueStr,falseStr] = str.split(/\r?\n/)
        const items = itemsStr.match(/Starting items: (.*)/  )[1].split(", ").map(Number)
        const op = {...opStr.match(/Operation: new = (?<left>\S+)\s(?<op>.)\s(?<right>\S+)/ ).groups}
        const test = Number( testStr.match(/Test: divisible by (.*)/  )[1] )
        const pass = Number( trueStr.match(/If true: throw to monkey (.*)/  )[1] )
        const fail = Number( falseStr.match(/If false: throw to monkey (.*)/  )[1] )
        return {items, op, test, pass, fail, inspections: 0}
    })

    const divisors = monkeys.map( ({test}) => test )

    monkeys.forEach( monkey => {
        monkey.items = monkey.items.map( value => {
            return divisors.reduce( (mods,divisor) => {
                mods[divisor] = value % divisor
                return mods
            }, {})
        })
    } )

    const rounds = 10000

    for (let i = 0; i < rounds; i++) {
        monkeys.forEach( monkey => {

            const {op,right} = monkey.op

            monkey.items.forEach( item => {

                item = divisors.reduce( (mods,divisor) => {
                    const value = right == "old" ? item[divisor] : (Number(right) % divisor)
                    if( op == "+" )
                        mods[divisor] = (item[divisor] + value) % divisor
                    else
                        mods[divisor] = (item[divisor] * value) % divisor
                    return mods
                }, {})

                if( item[monkey.test] == 0 )
                    monkeys[ monkey.pass ].items.push( item )
                else
                    monkeys[ monkey.fail ].items.push( item )

                monkey.inspections++

            })

            monkey.items = []

        })
    }

    return monkeys.map(({inspections}) => inspections).sort( (a,b) => b - a ).slice(0,2).reduce( (x,a) => x * a, 1 )

}

module.exports = { part1, part2 }