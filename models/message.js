const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true, maxLength: 100 },
    text: {type: String, required: true, maxLength: 500 },
    timestamp: {type: Date, default: Date.now},
    postedBy: {type: Schema.Types.ObjectId, ref: "User", required: true}
})

MessageSchema.virtual("date_formatted").get(function(){
    return DateTime.fromJSDate(this.timestamp).toFormat('MMMM dd, yyyy');
})

module.exports = mongoose.model("Message", MessageSchema);