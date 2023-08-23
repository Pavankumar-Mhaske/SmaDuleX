/**
 * Configuring dotenv package
 */
require("dotenv").config();

/**
 * Importing express package and setting it up by calling it.
 */
const express = require("express");
const app = express();

/**
 * Importing cors package.
 */
const cors = require("cors");

/**
 * Middlewares
 *      - express.json() - To handle (parse) the json data coming in request
 *      - express.urlencoded({extended: true}) - To handle data coming from URL in encoded format
 *      - cors - To handle cross origin requests
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Home route for testing purpose
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the application",
  });
});

/**
 * Importing the user routes
 */
const userRoutes = require("./Routes/UserRoutes");

/**
 * Using the user routes
 *     - /user - is the base route for user routes
 *    - userRoutes - is the user routes
 */

app.use("/user", userRoutes);

module.exports = app;
