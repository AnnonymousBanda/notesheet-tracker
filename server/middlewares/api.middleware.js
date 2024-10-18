const { catchAsync } = require('../utils/error.util')
const { verifyToken } = require('../utils/auth.util')

const getUserID = catchAsync(async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1]

	if (!token) throw new AppError('You are not authenticated', 401)

	const decoded = await verifyToken(token)

	req.params.id = decoded.id

	next()
})

module.exports = {
	getUserID,
}
