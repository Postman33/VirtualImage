const Otara = require("../models/otara")

const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {
        const otars = await Otara.find();
        res.status(200).json(otars)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.getById = async function (req, res) {

    try {
        const otara = await Otara.findById(req.params.id);
        res.status(200).json(otara)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.create = async function (req, res) {

    try {
        const otara = await new Otara(req.body).save();

        res.status(200).json(otara)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        const otara = await Otara.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true})
        res.status(200).json(otara)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.delete = async function (req, res) {

    try {
        await Otara.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await Otara.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Otara' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
