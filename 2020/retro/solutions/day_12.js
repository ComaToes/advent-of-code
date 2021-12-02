const NORTH = 'N';
const SOUTH = 'S';
const EAST = 'E';
const WEST = 'W';
const LEFT = 'L';
const RIGHT = 'R';
const FORWARD = 'F';

function parseInstructions(data) {

    const lines = data.split(/\r?\n/);
    return lines.map( line => ({ action: line[0], value: Number(line.substring(1)) }) );
}

function part1(data) {

    const instructions = parseInstructions(data);

    const {x, y} = instructions.reduce( (position, {action, value}) => {

        if( action == FORWARD ) {
            switch( position.facing ) {
                case 0: action = NORTH; break;
                case 90: action = EAST; break;
                case 180: action = SOUTH; break;
                case 270: action = WEST; break;
                default: throw new Error(`Invalid facing: ${position.facing}`);
            }
        }

        switch( action ) {
            case NORTH:
                position.y += value;
                break;
            case SOUTH:
                position.y -= value;
                break;
            case EAST:
                position.x += value;
                break;
            case WEST:
                position.x -= value;
                break;
            case LEFT:
                position.facing = (position.facing - value + 360) % 360;
                break;
            case RIGHT:
                position.facing = (position.facing + value) % 360;
                break;
            default:
                throw new Error(`Invalid action: ${action}`);
        }

        return position;

    }, {x: 0, y: 0, facing: 90} );

    return Math.abs(x) + Math.abs(y);

}

function part2(data) {

    const instructions = parseInstructions(data);

    const cos = {0: 1, 90: 0, 180: -1, 270: 0};
    const sin = {0: 0, 90: 1, 180: 0, 270: -1};

    const {ship:{x, y}} = instructions.reduce( ({waypoint, ship}, {action, value}) => {

        switch( action ) {
            case NORTH:
                waypoint.y += value;
                break;
            case SOUTH:
                waypoint.y -= value;
                break;
            case EAST:
                waypoint.x += value;
                break;
            case WEST:
                waypoint.x -= value;
                break;
            case RIGHT:
                waypoint = {
                    x: waypoint.x * cos[value] + waypoint.y * sin[value],
                    y: waypoint.y * cos[value] - waypoint.x * sin[value]
                }
                break;
            case LEFT:
                waypoint = {
                    x: waypoint.x * cos[value] - waypoint.y * sin[value],
                    y: waypoint.x * sin[value] + waypoint.y * cos[value]
                }
                break;
            case FORWARD:
                ship.x += waypoint.x * value;
                ship.y += waypoint.y * value;
                break;
            default:
                throw new Error(`Invalid action: ${action}`);
        }

        return {waypoint, ship};

    }, { waypoint: {x: 10, y: 1}, ship: {x: 0, y: 0} } );

    return Math.abs(x) + Math.abs(y);

}

module.exports = { part1, part2 }