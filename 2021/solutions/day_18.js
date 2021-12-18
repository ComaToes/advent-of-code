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
    const s = [];
    let node = root;

    while( node instanceof Object || s.length > 0 ) {

        while( node instanceof Object ) {
            s.push(node);
            node = node.left;
        }
        node = s.pop();
        
        if( !(node.left instanceof Object) || !(node.right instanceof Object) )
            fn( node );

        node = node.right;

    }

}

function findLeftNeighbor(node, fn) {

    // Go up until we can go left
    while( node.parent && node.parent.left == node )
        node = node.parent;
    if( !node.parent )
        return;

    node = node.parent;

    // cater for a left that is a number
    if( !(node.left instanceof Object) ) {
        node.left = fn(node.left);
        return;
    }

    // If an object follow it down
    node = node.left;
    
    // Go down as far right as possible
    while( node.right instanceof Object )
        node = node.right;

    node.right = fn(node.right);

}

function findRightNeighbor(node, fn) {

    // Go up until we can go right
    while( node.parent && node.parent.right == node )
        node = node.parent;
    if( !node.parent )
        return;

    node = node.parent;

    // cater for a right that is a number
    if( !(node.right instanceof Object) ) {
        node.right = fn(node.right);
        return;
    }

    // If an object follow it down
    node = node.right;
    
    // Go down as far left as possible
    while( node.left instanceof Object )
        node = node.left;

    node.left = fn(node.left);

}

function printTree(node) {
    if( !node )
        return "nope";
    const left = node.left instanceof Object ? printTree(node.left) : node.left;
    const right = node.right instanceof Object ? printTree(node.right) : node.right;
    return `[${left},${right}]`;
}

function findExplosions(root) {

    const exploders = [];
    walkLtR(root, n => {
        if( n.depth >= 4 )
            exploders.push(n);
    });
    exploders.some( node => {

        if( node.left instanceof Object || node.right instanceof Object )
            return;

        findLeftNeighbor(node, n => n + node.left);
        findRightNeighbor(node, n => n + node.right);

        if( node == node.parent.left )
            node.parent.left = 0;
        if( node == node.parent.right )
            node.parent.right = 0;

        return true;

    });

    return exploders.length;

}

function findSplits(root) {

    let splits = [];
    walkLtR(root, n => {
        if( n.left >= 10 || n.right >= 10 )
            splits.push(n);
    });
    splits.some( node => {

        if( node.left >= 10 ) {
            const left = Math.floor(node.left/2);
            const right = Math.ceil(node.left/2);
            const child = {
                left,
                right,
                parent: node,
                depth: node.depth+1
            };
            node.left = child;
            return true;
        }

        if( node.right >= 10 ) {
            const left = Math.floor(node.right/2);
            const right = Math.ceil(node.right/2);
            const child = {
                left,
                right,
                parent: node,
                depth: node.depth+1
            };
            node.right = child;
            return true;
        }

        return true;
        
    } );

    return splits.length;

}

function addSnailNumbers(items) {

    let root = arrToTree( items.shift(), 0 );

    while( items.length > 0 ) {
        // Add next item
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

        let count;
        do {
            while( findExplosions(root) > 0 ) {}
            count = findSplits(root);
        } while( count > 0 );
            
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