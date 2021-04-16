const express = require("express");
const app = express();
const authRoutes = require("./routes/auth")
const farmRoutes = require("./routes/farm")
const chabanRoutes = require("./routes/chaban")
const sheepRoutes = require("./routes/sheep")
const otaraRoutes= require("./routes/otara")
const eventRoutes= require("./routes/event")


const mongoose = require("mongoose")
const passport = require("passport")
const rateLimit = require("express-rate-limit");
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xssClean = require("xss-clean")
const hpp = require("hpp")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://root:qteaS3q4warg13q4wrte@cluster0.kgzfu.mongodb.net/test?retryWrites=true&w=majority",{  useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true})
    .then( ()=>{
    console.log("Successful")
}).catch( (err)=>{
    console.log(err)})


app.use(passport.initialize())
require("./middleware/passport")(passport)

const cors = require("cors")
const morgan = require("morgan")
///
const bodyParser = require("body-parser")


app.use( morgan('dev'))
app.use( cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp()) // Parameter pollution

//app.use("/api/analytic",analyticRoutes)

app.use(helmet())

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 2000 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);



app.use("/uploads",express.static("uploads"))

app.use("/api/auth",authRoutes)
app.use("/api/farm",farmRoutes)
app.use("/api/chaban",chabanRoutes)
app.use("/api/sheep",sheepRoutes)
app.use("/api/otara",otaraRoutes)
app.use("/api/event",eventRoutes)

module.exports = app
