const Farm = require("../models/farm")
const Event = require("../models/event")
const Chaban = require("../models/chaban")
const Sheep = require("../models/sheep")
const ErrorHandler = require("../util/errorHandler")


module.exports.getAllStats = async function(req, res) {

    try {
        console.log("Body= ", req.body)

        const filter = {
            $and: [
                {"passport.birthday": {$lte:req.body.end}},
                {"passport.birthday": {$gte:req.body.start}}
            ]

        }
        const animals = await Sheep.find(filter);
        console.log(animals)
        let cfg = {
            "Родившихся баранов": 0,
            "Родившихся овец": 0,
            "Умерших баранов": 0,
            "Умерших овец": 0,
        }
        for (let anim of animals){
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
        console.log(cfg)
        const events = await Event.aggregate([
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
                $group: {
                    _id: "$animalInfo.passport.typeAnimal",

                }
            }

        ]);



        const allEvents = await Event.find().PopulateAll();

        for (let event of allEvents){

        }




        let responseObject = [];
        for(let key in cfg){
            responseObject.push(
                {
                    name: key,
                    value: cfg[key]
                }
            )
        }



        res.status(200).json(responseObject)
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}
