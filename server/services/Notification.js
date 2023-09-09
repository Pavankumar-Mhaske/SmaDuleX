// require("dotenv").config();

// require('dotenv').config({ path: './.env' });
require("dotenv").config({ path: "./.env" });

// const Event = require("../models/EventSchema");
const Event = require("../models/EventSchema");
const User = require("../models/UserSchema");
// WhatsApp API initialization

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// function for sending whatsapp message
exports.sendWhatsAppMessage = () => {
  console.log("inside the sendWhatsAppMessage function");

  setInterval(() => {
    console.log("inside the setInterval function");
    const now = new Date();
    const datetime = now.toISOString();
    // Get the current datetime in ISO format
    // match the exact date including the date, month, year, hours, minutes and seconds..
    console.log(datetime);

    // Event.find({ remindAt: datetime, isReminded: false }).then((reminders) => {
    Event.find({}).then((reminders) => {
      // console.log("Total reminder available reminders: ", reminders);
      if (reminders) {
        // console.log("reminders: ", reminders);

        reminders.forEach(async (reminder) => {
          if (reminder.isReminded === false) {
            const now = new Date();
            if (new Date(reminder.remindAt) <= now) {
              console.log(
                "*************************************************************"
              );
              console.log("reminder Found: ", reminder);

              // console.log("id: ", reminder.user._id);
              // console.log("userId", reminder.user._id.toString());

              const userId = reminder.user._id.toString();
              console.log("userId: ", userId);
              const user = await User.findOne({ _id: userId });
              console.log("user: ", user);
              const contactNumber = user.contactNumber;
              console.log("contactNumber: ", contactNumber);
              // const user = User.findById(userId);
              // console.log("user: ", user);
              // const contactNumber = user.contactNumber;
              // console.log("contactNumber: ", contactNumber);
              console.log(
                "*************************************************************"
              );

              client.messages
                .create({
                  body: reminder.reminderMsg,
                  from: "whatsapp:+14155238886",
                  // to: "whatsapp:+919881470684",
                  to: `whatsapp:${contactNumber}`,
                })
                .then((message) => {
                  console.log("Message Id: ", message.sid);
                  Event.findByIdAndUpdate(
                    reminder._id,
                    {
                      isReminded: true,
                    },
                    { new: true }
                  ).then((updatedReminder) => {
                    console.log("Event updated: ", updatedReminder);
                  });
                });
            }
          }
        });
      }
    });
  }, 20000);
};

exports.sendOtpEvent = async (req, res) => {
  console.log("req.body: ", req.body);
  const { contactNumber, Otp } = req.body;
  console.log("*************************************************************");
  console.log("contactNumber: ", contactNumber);
  console.log("Otp: ", Otp);
  console.log(
    `type - ${typeof contactNumber} and contactNumber: ${contactNumber} 
     type - ${typeof Otp} and otp: ${Otp} 
    `
  );
  console.log("*************************************************************");
  client.messages
    .create({
      body: Otp,
      from: "+12565883356",
      to: contactNumber,
    })
    .then((message) => console.log(message.sid));
  res.send("OTP sent successfully!");
};

// update the isVerified field of the user
exports.updateIsVerified = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { userId, isVerified, contactNumber } = req.body;

    if (!userId || typeof userId !== "string") {
      if (!userId) {
        throw new Error("userId is Required!");
      } else {
        throw new Error("userId should be of type String");
      }
    }

    console.log("userId: ", userId);
    const user = await User.findOne({ appwriteId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    user.contactNumber = contactNumber;

    user.isVerified = isVerified;

    await user.save();
    // console.log("**************** inside the verify user:::::***********");
    res.status(200).json({
      success: true,
      message: "User is verified successfully!",
      data: user,
    });
  } catch (error) {
    console.log("Error in updateIsVerified controller");
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// module.exports= client;
