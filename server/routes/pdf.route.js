const express = require('express')

const { createSign, mergeSign } = require('../controllers/pdf.controller')

const router = express.Router()

router.route('/create-sign').post(createSign)
router.route('/merge-sign').post(mergeSign)

module.exports = router
