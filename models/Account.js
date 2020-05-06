const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    name: { type:String, "index": "text" },
    username: { type:String, "index": "text" },
    hashPass: String,
    branch: Schema.Types.ObjectId,
    department: Schema.Types.ObjectId,
    createAt: { type: Date, default: Date() },
    updateAt: Date,
    dateDelete: Date,
})

mongoose.model('accounts', accountSchema);