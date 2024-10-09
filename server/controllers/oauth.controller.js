const passport = require('passport')
const { userModel } = require('../models')

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
	let user = {
		email: req.user.profile.emails[0].value,
	}

	user = await userModel.findOne({ email: user.email })

	if (!user) {
		user = await userModel.create({
			email: user.email,
		})
	}

	const token = signToken(user)

	return res.status(200).json({ status: 200, jwt: token })
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
