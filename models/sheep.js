const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SheepSchema = new Schema({
    chipNo: { // Номер чипа
        type: String,
        required: true,
        unique: true
    },
    passport: {
        // Информация о рождении

        typeAnimal: { // Порода
            type: String,
            required: true
        },
        generation: { // Поколение
            type: String,
            required: true
        },
        horns: {
            type: String
        },
        birthday: { // День рождения
            type: Schema.Types.Date,
            required: true,
        },
        dateOfEntry: { // Дата поступления
            type: Schema.Types.Date,
            required: true,
        },

        // Информация о содержании
        farm: { // Принадлежность к ферме
            type: Schema.Types.ObjectId,
            ref: "farm",
        },
        chaban: { // Чабан
            type: Schema.Types.ObjectId,
            ref: "chaban",
        },
        otara: {
            type: Schema.Types.ObjectId,
            ref: "otara",
        },

        // Масть
        colorPrimary: { // Окраска шерстяного покрова
            type: String,
        },
        colorSecondary: { // Окраска кроющего волоса
            type: String,
        },
        colorSecondaryOpt: { // Доп. окраска кроющего волоса
            type: String,
        },

        // Выбытие
        dateOfDisposal: {
            type: Date
        },
        reasonOfDisposal: {
            type: String
        },
        isSelling: {
            type: Boolean
        },


        bloodGroup: {
            type: String,
        },
        bloodBreeds: {
            type: String,
        },
        bloodPercent: { // Процент кровности
            type: Number
        },
        typeOfCreating: {
            type: String,
        }
    },
    genealogy: {
        father: {
            type: Schema.Types.ObjectId,
            ref: "sheep"
        },
        mother: {
            type: Schema.Types.ObjectId,
            ref: "sheep"
        },
    }
});

SheepSchema.query.PopulateAll = function(name) {
    return this.populate({path:"passport.farm",select:"-__v"})
        .populate({path:"passport.chaban",select:"-__v"})
        .populate({path:"passport.otara",select:"-__v"})

        ;
};
module.exports = mongoose.model("sheep", SheepSchema)
