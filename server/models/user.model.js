const bcrypt = require('bcrypt')
const validator = require('validator')

const { Schema, model } = require('mongoose')
const { AppError } = require('../controllers/error.controller')

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
		validate: {
			validator: (username) => /^[a-zA-Z0-9_@.]+$/.test(username),
			message:
				'Username can only contain letters, numbers, and the characters _@.',
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		validate: {
			validator: (password) =>
				validator.isStrongPassword(password, {
					minLength: 8,
					minLowercase: 1,
					minUppercase: 1,
					minNumbers: 1,
					minSymbols: 1,
				}),
			message:
				'Password is too weak! It must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
		},
	},
	confirmPassword: {
		type: String,
		required: true,
		minlength: 8,
		validate: {
			validator: function (value) {
				return value === this.password
			},
			message: 'Passwords do not match',
		},
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
})

userSchema.pre('save', async function (next) {
	if (this.isModified('role'))
		throw new AppError('You cannot change your role', 400)

	if (!this.isModified('password')) return next()

	this.password = await bcrypt.hash(this.password, 12)
	this.confirmPassword = undefined

	next()
})

module.exports = model('User', userSchema)
