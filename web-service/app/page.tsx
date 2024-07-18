"use client";
import { useState } from "react";
import AiSuggestion from "../components/ai-suggestion";
import PartPicker from "../components/part-picker";
import type { PcConfig } from "../types";

import styles from "./page.module.css";

export default function Home() {
  const [parts, setParts] = useState<PcConfig | undefined>();

  return (
    <main className={styles.main}>
      <PartPicker parts={parts} setParts={setParts} />

      <AiSuggestion parts={parts} />
    </main>
  );
}
