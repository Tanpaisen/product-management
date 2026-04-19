const express = require('express')
const router = express.Router();
const multer = require('multer')

const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()

const controller = require('../../controllers/admin/setting.controller')

router.post('/upload-tinymce',
    upload.single('file'),
    uploadCloud.upload,
    (req, res) => {
        res.json({
            location: req.body.file
        });
    }
);

router.get('/general', controller.settingGeneral)

router.post('/general',
    upload.single('logo'),
    uploadCloud.upload,
    controller.settingGeneralPost)

module.exports = router