const express = require('express');
const router = express.Router();
const apiController = require('../controller/api.controller');


router.post('/addEventCategory',apiController.addEventCategory);
router.post('/deleteEventCategory',apiController.deleteEventCategory);
router.post('/updateEventCategory',apiController.updateEventCategory);

router.post('/addUser',apiController.addUser);
router.post('/deleteUser',apiController.deleteUser);
module.exports = router;