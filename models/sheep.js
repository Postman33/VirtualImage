const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SheepSchema = new Schema({
    passport: {
        // Информация о рождении
        chipNo: { // Номер чипа
            type: String,
            required: true
        },
        breed: { // Порода
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
        dateOfEntry : { // Дата поступления
            type: Schema.Types.Date,
            required: true,
        },

        // Информация о содержании
        farm: { // Принадлежность к ферме
            type: Schema.Types.ObjectId,
            ref: "farm",
            required: true
        },
        chaban: { // Чабан
            type: Schema.Types.ObjectId,
            ref: "chaban",
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
        dateOfDisposal:{
            type: Date
        },
        reasonOfDisposal:{
            type: String
        }
    }
});

module.exports = mongoose.model("sheep", SheepSchema)
