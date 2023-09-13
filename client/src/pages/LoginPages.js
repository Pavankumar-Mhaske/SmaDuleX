import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  lazy,
  Suspense,
} from "react";

// appwrite
import account from "../config/appwriteConfig";

// context
import userContext from "../context/userContext";

// router
import { Navigate, useNavigate } from "react-router-dom";

// components
// import TodoButton from "../components/TodoButton";

// importing Css file.
import "./styles/LoginPages.css";

import passwordHide from "../assets/icons/hidden.png";
import passwordVisible from "../assets/icons/visible.png";

// import TodoButton from "../components/TodoButtons";
const TodoButton = lazy(() => import("../components/TodoButtons"));
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
  const [showSpinner, setShowSpinner] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  // const [passwordFocus, setPasswordFocus] = useState(false);

  /**
   * handleLogin(e) - Asynchronous Function
   *      - Prevents the default reload of the webpage on submission of form.
   *      - Use appwrite createEmailSession service and pass the user email and password. If cobination
   *        is valid then it creates a session key-value pair in cookie and also store it in localstorage.
   *      - Navigate to homepage on successfull login
   *      - We set the Logged in user to userContext
   */
  // Function to start the spinner and blur animation
  const startSpinnerAnimation = () => {
    setShowSpinner(true);
    setShowBlur(true);

    // Stop the spinner and blur animation after 2 seconds
    setTimeout(() => {
      setShowSpinner(false);
      setShowBlur(false);
    }, 20000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    startSpinnerAnimation();

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
    }, 2000); // 3000 milliseconds = 3 seconds
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
    <section className="loginpage w-screen">
      <div className={`login-box ${showBlur ? "blur-background" : ""}`}>
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
          <div className="input-box flex">
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
            <button
              className="z-10"
              type="button"
              onClick={handlePasswordVisibility}
            >
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#login-form">Forgot Password?</a>
          </div>
          {/* <button type="submit">Login</button> */}

          <Suspense
            fallback={
              <div className="lazy-loading-box">
                <h1 className="lazy-loading-text">Loading...</h1>
              </div>
            }
          >
            <TodoButton
              name="Login"
              passwordMatched={bothFieldsPresent}
              // onClick={startSpinnerAnimation}
            />
          </Suspense>
          {/* <button
            className=" absolute text-white border py-5 "
            onClick={startSpinnerAnimation}
          >
            click me
          </button> */}

          <div className="register-link  flex">
            <p>Don't have an account?</p>
            <a href="/signup">Register</a>
          </div>
        </form>
      </div>
      <button className="backButton" onClick={navigateToWelcome}>
        <div className="btn-flip" data-back="Back" data-front="Front"></div>
      </button>

      <div className={`spinnersContainer ${showSpinner ? "" : "hidden"} `}>
        <div className={`spinner1`}>
          <div className={`circle1`}></div>
        </div>
        <div className={`spinner2`}>
          <div className={`circle2`}></div>
        </div>
      </div>
    </section>
  );
};

export default LoginPages;
