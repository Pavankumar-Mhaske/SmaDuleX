import React from "react";
import toast, { Toaster } from "react-hot-toast";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export const showToastLoading = (message) => {
  return toast.loading(message);
};

export const showToastSuccess = (successMessage, toastId) => {
  toast.success(successMessage, {
    id: toastId,
  });
};

export const showToastError = (errorMessage) => {
  toast.error(errorMessage);
};

export const Toast = () => {
  return <Toaster />;
};
