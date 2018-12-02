$(document).ready(async function(){
  startLoading()
  initializeAppearable()
  await cart.getProducts()
  renderProducts()


  $('#products').on('change', 'input.quantity', function(e){
    var input = $(e.currentTarget)
    cart.addNewItem(input.data('id'), input.val())
    renderProducts()
  })

  $('#products').on('click', 'i.delete', function(e){
    let product = $(e.currentTarget).data('id')
    cart.removeItem(product)
    $('#' + product).remove()
    renderProducts()
  })

  $('#next').click(function(){
    startLoading()
    if(cart.getCart.length)
      $.ajax({
        url: '/Shop/record',
        type: 'post',
        data: { cart: cart.getCart },
        success: function(res){
          window.location = '/Shop/details'
        },
        err: function(e, xhr, stat){ console.log(reason); endLoading() }
      })
    else endLoading()
  })

})
function renderProducts(){
  $('#products tbody').html('')
  cart.renderProducts(function(item){
    $('#products tbody').append(`
      <tr id="${item.data.id}">
        <td class="image-cell">
          <div class="image-holder">
            <img src="${item.data.product.mainImage}_small.png" alt="">
          </div>
        </td>
        <td class="name-cell"><span>${item.data.product.name}</span></td>
        <td class="quantity-cell"><input min="1" type="number" class="form-control quantity" data-id="${item.data.id}" value="${item.quantity}"></td>
        <td class="price-cell"><span>${formatNumber(item.data.product.price.value) + ' Ft'}</span></td>
        <td class="price-cell"><span>${formatNumber(item.data.product.price.value * item.quantity) + ' Ft'}</span></td>
        <td><i class="fa fa-trash delete" data-id="${item.data.id}"></i></td>
      </tr>`
    )
  })
  endLoading()
  $('#sum').html(formatNumber(cart.sum) + ' Ft')
}
