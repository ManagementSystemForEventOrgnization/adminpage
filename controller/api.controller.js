const mongoose = require('mongoose');
const Event = mongoose.model('event');
const User = mongoose.model('users');
const ApplyEvent = mongoose.model('applyEvent');
const EventCategory = mongoose.model('eventCategory');
const Branch = mongoose.model('branches');
const Department = mongoose.model('departments');
const Account = mongoose.model('accounts')
const Thu = mongoose.model('thus');
const Notification = mongoose.model('notification');
const Chi = mongoose.model('chis');
const Passport = require('passport');
const Axios = require('axios');
const key = require('../config/key');
const Payment = mongoose.model('payment')
const notification = require('../utils/notification');
const { response } = require('express');

const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    Branch: async (req, res) => {
        let branch = await Branch.find({ isDelete: false });
        res.status(200).json(branch);
    },

    Department: async (req, res) => {
        let department = await Department.find({ isDelete: false });
        res.status(200).json(department);
    },

    addEventCategory: async (req, res) => {
        if (typeof req.body.ten === undefined) {
            res.status(200).json({ message: 'Thông tin không hợp lệ' });
        } else {
            let { ten } = req.body;

            ten = ten.toUpperCase();

            let eCategory = new EventCategory({ name: ten });
            let check = await EventCategory.findOne({ 'name': ten });
            try {
                if (check) {
                    res.status(200).json({ message: 'Tên loại sự kiện đã tồn tại!' })
                } else {
                    let save = await eCategory.save();
                    if (!save) {
                        res.status(200).json({ message: 'Lỗi không thêm vào được' })
                    } else {
                        res.status(200).json({ message: 'success' });
                    }
                }
            } catch (error) {
                res.status(200).json(error);
            }
        }
    },
    deleteEventCategory: async (req, res) => {
        let { id } = req.body;
        if (!id) {
            res.status(200).json({ message: 'Thông tin không hợp lệ' });
        } else {
            try {
                let isDelete = await EventCategory.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: { "isDelete": true } });

                if (isDelete) {
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(200).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(200).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },
    updateEventCategory: async (req, res) => {
        let { id, ten } = req.body;
        if (!id) {
            res.status(200).json({ message: 'Thông tin không hợp lệ' });
        } else {
            ten = ten.toUpperCase();

            try {
                let check = await EventCategory.findByIdAndUpdate({ _id: ObjectId(id) }, { 'name': ten });
                if (!check) {
                    res.status(200).json({ message: 'Thông tin sự kiện chưa chính xác! Vui lòng thực hiện lại.' })
                } else {
                    res.status(200).json({ message: 'success' });
                }
            } catch (error) {
                res.status(600).json({ message: 'Không tìm thấy thông tin' });
            }
        }
    },

    addUser: async (req, res) => {
        if ((typeof req.body.email === 'undefined')
            || (typeof req.body.password === 'undefined')
            || typeof req.body.fullName === 'undefined'
        ) {
            res.status(422).json({ message: 'Invalid data' });
            return;
        }
        let { email, password, fullName } = req.body;
        let regex = /^[a-zA-Z][a-z0-9A-Z\.\_]{1,}@[a-z0-9]{2,}(\.[a-z0-9]{1,4}){1,2}$/gm
        if (!regex.test(email) || password.length < 3) {
            res.status(422).json({ message: 'Invalid mail data' });
            return;
        }
        let userFind = null;
        try {
            userFind = await User.findOne({ 'email': email });
        }
        catch (err) {
            res.status(500).json({ message: err });
            return;
        }
        if (userFind) {
            res.status(600).json({ message: 'Email already exist' });
            return;
        }
        const newUser = new User({
            email: email,
            fullName: fullName,
            hashPass: password,
        });
        try {
            let u = await newUser.save();
            return res.status(200).json(u);
        }
        catch (err) {
            res.status(500).json({ message: err });
            return;
        }
    },
    deleteUser: async (req, res) => {
        let { _id } = req.body;
        if (typeof _id === undefined) {
            res.status(422).json({ message: 'Không có thông tin' });
        } else {
            try {
                // reject nó ra khỏi event trước khi xóa nó đi.....
                let isApply = await ApplyEvent.findOne({
                    userId: ObjectId('5ec8cff211a11d17ae93aed3'),
                    $or: [
                        { 'session': { $elemMatch: { isCancel: {$ne: true}, isReject: false, day: {$gte : new Date()} , isRefund: false, paymentStatus: 'PAID' } } },
                        { 'session': { $elemMatch: { isCancel: {$ne: true}, isReject: false, day: {$gte : new Date()}, paymentId: { $exists: false } } } }
                    ]
                });

                if(isApply){
                    res.status(600).json({message: 'exists'});
                    return;
                }
                
                return;

                // check xem usser nay có đang trong tham gia sự kiện nào mà chưa refund hay không. nếu có thì phải refund.

                let isDelete = await User.findByIdAndUpdate({ _id: ObjectId(_id) }, { $set: { "dateDelete": new Date().toString() } });
                if (isDelete) {
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(422).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(422).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },

    addAccount: async (req, res) => {
        if ((typeof req.body.username === 'undefined')
            || (typeof req.body.password === 'undefined')
            || (typeof req.body.name === 'undefined')
        ) {
            res.status(422).json({ message: 'Invalid data' });
            return;
        }
        let { username, name, password, branch, department } = req.body;

        let accountFind = null;
        try {
            accountFind = await Account.findOne({ username });
        }
        catch (err) {
            res.status(500).json({ message: err });
            return;
        }
        if (accountFind) {
            res.status(600).json({ message: 'Email already exist' });
            return;
        }

        const newUser = new Account({
            name, username,
            password,
            branch, department
        });
        try {
            let u = await newUser.save();
            return res.status(200).json(u);
        }
        catch (err) {
            res.status(500).json({ message: err });
            return;
        }
    },
    deleteAccount: async (req, res) => {
        let { _id } = req.body;
        if (typeof _id === undefined) {
            res.status(422).json({ message: 'Không có thông tin' });
        } else {
            try {
                let isDelete = await Account.findByIdAndUpdate({ _id: ObjectId(_id) }, { $set: { "dateDelete": new Date().toString() } });
                if (isDelete) {
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(422).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(422).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },
    updateAccount: async (req, res, next) => {

    },

    addBranch: async (req, res) => {
        try {
            if (typeof req.body.ten === undefined) {
                res.status(600).json({ message: 'Thông tin không hợp lệ' });
            } else {
                let { ten } = req.body;
                ten = ten.toUpperCase();

                let branch = new Branch({ name: ten });
                let check = await Branch.findOne({ 'name': ten });

                if (check) {
                    res.status(600).json({ message: 'Tên chi nhánh đã tồn tại!' })
                } else {
                    let save = await branch.save();
                    if (!save) {
                        res.status(600).json({ message: 'Lỗi không thêm vào được' })
                    } else {
                        res.status(200).json({ message: 'success' });
                    }
                }
            }
        } catch (error) {
            res.status(600).json(error);
        }
    },
    deleteBranch: async (req, res) => {
        let { id } = req.body;
        if (!id) {
            res.status(600).json({ message: 'Thông tin không hợp lệ' });
        } else {
            try {
                let isDelete = await Branch.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: { "isDelete": true } });

                if (isDelete) {
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(600).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(600).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },
    updateBranch: async (req, res) => {
        let { id, ten } = req.body;
        if (!id) {
            res.status(600).json({ message: 'Thông tin không hợp lệ' });
        } else {
            ten = ten.toUpperCase();

            try {
                let check = await Branch.findByIdAndUpdate({ _id: ObjectId(id) }, { 'name': ten });
                if (!check) {
                    res.status(600).json({ message: 'Thông tin chưa chính xác! Vui lòng thực hiện lại.' })
                } else {
                    res.status(200).json({ message: 'success' });
                }
            } catch (error) {
                res.status(600).json({ message: 'Không tìm thấy thông tin' });
            }
        }
    },

    addDepartment: async (req, res) => {
        try {
            if (typeof req.body.ten === undefined) {
                res.status(600).json({ message: 'Thông tin không hợp lệ' });
            } else {
                let { ten } = req.body;
                ten = ten.toUpperCase();

                let department = new Department({ name: ten });
                let check = await Department.findOne({ 'name': ten });

                if (check) {
                    res.status(600).json({ message: 'Tên phòng ban đã tồn tại!' })
                } else {
                    let save = await department.save();
                    if (!save) {
                        res.status(600).json({ message: 'Lỗi không thêm vào được' })
                    } else {
                        res.status(200).json({ message: 'success' });
                    }
                }
            }
        } catch (error) {
            res.status(600).json(error);
        }
    },
    deleteDepartment: async (req, res) => {
        let { id } = req.body;
        if (!id) {
            res.status(600).json({ message: 'Thông tin không hợp lệ' });
        } else {
            try {
                let isDelete = await Department.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: { "isDelete": true } });

                if (isDelete) {
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(600).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(600).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },
    updateDepartment: async (req, res) => {
        let { id, ten } = req.body;
        if (!id) {
            res.status(600).json({ message: 'Thông tin không hợp lệ' });
        } else {
            ten = ten.toUpperCase();

            try {
                let check = await Department.findByIdAndUpdate({ _id: ObjectId(id) }, { 'name': ten });
                if (!check) {
                    res.status(600).json({ message: 'Thông tin chưa chính xác! Vui lòng thực hiện lại.' })
                } else {
                    res.status(200).json({ message: 'success' });
                }
            } catch (error) {
                res.status(600).json({ message: 'Không tìm thấy thông tin' });
            }
        }
    },

    deleteEvent: async (req, res) => {
        let { id, status } = req.body;
        status = status || 'CANCEL';
        if (!id) {
            res.status(600).json({ message: 'Thông tin không hợp lệ' });
        } else {
            try {

                let update = { $set: { 'session.$[elem].isCancel': true, 'session.$[elem].status': 'CANCEL' } };
                let multi = {
                    multi: true,
                    arrayFilters: [{ "elem.isCancel": false, "elem.status": { $ne: 'CANCEL' } }]
                };
                let update1 = { $set: { 'session.$[elem].isCancel': true, 'session.$[elem].status': 'CANCEL', status: 'CANCEL' } };
                let multi1 = {
                    multi: true,
                    arrayFilters: [{ "elem.isCancel": { $ne: true }, "elem.status": { $ne: 'CANCEL' } }]
                };
                if (status != "CANCEL") {
                    update1 = { $set: { "status": status } };
                    multi1 = { multi: false };
                }
                console.log(update1);
                let isDelete = await Event.findByIdAndUpdate({ _id: ObjectId(id) }, update1, multi1);

                if (isDelete) {
                    if (status != "CANCEL") {
                        const newNotification = new Notification({
                            sender: key.adminId,
                            receiver: [isDelete.userId],
                            type: `EVENT_${status}`,
                            message: "",
                            title: `Admin ${status} event ${isDelete.name}`,
                            linkTo: {
                                key: "EventDetail",
                                _id: isDelete._id,
                            },
                            isRead: false,
                            isDelete: false
                        });
                        await newNotification.save();
                    } else {
                        await ApplyEvent.updateMany({ eventId: ObjectId(id) }, update, multi);
                    }
                    res.status(200).json({ message: 'success' });
                } else {
                    res.status(600).json({ message: 'Xay ra loi' })
                }
            } catch (error) {
                res.status(600).json({ message: 'Xảy ra lỗi. Mục xóa không tồn tại' });
            }
        }

    },


    add_thu: async (req, res) => {
        let object = { ...req.body };
        // name, email, phone, type, note, amountMoney

        if (!object.name) {
            res.status(600).json({ error: { message: 'Invalid data' } });
        }
        let thu = new Thu({
            ...object
        });
        let userThu = req.user;

        thu.userThu = userThu;

        let t = await thu.save();
        if (!t) {
            return res.status(600).json({ error: { message: 'Can\'t save' } });
        }
        res.status(200).json({ result: t });

    },
    deleteThu: async (req, res) => {
        let { _id } = req.body;
        if (!_id) {
            res.status(600).json({ error: { message: 'Invalid data' } });
            return;
        }

        let thu = await Thu.findByIdAndUpdate(_id, { dateDelete: Date.now() });
        if (!thu) {
            res.status(600).json({ error: { message: 'Phiếu thu không tồn tại' } });
            return;
        }

        res.status(200).json({ result: thu });
    },
    updateThu: async (req, res) => {
        let thuUpdate = { ...req.body };

        let _id = req.body._id;

        if (!_id) {
            res.status(600).json({ error: { message: 'Invalid data' } });
            return;
        }
        delete thuUpdate["_id"];
        if (!Object.keys(thuUpdate).length) {
            res.status(200).json({ result: 'Success' });
            return;
        }

        let t = await Thu.findByIdAndUpdate(_id, thuUpdate);

        if (!t) {
            res.status(600).json({ error: { message: 'Something is wrong' } });
            return;
        }


        res.status(200).json({ result: t });

    },

    addChi: async (req, res) => {
        let object = { ...req.body };

        if (!object.name) {
            res.status(600).json({ error: { message: 'Invalid data' } });
        }
        let chi = new Chi({
            ...object
        });

        let userChi = req.user;
        chi.userChi = userChi;
        let c = await chi.save();
        if (!c) {
            res.status(600).json({ error: { message: 'Can\'t save' } });
            return;
        }
        res.status(200).json({ result: c });
    },
    require_edit_event: async (req, res, next) => {
        let { id, isEdit: isE } = req.body;
        if (!id) {
            res.status(600).json({ message: 'Sự kiện không tồn tại' });
            return;
        }
        try {
            let e = await Event.findById(id);
            if (!e) {
                res.status(600).json({ message: 'Sự kiện không tồn tại' });
                return;
            }

            if (!e.isRequire) {
                res.status(600).json({ message: 'Event approved! You should check log' });
                return;
            }
            if (!+isE) {
                // nay là khoong xác nhận
                e.isRequire = false;
                e.save().then(d => {
                    // noti
                    const newNotification = new Notification({
                        sender: key.adminId,
                        receiver: [e.userId],
                        type: `REJECT_EDIT`,
                        message: "",
                        title: `Admin reject edit`,
                        linkTo: {
                            key: "EventDetail",
                            _id: e._id,
                        },
                        isRead: false,
                        isDelete: false
                    });
                    newNotification.save();
                    res.status(200).json({ result: true });
                    return;
                })
            } else {

                if (!e.isRequire) {
                    res.status(600).json({ message: 'Event approved! You should check log' });
                    return;
                }
                let isEdit = e.isEdit || '0';
                if ((+isEdit - (+Date.now())) > 0) {
                    e.isRequire = false;
                    e.save();
                    res.status(200).json({ result: true });
                    return;
                }
                e.isEdit = (+Date.now()) + 86400000;
                e.isRequire = false;
                e.save().then(() => {
                    // noti
                    const newNotification = new Notification({
                        sender: key.adminId,
                        receiver: [e.userId],
                        type: `APPROVE_EDIT`,
                        message: "",
                        title: `Admin approve edit`,
                        linkTo: {
                            key: "EventDetail",
                            _id: e._id,
                        },
                        isRead: false,
                        isDelete: false
                    });
                    newNotification.save();
                    res.status(200).json({ result: true });
                }).catch(e => {
                    res.status(600).json({ message: 'Không thể cấp quyền' })
                    return;
                })
            }
        } catch (error) {
            res.status(600).json({ message: 'Sự kiện không tồn tại' });
            return;
        }
    },

    user_report: async (req, res, next) => {
        let { _id } = req.body;

        if (!_id) {
            res.json(500).json({ message: 'Invalid data' });
            return;
        }

        let u = await User.findByIdAndUpdate(_id, { isReported: true });

        if (!u) {
            res.status(500).json({ message: 'User is not exists' });
            return;
        }

        res.status(200).json({ result: u });
    },

    reject_event: async (req, res, next) => {
        let { applyEventId, sessionId, userId } = req.body;
        let condition = { _id: ObjectId(applyEventId) };
        let update = { $set: { 'session.$[elem].isReject': true } };
        let conditionFilter = {};
        let multi = {
            multi: true,
            arrayFilters: [{ "elem.isReject": false, 'elem.isRefund': false, "elem.id": { $in: sessionId } }]
        };
        if (sessionId) {
            conditionFilter = { $in: ["$$item.id", sessionId] };
            condition.session = { $elemMatch: { id: { $in: sessionId }, isReject: false } };
            multi.arrayFilters = [{ "elem.isReject": false, "elem.id": { $in: sessionId } }];
        } else {
            conditionFilter = { $eq: ["$$item.isReject", false] };
            condition.session = { $elemMatch: { isReject: false } };
            multi.arrayFilters = [{ "elem.isReject": false }];
        }
        Promise.all([
            // ApplyEvent.findOneAndUpdate(condition, update, multi),
            ApplyEvent.aggregate([
                { $match: condition },
                {
                    $project: {
                        userId: 1, eventId: 1,
                        session: {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: conditionFilter
                            }
                        }
                    }
                }
            ])
        ]).then(([listSession]) => {
            if (!listSession[0]) {
                res.status(500).json({ message: 'Người dùng không còn trong sự kiện' });
                return;
            }
            let object = { ...listSession[0] };
            let eventId = object.eventId;
            let joinUserId = object.userId;
            let session = object.session;
            let status = '';
            let length = session.length;
            let func = (eventId, sessionId, joinUserId, paymentId, i, callBack) => {
                Axios.post(`${key.back_end_uri}/refundForCancelledUser`,
                    {
                        paymentId,
                        joinUserId,
                        eventId,
                        sessionId,
                        adminId: key.adminId
                    }).then(d => {
                        callBack(true, i)
                    }).catch(e => {
                        console.log(e.response.data);
                        callBack(false, i)
                    });
            }
            let callBack = (d, i) => {
                if (!d) {
                    status += i + ", ";
                }
                if (i == length - 1) {
                    console.log(status);
                    res.status(200).json(status);
                    return;
                }
            }
            for (let i = 0; i < session.length; i++) {
                let element = session[i];
                let sessionId = element.id;
                let paymentId = element.paymentId;
                console.log(sessionId)
                console.log(paymentId)
                if (paymentId)
                    func(eventId, sessionId, joinUserId, paymentId, i, callBack)
            }
        })
    },


    login: (req, res, next) => {
        Passport.authenticate("local", function (err, user, info) {
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

                // res.redirect('/');
                return res.status(200).json({ result: user });
            });
        })(req, res, next);
    },

    thanh_toan: async (req, res, next) => {
        let { id, amount } = req.body;
        if (!id) {
            return res.status(600).json({ message: 'Invalid data' });
        }

        let e = await Event.findById(id);

        const pay = new Payment({
            sender: key.adminId,
            eventId: id,
            receiver: e.userId,
            amount: amount,
            description: 'Thanh toán sự kiện',
            payType: "ZALOPAY",
            status: "PAID",
            session: []
        });


        e.paymentId = pay._id;
        const newNotification = new Notification({
            sender: key.adminId,
            receiver: e.userId,
            type: "ADMIN_PAYMENT",
            message: "",
            title: "Admin sent money",
            linkTo: {
                key: "PaymentInfo",
                _id: pay._id
            },
            isRead: false,
            isDelete: false,
            session: []
        });
        Promise.all([
            pay.save(),
            e.save(),
            newNotification.save()
        ]).then(d => {
            res.status(200).json({ result: true });

        }).catch(e => {
            res.status(600).json({ message: "Something is wrong!" });
        })

    },

    push_notification: async (req, res, next) => {
        let { content } = req.body;
        console.log(content)
        // const response = await notification.get_all_user();
        // console.log(response.body);
        let response = await notification.create_notification(req.body.content) // edit_device(req.body.id);
        res.status(200).json(response);
    },

    edit_device: async (req, res, next) => {
        let { id, name } = req.body;

        const response = await notification.edit_device(id, name);
        res.status(200).json(response);
    }


};