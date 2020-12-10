const data = `16
10
15
5
1
11
7
19
6
12
4`

const part1 = data.split("\n").map(Number).sort((a,b)=>a>b?1:-1).reduce( (a,x,i,arr) => i==arr.length-1 ? a.concat([x,x+3]) : a.concat(x) , [0] ).reduce( ([a],x,i,arr) => i < 1 ? [a] : (a[x-arr[i-1]]=(a[x-arr[i-1]]||0)+1) && [a], [{}] ).map( x => x[1]*x[3] )[0];

console.log( part1 );
