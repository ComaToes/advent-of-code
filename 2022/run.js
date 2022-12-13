import fs from "node:fs/promises"
import moment from "moment"
import argsParser from "args-parser"

async function runDay(day, mode) {
    
    const moduleName = `day_${String(day).padStart(2,'0')}`
    
    const {part1, part2} = await import(`./solutions/${moduleName}.js`)

    const data = await fs.readFile(`input/${moduleName}_${mode}`, "utf8")

    console.log(`Running ${moduleName}`)

    console.time("Part 1")
    const res1 = part1(data)
    console.timeEnd("Part 1")
    console.log( res1 )
    console.log()

    console.time("Part 2")
    const res2 = part2(data)
    console.timeEnd("Part 2")
    console.log( res2 )
    console.log()

}

async function runAll(mode) {
    for( let day = 1; day < 26; day++ )
        await runDay(day, mode)
}

const args = argsParser(process.argv)
const day = args.day || moment().format("D")
const mode = args.mode || "sample"

if( args.all )
    runAll(mode).catch( err => {
        if( err.code != "ERR_MODULE_NOT_FOUND" )
            console.error(err) 
    })
else
    runDay(day, mode).catch( console.error )
