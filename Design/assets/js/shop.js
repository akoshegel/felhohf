class Shop{
  constructor(){
    this.shopID = null, this._categoryID = null, this.host = null
    $(document).ready(() => {
      this.shopID = $('body').data('shop-id')
      this._categoryID = $('body').data('category-id')
      this.host = $('body').data('letsnet-api-url')
      this._authKey = $('body').data('auth-key')
    })
  }
  connect(data, url, method = 'GET', secure = false){
    return new Promise((resolve, reject) => {
      var headers = {}
      headers['x-shopid'] = this.shopID
      headers['Authorization'] = `Bearer ${this._authKey}`

      $.ajax({
        type: method,
        dataType: "json",
        url: this.host + '/' + url,
        data: data,
        headers: headers,
        success: (res) => {
          try{
            if(res.type != 'success') throw null
            resolve(res.document)
          }catch(e){ console.log({result: res, error: e, data: data}); reject(res) }

        },
        error: (err, xhr, status) => {
          exceptionHandler({result: err.responseJSON,
            xhr: xhr, status: status, data: data, defaults: { url: this.host  + '/' +  url, method: method, headers: headers}})
          reject(err)
        }
      })

      console.log({
        type: method,
        dataType: "json",
        url: this.host + '/' + url,
        data: data,
        headers: headers,
        success: (res) => {
          try{
            if(res.type != 'success') throw null
            resolve(res.document)
          }catch(e){ console.log({result: res, error: e, data: data}); reject(res) }

        },
        error: (err, xhr, status) => {
          exceptionHandler({result: err.responseJSON,
            xhr: xhr, status: status, data: data, defaults: { url: this.host  + '/' +  url, method: method, headers: headers}})
          reject(err)
        }
      });
    })
  }

  get categoryID(){
    if(this._categoryID) return this._categoryID
    throw exceptionHandler({result: {msg: 'Hiba történt', func: '@miracolo-ajax', type: 'error'}})
  }
}
var shop = new Shop()
