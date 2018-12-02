$(document).ready(function(){
  initializeAppearable()
  $('#mainCarousel').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    speed: 700,
    cssEase: 'ease-in-out',
    prevArrow: $('#left'),
    nextArrow: $('#right')
  })
  var brand = $($('.carousel-image')[1]).data('brand')
  changeBrandWatches(brand)

  var win = $(window);
  win.scroll(function(){
    $('.main-slider-image').css('object-position', '50% ' + Math.min(win.scrollTop(), win.height()) / win.height() * 33 + '%')  })
  $('#logo-slider').slick({
    variableWidth: true,
    slidesToShow: 3,
    infinite: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 900,
    dots: true,
    speed: 700,
    cssEase: 'ease-in-out',
    arrows: false
  })
  $('#mainCarousel').on('afterChange', function(e, slick, currentSlide){
    var brand = $($('.carousel-image')[currentSlide + 1]).data('brand')
    changeBrandWatches(brand)
  })
})

function changeBrandWatches(brand){
  var watches = {
    'tag-heuer': [
      { name: 'Monaco - Calibre 12', url: '/watches/CAW211P.FC6356', id: 'CAW211P.FC6356', image: '/images/index/monaco12.png', brand: 'Tag Heuer' }
    ],
    'nomination': [
      { name: 'Klasszikus Évforduló', url: '/jewellery/classic_anniversary', id: 'classic_anniversary', image: '/images/index/classic_anniversary.jpg',  brand: 'Nomination' }
    ],
    'longines': [
      { name: 'Monaco - Calibre 12', url: '/watches/CAW211P.FC6356', id: 'CAW211P.FC6356', image: '/images/index/monaco12.png', brand: 'Longines' }
    ],
    'meistersinger': [
      { name: 'Lunascope', url:'/watches/LS908', id: 'LS908', image: '/images/index/lunascope.png', brand: 'MeisterSinger'}
    ]
  }
  $('#mainWatches').html('')
  for (watch of watches[brand]) {
    renderWatch(watch)
  }
  $('#mainWatches').on('click', '.watch', (e) => { window.location = $(e.currentTarget).data('url') })
}

function renderWatch(product){
 $('#mainWatches').append(
  `<div class="d-flex justify-content-center">
    <div class="watch watch-large" data-url="${product.url}" data-id="${product.id}">
      <div class="watch-image-holder">
        <img src="${product.image}" alt="">
      </div>
      <div class="watch-footer">
        <div class="watch-name">
          ${product.name}
        </div>
        <div class="watch-price">
          ${product.brand}
        </div>
      </div>
    </div>
  </div>`)
}
