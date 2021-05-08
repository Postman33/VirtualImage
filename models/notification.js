const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true,
    },
    header: {
        type: Schema.Types.String,
        required: true,
    },
    text: {
        type: Schema.Types.String,
        required: true
    }
});
module.exports = mongoose.model("notify", NotificationSchema)
