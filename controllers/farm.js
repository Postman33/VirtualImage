const Farm = require("../models/farm")

const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {
        const farms = await Farm.find();
        res.status(200).json(farms)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}

module.exports.getById = async function (req, res) {
    try {
        const farm = await Farm.findById(req.params.id);
        res.status(200).json(farm)
    } catch (Err) {
        ErrorHandler(res, Err)
    }
}
module.exports.create = async function (req, res) {

    try {
        const farm = await new Farm(req.body).save();

        res.status(200).json(farm)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        const farm = await Farm.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true})
        res.status(200).json(farm)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.delete = async function (req, res) {

    try {
        await Farm.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await Farm.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Farm' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
