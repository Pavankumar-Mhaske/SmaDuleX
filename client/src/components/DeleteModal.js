import { useContext } from "react";

// import axios
import axios from "axios";

// import context
import userContext from "../context/userContext";

import {
  showToastLoading,
  showToastSuccess,
  showToastError,
  Toast,
} from "./HotToastHandler";

const DeleteModal = ({
  deleteTodo,
  setDeleteTodo,
  todo,
  makeRequest,
  setMakeRequest,
}) => {
  const { user } = useContext(userContext);
  /**
   * @param todoId - ._id value of a todo .
   * handleDelete() - Asynchronous Function (Server Request).
   *                - Deletes user's todo stored in database based on id value of todo.
   *                - Updates makeRequest state
   */

  const handleDelete = async (event, todoId) => {
    try {
      event.preventDefault();
      // /api/todo/${user._id}/${todoId}
      const toastId = showToastLoading("Deleting Todo..."); // show loading toast
      axios
        .delete(`/todo/${user.$id}/${todoId}`)
        .then((response) => {
          console.log("Response from handleDelete method: ", response);
          setMakeRequest(!makeRequest);
          setDeleteTodo(!deleteTodo);

          showToastSuccess("Todo deleted successfully!", toastId); // show success toast
        })
        .catch((error) => {
          showToastError(error.message);
          console.log("Error while deleting a todo in handleDelete method");
          console.log("Error: ", error);
        })
        .finally(() => {
          document.body.style.overflow = "auto";
        });
    } catch (error) {
      showToastError(error.message);
      console.log("Error while deleting a todo in handleDelete method");
      console.log("Error: ", error);
    }
  };

  if (!deleteTodo) return "";
  return (
    <div
      className={`w-full h-screen absolute top-0 left-0 flex justify-center items-center`}
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={() => {
        setDeleteTodo(!deleteTodo);
        //  setDeleteTodo(false)
        document.body.style.overflow = "auto";
      }}
    >
      <div
        className="bg-white w-11/12 md:w-1/4 h-2/5 md:h-2/5 rounded-xl flex justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col justify-center gap-3">
          <p className="px-2 py-1 font-medium text-red-500 w-5/6 mx-auto text-lg">
            Are you sure you want to delete the todo?
          </p>
          <p className="w-5/6 border-2 mx-auto text-center p-2 font-semibold rounded"></p>
          <button
            className=" w-5/6  bg-gray-200  font-semibold  tracking-wide  border-2  mx-auto  p-1  rounded "
            onClick={() => {
              setDeleteTodo(!deleteTodo);
              document.body.style.overflow = "auto";
            }}
          >
            Cancel
          </button>

          <button
            className=" w-5/6  bg-red-500  text-white  font-semibold  tracking-wide  border-2  border-red-500  mx-auto  p-1  rounded "
            onClick={(event) => handleDelete(event, todo._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <Toast />
    </div>
  );
};

export default DeleteModal;
