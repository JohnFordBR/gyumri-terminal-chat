'use strict';
const net = require('net');
const socket = net.Socket();
const program = require('commander');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
let clients = [];
// Basic layout for blessed

const screen = blessed.screen({
  autoPadding: true,
    smartCSR: true
});




screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});


//Parsing CLI passed arguments
program
  .version('0.0.1')
  .option('-s, --service [optional]', 'Add service')
  .option('-l, --location [optional]', 'Location of server')
  .option('-p, --port [optional]', 'Location of server')
  .parse(process.argv);

//Setting default arguments if empty
const parsedArguments = {
  service: (program.service) ? program.service : "client",
  location: (program.location) ? program.location : "localhost",
  port: (program.port) ? program.port : "5000"
}



//TODO: Separate into modules
if(parsedArguments.service == "server") {

  //Start a TCP Server
  net.createServer( sock => {


clients.push(sock);


    // Data event handler for this socket
    sock.on('data', data => {
      for(let i of clients){
        i.write(data.toString());
      }


    });

    sock.on('close', data => {
sock.write('server is down');
    });


  }).listen(parsedArguments.port, parsedArguments.location);

}else{

  const log = contrib.log(
        { fg: "green"
        , label: 'Chat window'
        , height: "20%"
        , tags: true
        , border: {type: "line", fg: "cyan"} });
  screen.append(log);

  const chatlog = contrib.log(
        { fg: "green"
        , top: '25%'
        , label: 'messages'
        , height: "40%"
        , tags: true
        , border: {type: "line", fg: "cyan"} });
  screen.append(chatlog);
  //Connecting to socket
  socket.connect(parsedArguments.port, parsedArguments.location, () => {
      //Send message to socket server



  const form = blessed.form({
      parent: log,
      name: 'form',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
  });

  const input = blessed.textarea({
      parent: form,
      name: 'input',
      inputOnFocus: true,
      input: true,
      keys: true,
      top: 0,
      left: 0,
      height: 1,
      width: '100%',
      style: {
          fg: 'white',
          bg: 'black',
          focus: {
              bg: 'red',
              fg: 'white'
          }
      }
  });


  const prompt = blessed.Prompt({
    name: 'prompt',
    top:'70%',
    inputOnFocus: true,
    input: true,
    keys: true
  });
const  nickname = '';
  screen.append(prompt);
prompt.focus();
prompt.input('nickname','',(nickname)=>{
    //  the most  difficult part
    //TODO: get  the  input  value  and put it in nickname variable
input.focus();
 });



  input.key('enter', function() {
  socket.write(input.getValue());
  input.clearValue();
  });
  //Connecting to socket
  socket.connect(parsedArguments.port, parsedArguments.location, () => {  //Send message to socket server


  });

  //Event for receiving data from server
  socket.on('data', data => {

      chatlog.log('Data: ' + data);

  });

  // Add a 'close' event handler for the client socket
  socket.on('close', () => {
      //Red log
      chatlog.log("socket closed");
  });
});



  }



//Rendering our UI :)
screen.render();
