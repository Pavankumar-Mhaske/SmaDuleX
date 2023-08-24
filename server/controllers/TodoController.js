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
    Object.defineProperty(todoObj, "user", {
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
  } catch (error) {
    console.log("Error in create todo controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in create todo controller",
      message: error.message,
    });
  }
};

/**
 * getTodos() - Asynchronous Function - ***ADMIN ROUTE***
 *      - Fetches all the todos from database (Asynchronous operation - find())
 */

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});

    res.status(200).json({
      status: "success",
      message: "Todos fetched successfully",
      data: todos,
    });
  } catch (error) {
    console.log("Error in get todos controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in get todos controller",
      message: error.message,
    });
  }
};

/**
 * getTodo() - Asynchronous Function
 *      - Destructures the input received in req.params.
 *      - Validated if todoId is received.
 *      - Validated if todoId received is of type string.
 *      - Fetches the todo with respect to todoId. (Asynchronous operation - findById())
 *      - Fetches the user with respect to userId/appwriteId. (Asynchronous operation - find())
 *      - validate if user and todo exist
 *      - validate the ownership of user and todo
 */

/**
 *
 * some changes in the code are still expected
 */
exports.getTodo = async (req, res) => {
  try {
    const { todoId, userId } = req.params;

    if (!todoId) {
      throw new Error("todoId required, Please pass todoId to fetch a todo");
    }

    if (typeof todoId !== "string") {
      throw new Error("todoId should be of type string");
    }

    if (!userId) {
      throw new Error("userId required, Please pass userId to fetch a user");
    }

    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const todo = await Todo.findById(todoId);
    const user = await User.find({ appwriteId: userId });

    if (!todo) {
      throw new Error("Todo not found in DB");
    }

    if (!user) {
      throw new Error("User not found in DB");
    }
    /**mistack in the previous code */
    if (todo.user.equals(user[0]._id) === false) {
      throw new Error("User is not the owner of todo");
    }

    res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
    });
  } catch (error) {
    console.log("Error in get todo controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in get todo controller",
      message: error.message,
    });
  }
};

/**
 * editTodo() - Asynchronous Function
 *      - Destructures the input received in req.params.
 *      - Validated if todoId is received.
 *      - Validated if todoId received is of type string.
 *      - Validated if userId/appwriteId is received.
 *      - Validated if userId/appwriteId received is of type string.
 *      - Fetch the todo using todoID - (Asynchronous operation - findByID())
 *      - Fetch the user using userId/appwriteId - (Asynchronous operation - find())
 *      - Validate todo exists
 *      - Validate user exists
 *      - Validate if todo belongs to user
 *      - Destructures the input received in req.body.
 *      - Validated if title has been received and is of type string.
 *      - If title is valid update in todo fetched.
 *      - Validated if tasks are received then it should be of type array.
 *      - If tasks is valid update in todo fetched.
 *      - Validated if isImportant is received and is of type boolean.
 *      - If isImportant is valid update in todo fetched.
 *      - Validated if isCompleted is received and is of type boolean.
 *      - If isCompleted is valid update in todo fetched.
 *      - Save the changes made to todo - (Asynchronous operation - save())
 */

exports.editTodo = async (req, res) => {
  try {
    const { userId, todoId } = req.params;

    if (!todoId) {
      throw new Error("todoId required, Please pass todoId to edit a todo");
    }

    if (typeof todoId !== "string") {
      throw new Error("todoId should be of type string");
    }

    if (!userId) {
      throw new Error("userId required, Please pass userId to edit a todo");
    }

    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const todo = await Todo.findById(todoId.trim());
    const user = await User.find({ appwriteId: userId.trim() });

    console.log(todo);
    console.log(user);
    // console.log("user id is ", user[0]._id);

    if (!todo) {
      throw new Error("Todo not found in DB");
    }

    if (!user[0]) {
      throw new Error("User not found in DB");
    }

    if (todo.user.equals(user[0]._id) === false) {
      throw new Error("User is not the owner of todo");
    }

    const { title, tasks, isImportant, isCompleted } = req.body;

    console.log(`
    title is ", title
    tasks is ", tasks
    isImportant is ", isImportant
    isCompleted is ", isCompleted`);

    if (title && typeof title !== "string") {
      throw new Error("title should be of type string");
    }

    if (title) {
      todo.title = title;
    }

    if (tasks && !Array.isArray(tasks)) {
      throw new Error("tasks should be of type array");
    }

    if (tasks) {
      todo.tasks = tasks;
    }

    if (isImportant && typeof isImportant !== "boolean") {
      throw new Error("isImportant should be of type boolean");
    }

    if (isImportant === true || isImportant === false) {
      todo.isImportant = isImportant;
    }

    if (isCompleted && typeof isCompleted !== "boolean") {
      throw new Error("isCompleted should be of type boolean");
    }

    if (isCompleted === true || isCompleted === false) {
      todo.isCompleted = isCompleted;
    }

    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    console.log("Error in edit todo controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in edit todo controller",
      message: error.message,
    });
  }
};

