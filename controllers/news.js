const News = require("../models/news")

const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {
    try {
        const news = await News.find();
        res.status(200).json(news)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}

module.exports.getByKeywords = async function (req, res) {
    try {
        const news = await News.find({
            keywords: req.body.keywords
        });
        res.status(200).json(news)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}

module.exports.getByDate = async function (req, res) {

    try {

        let startDate = new Date(Date.parse(req.body.start));
        let endDate = new Date(Date.parse(req.body.end));

        const andFilter = {
            $and: [
                {"date": {$lte: endDate}},
                {"date": {$gte: startDate}}
            ]
        }

        const news = await News.find(andFilter);
        res.status(200).json(news)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}



module.exports.getById = async function (req, res) {
    try {
        const news = await News.findById(req.params.id);
        res.status(200).json(news)
    } catch (Err) {
        ErrorHandler(res, Err)
    }
}
module.exports.create = async function (req, res) {

    try {
        const news = await new News(req.body).save();

        res.status(200).json(news)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {
        const farm = await News.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
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
        await News.remove({_id: req.params.id})
        res.status(200).json({message: `Объект ${req.params.id} был удален`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.clearAll = async function (req, res) {

    try {
        await News.remove()
        res.status(200).json({message: `Все объекты из коллекции 'Farm' были удалены`})
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
