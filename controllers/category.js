
const Categories = require("../models/category")
const Positions = require("../models/positions")
const ErrorHandler = require("../util/errorHandler")

module.exports.getAll = async function (req, res){
  try{
      const categories = await Categories.find({
          user: req.user.id
      })
    res.status(200).json( categories )
  }
  catch (err){
      ErrorHandler(res,err)
  }
}
module.exports.getById = async function (req, res){
    try{
        const categories = await Categories.findById(req.params.id)
        res.status(200).json( categories )
    }
    catch (err){
        ErrorHandler(res,err)
    }

}
module.exports.removeById = async function (req, res){
    try{
        const positions = await Positions.remove({ category: req.params.id})
        const categories = await Categories.remove({ _id: req.params.id})

        res.status(200).json({
            message: "Удалено! "
        } )
    }
    catch (err){
        ErrorHandler(res,err)
    }
}
module.exports.create = async function (req, res){
    const category = new Categories({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    })
    try{
        await category.save()
        res.status(201).json(category)
    }
    catch (err){
        ErrorHandler(res,err)
    }
}
module.exports.update = async function (req, res){
    const updated = {name:req.body.name
    }
    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    try{
        const category = await Categories.findOneAndUpdate({
            _id:req.params.id
        }, {$set: updated},
            {new: true
            })
        res.status(200).json( category );
    }
    catch (err){
        ErrorHandler(res,err)
    }
}
