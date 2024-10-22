const fs = require('fs').promises
const path = require('path')

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

module.exports = {
	saveImage,
	populateOptions,
	sendMail,
	hierarchyMantained,
}
