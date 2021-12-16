const type4 = /^(?<version>[01]{3})(?<type>100)(?<encodedValue>(?:1[01]{4})*(?:0[01]{4}))/;
const type4value = /[01](?<value>[01]{4})/g;
const typeX = /^(?<version>[01]{3})(?<type>[01]{3})(?<length>(?:0[01]{15})|(?:1[01]{11}))/;

function readPacket(bits) {

    const type4match = bits.match(type4);
    if( type4match ) {

        let {version, type, encodedValue} = type4match.groups;
        version = Number.parseInt( version, 2 );
        type = Number.parseInt( type, 2 );

        let valueStr = "", valueMatch;
        while( valueMatch = type4value.exec( encodedValue ) ) {
            valueStr += valueMatch.groups.value;
        }
        const value = Number.parseInt( valueStr, 2 );

        const packet = { version, type, value };
        const remaining = bits.slice( type4match[0].length );
        return { packet, remaining }
        
    }

    const typeXmatch = bits.match(typeX);
    if( typeXmatch ) {

        let {version, type, length} = typeXmatch.groups;
        version = Number.parseInt( version, 2 );
        type = Number.parseInt( type, 2 );
        const isPacketCount = Number( length[0] );
        length = Number.parseInt( length.slice(1), 2 );

        const contentStart = typeXmatch[0].length;
        let content;
        if( isPacketCount )
            content = bits.slice( contentStart );
        else
            content = bits.slice( contentStart, contentStart + length );

        const children = [];
        let child;
        let childCount = 0;
        while( (!isPacketCount || childCount < length) && (child = readPacket( content )) ) {
            children.push( child.packet );
            childCount++;
            content = child.remaining;
        }

        const packet = { version, type, children };
        const remaining = isPacketCount ? content : bits.slice( contentStart + length );
        return { packet, remaining }

    }

}

function part1(data) {

    const bits = BigInt( "0x" + data ).toString(2).padStart( data.length * 4, "0" );

    const {packet} = readPacket(bits);

    let versionSum = 0;
    const packets = [packet];
    while( packets.length > 0 ) {
        const p = packets.shift();
        versionSum += p.version;
        if( p.children )
            p.children.forEach( c => packets.push(c) );
    }

    return versionSum;

}

function evalPacket(packet) {

    switch( packet.type ) {
        case 0: return packet.children.reduce( (sum, c) => sum + evalPacket(c), 0 );
        case 1: return packet.children.reduce( (product, c) => product * evalPacket(c), 1 );
        case 2: return packet.children.reduce( (min, c) => Math.min( min, evalPacket(c) ), Number.MAX_SAFE_INTEGER );
        case 3: return packet.children.reduce( (max, c) => Math.max( max, evalPacket(c) ), 0 );
        case 4: return packet.value;
        case 5: {
            const [a,b] = packet.children;
            return evalPacket( a ) > evalPacket( b ) ? 1 : 0;
        }
        case 6: {
            const [a,b] = packet.children;
            return evalPacket( a ) < evalPacket( b ) ? 1 : 0;
        }
        case 7: {
            const [a,b] = packet.children;
            return evalPacket( a ) == evalPacket( b ) ? 1 : 0;
        }
    }

}

function part2(data) {

    const bits = BigInt( "0x" + data ).toString(2).padStart( data.length * 4, "0" );

    const {packet} = readPacket(bits);

    return evalPacket(packet);

}

module.exports = { part1, part2 }