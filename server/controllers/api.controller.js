const path = require('path')
const fs = require('fs').promises

const { userModel } = require('../models')
const { catchAsync } = require('../utils/error.util')
const { verifyToken } = require('../utils/auth.util')

const getUserByID = catchAsync(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1]

	if (!token) throw new AppError('You are not authenticated', 401)

	const decoded = await verifyToken(token)

	const user = await userModel
		.findById(decoded.id)
		.select(
			'-password -__v -passwordResetToken -passwordResetTokenExpires -passwordChangedAt'
		)

	if (!user) throw new AppError('User not found', 404)

	return res.status(200).json({
		status: '200',
		user,
	})
})

const blurImage = catchAsync(async (req, res) => {
	const src = req.body.src

	const { getPlaiceholder } = await import('plaiceholder')

	const imagePath = path.join(
		process.cwd(),
		'..',
		'server',
		'public',
		'images',
		src
	)

	const buffer = await fs.readFile(imagePath)

	const { base64 } = await getPlaiceholder(buffer)

	return res.status(200).json({ base64 })
})

module.exports = blurImage

module.exports = { getUserByID, blurImage }
