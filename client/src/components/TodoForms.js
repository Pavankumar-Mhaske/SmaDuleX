import { useState, useContext } from "react";
// import {
//   showToastLoading,
//   showToastSuccess,
//   showToastError,
//   Toast,
// } from "./ToastHandler";
import {
  showToastLoading,
  showToastSuccess,
  showToastError,
  Toast,
} from "./HotToastHandler";

// axios
import axios from "axios";

// context
import userContext from "../context/userContext";

// components
// import TitleInput from "./TitleInput";
import TitleInput from "./TitleInputs";
// import TaskInput from "./TaskInput";
import TaskInput from "./TaskInputs";
import TodoButton from "./TodoButton";
// import TodoButton from "./TodoButtons";
import "./styles/TodoForms.css";
import toast from "react-hot-toast";
/**
 * @param  task - Denotes the purpose of the form (create Todo / update Todo).
 * @param  buttonName - Denotes the name of submitting button (Create Todo / Update Todo).
 * @param  todo - used to populate inital values if todo is passed.
 * @param  setMakeRequest - To make DB call and populate todos in todoList once form is submitted.
 * @returns - Form element - Which can be used to update or create a todo.
 */

const TodoForm = ({
  task,
  buttonName,
  todo = "",
  makeRequest,
  setMakeRequest,
  setEditTodo,
}) => {
  /**
   * It is used to pass appwrite Id in DB request parmas
   */
  const { user } = useContext(userContext);

  /**
   * title - To store the title of todo.
   * tasks - Collection of tasks (Array).
   * isImportant - To prioritize a todo.
   */

  const [title, setTitle] = useState(!todo ? "" : todo.title);
  const [tasks, setTasks] = useState(!todo ? [] : todo.tasks);
  const [isImportant, setIsImportant] = useState(
    !todo ? false : todo.isImportant
  );

  /**
   * handleSubmit() - Asynchronous Function
   *                - Used to make server request based on task of the form
   *                - Finally resets the values of all the inputfield and updates makeRequest state
   */

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (task === "create") {
        const toastId = showToastLoading("Adding Todo..."); // show loading toast
        await axios
          .post(`todo/create`, {
            title,
            tasks,
            isImportant,
            userId: user.$id,
          })
          .then((response) => {
            console.log("Response from handleDelete method: ", response);
            showToastSuccess("Todo added successfully!", toastId); // show success toast
          })
          .catch((error) => {
            showToastError(error.message);
            console.log("Error while deleting a todo in handleDelete method");
            console.log("Error: ", error);
          });

        //do something else
      } else {
        const toastId = showToastLoading("Updating Todo...");
        console.log("inside the update todo,userId  todoId is ", todo);
        await axios
          .put(`todo/${user.$id}/${todo._id}`, {
            title,
            tasks,
            isImportant,
          })
          .then((response) => {
            console.log("Response from handleDelete method: ", response);
            // console.log("updatedUser is ", updatedUser);
            showToastSuccess("Todo updated successfully!", toastId); // show success toast
            setEditTodo(false);
          })
          .catch((error) => {
            showToastError(error.message);
            console.log("Error while deleting a todo in handleDelete method");
            console.log("Error: ", error);
          })
          .finally(() => {
            document.body.style.overflow = "auto";
          });
        // console.log("updatedUser is ", updatedUser);
        // setEditTodo(false);
        // document.body.style.overflow = "auto";
      }
    } catch (error) {
      if (task === "create") {
        showToastError(error.message);
        // add alert
        console.log(`
        Error while creating a new todo in todoForm handleSubmit
        and the error : ${error}`);
      } else {
        // add alert
        console.log(`
        Error whileupdating a todo in todoForm handleSubmit
        and the error : ${error}`);
      }
    } finally {
      setTitle("");
      setTasks([]);
      setIsImportant(false);
      setMakeRequest(!makeRequest);
    }
  };

  /**
   * Inverse the value of isImportant state
   */
  const handleHighlightTodo = () => {
    if (isImportant) {
      const toastId = showToastLoading("Unhighlighted Todo...");
      setIsImportant(!isImportant);
      showToastSuccess("Todo is unhighlighted!", toastId);
    } else {
      const toastId = showToastLoading("Highlighting Todo...");
      setIsImportant(!isImportant);
      showToastSuccess("Todo is highlighted!", toastId);
    }
    // setIsImportant(!isImportant);
  };

  return (
    // Form containing todo input fields
    <div className="formblock glow w-[95%] sm:w-5/6 md:w-full m-auto">
      <form
        className=" flex flex-col w-[100%] sm:w-6/6 md:w-full m-auto "
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" p-3 m-4 md:p-4 md:m-6 lg:m-0">
          <div className="w-full flex flex-col lg:flex-row p-0 lg:p-2 mb-4 lg:mb-0">
            <div className="w-full lg:w-1/2">
              {/* Title Input */}
              <TitleInput title={title} setTitle={setTitle} />

              {/* Checkbox for marking a todo as important */}
              <label
                htmlFor="isImportant"
                className=" block  mt-10 text-lg  md:text-xl  text-violet-800  font-medium"
              >
                <input
                  className={`todoform__checkbox
                p-3  -mt-1  focus:ring-0  border-2  border-violet-800  text-violet-800
                transition-transform duration-300
                hover:scale-110
                hover:bg-violet-200
                rounded
                mr-2
          `}
                  type="checkbox"
                  name="isImportant"
                  id="isImportant"
                  checked={isImportant}
                  value={isImportant}
                  onChange={handleHighlightTodo}
                />
                Highlight Todo
              </label>
            </div>

            <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
              {/* Input for adding tasks */}
              <TaskInput tasks={tasks} setTasks={setTasks} />
            </div>
          </div>
          {/* Button for Creading Todo (Submitting the data) */}
          <TodoButton name={buttonName} />
          {/* // button for reseting data. */}
        </div>
      </form>
      {/* Render the ToastContainer */}
      <Toast />
    </div>
  );
};

export default TodoForm;
