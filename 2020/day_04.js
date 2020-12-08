const data = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

const part1 = data.split("\n\n").map( x => x.split(/\s/).map( y => y.split(":")[0] ) ).filter( x => x.length == 8 || x.length == 7 && !x.includes("cid") ).length;

console.log( part1 );

const part2 = data.split("\n\n").map( x => x.split(/\s/).reduce( (a,y) => ([k,v]=y.split(":")) && (a[k]=v) && a, {} ) ).filter( x => Object.keys(x).length == 8 || Object.keys(x).length == 7 && !x["cid"] ).filter( ({byr,iyr,eyr,hgt,hcl,ecl,pid,cid}) => byr.match(/^\d{4}$/) && byr >= 1920 && byr <= 2002 && iyr.match(/^\d{4}$/) && iyr >= 2010 && iyr <= 2020 && eyr.match(/^\d{4}$/) && eyr >= 2020 && eyr <= 2030 && ( hgt.match(/^1([5-8][0-9]|9[0-3])cm$/) || hgt.match(/^(59|6[0-9]|7[0-6])in$/) ) && hcl.match(/^#[0-9a-f]{6}$/) && ["amb","blu","brn","gry","grn","hzl","oth"].includes(ecl) && pid.match(/^[0-9]{9}$/) ).length;

console.log( part2 );
