const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')

const router = express.Router()

const {
	getUserByID,
	blurImage,
	dynamicBlurImage,
} = require('../controllers/api.controller')
const { getUserID } = require('../middlewares/api.middleware')

router.route('/user/me').get(isAuthenticated, getUserID, getUserByID)
router.route('/user/:id').get(isAuthenticated, isAdmin, getUserByID)

router.route('/get-blur-image').post(blurImage)
router.route('/get-dynamic-blur-image').post(dynamicBlurImage)

module.exports = router
