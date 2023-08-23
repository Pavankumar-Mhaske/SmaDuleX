/**
 * Importing Express to instantiated a rotuer to define routes .
 */

const express = require("express");
const router = express.Router();

/**
 * Importing the createUser() function from the controller
 * to handle the POST request.
 */

const { createUser } = require("../controllers/user/createUser");

/**
 * "/create" - route is used to create a user. It uses post method.
 */

// router.post("/create", createUser);
// or

router.route("/create").post(createUser);

module.exports = router;
