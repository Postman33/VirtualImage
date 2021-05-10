const Sheep = require("../models/sheep")
const mongoose = require("mongoose")
const Event = require("../models/event")
const ObjectId = mongoose.Types.ObjectId;
const ErrorHandler = require("../util/errorHandler")
// tableOrigin- стат. животного
// tableRelative - стат. по ферме животных
function compareIndicator(indicatorName, tableOrigin, tableRelative) {
    let mx = "max";
    let mn = "min";
    let ag = "avg";
    let avgOrigin = tableOrigin[ag + indicatorName];
    let avgRelative = tableRelative[ag + indicatorName];

    // let minOrigin = tableOrigin[mn + indicatorName];
    let minRelative = tableRelative[mn + indicatorName];

    //let maxOrigin = tableOrigin[mx + indicatorName];
    let maxRelative = tableRelative[mx + indicatorName];

    let DiffRelative = (maxRelative - minRelative) / 5;

    if (avgOrigin < (avgRelative + DiffRelative) && avgOrigin > (avgRelative - DiffRelative)) {
        return {
            name: 'Среднее',
            class: "average",
            valueOrigin: Math.floor(tableOrigin[ag + indicatorName]),
            valueRelative: Math.floor(tableRelative[ag + indicatorName]),
            progressBarEffect: Math.floor((avgOrigin / maxRelative) * 100)
        }
    } else {
        if (avgOrigin < (avgRelative - DiffRelative)) {
            return {
                name: 'Слабое',
                class: "low",
                valueOrigin: Math.floor(tableOrigin[ag + indicatorName]),
                valueRelative: Math.floor(tableRelative[ag + indicatorName]),
                progressBarEffect: Math.floor((avgOrigin / maxRelative) * 100)
            }
        }

        if (avgOrigin > (avgRelative + DiffRelative)) {
            return {

                name: 'Высокое',
                class: "high",
                valueOrigin: Math.floor(tableOrigin[ag + indicatorName]),
                valueRelative: Math.floor(tableRelative[ag + indicatorName]),
                progressBarEffect: Math.floor((avgOrigin / maxRelative) * 100)
            }
        }

    }

}


function compareSumIndicator(indicatorNameWithSuffix, tableOrigin, tableRelative) {

    let indOrigin = tableOrigin[indicatorNameWithSuffix];
    let indRelative = tableRelative[indicatorNameWithSuffix];

    let difference = Math.floor((indOrigin / indRelative) * 100)
    let effect = "Среднее"
    let clazz="average";
    if (difference < 3) {
        effect = "Почти не оказывает влияния"
        clazz="low"
    }
    if (difference < 20) {
        effect = "Слабое влияние"
        clazz="low"
    }
    if (difference >= 20 && difference <= 45) {
        effect = "Ниже среднего влияние"
        clazz="lowAverage"
    }
    if (difference > 45 && difference < 55) {
        effect = "Среднее влияние"
        clazz="average"
    }
    if (difference >= 55 && difference < 85) {
        effect = "Выше среднего влияние"
        clazz="highAverage"
    }
    if (difference >= 85) {
        effect = "Очень высокое влияние"
        clazz="high"
    }

    return {name: effect, valueOrigin: Math.floor(indOrigin), class:clazz,valueRelative: Math.round(indRelative), progressBarEffect: difference}
}


module.exports.getAll = async function (req, res) {

    try {

        let query = {...req.query}

        let queryJSON = JSON.stringify(query);

        queryJSON = queryJSON.replace(/(gte|gt|lt|lte|eq|ne|in|nin)/gi, match => `$${match}`)
        query = JSON.parse(queryJSON);

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

module.exports.getStats = async function (req, res) {

    try {

        let iAnimal = await Sheep.findById(req.params.id);

        const eventsAnimal = await Event.aggregate([
            {
                $unwind: "$animals"
            },
            {
                $match: {animals: ObjectId(req.params.id)}
            },
            {
                $group: {
                    _id: "$animals",
                    maxWeight: {$max: "$eventData.weight"},
                    avgWeight: {$min: "$eventData.weight"},
                    avgWoolWidth: {$avg: "$eventData.woolWidth"},
                    maxWoolWidth: {$max: "$eventData.woolWidth"},
                    minWoolWidth: {$min: "$eventData.woolWidth"},
                    sumDirtWeight: {$sum: "$eventData.weightDirt"},
                    sumCleanWeight: {$sum: "$eventData.weightClean"}

                }
            }
        ]);
        if (eventsAnimal.toString() == [].toString()) {
            res.status(200).json("000")
            return;
        }
        const eventsAnimalTotal = await Event.aggregate([
            {
                $unwind: "$animals"
            },
            {
                $lookup: {
                    from: "sheep", localField: "animals", foreignField: "_id",
                    as: "animalInfo"
                }
            },

            {
                $unwind: "$animalInfo"
            },
            {
                $project: {
                    animals: 0
                }
            },
            {
                $match: {"animalInfo.passport.farm": ObjectId(iAnimal.passport.farm)}
            },
            {
                $group: {
                    _id: null,
                    maxWeight: {$max: "$eventData.weight"},
                    minWeight: {$min: "$eventData.weight"},
                    avgWeight: {$min: "$eventData.weight"},
                    avgWoolWidth: {$avg: "$eventData.woolWidth"},
                    maxWoolWidth: {$max: "$eventData.woolWidth"},
                    minWoolWidth: {$min: "$eventData.woolWidth"},
                    sumDirtWeight: {$sum: "$eventData.weightDirt"},
                    sumCleanWeight: {$sum: "$eventData.weightClean"}

                }
            }
        ]);

        const farmTotal = eventsAnimalTotal[0];
        const animalStats = eventsAnimal[0];


        let dates = await Event.findOne({
            "eventData.weight": eventsAnimal[0]?.maxWeight?.toString() || "-1"
        });

        let complexResponse = {
            //  event: eventsAnimal[0],
            // maxDateWeight: dates
        }


        let indWoolWidth = compareIndicator("WoolWidth", animalStats, farmTotal)
        let indWeight = compareIndicator("WoolWidth", animalStats, farmTotal)
        let indSumWoolDirt = compareSumIndicator("sumDirtWeight", animalStats, farmTotal)
        let indSumWoolClean = compareSumIndicator("sumDirtWeight", animalStats, farmTotal)

        let response = {
        }
        response["Средняя живая масса, кг"] = indWeight
        response["Средняя тонина шерсти, мк"] = indWoolWidth
        response["Сумма немытой шерсти, кг"] = indSumWoolDirt
        response["Сумма мытой шерсти, кг"] = indSumWoolClean


        res.status(200).json(response)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.create = async function (req, res) {

    try {

        const chaban = await new Sheep(req.body).save();

        res.status(200).json(chaban)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}
module.exports.update = async function (req, res) {

    try {

        const sheep = await Sheep.findOneAndUpdate({_id: req.params.id}, {$set: req.body},
            {
                new: true,
                runValidators: true
            })
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
