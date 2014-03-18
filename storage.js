// storage.js

var adapter = require("./fsstorage.js");

var datasets = { };
var modcount = { };
var saving = { };
var nextId = -1;

function getDataset(type,id,callback) {
  if (type in datasets) {
    if (id in datasets[type]) {
      callback(datasets[type][id]);
    } else {
      console.error("INVALID ID");
      var data = [];
      datasets[type][id] = data;
      callback(data);
    }
  } else {
    loadDatasets(type,function(){
      getDataset(type,id,callback);
    });
  }
}

function appendDataset(type,id,value,callback) {
  getDataset(type,id,function(data){
    data.push(value);
    modcount[type]++;
    saveDatasets(type);
    callback(data);
  });
}

function loadDatasets(type,callback) {
  adapter.loadDatasets(type,function(data){
    datasets[type] = data;
    modcount[type] = 0;
    callback();
  });
}

function saveDatasets(type) {
  if (saving[type]) return;
  saving[type] = true;
  var mod = modcount[type];
  adapter.saveDatasets(type,datasets[type],function(){
    saving[type] = false;
    if (modcount[type] != mod) {
      saveDataset(type);
    }
  });
}

function newId(type, callback) {
  if (nextId == -1) {
    adapter.loadId(function(id){
      nextId = id;
      newId(type, callback);
    });
  } else if (!(type in datasets)) {
    loadDatasets(type,function(){
      newId(type,callback);
    });
  } else {
    var id = nextId++;
    datasets[type][id] = [];
    adapter.saveId(nextId, function(){});
    callback(id);
  }
}

module.exports = {
  getDataset: getDataset,
  appendDataset: appendDataset,
  newId: newId
};
