/**
 * Importing the User model to perform create operations
 */
const User = require("../../models/UserSchema");

/**
 * createUser() - Asynchronous Function
 *      - Destructures the input received in req.body.
 *      - Create a userObj object.
 *      - Validated if name is received.
 *      - Validated if name received is of type string.
 *      - define name property in userObj.
 *      - Validated if email is received.
 *      - Validated if email received is of type string.
 *      - define email property in userObj.
 *      - Validated if profession is received then it should be of type string.
 *      - If profession is valid define it in userObj.
 *      - Validated if appwriteId is received.
 *      - Validated if appwriteId is of type string.
 *      - If appwriteId is valid define it in userObj.
 *      - Creates a new document from the validated data. (Asynchronous operation - create())
 */

exports.createUser = async (req, res) => {
  try {
    const { name, email, profession, appwriteId } = req.body;

    console.log(name, email, profession, appwriteId);

    const userObj = {};

    if (name) {
      if (typeof name === "string") {
        userObj.name = name;
      } else {
        return res.status(400).json({ msg: "Name should be of type string" });
      }
    } else {
      return res.status(400).json({ msg: "Name is required" });
    }

    if (email) {
      if (typeof email === "string") {
        userObj.email = email;
      } else {
        return res.status(400).json({ msg: "Email should be of type string" });
      }
    } else {
      return res.status(400).json({ msg: "Email is required" });
    }

    if (profession) {
      if (typeof profession === "string") {
        userObj.profession = profession;
        /**
         * If you want to set the enumerable property to false, you would need to use the Object.defineProperty()
         *
         * When enumerable is set to false, the property will not be included when iterating over the object's properties
         *
         * Object.defineProperty(userObj, 'profession', {
         *     value: profession,
         *    enumerable: false
         * });
         */
      } else {
        return res
          .status(400)
          .json({ msg: "Profession should be of type string" });
      }
    }

    if (appwriteId) {
      if (typeof appwriteId === "string") {
        userObj.appwriteId = appwriteId;
      } else {
        return res
          .status(400)
          .json({ msg: "AppwriteId should be of type string" });
      }
    } else {
      return res.status(400).json({ msg: "AppwriteId is required" });
    }

    // userObj.isVerified = false;

    /**
         * 
        const newUser = new User(userObj);
        const savedUser = await newUser.save();

                        or
         */

    // include this line in try catch block -> const savedUser = await User.create(userObj);

    const savedUser = await User.create(userObj);
    console.log("User created successfully");
    console.log(savedUser);
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.log("Error in create user controller");
    console.log("ERROR: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};
