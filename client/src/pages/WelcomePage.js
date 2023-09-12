import React from "react";
import "./styles/WelcomePage.css"; // Make sure to import your CSS file
// import image from styles
import studyImage from "./styles/study.png";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();
  // Navigate to the login page when the button is clicked
  const handleNavigateToLogin = () => {
    navigate("/home");
  };

  return (
    <div className="welcome-page-container">
      <div className="big-ball-1"></div>
      <div className="big-ball-2"></div>
      <div className="ball-1"></div>
      <div className="ball-2"></div>
      <div className="ball-3"></div>
      <div className="box">
        <nav>
          <h1 className="logo">
            <span>!</span>LOGO
          </h1>
          <ul>
            <li>
              <a href="/">HOME</a>
            </li>
            <li>
              <a href="#">ABOUT</a>
            </li>
            <li>
              <a href="#">SERVICES</a>
            </li>
            <li>
              <a href="#">Guide</a>
            </li>
          </ul>
        </nav>
        <div className="contains">
          <div className="section-1">
            <h1>WELCOME</h1>
            <h3>
              To <span> `</span>SmaDuleX<span>`</span> Company
            </h3>
            <p>SmaDuleX - Your Smart Scheduling and Exploration Company</p>
            <p>
              "Unlock Your Day, Discover Your World with SmaDuleX" 
            </p>

            <div className="button">
              <a href="#">More Info</a>
              <a href="#">Contact us</a>
            </div>
          </div>

          <div className="cube">
            <div className="top"></div>
            <div>
              <span style={{ "--i": 0 }}>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
              </span>
              <span style={{ "--i": 1 }}>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
              </span>
              <span style={{ "--i": 2 }}>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
              </span>
              <span style={{ "--i": 3 }}>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
                <button
                  onClick={handleNavigateToLogin}
                  className="glow-on-hover"
                  type="button"
                >
                  <div>CLICK ME</div>
                </button>
              </span>
            </div>
          </div>

          <div className="section-2">
            <img src={studyImage} alt="study image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
