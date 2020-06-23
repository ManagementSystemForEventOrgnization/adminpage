const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
<<<<<<< HEAD
    sender: { type : Schema.Types.ObjectId , ref: 'users'},
    receiver: { type : Schema.Types.ObjectId , ref: 'users'},
    amount: Number, 
    status: String, //UNPAID, FAILED, WAITING, PAID
    description: String,
    eventId: { type : Schema.Types.ObjectId , ref: 'event'},
    cardId: String,
    chargeId: String,
    zptransId: String,
    payType: String,
    createdAt: { type: Date, default: new Date() },
    sessionRefunded: [String],
    updatedAt: Date,
    session: [String],
=======
    sender: Schema.Types.ObjectId,
    receiver: Schema.Types.ObjectId,
    amount: Number, 
    status: String,
    discription: String,
    eventId: Schema.Types.ObjectId,
    cardId: Schema.Types.ObjectId,
    createAt: { type: Date, default: Date() },
    updateAt: Date
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
})

mongoose.model('payment', paymentSchema);