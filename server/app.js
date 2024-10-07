const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')

const configPassport = require('./config/oauth.config')
const { apiRouter, authRouter, oauthRouter } = require('./routes')
const {
	globalErrorController,
	notFound,
} = require('./controllers/error.controller')

const app = express()

const corsOptions = {
	origin: process.env.CLIENT_URL || '*',
	methods: 'GET,POST,PUT,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
configPassport(passport)

app.use('/auth', authRouter)
app.use('/oauth', oauthRouter)
app.use('/api', apiRouter)

app.route('*').all(notFound)

app.use(globalErrorController)

module.exports = app
