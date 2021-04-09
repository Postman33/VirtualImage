const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SheepSchema = new Schema({
    _id: mongoose.Schema.Types._ObjectId,

});

module.exports = mongoose.model("sheep", SheepSchema)
