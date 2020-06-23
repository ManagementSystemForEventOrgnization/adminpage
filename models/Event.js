const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
<<<<<<< HEAD
    name: { type: String, "index": "text" },
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
    typeOfEvent: String,
    urlWeb: String,
    isSellTicket: Boolean,
=======
    name: { type:String, "index": "text" },
    joinNumber: Number,
    userId: Schema.Types.ObjectId,
    isPayment: Boolean,
    page: [Schema.Types.ObjectId],
    map: {
        long: String,
        lat: String
    },
    address : { type:String, "index": "text" },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    ticket: {
        price: Number,
        discount: Number
    },
<<<<<<< HEAD
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
            paymentId: String,
            isCancel: Boolean,
        }
    ],//{type : Array}, // limitNumber, joinNumber, endTime, startTime, detail, imageMap, address, link file, status 
    category: { type : Schema.Types.ObjectId , ref: 'eventCategory'},
    status: { type: String, "index": "text", default: "PENDING" }, //  DRAFT, PENDING, PUBLIC, EDITED, CANCEL
    bannerUrl: String,
    createdAt: { type: Date, default: Date.now },
    isPreview: { type: Boolean },
    updatedAt: Date
})

mongoose.model('event', eventSchema);
=======
    category: String,
    endTime: Date,
    limitNumber: Number,
    startTime: { type: Date, default: Date() },
    status: { type:String, "index": "text" },
    urlWeb: String,
    createAt: { type: Date, default: Date() },
    updateAt: Date
})

mongoose.model('event', eventSchema);
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
