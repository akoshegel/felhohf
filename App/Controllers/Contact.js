var express = require('express')
var router = express.Router()
var lRender = require('letsnet-services').render
const config = require(global.paths.config);

router.get('/', (req, res) => {
  let Re = new lRender()
  Re.render({
    res: res,
    folder: 'Contact',
    data: {
      letsnetapiurl: config.host,
      shopID: config.shopID,
      adminClass: config.adminclass
    }
  })
})

module.exports = router
