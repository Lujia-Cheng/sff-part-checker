"use client";

import { useState } from "react";
import AiSuggestion from "../components/ai-suggestion";
import PartPicker from "../components/part-picker";
import type { PcConfig } from "../types";

import styles from "./page.module.css";

export default function Home() {
  const [parts, setParts] = useState<PcConfig>({
    case: null,
    cooler: null,
    gpu: null,
    motherboard: null,
    psu: null,
  });

  return (
    <>
      <PartPicker parts={parts} setParts={setParts} />

      <AiSuggestion parts={parts} />
    </>
  );
}
