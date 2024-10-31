const express = require('express')
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware')
const {
	uploadPDF,
	reuploadPDF,
	getUserID,
} = require('../middlewares/api.middleware')

const router = express.Router()

const {
	getUserByID,
	downloadPDF,
	blurImage,
	dynamicBlurImage,
	getNotesheetById,
	getNotesheetsByUserID,
	getRaisedNotesheetsByUserID,
	getNotesheetsToApproveByUserID,
	getNotesheetsApprovedByUserID,
	createNotesheet,
	approveNotesheet,
	rejectNotesheet,
} = require('../controllers/api.controller')

//user-related fetch routes
router.route('/user/me').get(isAuthenticated, getUserID, getUserByID)
router.route('/user/:id').get(isAuthenticated, isAdmin, getUserByID)
router.route('/download/notesheet/:pdf').get(downloadPDF)

//notesheet-related fetch routes
router.route('/notesheet/:id').get(isAuthenticated, getNotesheetById)
router
	.route('/notesheet')
	.get(isAuthenticated, getUserID, getNotesheetsByUserID)

// router
// 	.route('/notesheet/raised/user/me')
// 	.get(isAuthenticated, getUserID, getRaisedNotesheetsByUserID)
// router
// 	.route('/notesheet/to-approve/user/me')
// 	.get(isAuthenticated, isAdmin, getUserID, getNotesheetsToApproveByUserID)
// router
// 	.route('/notesheet/approved/user/me')
// 	.get(isAuthenticated, isAdmin, getUserID, getNotesheetsApprovedByUserID)

//notesheet-related CUD routes
router
	.route('/notesheet/create')
	.post(isAuthenticated, getUserID, uploadPDF, createNotesheet)
router
	.route('/notesheet/approve')
	.patch(isAuthenticated, isAdmin, getUserID, reuploadPDF, approveNotesheet)
router
	.route('/notesheet/reject')
	.delete(isAuthenticated, isAdmin, getUserID, rejectNotesheet)

//image-related routes
router.route('/get-blur-image').post(blurImage)
router.route('/get-dynamic-blur-image').post(dynamicBlurImage)

module.exports = router
