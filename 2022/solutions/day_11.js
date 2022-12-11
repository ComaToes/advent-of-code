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
                        .map( initialValue => ({initialValue, ops: []}))
        const op = {...opStr.match(/Operation: new = (?<left>\S+)\s(?<op>.)\s(?<right>\S+)/ ).groups}
        const test = Number( testStr.match(/Test: divisible by (.*)/  )[1] )
        const pass = Number( trueStr.match(/If true: throw to monkey (.*)/  )[1] )
        const fail = Number( falseStr.match(/If false: throw to monkey (.*)/  )[1] )
        return {items, op, test, pass, fail, inspections: 0}
    })

    const divisors = monkeys.map( ({test}) => test )
    const mods = monkeys.map( monkey => {
        const values = monkey.items.map( ({initialValue}) => initialValue )
        if( monkey.op.right != "old" )
            values.push( Number(monkey.op.right) )
        return values
    }).flat().reduce( (mods,value) => 
        (mods[value] = divisors.reduce( (valueMods,divisor) => {
            valueMods[divisor] = value % divisor
            return valueMods
        }, {} )) && mods, {} 
    )

    const rounds = 10000

    for (let i = 0; i < rounds; i++) {
        monkeys.forEach( monkey => {

            const {left,op,right} = monkey.op

            monkey.items.forEach( item => {
                
                const newValue = { value: right == "old" ? right : Number(right), op }
                item.ops.push( newValue )

                const worryMod = item.ops.reduce( (x,{op,value}) => {
                    let mod = value == "old" ? x : mods[value][monkey.test]
                    if( op == "+" )
                        return (x + mod) % monkey.test
                    return (x * mod) % monkey.test
                }, mods[item.initialValue][monkey.test] )

                if( worryMod % monkey.test == 0 )
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