import { useState } from "react";
import { AiChat } from "./ui/ai-chat";
import { PartPicker } from "./ui/part-picker";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [partCount, setPartCount] = useState(0);

  const handlePartSelection = () => {
    // todo - determine if the user has selected enough parts to enable the chat
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex">
        <div className="w-1/2">
          <PartPicker onPartSelection={handlePartSelection} />
        </div>
        <div className="w-1/2">{showChat && <AiChat />}</div>
      </div>
    </main>
  );
}
