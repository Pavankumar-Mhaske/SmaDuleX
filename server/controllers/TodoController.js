/**
 * Importing the todo model to perform CRUD operations
 */
const Todo = require("../models/TodoSchema");
const User = require("../models/UserSchema");

/**
 * createTodo() - Asynchronous Function
 *      - Destructures the input received in req.body.
 *      - Destructures the userid/appwriteId received in req.params.
 *      - Create a todoObj object.
 *      - Validated if title is received.
 *      - Validated if title received is of type string.
 *      - define title property in todoObj.
 *      - Validated if tasks are received then it should be of type array.
 *      - If tasks is valid define it in todoObj.
 *      - Validated if isImportant is of type boolean.
 *      - If isImportant is valid define it in todoObj.
 *      - Validated if userId/appwriteId is received.
 *      - Validated if userId/appwriteId received is of type string.
 *      - Fetch the user in DB using appwriteId
 *      - Validate user exists
 *      - After finding user add his user._id as property in todoObj.
 *      - Creates a new todo document from the validated data. (Asynchronous operation - create())
 *      - Update user todos using the todo._id and save.
 */

exports.createTodo = async (req, res) => {
  try {
    const { title, tasks, isImportant, userId } = req.body;
    const todoObj = {};

    if (!title) {
      throw new Error("Title required, Please pass title to create a todo");
    }
    if (typeof title !== "string") {
      throw new Error("Title should be of type string");
    }
    Object.defineProperty(todoObj, "title", {
      value: title,
      enumerable: true,
    });

    if (tasks && !Array.isArray(tasks)) {
      throw new Error("Tasks should be of type array");
    }

    if (tasks) {
      Object.defineProperty(todoObj, "tasks", {
        value: tasks,
        enumerable: true,
      });
    }

    if (isImportant && typeof isImportant !== "boolean") {
      throw new Error("isImportant should be of type boolean");
    }

    if (isImportant === true || isImportant === false) {
      Object.defineProperty(todoObj, "isImportant", {
        value: isImportant,
        enumerable: true,
      });
    }

    if (!userId) {
      throw new Error("userId required, Please pass userId to create a todo");
    }
    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const user = await User.find({ appwriteId: userId });
    if (!user[0]) {
      throw new Error("User not found in DB");
    }
    Object.defineProperty(todoObj, "userId", {
      value: user[0]._id,
      enumerable: true,
    });

    const todo = await Todo.create(todoObj);

    if (!user[0].todos) {
      user[0].todos = [todo._id];
    } else {
      user[0].todos.push(todo._id);
    }
    await user[0].save();

    res.status(200).json({
      status: "success",
      message: "Todo created successfully",
      data: todo,
      user: user[0],
    });
  } catch (err) {
    console.log("Error in create todo controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in create todo controller",
      message: err.message,
    });
  }
};
