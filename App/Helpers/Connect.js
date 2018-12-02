const request = require('request')
const config = require(global.paths.config)

var model = {}

function serialize( obj ) {
  return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
}

model.connectToLetsnet = function(data, url = 'productsURL', method = 'get'){
  return new Promise(function(resolve, reject){
    request[method]({
      headers : {
        'Authorization' : `Bearer ${config.adminclass}`,
        'content-type': 'application/json',
        'x-shopid': config.shopID
      },
      url: `${config.host}/${url}`,
      form: data
    }, function(err, result, body){
      try {
        body = JSON.parse(body)
        if(body.type != 'success')
          reject(body)
        resolve(body.document)
      } catch (e) {
        e.body = body
        reject(e)
      }

    })
  })
}
module.exports = model
