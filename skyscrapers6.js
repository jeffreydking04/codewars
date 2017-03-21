function solvePuzzle(clues) {
  let grid = [
                [ 30030, 30030, 30030, 30030, 30030, 30030],
                [ 30030, 30030, 30030, 30030, 30030, 30030],
                [ 30030, 30030, 30030, 30030, 30030, 30030],
                [ 30030, 30030, 30030, 30030, 30030, 30030],
                [ 30030, 30030, 30030, 30030, 30030, 30030],
                [ 30030, 30030, 30030, 30030, 30030, 30030]
  ];
  let primes = [2,3,5,7,11,13];
  let primesPlusOne = [1,2,3,5,7,11,13];

  function copyGrid(grid) {
    let copy = [];
    for(let row of grid) {
      copy.push(row.slice())
    }
    return(copy);
  }

  function display(g) {
    for (let row of g) { console.log(row); }
  }

  function findIndices(grid) {
    let i = [];
    let min = 7;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        let count = 0
        for (let prime of primes) {
          if(grid[row][col] % prime === 0 && !primesPlusOne.includes(grid[row][col])) {
            count++;
          }
        }
        if(count !== 0 && count < min) {
          i = [row,col];
          min = count;
        }
      }
    }
  //  display(grid);
  //  console.log(i);
    return(i);
  }

  function populate(grids, grid, indices) {
    let r = indices[0];
    let c = indices[1];
    let v = grid[r][c];
    for (let i = 5; i >= 0; i--) {
      if (v % primes[i] === 0) {
        copy = copyGrid(grid);
        copy[r][c] = primes[i];
        if(validGrid(copy)) {
          grids.push(copy);
        }
      }
    }
    return(grids);
  }

  function popAndPopulate(grids) {
//console.log('before pop:')
//for (let g of grids) {
//  display(g);
//  console.log('br');
//}
    let potentialGrid = grids.pop();
    let indices = findIndices(potentialGrid);
//console.log('grid of interest');
//display(potentialGrid);
    if(!checkComps(potentialGrid)) { 
      grids = populate(grids, potentialGrid, indices);
    }
//console.log('after populate:')
//for (let g of grids) {
//  display(g);
//  console.log('br');
//}
  }

  function validGrid(grid) {
    for (let row of grid) {
      let z = [0,0,0,0,0,0];
      for(let num of row) {
        if(primes.includes(num)) {
          index = primes.indexOf(num);
          z[index]++;
          if(z[index] === 2) { return(false);}
        }
      }
    }
    for(let col = 0; col < 6; col++) {
      let z = [0,0,0,0,0,0];
      let y = []
      for(let row = 0; row < 6; row++) {
        y.push(grid[row][col]);
      }
      for (let num of y) {
        if(primes.includes(num)) {
          index = primes.indexOf(num);
          z[index]++;
          if(z[index] === 2) { return(false);}
        }
      }
    }
    return(true);
  }

  function backTrack(grid) {
    let possibleGrids = [grid];
    let count = 0;
    while(possibleGrids.length > 0 && count < 10000) {
      count++;
if(count % 1000) {
console.log(possibleGrids.length)
for(let g of possibleGrids) {
  display(g);
  console.log('br');
}
}
      popAndPopulate(possibleGrids);
      potentialGrid = possibleGrids.pop();
      resolve(potentialGrid);
//console.log('pgrid after res:');
//display(potentialGrid);
//if(count % 1000 === 0) {
//  console.log('count: ' + count);
//  display(possibleGrids[possibleGrids.length - 1]);
//  console.log('count of grids: ' + possibleGrids.length);
//} 
      if(!validGrid(potentialGrid)) { continue; }
      if(checkComps(potentialGrid)) {
        if(checkGrid(potentialGrid)) { return(potentialGrid); }
      } else {
        possibleGrids.push(potentialGrid);
      }
    }
  }

  function rotate(grid) {
    for(let i = 0; i < 6; i++) { 
      let temp = clues.shift();
      clues.push(temp);
    }

    dupGrid = [];

    for(let i = 0; i < 6; i++) {
      dupGrid[i] = grid[i].slice();
    }

    for(let i = 0; i < 6; i++) {
      let column = 5 - i;
      for(let j = 0; j < 6; j++) {
        grid[i][j] = dupGrid[j][column]; 
      }
    }
  }

  function remove(row, col, value) {
    for(let prime of primes) {
      if(value % prime === 0 && grid[row][col] % prime === 0) { grid[row][col] /= prime; }
    }
  }

  function set(row, column, value) {
    grid[row][column] = value;

    for(let i = 0; i < 6; i++) {
      if(i !== column) {
        remove(row, i, value);
      }
      if(i !== row) {
        remove(i, column, value);
      }
    }
  }

  function resolve(grid) {
    for(let row of grid) {
      let count = { 2: 0, 3: 0, 5: 0, 7: 0, 11: 0, 13: 0 }
      for(let num of row) {
        for(let prime of primes) {
          if(num % prime === 0) { count[prime] += 1; }
        }
      }
      for(let key in count) {
        if(count[key] === 1) {
          for(let index in row) {
            if(row[index] % key === 0) { row[index] = parseInt(key); }
          }
        }
      }
    }

    function decomp(num) {
      let d = { comp: [], els: 0 };
      for(let prime of primes) {
        if(num % prime === 0) { d.comp.push(prime); d.els++;}
      }
      return(d);
    }

    for(let row = 0; row < 6; row++) {
      let hash = {};
      for(let num of grid[row]) {
        if(hash[num]) { hash[num]++; } else { hash[num] = 1; }
      }
      for(let key in hash) {
        let n = hash[key];
        let d = decomp(key);
        let els = d.els;
        if(n === els) {
          for(let col = 0; col < 6; col++) {
            if(grid[row][col] !== parseInt(key)) {
              for(let x of d.comp) {
                if(grid[row][col] % x === 0) { remove (row, col, x); }
              }
            }
          }
        }
      }
    }

    for(let row = 0; row < 6; row++) {
      for(let col = 0; col < 6; col++) {
        if(primes.includes(grid[row][col])) { set(row, col, grid[row][col])}
      }
    }
  }

  function one(grid, i) {
    set(0, i, 13);
  }

  function two(grid, i) {
    remove(1, i, 11);
    remove(0, i, 13);
    if(grid[5][i] === 13) { set(0, i, 11); }
  }

  function three(grid, i) {
    remove(0, i, 13);
    remove(0, i, 11);
    remove(1, i, 13);
    if(grid[5][i] === 13 && grid[4][i] === 11) { set(0, i, 7); }
  }

  function four(grid, i) {
    remove(0, i, 13);
    remove(0, i, 11);
    remove(0, i, 7);
    remove(1, i, 13);
    remove(1, i, 11);
    remove(2, i, 13);
  }

  function five(grid, i) {
    remove(0, i, 13);
    remove(0, i, 11);
    remove(0, i, 7);
    remove(0, i, 5);
    remove(1, i, 13);
    remove(1, i, 11);
    remove(1, i, 7);
    remove(2, i, 13);
    remove(2, i, 11);
    remove(3, i, 13);
  }

  function six(grid, i) {
    set(0, i, 2);
    set(1, i, 3);
    set(2, i, 5);
    set(3, i, 7);
    set(4, i, 11);
    set(5, i, 13);
  }

  function checkGrid(grid) {
    let buildingsSeen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let tallestSeen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(let i = 0; i < 6; i++) {
      let p0 = 1;
      let p1 = 1;
      let s0 = 0;
      let s1 = 0;
      for(let j = 0; j < 6; j++) {
        let rowVal = grid[i][j];
        let colVal = grid[j][i];
        if(!primes.includes(rowVal)) { return(false); }
        if(!primes.includes(colVal)) { return(false); }
        p0 *= rowVal;
        s0 += rowVal;
        let seenRowIndex = 23 - i;
        let seenColIndex = j;
        if(rowVal > tallestSeen[seenRowIndex]) {
          buildingsSeen[seenRowIndex]++;
          tallestSeen[seenRowIndex] = rowVal;
        }
        if(rowVal > tallestSeen[seenColIndex]) {
          buildingsSeen[seenColIndex]++;
          tallestSeen[seenColIndex] = rowVal;
        }
        p1 *= colVal;
        s1 += colVal;

      }
      if(p0 !== 30030 || p1 !== 30030) { return(false); }
      if(s0 !== 41  || s1 !== 41) { return(false) }
    }
    for(let i = 5; i >= 0; i--) {
      for(let j = 5; j >= 0; j--) {
        if(grid[i][j] > tallestSeen[6+i]) {
          buildingsSeen[6+i]++;
          tallestSeen[6+i] = grid[i][j];
        }
        if(grid[j][i] > tallestSeen[17-i]) {
          buildingsSeen[17-i]++;
          tallestSeen[17-i] = grid[j][i];
        }
      }
    }
    for(let i in buildingsSeen) {
      if(buildingsSeen[i] !== clues[i]) { return(false); }
    }
    return(true);
  }

  function checkComps(grid) {
    for(let row of grid) {
      for(let num of row) {
        if(!primesPlusOne.includes(num)) { return(false); }
      }
    }
    return(true);
  }

  function processClues(grid) {
    for(let j = 0; j < 4; j++) {
      for(let i = 0; i < 6; i++) {
        if(clues[i] === 1) { one(grid, i); }
        if(clues[i] === 2) { two(grid, i); }
        if(clues[i] === 3) { three(grid, i); }
        if(clues[i] === 4) { four(grid, i); }
        if(clues[i] === 5) { five(grid, i); }        
        if(clues[i] === 6) { six(grid, i); }
      

//console.log(j*6+i);
//console.log(clues[i]);
//for(let k = 0; k < 6; k++) {
//  console.log(grid[k]);
//}

        resolve(grid);
        rotate(grid);
        resolve(grid);
        for(let i = 0; i < 3; i++) {
          rotate(grid);
        }

//console.log('after resolve');
//for(let k = 0; k < 6; k++) {
//  console.log(grid[k]);
//}

      }
      rotate(grid);

//console.log('ROTATE');
//for(let k = 0; k < 6; k++) {
//  console.log(grid[k]);
//}
    }
  }


  for(let i = 0; i < 2; i++) {
    processClues(grid);
  }

  isSolved = checkGrid(grid);

  if (!isSolved) { grid = backTrack(grid); }

  let answer = [[],[],[],[],[],[]];
  for(let row in grid) {
    for(let col = 0; col < 6; col++) {
      num = grid[row][col]
      if(num === 13) { answer[row][col] =  6; } else  // change assignment back to 6
      if(num === 11) { answer[row][col] =  5; } else
      if(num === 7 ) { answer[row][col] =  4; } else
      if(num === 5 ) { answer[row][col] =  3; } else
      if(num === 3 ) { answer[row][col] =  2; } else
      if(num === 2 ) { answer[row][col] =  1; } else { answer[row][col] = num; }
    }
  }
  return(answer);
}

a = solvePuzzle([ 0, 0, 0, 2, 2, 0,
                      0, 0, 0, 6, 3, 0,
                      0, 4, 0, 0, 0, 0,
                      4, 4, 0, 3, 0, 0]);

console.log('answer');
for(let i = 0; i < 6; i++) {
  console.log(a[i]);
}