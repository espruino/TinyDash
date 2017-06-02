(function() {
  var GRID = 10;
  var editing = false; // are we editing at the moment?
  var editingElement;
  var editingType;
  var lastMousePos = [0,0]; // last event used for positioning

  function toElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
  }

  TD.startEditor = function() {
    // clear out any existing edit tags
    TD.stopEditor();
    editing = true;
    // add edit tags
    var els = document.getElementsByClassName("td");
    for (var i=0;i<els.length;i++) {
      var editor = toElement('<div class="tdedit"><div class="tdeicon tdemove">&#x270B</div><div class="tdeicon tderesize">&#x21F2</div><div class="tdeicon tdedelete">&#x2612</div></div>');
      els[i].appendChild(editor);
      editor.onmousedown = function(e) { dragStart(this, e, ""); };
    }
    els = document.getElementsByClassName("tdemove");
    for (var i=0;i<els.length;i++)
      els[i].onmousedown = function(e) { dragStart(this, e, "move"); };
    els = document.getElementsByClassName("tderesize");
    for (var i=0;i<els.length;i++)
      els[i].onmousedown = function(e) { dragStart(this, e, "resize"); };
  };
  TD.stopEditor = function() {
    editing = false;
    var els = document.getElementsByClassName("tdedit");
    for (var i=els.length-1;i>=0;i--)
      els[i].remove();
  };

  function dragStart(el, e, type) {
    editingElement = el.classList.contains("tdeicon") ?
      el.parentElement.parentElement :
      el.parentElement;
    editingType = type;
    lastMousePos = [e.screenX, e.screenY];
    e.preventDefault();
    e.stopPropagation();
  }

  function dragHandler(obj, dx, dy, xattr, yattr) {
    // move
    obj[xattr] += dx;
    obj[yattr] += dy;
    // gridify
    var gx = obj[xattr] % GRID;
    var gy = obj[yattr] % GRID;
    obj[xattr] -= gx;
    obj[yattr] -= gy;
    lastMousePos[0] -= gx;
    lastMousePos[1] -= gy;
  }

  window.addEventListener("mousemove", function(e) {
    if (!editing) return;
    var dx = e.screenX - lastMousePos[0];
    var dy = e.screenY - lastMousePos[1];
    lastMousePos = [e.screenX, e.screenY];
    if (editingElement) {
      if (editingType=="move") dragHandler(editingElement.opts, dx, dy, "x", "y");
      if (editingType=="resize") dragHandler(editingElement.opts, dx, dy, "width", "height");
      // update actual DOM element
      editingElement.style.left = editingElement.opts.x+"px";
      editingElement.style.top = editingElement.opts.y+"px";
      editingElement.style.width = editingElement.opts.width+"px";
      editingElement.style.height = editingElement.opts.height+"px";
      if (editingElement.onresize)
        editingElement.onresize();
    }
  });
  window.addEventListener("mouseup", function(e) {
    if (!editingElement) {
      console.log("Click on background -> disable editor");
      TD.stopEditor();
    }
    editingElement = undefined;
    editingType = undefined;
  });
})();
