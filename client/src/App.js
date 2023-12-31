import React, { useState, lazy, Suspense } from "react";

/**
 * Importing react-router-dom components for routing the pages in application
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/**
 * Importing pages which has to be assigned with route
 */

// // import HomePage from "./pages/Homepage";
// import HomePage from "./pages/Homepages";
// // import LoginPage from "./pages/LoginPage";
// import LoginPages from "./pages/LoginPages";
// // import SignupPage from "./pages/SignupPage";
// import SignupPages from "./pages/SignupPages";
// import WelcomePage from "./pages/WelcomePage";
// import GuidePages from "./pages/GuidePages";

/**
 * Importing layouts which has to be wrapped for every route
 */
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

/**
 * Importing userContext to provide the context value of user to entire application.
 */
import userContext from "./context/userContext";

// lasy loading
const HomePage = lazy(() => import("./pages/Homepages"));
const LoginPages = lazy(() => import("./pages/LoginPages"));
const SignupPages = lazy(() => import("./pages/SignupPages"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const GuidePages = lazy(() => import("./pages/GuidePages"));

// app component
const App = () => {
  /**
   * This will passed to userContext. Hence it is used verify if a user is logged in or not.
   */
  const [user, setUser] = useState(null);

  return (
    <>
      <userContext.Provider value={{ user, setUser }}>
        <Router>
          <Header />
          <Suspense
            fallback={
              <div className="lazy-loading-box">
                <h1 className="lazy-loading-text">Loading...</h1>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/home" element={<HomePage />} />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route path="/login" element={<LoginPages />} />
              {/* <Route path="/signup" element={<SignupPage />} /> */}
              <Route path="/signup" element={<SignupPages />} />
              <Route path="/guide" element={<GuidePages />} />
            </Routes>
          </Suspense>
          {/* <Footer /> */}
        </Router>
      </userContext.Provider>
    </>
  );
};

export default App;
