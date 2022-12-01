function parseData(data) {

    return data.split(/\r?\n/).map( line => {
        const [op, a, b] = line.split(" ");
        return {op, a, b};
    } );

}

function evaluate({op, a, b, params}) {
/*
    console.log( `evaluate ${op} ${a} ${b}` );
    if( params ) {
        console.log( params[a] instanceof Object ? a : params[a] );
        console.log( params[b] instanceof Object ? b : params[b] );
    }
*/
    switch( op ) {
        case "inp": return b;
        case "out": return evaluate(params[a]);
        case "add": return Object.values(params).reduce( (res, v) => res + (v instanceof Object ? evaluate(v) : v), 0 );
        case "mul": return Object.values(params).reduce( (res, v) => res * (v instanceof Object ? evaluate(v) : v), 1 );
        case "div": return Math.floor( 
            (params[a] instanceof Object ? evaluate(params[a]) : params[a]) / 
            (params[b] instanceof Object ? evaluate(params[b]) : params[b])
        );
        case "mod": return ( 
            (params[a] instanceof Object ? evaluate(params[a]) : params[a]) % 
            (params[b] instanceof Object ? evaluate(params[b]) : params[b])
        );
        case "eql": return ( 
            (params[a] instanceof Object ? evaluate(params[a]) : params[a]) == 
            (params[b] instanceof Object ? evaluate(params[b]) : params[b]) ? 1 : 0
        );
        default:
            throw new Error(op);
    }

}

function generateAllInputValues([next, ...other]) {
    
    if( !next )
        return [];

    const min = next.external ? 1 : 0;
    const limit = next.external ? 9 : 7000;

    const inputs = [];
    if( !other || other.length < 1 ) {
        for( let i = min; i <= limit; i++ ) {
            inputs.push( { [next.a]: i } );
        }
        return inputs;
    }
    
    for( let i = min; i <= limit; i++ ) {
        inputs.push( ...generateAllInputValues(other).map( input => ({...input, [next.a]: i}) ) );
    }
    return inputs;

}

function part1(data) {

    const instructions = parseData(data);

    let outputs = [{ op: "out", a: "z", params: {} }];
    let validOutputs = {
        "": [{ z: 0 }]
    };
    /*
    let validOutputs = [
        { z: 0, external: [] },
    ];*/
    let regs = {
        z: outputs
    };

    let count = 0;

    let instr = instructions.pop();
    while( instr ) {

        console.log();
        console.log();
        console.log( `New Round ${count++}` );
        console.log( "outputs", outputs );
        console.log( "validOutputs", validOutputs );
        console.log( "regs", regs );
        console.log();

        let inputs = [];

        while( instr && instr.op != "inp" ) {

            const {op, a, b} = instr;
            //console.log( `${op} ${a} ${b}` )
            //console.log(regs);

            const node = {...instr, params: {}};
            if( regs[a] )
                regs[a].forEach( nodel => nodel.params[a] = node );
            regs[a] = [node]
            const num = Number(b);
            if( Number.isInteger(num) ) {
                if( op == "mul" && num == 0 ) {
                    // these are dead ends that don't need input
                    delete regs[a];
                }
                node.params[b] = num;
            } else {
                if( regs[b] )
                    regs[b].push( node );
                else
                    regs[b] = [node];
            }

            instr = instructions.pop();
        }

        while( instr && instr.op == "inp" ) {

            const {op, a} = instr;
            //console.log( `${op} ${a}` )

            const node = {...instr, external: true};
            regs[a].forEach( nodel => nodel.params[a] = node );
            //regs[dest].node.params[dest] = {op}
            //regs[a] = [node];
            delete regs[a];
            inputs.push(node);

            instr = instructions.pop();
        }

        //console.log( JSON.stringify(outputs[0], null, 2) );

        // fill unsatisfied deps with fake inputs
        Object.entries(regs).forEach( ([name, nodes]) => {
            const input = { op: "inp", a: name };
            inputs.push(input);
            nodes.forEach( node => node.params[name] = input );
        } );

        console.log( inputs );

        // try all possible combinations of inputs
        // find those that produce valid outputs
        const validInputs = [];
        generateAllInputValues(inputs).forEach( values => {

            inputs.forEach( input => {
                input.b = values[input.a];
            });

            Object.entries(validOutputs).forEach( ([external, validExtOutputs]) => {

                validExtOutputs.some( validOutput => {
                    let valid = true;
                    outputs.some( output => {
                        const result = evaluate(output);
                        //console.log("result", result);
                        if( validOutput[output.a] != result ) {
                            valid = false;
                            return true;
                        }
                    });
                    if( valid ) {
                        validInputs.push( {...values, external} );
                    }
                });

            } );


            
        });

        //return validInputs;

        // set up expected outputs for next iteration

        regs = {};
        outputs = [];

        inputs.filter(({external}) => !external).forEach( ({a}) => {
            const output = {op: "out", a, params: {}};
            outputs.push(output);
            regs[a] = regs[a] || [];
            regs[a].push(output);
        });

        console.log(outputs)
        console.log(regs)

        //return validInputs;

        validOutputs = validInputs.reduce( (validOutputs, {external, ...validInput}) => {
            
            
            let nextExternal = external;
            const res = {};
            inputs.forEach( ({a, external}) => {
                if( external )
                    nextExternal = validInput[a] + nextExternal;
                else
                    res[a] = validInput[a];
            });
            validOutputs[nextExternal] = validOutputs[nextExternal] || [];
            validOutputs[nextExternal].push( res );
            return validOutputs;
        }, {} );

        const revExts = {};
        Object.entries(validOutputs).map( ([external, outputs]) => {
            const h = outputs.reduce( (h,v) => h + "_" + v.z, "" );
            if( !revExts[h] || external > revExts[h] ) {
                revExts[h] = external;
            }
        })

        const nextValidOutputs = {};
        Object.values(revExts).map( external => {
            nextValidOutputs[external] = validOutputs[external];
        });

        Object.values(revExts).sort().reverse().map( external => {
            if( nextValidOutputs[external] )
                nextValidOutputs[external].forEach( ({z}) => {
                    Object.values(revExts).forEach( external2 => {
                        if( external != external2 && nextValidOutputs[external2] ) {
                            nextValidOutputs[external2] = nextValidOutputs[external2].filter( v => v.z != z );
                            if( nextValidOutputs[external2].length < 1 )
                                delete nextValidOutputs[external2];
                        }
                    } )
                } )
        });


        console.log(validOutputs, Object.keys(validOutputs).length)
        console.log(revExts, Object.keys(revExts).length)
        console.log(nextValidOutputs, Object.keys(nextValidOutputs).length)

        validOutputs = nextValidOutputs;

        //return;

    }

    return "ok";

    //console.log( JSON.stringify(root, null, 2) );

    regs.z.forEach( node => node.params.z = 0 );

    inputs.forEach( node => node.b = 1 );

    //regs.z[0].b = 1;
    //regs.w[0].b = 2;

    //console.log( `result: ${ evaluate(root) }` );

    return evaluate(root);

}

function part2(data) {



}

module.exports = { part1, part2 }