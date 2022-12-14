import fs from "node:fs/promises"
import moment from "moment"
import argsParser from "args-parser"
import {exec as rawExec} from "node:child_process"
import {promisify} from "node:util"

const exec = promisify(rawExec)

async function runJS(moduleName, mode) {
    
    const {part1, part2} = await import(`./solutions/${moduleName}.js`)

    const data = await fs.readFile(`input/${moduleName}_${mode}`, "utf8")

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

async function runGo(moduleName, mode) {

    const goSrc = `solutions.go/${moduleName}.go`
    const inputFile = `input/${moduleName}_${mode}`

    await fs.stat(goSrc)

    const {stdout, stderr} = await exec(`go run ${goSrc} ${inputFile}`)

    if( stdout )
        console.log(stdout)
    if( stderr )
        console.log(stderr)

}

async function runDay(lang, day, mode) {
    const moduleName = `day_${String(day).padStart(2,'0')}`
    console.log(`Running ${moduleName}.${lang}`)
    switch(lang) {
        case "js": return runJS(moduleName, mode)
        case "go": return runGo(moduleName, mode)
        default:
            throw new Error("wut?")
    }
}

async function runAll(lang, mode) {
    for( let day = 1; day < 26; day++ )
        await runDay(lang, day, mode)
}

const args = argsParser(process.argv)
const day = args.day || moment().format("D")
const mode = args.live ? "live" : (args.mode || "sample")
const lang = args.go ? "go" : (args.lang || "js")

if( args.all )
    runAll(lang, mode).catch( err => {
        if( err.code != "ERR_MODULE_NOT_FOUND" )
            console.error(err) 
    })
else
    runDay(lang, day, mode).catch( console.error )
