module.exports = function () {
  var model = {}

  var paths = {
    app: __dirname,
    config: `${__dirname}/App/config/config`,
    design: `${__dirname}/Design`,
    designc: `${__dirname}/Design/config`,
    views: `${__dirname}/Design/Views`,
    helpers : `${__dirname}/App/Helpers`,
    customMiddleWares: `${__dirname}/App/Helpers/customMiddlewares`
  }

  var setPaths = function () {
    global.paths = paths
  }

  model.setPaths = setPaths

  return model
}
