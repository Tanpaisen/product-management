const dashboardAdmin = require('./dashboard.route')
const productsAdmin = require('./product.route')
const productsCategoryAdmin = require('./product.category.route')
const rolesRouter = require('./roles.route')
const accountRouter = require('./account.route')
const authRouter = require('../admin/auth.route')
const myAccountRoute = require('../admin/my-account.route')
const blogRoute = require('../admin/blog.route')
const blogCategoryRoute = require('./blog.category.route')

const authMiddleware = require('../../middlewares/admin/authentication')
const system = require('../../config/system')

const PATH_ADMIN = system.prefixAdmin

module.exports = (app) => {
    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardAdmin)

    app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productsAdmin)

    app.use(PATH_ADMIN + '/products-category', authMiddleware.requireAuth, productsCategoryAdmin)

    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, rolesRouter)

    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountRouter)

    app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoute)

    app.use(PATH_ADMIN + '/blogs', authMiddleware.requireAuth, blogRoute)

    app.use(PATH_ADMIN + '/blogs-category', authMiddleware.requireAuth, blogCategoryRoute)

    app.use(PATH_ADMIN + '/auth', authRouter)
}

