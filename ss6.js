

function add(a, b) {
    return a + b;
}

function inviteMoreWomen(L) {
  //coding and coding..

  var sum = L.reduce(add, 0); 
  
  if (sum >= 0){
  return true
  }else{
  return false
  }
}

console.log(inviteMoreWomen([1,-1,1]))