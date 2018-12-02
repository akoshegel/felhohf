var express = require('express')
var router = express.Router()
var lRender = require('letsnet-services').render
const config = require(global.paths.config);

router.get('/', (req, res) => {
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Watches',
    data: {
      letsnetapiurl: config.host,
      shopID: config.shopID,
      categoryID: config.categoryIDs.watches,
      adminClass: config.adminclass,
      urlType: 'watches'
    }
  })
})

router.get('/:id', (req, res) => {
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Watch',
    data: {
      prodID: req.params.id,
      letsnetapiurl: config.host,
      shopID: config.shopID,
      categoryID: config.categoryIDs.watches,
      adminClass: config.adminclass
    }
  })
})

module.exports = router
