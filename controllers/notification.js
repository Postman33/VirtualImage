const Notification = require("../models/notification")

const ErrorHandler = require("../util/errorHandler")


module.exports.getAll = async function (req, res) {

    try {
        const farms = await Notification.find();
        res.status(200).json(farms)
    } catch (Err) {
        ErrorHandler(res, Err)
    }


}

module.exports.saveAll = async function (req, res) {

    try {
        console.log(req.body)
            const records = req.body.records
        for( let k in records){
            if (!records.hasOwnProperty(k)) continue
            console.log(k)
            if (records[k].id == null){
                await new Notification({
                    ...records[k]
                }).save()
            } else {
                if (records[k].name==="--REMOVE"){
                    await Notification.findOneAndRemove({_id:records[k].id})
                } else {
                    await Notification.findByIdAndUpdate(records[k].id,{$set: {...records[k]}})
                }

            }
        }
        res.status(200).json({message:"Сохранено!"})
    } catch (Err) {
        ErrorHandler(res, Err)
    }

}
