import { useCallback, useContext, useEffect, useState } from "react";
import "./customStyles.css";
// appwrite
import account from "../config/appwriteConfig";
import { ID } from "appwrite";

// axios
import axios from "axios";

// images
import logo from "../assets/logo.png";

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
  const [passwordMatched, setPasswordMatched] = useState(false);

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
    console.log(name, email, password, passwordConfirm, profession);
    if (passwordConfirm.length > 7 && password === passwordConfirm)
      setPasswordMatched(true);
    else setPasswordMatched(false);
  }, [name, email, password, passwordConfirm, profession]);

  useEffect(() => {
    handleChange();
  }, [handleChange, name, email, password, passwordConfirm, profession]);

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
          />

          <input
            className="custom-input w-full rounded border-violet-700 text-lg md:text-xl mb-4 focus:outline-none focus:ring-0 focus:border-violet-800 placeholder-violet-700 "
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            name="passwordConfirm"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
            }}
          />

          {/* <span
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span> */}

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
