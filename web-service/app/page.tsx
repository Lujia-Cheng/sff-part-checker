"use client";

import { useState } from "react";
import { Spacer } from "@nextui-org/react";

import type { PcConfig } from "@/types";

import AiSuggestion from "@/components/ai-suggestion";
import ManualHandler from "@/components/manual-handler";
import PartPicker from "@/components/part-picker";

export default function Home() {
  const [parts, setParts] = useState<PcConfig | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <header className="flex flex-col items-center justify-center w-full h-20 py-2 bg-gray-800 text-white">
        <h1 className="text-4xl">SFF PC Checker</h1>
        <p className="text-xl">
          Tired of checking the manuals for compatibility? Let the AI do it for
          you!
        </p>
      </header>
      <Spacer y={8} />
      <main className="flex flex-col items-center justify-center mx-auto w-full max-w-[600px]">
        <PartPicker parts={parts} setParts={setParts} />
        <Spacer y={8} />
        <ManualHandler parts={parts} files={files} setFiles={setFiles} />
        <Spacer y={8} />
        <AiSuggestion parts={parts} files={files} setFiles={setFiles} />
      </main>
    </>
  );
}
