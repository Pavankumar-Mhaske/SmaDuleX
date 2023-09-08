import React, { useContext, useEffect, useState } from "react";
import Calender from "./Calender";
import "./styles/Events.css";
import axios from "axios";

import userContext from "../context/userContext";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

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

  console.log("In EventsList user is  : ", user);
  useEffect(() => {
    axios
      // .get("/event/getAll")
      .get(`/user/events?userId=${user.$id}`)
      .then((response) => {
        console.log("response in 1st getReminder : ", response);
        setReminderList(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  const addReminder = async () => {
    console.log("reminderMsg : ", reminderMsg);
    console.log("remindeAt : ", remindeAt);
    const remindeAtISO = remindeAt.toISOString();

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
          .get("/event/getAll")
          .then((response) => {
            console.log(
              "response in getReminder  inside the addReminder : ",
              response
            );
            setReminderList(response.data);
          })
          .catch((error) => {
            console.log(
              "error while getting reminders List in addReminder",
              error
            );
          });
      })
      .catch((error) => {
        console.log("error in addReminder : ", error);
      });

    setReminderMsg("");
    setRemindeAt(new Date());
  };

  const deleteReminder = async (id) => {
    console.log("id in deleteReminder : ", id);
    console.log("userId in deleteReminder : ", user.$id);

    // {params: { userId: user.$id, eventId: id },}
    await axios
      .delete(`/event/${user.$id}/${id}`)
      .then(async (res) => {
        console.log("response in deleteReminder : ", res);
        // get all reminders from db and set reminderList on every addReminder call
        await axios
          .get("/event/getAll")
          .then((response) => {
            console.log(
              "response in getReminder  inside the deleteReminder : ",
              response
            );
            setReminderList(response.data);
          })
          .catch((error) => {
            console.log(
              "error while getting reminders List in deleteReminder : ",
              error
            );
          });
      })
      .catch((error) => {
        console.log("error in deleteReminder : ", error);
      });
  };

  // send otp
  const sendOtp = async () => {
    console.log("contactNumber in sendOtp : ", contactNumber);

    // const Otp = otpGenerator.generate(6, {
    //   upperCaseAlphabets: false,
    //   specialChars: false,
    // });
    // const Otp = Math.floor(100000 + Math.random() * 900000);
    const Otp = "1234";

    console.log("Otp is : ", Otp);
    setOtp(Otp);
    console.log("setup otp is : ", otp);

    await axios.post("/event/sendOtp", {
      contactNumber: contactNumber,
      Otp: Otp,
    });
  };

  // contact number varification
  const verifyOtp = () => {
    console.log(
      "************* inside verifyOtp function: ******************************"
    );

    if (otp === responseOtp) {
      console.log("otp is verified successfully");
      setIsVerified(true);
      user.isVerified = true;
    } else {
      console.log("otp is not verified");
    }
  };

  return (
    <div className="eventPage">
      {/* {console.log("reminderList is : ", reminderList)} */}

      {/*conditionally rendered div element for contact number verification... */}
      {console.log("insdie the eventpage")}
      {console.log("contact number : ", contactNumber)}
      {console.log("otp number : ", otp)}
      {console.log("responce Otp : ", responseOtp)}
      {!isVerified ? (
        <div className="contactNumberVerification">
          <h1 className="header_gradient_text mt-12 mb-6 text-2xl md:text-4xl font-medium text-violet-800 text-center">
            Verify your contact number!
          </h1>
          <div className="contactNumberVerification_body">
            {/* sending otp */}
            <h1>Enter your contact number</h1>
            {/* <input
              type="text"
              placeholder="Enter your contact number here..."
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            /> */}

            <PhoneInput
              defaultCountry="RU"
              placeholder="Enter phone number"
              value={contactNumber}
              onChange={setContactNumber}
            />
            <button className="border border-white-500" onClick={sendOtp}>
              Send OTP
            </button>

            {/* verifying otp */}
            <h1>Enter OTP</h1>
            <input
              type="text"
              placeholder="Enter OTP here..."
              value={responseOtp}
              onChange={(e) => SetResponseOtp(e.target.value)}
            />
            <button
              className="button border border-white-500"
              onClick={verifyOtp}
            >
              Verify
            </button>
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
    </div>
  );
}

export default EventList;
