const jwt = require('jsonwebtoken')

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: process.env.JWT_EXPIRES_IN,
	})
}

const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

const sendResetToken = (email, token) => {
	console.log(`http://localhost:3000/auth/reset/${token}`)
}

module.exports = {
	signToken,
	verifyToken,
	sendResetToken,
}
