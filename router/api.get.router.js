const express = require('express');
const router = express.Router();
const apiController = require('../controller/api.get.controller');

router.get('/get_session/:id', apiController.getSession);
router.get('/get_session_cancel/:id', apiController.getSessionCancel);
router.get('/chat/get_list',apiController.getList);

module.exports = router;