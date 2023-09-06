import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

function Calender({ setRemindeAt }) {
  const handleChange = (newValue) => {
    setRemindeAt(newValue);
  };

  const currentDateTime = new Date(); // Get the current date and time
  const currentHour = currentDateTime.getHours(); // Get the current hour
  const currentMinute = currentDateTime.getMinutes(); // Get the current minute

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
        <DateTimePicker
          label="Uncontrolled picker"
          onChange={handleChange}
          disablePast
        />
      </DemoContainer> */}
      <DemoContainer components={["MobileDateTimePicker"]}>
        <MobileDateTimePicker
          onChange={handleChange}
          defaultValue={dayjs(new Date())}
          disablePast
        />
        {/* </DemoItem> */}
        {/* <DateTimePicker
          label="Uncontrolled picker"
          onChange={handleChange}
          disablePast
        /> */}
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default Calender;
