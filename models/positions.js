const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PositionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required:true
    },
    user: {
        ref: "users",
        type: Schema.Types.ObjectId
    },
    category: {
        ref: "categories",
        type: Schema.Types.ObjectId
    }
});
module.exports = mongoose.model("positions", PositionSchema)
