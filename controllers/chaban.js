const Chaban = require("../models/chaban")

const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {
        const chabans = await Chaban.find().populate({path:"farm",select:"-__v"}).select("-__v");
        res.status(200).json(chabans)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}

module.exports.getById = async function (req, res) {

    try {
        const chaban = await Chaban.findById(req.params.id).populate({path:"farm",select:"-__v"}).select("-__v");
        res.status(200).json(chaban)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.create = async function (req, res) {

    try {
        const chaban = await new Chaban(req.body).save();

        res.status(200).json(chaban)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        const chaban = await Chaban.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true})
        res.status(200).json(chaban)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.delete = async function (req, res) {

    try {
        await Chaban.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await Chaban.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Chaban' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
