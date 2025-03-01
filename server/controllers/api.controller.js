const path = require('path')
const fs = require('fs').promises
const fsSync = require('fs')

const { userModel, notesheetModel } = require('../models')
const { catchAsync } = require('../utils/error.util')
const {
	saveImage,
	populateOptions,
	sendMail,
	removePDF,
	renamePDF,
} = require('../utils/api.util')
const { copyPdfFile } = require('../utils/pdf.util')
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

const downloadPDF = catchAsync(async (req, res) => {
	const pdf = req.params.pdf

	const pdfPath = path.join(
		process.cwd(),
		'..',
		'server',
		'public',
		'uploads',
		pdf
	)

	if (!fsSync.existsSync(pdfPath)) {
		const custom404File = path.join(__dirname, '..', 'public', '404.html')

		return res.status(404).sendFile(custom404File)
	}

	return res.download(pdfPath)
})

const getNotesheetById = catchAsync(async (req, res) => {
	const notesheetID = req.params.id
	const notesheet = await notesheetModel
		.findById(notesheetID)
		.populate(populateOptions)

	return res.status(200).json({
		status: '200',
		notesheet,
	})
})

const getNotesheetsByUserID = catchAsync(async (req, res) => {
	const id = req.params.id
	const user = req.user

	const status = req.query.status
	const page = parseInt(req.query.page) || 1
	const limit = 10
	const sortBy = req.query.sortBy || 'raisedAt'
	const order = req.query.order === 'desc' ? -1 : 1

	const type = req.query.type
	// if (!type) throw new AppError('Type is required', 400)

	let notesheets = []
	let total = 0
	if (type === 'raised') {
		notesheets = await notesheetModel
			.find(
				status
					? { raisedBy: id, 'status.state': status }
					: { raisedBy: id }
			)
			.populate(populateOptions)
			.sort({ [sortBy]: order })
			.limit(limit)
			.skip((page - 1) * limit)

		total = await notesheetModel.countDocuments({ raisedBy: id })
	} else if (type === 'to-approve') {
		if (user.role === 'admin')
			notesheets = await notesheetModel
				.find({ currentRequiredApproval: id })
				.populate(populateOptions)
				.sort({ [sortBy]: order })
				.limit(limit)
				.skip((page - 1) * limit)

		total = await notesheetModel.countDocuments({
			currentRequiredApproval: id,
		})
	} else if (type === 'approved') {
		if (user.role === 'admin')
			notesheets = await notesheetModel
				.find({ 'status.passedApprovals': { $in: [id] } })
				.populate(populateOptions)
				.sort({ [sortBy]: order })
				.limit(limit)
				.skip((page - 1) * limit)

		total = await notesheetModel.countDocuments({
			passedApprovals: { $in: [id] },
		})
	}

	return res.status(200).json({
		status: '200',
		total,
		notesheets,
	})
})

const createNotesheet = catchAsync(async (req, res) => {
	const raisedBy = req.params.id
	const { subject, amount, raiser } = req.body
	const requiredApprovals = req.body.requiredApprovals.split(',')

	if (!req.file) throw new AppError('Please upload a pdf file', 400)

	const pdf = `${process.env.API_URL}/uploads/${req.file.filename}`

	await copyPdfFile(
		req.file.filename,
		req.file.filename.replace('.pdf', '-sign.pdf')
	)

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

	sendMail(
		user.email,
		'Notesheet Raised Successfully',
		'Your notesheet has been raised successfully.',
		`
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		  <h2 style="color: #004085;">Notesheet Raised Successfully</h2>
		  <p>Dear ${user.name},</p>
		  <p>Your notesheet has been raised successfully. You can track its progress using the link below:</p>
		  <p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">View Notesheet Status</a></p>
		  <p><strong>Note:</strong> This notesheet is valid until <strong>${notesheet.expiresAt}</strong>. Please ensure all approvals are completed before this date.</p>
		  <br/>
		  <p>Thank you,</p>
		  <p><strong>Team STC</strong></p>
		  <p>Indian Institute of Technology Patna</p>
		</div>
		`
	)

	sendMail(
		notesheet.currentRequiredApproval.email,
		'Notesheet Pending for Review',
		`A notesheet is awaiting your review and approval.`,
		`
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		  <h2 style="color: #856404;">Notesheet Pending for Review</h2>
		  <p>Dear ${notesheet.currentRequiredApproval.name},</p>
		  <p>A notesheet is awaiting your review. Please review it and take the necessary action (Approve/Reject) using the link below:</p>
		  <p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">Review Notesheet</a></p>
		  <br/>
		  <p>Thank you,</p>
		  <p><strong>Team STC</strong></p>
		  <p>Indian Institute of Technology Patna</p>
		</div>
		`
	)

	return res.status(201).json({
		status: '201',
		message:
			'Notesheet created successfully! PDF uploaded will be available for download for 3 weeks',
		notesheet,
	})
})

