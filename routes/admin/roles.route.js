const express = require('express')
const router = express.Router();

const rolesRouter = require('../../controllers/admin/roles.controller')

router.get('/', rolesRouter.index)

router.get('/create', rolesRouter.create)
router.post('/create', rolesRouter.createPost)

router.get('/edit/:id', rolesRouter.edit)
router.patch('/edit/:id', rolesRouter.editPatch)

router.delete('/deleteOne/:id', rolesRouter.deleteOne)

module.exports = router