const express = require('express')
const router = express.Router();

const rolesRouter = require('../../controllers/admin/roles.controller')
const roleValidate = require('../../Validate/admin/role.validate')

router.get('/', rolesRouter.index)

router.get('/create', rolesRouter.create)
router.post('/create', roleValidate.createPost, rolesRouter.createPost)

router.get('/edit/:id', rolesRouter.edit)
router.patch('/edit/:id', roleValidate.createPost, rolesRouter.editPatch)

router.delete('/deleteOne/:id', rolesRouter.deleteOne)

router.get('/detail/:id', rolesRouter.detail)

module.exports = router