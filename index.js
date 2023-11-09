const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(bodyParser.json());



function handleBaseRoute(req, res){
    res.sendFile(__dirname + '/index.html');
}

function handleSum(req, res){
    var answer = {
        sum : calculateSum(req.query.value)
    }
    res.send(answer);
}

function addUser(req, res){
    console.log(req.body);
    var answer = {
        data : 'user added successfully'
    }
    res.send(answer);
}

app.get('/', handleBaseRoute);
app.get('/CalculateSum', handleSum);
app.get('/AddUser',addUser);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function calculateSum(counter){
    var sum = 0;
    for (var i=0; i< counter ; i++){
         sum+=i;
    } 
    return sum;
}

console.log(calculateSum(100));