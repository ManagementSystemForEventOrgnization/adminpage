const mongoose = require('mongoose');
const { Schema } = mongoose;

const bankAccountSchema = new Schema({
<<<<<<< HEAD
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
=======
    userId: Schema.Types.ObjectId,
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    bankName: String,
    bankCode: String,
    branchName: String,
    branchCode: String,
    accountNumber: String,
    accountName: String,
<<<<<<< HEAD
    createAt: { type: Date, default: new Date() },
=======
    createAt: { type: Date, default: Date() },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    updateAt: Date
})

mongoose.model('bankAccount', bankAccountSchema);