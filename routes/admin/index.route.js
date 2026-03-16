const dashboardAdmin = require('./dashboard.route') 
const productsAdmin = require('./product.route') 
const productsCategoryAdmin = require('./product.category.route') 
const rolesRouter = require('./roles.route') 
const accountRouter = require('./account.route')
const authRouter = require('../admin/auth.route')
const system = require('../../config/system')

const PATH_ADMIN = system.prefixAdmin

module.exports = (app) => {
    app.use(PATH_ADMIN + '/dashboard', dashboardAdmin)

    app.use(PATH_ADMIN + '/products', productsAdmin)

    app.use(PATH_ADMIN + '/products-category', productsCategoryAdmin)

    app.use(PATH_ADMIN + '/roles', rolesRouter)

    app.use(PATH_ADMIN + '/accounts', accountRouter)

    app.use(PATH_ADMIN + '/auth', authRouter)
}

