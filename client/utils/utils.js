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

const html = (currentRequiredApproval, passedApprovals) => {
	console.log('Inside utils.js')
	const HTML = `
		${
			passedApprovals?.length
				? passedApprovals
						.map(
							(approval) => `<h2>Signed By: ${approval.name}</h2>`
						)
						.join('')
				: ''
		}
		${currentRequiredApproval?.name ? `<h2>Signed By: ${currentRequiredApproval.name}</h2>` : ''}
	`

	return HTML
}

export { formatDate, formatAmount, html }
