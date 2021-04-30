const Event = require("../models/event")


const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {

        const events = await Event.find().PopulateAll().select("-__v");
        res.status(200).json(events)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.getById = async function (req, res) {

    try {
        const event = await Event.findById(req.params.id).PopulateAll().select("-__v");
        res.status(200).json(event)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.create = async function (req, res) {

    try {
        console.log(req.body)
        const event = await new Event(req.body).save();

        res.status(200).json(event)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        const event = await Event.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true})
        res.status(200).json(event)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.delete = async function (req, res) {

    try {
        await Event.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await Event.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Event' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
