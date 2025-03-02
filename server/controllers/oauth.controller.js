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
	failureRedirect: '/oauth/failure',
})

const oauthCallback = catchAsync(async (req, res) => {
	let email = req.user.profile.emails[0].value
	let name = req.user.profile.displayName
	picture = null //retrive picture

	const allowedUsers = process.env.ALLOWED_USERS.split(',')

	if (!allowedUsers.includes(email)) {
		return res.redirect(`${process.env.CLIENT_URL}/auth/unauthenticated`)
	}

	let user = await userModel.findOne({ email })

	if (!user) {
		user = await userModel.create({
			name,
			email,
			picture,
		})
	}

	const token = signToken(user.id)

	return res.redirect(
		`${process.env.CLIENT_URL}/auth/outlook/success?token=${token}`
	)
})

const failure = catchAsync(async (req, res) => {
	return res.redirect(`${process.env.CLIENT_URL}/auth/failure`)
})

module.exports = {
	outlookLogin,
	oulookOauthCallback,
	oauthCallback,
	failure,
}
