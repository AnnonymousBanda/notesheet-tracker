const passport = require('passport')

const { catchAsync } = require('../utils/error.util')
const { signToken } = require('../utils/auth.util')

const outlookLogin = passport.authenticate('windowslive', {
	scope: [
		'openid',
		'profile',
		'offline_access',
		'https://outlook.office.com/Mail.Read',
	],
})

const oulookOauthCallback = passport.authenticate('windowslive', {
	session: false,
	failureRedirect: 'oauth/failure',
})

const oauthCallback = catchAsync(async (req, res) => {
	const user = {
		email: req.user.profile.emails[0].value,
		name: req.user.profile.displayName,
	}

	const token = signToken(user)
	console.log(user)

	return res.status(200).json({ status: 200, token })
})

const failure = catchAsync(async (req, res) => {
	return res.status(401).json({
		status: 401,
		message: 'Authentication failed',
	})
})

module.exports = {
	outlookLogin,
	oulookOauthCallback,
	oauthCallback,
	failure,
}
