const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NewsSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        required: false
    },
    time: {
        type: Schema.Types.Date,
        required: true,
        default: Date.now
    },
    keywords: {
        type: [Schema.Types.String],
        required: true,
    },
    author: { // Принадлежность к автору
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    supervisor:{ // Руководитель
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    reviewer: { // Рецензент
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    image: {
        type: [Schema.Types.String],
        required: false,
    }
    // TODO: рук, рецензент
});
module.exports = mongoose.model("news", NewsSchema)
