import { MessageContext, MessageContextType } from "@/context/NotificationContext";
import { useContext } from "react";

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};
