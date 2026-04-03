const homePage = require('./client/home.route');
const productPage = require('./client/products.route')
const searchPage = require('./client/search.route')
const cartPage = require('./client/cart.route')

const categoryMiddleware = require('../middlewares/client/category.middlewre')
const cartMiddleware = require('../middlewares/client/cart.middleware')

module.exports = (app) => {

    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cart)

    app.use('/', homePage)

    app.use('/search', searchPage)

    app.use('/products', productPage);

    app.use('/cart', cartPage);

}