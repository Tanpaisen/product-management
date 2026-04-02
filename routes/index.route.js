const homePage = require('./client/home.route');
const productPage = require('./client/products.route')
const searchPage = require('./client/search.route')

const categoryMiddleware = require('../middlewares/client/category.middlewre')

module.exports = (app) => {

    app.use(categoryMiddleware.category)

    app.use('/', homePage)

    app.use('/search', searchPage)

    app.use('/products', productPage);

}