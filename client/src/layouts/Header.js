import { useContext } from "react";

// appwrite
import account from "../config/appwriteConfig.js";

// context
import userContext from "../context/userContext.js";

// router
import { Link } from "react-router-dom";

const Header = () => {
  /**
   * It is used to conditionally render username, logout options to user if logged in else to display
   * login and signup.
   * It is also set to null if user logs out.
   */
  const { user, setUser } = useContext(userContext);

  /**
   * handleLogout() - Asynchronous Function
   *      - Logs the user out using deleteSession service of appwrite.
   *      - Updates the userContext to null meaning the user is logged out.
   */
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.log("Error in handle logout appwrite service");
      console.log("Error Message: ", error.message);
    }
  };

  return (
    <header className="sticky bg-white w-full top-0">
      <nav className="flex py-1 border-b-2 text-violet-800">
        <span className="text-3xl font-medium ml-3 md:ml-40">TodoApp</span>
        <ul className="w-full flex items-center flex-wrap justify-end gap-4">
          {user ? (
            <>
              <li className="text-sm lg:text-xl font-medium">{user.name}</li>
              <li
                className="text-sm lg:text-xl font-medium mr-3 md:mr-10 lg:mr-20 "
                onClick={handleLogout}
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li className="text-sm lg:text-xl font-medium">
                <Link to="/signup">SignUp</Link>
              </li>
              <li className="text-sm lg:text-xl mr-3 md:mr-10 lg:mr-20 font-medium">
                <Link to="/login">LogIn</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
