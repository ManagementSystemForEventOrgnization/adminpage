
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

const key = require('../config/key');

module.exports = {

    getSession: async (req, res, next) => {
        let { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        // let e = await Event.findById(id,
        //     {
        //         session:
        //             { $elemMatch: { $or: [{ isCancel: false }, { isCancel: { $exists: false } }] } },
        //         name: 1, category: 1, userId: 1, createdAt: 1, status: 1,
        //         isSellTicket: 1,
        //         ticket: 1,
        //         bannerUrl: 1,
        //         urlWeb: 1
        //     }).populate("category").populate("userId")

        let e = await Event.aggregate([
            { $match: { _id: ObjectId(id) } },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: "$userId"
            },
            {
                $lookup:
                {
                    from: "eventcategories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    name: 1, category: 1, userId: 1, createdAt: 1, status: 1,
                    isSellTicket: 1,
                    ticket: 1,
                    bannerUrl: 1,
                    urlWeb: 1,
                    'session': {
                        $filter: {
                            input: "$session",
                            as: "item",
                            cond: { $not: { $eq: ["$$item.isCancel", true] } }
                        }
                    }
                }
            },
        ])
        if (!e[0]) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        res.status(200).json({ result: e[0] });
    },

    getSessionApply: async (req, res, next) => {
        let { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Event not exists!' })
        }
        let e = await ApplyEvent.aggregate([
            { $match: { _id: ObjectId(id) } },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $unwind: "$userId"
            },
            {
                $lookup:
                {
                    from: "events",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "event"
                }
            },
            {
                $unwind: "$event"
            },
            {
                $project: {
                    event: 1, userId: 1, createdAt: 1,
                    'session': {
                        $filter: {
                            input: "$session",
                            as: "item",
                            cond: { $not: { $eq: ["$$item.isReject", true] } }
                        }
                    }
                }
            },
        ])
        if (!e[0]) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        res.status(200).json({ result: e[0] });
    },

    getSessionCancel: async (req, res, next) => {
        let { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'Event not exists!' })
        }

        Promise.all([
            Event.aggregate([
                { $match: { _id: ObjectId(id) } },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userId"
                    }
                },
                { $unwind: '$userId' },
                {
                    $lookup:
                    {
                        from: "eventcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $unwind: '$category' },
                {
                    $project: {
                        name: 1, isSellTicket: 1, ticket: 1, urlWeb: 1, userId: 1, createdAt: 1, category:1,
                        'session': {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: { $not: { $eq: ["$$item.isCancel", false] } }
                            }
                        }
                    }
                },
            ])
        ]).then(([e]) => {
            if (!e[0]) {
                return res.status(404).json({ message: 'Event not exists!' })
            }

            res.status(200).json({ result: e[0] });
        })

    },

    getList: async (req, res, next) => {
        let { sender, pageNumber } = req.query;
        pageNumber = pageNumber || 1;
        Axios.get(`${key.back_end_uri}/chat/get_list?sender=${sender}&pageNumber=${pageNumber}`)
            .then(data => {
                res.status(200).json({ ...data.data });
            }).catch(err => {

            })
    },

    get_list_report: async (req, res, next) => {
        let { _id } = req.query;
        if (!_id) {
            res.status(400).json({ error: 'Invalid data' });
            return;
        }
        let u = await User.findById(_id).populate('userReport.userId').populate("userReport.eventId");

        if (!u) {
            res.status(400).json({ error: 'User is not exists!' });
            return;
        }
        let arr = u.userReport;
        res.status(200).json({ result: { list: arr, userName: u.fullName } });
    }


};