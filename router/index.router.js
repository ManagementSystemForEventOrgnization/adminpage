const express = require('express');
const router = express.Router();
const indexController = require('../controller/index.controller');

router.get('/', indexController.home);
router.get('/event', indexController.event);
router.get('/user', indexController.user);
router.get('/Account', indexController.Account);
router.get('/Branch', indexController.Branch);
router.get('/Department', indexController.Department);
router.get('/event/category', indexController.eventCategory);
router.get('/event/applyEvent/:id', indexController.listApplyEvent);
router.get('/traTienKhach', indexController.traTienKhach);
router.get('/approve_event', indexController.approve_event);
router.get('/login', indexController.login);
router.get('/thu', indexController.thu);
module.exports = router;