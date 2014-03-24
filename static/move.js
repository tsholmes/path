// static/move.js

function MouseTracker(el) {
  this.el = el;
  this.mouseX = 0;
  this.mouseY = 0;
  this.record = [];
  this.recording = false;

  var onMouse = this.onMouse.bind(this);
  el.addEventListener("mouseenter", onMouse, true);
  el.addEventListener("mousemove", onMouse, true);
  el.addEventListener("mousedown", onMouse, true);
  el.addEventListener("mouseup", onMouse, true);
  el.addEventListener("mouseleave", onMouse, true);
}
MouseTracker.prototype.onMouse = function(e) {
  this.recordMouse(e.clientX,e.clientY,e.timeStamp);
}
MouseTracker.prototype.recordMouse = function(x,y,time) {
  this.mouseX = x;
  this.mouseY = y;
  if (this.recording) {
    this.record.push({x:x,y:y,time:time});
  }
}
MouseTracker.prototype.start = function() {
  this.recording = true;
  this.record = [];
  this.record.push({x:this.mouseX,y:this.mouseY,time:+new Date()});
}
MouseTracker.prototype.stop = function() {
  var ret = this.record;
  this.record = [];
  this.recording = false;
  return ret;
}
