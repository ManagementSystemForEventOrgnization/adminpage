const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
<<<<<<< HEAD
    sender: String,// Schema.Types.ObjectId,
    receiver: String,// Schema.Types.ObjectId,
    content: String,
    isSeen: Boolean,
    isDelete: Boolean,
    createAt: { type: Date, default: new Date() },
=======
    sender: Schema.Types.ObjectId,
    receiver: Schema.Types.ObjectId,
    content: String,
    isSeen: Boolean,
    isDelete: Boolean,
    createAt: { type: Date, default: Date() },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    updateAt: Date
})

mongoose.model('chat', chatSchema);