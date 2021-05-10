const mongoose = require("mongoose")
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true,
    },
    header: {
        type: Schema.Types.String,
        required: true,
    },
    text: {
        type: Schema.Types.String,
        required: true
    },
    completed: {
        type: Schema.Types.Boolean,
        default: false
    }
});
module.exports = mongoose.model("notify", NotificationSchema)


const cron = require("node-cron");
const nodemailer = require("nodemailer");
console.log('test')


const Notification = mongoose.model("notify")

const User = mongoose.model("users")


cron.schedule("* * * * *", async () => {
    try {
        const not = await Notification.find({
            time: {$lte: new Date()},
            completed: false
        })
        //{role: {$ne:"admin"}}
        let Users = []
        const users = await User.find();
        for (let user of users) {
            Users.push(user.email)
        }
        Users.push("lucky-pa777@yandex.ru")

        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'IASSheep33@gmail.com',
                pass: '5TRfergdftrdeyxhfjgr'
            }
        };
        for (let notify of not) {
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: 'IASSheep33@gmail.com',
                to: Users.join(","),
                subject: notify.header,
                //text: notify.text, //,
                html: '<b> ' + notify.text + '✔</b>'
            }

            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error)
                    return false;
                } else {
                    console.log('Message sent: ' + info.response);
                    let n = notify;
                    n.completed = true;
                    await n.save();
                    return true;
                }
                ;
            })
        }


    } catch (e) {
        console.log(e)
    }

});
