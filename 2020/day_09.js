const data = `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`;

const range = 5
const part1 = data.split("\n").map(Number).reduce( (a,x,i,arr) => a.done ? a : (i > range-1 && !a.ps.reduce((a,z,j)=> a || (z.includes(x) && z.indexOf(x) >= z.length-j), false)) ? ({...a,done: true, result:x}) : ({...a,ps: (a.ps.length>range-1?a.ps.slice(-(range-1)):a.ps).concat([arr.slice(Math.max(0,i-(range-1)),i).map(y=>x+y)])}) , {ps:[]} ).result;

console.log( part1 );

const target = part1;
const part2 = data.split("\n").map(Number).reduce( ([{d,sum}],x,i,arr) => ([{d: d.concat(x), sum: sum.concat( sum.length < 1 ? x : sum[sum.length-1] + x )}]) , [{d:[],sum:[]}] ).map( ({d,sum}) => ({d, r: sum.reduce( (a,x,i,arr) => a || ( i > 0 && (min=arr.slice(0,i).reduce( (b,y,j) => b || (x-y == target ? j : b) , false )) ? [min+1,i] : a), false ) }) ).map( ({d,r}) => d.slice(r[0],r[1]+1) ).map( d => ([ d.reduce( (a,x) => (x < a ? x : a), Number.MAX_SAFE_INTEGER ), d.reduce( (a,x) => x > a ? x : a, 0 ) ]) )[0].reduce( (a,x) => a+x, 0 );

console.log( part2 );
