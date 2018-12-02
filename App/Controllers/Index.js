var express = require('express')
var router = express.Router()
var lRender = require('letsnet-services').render
const config = require(global.paths.config);

router.get('/', (req, res) => {
  let render = new lRender()
  render.render({
    res: res,
    folder: 'Index',
    data: {
      letsnetapiurl: config.host,
      shopID: config.shopID
    }
  })
})

module.exports = router
