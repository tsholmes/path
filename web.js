// web.js

var express = require("express");
var storage = require("./storage");

var app = express();

app.use(express.static(__dirname + "/static"));
app.use(express.bodyParser());

app.get('/api', function(req,res){
  res.send("Hello World");
});

app.post('/api/register', function(req,res) {
  var type = req.body.type;
  storage.newId(type, function(id){
    res.send({id:id});
  });
});

app.post('/api/put', function(req,res) {
  var type = req.body.type;
  var id = req.body.id;
  var data = req.body.data;
  storage.appendDataset(type,id,data,function(alldata){
    res.send(alldata);
  });
});

var PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
  console.log("Listening on " + PORT);
});
