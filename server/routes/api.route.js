const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')

const router = express.Router()

const { getUserByID } = require('../controllers/api.controller')

router.route('/user/me').get(isAuthenticated, getUserByID)

module.exports = router
