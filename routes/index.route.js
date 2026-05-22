const homePage = require('./client/home.route');
const productPage = require('./client/products.route')
const searchPage = require('./client/search.route')
const cartPage = require('./client/cart.route')
const checkoutPage = require('./client/checkout.route')
const userPage = require('./client/user.route')
const usersPage = require('./client/users.route')
const chatPage = require('./client/chat.route')

const categoryMiddleware = require('../middlewares/client/category.middlewre')
const cartMiddleware = require('../middlewares/client/cart.middleware')
const userMiddleware = require('../middlewares/client/user.middleware')
const settingGeneralMiddleware = require('../middlewares/client/settings-general.middleware')

module.exports = (app) => {

    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cart)
    app.use(userMiddleware.user)
    app.use(settingGeneralMiddleware.settingGeneral)

    app.use('/', homePage)

    app.use('/search', searchPage)

    app.use('/products', productPage);

    app.use('/cart', cartPage);

    app.use('/chat', chatPage);

    app.use('/user', userPage);

    app.use('/users', usersPage);

    app.use('/checkout', checkoutPage);
}