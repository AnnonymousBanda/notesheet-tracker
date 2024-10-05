require('dotenv').config()

const http = require('http')

const { unhandledRejection, uncaughtException } = require('./utils/error.util')
uncaughtException()
const { connectDB } = require('./database')

const app = require('./app')

const port = process.env.PORT || 3000

const server = http.createServer(app)
unhandledRejection(server)

server.listen(port, async () => {
	await connectDB()
	console.log(`Server running on port ${port}\n http://localhost:${port}`)
})
