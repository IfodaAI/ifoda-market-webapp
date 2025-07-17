const arr = [234, 452, 368, 476, 101];

const n = 3; 
const nthBigNum = arr.slice().sort((a, b) => b - a)[n - 1];

console.log(nthBigNum);


