const mongoose = require('mongoose');
const { Schema } = mongoose;

const applyEventSchema = new Schema({
<<<<<<< HEAD
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
    eventId: { type : Schema.Types.ObjectId, ref: 'event' },
    session: [
        {
            id: String,
            day: Date,
            address: { type: Object },
            limitNumber: Number,
            joinNumber: { type: Number, default: 0 },
            name: String,
            documents: { type: Array },
            detail: { type: Array },
            status: String,
            isConfirm: Boolean,
            isReject: Boolean,
            paymentId: mongoose.Types.ObjectId,
            isCancel: Boolean,
        }
    ],
    qrcode: { type:String, "index": "text" },
    createdAt: { type: Date, default: new Date() },
    updatedAt: Date
})

mongoose.model('applyEvent', applyEventSchema);


//status session: "", CANCEL, REJECT, MEMBERCANCEL, JOINED  
// paymentId: Schema.Types.ObjectId,
// isConfirm: Boolean, // check when take part in event
// isReject: Boolean,
=======
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    isConfirm: Boolean,
    qrcode: { type:String, "index": "text" },
    createAt: { type: Date, default: Date() },
    updateAt: Date
})

mongoose.model('applyEvent', applyEventSchema);
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
