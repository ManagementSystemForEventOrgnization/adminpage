const mongoose = require('mongoose');
const { Schema } = mongoose;

const evenCategorySchema = new Schema({
    name: { type: String, "index": "text" },
    isDelete: { type: Boolean, default: false },
    updateAt: Date,
    createAt: {type: Date, default: Date.now}
})

mongoose.model('eventCategory', evenCategorySchema);