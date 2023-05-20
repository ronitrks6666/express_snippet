const Product = require("../model/Products/ProductModel")
const { uploadFile } = require("../s3")

const AWS_folder = "products/"


async function pagination(DB, DBQuery, limitQuery) {
    const page = parseInt(limitQuery.page)
    const limit = parseInt(limitQuery.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    const totalRecord = await DB.countDocuments().exec()
    results.totalRecord = totalRecord
    if (endIndex < totalRecord) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    // try {
    const len = await DBQuery.clone().exec()
    results.results = await DBQuery.limit(limit).skip(startIndex).exec()
    //console.log(len)
    results.totalRecord = len.length
    return results;

    // } catch (e) {
    //     res.status(500).json({ message: e.message })
    // }
}

const authCtrl = {

    addNewProduct : async (req, res) => {
        try {
            console.log(req.user)
            console.log("Body",req.body)
            const destructReqBody = {
                ProductName:req.body.ProductName,
                price:req.body.price,
                description:req.body.description,
                productOwner:req.user._id
            }
            let product = new Product(destructReqBody) 

            if (req.files) {
                console.log("files")
                for (i = 0; i < req.files.length; i++) {
                    console.log(req.files[i].fieldname)
                    if (req.files[i].fieldname === "image") {
                        const uploadResult = await uploadFile(req.files[i], AWS_folder)
                        product.images.push(uploadResult.Location)
                    }
                    else if (req.files[i].fieldname === "thumbnail") {
                        const uploadResult = await uploadFile(req.files[i], AWS_folder)
                        console.log("Result",uploadResult)
                        product.thumbnail = uploadResult.Location 
                    }
                    else {
                        console.log("invalid file type")
                        return res.send("No other media files accepted other than 'image' and 'thumbnail'")
                    }
                }
            }
            console.log(product)
            await product.save()

            res.json({Success:"Product listed successfully" , product})

        } catch (error) {
            console.log("post error" , error)
            res.json(400).send(error)
        }
    },
    listAllProduct : async (req,res)=>{
        try {
            console.log('unsold prod')
            const products = await pagination(Product, Product.find({soldStatus:0}), req.query)
            res.json({products})
        } catch (error) {
            res.status(400).json(error)
        }
    },
    listSelfProduct : async (req,res)=>{
        try {
            const products = await pagination(Product, Product.find({productOwner:req.user._id }), req.query)
            res.json({products})
        } catch (error) {
            res.status(400).json(error)
        }
    },
    listProductById : async (req,res)=>{
        try {
            const products = await Product.findById(req.query.id)
            res.json({products})
        } catch (error) {
            res.status(400).json(error)
        }
    },
    //When user purchases the item
    updateProductStatus : async (req , res)=>{
        try {
            console.log(req.query)
           const updatedProduct = await Product.findByIdAndUpdate({_id:req.query.id} , 
            {
                //if owner is marking product as sold then the 'boughtOwner' will be 'null'
                //If any other user purchases the item then his '_id' will be saved in 'boughtOwner'
                //If the product is marked as unSold i.e status '0' , then the 'boughtOwner' field will be empty again
                soldStatus:req.query.status,
                boughtOwner:req.query.status=='1'? req.query.mode== "other" ? req.user._id : null : null
            },
            {returnDocument:"after"}) 
            
            res.json({Success:"Product status updated successfully" , updatedProduct})
        } catch (error) {
            res.status(400).json(error)
        }
    },
    listBoughtProducts : async (req,res) =>{
        try {
            const products = await pagination(Product, Product.find({boughtOwner:req.user._id }), req.query)
            res.json({products})
        } catch (error) {
            res.status(400).json(error)
        }
    }
}
module.exports = authCtrl;