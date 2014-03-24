window.addEventListener("load", function(){
  var paths = [];
  var maxTime = 0;
  var divs = [];
  var curTime = 0;
  PathAPI.getData("mc", function(data){
    data = data.data;
    for (var x in data) {
      var set = data[x];
      var span = set[set.length-1].time - set[0].time;
      maxTime = Math.max(maxTime, span);
    }
    for (var x in data) {
      var set = data[x];
      var len = set.length;
      var start = set[0].time;
      var span = set[set.length-1].time - set[0].time;
      var path = [];
      for (var i = 0; i < len; i++) {
        var time = set[i].time - start;
        time = (time * maxTime) / span;
        path.push({x:set[i].x,y:set[i].y,time:time});
      }
      paths.push(path);
    }
    for (var i = 0; i < paths.length; i++) {
      var div = document.createElement("div");
      div.style.width = 4;
      div.style.height = 4;
      div.style.border = div.style.margin = div.style.padding = "";
      div.style.marginLeft = div.style.marginTop = -2;
      div.style.backgroundColor = "black";
      div.style.position = "absolute";
      document.body.appendChild(div);
      divs.push(div);
    }
    advance();
  });

  var getPts = function(time) {
    var pts = [];
    for (var i = 0; i < paths.length; i++) {
      var j = 0;
      var path = paths[i];
      while (j < path.length-1 && path[j+1].time <= time) {
        j++;
      }
      var pt1 = path[j];
      var pt2 = (j < path.length-1)?path[j+1]:path[j];
      if (pt1.time < pt2.time) {
        var it = (time - pt1.time) / (pt2.time - pt1.time);
        var x = pt1.x + it * (pt2.x - pt1.x);
        var y = pt1.y + it * (pt2.y - pt1.y);
        pts.push({x:x,y:y});
      } else {
        pts.push({x:pt1.x,y:pt1.y});
      }
    }
    return pts;
  };

  var advance = function() {
    curTime = (curTime + 1) % (maxTime + 1);
    var pts = getPts(curTime);
    for (var i = 0; i < divs.length; i++) {
      divs[i].style.left = pts[i].x;
      divs[i].style.top = pts[i].y;
    }
    setTimeout(advance, 1);
  };

});
