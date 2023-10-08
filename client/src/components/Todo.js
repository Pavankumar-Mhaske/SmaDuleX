import { useCallback, useContext, useEffect, useState } from "react";

// import axios
import axios from "axios";

// import context
import userContext from "../context/userContext";

import "../pages/styles/customStyles.css";
// import images
/**
 *
 * bin
 * edit
 * start
 * starFill
 * check
 * ckecked
 */

import bin from "../assets/icons/delete.png";
import edit from "../assets/icons/edit.png";
import star from "../assets/icons/star.png";
import starFill from "../assets/icons/starFill.png";
import check from "../assets/icons/redCheck.png";
import checked from "../assets/icons/check.png";

// import components
import TodoModal from "./TodoModal";
import EditTodo from "./EditTodo";
import DeleteModal from "./DeleteModal";

/**
 * @param todo - Todo Object to populate values.
 * @returns A Todo element.
 */

const Todo = ({ todo, makeRequest, setMakeRequest }) => {
  // console.log("type of setMakeRequest", typeof setMakeRequest);
  // console.log("Inside Todo.js todo is ", todo);
  /**
   * It is used to pass appwrite Id in DB request parmas
   */
  const { user } = useContext(userContext);

  /**
   * Used to display Todo Modal (tasks) when todo title is clicked
   */

  // const [showTodoModal, setShowTodoModal] = useState(false);
  const [popup, setPopup] = useState(false); // for todo modal

  /**
   * Used to display EditForm Modal when todo edit button is clicked
   */

  // const [showEditModal, setShowEditModal] = useState(false);
  const [editTodoc, setEditTodo] = useState(false); // for edit modal

  /**
   * Used to display EditForm Modal when todo edit button is clicked
   */

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(false); // for delete modal

  /**
   * @param todo - stores todo object which has to update its isImportant field
   * handleHighlight() - Prevent default behaviour of form submission (reloading).
   *                   - Destructure id and isImportant field from todo
   *                   - Inverse the value of isImportant
   *                   - Make PUT request to database to update todo value.
   *                   - Updates makeRequest state
   */

  const handleHighlight = useCallback(
    async (event, todo) => {
      try {
        // prevent default behaviour of form submission (reloading)
        console.log("inside the handleHighlight");
        console.log("todo is ", todo);

        event.preventDefault();
        let { _id, isImportant } = todo;

        console.log("todo is ", todo);
        isImportant = !isImportant;
        console.log(
          `before the put request,${user.$id} ${_id}, ${isImportant}`
        );
        // /api/todo/${user.uid}/${_id}

        await axios
          .put(`/todo/${user.$id}/${_id}`, {
            isImportant,
          })
          .then((response) => {
            console.log("before the setMakeRequest");
            console.log(response);
            setMakeRequest(!makeRequest);
          })
          .catch((error) => {
            console.log(
              "Error while updating a todo in handleHightlight method"
            );
            console.log("Error: ", error);
          });
      } catch (error) {
        console.log("Error while updating a todo in handleHightlight method");
        console.log("Error: ", error);
      }
    },
    [makeRequest, setMakeRequest, user.$id]
  );

  useEffect(() => {
    console.log("inside the useeffect of todo");
    handleHighlight();
  }, [handleHighlight]);
  /**
   * @param todo - stores todo object which has to update its isImportant field
   * handleCompleted() - Prevent default behaviour of form submission (reloading).
   *                   - Destructure id and isCompleted field from todo
   *                   - Inverse the value of isCompleted
   *                   - Make PUT request to database to update todo value.
   *                   - Updates makeRequest state
   */

  const handleCompleted = useCallback(
    async (event, todo) => {
      try {
        // prevent default behaviour of form submission (reloading)
        event.preventDefault();
        let { _id, isCompleted } = todo;
        isCompleted = !isCompleted;
        // /api/todo/${user.uid}/${_id}
        await axios
          .put(`/todo/${user.$id}/${_id}`, { isCompleted })
          .then((response) => {
            console.log("before the setMakeRequest");
            setMakeRequest(!makeRequest);
          })
          .catch((error) => {
            console.log(
              " DB Call - Error while updating a todo in handleCompleted method"
            );
            console.log("Error: ", error);
          });
      } catch (error) {
        console.log("Error while updating a todo in handleCompleted method");
        console.log("Error: ", error);
      }
    },
    [makeRequest, setMakeRequest, user.$id]
  );

  useEffect(() => {
    console.log("inside the useeffect of todo");
    handleCompleted();
  }, [handleCompleted]);

  return (
    <>
      <div className="flex my-2 justify-center">
        <button
          className={`
          p-2
          border-2 
          border-violet-800
          rounded 
          active:bg-violet-100 
          mx-3
          transition-transform duration-300
          hover:bg-yellow-400
          hover:scale-110
          
          rounded-15
          ${todo.isImportant ? "hilight" : "nothilight"} 
        `}
          onClick={(e) => handleHighlight(e, todo)}
        >
          <img
            src={todo.isImportant ? starFill : star}
            alt="Star Todo"
            className={`bg-transparent`}
          />
        </button>
        <p
          className={`todotitles w-5/6  border-2  p-1 md:p-2  rounded text-[14px] sm:text-[16px] md:text-lg  lg:text-xl  font-medium break-all 
          bg-${todo.isCompleted ? "green" : "gray"}-100
          hover:bg-${todo.isCompleted ? "green" : "gray"}-200
          hover:border-${todo.isCompleted ? "green" : "gray"}-300
          text-${todo.isCompleted ? "green-600" : "gray-800"}-700
          
          `}
          onClick={() => setPopup(!popup)}
          // add some more properties here....
        >
          {todo.title}
        </p>

        <button
          className={` 
                    p-2 border-2
                    border-${todo.isCompleted ? "green" : "red"}-500
                    hover:bg-${todo.isCompleted ? "green" : "red"}-100
                    rounded  
                    active:bg-violet-100 ml-3 
                    ml-3
                    transition-transform duration-300
                    hover:scale-110
                    ${
                      todo.isCompleted
                        ? "hover:bg-red-700 border-green-700"
                        : "hover:bg-green-700 border-red-700"
                    }
                    
                  `}
          onClick={(e) => handleCompleted(e, todo)}
        >
          <img src={todo.isCompleted ? checked : check} alt="Star Todo" />
        </button>
        <button
          className={`
                      p-2 border-2 border-blue-700 rounded mx-2 hover:bg-blue-200
                      transition-transform duration-300
                      hover:scale-110
                      hover:bg-blue-200
                    `}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "auto",
            });
            document.body.style.overflow = "hidden";
            setEditTodo(true);
          }}
        >
          <img src={edit} alt="Edit Todo" />
        </button>
        <button
          className={`
          p-2 border-2 border-red-500 rounded  
          transition-transform duration-300
          hover:scale-110
          hover:bg-red-200`}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "auto",
            });
            document.body.style.overflow = "hidden";
            setDeleteTodo(true);
          }}
        >
          <img src={bin} alt="Delete Todo" className="w-6" />
        </button>
      </div>

      <TodoModal
        popup={popup}
        todoId={todo._id}
        makeRequest={makeRequest}
        created={todo.createdAt}
        updated={todo.updatedAt}
      />
      <EditTodo
        editTodoc={editTodoc}
        setEditTodo={setEditTodo}
        todo={todo}
        makeRequest={makeRequest}
        setMakeRequest={setMakeRequest}
      />
      <DeleteModal
        deleteTodo={deleteTodo}
        setDeleteTodo={setDeleteTodo}
        todo={todo}
        makeRequest={makeRequest}
        setMakeRequest={setMakeRequest}
      />
    </>
  );
};

export default Todo;
