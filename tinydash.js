/* All elements have x/y/width/height,name

  TODO:
    terminal
    graph
    dial
*/
var TD = {};
(function() {
  var LIGHTCOL = "#09F";
  function toElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
  }
  function togglePressed(el) {
    el.pressed = 0|!+el.getAttribute("pressed");
    el.setAttribute("pressed", el.pressed);
    if (el.name) {
      var o = {};
      o[el.name] = el.pressed;
      handleChange(o);
    }
  }
  function formatText(txt) {
    if ("number"!=typeof txt)
      return txt;
    if (Math.floor(txt)==txt) return txt; // ints
    if (Math.abs(txt)>1000) return txt.toFixed(0);
    if (Math.abs(txt)>100) return txt.toFixed(1);
    return txt.toFixed(2);
  }
  /// set up position/etc on the html element
  function setup(opts, el) {
    el.style="width:"+opts.width+"px;height:"+opts.height+"px;left:"+opts.x+"px;top:"+opts.y+"px;";
    el.opts = opts;
    if (opts.name!==undefined) el.name=opts.name;
    return el;
  }
  function handleChange(data) {
    console.log("Change", data);
  }

  // --------------------------------------------------------------------------
  /* Update any named elements with the new data */
  TD.update= function(data) {
    var els = document.getElementsByClassName("td");
    for (var i=0;i<els.length;i++) {
      if (els[i].name && els[i].setValue && els[i].name in data)
        els[i].setValue(data[els[i].name]);
    }
  }

  // --------------------------------------------------------------------------
  TD.label = function(opts) {
    return setup(opts,toElement('<div class="td td_label"><span>Hello</span></div>'));
  };
  /* {label, glyph, value}*/
  TD.button= function(opts) {
    var pressed = opts.value?1:0;
    opts.glyph = opts.glyph || "&#x1f4a1;";
    var el = setup(opts,toElement('<div class="td td_btn" pressed="'+pressed+'"><span>'+opts.label+'</span><div class="td_btn_a">'+opts.glyph+'</div></div>'));
    el.getElementsByClassName("td_btn_a")[0].onclick = function() {
      togglePressed(el);
    };
    el.setValue = function(v) {
      el.pressed = v?1:0;
      el.setAttribute("pressed", el.pressed);
    };
    return el;
  };
  /* {label,value}*/
  TD.toggle= function(opts) {
    var pressed = opts.value?1:0;
    var el = setup(opts,toElement('<div class="td td_toggle" pressed="'+pressed+'"><span>'+opts.label+'</span><div class="td_toggle_a"><div class="td_toggle_b"/></div></div>'));
    el.getElementsByClassName("td_toggle_a")[0].onclick = function() {
      togglePressed(el);
    };
    el.setValue = function(v) {
      el.pressed = v?1:0;
      el.setAttribute("pressed", el.pressed);
    };
    return el;
  };
  /* {label,value}*/
  TD.value= function(opts) {
    var v = (opts.value===undefined)?"?":opts.value;
    var el = setup(opts,toElement('<div class="td td_val"><span>'+opts.label+'</span><div class="td_val_a">'+v+'</div></div>'));
    el.setValue = function(v) {
      el.getElementsByClassName("td_val_a")[0].innerHTML = formatText(v);
    };
    return el;
  };
  /* {label,value,min,max}*/
  TD.guage= function(opts) {
    var v = (opts.value===undefined)?0:opts.value;
    var min = (opts.min===undefined)?0:opts.min;
    var max = (opts.max===undefined)?1:opts.max;
    var el = setup(opts,toElement('<div class="td td_guage"><span>'+opts.label+'</span><canvas></canvas><div class="td_guage_a">'+v+'</div></div>'));
    el.value = v;
    var c = el.getElementsByTagName("canvas")[0];
    var ctx = c.getContext("2d");
    function draw() {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      var s = Math.min(c.width,c.height);
      ctx.lineCap="round";
      ctx.clearRect(0,0,c.width,c.height);
      ctx.beginPath();
      ctx.lineWidth=20;
      ctx.strokeStyle = "#000";
      ctx.arc(s/2, s/2+20, (s/2)-24, Math.PI*0.75, 2.25 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth=16;
      ctx.strokeStyle = LIGHTCOL;
      var v = (el.value-min) / (max-min);
      if (v<0) v=0;
      if (v>1) v=1;
      ctx.arc(s/2, s/2+20, (s/2)-24, Math.PI*0.75, (0.75+(1.5*v))*Math.PI);
      ctx.stroke();
    }
    setTimeout(draw,100);
    el.onresize = draw;
    el.setValue = function(v) {
      el.value = v;
      el.getElementsByClassName("td_guage_a")[0].innerHTML = formatText(v);
      draw();
    };
    return el;
  };
  /* {label}*/
  TD.graph= function(opts) {
    var el = setup(opts,toElement('<div class="td td_graph"><span>'+opts.label+'</span><canvas></canvas></div>'));
    var c = el.getElementsByTagName("canvas")[0];
    var ctx = c.getContext("2d");
    function draw() {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      var s = Math.min(c.width,c.height);
      var xbase = 18;
      var ybase = c.height-18;
      var xs = (c.width-8-xbase);
      var ys = (ybase-28);
      ctx.fillStyle = "#000";
      ctx.fillRect(4,24,c.width-8,c.height-28);
      ctx.beginPath();
      ctx.strokeStyle = LIGHTCOL;
      for (var i=0;i<100;i++) {
        var v = (Math.cos(i/10)+1)/2;
        ctx.lineTo(xbase+(xs*i/100),ybase-v*ys);
      }
      ctx.stroke();
      // axes
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.moveTo(xbase,ybase-ys);
      ctx.lineTo(xbase,ybase+10);
      ctx.moveTo(xbase-10,ybase);
      ctx.lineTo(xbase+xs,ybase);
      ctx.stroke();
    }
    setTimeout(draw,100);
    el.onresize = draw;
    return el;
  };
  /* {label}*/
  TD.log= function(opts) {
    var lines = ["This is a test","of logging","in multiple lines"];
    for (var i=0;i<10;i++) lines.push(i);
    var el = setup(opts,toElement('<div class="td td_log"><span>'+opts.label+'</span><div class="td_log_a td_scrollable">'+lines.join("<br/>\n")+'</div></div>'));
    return el;
  };

})();
