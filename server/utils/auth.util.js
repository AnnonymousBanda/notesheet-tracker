const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: process.env.JWT_EXPIRES_IN,
	})
}

const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

const comparePasswords = async (password, hashedPassword) => {
	return await bcrypt.compare(password, hashedPassword)
}

const sendResetToken = (email, token) => {
	console.log('Sending password reset token to ', email)
}

module.exports = {
	signToken,
	verifyToken,
	comparePasswords,
	sendResetToken,
}
