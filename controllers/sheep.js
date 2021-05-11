const Sheep = require("../models/sheep")
const mongoose = require("mongoose")
const Event = require("../models/event")
const ObjectId = mongoose.Types.ObjectId;
const ErrorHandler = require("../util/errorHandler")
// tableOrigin- стат. животного
// tableRelative - стат. по ферме животных
// Сравнение показателя с средним показателем фермы
function compareIndicator(indicatorName, tableOrigin, tableRelative, indicatorPrefix = '', indicatorComparePrefix = "avg") {
    let mx = "max";
    let mn = "min";
    let OriginIndicator = tableOrigin[indicatorPrefix + indicatorName];
    let RelativeIndicator = tableRelative[indicatorComparePrefix + indicatorName];

    let minRelative = tableRelative[mn + indicatorName];
    let maxRelative = tableRelative[mx + indicatorName];


    let DiffRelative = (maxRelative - minRelative) / 5;

    let clazz;
    let effect;
    let reverseInd = 1;

    if (OriginIndicator < (RelativeIndicator + DiffRelative) && OriginIndicator > (RelativeIndicator - DiffRelative)) {
        clazz = "average"
        effect = "Среднее"
    } else {
        if (OriginIndicator < (RelativeIndicator - DiffRelative)) {
            clazz = "low"
            effect = "Слабое"
        }
        if (OriginIndicator > (RelativeIndicator + DiffRelative)) {
            clazz = "high"
            effect = "Высокое";
        }
    }
    reverseInd = Math.floor(100 * (RelativeIndicator / OriginIndicator))
    if (reverseInd === Infinity || reverseInd == null) {
        reverseInd = RelativeIndicator;
    }

    return {
        name: effect,
        class: clazz,
        mode1: (indicatorPrefix === "avg" ? "avg" : "none"),
        mode2: indicatorComparePrefix,
        valueOrigin: Math.floor(OriginIndicator),
        valueRelative: Math.floor(RelativeIndicator),
        progressBarEffect: (OriginIndicator / RelativeIndicator * 100),
        reverseProgressBarEffect: reverseInd
    }


}


function compareSumIndicator(indicatorNameWithSuffix, tableOrigin, tableRelative) {

    let indOrigin = tableOrigin[indicatorNameWithSuffix];
    let indRelative = tableRelative[indicatorNameWithSuffix];

    let difference = Math.floor((indOrigin / indRelative) * 100)
    let effect = "Среднее"
    let clazz = "average";

    if (difference < 3) {
        effect = "Очень плохое"
        clazz = "low"
    }
    if (difference < 20) {
        effect = "Плохое"
        clazz = "low"
    }
    if (difference >= 20 && difference <= 45) {
        effect = "Хуже среднего"
        clazz = "lowAverage"
    }
    if (difference > 45 && difference < 55) {
        effect = "Нормальное"
        clazz = "average"
    }
    if (difference >= 55 && difference < 85) {
        effect = "Хорошее"
        clazz = "highAverage"
    }
    if (difference >= 85) {
        effect = "Очень хорошее"
        clazz = "high"
    }
    let reverseInd = Math.floor(difference * (indRelative / indOrigin))

    return {
        name: effect,
        class: clazz,
        mode1: "sum",
        mode2: "sum",

        valueOrigin: Math.floor(indOrigin),
        valueRelative: Math.round(indRelative),
        progressBarEffect: difference,
        reverseProgressBarEffect: reverseInd
    }
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
                $sort: {
                    "eventData.date": 1
                }
            },
            {
                $group: {
                    _id: "$animals",
                    Weight: {$last: "$eventData.weight"},
                    maxWeight: {$max: "$eventData.weight"},
                    avgWeight: {$min: "$eventData.weight"},
                    WoolWidth: {$last: "$eventData.woolWidth"},
                    avgWoolWidth: {$avg: "$eventData.woolWidth"},
                    maxWoolWidth: {$max: "$eventData.woolWidth"},
                    minWoolWidth: {$min: "$eventData.woolWidth"},
                    sumDirtWeight: {$sum: "$eventData.weightDirt"},
                    sumCleanWeight: {$sum: "$eventData.weightClean"},
                    avgCleanWeight: {$avg: "$eventData.weightClean"},
                    minCleanWeight: {$min: "$eventData.weightClean"},
                    maxCleanWeight: {$max: "$eventData.weightClean"},

                }
            }
        ]);
        console.log(eventsAnimal)
        if (eventsAnimal.toString() === [].toString()) {
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
                    sumCleanWeight: {$sum: "$eventData.weightClean"},
                    avgCleanWeight: {$avg: "$eventData.weightClean"},
                    minCleanWeight: {$min: "$eventData.weightClean"},
                    maxCleanWeight: {$max: "$eventData.weightClean"},
                }
            }
        ]);

        const farmTotal = eventsAnimalTotal[0];
        const animalStats = eventsAnimal[0];


        let dates = await Event.findOne({
            "eventData.weight": eventsAnimal[0]?.maxWeight?.toString() || "-1"
        });




        let indWoolWidth = compareIndicator("WoolWidth", animalStats, farmTotal)
        let indWeight = compareIndicator("Weight", animalStats, farmTotal)


        let indSumWoolDirt = compareSumIndicator("sumDirtWeight", animalStats, farmTotal)
        let indSumWoolClean = compareSumIndicator("sumCleanWeight", animalStats, farmTotal)
        let indAvgWoolClean = compareIndicator("CleanWeight", animalStats, farmTotal, 'avg')
        console.log(indAvgWoolClean)
        let response = {}
        response["Живая масса, кг"] = indWeight
        response["Тонина шерсти, мк"] = indWoolWidth
        response["В среднем с одной овцы мытой шерсти, кг"] = indAvgWoolClean
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
