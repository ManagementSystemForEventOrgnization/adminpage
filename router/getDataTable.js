const express = require('express');
const router = express.Router();
const getDataTable = require('../controller/getDataTable');

router.get('/event', getDataTable.getEvent);
router.get('/approve_event', getDataTable.approve_event);
router.get('/require_edit_event', getDataTable.require_edit_event);


router.get('/applyEvent', getDataTable.getApplyEvent)
router.get('/apply_event_cancel', getDataTable.apply_event_cancel)

router.get('/user', getDataTable.users)
router.get('/Account', getDataTable.Account)
router.get('/eventCategory', getDataTable.eventCategory)
router.get('/Branch', getDataTable.Branch)
router.get('/Department', getDataTable.Department)
router.get('/thu',getDataTable.thu);
router.get('/event_cancel',getDataTable.getEventCancel);
router.get('/refund',getDataTable.refund);
router.get('/chi',getDataTable.chi);
router.get('/thanh_toan',getDataTable.thanh_toan);
module.exports = router;