

import {
  Toast,
  ToastContent,
  ToastTitle,
  ToastText,
  ToastClose,
} from "@/styles/ToastMessage";


export default function ToastMessage({
  toastMessage = "",
  toastType = "success",
  onClose,
}) {
  if (!toastMessage) return null;

  return (
    <Toast $type={toastType}>
      <ToastContent>
        <ToastTitle>
          {toastType === "error" ? "Error" : "Success"}
        </ToastTitle>

        <ToastText>{toastMessage}</ToastText>

      </ToastContent>
        <ToastClose
        type="button"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </ToastClose>
    </Toast>
  );
}