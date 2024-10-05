const unhandledRejection = (err) => {
	process.on('uncaughtException', (err) => {
		console.log('UNCAUGHT EXCEPTION! Shutting down...')
		console.log(err.name + '! ' + err.message)

		if (process.env.NODE_ENV !== 'test') console.error(err)
		process.exit(1)
	})
}

const uncaughtException = (server) => {
	process.on('unhandledRejection', async (err) => {
		console.log(err.name + '! ' + err.message)
		console.log('UNHANDLED REJECTION! Shutting down...')

		if (process.env.NODE_ENV !== 'test') console.error(err)

		server.close(() => {
			process.exit(1)
		})
	})
}

const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	}
}

module.exports = { unhandledRejection, uncaughtException, catchAsync }
