const Users = require("../model/Users/UserModel")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})
        const user = await Users.findOne({email: decoded.email})
        //console.log("user", user)
       if(user.status == 0){
        return res.status(406).json({Error:"You accound is not eligible for this access"})
       }
        req.user = user
        next()
    } catch (err) {
        console.log('error')
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth