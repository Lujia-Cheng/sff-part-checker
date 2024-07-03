"use client";

import { useState } from "react";
import AiChat from "./ui/ai-chat";
import PartPicker from "./ui/part-picker";
import styles from "./page.module.css";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [parts, setParts] = useState({
    case: null,
    cooler: null,
    gpu: null,
    motherboard: null,
    psu: null,
  }); //todo - init with json from ./db/data

  const handlePartSelection = () => {
    // todo - determine if the user has selected enough parts to enable the chat
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <PartPicker parts={parts} setParts={setParts} />

        <AiChat />
      </div>
    </main>
  );
}
