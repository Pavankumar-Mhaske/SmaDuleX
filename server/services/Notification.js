// require("dotenv").config();

// require('dotenv').config({ path: './.env' });
require("dotenv").config({ path: "./.env" });

// const Reminder = require("../models/EventSchema");
const Reminder = require("../models/EventSchema");

// WhatsApp API initialization

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// function for sending whatsapp message
exports.sendWhatsAppMessage = () => {
  setInterval(() => {
    const now = new Date();
    const datetime = now.toISOString();
    // Get the current datetime in ISO format
    // match the exact date including the date, month, year, hours, minutes and seconds..
    console.log(datetime);

    // Reminder.find({ remindAt: datetime, isReminded: false }).then((reminders) => {
    Reminder.find({}).then((reminders) => {
      // console.log("reminders: ", reminders);
      if (reminders) {
        // console.log("reminders: ", reminders);

        reminders.forEach((reminder) => {
          if (reminder.isReminded === false) {
            const now = new Date();
            if (new Date(reminder.remindAt) <= now) {
              console.log("reminder Found: ", reminder);
              client.messages
                .create({
                  body: reminder.reminderMsg,
                  from: "whatsapp:+14155238886",
                  to: "whatsapp:+919881470684",
                })
                .then((message) => {
                  console.log("Message Id: ", message.sid);
                  Reminder.findByIdAndUpdate(
                    reminder._id,
                    {
                      isReminded: true,
                    },
                    { new: true }
                  ).then((updatedReminder) => {
                    console.log("Reminder updated: ", updatedReminder);
                  });
                });
            }
          }
        });
      }
    });
  }, 60000);
};

exports.sendOtpEvent = async (req, res) => {
  console.log("req.body: ", req.body);
  const { contactNumber, Otp } = req.body;
  console.log("contactNumber: ", contactNumber);
  console.log("Otp: ", Otp);

  client.messages
    .create({
      body: "12345",
      from: "+12565883356",
      to: "+919881470684",
    })
    .then((message) => console.log(message.sid));
  res.send("OTP sent successfully!");
};

// module.exports= client;
