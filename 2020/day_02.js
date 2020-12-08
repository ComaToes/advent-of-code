const data = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;

const part1 = data.split("\n").map( x => x.match( /^(?<min>\d+)-(?<max>\d+) (?<letter>.): (?<str>.*)$/ ).groups ).map( x => ({...x, count: x.str.split("").filter( c => c == x.letter ).length}) ).reduce( (a,x) => a + (x.count >= x.min && x.count <= x.max), 0 );

console.log( part1 );

const part2 = data.split("\n").map( x => x.match( /^(?<p1>\d+)-(?<p2>\d+) (?<letter>.): (?<str>.*)$/ ).groups ).filter( ({p1,p2,letter,str}) => (str[p1-1] == letter) != (str[p2-1] == letter) ).length;

console.log( part2 );
