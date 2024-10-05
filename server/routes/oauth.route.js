const express = require('express')

const {
	outlookLogin,
	oulookOauthCallback,
	failure,
	oauthCallback,
} = require('../controllers/oauth.controller')

const router = express.Router()

router.route('/outlook').get(
	passport.authenticate('windowslive', {
		scope: [
			'openid',
			'profile',
			'offline_access',
			'https://outlook.office.com/Mail.Read',
		],
	})
)

router.route('/outlook/callback').get(
	passport.authenticate('windowlive', {
		session: false,
		failureRedirect: '/failure',
	}),
	oauthCallback
)
router.route('/failure').get(failure)

export default router
