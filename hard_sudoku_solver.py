def sudoku_solver(puzzle):
  primes = [2,3,5,7,11,13,17,19,23]
  primes_plus_one = [1,2,3,5,7,11,13,17,19,23]
  nums = range(1, 10)
  
  if puzzle == []:
    print('empty')
  if len(puzzle) != 9:
      raise(ValueError('invalid grid'))
  
  for z in puzzle:
      if len(z) != 9:
          raise(ValueError('invalid grid'))

  for z in puzzle:
      for num in z:
          if num not in nums and num != 0:
              raise(ValueError('invalid value'))

  def populate_choices_left(grid):
    choices = []
    for r in grid:
      choices.append(r[:])
    for r in range(9):
      for c in range(9):
        s = 0
        for prime in primes:
          if choices[r][c] % prime == 0 and choices[r][c] not in primes:
            s += 1
        choices[r][c] = s    
    return(choices)

  for row in range(9):
    for col in range(9):
      n = puzzle[row][col]
      if n not in nums:
        puzzle[row][col] = 223092870;
      else:
        index = nums.index(n)
        puzzle[row][col] = primes[index]

  def resolve(nonet):
    extant = []
    for n in nonet:
      if n in primes:
        extant.append(n)
    for i in range(9):
      if nonet[i] not in primes:
        for element in extant:
          if nonet[i] % element == 0:
            nonet[i] //= element

  def process_quads(grid):
    for i in range(0, 9, 3):
      for j in range(0, 9, 3):
        quad = []
        for row in range(i, i + 3):
          for col in range(j, j + 3):
            quad.append(grid[row][col])
        resolve(quad)
        for row in range(i, i + 3):
          for col in range(j, j + 3):
            grid[row][col] = quad[0]
            del quad[0]

  def process_cols(grid):
    for col in range(9):
      column = []
      for row in range(9):
        column.append(grid[row][col])
      resolve(column)
      for row in range(9):
        grid[row][col] = column[0]
        del column[0]

  def process_rows(grid):
    for row in range(9):
      r = []
      for col in range(9):
        r.append(grid[row][col])
      resolve(r)
      for col in range(9):
        grid[row][col] = r[0]
        del r[0]

  def copy_grid(grid):
    copy = []
    for row in grid:
      copy.append(row[:])
    return copy

  def process_all(grid):
    previous = []
    while previous != grid:
      previous = copy_grid(grid)
      process_quads(grid)
      process_cols(grid)
      process_rows(grid)

  def is_solved(grid):
    for row in grid:
      prod = 1
      s = 0
      for num in row:
        prod *= num
        s += num
      if prod != 223092870 or s != 100:
        return(False)
    for col in range(9):
      prod = 1
      s = 0
      for row in range(9):
        prod *= grid[row][col]
        s += grid[row][col]
      if prod != 223092870 or s != 100:
        return(False)
    for i in range(0,9,3):
      for j in range(0,9,3):
        prod = 1
        s = 0
        for row in range(i, i + 3):
          for col in range(j, j + 3):
            prod *= grid[row][col]
            s += grid[row][col]
        if prod != 223092870 or s != 100:
          return(False)
    return(True)

  def grid_all_primes(grid):
    for row in grid:
      for num in row:
        if num not in primes_plus_one:
          return(False)
    return(True)

  def find_next_incomplete_element(grid, choices):
    for value in range(2,10):
      for row in range(9):
        for col in range(9):
          if choices[row][col] == value:
            return([row, col])

  def find_possible_primes_for_element(grid, point):
    current_composite = grid[point[0]][point[1]]
    possible_primes = []
    for prime in primes:
      if current_composite % prime == 0:
        possible_primes.append(prime)
    return(possible_primes)

  process_all(puzzle)

  possible_grids = [puzzle]

  
  answers = []

  def convert_answer(answer):
    for row in range(9):
      for col in range(9):
        if answer[row][col] in primes:
          i = primes.index(answer[row][col])
          answer[row][col] = nums[i]
    return(answer)

  if is_solved(puzzle):
    jdk = convert_answer(puzzle)
    return(jdk)

  count = 0

  while len(answers) < 2 and count < 10000000 and len(possible_grids) > 0:
    count += 1
    grid_to_check = possible_grids[0]
    del possible_grids[0]
    ch = populate_choices_left(grid_to_check)
    point = find_next_incomplete_element(grid_to_check, ch)
    possible_primes = find_possible_primes_for_element(grid_to_check, point)
    for prime in possible_primes:
      copy = []
      for row in grid_to_check:
        copy.append(row[:])
      copy[point[0]][point[1]] = prime
      process_all(copy)
      solved = is_solved(copy)
      if solved:
        answers.append(copy)
        if count > 100:
          an = convert_answer(copy)
          return(an)
        print('new answer')
        for c in copy:
          print(c)
      else:
        reduced = grid_all_primes(copy)
        if not(reduced):
          possible_grids.append(copy)

  if len(answers) > 1:
    raise(ValueError('more than one solution'))
  answer = answers[0]

  convert_answer(answer) 

  return(answer)

