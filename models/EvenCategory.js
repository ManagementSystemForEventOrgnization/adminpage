const mongoose = require('mongoose');
const { Schema } = mongoose;

const evenCategorySchema = new Schema({
<<<<<<< HEAD
    name: String,
    isDelete: { type: Boolean, default: false },
    updateAt: Date,
    createAt: {type: Date, default: new Date()}
=======
    name: { type: String, "index": "text" },
    isDelete: { type: Boolean, default: false },
    updateAt: Date,
    createAt: {type: Date, default: Date.now}
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
})

mongoose.model('eventCategory', evenCategorySchema);