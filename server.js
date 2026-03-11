const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const logger = require("./src/utils/logger");
const connectToDB = require("./src/config/database");
const PORT = process.env.PORT || 5000;



/**
 * @listens Listen the server
 * @description If get the value from env then connect if error then use 5000 port
 */
const startServer = async () => {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            logger.success(`Server running on port ${PORT}`);
        });

    } catch (error) {
        logger.error("Server failed to start", error.message);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Promise Rejection:", err);
    process.exit(1);
});