const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema({
    name: String,
    createAt: { type: Date, default: Date() },
    updateAt: Date
})

mongoose.model('departments', departmentSchema);