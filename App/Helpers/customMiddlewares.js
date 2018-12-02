var model = {}
model.isCartRecorded = function(req, res, next){
  if(req.session.cart == null || req.session.cart === undefined || req.session.ID === undefined)
    res.redirect('/Shop')
  else next()
}
model.isOrderRecorded = function(req, res, next){
  if(req.session.order == null || req.session.order === undefined || req.session.ID === undefined)
    res.redirect('/Shop/details')
  else next()
}
model.isCartIDValid = function(req, res, next){
  if(req.session.cart == null || req.session.cart === undefined || req.session.ID === undefined)
    res.status(200).send({error: true, msg: 'Authentication failed', type: 'auth-error'})
  else if(req.headers.cartid === req.session.ID)
    next()
  else
    res.status(200).send({error: true, msg: 'Authentication failed', type: 'auth-error'})
}
module.exports = model;
