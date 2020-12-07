const data=`light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.`;

const part1 = data.split("\n").map( x => ({ type: x.match( /^(?<bag>.*) bags contain/ ).groups.bag, contains: Array.from( x.matchAll( /( \d (?<bag>[\w\s]*) bags?[,\.])/g )).map(y=>y.groups.bag) }) ).reduce( (a,x) => x.contains.map(c=>(a[0][c]=a[0][c]||[]).push(x.type)) && a , [{}] ).map(x => Object.keys(x).reduce( ({todo,res},y)=> todo.length < 1 ? ({todo,res}) : ({todo: todo.slice(1).concat(x[todo[0]]||[]), res: res.concat(x[todo[0]]||[])}), {todo:["shiny gold"],res:[]} ) ).map(x=>x.res.reduce((a,x) => a[x]=x && a, {})).map(x=>Object.keys(x).length)[0];

console.log( part1 );

const part2 = data.split("\n").map( x => ({ type: x.match( /^(?<bag>.*) bags contain/ ).groups.bag, contains: Array.from( x.matchAll( /( (?<count>\d) (?<bag>[\w\s]*) bags?[,\.])/g ) ).map(y=>({type:y.groups.bag, count:parseInt(y.groups.count) }) ) }) ).reduce((a,x) => (a[0][x.type]=x.contains) && a, [{}]).map(x => Object.keys(x).reduce( ({todo,res},y)=> todo.length < 1 ? ({todo,res}) : ({todo: todo.slice(1).concat(x[todo[0].type].map(({type,count})=>({type, mult: todo[0].mult * count || 1}))), res: x[todo[0].type].reduce((a,z)=>a+z.count*todo[0].mult,res)}), {todo:[{type:"shiny gold",mult:1}],res:0} ) )[0].res;

console.log( part2 );
