var myaccount=localStorage.getItem("myaddress");

let abi= [
{
"anonymous": false,
"inputs": [
{
  "indexed": true,
  "internalType": "address",
  "name": "from",
  "type": "address"
},
{
  "indexed": false,
  "internalType": "string",
  "name": "message",
  "type": "string"
},
{
  "indexed": false,
  "internalType": "address",
  "name": "to",
  "type": "address"
},
{
  "indexed": false,
  "internalType": "string",
  "name": "timestamp",
  "type": "string"
}
],
"name": "message",
"type": "event"
},
{
"inputs": [
{
  "internalType": "address",
  "name": "_to",
  "type": "address"
},
{
  "internalType": "string",
  "name": "_message",
  "type": "string"
},
{
  "internalType": "string",
  "name": "time",
  "type": "string"
}
],
"name": "sendMessage",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
}
];
  let contractAddress='0xbC03406F992c6E8959DcEEC25e561790cf227F02';


// onstart
window.onload=function(){
//console.log(myaccount);
if(myaccount==null){
window.location.replace('index.html');
}

add();
};

function back()
{
localStorage.removeItem("myaddress");
window.location.replace('index.html');
}
function addMessages(a) {
var id = "messagepart" + a.id;

let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
let mycontract = new web3.eth.Contract(abi, contractAddress);
mycontract.getPastEvents('message', {
  fromBlock: 0,
  toBlock: 'latest',
}, function (err, data) {
  let x = data.length;
  document.getElementById('messageContainer').innerHTML = '';
  for (var n = 0; n < x; n++) {
      var timestamp = 0;

      if (data[n].returnValues.from == a.id && data[n].returnValues.to == myaccount) {
          var timestamp = data[n].returnValues.time;
          var decoration = '<div class="chat-message received">' +
          '<div class="alert alert-dark" role="alert">' +
          data[n].returnValues.message +
          '<h6 style="font-size: 0.6em;">recieved ' + data[n].returnValues.timestamp + '</h6>' +
          '</div>' +
        '</div>'
          document.getElementById('messageContainer').innerHTML += decoration;
      } else if (data[n].returnValues.from == myaccount && data[n].returnValues.to == a.id) {
          var timestamp = data[n].returnValues.time;
          var decoration = '<div class="chat-message sent">' +
          '<div class="alert alert-light" role="alert">' +
          data[n].returnValues.message +
          '<h6 style="font-size: 0.6em;">sent ' + data[n].returnValues.timestamp + '</h6>' +
          '</div>' +
        '</div>'
          document.getElementById('messageContainer').innerHTML += decoration;
      }
  }
  document.getElementById('messageContainer').innerHTML += '<div class="input-group mb-0" id="groupinputbutton' + a.id + '">' +
  '<input type="text" class="form-control" placeholder="Type message" id="inputbutton' + a.id + '"aria-label="Recipient username" aria-describedby="button-addon2" />' +
  '<button class="btn btn-warning" type="button" onclick=onSend(this) id="button' + a.id + '">' +
  'Send' +
  '</button>' +
'</div>'
});
};


function onSend(det){
//console.log("Press zala send by:"+det.id);
var message=document.getElementById("input"+det.id).value;
var to=det.id.split('on')[1];
let web3=new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
let mycontract=new web3.eth.Contract(abi,contractAddress);
var date=new Date().toLocaleDateString("IN");
    var time=new Date().toLocaleTimeString("IN");
    time=time.split('.')
    var accurateTime= date+' '+time[0]+':'+time[1];
    
mycontract.methods.sendMessage(to,message,accurateTime).send({from:myaccount},function(err,transcationHash){
  if(err){
    console.log(error);
  }
  else{

    var decoration='<div class="row justify-content-start">'+
      '<div class="col-4 col-md-auto">'+
          '<div class="alert alert-primary" role="alert">'+
            message+
            '<h6 style="font-size: 0.6em;">send '+accurateTime+'</h6>'+
            '</div>'+
      '</div>'+
    '</div>'
    var buttonText=document.getElementById("groupinputbutton"+to).innerHTML;
    document.getElementById("groupinputbutton"+to).remove();
    //document.getElementById("button"+det.id).remove();
      document.getElementById("messagepart"+to).innerHTML+=decoration;
      document.getElementById("messagepart"+to).innerHTML+='<div class="input-group mb-0" id="groupinputbutton'+to+'">'+
        '<input type="text" class="form-control" placeholder="Type message" id="inputbutton'+to+'"aria-label="Recipien username" aria-describedby="button-addon2" />'+
        '<button class="btn btn-warning" type="button" onclick=onSend(this) id="button'+to+'" style="padding-top: .55rem;">'+
          'Send'+
        '</button>'+
      '</div>' 
      document.getElementById("groupinputbutton"+to).scrollIntoView();
         
  }
});
//      console.log('From:'+myaccount+' message: '+message+' To: '+to);
}



function add() {
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
web3.eth.getAccounts(function (error, accounts) {
  if (error) {
  console.log("Error retrieving accounts:", error);
  return;
} 
console.log("Retrieved accounts:", accounts);
  var n = accounts.length;
  var temp='';
  for(var i=0;i<n;i++)
  {
    if(accounts[i]==myaccount){
      continue;
    }
    temp = temp + '<div class="chat-user" id="' + accounts[i] + '" onclick="addMessages(this)">' +
'<div class="chat-user-name">' + accounts[i] + '</div>' + '</div>' + '<div class="chat-messages" id="messagepart' + accounts[i] + '">' +
'<!-- Placeholder for messages -->' + '</div>';
  }

  
  document.getElementById("userList").innerHTML = temp;
  document.getElementById("Profile").innerHTML = 'Account:'+myaccount;
});


}
  