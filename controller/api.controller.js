var bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Event = mongoose.model('event');
const User = mongoose.model('users');
const ApplyEvent = mongoose.model('applyEvent');
const EventCategory = mongoose.model('eventCategory');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
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
        if (typeof id === undefined) {
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
        if (typeof id === undefined) {
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
                res.status(200).json(error);
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
        console.log(userFind);
        if (userFind) {
            res.status(409).json({ message: 'Email already exist' });
            return;
        }
        password = bcrypt.hashSync(password, 10);
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

};