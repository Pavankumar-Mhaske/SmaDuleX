/**
 * Importing mongoose package
 */
const mongoose = require("mongoose");

/**
 *  Destructuring MONGO_URL from .env file
 */
const { MONGO_URL } = process.env;

/**
 * Exporting
 * dbConnect - Database connection
 *      - on successfull connection logs the success message and hostname
 *      - on connection failure logs the failure message, error object and exits the process
 */

// exports.dbConnect = () => {
//   mongoose
//     .connect(MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then((conn) => {
//       console.log(
//         "Congratulations! ..... Database connected successfully....."
//       );
//       console.log(`Host name : ${conn.connection.host}`);
//     })
//     .catch((error) => {
//       console.log("Database connection failed!");
//       console.log(`DB connection Error: ${error}`);
//       process.exit(1);
//     });
// };

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on("error", (error) => {
      console.log("Database connection failed!");
      console.log(`DB connection Error: ${error}`);
      reject(error);
      process.exit(1);
    });

    db.once("open", () => {
      console.log(
        " Database connected successfully....."
      );
      console.log(`Host name : ${db.host}`);
      resolve();
    });
  });
};

module.exports = { dbConnect };