const approveNotesheet = catchAsync(async (req, res) => {
	const id = req.params.id
	const { notesheetID } = req.body

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

	if (user.admin === 'adean') {
		await removePDF(
			notesheet.pdf.split('/').pop().replace('.pdf', '-sign.pdf')
		)
	} else {
		await removePDF(notesheet.pdf.split('/').pop())

		await renamePDF(
			notesheet.pdf.split('/').pop().replace('.pdf', '-sign-test.pdf'),
			notesheet.pdf.split('/').pop()
		)
	}

	await notesheet.save()

	if (notesheet.currentRequiredApproval === null)
		sendMail(
			notesheet.raisedBy.email,
			'Notesheet Approved',
			`Your notesheet has been approved by ${user.name}.`,
			`
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<h2 style="color: #155724;">Notesheet Approved</h2>
			<p>Dear ${notesheet.raisedBy.name},</p>
			<p>Your notesheet has been finally and fully approved by <strong>${user.name}</strong>.</p>
			<p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">View Notesheet Status</a></p>
			<br/>
			<p>Thank you,</p>
			<p><strong>Team STC</strong></p>
			<p>Indian Institute of Technology Patna</p>
			</div>
			`
		)
	else {
		sendMail(
			notesheet.raisedBy.email,
			'Notesheet Approved',
			`Your notesheet has been approved by ${user.name}.`,
			`
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			  <h2 style="color: #155724;">Notesheet Approved</h2>
			  <p>Dear ${notesheet.raisedBy.name},</p>
			  <p>Your notesheet has been approved by <strong>${user.name}</strong>. You may check its status using the link below:</p>
			  <p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">View Notesheet Status</a></p>
			  <p><strong>Note:</strong> This notesheet is valid until <strong>${notesheet.expiresAt}</strong>. Please ensure all necessary steps are completed before this date.</p>
			  <br/>
			  <p>Thank you,</p>
			  <p><strong>Team STC</strong></p>
			  <p>Indian Institute of Technology Patna</p>
			</div>
			`
		)

		sendMail(
			notesheet.currentRequiredApproval.email,
			'Notesheet Pending for Review',
			`A notesheet is awaiting your review and approval.`,
			`
			<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			  <h2 style="color: #856404;">Notesheet Pending for Review</h2>
			  <p>Dear ${notesheet.currentRequiredApproval.name},</p>
			  <p>A notesheet is awaiting your review. Please review it and take the necessary action (Approve/Reject) using the link below:</p>
			  <p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">Review Notesheet</a></p>
			  <br/>
			  <p>Thank you,</p>
			  <p><strong>Team STC</strong></p>
			  <p>Indian Institute of Technology Patna</p>
			</div>
			`
		)
	}

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
		notesheet.raisedBy.email,
		'Notesheet Rejected',
		`Your notesheet has been rejected by ${user.name}.`,
		`
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		  <h2 style="color: #721c24;">Notesheet Rejected</h2>
		  <p>Dear ${notesheet.raisedBy.name},</p>
		  <p>Unfortunately, your notesheet has been rejected by <strong>${user.name}</strong>. Please review the comments and make the necessary changes.</p>
		  <p>You can view the details here:</p>
		  <p><a href="${process.env.CLIENT_URL}/notesheet/${notesheet.id}" style="color: #007bff; text-decoration: none;">View Notesheet Status</a></p>
		  <p>If you need to submit a new notesheet, please use the link below:</p>
		  <p><a href="${process.env.CLIENT_URL}/new-notesheet" style="color: #28a745; text-decoration: none;">Raise a New Notesheet</a></p>
		  <br/>
		  <p>Thank you,</p>
		  <p><strong>Team STC</strong></p>
		  <p>Indian Institute of Technology Patna</p>
		</div>
		`
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
	downloadPDF,
	getNotesheetById,
	getNotesheetsByUserID,
	createNotesheet,
	approveNotesheet,
	rejectNotesheet,
	blurImage,
	dynamicBlurImage,
}
