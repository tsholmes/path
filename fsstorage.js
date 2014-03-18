// fsstorage.js

var fs = require("fs");

var DATADIR = "data";

if (!fs.existsSync(DATADIR)) {
  fs.mkdirSync(DATADIR);
}

function loadDatasets(type,callback) {
  var path = DATADIR + "/" + type + ".json";
  fs.exists(path, function(exists){
    if (exists) {
      fs.readFile(path, {encoding:"utf8"}, function(err,data) {
        if (err) {
          console.error(err);
          callback({});
        } else {
          callback(JSON.parse(data));
        }
      });
    } else {
      callback({});
    }
  });
}

function saveDatasets(type,data,callback) {
  if (type == "id") {
    throw new Error("Reserved dataset name: id");
  }
  var path = DATADIR + "/" + type + ".json";
  fs.writeFile(path, JSON.stringify(data), {}, function(err){
    if (err) {
      console.error(err);
    }
    callback();
  });
}

function loadId(callback) {
  var path = DATADIR + "/id.json";
  fs.exists(path, function(exists) {
    if (exists) {
      fs.readFile(path, {encoding:"utf8"}, function(err,data) {
        if (err) {
          console.error(err);
          callback(0);
        } else {
          callback(JSON.parse(data).id);
        }
      });
    } else {
      callback(0);
    }
  });
}

function saveId(id,callback) {
  var path = DATADIR + "/id.json";
  fs.writeFile(path, JSON.stringify({id:id}), {}, function(err){
    if (err) {
      console.error(err);
    }
    callback();
  });
}

module.exports = {
  loadDatasets: loadDatasets,
  saveDatasets: saveDatasets,
  loadId: loadId,
  saveId: saveId
};
