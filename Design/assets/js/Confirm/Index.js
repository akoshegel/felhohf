$(document).ready(function(){
  var products = []
  var connections = []
  for (var row of $('#products tbody tr')) {
    let newProd = new Product($(row).data('id'))
    products.push(newProd)
    console.log(newProd);
    connections.push(newProd.init())
  }
  Promise.all(connections).then(
    result => {
      console.log(products);
      products.forEach(product => {
        product.render(renderProduct)
      })
    },
    reason => {
      console.log(reason);
    }
  )
  $('#next').click(function(){
    $.ajax({
      type: 'POST',
      url: '/Shop/start',
      headers: {
        cartid : $('main').data('cart-id')
      },
      success: (result) => {
        myConfirm('Köszönjük, vásárlását rögzítettük.\n\
        A részletekről emailben értesítettük.', 'Sikeres vásárlás!', 'success').then( result => {
          cart.empty()
          window.location = '/'
        } )
      }, error: (err, xhr, status) => { exceptionHandler({result: err.responseJSON, error: err, xhr: xhr, status: status}) }
    })
  })
})

function renderProduct(product){
  for (var row of $('#products tbody tr')) {
    console.log(product);
    if($(row).data('id') == product.id){
      $(row).find('img').attr('src', product.mainImage + '_small.png')
      $(row).find('.name').html(product.name)
      $(row).find('.price').html(formatNumber(product.price.value) + ' Ft')
      break
    }
  }
}
