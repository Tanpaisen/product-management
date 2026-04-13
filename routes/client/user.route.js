const express = require('express')
const router = express.Router();

const controller = require('../../controllers/client/user.controller')

const validateRegister = require('../../Validate/client/user.validate') 

router.get('/register', controller.register)

router.post('/register', validateRegister.register, controller.registerPost)

router.get('/login', controller.login)

router.post('/login', validateRegister.login, controller.loginPost)

router.get('/logout', controller.logout)

module.exports = router