// server to server communication
const fetch = require("node-fetch");

function logResponseBody(jsonBody){
    console.log(jsonBody);
}
function callBackFn(result){
    result.json().then(logResponseBody);
}

var sendObj = {
    method : 'GET'
}

fetch('http://localhost:3000/adduser',sendObj).then(callBackFn);