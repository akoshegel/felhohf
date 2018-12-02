var express = require('express')
var router = express.Router()
var lRender = require('letsnet-services').render
const connect = require(global.paths.helpers + '/Connect')
const uuid = require('uuid-v4')
const middlewares = require(global.paths.customMiddleWares)
const config = require(global.paths.config);

router.get('/', (req, res) => {
  req.session.cart = {}
  delete req.session.ID
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Cart',
    data: {
      letsnetapiurl: config.host,
      shopID: config.shopID,
      adminClass: config.adminclass
    }
  })
})

router.get('/details', middlewares.isCartRecorded, (req, res) => {
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Details',
    data: {
      cartID : req.session.ID,
      letsnetapiurl: config.host,
      shopID: config.shopID,
      adminClass: config.adminclass
    }
  })
})

router.post('/record', (req, res) => {
  var cart = req.body.cart
  var connections = []
  var quantities = {}
  for (item of cart) {
    quantities[item.id] = item.quantity
    connections.push(
      connect.connectToLetsnet( {}, 'product/' + item.id )
    )
  }
  Promise.all(connections).then(
    result => {
      var sum = 0
      for (var prod of result) {
        var product = prod.products[0]
        sum += product.price.value * parseInt(quantities[product.id])
        cart.price = product.price.value * parseInt(quantities[product.id])
        if(cart.price === NaN) throw 'Invalid Products'
      }
      var id = uuid()
      req.session.ID = id
      req.session.cart = {
        products: cart,
        sum: sum
      }
      res.status(200).send({type: 'success', document: result})
    },
    reason => {
      res.status(200).send({type: 'error', document: reason})
    }
  )
})

router.post('/confirm', middlewares.isCartIDValid, (req, res) => {
  try{
    validatePostObject(req.body)
    req.session.order = setOrderObject(req.body, req.session)
    var id = uuid()
    req.session.ID = id
    res.status(200).send({error: false, type: 'success'})
  }
  catch(e){
    res.status(200).send({error: true, msg :e, type: 'invalid-form'})
  }
})

router.get('/confirm', middlewares.isCartRecorded, middlewares.isOrderRecorded, (req, res) => {
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Confirm',
    data: {
      cartID : req.session.ID,
      shopID: config.shopID,
      cart: req.session.cart,
      order: req.session.order,
      letsnetapiurl: config.host,
      adminClass: config.adminclass
    }
  })
})

router.post('/start', middlewares.isCartRecorded, middlewares.isOrderRecorded, (req, res) => {
  connect.connectToLetsnet( req.session.order, 'order/begin', 'post' )
  .then( result => {
    switch (result.payment.status) {
      case 'redirect':
        //TODO:
        break;
      case 'ok':
        connect.connectToLetsnet( {}, result.validationUrl, 'post' )
        .then( result => {
          delete req.session.cart
          delete req.session.ID
          res.status(200).send(result)
        }, err => { res.status(result.statusCode || 503).send(err) })
        break;
      default:
        res.status(200).send({type: 'api-error', msg: 'Unexpected payment status', func: '/Shop/start'})
        break;
    }
  }, err => { res.status(err.statusCode || 503).send(err) })
})

router.post('/reset', (req, res) => {
  req.session.destroy()
  res.status(200).send()
})

function validatePostObject(body){
    var legitPropNames = ["firstName", "lastName", "email", "phone", "shippingType", "birthYear", "birthMonth", "birthDay", "shippingData", "paying",
    "address", "paymentAddress", "paymentFirstName", "paymentLastName"]
    for (var propName in body) {
      var index = legitPropNames.indexOf(propName)
      if(index == -1)
        throw propName
      else legitPropNames.splice(index, 1)
    }
    if(legitPropNames.length) throw `missing: ${JSON.stringify(legitPropNames)}`
}

function setOrderObject(body, session){
  var data = {
    cart: [],
    userDetails: {
      name: {
        first: body.firstName,
        last: body.lastName
      },
      born: {
        year: body.birthYear,
        month: body.birthMonth,
        day: body.birthDay
      },
      email: body.email,
      phone: body.phone,
      address: {
        streetNumber: body.address.houseNumber,
        street: body.address.street,
        city: body.address.city,
        postCode: body.address.postCode,
        country: body.address.country
      }
    },
    paymentDetails: {
      mode: body.paying,
      invoice: {
        name: {
          first: body.paymentFirstName,
          last: body.paymentLastName
        },
        address: {
          streetNumber: body.paymentAddress.houseNumber,
          street: body.paymentAddress.street,
          city: body.paymentAddress.city,
          postCode: body.paymentAddress.postCode,
          country: body.paymentAddress.country
        },
        textNumber: '---'
      }
    },
    orderDetails: {
      mode: body.shippingType,
      address: {
        streetNumber: body.shippingData.houseNumber,
        street: body.shippingData.street,
        city: body.shippingData.city,
        postCode: body.shippingData.postCode,
        country: body.shippingData.country
      }
    }
  }
  for (product of session.cart.products) {
    data.cart.push({
      id: product.id,
      quantity: product.quantity
    })
  }
  return data
}

module.exports = router
