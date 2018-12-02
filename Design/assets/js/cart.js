class Cart {
  /* constructor */
  constructor(){
    let cart = getCookie('miracolo-cart')
    if(!cart){
      this.cart = []
    }
    else{
      this.cart = JSON.parse(cart)
    }
    this.sum = 0
    this.isDataSet = false
  }
  /* get whole cart */
  get getCart(){
    let cart = []
    for (var item of this.cart) {
      cart.push({id: item.id, quantity: item.quantity})
    }
    return cart
  }

  /* get quantity of sepicific product */
  getQuantity(product){
    for (let item of this.cart) {
      if(item.id == product.id)
        return item.quantity
    }
    return 0
  }

  /* refresh cookie and header's cart */
  refresh(){
    this.setSum()
    let cart = []
    for (var item of this.cart) {
      cart.push({id: item.id, quantity: item.quantity})
    }
    document.cookie = `miracolo-cart=${JSON.stringify(cart)};path=/`
    let q = this.count()
    if(q)
      $('#cartQuantity').html(`(${q})`)
    else
      $('#cartQuantity').html('')
  }

  /* sums each quantity */
  count(){
    let q = 0;
    for (var item of this.cart) {
      q += parseInt(item.quantity)
    }
    return q;
  }

  /* adds an product into cart */
  addNewItem(prodID, quantity = 1){
    for (let i = 0; i < this.cart.length; i++) {
      if(this.cart[i].id == prodID){
        this.cart[i].quantity = quantity
        this.refresh()
        return
      }
    }
    this.cart.push({
      id: prodID,
      quantity: quantity
    })
    $.ajax({type: 'POST', url: '/Shop/reset', data: {}, success: () => {}, error: () => {}})
    this.refresh()
  }
  /* removes an product from cart */
  removeItem(prodID){
    for (let i = 0; i < this.cart.length; i++) {
      if(this.cart[i].id == prodID){
        this.cart.splice(i, 1)
        this.refresh()
        return
      }
    }
    refresh()
  }
  /* get product data from prodID */
  async getProducts(){
    if(this.isDataSet) return
    for (var i = 0; i < this.cart.length; i++) {
      this.cart[i].data = new Product(this.cart[i].id)
      await this.cart[i].data.init()
    }
    this.isDataSet = true
    this.refresh()
  }

  setSum(){
    var sum = 0
    if(this.isDataSet)
      for (var item of this.cart) {
        sum += item.quantity * item.data.product.price.value
      }
    this.sum = sum
  }
  /* calls a renderer function for the cart */
  renderProducts(renderer){
    for (let item of this.cart) {
      renderer(item)
    }
  }

  empty(){
    this.cart = []
    this.refresh()
  }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var cart = new Cart()
$(document).ready(function(){
  cart.refresh()
})
