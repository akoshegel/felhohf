$(document).ready(async function(){

  if(location.pathname.indexOf('jewellery') != -1) {
    $("#background-image").addClass("jew-background")
  }

  startLoading()
  initializeAppearable()
  var prodID = $('main').data('prod-id')
  const product = new Product(prodID)
  console.log(product);
  await product.init()
  product.render(loadPage)
  product.render(renderDetails)
  endLoading()

  /*******************************************************
  *                       EVENTS
  ********************************************************/

  $('.filters').on('click', '.filter-title', function(e){
    let clicked = $(e.currentTarget)
    clicked.parent().find('.filter-body').toggle(300)
    if(clicked.hasClass('toggled')){
      clicked.find('.filter-arrow').css('transform', 'rotate(0)')
      clicked.removeClass('toggled')
    }
    else {
      clicked.find('.filter-arrow').css('transform', 'rotate(180deg)')
      clicked.addClass('toggled')
    }
  })

  $('.watches').on('click', '.watch', function(e){
    window.location = `/watches/${$(e.currentTarget).data('id')}`
  })

  $('#buy').click(async (e) => {
    //if(!product.stock.available) return // BUG:
    await triggerAnimation({x: $(window).width() - e.clientX, y: e.clientY})
    cart.addNewItem(prodID, $('#quantity').val())
  })

  $('#sideImages').on('click', '.side-image-holder', function(e){
    $('#mainImage img').attr('src', $(e.currentTarget).find('img').attr('src'))
  })

  product.getContainerProducts().then(container => {
    container.products.sort(function(a, b){
      return Math.abs(a.price - product.price) - Math.abs(b.price - product.price)
    })
    container.products.forEach(prod => {
      prod.render(productRenderer)
    })
  })

})



/*******************************************************
*                       RENDERERS
********************************************************/

function triggerAnimation(position){
  return new Promise((resolve) => {
    var icon = $('#inCartIcon')
    icon.css({top: position.y - 20, right: position.x - 20}).addClass('triggerAnimation')
    setTimeout(() => { resolve(); icon.removeClass('triggerAnimation') }, 800)
  })
}


function loadPage(product){
  $("title").html(`${product.name} - ${product.id}`)
  $("meta[name='description']").attr('content', `Tekintse meg üzleteinkben, vagy webshopunkon: ${product.name} - ${product.id}`);
  $('#pageTitle').html(product.name)
  $('#sideImages').append(
    `<div class="image-holder side-image-holder">
      <img class="main-image" src="${product.mainImage}_small.png" alt="">
    </div>`)
  for (let image of product.images) {
    $('#sideImages').append(
      `<div class="image-holder side-image-holder">
        <img class="main-image" src="${image}_small.png" alt="">
      </div>`)
  }
  $('#mainImage').html(`<img class="main-image" src="${product.mainImage}_high.png" alt="">`)
  $('#watch-name').html(product.name)
  $('#watch-id').html(product.id)
  $('#watch-brand').html(product.brand)
  $('#additionalInformation').html((!product.stock.available ? "Elfogyott" : product.stock.last ? "Utolsó darab!" : ""))
  $('#watch-price').html(formatNumber(product.price.value) + ' Ft')
}
function renderDetails(product){
  for (var ID in product.properties) {
    var property = product.properties[ID]

    var propertyValues = ''
    for (var value of property.values)
      propertyValues +=
      `<div class="d-flex">
        <span class="property-name">${value.name}:</span>
        <span class="property-value">${value.val}</span>
      </div>`

    $('.details').append(`<div class="property appearable">
      <div class="property-title">
        ${property.name}
      </div>
      <div class="properties">
        ${propertyValues}
      </div>
    </div>`)
  }
  initializeAppearable()
}

function productRenderer(product){
  let productHtml = `
    <div class="d-flex justify-content-center">
      <a href="/watches/${product.id}">
        <div class="watch watch-large">
          <div class="watch-image-holder">
            <img src="${product.mainImage}_mid.png" alt="">
          </div>
          <div class="watch-footer">
            <div class="watch-name">
            ${product.name}
            </div>
            <div class="watch-data">
              ${formatNumber(product.price.value)} ${product.price.currency}
            </div>
          </div>
        </div>
      </a>
    </div>
  `
  $("#relatedProductsSection").append(productHtml)
}
