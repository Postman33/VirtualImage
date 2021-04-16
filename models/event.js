const mongoose = require("mongoose")
const Schema = mongoose.Schema

const EventSchema = new Schema({
    eventDate: {
        type: Date,
        default: Date.now()
    },
    eventName : {
        type: String,
        required: true
    },
    animals: {
        type: [Schema.Types.ObjectId],
        ref: "sheep"
    },
    eventData: {
        type: Schema.Types.Mixed,
        required: true
    }
});

module.exports = mongoose.model("event", EventSchema)
