const express = require('express');
const router = express.Router();
const apiController = require('../controller/api.controller');

router.post('/Branch', apiController.Branch);
router.post('/Department', apiController.Department);

router.post('/addEventCategory',apiController.addEventCategory);
router.post('/deleteEventCategory',apiController.deleteEventCategory);
router.post('/updateEventCategory',apiController.updateEventCategory);

router.post('/addUser',apiController.addUser);
router.post('/deleteUser',apiController.deleteUser);


router.post('/addAccount',apiController.addAccount);
// router.post('/updateAccount', apiController.updateAccount);
router.post('/deleteAccount', apiController.deleteAccount);


module.exports = router;