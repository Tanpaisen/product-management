const express = require('express')
const router = express.Router();
const multer = require('multer')

const accountController = require('../../controllers/admin/account.controller')
const validate = require('../../validate/admin/account.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud')

const upload = multer();
router.get('/', accountController.index)

router.get('/create', accountController.create)
router.post('/create', 
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost, 
    accountController.createPost
)

router.get('/edit/:id', accountController.edit)
router.patch('/edit/:id', 
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost, 
    accountController.editPatch
)

router.delete('/deleteOne/:id', accountController.deleteOne)

router.patch('/change-status/:status/:id', accountController.changeOne)

module.exports = router;