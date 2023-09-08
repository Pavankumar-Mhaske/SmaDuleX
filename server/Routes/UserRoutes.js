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
const { getUserTodos } = require("../controllers/user/getUserTodos");
const { getUserEvents } = require("../controllers/user/getUserEvents");
/**
 * "/create" - route is used to create a user. It uses post method.
 */

// router.post("/create", createUser);
// or

router.route("/create").post(createUser);

/**
 * "/todos" - route is used to fetch the todos of a user. It uses get method.
 * It uses query parameter to fetch the todos of a user.
 * It expects userId as a query parameter.
 */
// router.get("/todos", getUserTodos);
// or
router.route("/todos").get(getUserTodos);

router.route("/events").get(getUserEvents);

module.exports = router;
