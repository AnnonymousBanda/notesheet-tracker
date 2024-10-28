const fs = require('fs').promises
const path = require('path')
const fsSync = require('fs')

const { catchAsync } = require('./error.util')

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

const sendMail = async (to, subject, text, html) => {
	console.log(text)
}

const hierarchyMantained = (requiredApprovals) => {
	if (requiredApprovals.length === 0) return false

	return true
}

const rejectExpiredNotesheet = catchAsync(async () => {
	const notesheets = await notesheetModel.find({
		expiresAt: { $lt: new Date() },
		'status.state': 'pending',
	})

	if (notesheets?.length > 0) {
		notesheets.forEach(async (notesheet) => {
			notesheet.status.rejectedBy.admin =
				notesheet.currentRequiredApproval
			notesheet.status.rejectedBy.comment =
				'Notesheet expired! Please raise a new notesheet.'

			await notesheet.save()

			removePDF(notesheet.pdf.slice(notesheet.pdf.lastIndexOf('/') + 1))

			sendMail(
				(text = `Your notesheet with id ${notesheet.id} has been rejected with comment ${comment}`)
			)
		})
	}
})

const removePDF = (filename) => {
	const filePath = path.join(__dirname, '..', 'public', 'uploads', filename)
	console.log(filePath)

	if (!fsSync.existsSync(filePath)) {
		console.error(`File not found: ${filename}`)
		console.log(`File ${filename} does not exist.`)
	} else {
		fsSync.unlink(filePath, (err) => {
			if (err) console.error(`Error deleting file: ${err.message}`)
			else console.log(`File ${filename} deleted successfully.`)
		})
	}
}

module.exports = {
	saveImage,
	populateOptions,
	sendMail,
	hierarchyMantained,
	rejectExpiredNotesheet,
	removePDF,
}
