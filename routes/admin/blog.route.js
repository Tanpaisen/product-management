const express = require('express')
const multer = require('multer')

const blogValidate = require('../../Validate/admin/blog.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()
const router = express.Router();

const blogController = require('../../controllers/admin/blog.controller')

router.get('/', blogController.index)

router.post('/upload-tinymce',
    upload.single('file'),
    uploadCloud.upload,
    (req, res) => {
        res.json({
            location: req.body.file
        });
    }
);

router.get('/create', blogController.create)
router.post('/create', 
    upload.single('featuredImage'),
    uploadCloud.upload,
    blogValidate.createPost,
    blogController.createPost
)

router.delete('/deleteOne/:id', blogController.deleteOne)

router.get('/edit/:id', blogController.edit)
router.patch('/edit/:id', 
    upload.single('featuredImage'),
    uploadCloud.upload,
    blogValidate.createPost,
    blogController.editPatch
)

router.get('/detail/:id', blogController.detail)

router.patch('/change-multi', blogController.changeMulti)

router.patch('/change-status/:status/:id', blogController.changeStatus)

module.exports = router;