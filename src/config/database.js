const mongoose = require("mongoose");
const logger = require("../utils/logger");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
mongoose.set("strictQuery", true);

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.success("MongoDB Connected Successfully");

    } catch (error) {
        logger.error("Database connection failed", error.message);
        process.exit(1);
    }
};

module.exports = connectToDB;