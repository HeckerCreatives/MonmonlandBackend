const Buytokenhistory = require("../Gamemodels/Buytokenhistory")

exports.totaltokens = (req, res) => {
    Buytokenhistory.find()
        .then(tokens => {
            // Filter tokens based on type
            const MMTTokens = tokens.filter(e => e.type === "MMT");
            const MCTTokens = tokens.filter(e => e.type === "MCT");

            // Calculate sum of amounts for each type
            const sumMMT = MMTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);
            const sumMCT = MCTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);

            res.json({ message: "success", data: sumMMT, data2: sumMCT });
        })
        .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
};