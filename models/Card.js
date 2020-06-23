const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
<<<<<<< HEAD
    customerId: String,
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
    cardNumber: String,
    cardExpire: String,
    createAt: { type: Date, default: new Date() },
    updateAt: Date
})

mongoose.model('cards', cardSchema);
=======
    cardCustomerId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    cardNumber: String,
    cardExpire: String,
    createAt: { type: Date, default: Date() },
    updateAt: Date
})

mongoose.model('card', cardSchema);
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
