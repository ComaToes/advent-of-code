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

const count = data.split("\n\n").map( x => x.replace(/\W/g,"") ).map( x => x.split("").reduce( (a,x) => a[x]=x && a, {} ) ).map( x => Object.keys(x).length ).reduce( (a,x) => a+x );

console.log( count );