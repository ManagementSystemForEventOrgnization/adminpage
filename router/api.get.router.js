const express = require('express');
const router = express.Router();
const apiController = require('../controller/api.get.controller');

router.get('/get_session/:id', apiController.getSession);
router.get('/get_session_apply/:id', apiController.getSessionApply);
router.get('/get_session_cancel/:id', apiController.getSessionCancel);
router.get('/chat/get_list',apiController.getList);
router.get('/user/get_list_report',apiController.get_list_report);
router.get('/get_payment_event/:id',apiController.get_payment_event);



module.exports = router;