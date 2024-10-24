const express = require('express')

const {
	register,
	login,
	logout,
	getResetToken,
	verifyResetToken,
	reset,
	changePassword,
} = require('../controllers/auth.controller')
const { isAuthenticated } = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/register').post(register) //used when hardcording the admin user
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/get-password-reset-token').post(getResetToken)
router.route('/verify-password-reset-token').post(verifyResetToken)
router.route('/password-reset/:token').patch(reset)
router.route('/change-password').patch(isAuthenticated, changePassword)

module.exports = router
