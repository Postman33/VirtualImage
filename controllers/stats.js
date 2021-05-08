const Farm = require("../models/farm")
const Event = require("../models/event")
const Chaban = require("../models/chaban")
const Sheep = require("../models/sheep")
const ErrorHandler = require("../util/errorHandler")


function monthDiff(dt1, dt2) {

    var diffMonth = (dt2.getTime() - dt1.getTime()) / 1000;
    diffMonth /= (60 * 60 * 24 * 7 * 4);
    return Math.abs(Math.round(diffMonth));

}

function transformToDataInput(data) {
    const result = [];
    for (let k in data) {
        if (!data.hasOwnProperty(k)) {
            continue;
        }
        result.push({
            name: k,
            value: data[k]
        })
    }
    return result;

}

module.exports.getPeriodStats = async function (req, res) {

    try {
        let startDate = new Date(Date.parse(req.body.start));
        let endDate = new Date(Date.parse(req.body.end));

        const filterAnd = {
            $and: [
                {"passport.birthday": {$lte: endDate}},
                {"passport.birthday": {$gte: startDate}}
            ]
        }

        const animalsPeriod = await Sheep.find(filterAnd).lean();
        const animalsAfter = await Sheep.aggregate([
            {
                $match: {
                    "passport.birthday": {
                        $lte: endDate,
                    },
                    "passport.reasonOfDisposal": {
                        $eq: undefined
                    }
                },

            },
            {
                $group: {
                    _id: "$passport.typeAnimal",
                    sum: {
                        $sum: 1
                    }
                }
            }
        ]);

        let cfg = {
            "Родившихся баранов": 0,
            "Родившихся овец": 0,
            "Умерших баранов": 0,
            "Умерших овец": 0,
        }
        for (let anim of animalsPeriod) {
            if (String(anim.passport.reasonOfDisposal).toLowerCase().toString() !== "племпродажа" && anim.passport.reasonOfDisposal !== undefined) {
                if (anim.passport.typeAnimal === "Баран") {
                    cfg["Умерших баранов"]++;
                }
                if (anim.passport.typeAnimal === "Овца") {
                    cfg["Умерших овец"]++;
                }
            }

            if (!anim.passport.reasonOfDisposal !== '') {
                if (anim.passport.typeAnimal === "Баран") {
                    cfg["Родившихся баранов"]++;
                }
                if (anim.passport.typeAnimal === "Овца") {
                    cfg["Родившихся овец"]++;
                }
            }
        }


        const eventsStats = await Event.aggregate([
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
                $match: {
                    "eventData.date": {
                        $gte: req.body.start,
                        $lte: req.body.end,
                    }
                }

            },
            {
                $group: {
                    _id: null,
                    //maxWeight: {$max: "$eventData.weight"},
                    avgWeight: {$min: "$eventData.weight"},
                    avgWoolWidth: {$avg: "$eventData.woolWidth"},
                    sumDirtWeight: {$sum: "$eventData.weightDirt"},
                    sumCleanWeight: {$sum: "$eventData.weightClean"}

                }
            }

        ]);


        let responseObject = {}

        let statsArray = [];
        for (let key in cfg) {
            statsArray.push(
                {
                    name: key,
                    value: cfg[key]
                }
            )
        }

        responseObject["stats"] = statsArray;
        responseObject['tableStats'] = animalsAfter;
        responseObject["eventTableStats"] = eventsStats[0];

        res.status(200).json(responseObject)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

};
module.exports.getStructureStats = async function (req, res) {

    try {

        const YARKA1 = 'Ярки до года';
        const YARKA2 = 'Ярки до двух лет';
        const YARKA3 = 'Ярки 2+ лет';
        const Sheep_CONST = 'Взрослые овцы';

        const BARAN1 = 'Баранчики до года';
        const BARAN2 = 'Баранчики до двух лет';
        const BARAN3 = 'Баранчики 2+ лет';
        const Baran_CONST = 'Взрослые бараны';


        const date = req.body.date.toLocaleString()
        console.log(req.body)
        const filter = {
            "passport.birthday": {$lte: req.body.date},
            $or: [
                {
                    "passport.dateOfDisposal": {$gte: req.body.date}
                },
                {
                    "passport.dateOfDisposal": {$eq: undefined}
                }
            ]
        }


        const animalsPeriod = await Sheep.find(filter).lean();
        console.log(animalsPeriod)
        const exclude = []

        const SheepStructure = {}

        SheepStructure[YARKA1] = 0;
        SheepStructure[YARKA2] = 0;
        SheepStructure[YARKA3] = 0;

        SheepStructure[BARAN1] = 0;
        SheepStructure[BARAN2] = 0;
        SheepStructure[BARAN3] = 0;

        SheepStructure[Sheep_CONST] = 0;
        SheepStructure[Baran_CONST] = 0;

        for (let animal of animalsPeriod) {
            if (animal.genealogy?.father || animal.genealogy?.mother) {
                exclude.push(animal._id);
            }
        }

        for (let animal of animalsPeriod) {

            if (!exclude.includes(animal._id)) {
                let diff = monthDiff(animal.passport.birthday, new Date());
                if (animal.passport.typeAnimal === "Овца") {
                    if (diff <= 12 && diff > 0) {
                        SheepStructure[YARKA1]++;
                    }
                    if (diff <= 24 && diff > 12) {
                        SheepStructure[YARKA2]++
                    }
                    if (diff > 24) {
                        SheepStructure[YARKA3]++;
                    }
                } else {
                    if (diff <= 12 && diff > 0) {
                        SheepStructure[BARAN1]++;
                    }
                    if (diff <= 24 && diff > 12) {
                        SheepStructure[BARAN2]++
                    }
                    if (diff > 24) {
                        SheepStructure[BARAN3]++;
                    }
                }
            } else {
                if (animal.passport.typeAnimal === "Овца") {
                    SheepStructure[Sheep_CONST]++;
                } else {
                    SheepStructure[Baran_CONST]++;
                }
            }
        }

        res.status(200).json({stats: transformToDataInput(SheepStructure)})
    } catch (Err) {
        ErrorHandler(res, Err)
    }

};

module.exports.getCustomReport = async function (req, res) {

    try {

        const date = req.body.date.toLocaleString()
        console.log(req.body)

        const filter = {
            "passport.birthday": {$lte: req.body.date},
            $or: [
                {
                    "passport.dateOfDisposal": {$gte: req.body.date}
                },
                {
                    "passport.dateOfDisposal": {$eq: undefined}
                }
            ]
        }


        const animalsPeriod = await Sheep.find(filter).lean();

        res.status(200).json({
            stats:{}
        })
    } catch (Err) {
        ErrorHandler(res, Err)
    }

};
