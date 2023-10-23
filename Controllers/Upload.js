const Sessionroom = require("../Models/Sessionrooms")
const fs = require("fs")
exports.tempupload = (req, res) => {
    // const { ownerId } = req.body;

    let content = {
        owner: "",
        path: "",
        urlimg: "",
    }

    if(!req.file){
        return res.json({message: "failed"})
    }

    if(req.file){
        content.path = req.file.path
        content.urlimg = req.file.path
        content.owner = req.body.owner
    }

    Sessionroom.create(content)
    .then(() => res.json({message: "success", data: content.urlimg}))
    .catch(err => res.json({message: "failed", data: err}))

}  

exports.deletetemp = (req, res) =>{
    const { ownerId } = req.body

    Sessionroom.find({owner: ownerId})
    .then(async data => {
        if (data.length <= 0){
            return res.json({message: "success"})
        }

        for (var a = 0; a < data.length; a++){
            fs.unlinkSync(data[a].path) // DELETE FILE IMAGE
            await Sessionroom.findByIdAndDelete(data[a]._id) // DELETE ITEM FROM DATABASE
            .catch(err => res.json({message: "failed", data: err}))
        }

        res.json({message: "success"}) // RETURN SUCCESS AFTER DELETION
    })
    .catch(err => res.json({message: "failed", data: err}))
}

