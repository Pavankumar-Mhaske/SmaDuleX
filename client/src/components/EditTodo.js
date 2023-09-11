import React from "react";
// import components
import TodoForm from "./TodoForms";

// import {useNavigate} from "react-router-dom";

/**
 *
 * @param todo - Todo Object to fill initial values.
 * @param editTodo - To make a rendering decision (State).
 * @param setEditTodo - function (Update State).
 * @returns Todo Updation Form with values populated.
 */

const EditTodo = ({
  todo,
  editTodoc,
  setEditTodo,
  makeRequest,
  setMakeRequest,
}) => {
  if (!editTodoc) return "";
  return (
    <div
      className={`w-full h-screen absolute top-0 left-0 border border-green-500  `}
      // style={{ background: "rgba(0, 0, 0, 1)" }}
      onClick={() => {
        setEditTodo(false);
        document.body.style.overflow = "auto";
      }}
    >
      <div className="w-11/12 md:w-2/3 flex flex-col py-10 m-auto relative top-[65px] md:top-1/5">
        <button className="w-[95%] sm:w-5/6 md:w-full mx-auto mt-10 py-2 px-4 bg-black   z-10 font-bold text-xl text-white rounded-t">
          Cancel
        </button>
        <TodoForm
          task="update"
          buttonName="Update Todo"
          todo={todo}
          makeRequest={makeRequest}
          setMakeRequest={setMakeRequest}
          setEditTodo={setEditTodo}
        />
      </div>
    </div>
  );
};

export default EditTodo;
