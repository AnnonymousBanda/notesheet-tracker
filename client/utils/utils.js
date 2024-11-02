// import fs from 'fs'
// import path from 'path'

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

const formatAmount = (amount) => {
	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	})
	return formatter.format(amount)
}

const html = (notesheet) =>
	`
		${
			notesheet.status.passedApprovals?.length
				? notesheet.status.passedApprovals
						.map(
							(approval) => `<h2>Signed By: ${approval.name}</h2>`
						)
						.join('')
				: ''
		}
		${
			notesheet.status.currentApproval?.name
				? `<h2>Signed By: ${notesheet.status.currentApproval.name}</h2>`
				: ''
		}
	`

// const pdfExists = (filename) => {
// 	const filePath = path.resolve('server', 'public', 'uploads', filename)

// 	return fs.existsSync(filePath) && filePath.endsWith('.pdf')
// }

export { formatDate, formatAmount, html }
