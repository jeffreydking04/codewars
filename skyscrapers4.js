function solvePuzzle (clues) {
  // 1 = 1
  // 4 = 2
  // 9 = 3
  // 16 = 4
  // 5 = 1 or 2 (1 + 4)
  // 10 = 1 or 3 (1 + 9)
  // 17 = 1 or 4 (1 + 16)
  // 13 = 2 or 3
  // 20 = 2 or 4
  // 25 = 3 or 4
  // 14 = 1, 2, or 3
  // 21 = 1, 2, or 4
  // 26 = 1, 3, or 4
  // 29 = 2, 3, or 4
  // 30 = 1, 2, 3, or 4
  let grid = [
    [30,30,30,30],
    [30,30,30,30],
    [30,30,30,30],
    [30,30,30,30]
  ];

  // rotate the grid counterclockwise 90 degrees and rotate the clues accordingly
  // so processing the clues is always done from the top down perspective
  function rotate() {
    for(let i = 0; i < 4; i++) { 
      let temp = clues.shift();
      clues.push(temp);
    }

    dupGrid = [];

    for(let i = 0; i < 4; i++) {
      dupGrid[i] = grid[i].slice();
    }

    for(let i = 0; i < 4; i++) {
      let column = 3 - i;
      for(let j = 0; j < 4; j++) {
        grid[i][j] = dupGrid[j][column]; 
      }
    }
  }

  // if a height can be eliminated from a grid position, its removal is
  // done here, but the value may have already been removed, so it 
  // is necessary to list the values for which removal has not occurred
  // then check if the position === one of those values before subtracting
  function remove(row, column, value) {
    let poss = [];
    if(value === 16) { poss = [30, 29, 26, 25, 21, 20, 17]; }
    if(value === 9) { poss = [30, 29, 26, 25, 14, 13, 10]; }
    if(value === 4) { poss = [30, 29, 21, 14, 20, 13, 5]; }
    if(value === 1) { poss = [30, 26, 21, 14, 17, 10, 5]; }

    if(poss.includes(grid[row][column])) { grid[row][column] = grid[row][column] - value; }
    // removing multiple possibilities will only be done if proper conditionals have
    // already been checked, provided it is not already set
    let sets = [1,4,9,16];
    let mults = [5,10,17,13,20,25,14,21,26,29];
    if(mults.includes(value) && !sets.includes(grid[row][column])) { grid[row][column] = grid[row][column] - value; }
  }

  // there are situations in which the processing the clues perfectly still
  // will not solve the puzzle.  Then the grid needs to be analyzed in and 
  // of itself to proceed (for example, we may know two positions in a row
  // or column are either 1 or 4 and a third is 1, 4, or 9 after clue processing, 
  // then clearly the third position is the 9.)
  function resolve() {
    let ones = [1, 4, 9, 16];
    let twos = [5, 10, 17, 13, 20, 25];
    let threes = [14, 21, 26, 29];
    let collection = [1,4,5,9,10,13,14,16,17,20,21,25,26,29,30]


    for(let value of twos) {

      for(let row = 0; row < 4; row++) {
        // counting to see if a possibility only occurs once among a rows
        // elements, setting it appropriately
        let set1 = 0;
        let set2 = 0;
        let set3 = 0;
        let set4 = 0;
        let s1 = [1,5,10,17,14,21,26,30];
        let s2 = [4,5,13,20,14,21,29,30];
        let s3 = [9,10,13,25,14,26,29,30];
        let s4 = [16,17,20,25,21,26,29,30];

        let count = 0;
        for(let v of grid[row]) {
          if (v === value) { count++; }
          if (s1.includes(v)) { set1++; }      
          if (s2.includes(v)) { set2++; }      
          if (s3.includes(v)) { set3++; }      
          if (s4.includes(v)) { set4++; }      
        }


        for(let index in grid[row]) {
          if(s1.includes(grid[row][index]) && set1 === 1) { set(row, index, 1); }
          if(s2.includes(grid[row][index]) && set2 === 1) { set(row, index, 4); }
          if(s3.includes(grid[row][index]) && set3 === 1) { set(row, index, 9); }
          if(s4.includes(grid[row][index]) && set4 === 1) { set(row, index, 16); }
        }


        if (count === 2) {
          for(let index in grid[row]) {
            let cell = grid[row][index];
            if (cell !== value) {
              let combo = cell + value;
              // if the cell of interest has 3 possibilities and two of them
              // are the ones coded by value, then value can be safely removed
              // or if the cell of interest has all 4 possibilities remaining
              if(ones.includes(cell - value) || cell === 30) { remove(row, index, value);  continue; }
              // if the cell of interest has  3 possibilities, but only one is in
              // common with the value, then we will have 5 total numbers, one 
              // of which is repeated.  Since the full set adds to 30, combo - 30
              // tells us which number is repeated.
              if(combo > 30) {remove(row, index, combo - 30); continue; }
              // if combo minus a value in three is 1,4,9, or 16, then the difference can 
              // be removed from the target cell (for example 5 is
              // code for 1 or 4 and 10 is code for 1 or 9, but when two cells in a 
              // row have both been reduced to 5, then no other cell can be 1 or 4,
              // but 10 + 5 = 15, which is 1 + 1 + 4 + 9, which means the 1 can be 
              // removed from the target cell) if the combo === 30, skip because 
              // the two cells' possibilities are mutually exclusive
              for (let three of threes) {
                let diff = combo - three;
                if (combo !== 30) {
                  if (ones.includes(diff)) { remove(row,index,diff); }
                } 
              }

            }
          }
        }    
      }
    }
    // eliminating a possibility may reduce a position to a single possibility,
    // but that is not recognized by the rest of the row or column unless #set is called
    // explicitly
    for(let row = 0; row < 4; row++) {
      for(let column = 0; column < 4; column++) {
        if(grid[row][column] === 1)  { set(row, column, 1)}
        if(grid[row][column] === 4)  { set(row, column, 4)}
        if(grid[row][column] === 9)  { set(row, column, 9)}
        if(grid[row][column] === 16) { set(row, column, 16)}
      }
    }    
  }

  // sets a position to a specific value and modifies the positions that
  // are changed by this information
  function set(row, column, value) {
    grid[row][column] = value;

    for(let i = 0; i < 4; i++) {
      if(i !== column) {
        remove(row, i, value);
      }
      if(i !== row) {
        remove(i, column, value);
      }
    }
  }

  // if the sum of the grid values is 120, the puzzle is solved
  function check() {
    let sum = 0;
    for(let i = 0; i < 4; i++) {
      for(let j = 0; j < 4; j++) {
        sum += grid[i][j];
      }
    }
    if (sum === 120) { return true; }
    return false;
  }

  // process a clue of 1 for a column
  function four(i) {
    for(let j = 0; j < 4; j++) {
      set(j, i, (j+1) * (j+1));
    }
  }

  // process a clue of 2 for a column
  function two(i) {
    // the first row cannot be 16
    remove(0, i, 16);

    // the second row cannot be 9
    remove(1, i, 9);

    // if the first row is 1, the second must be 16
    if(grid[0][i] === 1) { set(1, i, 16); }

    // if the first row is 4, the last cannot be 16
    if(grid[0][i] === 4) { remove(3, i, 16); }

    // if the second row is 1 the third cannot be 9
    if(grid[1][i] === 1) { remove(2, i, 9); }

    // if the third row is 9 the second must be 16
    if(grid[2][i] === 9) { set(1, i, 16); }

    // if the fourth row is 16 the first must be 9
    if(grid[3][i] === 16) { set(0, i, 9); }

    // if the third row is 16 and the fourth row is 9, the first must be 4, the second 1
    if(grid[2][i] === 16 && grid[3][i] === 9) {
      set(0, i, 4);
      set(1, i, 1);
    }
  }

  // process a clue of 3 for a column
  function three(i) {
    // first row cannot be 9 or 16
    remove(0, i, 9);
    remove(0, i, 16);

    // second row cannot be 16
    remove(1, i, 16);

    // if second row is 1, first is 4, third is 9, fourth is 16
    if(grid[1][i] === 1) {
      set(0, i, 4);
      set(2, i, 9);
      set(3, i, 16);
    }

    // if second row is 4, first is 1, third is 16, fourth is 9
    if(grid[1][i] === 4) {
      set(0, i, 1);
      set(2, i, 16);
      set(3, i, 9);
    }

    // if third row is 9, first is 4, second is 1, fourth is 16
    if(grid[1][i] === 4) {
      set(0, i, 4);
      set(1, i, 1);
      set(3, i, 16);
    }

    // if third row is 9 and fourth row is 16, first row is 4, second row is 1
    if(grid[2][i] === 9 && grid[3][i] === 16) {
      set(0, i, 4);
      set(1, i, 1);
    }

    // if third row is 16 and fourth row is 9 first row is 1, second row is 4
    if(grid[2][i] === 16 && grid[3][i] === 9) {
      set(0, i, 1);
      set(1, i, 4);
    }
  }

  // process a clue of 4 for a column
  function one(i) {
    set(0, i, 16);
  }

  function processClues() {
    for(let j = 0; j < 4; j++) {
      for(let i = 0; i < 4; i++) {
        if(clues[i] === 1) { one(i); }
        if(clues[i] === 2) { two(i); }
        if(clues[i] === 3) { three(i); }
        if(clues[i] === 4) { four(i); }
        resolve();
        rotate();
        resolve();
        for(let i = 0; i < 3; i++) {
          rotate();
        }
      }
      rotate();
    }
  }

  let z = 0;
  let solved = false;
  while(!solved && z < 2) {
    processClues();
    solved = check();
    z++;
  }



  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      grid[i][j] = Math.pow(grid[i][j], 0.5);
    }
  }

  return(grid);
}

a = solvePuzzle([ 3, 2, 2, 1, 1, 2, 4, 2, 2, 1, 3, 2, 3, 1, 2, 3 ]);

for(i = 0; i < 4; i++) {
  console.log(a[i]);
}