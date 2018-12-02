$.fn.visible = function(partial) {

   var $t            = $(this),
       $w            = $(window),
       viewTop       = $w.scrollTop() + 50,
       viewBottom    = viewTop + $w.height() - 50,
       _top          = $t.offset().top,
       _bottom       = _top + $t.height(),
       compareTop    = partial === true ? _bottom : _top,
       compareBottom = partial === true ? _top : _bottom;
 return ((compareBottom <= viewBottom) );

};


function initializeAppearable(){
  var win = $(window);
  var allMods = $('.appearable');

  allMods.each(function(i, el) {
    var el = $(el);
    if (!el.hasClass("appear") && el.visible(true)) {
      el.addClass("appear");
    }
  });

  win.scroll(function(event) {
    allMods.each(function(i, el) {
      var el = $(el);
      if (!el.hasClass("appear") && el.visible(true)) {
        el.addClass("appear");
      }
    });
  });
}

$(document).ready(function(){
  $('#navbarToggle, #headerFade').click(function(e){
    let header = $('.navbar-phone')
    if(header.hasClass('navToggled')){
      header.removeClass('navToggled').addClass('untoggled')
      $('#headerFade').css('opacity', 0)
      setTimeout(() => { $('#headerFade').css('z-index', -1) }, 200)
    }
    else{
      header.removeClass('untoggled').addClass('navToggled')
      $('#headerFade').css('z-index', 4).css('opacity', 1)
    }
  })
})

function startLoading(){
  $('#loading').addClass('loading')
}
function endLoading(){
  $('#loading').removeClass('loading')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function formatNumber(int){
  var str = "" + int
  if(int >= 1000000)
    str = str.slice(0, -6) + " " + str.slice(-6, -3) + " " + str.slice(-3)
  else if(int >= 10000)
    str = str.slice(0, -3) + " " + str.slice(-3)
  return `<span style="white-space: nowrap">${str}</span>`
}
function generateID(){
  var S4 = function(){
    return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' +S4() + '-' + S4() +S4() +S4())
}
