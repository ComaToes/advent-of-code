const fs = require("fs");
const moment = require("moment");
const args = require("args-parser")(process.argv);

function runDay(day, mode) {
    
    const moduleName = `day_${String(day).padStart(2,'0')}`;
    console.log(`Running ${moduleName}`);
    
    const dayModule = require(`./solutions/${moduleName}`);

    const data = fs.readFileSync(`input/${moduleName}_${mode}`).toString();

    console.log("Part 1");
    console.log( dayModule.part1(data) );
    console.log();
    console.log("Part 2");
    console.log( dayModule.part2(data) );
    console.log();

}

const day = args.day || moment().format("D");
const mode = args.mode || "sample";

runDay(day, mode);