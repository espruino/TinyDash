/* All elements have x/y/width/height

  TODO:
    terminal
    graph
    dial
*/
var TD = {
  elements : []
};
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
  }
  /// set up position/etc on the html element
  function setup(opts, el) {
    TD.elements.push(el);
    el.style="width:"+opts.width+"px;height:"+opts.height+"px;left:"+opts.x+"px;top:"+opts.y+"px;";
    return el;
  }

  TD.label = function(opts) {
    return setup(opts,toElement('<div class="td td_label"><span>Hello</span></div>'));
  };
  /* {label, glyph}*/
  TD.button= function(opts) {
    opts.glyph = opts.glyph || "&#x1f4a1;";
    var b = setup(opts,toElement('<div class="td td_btn" pressed="1"><span>'+opts.label+'</span><div class="td_btn_a">'+opts.glyph+'</div></div>'));
    b.getElementsByClassName("td_btn_a")[0].onclick = function() {
      togglePressed(b);
    };
    return b;
  };
  /* {label}*/
  TD.toggle= function(opts) {
    var t = setup(opts,toElement('<div class="td td_toggle"><span>'+opts.label+'</span><div class="td_toggle_a"><div class="td_toggle_b"/></div></div>'));
    t.getElementsByClassName("td_toggle_a")[0].onclick = function() {
      togglePressed(t);
    };
    return t;
  };
  /* {label}*/
  TD.value= function(opts) {
    return setup(opts,toElement('<div class="td td_val"><span>'+opts.label+'</span><div class="td_val_a">??</div></div>'));
  };
  /* {label}*/
  TD.guage= function(opts) {
    var g = setup(opts,toElement('<div class="td td_guage"><span>'+opts.label+'</span><canvas></canvas><div class="td_guage_a">??</div></div>'));
    var c = g.getElementsByTagName("canvas")[0];
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
      var v = 0.2;
      ctx.arc(s/2, s/2+20, (s/2)-24, Math.PI*0.75, (0.75+(1.5*v))*Math.PI);
      ctx.stroke();
    }
    setTimeout(draw,100);
    g.onresize = draw;
    return g;
  };
  /* {label}*/
  TD.graph= function(opts) {
    var g = setup(opts,toElement('<div class="td td_graph"><span>'+opts.label+'</span><canvas></canvas></div>'));
    var c = g.getElementsByTagName("canvas")[0];
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
    g.onresize = draw;
    return g;
  };
  /* {label}*/
  TD.log= function(opts) {
    var lines = ["This is a test","of logging","in multiple lines"];
    for (var i=0;i<10;i++) lines.push(i);
    return setup(opts,toElement('<div class="td td_log"><span>'+opts.label+'</span><div class="td_log_a td_scrollable">'+lines.join("<br/>\n")+'</div></div>'));
  };
})();
