const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema({
    name: String,
    createAt: { type: Date, default: Date() },
    updateAt: Date,
    isDelete: {type: Boolean, default: false}
})

mongoose.model('departments', departmentSchema);