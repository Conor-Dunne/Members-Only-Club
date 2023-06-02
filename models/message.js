const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100 },
    text: {type: String, required: true, maxLength: 500 },
    timestamp: {type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: "User"}
})