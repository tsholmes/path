window.addEventListener("load", function(){

  var mt = new MouseTracker(document.body);

  document.body.addEventListener("mousedown", function(){
    mt.start();
  });
  document.body.addEventListener("mouseup", function(){
    var pts = mt.stop();
    PathAPI.putData("mc", pts, function(){});
  });

});
