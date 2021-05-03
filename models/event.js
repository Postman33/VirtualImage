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
    eventData: Schema.Types.Mixed
});
EventSchema.query.PopulateAll = function(name) {
    return this.populate({path:"animals",select:"-__v"});
};
module.exports = mongoose.model("event", EventSchema)
