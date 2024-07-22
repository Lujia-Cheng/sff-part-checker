"use client";
import { useState } from "react";
import AiSuggestion from "../components/ai-suggestion";
import PartPicker from "../components/part-picker";
import type { PcConfig } from "../types";

import styles from "./page.module.css";
import { Spacer } from "@nextui-org/react";

export default function Home() {
  const [parts, setParts] = useState<PcConfig | undefined>();

  return (
    <main className={styles.main}>
      <PartPicker parts={parts} setParts={setParts} />
      <Spacer y={2} />
      <AiSuggestion parts={parts} />
      {/* display select parts */}

      <div className={styles.code}>
        DEBUG INFO, REMOVE LATER:
        <pre>{JSON.stringify(parts, null, 2)}</pre>
      </div>
    </main>
  );
}
