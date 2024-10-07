const notesheets = (req, res) => {
	return res.status(200).json({
		status: '200',
		message: 'This is the notesheets route',
	})
}

const loggedInNotesheets = (req, res) => {
	return res.status(200).json({
		status: '200',
		message: 'This is the loggedInNotesheets route',
	})
}

const adminNotesheets = (req, res) => {
	return res.status(200).json({
		status: '200',
		message: 'This is the adminNotesheets route',
	})
}

module.exports = { notesheets, loggedInNotesheets, adminNotesheets }
