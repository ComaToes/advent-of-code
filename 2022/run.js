const fs = require("fs");
const moment = require("moment");
const args = require("args-parser")(process.argv);

function runDay(day, mode) {
    
    const moduleName = `day_${String(day).padStart(2,'0')}`;
    console.log(`Running ${moduleName}`);
    
    const dayModule = require(`./solutions/${moduleName}`);

    const data = fs.readFileSync(`input/${moduleName}_${mode}`).toString();

    console.time("Part 1")
    const part1 = dayModule.part1(data);
    console.timeEnd("Part 1");
    console.log( part1 );
    console.log();

    console.time("Part 2")
    const part2 = dayModule.part2(data);
    console.timeEnd("Part 2");
    console.log( part2 );
    console.log();

}

const day = args.day || moment().format("D");
const mode = args.mode || "sample";

runDay(day, mode);