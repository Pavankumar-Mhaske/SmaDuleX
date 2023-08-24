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

/**************definition of Todo Model********************************************** */
/**
 * TodoSchema - Creating a schema for Todo
 *      - title: String value, Its required field, Can have maximum 30 charecters.
 *      - tasks: It is a collection (Array) of string values, Any value passed is converted to string.
 *      - isImportant: It is a flag use to prioritize todo, Stores boolean value, By default its false.
 *      - isCompleted: It is a flag use to mark todo as completed, Stores boolean value, By default its false.
 *      - user: It is a reference to the User model, Stores ObjectId of user.
 *     - timestamps: true, It creates two fields createdAt and updatedAt.
 *
 */

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title of todo is required"],
      maxlength: [30, "Title of todo can have maximum 30 charecters"],
      trim: true,
    },

    tasks: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    isImportant: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId, // This is a reference to the User model
      ref: "User",
      required: [true, "User is required to store todo"],
    },
  },
  {
    timestamps: true,
  }
);

/**************Registration of Todo model********************************************** */
/**
 * Exporting model
 *      - Creating a model from the Schema defined and export
 */
module.exports = model("Todo", TodoSchema);
