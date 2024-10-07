const express = require('express')
const { isLoggedIn, isAdmin } = require('../middlewares/auth.middleware')

const {
	notesheets,
	loggedInNotesheets,
	adminNotesheets,
} = require('../controllers/api.controller')

const router = express.Router(notesheets)

router.route('/').get(notesheets)
router.route('/logged-in').get(isLoggedIn, loggedInNotesheets)
router.route('/admin').get(isAdmin, adminNotesheets)

module.exports = router
