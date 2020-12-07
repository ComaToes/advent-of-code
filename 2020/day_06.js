const data = `abc

a
b
c

ab
ac

a
a
a
a

b`;

const part1 = data.split("\n\n").map( x => x.replace(/\W/g,"") ).map( x => x.split("").reduce( (a,x) => a[x]=x && a, {} ) ).map( x => Object.keys(x).length ).reduce( (a,x) => a+x );

console.log( part1 );

const part2 = data.split("\n\n").map( x => ({ str: x.replace(/\W/g,""), count: x.replace(/\w/g,"").length+1}) ).map( ({count,str}) => ({ map: str.split("").reduce( (a,x) => (a[x]=(a[x]||0)+1) && a, {} ), count }) ).map( ({map,count}) => Object.keys(map).filter( k => map[k] == count ).length ).reduce( (a,x) => a+x );

console.log( part2 );