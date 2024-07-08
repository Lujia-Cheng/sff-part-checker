import { useState } from "react";
import handler from "../api/ai";

export default function AiChat(parts) {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {};

  return (
    <div>
      <h1>TODO AI Chat</h1>
    </div>
  );
}
