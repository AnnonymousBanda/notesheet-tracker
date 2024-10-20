const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')

const router = express.Router()

const {
	getUserByID,
	blurImage,
	dynamicBlurImage,
	getRaisedNotesheetsByUserID,
	getNotesheetsToApproveByUserID,
	createNotesheet,
	approveNotesheet,
	rejectNotesheet,
} = require('../controllers/api.controller')
const { getUserID } = require('../middlewares/api.middleware')

//user-related fetch routes
router.route('/user/me').get(isAuthenticated, getUserID, getUserByID)
router.route('/user/:id').get(isAuthenticated, isAdmin, getUserByID)

//notesheet-related fetch routes
router
	.route('/notesheet/raised/user/me')
	.get(isAuthenticated, getUserID, getRaisedNotesheetsByUserID)
router
	.route('/notesheet/to-approve/user/me')
	.get(isAuthenticated, isAdmin, getUserID, getNotesheetsToApproveByUserID)

//notesheet-related CRUD routes
router
	.route('/notesheet/create')
	.post(isAuthenticated, getUserID, createNotesheet)
router
	.route('/notesheet/approve')
	.patch(isAuthenticated, isAdmin, getUserID, approveNotesheet)
router
	.route('/notesheet/reject')
	.patch(isAuthenticated, isAdmin, getUserID, rejectNotesheet)

//image-related routes
router.route('/get-blur-image').post(blurImage)
router.route('/get-dynamic-blur-image').post(dynamicBlurImage)

module.exports = router
