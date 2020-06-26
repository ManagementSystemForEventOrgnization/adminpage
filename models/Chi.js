const mongoose = require('mongoose');
const { Schema } = mongoose;

const chiSchema = new Schema({
    userChi: { type: mongoose.Types.ObjectId, ref: 'accounts' },
    userId: {type : mongoose.Types.ObjectId, ref: 'users'},
    name: { type: String, "index": "text" },
    code: { type: String, default: `MPC:${Date.now}` },
    type: { type: String, default: 'OTHER' },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    note: String,
    createAt: { type: Date, default: Date.now },
    updateAt: Date,
    dateDelete: Date,
})

mongoose.model('chis', chiSchema);