"use client";

import { useState } from "react";
import AiSuggestion from "../components/ai-suggestion";
import PartPicker from "../components/part-picker";
import type { PcConfig } from "../types";

import styles from "./page.module.css";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [parts, setParts] = useState<PcConfig>({
    case: null,
    cooler: null,
    gpu: null,
    motherboard: null,
    psu: null,
  });
  const [partPickerWidth, setPartPickerWidth] = useState(600); // Initial width

  const handleDrag = (e) => {
    setPartPickerWidth(e.clientX);
  };

  return (
    <>
      <div className="flex justify-center items-stretch h-screen">
        <div
          style={{ width: `${partPickerWidth}px` }}
          className="h-full overflow-auto"
        >
          <PartPicker parts={parts} setParts={setParts} />
        </div>
        <div
          onMouseDown={(e) => e.preventDefault()} // Prevent text selection while dragging
          className="cursor-col-resize bg-gray-300 w-2 flex justify-center items-center"
          draggable="true"
          onDrag={handleDrag}
        >
          {/* You can add a visual indicator for the draggable area if needed */}
        </div>
        <div className="flex-grow h-full overflow-auto">
          <AiSuggestion pcBuilder={parts} />
        </div>
      </div>
    </>
  );
}
