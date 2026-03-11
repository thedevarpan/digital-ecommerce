const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to add in the blacklist "]
    }
}, { timestamps: true });

module.exports = mongoose.model('BlackListTokens', blackListTokenSchema);