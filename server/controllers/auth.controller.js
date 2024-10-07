const { signToken, verifyToken, sendResetToken } = require('../utils/auth.util')
const { catchAsync } = require('../utils/error.util')
const { userModel } = require('../models')
const { comparePasswords } = require('../utils/auth.util')
const { AppError } = require('../controllers/error.controller')

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body

	if (!email || !password)
		throw new AppError('Please provide email and password', 400)

	const user = await userModel.findOne({ email })

	if (!user || !(await comparePasswords(password, user.password)))
		throw new AppError('Invalid username or password', 401)

	const token = await signToken(user.id)

	res.status(200).json({
		status: 'success',
		token,
	})
})

const logout = catchAsync(async (req, res) => {
	//blacklist token

	return res
		.status(200)
		.json({ status: '200', message: 'Logged out successfully' })
})

const getResetToken = catchAsync(async (req, res) => {
	// const { email } = req.body
	// if (!email) throw new AppError('Please provide email', 400)
	// const user = await userModel.findOne({ email })
	// if (!user) throw new AppError('User not found', 404)
	// const token = await signToken(user.id)
	// sendResetToken(email, token)
	// return res
	// 	.status(200)
	// 	.json({ status: 200, message: 'Reset token has been sent' })
})

const verifyResetToken = catchAsync(async (req, res) => {
	// const token = req.params.token
	// if (!token) throw new AppError('Token not found', 400)
	// const decoded = await verifyToken(token)
	// const user = await userModel.findById(decoded.id)
	// if (!user) throw new AppError('User not found', 404)
	// if (user.passwordResetToken !== token)
	// 	throw new AppError('Invalid link', 404)
	// next()
})

const reset = catchAsync(async (req, res) => {
	// const { password, confirmPassword } = req.body
	// if (!password || !confirmPassword)
	// 	throw new AppError('Please provide password and confirm password', 400)
	// if (password !== confirmPassword)
	// 	throw new AppError('Passwords do not match', 400)
	// const decoded = await verifyToken(token)
	// const user = await userModel.findById(decoded.id)
	// if (!user) throw new AppError('User not found', 404)
	// user.password = password
	// user.confirmPassword = confirmPassword
	// await user.save()
	// return res
	// 	.status(200)
	// 	.json({ status: 200, message: 'Password reset successful' })
})

const forgotPassword = catchAsync(async (req, res) => {
	// return res.send('Forgot Password')
})

module.exports = { login, logout, reset, getResetToken, forgotPassword }
