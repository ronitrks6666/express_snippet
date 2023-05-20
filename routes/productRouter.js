// const Router = require('express').Router()
// const productCtrl = require('../controller/productCtrl')
// const userAuthMiddleware = require('../middleware/userAuth')

// const multer = require('multer')

// var Storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + '.jpg')
//     }
// });

// var upload = multer({ storage: Storage })

// Router.post('/add-new-product', upload.any() , userAuthMiddleware ,productCtrl.addNewProduct);
// Router.get('/list-allUnsold-product', userAuthMiddleware ,productCtrl.listAllProduct);
// Router.get('/list-self-product', userAuthMiddleware ,productCtrl.listSelfProduct);
// Router.get('/list-single-product', userAuthMiddleware ,productCtrl.listProductById);
// Router.patch('/update-prod-sold-status', userAuthMiddleware ,productCtrl.updateProductStatus);
// Router.get('/list-purchased-item', userAuthMiddleware ,productCtrl.listBoughtProducts);


// module.exports = Router