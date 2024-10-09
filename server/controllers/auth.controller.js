const bcrypt = require('bcrypt')

const { signToken, verifyToken, sendResetToken } = require('../utils/auth.util')
const { catchAsync } = require('../utils/error.util')
const { userModel } = require('../models')
const { AppError } = require('../controllers/error.controller')

const register = catchAsync(async (req, res) => {
	const { email, password, confirmPassword } = req.body

	const user = await userModel.create({
		email,
		password,
		confirmPassword,
		role: 'admin',
	})

	const token = await signToken(user.id)

	res.status(201).json({
		status: 200,
		jwt: token,
	})
})

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body

	if (!email || !password)
		throw new AppError('Please provide email and password', 400)

	const user = await userModel.findOne({ email })

	if (!user || !(await bcrypt.compare(password, user.password)))
		throw new AppError('Invalid username or password', 401)

	const token = await signToken(user.id)

	res.status(200).json({
		status: 200,
		jwt: token,
	})
})

const logout = catchAsync(async (req, res) => {
	//blacklist token

	return res
		.status(200)
		.json({ status: '200', message: 'Logged out successfully' })
})

const getResetToken = catchAsync(async (req, res) => {
	const { email } = req.body

	if (!email) throw new AppError('Please provide email', 400)

	const user = await userModel.findOne({ email })

	if (!user) throw new AppError('User not found', 404)

	const resetToken = await signToken(email)
	user.passwordResetToken = await bcrypt.hash(resetToken, 12)
	user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

	await user.save()

	sendResetToken(email, resetToken)

	return res.status(200).json({
		status: 200,
		message: 'Reset link has been sent and is valid for 10 mins',
	})
})

const verifyResetToken = catchAsync(async (req, res) => {
	const resetToken = req.body.token

	if (!resetToken) throw new AppError('Please provide reset token', 400)

	const decoded = await verifyToken(resetToken)

	const user = await userModel.findOne({ email: decoded.id })
	if (!user) throw new AppError('User not found', 404)

	if (!(await bcrypt.compare(resetToken, user.passwordResetToken)))
		throw new AppError('Invalid link', 404)

	if (Date.now() > user.passwordResetTokenExpires)
		throw new AppError('Reset link has expired', 400)

	return res.status(200).json({ status: 200, message: 'Valid reset token' })
})

const reset = catchAsync(async (req, res) => {
	const { password, confirmPassword } = req.body

	if (!password || !confirmPassword)
		throw new AppError('Please provide password and confirm password', 400)

	if (password !== confirmPassword)
		throw new AppError('Passwords do not match', 400)

	const resetToken = req.params.token

	if (!resetToken) throw new AppError('Please provide reset token', 400)

	const decoded = await verifyToken(resetToken)

	const user = await userModel.findOne({ email: decoded.id })

	if (!user) throw new AppError('User not found', 404)

	if (!(await bcrypt.compare(resetToken, user.passwordResetToken)))
		throw new AppError('Invalid link', 404)

	if (Date.now() > user.passwordResetTokenExpires)
		throw new AppError('Reset link has expired', 400)

	user.password = password
	user.confirmPassword = confirmPassword
	user.passwordResetToken = undefined
	user.passwordResetTokenExpires = undefined
	user.passwordChangedAt = Date.now()
	await user.save()

	return res
		.status(200)
		.json({ status: 200, message: 'Password reset successful' })
})

// const reset = catchAsync(async (req, res) => {
// 	const token = req.headers.authorization.split(' ')[1]

// 	if (!token) throw new AppError('Please login in to change password', 401)

// 	const { password, confirmPassword } = req.body

// 	if (!password || !confirmPassword)
// 		throw new AppError('Please provide password and confirm password', 400)

// 	if (password !== confirmPassword)
// 		throw new AppError('Passwords do not match', 400)

// 	const decoded = await verifyToken(token)

// 	const user = await userModel.findById(decoded.id)

// 	if (!user) throw new AppError('User not found', 404)

// 	const resetToken = req.params.token
// 	if (!resetToken) throw new AppError('Please provide reset token', 400)

// 	if (!(await bcrypt.compare(resetToken, user.passwordResetToken)))
// 		throw new AppError('Invalid link', 404)

// 	if (Date.now() > user.passwordResetTokenExpires)
// 		throw new AppError('Reset link has expired', 400)

// 	user.password = password
// 	user.confirmPassword = confirmPassword
// 	user.passwordResetToken = undefined
// 	user.passwordResetTokenExpires = undefined
// 	user.passwordChangedAt = Date.now()
// 	await user.save()

// 	return res
// 		.status(200)
// 		.json({ status: 200, message: 'Password reset successful' })
// })

module.exports = {
	register,
	login,
	logout,
	getResetToken,
	verifyResetToken,
	reset,
}
