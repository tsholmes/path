// static/path.js

var ajax = {
  get: function(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      callback(JSON.parse(xhr.responseText));
    };

    xhr.send();
  },
  post: function(url,data,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      callback(JSON.parse(xhr.responseText));
    };

    xhr.send(JSON.stringify(data));
  }
};

function PathAPI(type) {
  this.type = type;
}
PathAPI.prototype.register = function() {
  var t = this;
  ajax.post("/api/register", {type:this.type}, function(data){
    t.id = data.id;
  });
}
PathAPI.prototype.put = function(data) {
  ajax.post("/api/put", {type:this.type,id:this.id,data:data}, function(allData){
    console.log(allData);
  });
}
