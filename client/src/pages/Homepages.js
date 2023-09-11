import { useContext, useEffect, useState } from "react";

// router
import { Navigate } from "react-router-dom";

// context
import userContext from "../context/userContext";

// components
import TodoForm from "../components/TodoForms";
import TodoList from "../components/TodoLists";
import EventList from "../components/Events";
import "./styles/HomePages.css";

const Homepage = () => {
  /**
   * Used to make database calls only when you update, delete, create todos. It is passed as parameters to
   * couple of components
   */
  const [makeRequest, setMakeRequest] = useState(false);

  // console.log("type of setMakeRequest", typeof setMakeRequest);
  /**
   * Used to display homepage only if user is logged in else redirect to login page.
   */
  const { user } = useContext(userContext);

  if (user) {
    return (
      <div className="homepagePro">
        {/* <div className="hbig-ball-1"></div>
        <div className="hbig-ball-2"></div>
        <div className="hbig-ball-3"></div>
        <div className="hball-1"></div>
        <div className="hball-2"></div>
        <div className="hball-3"></div>
        <div className="hball-4"></div>
        <div className="hball-5"></div> */}
        <h1 className="header_createTodos my-6 text-2xl md:text-4xl font-medium text-violet-800 text-center">
          Create New Todo!
        </h1>

        <div className="  w-full md:w-2/3 mx-auto">
          <TodoForm
            task="create"
            buttonName="Create Todo"
            makeRequest={makeRequest}
            setMakeRequest={setMakeRequest}
          />
        </div>
        <h1 className="header_todos mt-12 mb-6 text-2xl md:text-4xl font-medium text-violet-800 text-center">
          Your Todos!
        </h1>
        <TodoList makeRequest={makeRequest} setMakeRequest={setMakeRequest} />

        <div className="w-[98%] sm:w-5/6 md:w-full">
          <EventList  />
        </div>
      </div>
    );
  }
  return <Navigate to="/login" />;
  // return <Navigate to="/home" />;
};

export default Homepage;
