const passport = require('passport')

const { catchAsync } = require('../utils/error.util')
const { signToken } = require('../utils/auth.util')

const outlookLogin = catchAsync(async (req, res) =>
	passport.authenticate('windowslive', {
		scope: [
			'openid',
			'profile',
			'offline_access',
			'https://outlook.office.com/Mail.Read',
		],
	})(req, res)
)

const oulookOauthCallback = catchAsync(async (req, res) =>
	passport.authenticate('windowlive', {
		session: false,
		failureRedirect: '/failure',
	})
)

const oauthCallback = catchAsync(async (req, res) => {
	const user = {
		email: req.user.profile.emails[0].value,
		username: req.user.profile.displayName,
		name: req.user.profile.givenName,
	}

	const token = signToken(user)

	return res.status(200).json({ status: 200, token })
})

const failure = catchAsync(async (req, res) => {
	return res.status(401).send('Authentication Failed')
})

module.exports = {
	outlookLogin,
	oulookOauthCallback,
	oauthCallback,
	failure,
}
