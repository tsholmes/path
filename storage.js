// storage.js

var adapter = require("./fsstorage.js");

var datasets = { };
var pending = { };
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

function getDatasets(type,callback) {
  if (type in datasets) {
    callback(datasets[type]);
  } else {
    loadDatasets(type, function(){
      getDatasets(type,callback);
    });
  }
}

function putDataset(type,id,data,callback) {
  if (!pending[type] || !pending[type][id]) {
    return false;
  }
  delete pending[type][id];
  datasets[type][id] = data;
  saveDatasets(type);
  return true;
}

function loadDatasets(type,callback) {
  adapter.loadDatasets(type,function(data){
    datasets[type] = data;
    modcount[type] = 0;
    pending[type] = {};
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
    pending[type][id] = true;
    adapter.saveId(nextId, function(){});
    callback(id);
  }
}

module.exports = {
  getDataset: getDataset,
  putDataset: putDataset,
  newId: newId,
  getDatasets: getDatasets
};
