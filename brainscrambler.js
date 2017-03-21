const Interpreter = function() {
  var stack = [[ 0 ],[0],[0]];
  var index = 0;
  return {
    read:function(input){
      let nums = [0,1,2,3,4,5,6,7,8,9];
      let output = '';
      let current = stack[index][stack[index].length - 1];

      function pushZero() { stack[index].push(0); current = 0; };
      function outPut() { 
        if(current !== null) {
          output = output + current.toString();
        }
      }
      function add() {
        if (current === null) {
          current = 0;
          stack[index].push(0);
        } else {
          stack[index][stack[index].length - 1] += 1;
          current += 1;
        }
      }
      
      function subtract() {
        if (current === null) {
          current = 0;
          stack[index].push(0);
        } else {
          stack[index][stack[index].length - 1] -= 1;
          current -= 1;
        }
      }

      function rotate() {
        if (index === 2) {
          index = 0;
        } else {
          index++;
        }
        current = stack[index][stack[index].length - 1];
      }

      function pushRight() {
        if(current !== null) {
          if (index === 2) { right = 0; } else { right = index + 1; }
          stack[right].push(current);
          stack[index].pop();
          if (stack[index].length === 0) {
            current = null;
          } else {
            current = stack[index][stack[index].length - 1];
          }
        }
      }

      function pushLeft() {
        if(current !== null) {
          if (index === 0) { left = 2; } else { left = index - 1; }
          stack[left].push(current);
          stack[index].pop();
          if (stack[index].length === 0) {
            current = null;
          } else {
            current = stack[index][stack[index].length - 1];
          }
        }
      }

      function takeNumber(i) {
        let count = 1;
        let n = '';
        while (nums.includes(parseInt(input[i + count]))) {
          n = n + input[i + count];
          count++;
        }
        current = parseInt(n);
        stack[index].push(current);
      }

      function controller(input) {
        for(let i = 0; i < input.length; i++) {
          let task = input[i];
          if (nums.includes(parseInt(task))) { continue; }
          if (task === '*') { pushZero() };
          if (task === '.') { outPut(); }
          if (task === '+') { add(); }
          if (task === '-') { subtract(); }
          if (task === '#') { rotate(); }
          if (task === '>') { pushRight(); }
          if (task === '<') { pushLeft(); }
          if (task === ',') { takeNumber(i); }
          if (task === '[') { 
            i++;
            let str = '';
            while(input[i] !== ']') {
              str = str + input[i];
              i++;
            }
            while(current > 0) {
              controller(str);
            }
          }
        }
      }

      controller(input);
      return(output);
    }
  };
}

var inter = new(Interpreter);
console.log(inter.read('+#.##<.#*#<**>+>+##+.+.<+'));  // 00998999
//console.log(inter.read('*++.'));
//console.log(inter.read('*+-.'));
//console.log(inter.read('*+*.'));
//console.log(inter.read('*+++-+.'));

//console.log(inter.read('####*.'))         // '0'     
//console.log(inter.read('*.#*+.#*++.#.'))  // '0120'  
//console.log(inter.read('*++>#.'))         // '2'     
//console.log(inter.read('*+++<##.'))       // '3'     
//console.log(inter.read('***++-+>#>#>#.')) // '2'     
//
//console.log(inter.read(',5[.-]')            ) // '54321'     
//console.log(inter.read(',9[.-]')            ) // '987654321' 
//console.log(inter.read(',10>*#[-##.+#]')    ) // '0123456789'
//console.log(inter.read(',4>*++#[-##.++#]')  ) // '2468'      
//console.log(inter.read(',9[.--]')           ) // '97531'

