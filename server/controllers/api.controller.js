const path = require('path')
const fs = require('fs').promises

const { userModel, notesheetModel } = require('../models')
const { catchAsync } = require('../utils/error.util')
const { saveImage, populateOptions, sendMail } = require('../utils/api.util')
const { AppError } = require('../controllers/error.controller')

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

const getNotesheetById = catchAsync(async (req, res) => {
	const notesheetID = req.params.id
	const notesheet = await notesheetModel
		.findById(notesheetID)
		.populate(populateOptions)

	if (!notesheet) throw new AppError('Notesheet not found', 404)
	
	return res.status(200).json({
		status: '200',
		notesheet,
	})
})

const getRaisedNotesheetsByUserID = catchAsync(async (req, res) => {
	const id = req.params.id

	const notesheets = await notesheetModel
		.find({ raisedBy: id })
		.populate(populateOptions)

	if (!notesheets) throw new AppError('Notesheets not found', 404)

	return res.status(200).json({
		status: '200',
		notesheets,
	})
})

const getNotesheetsToApproveByUserID = catchAsync(async (req, res) => {
	const id = req.params.id

	const notesheets = await notesheetModel
		.find({ currentRequiredApproval: id })
		.populate(populateOptions)

	if (!notesheets) throw new AppError('Notesheets not found', 404)

	return res.status(200).json({
		status: '200',
		notesheets,
	})
})

const getNotesheetsApprovedByUserID = catchAsync(async (req, res) => {
	const id = req.params.id

	const notesheets = await notesheetModel
		.find({ passedApprovals: { $in: [id] } })
		.populate(populateOptions)

	if (!notesheets) throw new AppError('Notesheets not found', 404)

	return res.status(200).json({
		status: '200',
		notesheets,
	})
})

const createNotesheet = catchAsync(async (req, res) => {
	const raisedBy = req.params.id
	const { subject, amount, raiser } = req.body
	const requiredApprovals = req.body.requiredApprovals.split(',')

	if(!req.file) 
		throw new AppError('Please upload a pdf file', 400)

	const pdf = `${process.env.API_URL}/uploads/${req.file.filename}`

	const user = await userModel.findById(raisedBy)

	if (!user)
		throw new AppError('Your token has expired please login again', 401)

	if (user.admin === 'adean')
		throw new AppError('Adean cannot raise notesheet', 400)

	if (!requiredApprovals || requiredApprovals.length === 0)
		throw new AppError('Required approvals are required', 400)

	const users = await userModel.find({
		admin: { $in: requiredApprovals },
	})

	if (!users) throw new AppError('Required approvals not found', 404)

	if (users.length !== requiredApprovals.length) {
		throw new AppError('There might be an error in required approvals', 400)
	}

	let newRequiredApprovals = users.map((user) => user._id)

	const notesheet = await notesheetModel.create({
		subject,
		amount,
		raisedBy,
		raiser,
		pdf,
		requiredApprovals: newRequiredApprovals,
	})

	sendMail((text = `notesheet with id ${notesheet.id} has been raised`))

	return res.status(201).json({
		status: '201',
		message: 'Notesheet created successfully',
		notesheet,
	})
})

const approveNotesheet = catchAsync(async (req, res) => {
	const id = req.params.id
	const { notesheetID } = req.body
	const pdf = `${process.env.API_URL}/uploads/${req.file.filename}`

	const notesheet = await notesheetModel.findById(notesheetID)

	if (!notesheet) throw new AppError('Notesheet not found', 404)

	const user = await userModel.findById(id)

	if (!user) throw new AppError('User not found', 404)

	if (!notesheet.currentRequiredApproval?.equals(user.id))
		throw new AppError('You are not the required approver', 401)

	const index = notesheet.requiredApprovals.indexOf(
		notesheet.currentRequiredApproval
	)
	if (index === notesheet.requiredApprovals.length - 1)
		notesheet.currentRequiredApproval = null
	else
		notesheet.currentRequiredApproval =
			notesheet.requiredApprovals[index + 1]

	notesheet.pdf = pdf

	await notesheet.save()

	if (notesheet.currentRequiredApproval === null)
		sendMail(
			(text = `Your notesheet with id ${notesheet.id} has been approved by ${user.admin === 'adean' ? 'all required approvals' : user.admin}`)
		)

	return res.status(200).json({
		status: '200',
		message: 'Notesheet approved successfully',
		notesheet,
	})
})

const rejectNotesheet = catchAsync(async (req, res) => {
	const id = req.params.id
	const { notesheetID, comment } = req.body

	if (!notesheetID) throw new AppError('Notesheet ID is required', 400)

	if (!comment) throw new AppError('Comment is required', 400)

	const notesheet = await notesheetModel.findById(notesheetID)

	if (!notesheet) throw new AppError('Notesheet not found', 404)

	const user = await userModel.findById(id)

	if (!user) throw new AppError('User not found', 404)

	if (!user.admin) throw new AppError('You are not an admin', 401)

	if (!notesheet.currentRequiredApproval?.equals(user.id))
		throw new AppError('You are not the required rejector', 401)

	notesheet.status.rejectedBy = {
		admin: user.id,
		comment,
	}

	await notesheet.save()

	sendMail(
		(text = `Your notesheet with id ${notesheet.id} has been rejected with comment ${comment}`)
	)

	return res.status(200).json({
		status: '200',
		message: 'Notesheet rejected successfully',
		notesheet,
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

module.exports = {
	getUserByID,
	getNotesheetById,
	getRaisedNotesheetsByUserID,
	getNotesheetsToApproveByUserID,
	getNotesheetsApprovedByUserID,
	createNotesheet,
	approveNotesheet,
	rejectNotesheet,
	blurImage,
	dynamicBlurImage,
}
