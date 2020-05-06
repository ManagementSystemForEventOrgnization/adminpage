const mongoose = require('mongoose');
const Event = mongoose.model('event');
const User = mongoose.model('users');
const ApplyEvent = mongoose.model('applyEvent');
const EventCategory = mongoose.model('eventCategory');
const Branch = mongoose.model('branches');
const Department = mongoose.model('departments');
const Account = mongoose.model('accounts')

const ObjectId = mongoose.Types.ObjectId;
const Base64 = require('../utils/Base64')

// new Branch({name: 'Hồ Chí Minh'}).save();
// new Department({name: 'Admin'}).save();
// new Account({name: 'Sang', username: 'admin', hashPass: 'admin'}).save();

let { formatDate } = require('../utils/mainFunction');

module.exports = {

    getEvent: async (req, res) => {
        let search = req.query.myCustomParams;
        let idCongViec = req.query.idCongViec;

        let draw = req.query.draw;
        let order = req.query.order[0].column;
        let orderDir = req.query.order[0].dir;
        let PageNo = req.query.start;
        let pageSize = req.query.length;
        let query = { 'status': { $nin: ["HUY"] } };
        if (search != "") {
            query.$text = { $search: search };
        }

        let arrSort = ['_id', 'name', 'users.fullName', 'limitNumber', 'joinNumber', 'startTime', 'status', '_id', '_id', '_id'];

        let conditionSort = {};
        conditionSort[`${arrSort[+order]}`] = (orderDir == 'desc' ? (-1) : (1));

        Promise.all([
            Event.countDocuments({ 'status': { $nin: ["HUY"] } }),
            Event.countDocuments(query),
            Event.aggregate([
                { $match: query },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "users"
                    }
                },
                { $skip: +PageNo },
                { $limit: +pageSize },
                { $sort: conditionSort }
            ])
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
                    s2: value.name,
                    s3: value.users[0].fullName,
                    s4: value.limitNumber,
                    s5: value.joinNumber || '0',
                    s6: formatDate(value.startTime),
                    s7: value.status,
                    s8: `<a title='Danh sách đăng kí' class='btn bg-primary' href="/event/applyEvent/${value._id}" > <i class="fas fa-align-justify"></i> </a>`, // can them cac button vao.
                })
            });
            result.d.data = arrDT;
            res.send(result);
        }).catch(err => {
            console.log(err);
        })
    },

    getApplyEvent: async (req, res) => {

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

        Promise.all([
            ApplyEvent.countDocuments({ 'eventId': ObjectId(idEvent) }),
            ApplyEvent.aggregate([
                { $match: { 'eventId': ObjectId(idEvent) } },
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
                { $group: { _id: null, myCount: { $sum: 1 } } },
                { $project: { _id: 0, myCount: 1 } }
            ]),
            ApplyEvent.aggregate([
                { $match: { 'eventId': ObjectId(idEvent) } },
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
                { $skip: +PageNo },
                { $limit: +pageSize },
                { $sort: conditionSort }
            ])
        ]).then(([Count, CountFilter1, arr]) => {
            let CountFilter = CountFilter1[0] ? (CountFilter1[0].myCount || 0) : 0;
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
                    s5: value.users[0].phone || '',
                    s6: formatDate(value.createAt),
                    s7: value.qrcode,
                    s8: (value.isConfirm ? 'Duyệt' : 'Từ chối'),
                    s9: ``, // can them cac button vao.
                })
            });


            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },

    users: async (req, res) => {

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

        let arrSort = ['_id', 'fullName', 'avatar', 'email', 'gender', 'birthday', 'job', 'phone', 'dateCreate', '_id', '_id'];
        let conditionSort = {};
        conditionSort[arrSort[+order]] = (orderDir == 'desc' ? (-1) : (1));


        Promise.all([
            User.countDocuments({ dateDelete: { $exists: false } }),
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
                arrDT.push({
                    s1: +index + 1 + +PageNo,
                    s2: value.fullName || '',
                    s3: `<img class='myImage' src='${value.avatar}' />`,
                    s4: value.email || '',
                    s5: value.gender || '',
                    s6: value.birthday || '',
                    s7: value.job || '',
                    s8: value.phone || '',
                    s9: formatDate(value.dateCreate) || 'NaN',
                    s10: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn bg-gradient-danger'><i class="fas fa-trash-alt"></i></a>`, // can them cac button vao.
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
                {$project: {_v: 0, branch: 0, department: 0, 'branches._v': 0, 'branches._id': 0, 'departments._id': 0, 'departments._v': 0}},
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
                    s4: value.branches[0]?value.branches[0].name :'' || '',
                    s5: value.departments[0]?value.departments[0].name :'' || '',
                    s6: formatDate(value.createAt) || 'NaN',
                    s7: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn bg-gradient-danger'><i class="fas fa-trash-alt"></i></a>`, // can them cac button vao.
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
                    s4: `<a title='Xóa' href='javascript:void(0);' onclick='Delete("${value._id}")' class='btn bg-gradient-danger'><i class="fas fa-trash-alt"></i></a>
                    <a title='Sửa' href='javascript:void(0);' onclick='Update("${value._id}", "${n}")' class='btn bg-gradient-info'><i class="fas fa-pen-alt"></i></a>
                    `
                })
            });

            result.d.data = arrDT;
            res.send(result);

        }).catch();
    },


}