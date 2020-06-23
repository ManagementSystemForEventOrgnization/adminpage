const mongoose = require('mongoose');
const { Schema } = mongoose;

const branchSchema = new Schema({
    name: String,
    createAt: { type: Date, default: Date() },
    updateAt: Date,
    isDelete: {type: Boolean, default: false}
})

mongoose.model('branches', branchSchema);