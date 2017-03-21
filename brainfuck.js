function brainLuck(code, input){
  var data = [0];
  var inputPointer = 0;
  var dataPointer = 0;
  var codePointer = 0;
  var loopPointer = [];
  var output = '';

  function getInput() {
    data[dataPointer] = input[inputPointer].charCodeAt(0);
    inputPointer++;
  }

  function increment() {
    if (data[dataPointer] === 255) {
      data[dataPointer] = 0;
    } else {
      data[dataPointer]++;
    }
  }

  function decrement() {
    if (data[dataPointer] === 0) {
      data[dataPointer] = 255;
    } else {
      data[dataPointer]--;
    }
  }

  function dataOut() {
      output = output + String.fromCharCode(data[dataPointer]);
  }

  function findExit(cp) {
    cp++;
    while (code[cp] !== ']') {
      if (code[cp] === '[') {
        cp = findExit(cp);
      }
      cp++;
    }
    return(cp);
  }

  function startLoop() {
    if(data[dataPointer] === 0) {
      codePointer = findExit(codePointer);
    } else {
      loopPointer.push(codePointer);
    }
  }

  function endLoop() {
    if(data[dataPointer] !== 0) {
        codePointer = loopPointer[loopPointer.length -1]
      } else {
      loopPointer.pop();
    }
  }

  function incrementDataPointer() {
    dataPointer++;
    if(data[dataPointer] === undefined) { data[dataPointer] = 0; }
  }

  function decrementDataPointer() {
    if (dataPointer > 0) { dataPointer--; }
  }

  function controller(char) {
    if(char === ',') { getInput(); }
    if(char === '+') { increment(); }
    if(char === '-') { decrement(); }
    if(char === '.') { dataOut(); }
    if(char === '[') { startLoop(); }
    if(char === ']') { endLoop(); }
    if(char === '>') { incrementDataPointer(); }
    if(char === '<') { decrementDataPointer(); }
  }
    
  var count = 0;
  while (codePointer < code.length && count < 100000) {
    controller(code[codePointer]);
    codePointer++;
    count++;
  }

  return(output);
}
//console.log(brainLuck(',+[-.,+]', 'Codewars'+String.fromCharCode(255)));
//console.log(brainLuck(',[.[-],]', 'Codewars'+String.fromCharCode(0)));
//console.log(brainLuck(',>,<[>[->+>+<<]>>[-<<+>>]<<<-]>>.', String.fromCharCode(8,9)));

console.log(brainLuck('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.'));

console.log(brainLuck(',>+>>>>++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++<<<<<<[>[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]<[>++++++++++[-<-[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<[>>>+<<<-]>>[-]]<<]>>>[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<+>>[-]]<<<<<<<]>>>>>[++++++++++++++++++++++++++++++++++++++++++++++++.[-]]++++++++++<[->-<]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<<<<<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<-[>>.>.<<<[-]]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[<+>-]>[<+>-]<<<-]', String.fromCharCode(10)));