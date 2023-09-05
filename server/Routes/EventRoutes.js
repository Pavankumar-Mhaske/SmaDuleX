/**
 * Importing Express to instantiated a rotuer to define routes .
 */
const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvent,
  getEvents,
  deleteEvent,
} = require("../controllers/EventController");

/**
 * "/create" - route is used to create a Event. It uses post method.
 */
router.route("/create").post(createEvent);

/**
 * "/getALl" - route is used to fetch all Events. It uses get method. - ADMIN ROUTE
 */
router.route("/getAll").get(getEvents);

/**
 * ":userId/:EventId" - route expects a parameter which will be used to fetch, update and delete Event on same route.
 *           - uses get() to fetch Event
 *          - uses put() to update Event
 *         - uses delete() to delete Event
 */

router.route("/:userId/:eventId").get(getEvent).delete(deleteEvent);

module.exports = router;
