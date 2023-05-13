const jwt = require("jsonwebtoken");

const GenerateToken = id =>
    jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "8h",
    });

    module.exports = GenerateToken;