/**
 * deleteTodo() - Asynchronous Function
 *      - Destructures the input received in req.params.
 *      - Validated if userId/appwriteId is received.
 *      - Validated if userId/appwriteId received is of type string.
 *      - Validated if todoId is received.
 *      - Validated if todoId received is of type string.
 *      - Fetch the todo using todoID - (Asynchronous operation - findByIDAndDelete())
 *      - Fetch the user using userId/appwriteId - (Asynchronous operation - find())
 *      - Validate todo exists
 *      - Validate user exists
 *      - Filter the user todos collection. Filter all the todos which was not deleted and store it to user todos
 *      - Save the user (Asynchronous operation - save())
 */

exports.deleteTodo = async (req, res) => {
  try {
    const { todoId, userId } = req.params;

    if (!todoId) {
      throw new Error("todoId required, Please pass todoId to delete a todo");
    }

    if (typeof todoId !== "string") {
      throw new Error("todoId should be of type string");
    }

    if (!userId) {
      throw new Error("userId required, Please pass userId to delete a todo");
    }

    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    const todo = await Todo.findByIdAndDelete(todoId.trim());
    const user = await User.find({ appwriteId: userId.trim() });

    if (!todo) {
      throw new Error("Todo not found in DB");
    }

    if (!user[0]) {
      throw new Error("User not found in DB");
    }

    if (todo.user.equals(user[0]._id) === false) {
      throw new Error("User is not the owner of todo");
    }

    /**
     Filter and update the 'todos' array of the first user.
    Remove a specific to-do item identified by 'todoId' from the array.
    The 'filter' function retains to-do items where the comparison of each item's 'equals' method with 'todoId' is false.
    The updated 'todos' array is assigned back to the 'todos' property of the first user object.
*/
    user[0].todos = user[0].todos.filter(
      (todoObj) => todoObj.equals(todoId) === false
    );

    await user[0].save();

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      deleteTodo: todo,
    });
  } catch (error) {
    console.log("Error in delete todo controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in delete todo controller",
      message: error.message,
    });
  }
};

/**
 * searchTodos() - Asynchronous Function
 *      - Destructures the input received in req.query.
 *      - Validated if userId/appwriteId is received.
 *      - Validated if userId/appwriteId received is of type string.
 *      - Validated if search is received.
 *      - Validated if search received is of type string.
 *      - Fetch the user using userId/appwriteId - (Asynchronous operation - find())
 *      - Validate if user exists in DB
 *      - Finds the todos and tasks which include the search value using regex and $or operation.
 *      - Validate if todos and tasks returned falsy values.
 *      - Only filter the todos whose user reference matches with the user we fetched
 */

exports.searchTodos = async (req, res) => {
  try {
    const { userId, search } = req.query;

    if (!userId) {
      throw new Error("userId required, Please pass userId to search a todo");
    }

    if (typeof userId !== "string") {
      throw new Error("userId should be of type string");
    }

    if (!search) {
      throw new Error("search required, Please pass 'search' to search a todo");
    }

    if (typeof search !== "string") {
      throw new Error("search should be of type string");
    }

    const user = await User.find({ appwriteId: userId.trim() });

    if (!user) {
      throw new Error("User not found in DB");
    }

    /**
     * 
     * 
      If the search pattern is static and not dynamically generated, this approach might be preferable.

        const unfilteredTodos = await Todo.find({
        $or: [
        { title: { $regex: search, $options: "i" } },
        { tasks: { $regex: search, $options: "i" } },
        ],
       });

       but here we are using dynamic search pattern(search comming dynamically) so we are using the below approach
     */

    const unfilteredTodos = await Todo.find({
      $or: [
        { title: new RegExp(search, "i") },
        { tasks: new RegExp(search, "i") },
      ],
    });

    if (!unfilteredTodos) {
      throw new Error("Searched Todo or Tasks not found in DB");
    }

    const filteredTodos = unfilteredTodos.filter((todo) =>
      todo.user.equals(user[0]._id)
    );

    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      data: filteredTodos,
    });
  } catch (error) {
    console.log("Error in search todos controller");
    console.log("ERROR: ", error);
    res.status(400).json({
      success: false,
      messageSrc: "Error in search todos controller",
      message: error.message,
    });
  }
};
