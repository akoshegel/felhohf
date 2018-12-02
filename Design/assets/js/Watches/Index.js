class Page{
  constructor(){
    this.products = []
    this.loaded = 0
    this.filters = []
    this.rendered = 0
    this.rangeFilters = []
    this.order = 'best-match'

    this.filterDictionary = {
      longines: '8660c21b-e5c6-4579-9712-e9c51cf87f8f',
      tagheuer: '0d71f1e8-5bab-4b37-845f-9d85010a60ad',
      certina: '9e491acc-bc92-47ff-af1a-395dcc9051c5',
      meistersinger: 'bff28694-c7d4-4828-bcbb-02c1baf2653f',
      nomination: '33f594e8-b483-405c-8aa3-3042cd48f532',
      comete: '16c9b191-a2f3-4437-a6f1-9990ca128a9e',
      police: '75836d13-8d17-4167-a825-104bcde7cc68',
      tommyhilfiger: '6981a238-261c-4151-8790-c4c10d084679'
    }
  }
  getProducts(){
    startLoading()
    if(this.filters.length){
      Product.filter(this.filters).then(
        prods => {
          this.products = prods
          this.sortProducts()
          this.renderProducts()
        }, reason => { $('#matches').html(0); endLoading() }
      )
    }
    else
      Product.getAllProducts().then(
        prods => {
          this.products = this.products.concat( prods )
          this.sortProducts()
          this.renderProducts()
        },
        reason => { console.log(reason); endLoading() }
      )
    this.setProductIndexes()
  }

  renderProducts(limit = 30){
    var i = 0, db = 0
    for (var i = this.loaded; i < (this.loaded + limit + db) && i < this.products.length; i++) {
      var product = this.products[i]
      if(this.frontendFilters(product)) product.render(renderProduct)
      else db++
    }
    this.rendered += i - this.loaded - db
    this.loaded = i
    $('#matches').html(this.rendered)
    this.initScroller()
    initializeAppearable()
    endLoading()
  }

  frontendFilters(product){
    return product.price >= $('#minPrice').val() && product.price <= $('#maxPrice').val()
  }

  renderFilters(){
    return new Promise((resolve, reject) => {
      Product.getFilters().then(
        filters => {
          renderFilters(filters)
          resolve(null)
         }, reason => {}
      )
    })

  }

  filter(){
    this.reset()
    for (var checkbox of $('.filter-option')) {
      if($(checkbox).find('input').prop('checked'))
        this.filters.push($(checkbox).find('input').data('id'))
    }
    this.getProducts(100)
  }

  reset(){
    this.rendered = 0
    this.loaded = 0
    $('#mainWatches').html('')
    this.products = []
    this.filters = []
  }

  reorder(type){
    this.order = type
    $('#mainWatches').html('')
    this.rendered = 0
    this.loaded = 0
    this.sortProducts()
    this.renderProducts()
  }

  setProductIndexes(){
    var tasks = []
    this.products.forEach(product => {
      product.index = this.getMatches(product.properties || [])
    })
  }

  getMatches(vIDs){
    var match = 0
    this.filter.forEach(filter => {
      if(vIDs.includes(filter)) match++
    })
    return match
  }

  sortProducts(){
    switch (this.order) {
      case 'best-match':
        this.products.sort(Product.sortBestMatch)
        break;
      case 'name-asc':
        this.products.sort(Product.sortName)
        break;
      case 'price-asc':
        this.products.sort(Product.sortPriceAsc)
        break;
      case 'price-desc':
        this.products.sort(Product.sortPriceDesc)
        break
    }
  }

  propertySorter(a, b){
    return a.name >= b.name
  }

  initScroller(){
    var win = $(window);
    var allMods = $('.unvisible');
    win.scroll(function(event) {
      allMods.each(function(i, el) {
        var el = $(el);
        if (el.hasClass("unvisible") && el.visible(true)) {
          el.removeClass("unvisible");
          if($('.unvisible').length < 8) page.renderProducts()
        }
      });
    });
  }

  getDefaultFilters(){
    let getParams = location.href.split('?')
    getParams = getParams[1] ? getParams[1].split('&') : []
    let getValues = {}

    getParams.forEach(param => {
      const keyvalue = param.split("=")
      getValues[keyvalue[0]] = keyvalue[1]
    })
    this.defaultFilters = getValues
    return getValues.brand != null
  }

  executeDefaultFilters(){
    if(this.filterDictionary.hasOwnProperty(this.defaultFilters.brand)){
      var input = $(`input[data-id="${this.filterDictionary[this.defaultFilters.brand]}"]`)
      var brand = $(input).closest('.filter').find('.filter-title')
      brand.trigger('click')
      input.prop('checked', true)
      input.trigger('change')
    }
  }
}
var page = new Page()
$(document).ready(async function(){

  $('#order').val('best-match')
  $('.window h1').html((location.pathname.indexOf('jewellery') != -1) ? 'Ékszerek' : 'Órák')
  $("#background-image").css("background-image" , location.pathname.indexOf('jewellery') != -1 ? '/images/backgrounds/jewellery-background.jpg' : '/images/backgrounds/bg.jpg')

  await page.renderFilters()
	$( "#slider-range" ).slider({
	   range: true,
		min: 0,
		max: 2000000,
		values: [ 0, 2000000 ],
		slide: function( event, ui ) {
      $('#minPrice').val(ui.values[ 0 ])
      $('#maxPrice').val(ui.values[ 1 ])
      $('#priceRange').html(formatNumber(ui.values[ 0 ]) + " Ft - " + formatNumber(ui.values[ 1 ]) + " Ft")
		}
	});
  $('#minPrice').val($( "#slider-range" ).slider( "values", 0 ))
  $('#maxPrice').val($( "#slider-range" ).slider( "values", 1 ))
  $('#priceRange').html(formatNumber($( "#slider-range" ).slider( "values", 0 )) + " Ft - " + formatNumber($( "#slider-range" ).slider( "values", 1 )) + " Ft")

  $('.filters').on('click', '.filter-title', function(e){
    let clicked = $(e.currentTarget)
    clicked.parent().find('.filter-body').first().toggle(300)
    if(clicked.hasClass('toggled')){
      clicked.find('.filter-arrow').first().css('transform', 'rotate(0)')
      clicked.removeClass('toggled')
    }
    else {
      clicked.find('.filter-arrow').first().css('transform', 'rotate(180deg)')
      clicked.addClass('toggled')
    }
  })

  $('.ui-slider-handle, #slider-range').click((e) => {
    $('#mainWatches').html('')
    $('#matches').html('')
    page.reorder()
  })

  $('.filters').on('change', '.filter-option input', function(e){
    page.filter()
    var filter = $(e.currentTarget).closest('.core-filter')
    var found = 0
    for (e of filter.find('input'))
      if($(e).prop('checked')){
        found ++;
      }
    filter.find('.alerter').css('opacity', found != 0 ? 1 : 0).html(found)
  })

  $('.watches').on('click', '.watch', function(e) {
    const urlType = $("main").data("urltype")
    window.location = `/${urlType}/${$(e.currentTarget).data('id')}`
  })

  $('#order').change(() => {
    page.reorder($('#order').val())
  })

  if(page.getDefaultFilters()) page.executeDefaultFilters()
  else page.getProducts()
})

