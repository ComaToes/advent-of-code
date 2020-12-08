const data = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`

const part1 = data.split("\n").map( x => ([op,val]=x.split(" ")) && {op,val:Number(val)} ).reduce( ({pc,r,h,done},x,i,arr) => done || h.includes(pc) ? {pc,r,h,done: true} : ({pc: pc + (arr[pc].op == "jmp" ? arr[pc].val : 1), r: r + (arr[pc].op == "acc" ? arr[pc].val : 0), h: h.concat([pc])}), {pc: 0, r: 0, h: []}).r

console.log( part1 );

const part2 = data.split("\n").map( x => ([op,val]=x.split(" ")) && {op,val:Number(val)} ).map((x,i,arr)=> arr.map( ({op,val},j) => ({op: i!=j?op: op == "nop"?"jmp": op=="jmp"?"nop":op,val}) )).map( x=> x.reduce( ({pc,r,h,done,finished},x,i,arr) => done ? {pc,r,h,done,finished} : pc == arr.length ? {pc,r,h,done: true, finished: true} : h.includes(pc) ? {pc,r,h,done: true} : ({pc: pc + (arr[pc].op == "jmp" ? arr[pc].val : 1), r: r + (arr[pc].op == "acc" ? arr[pc].val : 0), h: h.concat([pc])}), {pc: 0, r: 0, h: []}) ).filter( x => x.finished )[0].r;

console.log( part2 );
