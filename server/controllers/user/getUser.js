const User = require("../../models/UserSchema");

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw new Error("userId required, Please pass userId to fetch a user");
    }

    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const user = await User.find({ appwriteId: userId });

    if (!user) {
      throw new Error("User not found in DB");
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    if (error.message === "User not found in DB") {
      console.log(`User not found in DB:`);
    } else {
      console.log("Error in getUser controller");
      console.log("ERROR: ", error);
      res.status(400).json({
        success: false,
        messageSrc: "Error in getUser controller",
        message: error.message,
      });
    }
  }
};
