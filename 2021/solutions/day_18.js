function arrToTree( arr, depth, parent ) {

    if( arr.length != 2 )
        throw new Error();

    const node = {parent, depth};

    const [left, right] = arr.map( v => Array.isArray(v) ? arrToTree(v, depth+1, node) : v );

    node.left = left;
    node.right = right;
    return node;

}

function walkDown(tree, fn) {
    const work = [tree];
    while( work.length > 0 ) {
        const node = work.pop();
        fn(node);
        if( node.left )
            work.push( node.left );
        if( node.right )
            work.push( node.right );
    }
}

function walkLtR(root, fn) {
    const stack = [];
    let node = root;

    while( node instanceof Object || stack.length > 0 ) {

        while( node instanceof Object ) {
            stack.push(node);
            node = node.left;
        }
        node = stack.pop();
        
        if( !(node.left instanceof Object) || !(node.right instanceof Object) )
            if( fn( node ) )
                break;

        node = node.right;

    }

}

function findNeighbor(node, direction, fn) {

    const otherDirection = direction == "left" ? "right" : "left";

    // Go up until we can go left
    while( node.parent && node.parent[direction] == node )
        node = node.parent;
    if( !node.parent )
        return;

    node = node.parent;

    // cater for a left that is a number
    if( !(node[direction] instanceof Object) ) {
        node[direction] = fn(node[direction]);
        return;
    }

    // If an object follow it down
    node = node[direction];
    
    // Go down as far right as possible
    while( node[otherDirection] instanceof Object )
        node = node[otherDirection];

    node[otherDirection] = fn(node[otherDirection]);

}

function printTree(node) {
    if( !node )
        return "nope";
    const left = node.left instanceof Object ? printTree(node.left) : node.left;
    const right = node.right instanceof Object ? printTree(node.right) : node.right;
    return `[${left},${right}]`;
}

function findExplosion(root) {

    let node;
    walkLtR(root, n => {
        if( n.depth >= 4 && !(n.left instanceof Object) && !(n.right instanceof Object) ) {
            node = n;
            return true;
        }
    });

    if( !node )
        return false;

    findNeighbor(node, "left", n => n + node.left);
    findNeighbor(node, "right", n => n + node.right);

    if( node == node.parent.left )
        node.parent.left = 0;
    else
        node.parent.right = 0;

    return true;

}

function findSplit(root) {

    let node;
    walkLtR(root, n => {
        if( n.left >= 10 || n.right >= 10 ) {
            node = n;
            return true;
        }
    });

    if( !node )
        return false;

    const splitSide = node.left >= 10 ? "left" : "right";

    const left = Math.floor(node[splitSide]/2);
    const right = Math.ceil(node[splitSide]/2);
    const child = {
        left,
        right,
        parent: node,
        depth: node.depth+1
    };
    node[splitSide] = child;

    return true;

}

function addSnailNumbers(items) {

    let root = arrToTree( items.shift(), 0 );

    while( items.length > 0 ) {

        const next = arrToTree( items.shift(), 1 );
        
        walkDown( root, n => n.depth++ );

        const newRoot = {
            left: root,
            right: next,
            depth: 0
        }
        
        root.parent = newRoot;
        next.parent = newRoot;
        root = newRoot;

        do {
            while( findExplosion(root) ) {}
        } while( findSplit(root) );
            
    }

    return root;

}

function sumTree(node) {
    if( !node )
        return "nope";
    const left = node.left instanceof Object ? sumTree(node.left) : node.left;
    const right = node.right instanceof Object ? sumTree(node.right) : node.right;
    return 3 * left + 2 * right;
}

function part1(data) {

    const items = data.split(/\r?\n/).map(eval);

    const root = addSnailNumbers(items);

    return sumTree(root);

}

function part2(data) {

    const items = data.split(/\r?\n/).map(eval);

    let max = 0;

    items.forEach( item => {
        items.forEach( jtem => {
            if( item == jtem )
                return;

            const sum = sumTree( addSnailNumbers([item, jtem]) );
            if( sum > max )
                max = sum;

        })
    })

    return max;

}

module.exports = { part1, part2 }