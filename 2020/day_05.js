const data = `FBFBBFFRLL
FBFBBFFRLR
FBFBBFFRRR`;

const maxId = data.split("\n").map( x => x.replace(/[BR]/g,"1").replace(/[FL]/g,"0") ).map( x => parseInt(x,2) ).reduce( (a,x) => x > a ? x : a );

console.log( maxId );

const part2 = data.split("\n").map( x => x.replace(/[BR]/g,"1").replace(/[FL]/g,"0") ).map( x => parseInt(x,2) ).reduce( (a,x) => [-1,0,1].map( y => a[0][x+y] = (a[0][x+y]||0)+1 ) && a , [{}] ).map( x => Object.keys(x).filter( k => x[k] == 2 ) )[0][2];

console.log( part2 );
