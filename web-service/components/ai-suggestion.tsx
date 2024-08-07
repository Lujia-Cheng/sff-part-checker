"use client";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Divider,
  Image,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { AiResponseJSON, PcConfig } from "@/types";
import { upload } from "@/app/actions";

export default function AiSuggestion({
  parts,
}: {
  parts: PcConfig | undefined;
}) {
  const [aiResponse, setAiResponse] = useState<AiResponseJSON | null>();
  const [loading, setLoading] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  // const [manualUrl, setManualUrl] = useState<URL>();
  const [files, setFiles] = useState<File[]>([]);

  function handleAddFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      setFiles((prevFiles) => [...prevFiles, ...files]);
    };
    input.click();
  }

  function handleDeleteFile(index: number) {
    return () => {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
    };
  }

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
    const simplifiedParts = simplifyParts(parts);
    formData.append("parts", JSON.stringify(simplifiedParts));
    setLoading(true);
    const response = await upload(formData);
    setLoading(false);
    setAiResponse(JSON.parse(response));
  }

  function simplifyParts({
    case: { name: caseName, type, external_volume },
    cooler: { name: coolerName, size, height: coolerHeight },
    gpu: { name: gpuName, chipset, length, width, total_slot_width: gpuHeight },
    motherboard: { name: motherboardName, form_factor },
    psu: { name: psuName, type: psuType },
  }: PcConfig) {
    return {
      // fixme - some parts are optional, need to handle them
      case: { caseName, type, external_volume },
      cooler: { name: coolerName, size, coolerHeight },
      gpu: { name: gpuName, chipset, length, width, gpuHeight },
    };
  }
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <>
      {/* {manualUrl ? (
        <a href={manualUrl.href} target="_blank" rel="noopener noreferrer">
          Case manual found. Click here to download.
        </a>
      ) : (
        "Case manual not found."
      )} */}
      {/* upload file ui */}

      <Table
        isStriped
        aria-label="Uploaded Manual"
        topContent={
          <div className="flex w-full space-between justify-between items-center text-xl">
            <div className="grow">Uploaded Manuals</div>
          </div>
        }
        bottomContent={
          <div className="flex justify-center">
            <Button onClick={handleAddFiles}>Upload Manual</Button>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>File Name</TableColumn>
          <TableColumn>Size</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No manual uploaded"}>
          {files.map((file, index) => (
            <TableRow key={file.name}>
              <TableCell>{file.name}</TableCell>
              {/* if >1mb use mb if >1gb use gb */}
              <TableCell>{formatBytes(file.size)}</TableCell>
              <TableCell>
                <Tooltip content="Delete">
                  <Button
                    color="danger"
                    startContent={<DeleteIcon />}
                    onClick={handleDeleteFile(index)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spacer y={1} />
      <Button
        isLoading={loading}
        onClick={submit}
        color="primary"
        aria-label="Upload"
        isDisabled={!readyToSubmit}
      >
        Submit for AI Suggestion
      </Button>
      <Spacer y={8} />

      {aiResponse && (
        <Card>
          <CardHeader className="flex gap-3">
            {loading ? (
              <Avatar icon={<CircularProgress />} />
            ) : (
              <Avatar
                showFallback
                fallback={
                  <Image src="../public/gemini_favicon.png" alt="Gemini Logo" />
                }
                isBordered
                radius="full"
                src="https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png"
              />
            )}
            <div className="flex flex-col items-start">
              <p className="text-md">AI Checker</p>
              <p className="text-small text-default-500">
                Powered by Google Gemini
              </p>
            </div>
          </CardHeader>

          <Divider />
          <CardBody>
            <div className="flex mb-4">
              {aiResponse.compatibility ? (
                <span className="text-green-500 font-bold">Compatible</span>
              ) : (
                <span className="text-red-500 font-bold">Not Compatible</span>
              )}
            </div>
            <p>{aiResponse.rationale}</p>
          </CardBody>
        </Card>
      )}
    </>
  );
}
