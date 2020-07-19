const express = require('express');
const router = express.Router();
const indexController = require('../controller/index.controller');
const passport = require('passport');

const auth = require('../middlewares/authen_login');

router.get('/',auth, indexController.home);
router.get('/event',auth, indexController.event);
router.get('/user',auth, indexController.user);
router.get('/Account', auth,indexController.Account);
router.get('/Branch', auth,indexController.Branch);
router.get('/Department',auth, indexController.Department);
router.get('/event/category',auth, indexController.eventCategory);
router.get('/event/applyEvent/:id',auth, indexController.listApplyEvent);
router.get('/event/apply_event_cancel/:id',auth, indexController.listApplyEventCancel);

router.get('/traTienKhach',auth, indexController.traTienKhach);
router.get('/approve_event',auth, indexController.approve_event);
router.get('/login', indexController.login);
router.get('/logout',auth, indexController.logout);
router.post('/login', (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        
        if (err) {
            return res.status(600).json({ message: err });
        }

        if (!user) {
            return res.status(600).json({ message: info.message, code: 620 });
        }


        req.logIn(user._id, function (err) {
            if (err) {
                return res.status(600).json({ message: err });
            }

            res.redirect('/');
            // return res.status(200).json({ result: user });
        });


    })(req, res, next);

});

router.get('/thu',auth, indexController.thu);
router.get('/refund',auth, indexController.refund);
router.get('/chi',auth, indexController.chi);
router.get('/require_edit_event',auth, indexController.require_edit_event)

router.get('/thanh_toan',auth, indexController.thanh_toan);

module.exports = router;