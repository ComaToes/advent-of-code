const data = `FBFBBFFRLR
FBFBBFFRLR
FBFBBFFRLR`;

const maxId = data.split("\n").map( x => x.replace(/[BR]/g,"1").replace(/[FL]/g,"0") ).map( x => parseInt(x,2) ).reduce( (a,x) => x > a ? x : a );

console.log( maxId );
