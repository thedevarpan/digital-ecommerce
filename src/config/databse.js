const mongoose = require("mongoose");
const logger = require("../utils/logger");
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        logger.success(`MongoDB Connected Successfully`);
        mongoose.set('strictQuery', true);

    } catch (error) {
        logger.error("Database connection failed", error);
        process.exit(1);
    }
}

module.exports = connectToDB;