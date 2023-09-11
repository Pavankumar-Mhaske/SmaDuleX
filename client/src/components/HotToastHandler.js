import React from "react";
import toast, { Toaster } from "react-hot-toast";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export const showToastLoading = () => {
  return toast.loading("Please wait...");
};

export const showToastSuccess = (toastId) => {
  toast.success("this worked", {
    id: toastId,
  });
};

export const showToastError = (errorMessage) => {
  toast.error(errorMessage);
};

export const Toast = () => {
  return <Toaster />;
};
