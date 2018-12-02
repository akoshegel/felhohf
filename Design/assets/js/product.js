function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
var longer = s1;
var shorter = s2;
if (s1.length < s2.length) {
  longer = s2;
  shorter = s1;
}
var longerLength = longer.length;
if (longerLength == 0) {
  return 1.0;
}
return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

class Product {
  constructor(product){
    if(typeof product === 'string'){
      this.id = product
      this.product = {}
    }
    if(typeof product === 'object'){
      this.product = product
      this.id = product.id
    }

    this.index = 0
  }
  /* connects to letsnet server and loads product info asyncronously */
  async init(){
    var result = await this.connectToProduct()
    this.containerId = result.id
    this.product = result.products[0]
    this.product.valueIds.concat(result.mainProperties)
    this.product.brand = result.name
    this.product.properties = await this.getProductProperties()
    this.product.stock = {available: true}
    return
  }


  async initComposed(){
    var result = await this.connectToComposedProduct()
    this.containerId = result.containerId
    this.product = result.product
    this.product.active = true;
    this.product.valueIds.concat(result.mainPropertyValues)
    this.product.brand = result.product.name
    this.product.propertiesObject = Object.assign(result.mainProperties, result.product.properties)
    this.product.properties = this.getComposedProductProperties()
    this.product.stock = result.stock;
    return
  }

  /* loads basic product info */
  connectToProduct(){
    return shop.connect({}, `product/${this.id}`)
  }

  connectToComposedProduct(){
    return shop.connect({}, `product/compose/${this.id}`)
  }

  getProductProperties(){
    return shop.connect({valueIds: this.product.valueIds}, `category/propertiesbyvalueids`, 'POST')
  }

  getComposedProductProperties(){
    var properties = []
    for (var id in this.product.propertiesObject)
      properties.push(Object.assign(this.product.propertiesObject[id]), {id: id})
    return properties
  }

  get price(){
    //return {value: 0, currency: "HUF"}
    return this.product.price.value
  }

  get properties(){
    return this.product.valueIds
  }

  static sortName(a, b){
    return a.product.name.localeCompare(b.product.name)
  }

  static sortBestMatch(a, b){
    return (similarity(b.product.name, "Tissot") - similarity(a.product.name, "Tissot")) + (similarity(b.product.name, "Tag Heuer") - similarity(a.product.name, "Tag Heuer")) + (similarity(b.product.name, "Longines") - similarity(a.product.name, "Longines"))
  }

  static sortPriceAsc(a, b){
    return a.price - b.price
  }

  static sortPriceDesc(a, b){
    return b.price - a.price
  }

  /* calls a renderer for the product */
  render(renderer){
    if(this.product.active)
     renderer(this.product)
  }

  static getFilters(){
    return shop.connect({}, `category/filters/${shop.categoryID}/1`)
  }

  static getAllProducts(data){
    return new Promise((resolve, reject) => {
      let URL = 'category/products/' + shop.categoryID
      if(data !== undefined){
        if(data.hasOwnProperty('skip')) URL += '/' + data.skip
        if(data.hasOwnProperty('limit')) URL += '/' + data.limit
      }
      shop.connect(null, URL).then(
        products => {
          resolve(Product.getProductObjectsFromArray(products))
        },
        reason => { reject(reason); }
      )
    })
  }

  static getProductObjectsFromArray(products){
    var returnProducts = []
    for (var product of products) returnProducts.push(new Product(product))
    return returnProducts
  }

  static filter(filters){
    var returnProducts = []
    return new Promise((resolve, reject) => {
      shop.connect({valueIds: filters}, 'product/filter', 'POST').then(
        products => {
          for (var product of products) returnProducts.push(new Product(product))
          resolve(returnProducts)
        },
        reason => { reject(reason); }
      )
    })
  }
  getContainerProducts(data){
    var returnProducts = []
    return new Promise((resolve, reject) => {
      let URL = 'product/container/' + this.containerId
      shop.connect(null, URL).then(
        container => {
          container.products = Product.getProductObjectsFromArray(container.products)
          resolve(container)
        },
        reason => { reject(reason); }
      )
    })
  }
}
