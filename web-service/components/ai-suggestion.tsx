"use client";
import { useEffect, useRef, useState } from "react";
import {
  Spacer,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { PcConfig } from "@/types";
import { upload } from "../app/actions";

export default function AiSuggestion({
  parts,
}: {
  parts: PcConfig | undefined;
}) {
  const [aiResponse, setAiResponse] = useState<any>();
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
    const response = upload(formData);
    setAiResponse(response);
  }

  function simplifyParts({
    case: { name: caseName, type, external_volume },
    cooler: { name: coolerName, size, height: coolerHeight },
    gpu: { name: gpuName, chipset, length, width, height: gpuHeight },
    motherboard: { name: motherboardName, form_factor },
    psu: { name: psuName, type: psuType },
  }: PcConfig) {
    return {
      case: { caseName, type, external_volume },
      cooler: { name: coolerName, size, coolerHeight },
      gpu: { name: gpuName, chipset, length, width, gpuHeight },
      motherboard: { name: motherboardName, form_factor },
      psu: { name: psuName, type: psuType },
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
          <div
            className="flex w-full space-between
          justify-between items-center
          "
          >
            <div className="grow">Upload Manual</div>
            <Button
              onClick={submit}
              color="primary"
              aria-label="Upload"
              isDisabled={!readyToSubmit}
            >
              Submit for AI Suggestion
            </Button>
          </div>
        }
        bottomContent={
          <div className="flex           justify-center">
            <Button onClick={handleAddFiles}>Add Files</Button>
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
      {aiResponse ? (
        <>
          {JSON.stringify(aiResponse)}
          {/* <h2>AI Suggestion</h2>
          <p>
            {aiResponse.compatible
              ? "This build is compatible."
              : "This build is not compatible."}
          </p>

          <Spacer y={1} />
          <h3>Conflicting Parts</h3>
          <ul>
            {aiResponse.conflictingParts.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
          <p>{aiResponse.reasoning}</p> */}
        </>
      ) : (
        "Awaiting AI Suggestion..."
      )}
    </>
  );
}
