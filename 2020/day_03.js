const data = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;

const part1 = data.split("\n").reduce( (a,x,i,arr) => a + (x[i*3%x.length] == "#") , 0 );

console.log( part1 );

const part2 = [[1,1],[3,1],[5,1],[7,1],[1,2]].map( ([r,d]) => data.split("\n").reduce( (a,x,i,arr) => a + (i%d == 0 && x[i/d*r%x.length] == "#") , 0 ) ).reduce( (a,x) => a*x , 1 );

console.log( part2 );
