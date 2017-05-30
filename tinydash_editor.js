(function() {
  var LIGHTCOL = "#09F";
  function toElement(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
  }
  TD.startEditor = function() {
    // clear out any existing edit tags
    TD.stopEditor();
    // add edit tags
    var els = document.getElementsByClassName("td");
    for (var i=0;i<els.length;i++) {
      var editor = toElement('<div class="tdedit"><div class="tdeicon tdemove">&#x270B</div><div class="tdeicon tderesize">&#x21F2</div><div class="tdeicon tdedelete">&#x2612</div></div>');
      els[i].appendChild(editor);
    }
  };
  TD.stopEditor = function() {
    var els = document.getElementsByClassName("tdedit");
    for (var i=0;i<els.length;i++)
      els[i].remove();
  };
})();
