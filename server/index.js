/**
 * Importing the expres setup
 */

const app = require("./app");

/**
 * DB connection
 * dbConnect() - database connection
 *              - connecting application to database
 */

const { PORT } = process.env;

/**
 * Setting up server to listen at PORT.
 * If PORT is not available it uses 4001 as PORT
 */
app.listen(PORT || 4001, () => {
  console.log(`Server is up and running at , http://localhost:${PORT}/"`);
});
