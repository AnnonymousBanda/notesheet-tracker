const notesheets = (req, res) => {
	return res.status(200).json({
		status: '200',
		message: 'This is the notesheets route',
	})
}

module.exports = { notesheets }
