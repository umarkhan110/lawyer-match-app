import { toast } from "react-toastify";

export const ShowNotification = (message:string, type:any) => {
  toast(message, {
    type,
    position: "top-right",
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
