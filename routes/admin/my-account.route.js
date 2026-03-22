const express = require('express');
const multer = require('multer')

const router = express.Router();
const upload = multer();

const validate = require('../../validate/admin/account.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud')


const myAccountController = require('../../controllers/admin/my-account.controller')

router.get('/', myAccountController.index)

router.get('/edit', myAccountController.edit)
router.patch('/edit', upload.single('avatar'),
    uploadCloud.upload,
    validate.editPatch, 
    myAccountController.editPatch
)

module.exports = router;