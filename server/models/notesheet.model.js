const { Schema, model } = require('mongoose')
const { indexOfById } = require('../utils/api.util')

const notesheetSchema = new Schema({
	subject: {
		type: String,
		required: [true, 'Subject for notesheet is required'],
		trim: true,
	},
	amount: {
		type: Number,
		required: [true, 'Amount for notesheet is required'],
		immutable: true,
	},
	raisedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Raised by detail is required'],
		immutable: true,
	},
	raisedAt: {
		type: Date,
		default: () => Date.now(),
		immutable: true,
	},
	pdf: {
		type: String,
		required: [true, 'PDF link is required'],
		immutable: true,
	},
	expiresAt: {
		type: Date,
		default: () => getNextMidnight(21),
		immutable: true,
	},
	requiredApprovals: {
		type: [Schema.Types.ObjectId],
		ref: 'User',
		// required: [true, 'Required approvals is required'],
	},
	currentRequiredApproval: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		default: function () {
			return this.requiredApprovals[0]
		},
	},
	status: {
		passedApprovals: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
			default: [],
		},
		currentRequiredApproval: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		pendingApprovals: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
			default: [],
		},
		rejectedBy: {
			admin: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				default: null,
			},
			comment: {
				type: String,
				default: null,
			},
		},
	},
})

notesheetSchema.pre('save', function (next) {
	if (this.requiredApprovals && this.requiredApprovals.length > 0) {
		const index = indexOfById(
			this.requiredApprovals,
			this.currentRequiredApproval?.id
		)

		if (index !== -1 && index < this.requiredApprovals.length) {
			this.status.passedApprovals = this.requiredApprovals.slice(0, index)
			this.status.currentRequiredApproval = this.currentRequiredApproval
			this.status.pendingApprovals = this.requiredApprovals.slice(
				index + 1
			)
		} else {
			this.status.passedApprovals = this.requiredApprovals
			this.status.currentRequiredApproval = null
			this.status.pendingApprovals = []
		}
	} else {
		this.status.passedApprovals = []
		this.status.currentRequiredApproval = null
		this.status.pendingApprovals = []
	}

	next()
})

module.exports = model('Notesheet', notesheetSchema)

function getNextMidnight(daysToAdd) {
	const now = new Date()
	const midnight = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + daysToAdd
	)
	midnight.setHours(0, 0, 0, 0)
	return midnight
}
