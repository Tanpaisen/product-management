const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/user.controller')

const userRegister = require('../../Validate/client/user.validate') 

const userMiddleware = require('../../middlewares/client/authentication.middleware')

router.get('/register', controller.register)

router.post('/register', userRegister.register, controller.registerPost)

router.get('/login', controller.login)

router.post('/login', userRegister.login, controller.loginPost)

router.get('/info', userMiddleware.requireAuth, controller.info)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)

router.post('/password/forgot', userRegister.forgotPassword, controller.forgotPasswordPost)

router.get('/password/otp', controller.otpPassword)

router.post('/password/otp', controller.otpPasswordPost)

router.get('/password/reset', controller.resetPassword)

router.post('/password/reset', userRegister.resetPassword, controller.resetPasswordPost)

module.exports = router