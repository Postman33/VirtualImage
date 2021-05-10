module.exports = function (res, err){
    console.log(err)
    res.status(500).json({
        error: err.message || "Internal server error"
    })
}
