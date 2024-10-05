const { verifyToken } = require('../utils/auth.util')
const { catchAsync } = require('../utils/error.util')

const protect = catchAsync(async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1]

	if (!token) {
		return res.status(401).json({
			status: 'fail',
			message: 'You are not logged in',
		})
	}

	const decoded = await verifyToken(token)

	req.user = decoded

	next()
})

module.exports = { protect }
