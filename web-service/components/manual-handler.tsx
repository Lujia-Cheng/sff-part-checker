import { useEffect, useRef, useState } from "react";

import type { PcConfig } from "@/types";
import { lookupManualUrl } from "@/app/actions";
import {
  Link,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Spacer,
} from "@nextui-org/react";

import DeleteIcon from "@mui/icons-material/Delete";

// todo move the manual upload from ai-suggestion to here
export default function ManualHandler({
  parts,
  files,
  setFiles,
}: {
  parts: PcConfig | undefined;
  files: File[];
  setFiles: (files: File[]) => void;
}) {
  function handleAddFiles() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const newFiles = Array.from((e.target as HTMLInputElement).files || []);
      setFiles([...files, ...newFiles]);
    };
    input.click();
  }

  function handleDeleteFile(index: number) {
    const tmpFiles = [...files];
    tmpFiles.splice(index, 1);
    setFiles(tmpFiles);
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
      <Table
        isStriped
        aria-label="Uploaded Manual"
        topContent={
          <div className="flex w-full space-between justify-between items-center text-xl">
            <div className="grow">Manuals</div>
          </div>
        }
        bottomContent={
          <div className="flex justify-center">
            <Button onPress={handleAddFiles}>Upload</Button>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>File Name</TableColumn>
          <TableColumn>Size</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody emptyContent={`Attach manual to clicking "Upload"`}>
          {files.map((file, index) => (
            <TableRow key={file.name}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{formatBytes(file.size)}</TableCell>
              <TableCell>
                <Tooltip content="Delete">
                  <Button
                    color="danger"
                    startContent={<DeleteIcon />}
                    onPress={() => handleDeleteFile(index)}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
