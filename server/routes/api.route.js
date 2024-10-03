const express = require('express')

const { notesheets } = require('../controllers/api.controller')

const router = express.Router(notesheets)

router.route('/').get(notesheets)

module.exports = router
