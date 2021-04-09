const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChabanSchema = new Schema({
    FIO: {
        type: String,
        required: true
    },
    birthday : {
        type: Date,
        required: true,
    },
    farm : {
        type: [Schema.Types.ObjectId],
        ref: "farm"
    }
});
module.exports = mongoose.model("chaban", ChabanSchema)
