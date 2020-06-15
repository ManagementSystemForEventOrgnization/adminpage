
const mongoose = require('mongoose');
const Event = mongoose.model('event');
const User = mongoose.model('users');
const ApplyEvent = mongoose.model('applyEvent');
const EventCategory = mongoose.model('eventCategory');
const Branch = mongoose.model('branches');
const Department = mongoose.model('departments');
const Account = mongoose.model('accounts')
const Axios = require('axios');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    getSession: async (req, res, next) => {
        let { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        let e = await Event.findById(id,
            {
                session:
                    { $elemMatch: { $or: [{ isCancel: false }, { isCancel: { $exists: false } }] } },
                name: 1, category: 1, userId: 1, createdAt: 1, status: 1,
                isSellTicket: 1,
                ticket: 1,
                bannerUrl: 1,
                urlWeb: 1
            }).populate("category").populate("userId")
        if (!e) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        res.status(200).json({ result: e });
    },
    getSessionCancel: async (req, res, next) => {
        let { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        let e = await Event.findById(id,
            {
                session:
                    { $elemMatch: { isCancel: true } },
                name: 1, category: 1, userId: 1, createdAt: 1, status: 1,
                isSellTicket: 1,
                ticket: 1,
                bannerUrl: 1,
                urlWeb: 1
            })
            .populate("category").populate("userId")


        Promise.all([
            Event.findById(id,
                {
                    session:
                        { $elemMatch: { isCancel: true } },
                    name: 1, category: 1, userId: 1, createdAt: 1, status: 1,
                    isSellTicket: 1,
                    ticket: 1,
                    bannerUrl: 1,
                    urlWeb: 1
                })
                .populate("category").populate("userId"),
            ApplyEvent.countDocuments({
                session: { $elemMatch: { isCancel: true } },
            })
        ])

        if (!e) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        res.status(200).json({ result: e });
    },

    getList: async (req, res, next) => {
        let { sender, pageNumber } = req.query;
        pageNumber = pageNumber || 1;
        Axios.get(`http://localhost:5000/api/chat/get_list?sender=${sender}&pageNumber=${pageNumber}`)
            .then(data => {
                res.status(200).json({ ...data.data });
            }).catch(err => {

            })
    }


};