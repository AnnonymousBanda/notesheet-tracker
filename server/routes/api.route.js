const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')

const router = express.Router()

const {
	getUserByID,
	blurImage,
	dynamicBlurImage,
} = require('../controllers/api.controller')

router.route('/user/me').get(isAuthenticated, getUserByID)

router.route('/get-blur-image').post(blurImage)
router.route('/get-dynamic-blur-image').post(dynamicBlurImage)

module.exports = router
