const Sheep = require("../models/sheep")


const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {
        console.log(req.query)
        let query = {...req.query}

        let queryJSON = JSON.stringify(query);

        queryJSON = queryJSON.replace(/(gte|gt|lt|lte|eq|ne|in|nin)/gi, match=>`$${match}`)
        query = JSON.parse(queryJSON);
        console.log(query)
        const sheeps = await Sheep.find(query).PopulateAll().select("-__v");
        res.status(200).json(sheeps)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}

module.exports.getById = async function (req, res) {

    try {
        const sheep = await Sheep.findById(req.params.id).PopulateAll().select("-__v");
        res.status(200).json(sheep)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.create = async function (req, res) {

    try {
        console.log(req.body)
        const chaban = await new Sheep(req.body).save();

        res.status(200).json(chaban)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        console.log(req.body)
        const sheep = await Sheep.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true})
        res.status(200).json(sheep)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.delete = async function (req, res) {

    try {
        await Sheep.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await Sheep.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Sheep' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
