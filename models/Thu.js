const mongoose = require('mongoose');
const { Schema } = mongoose;

const thuSchema = new Schema({
    code: {type: String, default: `MPT:${Date.now}`},
    userThu: { type: mongoose.Types.ObjectId, ref: 'accounts' },
    type: { type: String, default: 'OTHER' },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    note : String,
    amountMoney: { type: Number, default: 0 },
    createAt: { type: Date, default: Date.now },
    updateAt: Date,
    dateDelete: Date,
})

mongoose.model('thus', thuSchema);