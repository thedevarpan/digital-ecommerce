const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const logger = require("./src/utils/logger");
const connectToDb = require("./src/config/databse");

/** 
 * @listens PORT mention on env
*/
const connectToServer = () => {
    try {

        app.listen(process.env.PORT || 5000, () => {
            logger.success(`Server Running on ${process.env.PORT || 5000}`)
        });

    } catch (error) {
        logger.error("Error to connect with server", error.message);
    }
}

connectToServer();
connectToDb();