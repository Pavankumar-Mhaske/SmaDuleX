import { useCallback, useContext, useEffect, useState } from "react";
import "./customStyles.css";
// appwrite
import account from "../config/appwriteConfig";
import { ID } from "appwrite";

// axios
import axios from "axios";

// images
import logo from "../assets/logo.png";
import passwordHide from "../assets/icons/hidden.png";
import passwordVisible from "../assets/icons/visible.png";
import okay from "../assets/icons/okay.png";
import notOkay from "../assets/icons/notOkay.png";

// context
import userContext from "../context/userContext";

// router
import { Navigate } from "react-router-dom";

// components
import TodoButton from "../components/TodoButton";

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

  const handleSignup = async (e) => {
    e.preventDefault();
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
    // After 3 seconds, toggle the password visibility back
    setTimeout(() => {
      setShowPassword(false);
    }, 1000); // 3000 milliseconds = 3 seconds
  };
  const handleConfirmPasswordVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
    // After 3 seconds, toggle the password visibility back
    setTimeout(() => {
      setShowPasswordConfirm(false);
    }, 1000); // 3000 milliseconds = 3 seconds
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="bg-[#F5F5F7] h-[90vh] flex flex-col justify-center items-center   gap-6 -mt-8 lg:flex-row lg:justify-around ">
      <div className="w-3/5 lg:w-2/5 mx-auto">
        <img
          src={logo}
          alt="TodoApp Logo"
          className="w-full mx-auto max-w-lg rounded-2xl"
        />
      </div>
      <div className="w-5/6 md:w-2/3 lg:w-2/5 mx-auto">
        <form
          className="border border-violet-500 rounded py-4 px-5"
          onSubmit={(e) => handleSignup(e)}
        >
          <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-1/5 focus:border-violet-800 placeholder-violet-700"
            placeholder="Name"
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            // style={{
            //   boxShadow:
            //     "2px 2px 2px #cfcfcf, 3px 3px 3px #dbdbdb, 5px 5px 5px #e7e7e7, 6px 6px 6px #f3f3f3",
            //   transition: "transform 0.2s",
            // }}
            // onMouseOver={(e) => {
            //   e.currentTarget.style.transform = "scale(1.01)";
            // }}
            // onMouseOut={(e) => {
            //   e.currentTarget.style.transform = "scale(1)";
            // }}
            // onFocus={(e) => {
            //   e.currentTarget.style.transform = "scale(1.01)";
            // }}
            // onBlur={(e) => {
            //   e.currentTarget.style.transform = "scale(1)";
            // }}
          />
          <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700"
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {/* <div className="relative mb-4 flex flex-row">
          <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 "
            placeholder="Password"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          /> */}
          <div className="custom-input relative mb-4">
            <input
              className="hidden-element  w-full border border-violet-800 rounded py-2 px-4 text-lg focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 pr-12"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              autoComplete="off"
            />

            <button
              type="button"
              onClick={handlePasswordVisibility}
              className=" absolute inset-y-0 right-0 flex items-center pr-3"
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
          {/* showing which check of the password are matched */}
          {/*  1 uppercase character , 
          1 lovercase character ,
          1 special character,
          1 number 
          at least 8 character
           */}

          <div
            className={`
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
            <div
              className={`flex flex-row justify-around items-center border border-red-200`}
            >
              <div
                className={`flex flex-row items-center border border-red-200`}
              >
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
                  className={`text-gray-400 ${
                    password.match(/[a-z]/) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  1 lowercase character
                </p>
              </div>

              <div
                className={`flex flex-row items-center border border-red-200`}
              >
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
                    password.match(/[A-Z]/) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  1 uppercase character
                </p>
              </div>
            </div>
            {/* second rwo  */}
            <div
              className={`flex flex-row justify-around items-center border border-red-200`}
            >
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
                    // const regex =/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
                    password.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
                      ? "text-green-500"
                      : "text-red-500"
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
                    password.length >= 8 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Minimum 8 characters
                </p>
              </div>
            </div>
            {/* thired row */}
            <div
              className={`flex flex-row justify-around items-center border border-red-200`}
            >
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
                    password.match(/[0-9]/) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  1 number
                </p>
              </div>
            </div>
          </div>

          {/* <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 "
            placeholder="Confirm Password"
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
            }} */}
          {/* /> */}
          <div className="custom-input relative mb-4">
            <input
              className=" w-full border border-violet-800 rounded py-2 px-4 text-lg focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 pr-12"
              placeholder="Confirm Password"
              type={showPasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
              autoComplete="off"
            />

            <button
              type="button"
              onClick={handleConfirmPasswordVisibility}
              className=" absolute inset-y-0 right-0 flex items-center pr-3"
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
          <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 "
            placeholder="Profession"
            type="text"
            name="profession"
            id="profession"
            value={profession}
            onChange={(e) => {
              setProfession(e.target.value);
            }}
          />
          <TodoButton name="Signup" passwordMatched={passwordMatched} />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
