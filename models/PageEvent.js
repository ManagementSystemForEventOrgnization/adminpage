const mongoose = require('mongoose');
const { Schema } = mongoose;

const pageEventSchema = new Schema({
    title: { type:String, "index": "text" },
    discription: { type:String, "index": "text" },
<<<<<<< HEAD
    eventId: { type : Schema.Types.ObjectId , ref: 'event'},
    // index: {
    //     row: Number,
    //     section: Number
    // },
    rows: {type: Array},
    header: {type: Array},
    createAt: { type: Date, default: new Date() },
=======
    eventId: Schema.Types.ObjectId,
    index: {
        row: Number,
        section: Number
    },
    rows: [{
        title: String,
        content: [String],
        linkFile: [String],
        image: [String],
        index: Number,
        contentColor: String,
        titleColor: String,
        titleFont: Number,
        contentFont: Number,
        titleIcon: String, // dấu chấm hay dấu sao trước text
        contentIcon: String,
        type: String, //banner, text, table, speaker
        level: Number,
        style: String //horizontal, vertical
    }],
    createAt: { type: Date, default: Date() },
>>>>>>> 09d62626d4bc42558e1b9e7d32e0b81a0c9a7dea
    updateAt: Date
})

mongoose.model('pageEvent', pageEventSchema);