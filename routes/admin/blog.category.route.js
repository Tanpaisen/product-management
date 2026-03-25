const express = require('express')
const multer = require('multer')

const blogValidate = require('../../Validate/admin/blog.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud');

const upload = multer()
const router = express.Router();

const blogCategoryController = require('../../controllers/admin/blog.category.controller')

router.get('/', blogCategoryController.index)

router.post('/upload-tinymce',
    upload.single('file'),
    uploadCloud.upload,
    (req, res) => {
        res.json({
            location: req.body.file
        });
    }
);

router.get('/create', blogCategoryController.create)
router.post('/create', 
    upload.single('featuredImage'),
    uploadCloud.upload,
    blogValidate.createPost,
    blogCategoryController.createPost)

module.exports = router;