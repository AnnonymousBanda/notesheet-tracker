const { signToken } = require('../utils/auth.util')
const { catchAsync } = require('../controllers/error.controller')

const login = catchAsync(async (req, res) => {
	const { id } = req.body

	const token = await signToken(id)

	res.status(200).json({
		status: 'success',
		token,
	})
})

const logout = catchAsync(async (req, res) => {
	return res.send('Logout')
})

const changePassword = catchAsync(async (req, res) => {
	return res.send('Change Password')
})

const forgotPassword = catchAsync(async (req, res) => {
	return res.send('Forgot Password')
})

module.exports = { login, logout, changePassword, forgotPassword }
