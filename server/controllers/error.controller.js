class AppError extends Error {
	constructor(message, status) {
		super(message)

		this.status = status
		this.isOperational = true

		Error.captureStackTrace(this, this.constructor)
	}
}

const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	}
}

const handleDevError = (err, res) => {
	return res.status(err.status).json({
		status: err.status || 500,
		message: err.message,
		stack: err.stack,
	})
}

const handleProdError = (err, res) => {
	if (err.isOperational) {
		return res.status(err.status).json({
			status: err.status,
			message: err.message,
		})
	} else {
		//logic for database errors

		return res.status(500).json({
			status: 500,
			message: 'Something went wrong!',
		})
	}
}

const globalErrorController = (err, req, res, next) => {
	if (process.env.NODE_ENV !== 'test') console.log(err)

	if (process.env.NODE_ENV === 'development') {
		handleDevError(err, res)
	}

	handleProdError(err, res)
}

const notFound = (req, res, next) => {
	next(new AppError('Endpoint does not exist', 404))
}

module.exports = { globalErrorController, notFound, catchAsync, AppError }
