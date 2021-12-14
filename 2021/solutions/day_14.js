function parseData(data) {

    const [template, ruleLines] = data.split(/\r?\n\r?\n/);
    const rules = ruleLines.split(/\r?\n/).reduce( (rules, line) => {
        const [, match, insertion] = line.match(/^(\w+) -> (\w)$/);
        rules[match] = insertion;
        return rules;
    }, {} );
    return [template, rules];

}

// Simple solution for part 1
function growChainArray(template, rules, steps) {

    const chain = template.split("");

    const counts = chain.reduce( (counts, ch) => {
        counts[ch] = (counts[ch] || 0) + 1;
        return counts;
    }, {} );

    for( let step = 0; step < steps; step++ ) {

        for( let i = 0; i < chain.length - 1; i++ ) {

            const pair = chain[i] + chain[i+1];
            const insertion = rules[pair];
            if( insertion ) {
                chain.splice( i+1, 0, insertion );
                i++;
                counts[insertion] = (counts[insertion] || 0) + 1;
            }

        }

    }

    return counts;

}

function part1(data) {

    const [template, rules] = parseData(data);

    const counts = growChainArray(template, rules, 10);

    const [min, max] = Object.keys(counts).reduce( 
        ([min, max], ch) => [ Math.min(min, counts[ch]), Math.max( max, counts[ch]) ], 
        [Number.MAX_SAFE_INTEGER, 0] 
    );

    return max - min;

}

// Faster than array but still too slow for part 2
function growChainLinkedList(template, rules, steps) {

    const chain = template.split("").reduce( ({first,last}, ch) => {
        const entry = { value: ch, next: false };
        if( last )
            last.next = entry;
        return {
            first: first || entry,
            last: entry
        };
    }, {} ).first;

    const counts = {};
    let item = chain;
    do {
        const ch = item.value;
        counts[ch] = (counts[ch] || 0) + 1;
        item = item.next;
    } while( item );

    for( let step = 0; step < steps; step++ ) {

        item = chain;
        do {

            const pair = item.value + item.next.value;
            const insertion = rules[pair];
            if( insertion ) {
                item.next = {
                    value: insertion,
                    next: item.next
                };
                item = item.next;
                counts[insertion] = (counts[insertion] || 0) + 1;
            }

            item = item.next;
        } while( item.next );

    }

    return counts;

}

// Faster than linked list, but still too slow..
function growChainGraph(template, rules, steps) {

    const chain = template.split("");

    // Create graphs nodes
    const graph = Object.keys(rules).reduce( (graph, match) => {
        graph[match] = { match, inserted: rules[match], next: [] };
        return graph;
    }, {});

    // Create edges
    Object.keys(graph).forEach( (match) => {
        const [leftCh, rightCh] = match.split("");
        const leftMatch = leftCh + rules[match];
        const rightMatch = rules[match] + rightCh;
        [leftMatch, rightMatch].forEach( candidate => {
            if( graph[candidate] )
                graph[match].next.push( graph[candidate] );
        } )
    });

    // Counts from initial input
    const counts = chain.reduce( (counts, ch) => {
        counts[ch] = (counts[ch] || 0) + 1;
        return counts;
    }, {} );

    // Walk graph
    for( let i = 0; i < chain.length - 1; i++ ) {

        const pair = chain[i] + chain[i+1];

        if( !graph[pair] )
            continue;

        const walks = [
            { node: graph[pair], depth: 0 }
        ];

        while( walks.length > 0 ) {

            let {node, depth} = walks.pop();

            counts[node.inserted] = (counts[node.inserted] || 0) + 1;
            depth++;
            if( depth < steps ) {
                node.next.forEach( (node) => {
                    walks.push( {node, depth} );
                } );
            }

        }

    }

    return counts;
}

// Had to get some hints for this
function growChainFast(template, rules, steps) {

    const chain = template.split("");
    let counts = {};

    for( let i = 0; i < chain.length - 1; i++ ) {
        const pair = chain[i] + chain[i+1];
        counts[pair] = (counts[pair] || 0) + 1;
    }

    for( let step = 0; step < steps; step++ ) {
        const nextCounts = {};
        Object.keys(counts).forEach( pair => {
            const ch = rules[pair];
            const [left, right] = pair.split("");
            const leftPair = left+ch;
            const rightPair = ch+right;
            nextCounts[leftPair] = (nextCounts[leftPair] || 0) + counts[pair];
            nextCounts[rightPair] = (nextCounts[rightPair] || 0) + counts[pair];
        });
        counts = nextCounts;
    }

    const charCounts = {};
    Object.keys(counts).forEach( pair => {
        const chars = pair.split("");
        chars.forEach( ch => {
            charCounts[ch] = (charCounts[ch] || 0) + counts[pair];
        });
    });

    Object.keys(charCounts).forEach( ch => {
        charCounts[ch] = Math.ceil( charCounts[ch] / 2 );
    });

    return charCounts;

}

function part2(data) {

    const [template, rules] = parseData(data);

    const counts = growChainFast(template, rules, 40);

    const [min, max] = Object.keys(counts).reduce( 
        ([min, max], ch) => [ Math.min(min, counts[ch]), Math.max( max, counts[ch]) ], 
        [Number.MAX_SAFE_INTEGER, 0] 
    );

    return max - min;

}

module.exports = { part1, part2 }