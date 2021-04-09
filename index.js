
const app = require("./app.js")
const env = require("dotenv")

env.config({path:"./config/env.config"})
const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`Server has been started on port ${port}`)
})
