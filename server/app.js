const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
// const xss = require('xss-clean')

const configPassport = require('./config/oauth.config')
const { apiRouter, authRouter, oauthRouter } = require('./routes')
const {
	globalErrorController,
	notFound,
} = require('./controllers/error.controller')

const app = express()

const corsOptions = {
	origin: process.env.CLIENT_URL || '*',
	methods: 'GET,POST,PUT,DELETE,PATCH',
	allowedHeaders: 'Content-Type,Authorization',
	credentials: true,
	optionsSuccessStatus: 200,
}

const helmetConfig = helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		scriptSrc: ["'self'"],
		objectSrc: ["'none'"],
		frameAncestors: ["'self'", "http://localhost:3000", "http://localhost:8000"],
		upgradeInsecureRequests: [],
	},
})

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
	message: 'Too many requests from this IP, please try again later.',
})

app.use(cors(corsOptions))
app.use(helmet())
app.use(helmetConfig)
app.use(mongoSanitize())
app.use(limiter)

app.use(morgan('dev'))

app.use(passport.initialize())
configPassport(passport)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.use('/auth', authRouter)
app.use('/oauth', oauthRouter)
app.use('/api', apiRouter)

app.route('*').all(notFound)
app.use(globalErrorController)

module.exports = app
