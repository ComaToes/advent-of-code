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
