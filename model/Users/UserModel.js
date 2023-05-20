const mongoose = require('mongoose')
require('../../server')
const userverification_schema = new mongoose.Schema({
    email: {
        type: String
    },
    fullname:{
        type: String
    },  
    password:{
        type: String
    },
    status: {
        type: Number,
        default:1
    },
    firebaseToken:{
        type:String
    }
    },{
    timestamps: true
})
const User_verification = mongoose.model('User', userverification_schema)
module.exports = User_verification