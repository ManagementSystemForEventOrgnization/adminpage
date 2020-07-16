const express = require('express');
const router = express.Router();
const apiController = require('../controller/api.controller');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ApplyEvent = mongoose.model('event');
router.post('/Branch', apiController.Branch);
router.post('/Department', apiController.Department);

router.post('/addEventCategory', apiController.addEventCategory);
router.post('/deleteEventCategory', apiController.deleteEventCategory);
router.post('/updateEventCategory', apiController.updateEventCategory);

router.post('/addUser', apiController.addUser);
router.post('/deleteUser', apiController.deleteUser);

router.post('/addAccount', apiController.addAccount);
// router.post('/updateAccount', apiController.updateAccount);
router.post('/deleteAccount', apiController.deleteAccount);

router.post('/addBranch', apiController.addBranch);
router.post('/deleteBranch', apiController.deleteBranch);
router.post('/updateBranch', apiController.updateBranch);

router.post('/addDepartment', apiController.addDepartment);
router.post('/deleteDepartment', apiController.deleteDepartment);
router.post('/updateDepartment', apiController.updateDepartment);

router.post('/deleteEvent', apiController.deleteEvent)
router.post('/add_thu', apiController.add_thu);
router.post('/user/report', apiController.user_report);
router.post('/require_edit_event', apiController.require_edit_event);

router.post('/event/reject_user', apiController.reject_event);
router.post('/login',apiController.login);

router.post('/thanh_toan',apiController.thanh_toan);



router.post('/push_notification', apiController.push_notification)




module.exports = router;