/*****************************************************
*                     RENDERERS
*****************************************************/
function renderProduct(product){
 $('#mainWatches').append(
  `<div class="watch watch-medium appearable unvisible" data-id="${product.id}">
    <div class="watch-image-holder">
      <img src="${product.mainImage}_mid.png" alt="">
    </div>
    <div class="watch-footer">
      <div class="watch-name">
        ${product.name}
      </div>
      <div class="watch-price">
        ${formatNumber(product.price.value) + " Ft"}
      </div>
    </div>
  </div>`)
}

function renderFilters(filters){
  $('#filters').html('')
  for (var filter of filters) {
    var filterID = generateID()
    $('#filters').append(`
      <div class="filter core-filter">
        <div class="filter-title">
          <div class="filter-title-name">
            <span>${filter.name}</span>
            <span class="alerter"></span>
          </div>
          <svg class="filter-arrow" viewBox="0 0 407.437 407.437">
            <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "></polygon>
          </svg>
        </div>
        <div class="filter-body gray" id="${filterID}">
        </div>
      </div>
    `)
    switch (filter.kind) {
      case 'group':
        renderGrouppedFilters(filter.values, filter.display, $('#' + filterID))
        break;
      case 'single':
        renderSingleFilters(filter.values, filter.display, $('#' + filterID))
        break;
    }
  }
}

function renderGrouppedFilters(values, display, jQuerySelector){
  for (var valueName in values) {
    var nameID = generateID()
    $(jQuerySelector).append(`
      <div class="filter">
        <div class="filter-title">
          <span>${valueName}</span>
          <svg class="filter-arrow" viewBox="0 0 407.437 407.437">
            <polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815 "></polygon>
          </svg>
        </div>
        <div class="filter-body gray" id="${nameID}">
        </div>
      </div>`
    )
    renderSingleFilters(values[valueName], {mode: "vvalue"}, $('#' + nameID))
  }
}

function renderSingleFilters(values, display, jQuerySelector){
  values.sort(page.propertySorter)
  for (var value of values) {
    var id = generateID()
    $(jQuerySelector).append(`
      <div class="filter-option">
        <input type="checkbox" id="${id}" data-id="${value.id}">
        <label class="form-check-label" for="${id}">${ renderFilterName(value.name, value.val, display.mode) }</label>
      </div>`)
  }
}

function renderFilterName(name, value, format){
  switch(format){
    case 'vname&vvalue': return `${name} : ${value}`
    case 'vvalue': return `${value}`
    default: return `${name} : ${value}`
  }
}
