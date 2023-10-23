const Apk = require("../Models/Apk")

exports.create = (req,res) => {

    let content = {
        path: ""
    }

    if(!req.file){
        return res.json({message: "failed"})
    }

    if(req.file){
        content.path = req.file.path
    }

    Apk.create(content)
    .then(() => res.json({message: "success"}))
    .catch(err => res.json({message: "failed", data: err}))
}

