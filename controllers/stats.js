const Farm = require("../models/farm")
const Event = require("../models/event")
const Chaban = require("../models/chaban")
const Sheep = require("../models/sheep")
const ErrorHandler = require("../util/errorHandler")


module.exports.getAllStats = async function(req, res) {

    try {
        let startDate = new Date(Date.parse(req.body.start));
        let endDate = new Date(Date.parse(req.body.end));

        const filterAnd = {
            $and: [
                {"passport.birthday": {$lte:endDate}},
                {"passport.birthday": {$gte:startDate}}
            ]
        }

        const animalsPeriod = await Sheep.find(filterAnd).lean();
        const animalsAfter = await Sheep.aggregate([
            {
                $match: {
                    "passport.birthday": {
                        $lte: endDate,
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
        for (let anim of animalsPeriod){
            if (String(anim.passport.reasonOfDisposal).toLowerCase().toString() !== "племпродажа" && anim.passport.reasonOfDisposal !== undefined){
                if (anim.passport.typeAnimal === "Баран"){
                    cfg["Умерших баранов"]++;
                }
                if (anim.passport.typeAnimal === "Овца"){
                    cfg["Умерших овец"]++;
                }
            }

            if (!anim.passport.reasonOfDisposal!==''){
                if (anim.passport.typeAnimal === "Баран"){
                    cfg["Родившихся баранов"]++;
                }
                if (anim.passport.typeAnimal === "Овца"){
                    cfg["Родившихся овец"]++;
                }
            }
        }


        const eventsStats = await Event.aggregate([
            {
                $unwind: "$animals"
            },
            { $lookup: {
                from: "sheep", localField:"animals",foreignField: "_id",
                    as: "animalInfo"
            }
            },

            {
                $unwind: "$animalInfo"
            },

            {
                $match: {
                    "eventData.date": {
                    $gte:req.body.start, $lte: req.body.end,
                }
                }

            },
            {
                $group: {
                    _id: null,
                    //maxWeight: {$max: "$eventData.weight"},
                    avgWeight: {$min: "$eventData.weight"},
                    avgWoolWidth: {$avg: "$eventData.woolWidth"},
                    sumDirtWeight:  {$sum: "$eventData.weightDirt"},
                    sumCleanWeight: {$sum: "$eventData.weightClean"}

                }
            }

        ]);
        console.log(eventsStats)


        // const allEvents = await Event.find().PopulateAll();
        //
        // for (let event of allEvents){
        //
        // }


       let responseObject = {}

        let statsArray = [];
        for(let key in cfg){
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
