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
      ctx.lineWidth=20;
      ctx.clearRect(0,0,c.width,c.height);
      ctx.beginPath();
      ctx.strokeStyle = "#000";
      ctx.arc(s/2, s/2, (s/2)-24, Math.PI*0.75, 2.25 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = LIGHTCOL;
      var v = 0.2;
      ctx.arc(s/2, s/2, (s/2)-24, Math.PI*0.75, (0.75+(1.5*v))*Math.PI);
      ctx.stroke();
    }
    setTimeout(draw,100);
    g.onresize = draw;
    return g;
  };
})();
