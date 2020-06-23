const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
<<<<<<< HEAD
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
    eventId: { type : Schema.Types.ObjectId , ref: 'event'},
    content: String,
    isDelete: Boolean,
    createAt: { type: Date, default: new Date() },
=======
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    content: String,
    isDelete: Boolean,
    createAt: { type: Date, default: Date() },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    updateAt: Date
})

mongoose.model('comment', commentSchema);