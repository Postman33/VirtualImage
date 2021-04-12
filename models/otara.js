const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OtaraSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("otara", OtaraSchema)
