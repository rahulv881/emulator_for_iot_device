var fetch = require('node-fetch');
// Connect to server
var io = require('socket.io-client')

// var socket = io.connect('http://localhost:3000/', {reconnect: true});
var socket = io.connect('https://agile-shelf-81976.herokuapp.com/', {reconnect: true});

// Add a connect listener
socket.on('connect', (socket)=> { 
  console.log('Connected!');

  // set Interval call to the api every second.
  setInterval(() => {
    fetch('http://3.109.76.78:2222/xenergyData.json')
  .then(response => response.json())
  .then(data => {
    sendInfoToServer(data);
  });
  },2000);
});

var lastCollectedData;
// 1. Send device updates to server.
const sendInfoToServer = (data) => {
  try{
    // console.log(data);
    if(socket== null || socket==undefined){
      // TODO: add logger here 
      // console.log("socket is null");
      // console.log(socket);
    }
    // * Data should be different from previous data(using date).
    else if(data==null || data.records == null || data.records.length==0){
      // TODO: add logger here 
      // Corrupt data found ${data}.
      // console.log('4');
    //   {
        // id: null,
        // vid: 'XNG1037',
        // datavia: 'GPRS',
        // tdata: 'XNG1037,32.693079,89.964085,4.16,4.59,4.70,4.50,4.17,4.28,4.14,4.42,4.25,4.20,4.22,4.16,4.79,4.51,4.30,63.88,0.62,74,-1.0,0,A1,122723,4094,v2.1.4',
        // created: '2022-02-27 09:14:59'
    //   }
      
    }
    else if(lastCollectedData!=null && lastCollectedData.created == data.records[data.records.length - 1].created){
      // TODO: add logger
      // Data is same as previous therefore not sending it.
      // console.log('5');
    }
    else{
      // TODO: add logger
      // console.log('6');
      // console.log("Sending data to server");
      lastCollectedData = data.records[data.records.length - 1];
      socket.emit('deviceInfoUpdate',data.records[data.records.length - 1]);
    }

  }catch(e){
    // console.log(e);
    // console.log('7');
    // * TODO: add logger
    // Error: e.toString()
  }
}


// socket.emit("disconnect").then(() => {
//   socket.close();
// });