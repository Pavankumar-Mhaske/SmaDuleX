import React from "react";

import { useState, useContext, useCallback, useEffect } from "react";

// appwrite
import account from "../config/appwriteConfig";

// context
import userContext from "../context/userContext";

// router
import { Navigate, useNavigate } from "react-router-dom";

// components
// import TodoButton from "../components/TodoButton";
import TodoButton from "../components/TodoButtons";
// importing Css file.
import "./styles/LoginPages.css";

// importing icons from react-ionicons
// import { Mail,LockClosed,Eye,EyeOff } from "react-ionicons";

const LoginPages = () => {
  /**
   * It is used to redirect user to homepage once the user logins into application using createEmailSession
   * service of appwrite.
   */
  const { user, setUser } = useContext(userContext);

  /**
   * Used to store user email and password from input fields and pass them to appwrite service.
   */
  const [email, setEmail] = useState("me@gmail.com");
  const [password, setPassword] = useState("Pavan@2020");
  // const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bothFieldsPresent, setBothFieldsPresent] = useState(false);
  // const [passwordFocus, setPasswordFocus] = useState(false);

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

  const navigate = useNavigate();
  const navigateToWelcome = () => {
    navigate("/"); // Replace '/welcome' with the actual URL of your welcome page
  };

  if (user) return <Navigate to="/home" />;
  return (
    <section className="w-screen">
      <div className="login-box">
        <form id="login-form" action="" onSubmit={(e) => handleLogin(e)}>
          <h2>Login</h2>
          <div className="input-box">
            <span className="icon">
              {/* <ion-icon name="mail"></ion-icon> */}

              {/* <Mail color={"#00000"} height="250px" width="250px" /> */}
            </span>
            <input
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
            <label>Email</label>
          </div>
          <div className="input-box">
            <span className="icon" onClick={handlePasswordVisibility}>
              {/* {passwordFocus ? (
                showPassword ? (
                  <Eye color={"#00000"} height="250px" width="250px" />
                ) : (
                  <EyeOff color={"#00000"} height="250px" width="250px" />
                )
              ) : (
                <LockClosed color={"#00000"} height="250px" width="250px" />
              )} */}
            </span>

            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
              // onFocus={setPasswordFocus(true)}
              // onBlur={setPasswordFocus(false)}
            />
            <label>Password</label>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#login-form">Forgot Password?</a>
          </div>
          {/* <button type="submit">Login</button> */}
          <TodoButton name="Login" passwordMatched={bothFieldsPresent} />
          <div className="register-link">
            <p>Don't have an account?</p>
            <a href="/signup">Register</a>
          </div>
        </form>
      </div>
      <button className="backButton" onClick={navigateToWelcome}>
        <div className="btn-flip" data-back="Back" data-front="Front"></div>
      </button>
    </section>
  );
};

export default LoginPages;
