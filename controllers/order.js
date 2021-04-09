const Orders = require("../models/orders")
const ErrorHandler= require("../util/errorHandler")
module.exports.getAll = async function (req, res){
    try {
        const query = {
            user: req.user.id
        }
        if (req.query.start){
            query.date={
                $gte:req.query.start
            }
        }
        if (req.query.end){
            if (!query.date) {
                query.date = {}
            }
            query.date["$lte"] = req.query.end

        }
        if (req.query.order) {
            query.order = +req.query.order
        }
        const orders = await Orders.find(query).sort({date:-1})
            .skip(+req.query.offset)
            .limit(+req.query.limit)

        res.status(200).json( orders )
    }catch (e) {
        ErrorHandler(res,e)
    }
}
module.exports.create = async function (req, res){
    try {
        const LastOrder = await Orders.findOne({
            user: req.user.id
        }).sort({date:-1}).limit(1)
        const maxOrder = LastOrder.order ? LastOrder.order : 0
      const order=  await    new Orders({
          list: req.body.list,
          user: req.user.id,
          order:maxOrder+1
      }).save()
        res.status(201).json(order)
    }
    catch (er){ErrorHandler(res,er)}

}
