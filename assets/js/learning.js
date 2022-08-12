// var products = [{
//   index: 1,
//   id: 'p1',
//   name: 'Samsung TV',
//   price: 500000
// },
// {
//   index: 2,
//   id: 'p2',
//   name: 'Pixel 4a',
//   price: 250000
// },
// {
//   index: 3,
//   id: 'p3',
//   name: 'PS 5',
//   price: 300000
// },
// {
//   index: 4,
//   id: 'p4',
//   name: 'MacBook Air',
//   price: 800000
// },
// {
//   index: 5,
//   id: 'p5',
//   name: 'Apple Watch',
//   price: 95000
// },
// {
//   index: 6,
//   id: 'p6',
//   name: 'Air Pods',
//   price: 75000
// },

// ]







var counter = 0;
var color;
var noOftext =document.getElementById('counter');
noOftext.innerHTML=counter;


// function mouse()
// {
//   document.getElementById('lol').style.display='none'
//   document.getElementById('tv').style.display='block'


// }
// function house()
// {
//   document.getElementById('lol').style.display='block'
//   document.getElementById('tv').style.display='none'
  









function payWithPaystack() {   
    let handler = PaystackPop.setup({
      key: 'pk_test_a3a21e27e5d115f49b289bbf9231c00dedc10e57', // Replace with your public key
      email: document.getElementById("email-address").value,
      amount: document.getElementById("amount").value * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        alert('Window closed.');
      },
      callback: function(response){
        
      }
    });
  
    handler.openIframe();
  }
  