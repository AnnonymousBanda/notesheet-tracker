process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! Shutting down...')
	console.log(err.name + '! ' + err.message)

	if (process.env.NODE_ENV !== 'test') console.error(err)
	process.exit(1)
})

process.on('unhandledRejection', async (err) => {
	console.log(err.name + '! ' + err.message)
	console.log('UNHANDLED REJECTION! Shutting down...')

	if (process.env.NODE_ENV !== 'test') console.error(err)

	server.close(() => {
		process.exit(1)
	})
})
