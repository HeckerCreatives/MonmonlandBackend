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

exports.totaltokenpertype = (req, res) => {
    Buytokenhistory.find()
    .then(tokens => {
        const transactionTypesToFilter = ["walletbalance", "monstergem", "bnb", "usdt", "busd", "usdc", "xrp", "doge"];

        // Filter tokens based on transaction types and type
        const filteredMMTTokens = tokens.filter(e => e.type === "MMT" && transactionTypesToFilter.includes(e.transactiontype));
        const filteredMCTTokens = tokens.filter(e => e.type === "MCT" && transactionTypesToFilter.includes(e.transactiontype));

        // Calculate sums using reduce
        const sumMMT = filteredMMTTokens.reduce((acc, token) => {
            acc[token.transactiontype] = (acc[token.transactiontype] || 0) + token.amount;
            return acc;
        }, {});

        const sumMCT = filteredMCTTokens.reduce((acc, token) => {
            acc[token.transactiontype] = (acc[token.transactiontype] || 0) + token.amount;
            return acc;
        }, {});

        res.json({ message: "success", data: sumMMT, data2: sumMCT });
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

}