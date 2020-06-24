const express = require('express');
const router = express.Router();
const getDataTable = require('../controller/getDataTable');

router.get('/event', getDataTable.getEvent);
router.get('/approve_event', getDataTable.approve_event);
router.get('/applyEvent', getDataTable.getApplyEvent)
router.get('/user', getDataTable.users)
router.get('/Account', getDataTable.Account)
router.get('/eventCategory', getDataTable.eventCategory)
router.get('/Branch', getDataTable.Branch)
router.get('/Department', getDataTable.Department)

router.get('/event_cancel',getDataTable.getEventCancel);


module.exports = router;