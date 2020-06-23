const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    name: { type: String, "index": "text" },
    userId: { type : Schema.Types.ObjectId , ref: 'users'},
    typeOfEvent: String,
    urlWeb: String,
    isSellTicket: Boolean,
    ticket: {
        price: Number,
        discount: Number
    },
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
