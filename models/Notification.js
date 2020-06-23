const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
<<<<<<< HEAD
    sender: { type : Schema.Types.ObjectId , ref: 'users'},
    receiver: [{ type : Schema.Types.ObjectId , ref: 'users'},],
    type: String, // (event: (apply, start event), payment))
=======
    sender: Schema.Types.ObjectId,
    receiver: [Schema.Types.ObjectId],
    type: Number, // (Email, notify: (event: (apply, start event), payment))
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    message: String,
    title: String,
    linkTo: {
        key: String, // noti key link to screen
        _id: Schema.Types.ObjectId // id object link to
    },
    isRead: Boolean,
    isDelete: Boolean,
<<<<<<< HEAD
    createAt: { type: Date, default: new Date() },
    updateAt: Date,
    session: [String],
=======
    createAt: { type: Date, default: Date() },
    updateAt: Date
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
})

mongoose.model('notification', notificationSchema);