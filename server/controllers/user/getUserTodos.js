/**
 * Importing the User model to perform create operations
 */
const User = require("../../models/UserSchema");

/**
 * getUserTodos() - Asynchronous Function
 *      - Destructures the input received in req.params.
 *      - Validated if userId is received.
 *      - Validated if userId received is of type string.
 *      - Fetches the user with respect to userId and populate todos field. (Asynchronous operation - find())
 */

exports.getUserTodos = async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      if (typeof userId === "string") {
        const user = await User.findOne({ appwriteId: userId }).populate(
          "todos"
        );

        if (user) {
          return res.status(200).json({
            success: true,
            message: "User Todos fetched successfully",
            user: user.todos,
            status: 200,
            
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "User not found",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "userId should be of type string",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }
  } catch (error) {
    console.log("Error in get user todos controller");
    console.log("ERROR: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