def main():
  puzzle = [[0, 0, 0, 0, 0, 5, 0, 8, 0], 
            [0, 0, 0, 6, 0, 1, 0, 4, 3], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 1, 0, 5, 0, 0, 0, 0, 0], 
            [0, 0, 0, 1, 0, 6, 0, 0, 0], 
            [3, 0, 0, 0, 0, 0, 0, 0, 5], 
            [5, 3, 0, 0, 0, 0, 0, 6, 1], 
            [0, 0, 0, 0, 0, 0, 0, 0, 4], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0]]

  a = sudoku_solver(puzzle)

  print('p_answer')
  for row in a:
    print(row)

main()


         #   [3, 4, 6, 1, 2, 7, 9, 5, 8], 
         #   [7, 8, 5, 6, 9, 4, 1, 3, 2], 
         #   [2, 1, 9, 3, 8, 5, 4, 6, 7], 
         #   [4, 6, 2, 5, 3, 1, 8, 7, 9], 
         #   [9, 3, 1, 2, 7, 8, 6, 4, 5], 
         #   [8, 5, 7, 9, 4, 6, 2, 1, 3], 
         #   [5, 9, 8, 4, 1, 3, 7, 2, 6],
         #   [6, 2, 4, 7, 5, 9, 3, 8, 1],
         #   [1, 7, 3, 8, 6, 2, 5, 9, 4]

#testing = [[5, 7, 13, 2, 3, 17, 23, 11, 19],
#[17, 19, 11, 13, 23, 7, 2, 5, 3],
#[3, 2, 23, 5, 19, 11, 7, 13, 17],
#[7, 13, 3, 11, 5, 2, 19, 17, 23],
#[23, 5, 2, 3, 17, 19, 13, 7, 11],
#[19, 11, 17, 23, 7, 13, 3, 2, 5],
#[11, 23, 19, 7, 2, 5, 17, 3, 13],
#[13, 3, 7, 17, 11, 23, 5, 19, 2],
#[2, 17, 5, 19, 13, 3, 11, 23, 7]]


 # puzzle = [[0, 0, 0, 0, 0, 2, 7, 5, 0],
 #          [0, 1, 8, 0, 9, 0, 0, 0, 0],
 #          [0, 0, 0, 0, 0, 0, 0, 0, 0],
 #          [4, 9, 0, 0, 0, 0, 0, 0, 0],
 #          [0, 3, 0, 0, 0, 0, 0, 0, 8],
 #          [0, 0, 0, 7, 0, 0, 2, 0, 0],
 #          [0, 0, 0, 0, 3, 0, 0, 0, 9],
 #          [7, 0, 0, 0, 0, 0, 0, 0, 0],
 #          [5, 0, 0, 0, 0, 0, 0, 8, 0]]