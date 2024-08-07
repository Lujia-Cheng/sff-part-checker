"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Progress,
  Skeleton,
} from "@nextui-org/react";
import { AiResponseJSON, PcConfig } from "@/types";
import { upload } from "@/app/actions";

export default function AiSuggestion({
  parts,
  files,
  setFiles,
}: {
  parts: PcConfig | undefined;
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  const [aiResponse, setAiResponse] = useState<AiResponseJSON | null>();
  const [fetchStatus, setFetchStatus] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  useEffect(() => {
    setReadyToSubmit(Boolean(parts && parts.case && parts.cooler));
  }, [parts]);

  async function submit() {
    if (!files) {
      console.error("No file selected");
      return;
    }
    if (!parts) {
      console.error("No parts selected");
      return;
    }

    const formData = new FormData();
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const simplifiedParts = partListSimplifier(parts);
    formData.append("parts", JSON.stringify(simplifiedParts));

    setFetchStatus(true);
    const response = await upload(formData);
    setFetchStatus(false);

    setAiResponse(JSON.parse(response));
  }

  function partListSimplifier({
    case: { name: caseName, type, external_volume },
    cooler: { name: coolerName, size, height: coolerHeight },
    gpu: { name: gpuName, chipset, length, width, total_slot_width: gpuHeight },
  }: PcConfig) {
    return {
      case: { caseName, type, external_volume },
      cooler: { name: coolerName, size, coolerHeight },
      gpu: { name: gpuName, chipset, length, width, gpuHeight },
    };
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="flex gap-4">
          <Avatar
            showFallback
            fallback={
              <Image src="../public/gemini_favicon.png" alt="Gemini Logo" />
            }
            isBordered
            radius="full"
            src="https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png"
          />

          <div className="flex flex-col items-start">
            <p className="text-md">AI Checker</p>
            <p className="text-small text-default-500">
              Powered by Google Gemini
            </p>
          </div>
          <Button
            className="ml-auto"
            isLoading={fetchStatus}
            onPress={submit}
            color="primary"
            aria-label="Upload"
            isDisabled={!readyToSubmit}
          >
            Submit
          </Button>
        </CardHeader>
        {fetchStatus && (
          <Progress size="sm" isIndeterminate aria-label="Loading..." />
        )}

        <Divider />
        <CardBody>
          <div className="flex mb-4">
            {!aiResponse ? (
              <span className="text-yellow-500 font-bold">
                Submit to view results
              </span>
            ) : aiResponse.compatibility ? (
              <span className="text-green-500 font-bold">Compatible</span>
            ) : (
              <span className="text-red-500 font-bold">Not Compatible</span>
            )}
          </div>

          <Skeleton isLoaded={!!aiResponse} />
          <p>{aiResponse?.rationale}</p>
        </CardBody>
        <CardFooter>{/* display pc parts info */}</CardFooter>
      </Card>
    </div>
  );
}
