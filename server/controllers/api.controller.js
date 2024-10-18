const path = require('path')
const fs = require('fs').promises

const { userModel } = require('../models')
const { catchAsync } = require('../utils/error.util')
const saveImage = require('../utils/api.util')

const getUserByID = catchAsync(async (req, res) => {
	const id = req.params.id

	const user = await userModel
		.findById(id)
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
		'client',
		'public',
		'images',
		src
	)

	const buffer = await fs.readFile(imagePath)

	const { base64 } = await getPlaiceholder(buffer)

	const savePath = path.join(
		process.cwd(),
		'..',
		'client',
		'public',
		'images',
		'blurred',
		src
	)

	await saveImage(base64, savePath)

	return res.status(200).json({
		status: '200',
		message: 'Image blurred generated and saved successfully',
	})
})

const dynamicBlurImage = catchAsync(async (req, res) => {
	const url = req.body.url

	const fetch = (await import('node-fetch')).default

	const response = await fetch(url)

	if (!response.ok) throw new AppError('Image not found', 404)

	const buffer = await response.buffer()

	const { getPlaiceholder } = await import('plaiceholder')

	const { base64 } = await getPlaiceholder(buffer)

	// const savePath = path.join(
	// 	process.cwd(),
	// 	'..',
	// 	'client',
	// 	'public',
	// 	'images',
	// 	'blurred',
	// 	'random.jpg'
	// )

	// await saveImage(base64, savePath)

	// return res.status(200).json({
	// 	status: '200',
	// 	message: 'Image blurred generated and saved successfully',
	// })

	return res.status(200).json({
		status: '200',
		base64,
	})
})

module.exports = { getUserByID, blurImage, dynamicBlurImage }
