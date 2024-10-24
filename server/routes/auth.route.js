const express = require('express')

const {
	register,
	login,
	logout,
	getResetToken,
	verifyResetToken,
	reset,
	changePassword,
	updateProfile,
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
router.route('/update-profile').patch(isAuthenticated, updateProfile)

module.exports = router
