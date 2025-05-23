const fs = require('fs').promises
const path = require('path')
const nodemailer = require('nodemailer')

const { catchAsync } = require('./error.util')
const { userModel } = require('../models')
const { AppError } = require('../controllers/error.controller')
// const { userModel } = require('../models')

const saveImage = async (base64, destPath) => {
	const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')

	const dirPath = path.dirname(destPath)
	await fs.mkdir(dirPath, { recursive: true })

	await fs.writeFile(destPath, base64Data, { encoding: 'base64' })
}

const populateOptions = [
	{
		path: 'requiredApprovals',
		select: 'email role admin picture name',
	},
	{
		path: 'currentRequiredApproval',
		select: 'email role admin picture name',
	},
	{
		path: 'status.passedApprovals',
		select: 'email role admin picture name',
	},
	{
		path: 'status.currentRequiredApproval',
		select: 'email role admin picture name',
	},
	{
		path: 'status.pendingApprovals',
		select: 'email role admin picture name',
	},
	{
		path: 'raisedBy',
		select: 'email role admin picture name',
	},
	{
		path: 'status.rejectedBy.admin',
		select: 'email role admin picture name',
	},
]

const sendMail = catchAsync(async (to, subject, htmlMessage) => {
	try {
		// For outlook
		// const transporter = nodemailer.createTransport({
		//     host: 'smtp-mail.outlook.com',
		//     secureConnection: false,
		//     port: 587,
		//     auth: {
		//         user: process.env.EMAIL_USERNAME,
		//         pass: process.env.EMAIL_PASSWORD,
		//     },
		//     tls: {
		//         ciphers: 'SSLv3',
		//     },
		// });

		const transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		})

		const options = {
			from: process.env.EMAIL_SENDER_NAME,
			to: to,
			subject: subject,
			html: htmlMessage,
		}

		const info = await transporter.sendMail(options)
		console.log('Email sent:', info.response)
	} catch (error) {
		console.error('Error sending email:', error)
	}
})

const rejectExpiredNotesheet = catchAsync(async () => {
	const notesheets = await notesheetModel
		.find({
			expiresAt: { $lt: new Date() },
			'status.state': 'pending',
		})
		.populate(populateOptions)

	if (notesheets?.length > 0) {
		notesheets.forEach(async (notesheet) => {
			notesheet.status.rejectedBy.admin =
				notesheet.currentRequiredApproval
			notesheet.status.rejectedBy.comment =
				'Notesheet expired! Please raise a new notesheet.'

			await notesheet.save()

			await removePDF(notesheet.pdf.split('/').pop())

			sendMail(
				notesheet.raisedBy.email,
				'Notesheet Expired - Action Required',
				`Your notesheet has expired as of ${notesheet.expiresAt}. Please raise a new notesheet.`,
				`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2 style="color: #dc3545;">Notesheet Expired</h2>
                  <p>Dear ${notesheet.raisedBy.name},</p>
                  <p>Your notesheet (ID: <strong>${notesheet.id}</strong>) has expired as of <strong>${notesheet.expiresAt}</strong>. Unfortunately, it can no longer be processed.</p>
                  <p>To proceed, please raise a new notesheet using the link below:</p>
                  <p><a href="${process.env.CLIENT_URL}/new-notesheet" style="color: #007bff; text-decoration: none;">Raise New Notesheet</a></p>
                  <br/>
                  <p>Thank you,</p>
                  <p><strong>Team Gymkhana</strong></p>
                  <p>Indian Institute of Technology Patna</p>
                </div>
                `
			)
		})
	}
})

const removePDF = async (filename) => {
	const filePath = path.join(__dirname, '..', 'public', 'uploads', filename)
	console.log(filePath)

	try {
		await fs.access(filePath)
		await fs.unlink(filePath)
		console.log(`File ${filename} deleted successfully.`)
	} catch (err) {
		if (err.code === 'ENOENT') {
			console.error(`File not found: ${filename}`)
			console.log(`File ${filename} does not exist.`)
		} else {
			console.error(`Error deleting file: ${err.message}`)
		}
	}
}

const renamePDF = async (oldFilename, newFilename) => {
	const oldPath = path.join(__dirname, '..', 'public', 'uploads', oldFilename)
	const newPath = path.join(__dirname, '..', 'public', 'uploads', newFilename)

	try {
		await fs.rename(oldPath, newPath)
		console.log('File renamed successfully')
	} catch (err) {
		console.error('Error renaming file:', err)
	}
}

const formatDate = (date) => {
	const newDate = new Date(date)
	const options = {
		timeZone: 'Asia/Kolkata',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}
	const [day, month, year] = new Intl.DateTimeFormat('en-GB', options)
		.format(newDate)
		.split('/')

	return `${day}-${month}-${year}`
}

// sendMail(
// 	'vinay_2301me80@iitp.ac.in',
// 	'Notesheet Raised Successfully',
// 	`
// 	<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
// 	  <h2 style="color: #004085;">Notesheet Raised Successfully</h2>
// 	  <p>Dear Vinay,</p>
// 	  <p>Your notesheet has been raised successfully. You can track its progress using the link below:</p>
// 	  <p><a href="${process.env.CLIENT_URL}/notesheet/" style="color: #007bff; text-decoration: none;">View Notesheet Status</a></p>
// 	  <p><strong>Note:</strong> This notesheet is valid until <strong>${formatDate(new Date())}</strong>. Please ensure all approvals are completed before this date.</p>
// 	  <br/>
// 	  <p>Thank you,</p>
// 	  <p><strong>Team Gymkhana</strong></p>
// 	  <p>Indian Institute of Technology Patna</p>
// 	</div>
// 	`
// )

async function hierarchyMantained(requiredApprovals) {
	const hierarchy = process.env.HIERARCHY?.split(',')

	if (requiredApprovals.length === 0) return false

	let temp = [...requiredApprovals]

	for (let i = 0; i < hierarchy?.length && temp.length != 0; i++) {
		if (temp[0] === hierarchy[i]) {
			temp.shift()
		}
	}
	if (temp.length != 0) return false

	const len = requiredApprovals.length
	for (let i = 0; i < len; i++) {
		requiredApprovals[i] = (
			await userModel.findOne({
				admin: requiredApprovals[i],
			})
		)._id
	}

	console.log('Required Approvals:', requiredApprovals)

	if (requiredApprovals.length != len)
		throw new AppError('Invalid admins for required approvals', 400)

	return true
}

module.exports = {
	saveImage,
	populateOptions,
	sendMail,
	rejectExpiredNotesheet,
	removePDF,
	renamePDF,
	formatDate,
	hierarchyMantained,
}
