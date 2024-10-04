const express = require('express')

const {
	login,
	logout,
	changePassword,
	forgotPassword,
} = require('../controllers/auth.controller')
const { protect } = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/change-password').patch(protect, changePassword)
router.route('/forgot-password').post(protect, forgotPassword)

module.exports = router
