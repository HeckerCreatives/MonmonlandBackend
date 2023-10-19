const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
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
        if (file.mimetype == "application/vnd.android.package-archive"){
            callback(null, true);
        }else{
            console.log(file.mimetype)
            console.log('only apk files supported')
            callback(new Error('Invalid file type'))
        }
    },
})

module.exports = upload;