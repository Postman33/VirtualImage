const jsonWebTokenStr = require("passport-jwt").Strategy
const extractJWT = require("passport-jwt").ExtractJwt
const keys = require("../config/json.web.token")

const mongoose = require("mongoose")
const User = mongoose.model("users")
const options = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.jwt
}
module.exports = function (passport) {
    passport.use(
        new jsonWebTokenStr(options, async (payload, done) => {
            try {
                const user = await User.findById(payload.userId).select("-password")

                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            }catch (err ){
                console.log("Error ", err)
            }

        })
    )
}
