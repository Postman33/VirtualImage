const Position = require("../models/positions")
const ErrorHandler = require("../util/errorHandler")
module.exports.getByCatId = async function (req, res) {
    try {
        const position = await Position.find({
            category: req.params.CategoryId,
            user: req.user.id
        })
        res.status(200).json(position)
    } catch (e) {
        ErrorHandler(res, e)
    }

}
module.exports.create = async function (req, res) {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id,
        }).save()
        res.status(201).json(position)
    } catch (e) {
        ErrorHandler(res, e)
    }
}
module.exports.remove = async function (req, res) {
    try {
        await Position.remove({_id: req.params.id})
        res.status(200).json({message: "Позиция была удалена"})
    } catch (e) {
        ErrorHandler(res, e)
    }
}
module.exports.update = async function (req, res) {
    try {
        const position = await new Position.findOneAndUpdate({_id:req.params.id},{$set: req.body},
            {new:true})

        res.status(200).json(position)
    } catch (e) {
        ErrorHandler(res, e)
    }
}
