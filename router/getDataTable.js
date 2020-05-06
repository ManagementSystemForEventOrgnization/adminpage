const express = require('express');
const router = express.Router();
const getDataTable = require('../controller/getDataTable');

router.get('/event', getDataTable.getEvent);
router.get('/applyEvent', getDataTable.getApplyEvent)
router.get('/user', getDataTable.users)
router.get('/Account', getDataTable.Account)
router.get('/eventCategory', getDataTable.eventCategory)

module.exports = router;