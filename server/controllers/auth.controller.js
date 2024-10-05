const { signToken } = require('../utils/auth.util')
const { catchAsync } = require('../utils/error.util')
const { userModel } = require('../models')
const { comparePasswords } = require('../utils/auth.util')
const { AppError } = require('../controllers/error.controller')

const login = catchAsync(async (req, res) => {
	const { username, password } = req.body

	if (!username || !password)
		throw new AppError('Please provide username and password', 400)

	const user = await userModel.findOne({ username })

	if (!user || !(await comparePasswords(password, user.password)))
		throw new AppError('Invalid username or password', 401)

	const token = await signToken(user.id)

	res.status(200).json({
		status: 'success',
		token,
	})
})

const logout = catchAsync(async (req, res) => {
	return res
		.status(200)
		.json({ status: '200', message: 'Logged out successfully' })
})

const changePassword = catchAsync(async (req, res) => {
	return res.send('Change Password')
})

const forgotPassword = catchAsync(async (req, res) => {
	return res.send('Forgot Password')
})

module.exports = { login, logout, changePassword, forgotPassword }
