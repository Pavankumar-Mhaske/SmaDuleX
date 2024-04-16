/**
 * Configuring dotenv package
 */
// require("dotenv").config();
// const Reminder = require("../models/EventSchema");

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
// Allow requests from specified origins
const allowedOrigins = [
  "https://smadulex-3toq97k5k-pavankumarmhaskes-projects.vercel.app",
  "https://localhost",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is allowed or is undefined (for same-origin requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// Use CORS middleware with custom options

/**
 * Home route for testing purpose
 */

// const { sendWhatsAppMessage } = require("./services/Notification");

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
const todoRoutes = require("./Routes/TodoRoutes");
const eventRoutes = require("./Routes/EventRoutes");
/**
 * Using the user routes
 *     - /user - is the base route for user routes
 *    - userRoutes - is the user routes
 */
app.use("/user", userRoutes);

/**
 * Using the todo routes
 *    - /todo - is the base route for todo routes
 *   - todoRoutes - is the todo routes
 */
app.use("/todo", todoRoutes);

/**
 * Using the Event routes
 *   - /event - is the base route for event routes
 *  - eventRoutes - is the event routes
 */
app.use("/event", eventRoutes);

/**
 * exporting the app
 * so that it can be used in server.js
 * @exports app
 * @requires express
 * @requires cors
 * @requires dotenv
 */
//  TODO: this function call is running the function before the database connection is established so i need the function to run after the database connection is established
// sendWhatsAppMessage();
// WhatsApp API initialization

const { dbConnect } = require("./config/dbConnect");

const { sendWhatsAppMessage } = require("./services/Notification");

/**
 * DB connection
 * dbConnect() - database connection
 *              - connecting application to database
 */
// dbConnect();

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
//
startApp();

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

// setInterval(() => {
//   const now = new Date();
//   const datetime = now.toISOString();
//   // Get the current datetime in ISO format
//   // match the exact date including the date, month, year, hours, minutes and seconds..
//   console.log(datetime);

//   // Reminder.find({ remindAt: datetime, isReminded: false }).then((reminders) => {
//   Reminder.find({}).then((reminders) => {
//     // console.log("reminders: ", reminders);
//     if (reminders) {
//       // console.log("reminders: ", reminders);

//       reminders.forEach((reminder) => {
//         if (reminder.isReminded === false) {
//           const now = new Date();
//           if (new Date(reminder.remindAt) <= now) {
//             console.log("reminder Found: ", reminder);
//             client.messages
//               .create({
//                 body: reminder.reminderMsg,
//                 from: "whatsapp:+14155238886",
//                 to: "whatsapp:+918530470684",
//               })
//               .then((message) => {
//                 console.log("Message Id: ", message.sid);
//                 Reminder.findByIdAndUpdate(
//                   reminder._id,
//                   {
//                     isReminded: true,
//                   },
//                   { new: true }
//                 ).then((updatedReminder) => {
//                   console.log("Reminder updated: ", updatedReminder);
//                 });
//               });
//           }
//         }
//       });
//     }
//   });
// }, 60000);

module.exports = app;
