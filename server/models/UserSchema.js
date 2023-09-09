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

/**************definition of User Model********************************************** */
/**
 * UserSchema - Creating a schema for Todo
 *     - role: String value, By default holds user as value.
 *      - name: String value, Its required field, Can have maximum 50 charecters.
 *      - email: String value, Its required field, Should be unique (Creates a unique index).
 *      - profession: String value.
 *      - appwriteId: String value, Its required field.
 *      - todos: It is a collection (Array) of ObjectId of todo.
 */

const UserSchema = new Schema(
  {
    role: {
      type: String,
      default: "user",
    },
    name: {
      type: String,
      required: [true, "Title of the todo is required"], // Custom error message
      maxlength: [50, "Title of the todo can not be more than 50 charecters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required to create a user"],
      unique: true,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    appwriteId: {
      type: String,
      required: [true, "Appwrite Id is required to create a user"],
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: [20, "Contact number can not be more than 20 digits"],
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    todos: [
      {
        type: Schema.Types.ObjectId, // This is a reference to the Todo model
        ref: "Todo",
        required: [true, "Todo I'd is required to store todo for user"],
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId, // This is a reference to the Todo model
        ref: "Event",
        required: [true, "Event I'd is required to store Event for user"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

/***************Registration of User Model**************************************** */
/**
 * Exporting model
 *      - Creating a model from the Schema defined and export
 */
module.exports = model("user", UserSchema);
