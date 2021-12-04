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
                memory[address] = (value | mask.set) & mask.unset;
                break;
            }
            default: throw new Error(`Invalid command ${command}`);
        }

    });

    return Object.keys(memory).reduce( (value, key) => value + memory[key], 0n ).toString();

}

function part2(data) {

    let instructions = data.split(/\r?\n/);

    const maskRegex = /mask = ([X10]+)/;
    const memRegex = /mem\[(\d+)\] = (\d+)/;

    instructions = instructions.map( (instruction) => {

        const [ , mask ] = instruction.match(maskRegex) || [];

        if( mask ) {
            const setMask = BigInt( "0b" + mask.replace(/X/g,"0") );
            const floating = BigInt( "0b" + mask.replace(/1/g,"0").replace(/X/g,"1") );
            const floatingBits = [];

            // Gather indexes of floating bits
            let bitMask = 1n;
            for( let i = 0n; i < mask.length; i++ ) {
                if( (floating & bitMask) > 0 )
                    floatingBits.push(i);
                bitMask <<= 1n;
            }

            // Generate mask permutations
            const masks = [];
            for( let i = 0n; i < Math.pow(2, floatingBits.length); i++ ) {
                const floatingMask = floatingBits.reduce( (mask, bitIndex, j) => {
                    j = BigInt(j);
                    return mask | ((i & (1n<<j)) << (bitIndex-j))
                }, setMask );
                masks.push(floatingMask);
            }

            return { command: "mask", masks, floating };
        }

        const [ , address, value ] = instruction.match(memRegex);

        return { command: "mem", address: BigInt(address), value: BigInt(value) };

    });

    const memory = {};
    let masks = [];
    let floating = 0;

    instructions.some( ({command, ...instruction}) => {

        switch( command ) {
            case "mask":
                masks = instruction.masks;
                floating = instruction.floating;
                break;
            case "mem": {
                const {address, value} = instruction;
                const addresses = masks.map( mask => address & ~floating | mask );
                addresses.forEach( addr => {
                    memory[addr] = value;
                });
                break;
            }
            default: throw new Error(`Invalid command ${command}`);
        }

    });

    return Object.keys(memory).reduce( (value, key) => value + memory[key], 0n ).toString();    

}

module.exports = { part1, part2 }