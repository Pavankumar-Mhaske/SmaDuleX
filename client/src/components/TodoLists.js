import { useState, useEffect, useContext, useCallback } from "react";

// axios
import axios from "axios";

// context
import userContext from "../context/userContext";

// images
import searchIcon from "../assets/icons/search.png";
import closeIcon from "../assets/icons/close.png";

// components
import Todo from "./Todo";
import "../pages/styles/customStyles.css";
import "./styles/TodoLists.css";
/**
 * @param setMakeRequest - To make DB call and populate todos in todoList. When we delete, update todo.
 * @returns Collection of todos received from server request.
 */

const TodoList = ({ makeRequest, setMakeRequest }) => {
  /**
   * It is used to pass appwrite Id in DB request parmas
   */
  const { user } = useContext(userContext);

  /**
   * To store the todos received from a server request.
   */
  const [todos, setTodos] = useState([]);

  /**
   * To store the search string.
   */
  const [search, setSearch] = useState("");

  /**
   * To display cancel button after searching todo.
   */
  const [closeSearch, setCloseSearch] = useState(false);

  /**
   * To display cancel button after searching todo.
   */
  const getTodos = useCallback(async () => {
    try {
      // console.log("type of setMakeRequest", typeof setMakeRequest);
      console.log("inside the gettodos method in");
      const response = await axios.get(`/user/todos?userId=${user.$id}`);
      // const response = await axios.get("/user/todos", {
      //   params: { userId: user.$id },
      // });
      console.log("just before the response");
      const { data } = response;
      console.log(data);

      if (data && data.user) {
        const todos = data.user;
        console.log(todos);
        if (todos.length > 0) {
          const response = todos.sort((a, b) => b.isImportant - a.isImportant);

          console.log(response);
          setTodos([...response]);
        } else {
          setTodos([]);
          console.log("User has no todos.");
        }
        //  return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        console.log("Data or required properties are undefined.");
      }
    } catch (error) {
      console.log("Error while fetching todos in getTodos method");
      console.log("Error: ", error);
    }
  }, [user.$id]);

  /**
   * handleSearch() - Asynchronous Function
   *            - Prevents the default action of event
   *            - Trims the search value
   *            - if search value is falsy it returns without proceeding
   *            - Fetches the user todos which have title or tasks like the search value passed .
   *            - Sorts the todo based on priority
   *            - Sets the closeSearch state to true stating to render the cancel button
   */

  // const handleSearch = async (e) => {

  const handleSearch = useCallback(async () => {
    try {
      // e.preventDefault();
      setSearch(search.trim());

      if (!search) return;
      const response = await axios.get("/todo/search", {
        params: { userId: user.$id, search },
      });

      const { data } = response.data;
      console.log("data inside the handlesearch", data);
      // const result = todos.sort((a, b) => b.isImportant - a.isImportant);
      setTodos([...data]);
      // console.log("todos inside the handlesearch", todos);
      setCloseSearch(true);
    } catch (error) {
      console.log("Error while fetching search todos in getTodos method");
      console.log("Error: ", error);
    }
  }, [search, user.$id]);

  useEffect(() => {
    // Fetch filtered todos only if there's a search query
    if (search) {
      handleSearch();
    }
  }, [search, handleSearch]);

  // Effect to update filtered todos when search changes
  // useEffect(() => {
  //   handleSearch();
  // }, [search]);

  /**
   *  @param - sort: takes the string value to know what parameter to sort.
   * handleSort() - Asynchronous Function
   *            - Store todos in a variable sortTodos .
   *            - Validate if sort is createdAt or title. If so sort it in ascending order.
   *            - Validate if sort is updatedAt or isImportant. If so sort it in descending order.
   *            - Sets the todos state with sortTodos values.
   */

  const handleSort = (sort) => {
    const sortTodos = todos;

    if (
      sort !== "isImportant" &&
      sort !== "updatedAt" &&
      sort !== "isCompleted"
    ) {
      sortTodos.sort((a, b) => {
        if (a[sort] < b[sort]) return -1;
        if (a[sort] > b[sort]) return 1;
        return 0;
      });
    } else {
      sortTodos.sort((a, b) => {
        if (a[sort] < b[sort]) return 1;
        if (a[sort] > b[sort]) return -1;
        return 0;
      });
    }
    setTodos([...sortTodos]);
  };

  useEffect(() => {
    getTodos();
    setCloseSearch(false);
  }, [getTodos, makeRequest]);

  return (
    <div className="todolist">
      <div className="flex flex-wrap items-center justify-between my-4 w-full sm:w-2/3 m-auto">
        {closeSearch ? (
          <button
            className="border border-red-700 rounded p-2 ml-6 sm:ml-3 md:p-3 my-4 lg:my-0"
            type="button"
            onClick={(e) => {
              setCloseSearch(false);
              setSearch("");
              getTodos();
            }}
          >
            <img src={closeIcon} alt="cancel search" width="20" />
          </button>
        ) : (
          <div></div>
        )}

        <div className=" order-2 ml-6 sm:ml-2 my-4 lg:order-none md:ml-0">
          <label htmlFor="sort">
            <span className="font-medium text-violet-800">Sort by: </span>
            <select
              defaultValue="isImportant"
              onChange={(event) => {
                handleSort(event.target.value);
              }}
              className="TodoList_Selector border-violet-500 rounded text-violet-800 font-semibold py-0.5"
            >
              <option value="isImportant" className="select_options px-2">
                Priority
              </option>
              <option value="isCompleted" className="select_options px-2">
                Completed
              </option>
              <option value="createdAt" className="select_options px-2">
                Created Date
              </option>
              <option value="updatedAt" className="select_options px-2">
                Updated Date
              </option>
              <option value="title" className="select_options px-2">
                Alphabetical
              </option>
            </select>
          </label>
        </div>
        <div className="border border-violet-700 rounded flex items-center w-full mx-5 sm:mx-2 lg:mx-3 lg:w-7/12 lg:mx-0 xl:w-5/12">
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            required
            placeholder="Search for your todos / tasks"
            className="TodoList_inputs w-full  border-r-transparent  border-none  rounded-l text-sm  lg:text-lg  placeholder-violet-700  leading-4 lg:leading-7  py-2  text-violet-800  font-medium  outline-none  focus:ring-0 border-r-0 "
          />
          <button
            type="button"
            onClick={() => {
              if (search.trim() === "") {
                setCloseSearch(false);
                getTodos();
              } else {
                handleSearch();
              }
            }}
          >
            <img
              src={searchIcon}
              alt="search button"
              className="border-none rounded-r p-[5.25px] lg:p-3 border-l-0"
            />
          </button>
        </div>
      </div>
      <div className="border-2 w-[95%] sm:w-2/3 mx-auto mb-12 pr-2 pb-1 rounded">
        {todos.length === 0 ? (
          !closeSearch ? (
            <p className="text-2xl font-semibold text-violet-800 text-center p-2">
              Your have no todos left...!
            </p>
          ) : (
            <p className="text-sm md:text-2xl font-semibold text-violet-800 text-center p-2">
              No todos or tasks available with respect to your search
            </p>
          )
        ) : (
          todos.map((todo) => (
            <Todo
              todo={todo}
              makeRequest={makeRequest}
              setMakeRequest={setMakeRequest}
              key={todo._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
