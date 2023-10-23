const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'tempuploads/')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback){
        console.log(file.mimetype)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg"
        || file.mimetype == "image/jpeg"){
            callback(null, true);
        }else{
            console.log(file.mimetype)
            console.log('only jpg & png files supported')
            callback(new Error('Invalid file type'))
        }
    },
})

module.exports = upload;