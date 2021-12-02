function part1(data) {

    const lines = data.split(/\r?\n/);
    const commands = lines.map( line => line.split(/\s/) )
                          .map( ([direction, distance]) => ({direction, distance: Number(distance)}));

    const {horizontal, depth} = commands.reduce( (res, {direction, distance}) => {

        switch( direction ) {
            case "up": 
                res.depth -= distance;
                break;
            case "down":
                res.depth += distance;
                break;
            case "forward":
                res.horizontal += distance;
                break;
            default:
                throw new Error(`Invalid Direction ${direction}`);
        }

        return res;

    }, {horizontal: 0, depth: 0} );

    return horizontal * depth;

}

function part2(data) {

    const lines = data.split(/\r?\n/);
    const commands = lines.map( line => line.split(/\s/) )
                          .map( ([direction, distance]) => ({direction, distance: Number(distance)}));

    const {horizontal, depth} = commands.reduce( (res, {direction, distance}) => {

        switch( direction ) {
            case "up": 
                res.aim -= distance;
                break;
            case "down": 
                res.aim += distance; 
                break;
            case "forward": 
                res.horizontal += distance;
                res.depth += res.aim * distance;
                break;
            default:
                throw new Error(`Invalid Direction ${direction}`);
        }

        return res;

    }, {horizontal: 0, depth: 0, aim: 0} );

    return horizontal * depth;

}

module.exports = { part1, part2 }