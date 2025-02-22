import { toast, type ToastType } from "vue3-toastify";

interface NotifyConfig {
  type?: ToastType;
  text: string;
}

export const Notify = ({ type, text }: NotifyConfig) => {
  toast(text, {
    type: type ?? "success",
    theme: "dark",
  });
};
