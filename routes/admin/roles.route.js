const express = require('express')
const router = express.Router();

const rolesRouter = require('../../controllers/admin/roles.controller')

router.get('/', rolesRouter.index)

router.get('/create', rolesRouter.create)

module.exports = router