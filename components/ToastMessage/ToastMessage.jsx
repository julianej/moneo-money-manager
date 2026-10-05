

import {
  Toast,
  ToastContent,
  ToastTitle,
  ToastText,
  ToastClose,
} from "@/styles/ToastMessage";


export default function ToastMessage({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  return (
    <Toast $type={type}>
      <ToastContent>
        <ToastTitle>
          {type === "error" ? "Error" : "Success"}
        </ToastTitle>

        <ToastText>{message}</ToastText>

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