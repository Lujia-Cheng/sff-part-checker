"use client";

import { useState } from "react";
import AiChat from "./ui/ai-chat";
import PartPicker from "./ui/part-picker";
// import styles from "./page.module.css";

import { Case, CpuCooler, Motherboard, PowerSupply, VideoCard } from "./type";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [parts, setParts] = useState<{
    case: Case | null;
    cooler: CpuCooler | null;
    gpu: VideoCard | null;
    motherboard: Motherboard | null;
    psu: PowerSupply | null;
  }>({
    case: null,
    cooler: null,
    gpu: null,
    motherboard: null,
    psu: null,
  });

  const handlePartSelection = () => {
    // todo - determine if the user has selected enough parts to enable the chat
  };

  return (
    <>
      <PartPicker parts={parts} setParts={setParts} />

      <AiChat parts={parts} />
    </>
  );
}
