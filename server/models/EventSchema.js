/**
 * Importing mongoose
 */
const mongoose = require("mongoose");

/**
 * Destructuring from mongoose
 *      - Schema Constructor
 *      - model method
 */
const { Schema, model } = mongoose;

const EventSchema = new Schema(
  {
    reminderMsg: {
      type: String,
      required: [true, "Reminder message is required"],
    },
    remindAt: {
      // type: Date ,
      type: String,
      required: [true, "Reminder time is required"],
    },
    isReminded: {
      type: Boolean,
      default: false,
    },
    // Keeping the reference of the use who created the reminder
    user: {
      type: Schema.Types.ObjectId, // This is a reference to the User model
      ref: "User",
      required: [true, "User is required to store Event"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Event", EventSchema);
