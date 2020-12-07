const data = `1721
979
366
299
675
1456`;

const part1 = data.split("\n").map( Number ).reduce( (a,x,i,arr) => a || arr.slice(i+1).reduce( (b,y) => b || (x + y == 2020 ? x*y : 0), 0 ), 0 )

console.log( part1 );

const part2 = data.split("\n").map( Number ).reduce( (a,x,i,arr) => a || arr.slice(i+1).reduce( (b,y,j,arr) => b || arr.slice(j+1).reduce( (c,z,k,arr) => c || (x + y + z == 2020 ? x*y*z : 0), 0 ), 0 ), 0 )

console.log( part2 );
