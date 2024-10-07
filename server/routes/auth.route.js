const express = require('express')

const {
	login,
	logout,
	reset,
	getResetToken,
	forgotPassword,
} = require('../controllers/auth.controller')

const router = express.Router()

router.route('/login').post(login)
router.route('/logout').get(logout)
// router.route('/reset-password').patch(getResetToken)
// router.route('/forgot-password').post(getResetToken)
// router.route('/reset/:token').patch(reset)

module.exports = router
