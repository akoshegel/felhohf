var express = require('express')
var router = express.Router()
var lRender = require('letsnet-services').render

router.get('/', (req, res) => {
    let render = new lRender()
    render.render({
        res: res,
        folder: '404',
        data: {}
    })
})

module.exports = router
