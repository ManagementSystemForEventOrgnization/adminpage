const mongoose = require('mongoose');
const Event = mongoose.model('event');
const User = mongoose.model('users');
const ApplyEvent = mongoose.model('applyEvent');
const EventCategory = mongoose.model('eventCategory');
const Branch = mongoose.model('branches');
const Department = mongoose.model('departments');
const Account = mongoose.model('accounts')
const Payment = mongoose.model('payment')

const ObjectId = mongoose.Types.ObjectId;
const Base64 = require('../utils/Base64')

// new Branch({name: 'Hồ Chí Minh'}).save();
// new Department({name: 'Admin'}).save();
// new Account({name: 'Sang', username: 'admin', hashPass: 'admin'}).save();

let { formatDate, formatCurrency } = require('../utils/mainFunction');
const key = require('../config/key');
const { format } = require('morgan');

module.exports = {
    getEvent: async (req, res) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch || {};

        let draw = req.query.draw;
        let order = 0;// req.query.order[0].column;
        let orderDir = 'decs' // req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { 'status': { $nin: ['DELETE', 'CANCEL'] } };
        if (status) {
            query.status = status;
        }
        if (+fee) {
            query.isSellTicket = true;
            query["ticket.price"] = { $exists: true };
        }
        if (search != "") {
            query.$text = { $search: search };
        }
        let time = [];
        if (startDate) {
            time.push({ createdAt: { $gte: new Date(startDate) } });
        }
        if (endDate) {
            time.push({ createdAt: { $lte: new Date(endDate) } });
        }

        if (time[0]) {
            query.$and = time;
        }

        let arrSort = ['_id', 'name', 'userId', 'category', '_id', 'createdAt', 'status', '_id', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        Promise.all([
            // Event.countDocuments({ status: { $nin: ['DELETE', 'CANCEL'] } }),
            Event.aggregate([
                { $match: { status: { $nin: ['DELETE', 'CANCEL'] } } },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
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
                    $lookup:
                    {
                        from: "eventcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup:
                    {
                        from: "applyevents",
                        let: { event_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $or: [
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentStatus: 'PAID' } } },
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentId: { $exists: false } } } }
                                    ],
                                    $expr: {
                                        $and: [{ $eq: ['$eventId', '$$event_id'] }]
                                    }
                                }
                            },
                        ],
                        as: "join"
                    }
                },
                {
                    $lookup:
                    {
                        from: "payments",
                        let: { event_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    'status': 'PAID',
                                    $expr: {
                                        $and: [{ $eq: ['$eventId', '$$event_id'] },
                                        { $not: { $eq: [{ $size: '$session' }, { $size: '$sessionRefunded' }] } }]
                                    }
                                }
                            },
                        ],
                        as: "payments"
                    }
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        userId: 1,
                        createdAt: 1,
                        payments: 1,
                        totalAmount: { $sum: '$payments.amount' },
                        status: 1,
                        'session': {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: { $not: { $eq: ["$$item.isCancel", true] } }
                            }
                        },
                        numberJoin: { $cond: { if: { $isArray: "$join" }, then: { $size: "$join" }, else: "0" } }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])

        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count[0] && Count[0].passing_scores || 0,
                    "recordsFiltered": CountFilter[0] && CountFilter[0].passing_scores || 0,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    _id: value._id,
                    s1: +index + 1 + +PageNo,
                    s2: `<div class='nameEvent'>${value.name || 'Null'}</div>`,
                    s3: value.userId[0] && value.userId[0].fullName || "No_Name",
                    s4: value.category[0] && value.category[0].name || "Null",
                    s5: `<div onclick="document.location.href='/event/applyEvent/${value._id}'" class="moveClick" > ${value.numberJoin || '0'}</div>`,
                    s6: `<div class="moveClick" onclick='ShowSession("${value._id}")'> ${value.session.length || '0'}</div>`,
                    s7: formatCurrency(value.totalAmount), //formatDate(value.createdAt),
                    s8: value.status || 'PENDING',
                    s9: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    <a title='Danh sách đăng kí' class='btn btn-warning' href="/event/applyEvent/${value._id}" > <i class="fa fa-list-alt"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        }).catch(err => {
            console.log(err);
        })
    },

    approve_event: async (req, res) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { 'status': { $in: ['EDITED', 'WAITING'] } };
        if (status) {
            query.status = status;
        }

        if (search != "") {
            query.$text = { $search: search };
        }


        let arrSort = ['_id', 'name', 'userId', 'category', '_id', 'createdAt', 'status', '_id', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        Promise.all([
            // Event.countDocuments({ status: { $nin: ['DELETE', 'CANCEL'] } }),
            Event.aggregate([
                { $match: { status: { $in: ['EDITED', 'WAITING'] } } },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
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
                    $lookup:
                    {
                        from: "eventcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                // {
                //     $lookup:
                //     {
                //         from: "applyevents",
                //         localField: "_id",
                //         foreignField: "eventId",
                //         as: "join"
                //     }
                // },
                {
                    $lookup: {
                        from: "applyevents",
                        let: { event_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $or: [
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentStatus: 'PAID' } } },
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentId: { $exists: false } } } }
                                    ],
                                    $expr: {
                                        $and: [{ $eq: ['$eventId', '$$event_id'] }]
                                    }
                                }
                            },
                        ],
                        as: "join"
                    }
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        userId: 1,
                        createdAt: 1,
                        status: 1,
                        'session': {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: { $not: { $eq: ["$$item.isCancel", true] } }
                            }
                        },
                        numberJoin: { $cond: { if: { $isArray: "$join" }, then: { $size: "$join" }, else: "0" } }
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])

        ]).then(([Count, CountFilter, arr]) => {

            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count[0] && Count[0].passing_scores || 0,
                    "recordsFiltered": CountFilter[0] && CountFilter[0].passing_scores || 0,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({

                    s1: +index + 1 + +PageNo,
                    s2: `<div class='nameEvent'>${value.name || 'Null'}</div>`,
                    s3: value.userId[0] && value.userId[0].fullName || "No_Name",
                    s4: value.category[0] && value.category[0].name || "Null",
                    s5: `<div class="" > ${value.numberJoin || '0'}</div>`,
                    s6: `<div class="moveClick" onclick='ShowSession("${value._id}")'> ${value.session.length || '0'}</div>`,
                    s7: formatDate(value.createdAt),
                    s8: value.status || 'WAITING',
                    s9: `<a title='Xóa' href='javascript:void(0);' onclick='Change("${value._id}", "DELETE")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    <a title='Public' class='btn btn-warning' href="javascript: void(0);" onclick='Change("${value._id}", "PUBLIC")' > <i class="fa fa-check-circle"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        }).catch(err => {
            console.log(err);
        })
    },
    require_edit_event: async (req, res) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { isRequire: true };
        if (status) {
            query.status = status;
        }

        if (search != "") {
            query.$text = { $search: search };
        }


        let arrSort = ['_id', 'name', 'userId', 'category', '_id', 'createdAt', 'status', '_id', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        Promise.all([
            // Event.countDocuments({ status: { $nin: ['DELETE', 'CANCEL'] } }),
            Event.aggregate([
                { $match: { isRequire: true } },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
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
                    $lookup:
                    {
                        from: "eventcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        userId: 1,
                        createdAt: 1,
                        status: 1,
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])

        ]).then(([Count, CountFilter, arr]) => {

            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count[0] && Count[0].passing_scores || 0,
                    "recordsFiltered": CountFilter[0] && CountFilter[0].passing_scores || 0,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    _id: value._id,
                    s1: +index + 1 + +PageNo,
                    s2: `<div class='nameEvent'>${value.name || 'Null'}</div>`,
                    s3: value.userId[0] && value.userId[0].fullName || "No_Name",
                    s4: value.category[0] && value.category[0].name || "Null",
                    s5: formatDate(value.createdAt),
                    s6: value.status || 'WAITING',
                    s7: `<a title='Xóa' href='javascript:void(0);' onclick='Change("${value._id}", "0")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    <a title='Public' class='btn btn-warning' href="javascript: void(0);" onclick='Change("${value._id}", "1")' > <i class="fa fa-check-circle"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        }).catch(err => {
            console.log(err);
        })
    },
    getApplyEvent: async (req, res) => {
        let idSession = req.query.idSession;
        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { 'eventId': ObjectId(idEvent) };
        if (search != "") {
            query.$text = { $search: search };
        }
        let conditionQuery = {
            $expr: {
                $and: [
                    { $eq: ["$_id", "$$user_Id"] }
                ],
            },
        };
        if (search != "") {
            conditionQuery.$text = { $search: search };
        }

        let arrSort = ['_id', 'users.fullName', 'users.email', 'users.gender', 'users.phone', 'createAt', 'qrcode', 'isConfirm', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        let conditionMain = { 'eventId': ObjectId(idEvent) };
        conditionMain.session = { $elemMatch: { isCancel: { $ne: true } } }
        if (idSession) {
            conditionMain.session.$elemMatch.id = idSession;// = { $elemMatch: { id: idSession, status: 'JOINED', isReject: false } }
        }
        Promise.all([
            ApplyEvent.countDocuments(conditionMain),
            ApplyEvent.aggregate([
                { $match: { 'eventId': ObjectId(idEvent), session: { $elemMatch: { isCancel: { $ne: true } } } } },
                {
                    $lookup:
                    {
                        from: "users",
                        let: { user_Id: "$userId" },
                        pipeline: [
                            {
                                $match: conditionQuery
                            },
                        ],
                        as: "users"
                    }
                },
                { $match: { 'users.fullName': { $exists: true } } },
                {
                    $count: "passing_scores"
                }
            ]),
            ApplyEvent.aggregate([
                { $match: conditionMain },
                {
                    $lookup:
                    {
                        from: "users",
                        let: { user_Id: "$userId" },
                        pipeline: [
                            {
                                $match: conditionQuery
                            },
                        ],
                        as: "users"
                    }
                },
                {
                    $project: {
                        users: 1, createdAt: 1, qrcode: 1,
                        session: {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: { $not: { $eq: ["$$item.isReject", true] } }
                            }
                        }
                    }
                },
                { $match: { 'users.fullName': { $exists: true }, session: { $elemMatch: { id: { $exists: true } } } } },
                { $sort: conditionSort },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])
        ]).then(([Count, CountFilter1, arr]) => {
            let CountFilter = CountFilter1[0] ? (CountFilter1[0].passing_scores || 0) : 0;
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.users[0].fullName || '',
                    s3: value.users[0].email || '',
                    s4: value.users[0].gender || '',
                    s5: value.users[0].phone || '0',
                    s6: `<div class="moveClick" onclick="ShowSessionApply('${value._id}')" > ${value.session.length || '0'} </div>`,
                    s7: formatDate(value.createdAt) || "123",
                    s8: value.qrcode || "",
                    s9: ('PENDING'),
                })
            });


            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },
    apply_event_cancel: async (req, res) => {
        let idSession = req.query.idSession;
        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { 'eventId': ObjectId(idEvent) };
        if (search != "") {
            query.$text = { $search: search };
        }
        let conditionQuery = {
            $expr: {
                $and: [
                    { $eq: ["$_id", "$$user_Id"] }
                ],
            },
        };
        if (search != "") {
            conditionQuery.$text = { $search: search };
        }

        let arrSort = ['_id', 'users.fullName', 'users.email', 'users.gender', 'users.phone', 'createAt', 'qrcode', 'isConfirm', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        let conditionMain = { 'eventId': ObjectId(idEvent) };
        conditionMain.session = { $elemMatch: { isRefund: false, isCancel: true, paymentId: { $exists: true } } }

        Promise.all([
            ApplyEvent.countDocuments(conditionMain),
            ApplyEvent.aggregate([
                { $match: conditionMain },
                {
                    $lookup:
                    {
                        from: "users",
                        let: { user_Id: "$userId" },
                        pipeline: [
                            {
                                $match: conditionQuery
                            },
                        ],
                        as: "users"
                    }
                },
                { $match: { 'users.fullName': { $exists: true } } },
                {
                    $count: "passing_scores"
                }
            ]),
            ApplyEvent.aggregate([
                { $match: conditionMain },
                {
                    $lookup:
                    {
                        from: "users",
                        let: { user_Id: "$userId" },
                        pipeline: [
                            {
                                $match: conditionQuery
                            },
                        ],
                        as: "users"
                    }
                },
                {
                    $project: {
                        users: 1, createdAt: 1, qrcode: 1,
                        session: {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: {
                                    $and: [
                                        { $eq: ["$$item.isCancel", true] },
                                        { $eq: ["$$item.isRefund", false] },
                                        { $eq: [{ $type: "$$item.paymentId" }, 'objectId'] }
                                    ]
                                } // { $not: { $eq: ["$$item.isReject", true] } }
                            }
                        }
                    }
                },
                { $match: { 'users.fullName': { $exists: true }, 'session': { $elemMatch: { id: { $exists: true } } } } },
                { $sort: conditionSort },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])
        ]).then(([Count, CountFilter1, arr]) => {
            let CountFilter = CountFilter1[0] ? (CountFilter1[0].passing_scores || 0) : 0;
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    _id: value._id,
                    s1: +index + 1 + +PageNo,
                    s2: value.users[0].fullName || '',
                    s3: value.users[0].email || '',
                    s4: value.users[0].gender || '',
                    s5: value.users[0].phone || '0',
                    s6: `<div class="moveClick" onclick="ShowSessionApply('${value._id}')" > ${value.session.length || '0'} </div>`,
                    s7: formatDate(value.createdAt),
                    s8: value.qrcode,
                    s9: ('WAITING'),
                    s10: `<a title='Refund' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-check"></i></a>`, // can them cac button vao.
                })
            });

            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },
    users: async (req, res) => {

        let search = req.query.myCustomParams;
        let isReport = req.query.isReport;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { isReported: false };//{ dateDelete: { $exists: false } };
        if (search != "") {
            query.$text = { $search: search };
        }
        if (+isReport) {
            query.userReport = { $exists: true, $not: { $size: 0 } };
        }

        let arrSort = ['_id', 'fullName', 'avatar', 'email', 'gender', 'birthday', 'job', 'phone', 'dateCreate', '_id', '_id'];
        let conditionSort = {};
        conditionSort[arrSort[+order]] = (orderDir == 'desc' ? (-1) : (1));

        Promise.all([
            User.countDocuments({ isReported: false }),//({ dateDelete: { $exists: false } }),
            User.countDocuments(query),
            User.find(query).skip(+PageNo).limit(+pageSize).sort(conditionSort)
        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                let name = ``;
                if (value.userReport && value.userReport.length) {
                    name += `<div class='userReport' onclick="showPopupReport('${value._id}')"> ${value.fullName || ''} (${value.userReport && value.userReport.length || '0'}) </div>`
                } else {
                    name += `<div class='' > ${value.fullName || ''} </div>`
                }
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: name,
                    s3: `<img class='myImage' src='${value.avatar}' />`,
                    s4: value.email || '',
                    s5: value.gender || '',
                    s6: value.birthday ? formatDate(value.birthday) : '',
                    s7: value.phone || '',
                    s8: formatDate(value.dateCreate) || 'NaN',
                    s9: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                        <a title='Sửa' href='javascript:void(0);' onclick='Update("${value._id}")' class='btn btn-warning'><i class="fas fa-pen-alt"></i></a>        
                        `, // can them cac button vao.
                })
            });
            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    Account: async (req, res) => {
        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { dateDelete: { $exists: false } };
        if (search != "") {
            query.$text = { $search: search };
        }
        let arrSort = ['_id', 'name', 'username', 'branch', 'department', 'createAt', '_id', '_id', '_id', '_id', '_id'];
        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? '-1' : '1');

        let conditionQueryBranch = {
            $expr: {
                $and: [
                    { $eq: ["$_id", "$$branch_id"] },
                ],
            },
        };

        if (search != "") {
            conditionQueryBranch.$text = { $search: search };
        }


        Promise.all([
            Account.countDocuments({ dateDelete: { $exists: false } }),
            Account.countDocuments(query),
            Account.aggregate([
                {
                    $match: query
                },
                {
                    $lookup:
                    {
                        from: "branches",
                        localField: "branch",
                        foreignField: "_id",
                        as: "branches"
                    }
                },
                {
                    $lookup:
                    {
                        from: "departments",
                        localField: "department",
                        foreignField: "_id",
                        as: "departments"
                    }
                },
                { $project: { _v: 0, branch: 0, department: 0, 'branches._v': 0, 'branches._id': 0, 'departments._id': 0, 'departments._v': 0 } },
                { $skip: +PageNo },
                { $limit: +pageSize },
                // { $sort: conditionSort }
            ]),

        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.name || '',
                    s3: value.username || '',
                    s4: value.branches[0] ? value.branches[0].name : '' || '',
                    s5: value.departments[0] ? value.departments[0].name : '' || '',
                    s6: formatDate(value.createAt) || 'NaN',
                    s7: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>`, // can them cac button vao.
                })
            });
            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    eventCategory: async (req, res) => {

        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { isDelete: false };
        if (search != "") {
            query.$text = { $search: search };
        }
        let arrSort = ['_id', 'name', 'createAt', '_id', '_id', '_id', '_id', '_id', 'dateCreate'];
        let conditionSort = {};
        conditionSort[arrSort[+order]] = (orderDir == 'desc' ? '-1' : '1');

        Promise.all([
            EventCategory.countDocuments({ isDelete: false }),
            EventCategory.countDocuments(query),
            EventCategory.find(query).skip(+PageNo).limit(+pageSize).sort(conditionSort)
        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                let n = Base64.encode(value.name);
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.name || '',
                    s3: formatDate(value.createAt),
                    s4: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                        <a title='Sửa' href='javascript:void(0);' onclick='Update("${value._id}", "${n}")' class='btn btn-warning'><i class="fas fa-pen-alt"></i></a>
                        `
                })
            });

            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    Branch: async (req, res) => {

        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { isDelete: false };
        if (search != "") {
            query.$text = { $search: search };
        }
        let arrSort = ['_id', 'name', 'createAt', '_id', '_id', '_id', '_id', '_id', 'dateCreate'];
        let conditionSort = {};
        conditionSort[arrSort[+order]] = (orderDir == 'desc' ? '-1' : '1');

        Promise.all([
            Branch.countDocuments({ isDelete: false }),
            Branch.countDocuments(query),
            Branch.find(query).skip(+PageNo).limit(+pageSize).sort(conditionSort)
        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                let n = Base64.encode(value.name);
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.name || '',
                    s3: formatDate(value.createAt),
                    s4: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                        <a title='Sửa' href='javascript:void(0);' onclick='Update("${value._id}", "${n}")' class='btn btn-warning'><i class="fas fa-pen-alt"></i></a>
                        `
                })
            });

            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    Department: async (req, res) => {

        let search = req.query.myCustomParams;
        let idEvent = req.query.idEvent;
        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { isDelete: false };
        if (search != "") {
            query.$text = { $search: search };
        }
        let arrSort = ['_id', 'name', 'createAt', '_id', '_id', '_id', '_id', '_id', 'dateCreate'];
        let conditionSort = {};
        conditionSort[arrSort[+order]] = (orderDir == 'desc' ? '-1' : '1');

        Promise.all([
            Department.countDocuments({ isDelete: false }),
            Department.countDocuments(query),
            Department.find(query).skip(+PageNo).limit(+pageSize).sort(conditionSort)
        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count,
                    "recordsFiltered": CountFilter,
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                let n = Base64.encode(value.name);
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.name || '',
                    s3: formatDate(value.createAt),
                    s4: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                        <a title='Sửa' href='javascript:void(0);' onclick='Update("${value._id}", "${n}")' class='btn btn-warning'><i class="fas fa-pen-alt"></i></a>
                        `
                })
            });

            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    getEventCancel: async (req, res) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = {
            $and: [
                { isSellTicket: true },
                { ticket: { $exists: true } }, //isRefund: { $ne: true }
                { 'ticket.price': { $ne: 0 } },
                { 'session': { $elemMatch: { isCancel: true } } },
                {
                    $expr: {
                        $ne: ['$session.refundNumber', '$session.joinNumber']

                    }
                }
            ]
        };

        Promise.all(
            [
                Event.aggregate([
                    { $match: query },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $lookup:
                        {
                            from: "eventcategories",
                            localField: "category",
                            foreignField: "_id",
                            as: "cate"
                        }
                    },
                    {
                        $unwind: "$cate"
                    },
                    {
                        $project: {
                            name: 1, cate: 1, user: 1, createdAt: 1, status: 1,
                            'session': {
                                $filter: {
                                    input: "$session",
                                    as: "item",
                                    cond: { $eq: ["$$item.isCancel", true] }
                                }
                            }
                        },
                    },
                    { $skip: +PageNo },
                    { $limit: +pageSize },
                ]),
                Event.countDocuments(query),
                Event.countDocuments(query),
            ]
        ).then(([arr, Count1, Count2]) => {
            let result = {
                "d": {
                    "draw": draw || 1,
                    "recordsTotal": Count1,
                    "recordsFiltered": Count2,
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.name || 'Null',
                    s3: value.user.fullName || "No_Name",
                    s4: value.cate.name || "Null",
                    s5: `<div class="moveClick" onclick='ShowSession("${value._id}")'> <i class="fas fa-angle-double-up"></i> ${value.session.length || '0'}</div>`,
                    s6: formatDate(value.createdAt),
                    s7: value.status || 'PENDING',
                    s8: `<a title='Danh sách đăng kí' class='btn bg-primary' href="/event/apply_event_cancel/${value._id}" > <i class="fas fa-align-justify"></i> </a>`


                    // `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    // <a title='Danh sách đăng kí' class='btn bg-primary' href="/event/applyEvent/${value._id}" > <i class="fas fa-align-justify"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        })
    },

    thu: async (req, res, next) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { status: 'PAID', sender: { $ne: ObjectId(key.adminId) } };
        query.sender = { $ne: ObjectId(key.adminId) }
        Promise.all(
            [
                Payment.aggregate([
                    { $match: query },
                    {
                        $group: {
                            _id: null,
                            sumTotal: { $sum: '$amount' }
                        }
                    }
                ]),
                Payment.aggregate([
                    { $match: query },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            as: "senders"
                        }
                    },
                    { $unwind: "$senders" },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "receiver",
                            foreignField: "_id",
                            as: "receivers"
                        }
                    },
                    { $unwind: "$receivers" },
                    {
                        $lookup:
                        {
                            from: "events",
                            localField: "eventId",
                            foreignField: "_id",
                            as: "event"
                        }
                    },
                    { $unwind: "$event" },
                    { $skip: +PageNo },
                    { $limit: +pageSize },
                ]),
                Payment.countDocuments(query),
                Payment.countDocuments(query),
            ]
        ).then(([total, arr, Count1, Count2]) => {
            let result = {
                "d": {
                    "draw": draw || 1,
                    "recordsTotal": Count1,
                    "recordsFiltered": Count2,
                    sumTotal: total[0] && total[0].sumTotal || '0'
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.senders.fullName || 'Null',
                    s3: value.receivers.fullName || "No_Name",
                    s4: new Date(value.createdAt).toLocaleString() || "Null",
                    s5: value.payType,
                    s6: formatCurrency(value.amount) ,
                    s7: value.event.name,
                    s8: value.status,


                    // `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    // <a title='Danh sách đăng kí' class='btn bg-primary' href="/event/applyEvent/${value._id}" > <i class="fas fa-align-justify"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        })
    },

    refund: async (req, res, next) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { status: 'PAID', sender: { $ne: ObjectId(key.adminId) } };
        query.sender = { $ne: ObjectId(key.adminId) }
        Promise.all(
            [
                Payment.aggregate([
                    {
                        $project: {
                            amount: 1,
                            status: 1,
                            num: { $size: '$session' },
                            num1: { $size: '$sessionRefunded' }
                        }
                    },
                    {
                        $match: {
                            num1: { $ne: 0 },
                            status: 'PAID',
                            sender: { $ne: ObjectId(key.adminId) }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            sumTotal: { $sum: { $multiply: ['$amount', { $divide: ['$num1', '$num'] }] } },
                            totalRow: { $sum: 1 }
                        }
                    }
                ]),
                Payment.aggregate([
                    { $match: query },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            as: "senders"
                        }
                    },
                    { $unwind: "$senders" },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "receiver",
                            foreignField: "_id",
                            as: "receivers"
                        }
                    },
                    { $unwind: "$receivers" },
                    {
                        $lookup:
                        {
                            from: "events",
                            localField: "eventId",
                            foreignField: "_id",
                            as: "event"
                        }
                    },
                    { $unwind: "$event" },
                    {
                        $project: {
                            status: 1,
                            senders: 1, receivers: 1,
                            createdAt: 1,
                            amount: 1,
                            description: 1, event: 1,
                            payType: 1,
                            num: { $size: '$session' },
                            num1: { $size: '$sessionRefunded' }
                        }
                    },
                    {
                        $match: {
                            num1: { $ne: 0 }

                            // $expr : {
                            // //     $and: [
                            //       $eq : ['$num1', '$num']
                            //     //   ]  
                            //   }
                        }
                    },
                    { $skip: +PageNo },
                    { $limit: +pageSize },
                ]),
                Payment.countDocuments(query),
            ]
        ).then(([total, arr, Count2]) => {
            let result = {
                "d": {
                    "draw": draw || 1,
                    "recordsTotal": total[0] && total[0].totalRow || '0',
                    "recordsFiltered": total[0] && total[0].totalRow || '0', // filter
                    sumTotal: total[0] && total[0].sumTotal || '0'
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.senders.fullName || 'Null',
                    s3: value.receivers.fullName || "No_Name",
                    s4: new Date(value.createdAt).toLocaleString() || "Null",
                    s5: value.payType || '',
                    s6: formatCurrency((((+value.amount || '0') / +value.num) * (+value.num1))),
                    s7: value.event.name || '',
                    s8: value.description || '',


                    // `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    // <a title='Danh sách đăng kí' class='btn bg-primary' href="/event/applyEvent/${value._id}" > <i class="fas fa-align-justify"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        })
    },

    chi: async (req, res, next) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;

        let query = { status: 'PAID', sender: ObjectId(key.adminId) };
        query.sender = { $ne: ObjectId(key.adminId) }
        Promise.all(
            [
                Payment.aggregate([
                    { $match: query },
                    {
                        $group: {
                            _id: null,
                            sumTotal: { $sum: '$amount' },
                            totalRow: { $sum: 1 }
                        }
                    }
                ]),
                Payment.aggregate([
                    { $match: query },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "sender",
                            foreignField: "_id",
                            as: "senders"
                        }
                    },
                    { $unwind: "$senders" },
                    {
                        $lookup:
                        {
                            from: "users",
                            localField: "receiver",
                            foreignField: "_id",
                            as: "receivers"
                        }
                    },
                    { $unwind: "$receivers" },
                    {
                        $lookup:
                        {
                            from: "events",
                            localField: "eventId",
                            foreignField: "_id",
                            as: "event"
                        }
                    },
                    { $unwind: "$event" },
                    {
                        $project: {
                            status: 1,
                            senders: 1, receivers: 1,
                            createdAt: 1,
                            amount: 1,
                            description: 1, event: 1,
                            payType: 1,
                            num: { $size: '$session' },
                            num1: { $size: '$sessionRefunded' }
                        }
                    },
                    { $skip: +PageNo },
                    { $limit: +pageSize },
                ]),
                Payment.countDocuments(query),
            ]
        ).then(([total, arr, Count2]) => {
            let result = {
                "d": {
                    "draw": draw || 1,
                    "recordsTotal": total[0] && total[0].totalRow || '0',
                    "recordsFiltered": total[0] && total[0].totalRow || '0', // filter
                    sumTotal: total[0] && total[0].sumTotal || '0'
                }
            }
            let arrDT = [];

            arr.forEach((value, index) => {
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.senders.fullName || 'Null',
                    s3: value.receivers.fullName || "No_Name",
                    s4: new Date(value.createdAt).toLocaleString() || "Null",
                    s5: value.payType || '',
                    s6: formatCurrency((((+value.amount || '0') / +value.num) * (+value.num1)) + ''),
                    s7: value.event.name || '',
                    s8: value.description || '',
                    // `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn btn-danger'><i class="fa fa-trash-o"></i></a>
                    // <a title='Danh sách đăng kí' class='btn bg-primary' href="/event/applyEvent/${value._id}" > <i class="fas fa-align-justify"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        })
    },

    thanh_toan: async (req, res) => {
        let search = req.query.myCustomParams;
        let { status, startDate, endDate, fee } = req.query.multiSearch;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        // have to update condition.
        let query = { 'status': 'PUBLIC', paymentId: { $exists: false }, isSellTicket: true};

        if (search != "") {
            query.$text = { $search: search };
        }
        let arrSort = ['_id', 'name', 'userId', 'category', '_id', 'createdAt', 'status', '_id', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));
        Promise.all([
            Event.aggregate([
                { $match: query },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
                {
                    $count: "passing_scores"
                }
            ]),
            Event.aggregate([
                { $match: query },
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
                    $lookup:
                    {
                        from: "eventcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "applyevents",
                        let: { event_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $or: [
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentStatus: 'PAID' } } },
                                        { 'session': { $elemMatch: { isCancel: { $ne: true }, isReject: false, paymentId: { $exists: false } } } }
                                    ],
                                    $expr: {
                                        $and: [{ $eq: ['$eventId', '$$event_id'] }]
                                    }
                                }
                            },
                        ],
                        as: "join"
                    }
                },
                {
                    $lookup:
                    {
                        from: "payments",
                        let: { event_id: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    'status': 'PAID',
                                    $expr: {
                                        $and: [{ $eq: ['$eventId', '$$event_id'] },
                                        { $not: { $eq: [{ $size: '$session' }, { $size: '$sessionRefunded' }] } }]
                                    }
                                }
                            },
                        ],
                        as: "payments"
                    }
                },
                {
                    $project: {
                        name: 1,
                        category: 1,
                        payments:1,
                        userId: 1,
                        totalAmount: { $sum: '$payments.amount' },
                        createdAt: 1,
                        status: 1,
                        'session': {
                            $filter: {
                                input: "$session",
                                as: "item",
                                cond: { $not: { $eq: ["$$item.isCancel", true] } }
                            }
                        },
                        sessionTemp: {
                            $filter: {
                                input: "$session",
                                as: "item1",
                                cond: { $and: [{ $gte: ["$$item1.day", new Date()] }, { $ne: ["$$item1.isCancel", true] }] }
                            }
                        },
                        numberJoin: { $cond: { if: { $isArray: "$join" }, then: { $size: "$join" }, else: "0" } }
                    }
                },
                {
                    $match: {
                        sessionTemp: { $size: 0 },
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: +PageNo },
                { $limit: +pageSize },
            ])
        ]).then(([Count, CountFilter, arr]) => {
            let result = {
                "d": {
                    "draw": draw,
                    "recordsTotal": Count[0] && Count[0].passing_scores || 0,
                    "recordsFiltered": CountFilter[0] && CountFilter[0].passing_scores || 0,
                }
            }
            let arrDT = [];
            arr.forEach((value, index) => {
                arrDT.push({
                    _id: value.id,
                    s1: +index + 1 + +PageNo,
                    s2: `<div class='nameEvent'>${value.name || 'Null'}</div>`,
                    s3: value.userId[0] && value.userId[0].fullName || "No_Name",
                    s4: value.category[0] && value.category[0].name || "Null",
                    s5: `<div class="" > ${value.numberJoin || '0'}</div>`,
                    s6: `<div class="moveClick" onclick='ShowSession("${value._id}")'> ${formatCurrency(value.totalAmount)}</div>`,
                    s7: formatCurrency((+value.totalAmount*90/100)),
                    s8: value.status || 'WAITING',
                    s9: `<a title='Public' class='btn btn-warning' href="javascript: void(0);" onclick='ThanhToan("${value._id}", "${(+value.totalAmount*90/100)}")' > <i class="fa fa-check-circle"></i> </a>`,
                })
            });
            result.d.data = arrDT;
            res.send(result);
        }).catch(err => {
            console.log(err);
        })
    },


}