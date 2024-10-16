const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')

const router = express.Router()

const { getUserByID, blurImage } = require('../controllers/api.controller')

router.route('/user/me').get(isAuthenticated, getUserByID)

router.route('/get-blur-image').post(blurImage)

module.exports = router
