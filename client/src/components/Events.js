import React, { useCallback, useContext, useEffect, useState } from "react";
import Calender from "./Calender";
import "./styles/Events.css";
import axios from "axios";

import userContext from "../context/userContext";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// import {
//   showToastLoading,
//   showToastSuccess,
//   showToastError,
//   Toast,
// } from "./ToastHandler";

import {
  showToastLoading,
  showToastSuccess,
  showToastError,
  Toast,
} from "./HotToastHandler";
import { useNavigate } from "react-router-dom";
// const otpGenerator = require("otp-generator");

function EventList() {
  const { user } = useContext(userContext);
  const [reminderMsg, setReminderMsg] = useState("");
  const [remindeAt, setRemindeAt] = useState(new Date());
  const [reminderList, setReminderList] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [responseOtp, SetResponseOtp] = useState("");
  const [isVerified, setIsVerified] = useState(user.isVerified);
  const [allowSendOtp, setAllowSendOtp] = useState(false);
  const [seconds, setSeconds] = useState(0);

  console.log("In EventsList user is  : ", user);

  const fetchData = async () => {
    await axios
      .get(`/user/getUser?userId=${user.$id}`)
      .then((response) => {
        console.log("response in getUser: ", response);
        console.log("isVeried", response.data.data[0].isVerified);
        setIsVerified(response.data.data[0].isVerified);
      })
      .catch((error) => {
        console.log("error", error);
      });

    await axios
      // .get("/event/getAll")
      .get(`/user/events?userId=${user.$id}`)
      .then((response) => {
        console.log("response in 1st getReminder : ", response);
        // setReminderList(response.data);
        setReminderList(response.data);
        console.log("reminderList in getreminder: ", reminderList);
      })
      .catch((error) => {
        console.log("error", error);
      });

    // try {
    //   const userResponse = await axios.get(`/user/getUser?userId=${user.$id}`);
    //   console.log("User response:", userResponse);

    //   setIsVerified(userResponse.data.data[0].isVerified);

    //   const eventsResponse = await axios.get(`/user/events?userId=${user.$id}`);
    //   console.log("Events response:", eventsResponse);

    //   setReminderList(eventsResponse.data);
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   axios

  //     .get("http://localhost:4000/getAllReminders") // get all reminders from db
  //     .then((response) => {
  //       console.log("response in getReminder : ", response);
  //       setReminderList(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // }, [reminderList]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     axios
  //       .get("http://localhost:4000/getAllReminders")
  //       .then((response) => {
  //         console.log("response in 2nd getReminder : ", response);
  //         // setReminderList(response.data);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //       });
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, [reminderList]);

  const addReminder = useCallback(async () => {
    console.log("reminderMsg : ", reminderMsg);
    console.log("remindeAt : ", remindeAt);
    const remindeAtISO = remindeAt.toISOString();

    console.log("***********************************************");
    const toastId = showToastLoading("Adding an Event..."); // show loading toast
    await axios
      .post("/event/create", {
        reminderMsg: reminderMsg,
        remindAt: remindeAtISO,
        userId: user.$id,
      })
      .then(async (res) => {
        console.log("response in addReminder : ", res);

        // get all reminders from db and set reminderList on every addReminder call

        await axios
          // .get("/event/getAll")
          .get(`/user/events?userId=${user.$id}`)
          .then((response) => {
            console.log(
              "response in getReminder  inside the addReminder : ",
              response
            );
            setReminderList(response.data);
            console.log("reminderList in addreminder : ", reminderList);
            showToastSuccess("Event added successfully!", toastId); // show success toast
          })
          .catch((error) => {
            console.log(
              "error while getting reminders List in addReminder",
              error
            );
            showToastError(error.message);
          });
      })
      .catch((error) => {
        console.log("error in addReminder : ", error);
        showToastError(error.message);
      });

    setReminderMsg("");
    setRemindeAt(new Date());
  }, [reminderList, reminderMsg, remindeAt, user.$id]);

  const deleteReminder = useCallback(
    async (id) => {
      console.log("id in deleteReminder : ", id);
      console.log("userId in deleteReminder : ", user.$id);

      // {params: { userId: user.$id, eventId: id },}
      const toastId = showToastLoading("Deleting an Event..."); // show loading toast
      await axios
        .delete(`/event/${user.$id}/${id}`)
        .then(async (res) => {
          console.log("response in deleteReminder : ", res);
          // get all reminders from db and set reminderList on every addReminder call
          await axios
            // .get("/event/getAll")
            .get(`/user/events?userId=${user.$id}`)
            .then((response) => {
              console.log(
                "response in getReminder  inside the deleteReminder : ",
                response
              );
              setReminderList(response.data);
              showToastSuccess("Event deleted successfully!", toastId); // show success toast
            })
            .catch((error) => {
              console.log(
                "error while getting reminders List in deleteReminder : ",
                error
              );
              showToastError(error.message);
            });
        })
        .catch((error) => {
          console.log("error in deleteReminder : ", error);
          showToastError(error.message);
        });
    },
    [user.$id]
  );

  useEffect(() => {
    // Function to update the time every second
    console.log("inside the seconds decreaments:");
    const interval = setInterval(() => {
      if (seconds > 0) {
        console.log("seconds : ", seconds);
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        setAllowSendOtp(true);
        console.log("during ending interval:", seconds);

        clearInterval(interval); // Stop the timer when it reaches 0
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [seconds]);

  // send otp
  const sendOtp = async () => {
    console.log("contactNumber in sendOtp : ", contactNumber);

    const Otp = "0000";

    console.log("Otp is : ", Otp);
    setOtp(Otp);
    console.log("setup otp is : ", otp);

    await axios.post("/event/sendOtp", {
      contactNumber: contactNumber,
      Otp: Otp,
    });

    setSeconds(30);
    setAllowSendOtp(false);
    // setTimeout(() => {
    //   console.log("resend otp activated after 30sec");
    //   setAllowSendOtp(true);
    // }, 30000);
  };

  // contact number varification
  const verifyOtp = async () => {
    console.log("inside verifyOtp function");

    if (otp === responseOtp) {
      console.log("otp is verified successfully");
      setIsVerified(true);
      user.isVerified = true;
      await axios.post("/event/updateIsVerified", {
        userId: user.$id,
        isVerified: true,
        contactNumber: contactNumber,
      });
    } else {
      console.log("otp is not verified");
    }
  };

  const navigate = useNavigate();
  const navigateToGuide = () => {
    navigate("/guide"); // Replace '/welcome' with the actual URL of your welcome page
  };

  return (
    <div className="eventPage">
      {console.log("user in eventList *********** : ", user.isVerified)}
      {/* functionality of Verifying the users contact number and enabling him/her to use evets scheduling funtioanlity */}
      {!isVerified ? (
        <div className="verification_box w-[95%] sm:w-5/6 md:w-full m-auto">
          <button className="Guide_button mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded  active:bg-violet-400  active:text-gray-500" onClick={navigateToGuide}>
            
            Guide
          </button>
          <p className="mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded  active:bg-violet-400  active:text-gray-500">👆🏻</p>
          <p className="mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded  active:bg-violet-400  active:text-gray-500"> Please go throught the guide before proceed</p>
          <h1 className="header_gradient_text mt-12 mb-6 text-2xl md:text-4xl font-medium text-center">
            Events Reminder
          </h1>
          <h1 className="header_gradient_text mb-6 text-2xl md:text-4xl font-medium text-center">
            Verify your contact number!
          </h1>
          <div className="verification_body">
            {/* <h1>Enter your contact number</h1> */}
            <div className="flex-container">
              <PhoneInput
                className="verification_input"
                defaultCountry="RU"
                placeholder="Enter phone number"
                value={contactNumber}
                onChange={setContactNumber}
              />
              <button
                className={` ${
                  allowSendOtp ? "" : "cursor-not-allowed"
                } verification_button_sendotp mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded  active:bg-violet-400  active:text-gray-500`}
                onClick={() => {
                  if (allowSendOtp) {
                    sendOtp();
                  }
                }}
                disabled={!allowSendOtp}
              >
                Send OTP
              </button>
            </div>
            <div
              className={`otp_dropdown 
          transition-all duration-300
          text-sm border border-red-200
          flex flex-col justify-between mb-4
          ${
            !allowSendOtp
              ? " validation-transition h-auto opacity-100"
              : " validation-transition h-0 opacity-0"
          }
        `}
            >
              <p className="text-center text-white">
                OTP is send to your mobile number ✅
                <br />
                You can resend the OTP again after : {seconds}
              </p>
            </div>
            {/* verifying otp */}
            <div className="flex-container">
              <h1>Enter OTP</h1>
              <input
                className="verification_input "
                type="text"
                placeholder="Enter OTP here..."
                value={responseOtp}
                onChange={(e) => SetResponseOtp(e.target.value)}
              />
              <button
                className="verification_button_verify  mt-2 md:mt-0 sm:ml-2  px-5  py-2 text-md  lg:text-lg   text-white  font-medium  rounded "
                onClick={verifyOtp}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="eventsBox">
          <h1 className="header_gradient_text mt-12 mb-6 text-2xl md:text-4xl font-medium text-violet-800 text-center">
            Create New Events!
          </h1>
          <div className="eventsBox_header">
            <h1>remind me 🙋🏻‍♂️</h1>
            <input
              type="text"
              placeholder="Reminder notes here..."
              value={reminderMsg}
              onChange={(e) => setReminderMsg(e.target.value)}
            />
            <div className="calender">
              <Calender setRemindeAt={setRemindeAt} />
            </div>
            <div className="button" onClick={addReminder}>
              submit
            </div>
          </div>

          <h1 className="body_gradient_text mt-12 mb-6 text-2xl md:text-4xl font-medium text-violet-800 text-center">
            Your Events!
          </h1>

          <div className="eventsBox_body">
            {/* <Toast /> */}
            {console.log("inside the reminder List: ", reminderList)}
            {reminderList.data ? (
              reminderList.data.map((reminder) => (
                <div className="reminder_card" key={reminder._id}>
                  <h2>{reminder.reminderMsg}</h2>
                  <div className={`flex-container`}>
                    {reminder.isReminded ? (
                      <h3> ✅Reminded at :</h3>
                    ) : (
                      <h3>Remind me at :</h3>
                    )}

                    <h5>
                      {new Date(
                        reminder.remindAt.toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      ).toLocaleString()}
                    </h5>
                  </div>

                  <p>
                    {String(
                      new Date(
                        reminder.remindAt.toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })
                      )
                    )}
                  </p>
                  {/* new Date(reminder.remindAt.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })) */}

                  <div
                    className="button"
                    onClick={() => deleteReminder(reminder._id)}
                  >
                    Delete
                  </div>
                </div>
              ))
            ) : (
              <p>No reminders available.</p>
            )}
            {/* <h2>Reminder notes</h2>
          <h3>Remind me at:</h3>
          <p> 26/05/2023 @2AM</p>
          <div className="button" onClick={deleteReminder}>
            Delete
          </div> */}
          </div>
        </div>
      )}
      <Toast />
    </div>
  );
}

export default EventList;
