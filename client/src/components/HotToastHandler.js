import React from "react";
// import toast, { Toaster } from "react-hot-toast";
import { toast, Toaster, ToastBar } from "react-hot-toast";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Function to calculate dynamic offset based on scroll position
// *
const calculateToastOffset = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  return `${scrollY + 30}px `;
};

export const showToastLoading = (message) => {
  return toast.loading(message);
};

export const showToastSuccess = (successMessage, toastId) => {
  toast.success(successMessage, {
    id: toastId,
    icon: "👏",
  });
};

export const showToastError = (errorMessage) => {
  toast.error(errorMessage, {
    duration: 2000,
    icon: "😥",
  });
};

export const Toast = () => {
  return (
    <Toaster
      containerStyle={{
        // position: "absolute",
        // top: 200,
        // left: 20,
        // bottom: 20,
        // right: 20,
        position: "fixed", // Set to "fixed"
        top: calculateToastOffset(),
        // left: 0,
        // right: 0,
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type === "loading" && (
                <button onClick={() => toast.dismiss(t.id)}>❌</button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};
