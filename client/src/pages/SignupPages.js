import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";

// appwrite
import account from "../config/appwriteConfig";
import { ID } from "appwrite";

// axios
import axios from "axios";

// images
// import logo from "../assets/logo.png";
// import passwordHide from "../assets/icons/hidden.png";
// import passwordVisible from "../assets/icons/visible.png";
import okay from "../assets/icons/okay.png";
import notOkay from "../assets/icons/notOkay.png";
import passwordHide from "../assets/icons/hidden.png";
import passwordVisible from "../assets/icons/visible.png";
// components
// import TodoButton from "../components/TodoButton";
// import TodoButton from "../components/TodoButtons";

import "./styles/SignupPages.css";

// context
import userContext from "../context/userContext";

// router
import { Navigate } from "react-router-dom";

const TodoButton = lazy(() => import("../components/TodoButtons"));

const SignupPage = () => {
  /**
   * It is used to redirect user to homepage once the user registers into application using create service
   * of appwrite.
   */
  const { user, setUser } = useContext(userContext);

  /**
   * These states are used to store user values from input and pass it to appwrite service
   */

  const [name, setName] = useState(``); // [state, setState
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [passwordConfirm, setPasswordConfirm] = useState(``);
  const [profession, setProfession] = useState(``);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordMatched, setPasswordMatched] = useState(false);
  const [isValidationVisible, setIsValidationVisible] = useState(false);
  const [passwordValidationsMet, setPasswordValidationsMet] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  // const [validationTimeout, setValidationTimeout] = useState(false);
  // const [bothFieldsPresent, setBothFieldsPresent] = useState(false);
  /**
   * handleSignup(e) - Asynchronous Function
   *          - Prevents the default reloading of the webpage
   *          - Register a new user into project using create(id, email, password, name) service
   *            ID.unique() - generates unique ID's for users
   *          - On successfull registration of user. A session is created using valid email and password
   *            This session are available in cookies as a key- value pair or in localstorage by default
   *          - We set the Registered user to userContext
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

  const handleSignup = async (e) => {
    e.preventDefault();
    startSpinnerAnimation();
    try {
      const appwriteUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      console.log(appwriteUser);
      console.log("USER CREATED SUCCESSFULLY IN APPWRITE");

      await axios.post("/user/create", {
        name: appwriteUser.name,
        email: appwriteUser.email,
        appwriteId: appwriteUser.$id,
        profession: profession,
      });

      console.log("USER CREATED SUCCESSFULLY IN DB");
      await account.createEmailSession(email, password);
      console.log("SESSION CREATED SUCCESSFULLY");
      setUser(await account.get());
    } catch (error) {
      console.log("Error in handle signup appwrite service");
      console.log("Error Message: ", error.message);
    }
  };

  /**
   * handleChange() -
   * @param e - event
   * @param stateUpdate - takes a state updation function to update relevant state
   *      - This function updates the state based on the state updation function passed hence follows DRY.
   */

  const handlePasswordValidation = useCallback(() => {
    console.log("inside the handlePasswordValidation");
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    //                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    const hasSpecialCharacter = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(
      password
    );
    const hasNumber = /[0-9]/.test(password);
    const isLengthValid = password.length >= 8;

    const allValidationsMet =
      hasUppercase &&
      hasLowercase &&
      hasSpecialCharacter &&
      hasNumber &&
      isLengthValid;

    console.log("all validatoions met:", allValidationsMet);
    // if (allValidationsMet) {
    //   setPasswordValidationsMet(allValidationsMet);
    // } else {
    //   setPasswordValidationsMet(false);
    // }

    if (allValidationsMet) {
      setPasswordValidationsMet(true);
      setIsValidationVisible(false);
    }
    return allValidationsMet;
  }, [password]);

  const monitorPassword = useCallback((length) => {
    console.log("inside the monitor password");
    if (length > 0) {
      setIsValidationVisible(true);

      // clear the previous timeout (if any)
      //   if (validationTimeout) {
      //     clearTimeout(validationTimeout);
      //     console.log("cleared the previous timeout");
      //   }

      //   // Set a new timeout
      //   const newTimeout = setTimeout(() => {
      //     setIsValidationVisible(false);
      //   }, 3000);

      //   console.log("validation timeout :", validationTimeout);
      //   setValidationTimeout(newTimeout);
      // } else {
      //   setIsValidationVisible(false);
    }
  }, []);

  useEffect(() => {
    monitorPassword(password.length);
  }, [monitorPassword, password.length]);

  const handleChange = useCallback(() => {
    console.log(name, email, password, passwordConfirm, profession);
    // printing length of password and passwordConfirm
    console.log(password.length, passwordConfirm.length);

    // const newValue = e.target.value;
    // stateUpdate(e.target.value);

    /**
     * If the stateUpdate is either password or passwordConfirm then we check if both the values are same
     * and set the passwordMatched state to true or false accordingly.
     */
    // (stateUpdate === setPassword || stateUpdate === setPasswordConfirm)
    // if (stateUpdate === setPassword || stateUpdate === setPasswordConfirm) {
    // console.log(password, passwordConfirm);
    setPasswordValidationsMet(handlePasswordValidation());

    console.log(name, email, password, passwordConfirm, profession);
    if (passwordValidationsMet && password === passwordConfirm)
      setPasswordMatched(true);
    else setPasswordMatched(false);

    // setIsValidationVisible(password.length > 0 ? true : false);
  }, [
    handlePasswordValidation,
    name,
    email,
    password,
    passwordConfirm,
    profession,
    passwordValidationsMet,
  ]);

  useEffect(() => {
    handleChange();
  }, [handleChange, name, email, password, passwordConfirm, profession]);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
    // After 2 seconds, toggle the password visibility back
    setTimeout(() => {
      setShowPassword(false);
    }, 2000); // 2000 milliseconds = 3 seconds
  };
  const handleConfirmPasswordVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
    // After 2 seconds, toggle the password visibility back
    setTimeout(() => {
      setShowPasswordConfirm(false);
    }, 2000); // 2000 milliseconds = 3 seconds
  };

  // navigate user to homePage when user is signed in
  if (user) return <Navigate to="/home" />;

  return (
    <section className="w-screen ">
      <div className={`signup-box ${showBlur ? "blur-background" : ""} `}>
        <form id="signup-form" action="" onSubmit={(e) => handleSignup(e)}>
          <h2>SignUp</h2>

          {/* Name */}
          <div className="input-box">
            <input
              placeholder="Name"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              required
            />
            <label>Name</label>
          </div>

          {/* email */}
          <div className="input-box">
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

          {/* password  */}
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
            <Suspense fallback={<div>Loading...</div>}>
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
            </Suspense>
          </div>

          {/* validation check */}
          <div
            className={` validation-check
          transition-all duration-300
          text-sm border border-red-200
          flex flex-col justify-between mb-4
          ${
            isValidationVisible
              ? " validation-transition h-auto opacity-100"
              : " validation-transition h-0 opacity-0"
          }
        `}
          >
            {/* Password strength checks */}

            {/*  first row */}
            <div className={`flex flex-row justify-around items-center  `}>
              <div className={`flex flex-row items-center `}>
                <div className="w-4 h-4 mr-2 ">
                  {password.match(/[a-z]/) ? (
                    <img src={okay} alt="okay" className="w-full h-full" />
                  ) : (
                    <img
                      src={notOkay}
                      alt="notOkay"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p
                  className={` text-gray-400 ${
                    password.match(/[a-z]/) ? "valid-color" : "invalid-color"
                  }`}
                >
                  1 lowercase character
                </p>
              </div>

              <div className={`flex flex-row items-center`}>
                <div className="w-4 h-4 mr-2">
                  {password.match(/[A-Z]/) ? (
                    <img src={okay} alt="okay" className="w-full h-full" />
                  ) : (
                    <img
                      src={notOkay}
                      alt="notOkay"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p
                  className={`text-gray-400 ${
                    password.match(/[A-Z]/) ? "valid-color" : "invalid-color"
                  }`}
                >
                  1 uppercase character
                </p>
              </div>
            </div>
            {/* second rwo  */}
            <div className={`flex flex-row justify-around items-center`}>
              <div className={`flex flex-row items-center`}>
                <div className="w-4 h-4 mr-2">
                  {password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/) ? (
                    <img src={okay} alt="okay" className="w-full h-full" />
                  ) : (
                    <img
                      src={notOkay}
                      alt="notOkay"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p
                  className={`text-gray-400 ${
                    password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
                      ? "valid-color"
                      : "invalid-color"
                  }`}
                >
                  1 special character
                </p>
              </div>
              <div className={`flex flex-row items-center `}>
                <div className="w-4 h-4 mr-2">
                  {password.length >= 8 ? (
                    <img src={okay} alt="okay" className="w-full h-full" />
                  ) : (
                    <img
                      src={notOkay}
                      alt="notOkay"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p
                  className={`text-gray-400 ${
                    password.length >= 8 ? "valid-color" : "invalid-color"
                  }`}
                >
                  Minimum 8 characters
                </p>
              </div>
            </div>
            {/* thired row */}
            <div className={`flex flex-row justify-around items-center`}>
              <div className={`flex flex-row items-center`}>
                <div className="w-4 h-4 mr-2">
                  {password.match(/[0-9]/) ? (
                    <img src={okay} alt="okay" className="w-full h-full" />
                  ) : (
                    <img
                      src={notOkay}
                      alt="notOkay"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p
                  className={`text-gray-400 ${
                    password.match(/[0-9]/) ? "valid-color" : "invalid-color"
                  }`}
                >
                  1 number
                </p>
              </div>
            </div>
          </div>

          {/* password confirm */}
          <div className="input-box flex">
            <input
              placeholder="Confirm Password"
              type={showPasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="off"
              required
            />
            <label>Confirm Password</label>
            <button
              className="z-10"
              type="button"
              onClick={handleConfirmPasswordVisibility}
            >
              {showPasswordConfirm ? (
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

          {/* profession */}
          <div className="input-box">
            <span className="icon">
              {/* <ion-icon name="mail"></ion-icon> */}

              {/* <Mail color={"#00000"} height="250px" width="250px" /> */}
            </span>
            <input
              placeholder="profession"
              type="text"
              name="profession"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              autoComplete="off"
              required
            />
            <label>profession</label>
          </div>

          {/* <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#signup-form">Forgot Password?</a>
          </div> */}
          {/* <button type="submit">Login</button> */}
          <TodoButton name="SignUp" passwordMatched={passwordMatched} />
          <div className="register-link">
            <p>Already have account ?</p>
            <a href="/login">Login</a>
          </div>
        </form>
      </div>

      {/* spinner */}
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

export default SignupPage;
