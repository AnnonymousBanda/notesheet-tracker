const { promisify } = require('util')
const fs = require('fs').promises
const path = require('path')

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
		select: 'email role admin picture',
	},
	{
		path: 'currentRequiredApproval',
		select: 'email role admin picture',
	},
	{
		path: 'status.passedApprovals',
		select: 'email role admin picture',
	},
	{
		path: 'status.currentRequiredApproval',
		select: 'email role admin picture',
	},
	{
		path: 'status.pendingApprovals',
		select: 'email role admin picture',
	},
	{
		path: 'raisedBy',
		select: 'email role admin picture',
	},
	{
		path: 'status.rejectedBy.admin',
		select: 'email role admin picture',
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
			notesheet.status.rejectedBy.comment = 'Expired'

			await notesheet.save()

			sendMail(
				(text = `Your notesheet with id ${notesheet.id} has been rejected with comment ${comment}`)
			)
		})
	}
})

const accessAsync = promisify(fs.access)
const unlinkAsync = promisify(fs.unlink)
const removePDF = async (filename) => {
	//remove try catch block
	try {
		const filePath = path.join(__dirname, 'public/uploads', filename)
		await accessAsync(filePath, fs.constants.F_OK)
		await unlinkAsync(filePath)
		return 'PDF file deleted successfully!'
	} catch (error) {
		throw new AppError('PDF file not found', 404)
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
