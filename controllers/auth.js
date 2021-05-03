const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');
const keys = require("../config/json.web.token")
const User = require("../models/users");

module.exports.login = async function (req, res) {
    const users = await User.findOne({
        email: req.body.email
    })
    console.log(users)
    if (users) {
        const exp_in = 3600*24*7;
        const passwordResult = bcrypt.compareSync(req.body.password, users.password)
        if (passwordResult) {
            const token = jwt.sign({
                email: req.body.email,
                userId: users._id
            }, keys.jwt, {expiresIn: exp_in});

            res.status(200).json(
                {
                    token: `Bearer ${token}`,
                    expiresIn: exp_in
                }
            )
        } else {
            // Пароли не совпали
            res.status(401).json({
                error: "Неверный пароль!"
            })
        }
    } else {
        res.status(404).json({
            error: "Пользователя нет!"
        })
    }

}
module.exports.register = async function (req, res) {
    console.log(req.body)
    const users = await User.findOne({
        email: req.body.email
    })
    if (users) {
        res.status(409).json({
            error: "Уже существует!"
        })
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save();
            res.status(200).json({message: "Создан!"})
        } catch (err) {
            require("../util/errorHandler")(res, err)
        }


    }
}

module.exports.allowTo = function (role) {
    return (req,res,next)=>{
        if (req.user.role !== role){
            return res.json({message:"Не хватает прав доступа!"})
        }
        next()
    }
}
module.exports.getMyRole =  async function (req, res) {
    try {
        const user = req.user
        res.status(200).json( {
            role: user.role
        })
    }
    catch (e) {
        require("../util/errorHandler")(res, e)
    }

}


// const user = mongoose.model("users")
