function sudoku(puzzle) {
  let primes = [2,3,5,7,11,13,17,19,23];
  let nums = [1,2,3,4,5,6,7,8,9];
  for(let row in puzzle) {
    for (let col in puzzle[row]) {
      if (puzzle[row][col] === 0) {
        puzzle[row][col] = 223092870;
      } else {
        let num = puzzle[row][col];
        let index = nums.indexOf(num);
        puzzle[row][col] = primes[index];
      }
    }
  }

  function resolve(array) {
    let existing = [];
    for (let num of array) {
      if(primes.includes(num)) { existing.push(num); }
    }
    for (let num in array) {
      for (let element of existing) {
        if(!primes.includes(array[num])) {
          if(array[num] % element === 0) { array[num] /= element; }
        }
      }
    }
    return(array);
  }

  function processQuadrants() {
    for(let i = 0; i < 9; i += 3) {
      for(let j = 0; j < 9; j += 3) {
        let quad = [];
        for (let k = i; k < i + 3; k++) {
          for (let g = j; g < j + 3; g++) {
            quad.push(puzzle[k][g]);
          }
        }
        quad = resolve(quad);
        for (let k = i; k < i + 3; k++) {
          for (let g = j; g < j + 3; g++) {
            let jdk = quad.shift();
            puzzle[k][g] = jdk;
          }
        }
      }
    }
  }

  function processColumns() {
    for (let i = 0; i < 9; i++) {
      let col = [];
      for(let j = 0; j < 9; j++) {
        col.push(puzzle[j][i]);
      }
      resolve(col);
      for(let j = 0; j < 9; j++) {
        let jdk = col.shift();
        puzzle[j][i] = jdk;
      }
    }
  }

  function processRows() {
    for (let row of puzzle) {
      resolve(row);
    }
  }

  function solved() {
    for (let row of puzzle) {
      let prod = 1;
      for (let num of row) { prod *= num; }
      if(prod !== 223092870) { return(false); }
    }
    return(true);
  }

  let notSolved = true;
  while(notSolved) {
    processQuadrants();
    processColumns();
    processRows();
    notSolved = !solved();
  }

  for(let row in puzzle) {
    for(let col in puzzle[row]) {
      let jdk = primes.indexOf(puzzle[row][col]);
      puzzle[row][col] = nums[jdk];
    }
  }

  return(puzzle);
}

    var puzzle = [
      [0, 0, 0, 0, 0, 5, 0, 8, 0], 
      [0, 0, 0, 6, 0, 1, 0, 4, 3], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 1, 0, 5, 0, 0, 0, 0, 0], 
      [0, 0, 0, 1, 0, 6, 0, 0, 0], 
      [3, 0, 0, 0, 0, 0, 0, 0, 5], 
      [5, 3, 0, 0, 0, 0, 0, 6, 1], 
      [0, 0, 0, 0, 0, 0, 0, 0, 4], 
      [0, 0, 0, 0, 0, 0, 0, 0, 0];

let a = sudoku(puzzle);

for(let row of a) {
  console.log(row);
}

[5, 3, 4, 6, 7, 8, 9, 1, 2]
[6, 7, 2, 1, 9, 5, 3, 4, 8]
[1, 9, 8, 3, 4, 2, 5, 6, 7]
[8, 5, 9, 7, 6, 1, 4, 2, 3]
[4, 2, 6, 8, 5, 3, 7, 9, 1]
[7, 1, 3, 9, 2, 4, 8, 5, 6]
[9, 6, 1, 5, 3, 7, 2, 8, 4]
[2, 8, 7, 4, 1, 9, 6, 3, 5]
[3, 4, 5, 2, 8, 6, 1, 7, 9]