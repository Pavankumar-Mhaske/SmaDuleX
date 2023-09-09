/**
 * Importing the expres setup
 */

const app = require("./app");
const { sendWhatsAppMessage } = require("./services/Notification");

/**
 * DB connection
 * dbConnect() - database connection
 *              - connecting application to database
 */
const { dbConnect } = require("./config/dbConnect");
dbConnect();

// Wrap the database connection in an async function

const startApp = async () => {
  try {
    await dbConnect();
    console.log(`
    Congratulations! .....Database connected successfully.....
                      Now starting the app...`);
    sendWhatsAppMessage();
  } catch (error) {
    console.log(error);
  }
};

// message to commit to git
// ensured that the connection is established before proceeding with other tasks.

startApp();

/**
 * Destucturing PORT from .env file
 * If PORT is not available it uses 4001 as PORT
 */
const { PORT } = process.env || 4001;

/**
 * Setting up server to listen at PORT.
 * If PORT is not available it uses 4001 as PORT
 */
app.listen(PORT, () => {
  console.log(`Server is up and running at , http://localhost:${PORT}/"`);
});
