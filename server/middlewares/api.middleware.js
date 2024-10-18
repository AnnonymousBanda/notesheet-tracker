const { catchAsync } = require('../utils/error.util')

const getUserID = catchAsync(async (req, res, next) => {
	req.params.id = req.body.id

	next()
})

module.exports = {
	getUserID,
}
