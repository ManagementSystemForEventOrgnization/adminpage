const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type:String, "index": "text" },
    hashPass: String,
    dateCreate: {type: Date , default: Date.now },
    fullName: { type:String, "index": "text" },
    TOKEN: String,
<<<<<<< HEAD
    google_id: String,
=======
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    birthday: Date,
    gender: { type:String, "index": "text" },
    typeUser: String,
    job: String,
    phone: String,
    avatar: { type: String, default: '/avata.png'},
<<<<<<< HEAD
    userReport: [
        {
            userId: { type :mongoose.Types.ObjectId, ref: 'users'},
            eventId : { type :mongoose.Types.ObjectId, ref: 'event'},
            cause: String,
            createdAt: { type: Date, default: Date.now },
        }
    ],
    isReported: {type: Boolean, default: false},
    dateDelete: Date,
    discription: { type:String, "index": "text" },
    address: String,
    orgName : String,
    orgDes : String,
    orgWeb: String,
    orgPhone: String,
    orgEmail: String,
    orgUrl: String,
    bank: {
        bankNumber: String,
        bankName: String,
        bankBranch: String,
        accountOwner: String
    },
    isActive:{type:Boolean,default: false},
    createAt: { type: Date, default: new Date() },
=======
    isReported: {type: Boolean, default: false},
    dateDelete: Date,
    discription: { type:String, "index": "text" },
    phoneNumber: String,
    isActive:{type:Boolean,default: false},
    createAt: { type: Date, default: Date() },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    updateAt: Date
})

mongoose.model('users', userSchema);