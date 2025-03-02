const jwt = require('jsonwebtoken')
const { sendMail } = require('./api.util')

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: process.env.JWT_EXPIRES_IN,
	})
}

const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

const sendResetToken = (email, name, token) => {
	sendMail(
		email,
		'Password Reset Request',
		`
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
		  <h2 style="color: #856404;">Password Reset Request</h2>
		  <p>Dear ${name},</p>
		  <p>You have requested to reset your password. Please click the link below to reset your password:</p>
		  <p><a href="${process.env.CLIENT_URL}/auth/reset/${token}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
		  <br/>
		  <p>If you did not request this password reset, please ignore this email.</p>
		  <p>Thank you,</p>
		  <p><strong>Team Gymkhana</strong></p>
		  <p>Indian Institute of Technology Patna</p>
		</div>
		`
	)
}

module.exports = {
	signToken,
	verifyToken,
	sendResetToken,
}
