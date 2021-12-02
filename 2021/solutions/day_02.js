function part1(data) {

    const lines = data.split(/\r?\n/);
    const commands = lines.map( line => line.split(/\s/) )
                          .map( ([direction, distance]) => ({direction, distance: Number(distance)}));

    const {horizontal, depth} = commands.reduce( (res,command) => {

        switch( command.direction ) {
            case "up": 
                res.depth -= command.distance;
                break;
            case "down":
                res.depth += command.distance;
                break;
            case "forward":
                res.horizontal += command.distance;
                break;
            default:
                throw new Error(`Invalid Direction ${command.direction}`);
        }
        
        return res;

    }, {horizontal: 0, depth: 0} );

    return horizontal * depth;

}

function part2(data) {

    const lines = data.split(/\r?\n/);
    const commands = lines.map( line => line.split(/\s/) )
                          .map( ([direction, distance]) => ({direction, distance: Number(distance)}));

    const {horizontal, depth} = commands.reduce( (res,command) => {

        switch( command.direction ) {
            case "up": 
                res.aim -= command.distance;
                break;
            case "down": 
                res.aim += command.distance; 
                break;
            case "forward": 
                res.horizontal += command.distance;
                res.depth += res.aim * command.distance;
                break;
            default:
                throw new Error(`Invalid Direction ${command.direction}`);
        }

        return res;

    }, {horizontal: 0, depth: 0, aim: 0} );

    return horizontal * depth;

}

module.exports = { part1, part2 }