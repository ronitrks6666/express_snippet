const mongoose = require('mongoose')
require('../../server')

const product_details_schema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
        trim: true
    },
    Category:{type: String},           //eg. electronics
    productType:{type: String},        //eg. Phone
    price: { 
        type: Number
    },
    description: {
        type: String
    },
    productOwner:{
        type: mongoose.Schema.Types.ObjectId  , ref : 'User'
    },
    boughtOwner:{
        type: mongoose.Schema.Types.ObjectId  , ref : 'User'
    },
    images: [{
        type: String
    }],
    thumbnail: {
        type: String
    },
    soldStatus:{
        type:Number , default:0
    },
    status: {
        type: String, default:1
    }
}, {
    timestamps: true
})

const Product_details = mongoose.model('Product_detail', product_details_schema)
module.exports = Product_details