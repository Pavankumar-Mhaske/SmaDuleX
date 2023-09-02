// import useState and useContext hooks
import { useState, useContext, useCallback, useEffect } from "react";

// appwrite
import account from "../config/appwriteConfig";

// context
import userContext from "../context/userContext";

// images
import logo from "../assets/logo.png";
import passwordHide from "../assets/icons/hidden.png";
import passwordVisible from "../assets/icons/visible.png";

// router
import { Navigate } from "react-router-dom";

// components
import TodoButton from "../components/TodoButton";

const LoginPage = () => {
  /**
   * It is used to redirect user to homepage once the user logins into application using createEmailSession
   * service of appwrite.
   */
  const { user, setUser } = useContext(userContext);

  /**
   * Used to store user email and password from input fields and pass them to appwrite service.
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bothFieldsPresent, setBothFieldsPresent] = useState(false);

  /**
   * handleLogin(e) - Asynchronous Function
   *      - Prevents the default reload of the webpage on submission of form.
   *      - Use appwrite createEmailSession service and pass the user email and password. If cobination
   *        is valid then it creates a session key-value pair in cookie and also store it in localstorage.
   *      - Navigate to homepage on successfull login
   *      - We set the Logged in user to userContext
   */

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const appwriteUser = await account.createEmailSession(email, password);
      console.log(appwriteUser);
      console.log("USER LOGGEDIN SUCCESSFULLY IN APPWRITE");
      setUser(await account.get());
    } catch (error) {
      console.log("Error in handle login appwrite service");
      console.log("Error Message: ", error.message);
    }
  };

  /**
   * handleChange() -
   * @param e - event
   * @param stateUpdate - takes a state updation function to update relevant state
   *      - This function updates the state based on the state updation function passed hence follows DRY.
   */

  const handleChange = useCallback(() => {
    console.log(email, password);
    if (email && password) {
      setBothFieldsPresent(true);
    } else {
      setBothFieldsPresent(false);
    }
  }, [email, password]);

  useEffect(() => {
    handleChange();
  }, [handleChange, email, password]);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    // After 3 seconds, toggle the password visibility back
    setTimeout(() => {
      setShowPassword(false);
    }, 1000); // 3000 milliseconds = 3 seconds
  };

  /**  
   * will replace the current entry in the navigation history with the new route, 
      preventing the user from going back to the previous page using the browser's navigation controls.
   */

  /**   
   <Navigate replace={true} to="/" />;
                but
   * if you're using a newer version of React Router
        In this case, the prop is implicitly set to true
  */

  if (user) return <Navigate to="/" />;

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4">
      <img src={logo} alt="TodoApp" className="w-2/3 md:w-1/2 mb-10" />
      <form
        className="w-full max-w-md border border-violet-500 rounded py-4 px-6"
        onSubmit={(e) => handleLogin(e)}
      >
        <div className="mb-4">
          <input
            className="w-full border border-violet-800 rounded py-2 px-4 text-lg focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700"
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="relative mb-4">
          <input
            className="w-full border border-violet-800 rounded py-2 px-4 text-lg focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 pr-12"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button type="button" onClick={handlePasswordVisibility}>
              {showPassword ? (
                <img
                  src={passwordHide}
                  alt="passwordHide"
                  className="w-6 h-6"
                />
              ) : (
                <img
                  src={passwordVisible}
                  alt="passwordVisible"
                  className="w-6 h-6"
                />
              )}
            </button>
          </div>
        </div>
        <TodoButton name="Login" passwordMatched={bothFieldsPresent} />
      </form>
      
    </div>
  );
};

export default LoginPage;
