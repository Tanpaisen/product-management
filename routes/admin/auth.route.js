const express = require('express')
const router = express.Router();

const authController = require('../../controllers/admin/auth.controller')

const loginValidate = require('../../Validate/admin/auth.validate')

router.get('/login', authController.login)

router.post('/login',
    loginValidate.loginPost, 
    authController.loginPost)

module.exports = router;