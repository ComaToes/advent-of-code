function part1(data) {

    let instructions = data.split(/\r?\n/);

    const maskRegex = /mask = ([X10]+)/;
    const memRegex = /mem\[(\d+)\] = (\d+)/;

    instructions = instructions.map( (instruction) => {

        const [ , mask ] = instruction.match(maskRegex) || [];

        if( mask ) {
            const set = BigInt( "0b" + mask.replace(/X/g,"0") );
            const unset = BigInt( "0b" + mask.replace(/X/g,"1") );
            return { command: "mask", mask: {set, unset} };
        }

        const [ , address, value ] = instruction.match(memRegex);

        return { command: "mem", address: BigInt(address), value: BigInt(value) };

    });

    const memory = {};
    let mask = {};

    instructions.some( ({command, ...instruction}) => {

        switch( command ) {
            case "mask":
                mask = instruction.mask;

                break;
            case "mem": {
                const {address, value} = instruction;
                //console.log(` value ${value.toString(2).padStart(36,"0")}`);
                //console.log(`   set ${mask.set.toString(2).padStart(36,"0")}`);
                //console.log(` unset ${mask.unset.toString(2).padStart(36,"0")}`);
                memory[address] = (value | mask.set) & mask.unset;
                //console.log(`result ${memory[address].toString(2).padStart(36,"0")}`);
                //console.log();
                break;
            }
            default: throw new Error(`Invalid command ${command}`);
        }

    });

    return Object.keys(memory).reduce( (value, key) => value + memory[key], 0n ).toString();

}

function part2(data) {


}

module.exports = { part1, part2 }