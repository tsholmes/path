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

PathAPI = {
  putData: function(type,data,callback) {
    ajax.post("/api/register", {type:type}, function(idRes) {
      if (!("id" in idRes)) {
        callback("Failed to register id");
        return;
      }
      ajax.post("/api/put", {type:type,id:idRes.id,data:data}, function(putRes){
        if (!putRes.success) {
          callback("Failed to put data");
          return;
        }
        callback();
      });
    });
  },
  getData: function(type,callback) {
    ajax.post("/api/get", {type:type}, function(data){
      callback(data);
    });
  }
}
