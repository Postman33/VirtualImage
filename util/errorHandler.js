module.exports = function (res, err){
    res.status(500).json({
        error: err.message || "Internal server error"
    })
}
