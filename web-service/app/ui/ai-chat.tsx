// pages/index.tsx
import { useState } from "react";
import { Box, Button, List, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";

import { Content } from "@google/generative-ai";

export default function AiChat(parts) {
  const [messageHistory, changeMessageHistory] = useState<Content[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [userText, setUserText] = useState("");
  const [waitingForServer, setWaitingForServer] = useState(false);

 

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFile = event.target.files?.[0];
    if (newFile) {
      setFile(newFile);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  
    // todo - upload file, send text to server, update messageHistory. see google ai studio example in /web-service/app/test/gemini.js 
   
  }

  function handleCancel() {
    // todo - cancel the request
  }

  return (
    <>
      <List>{/* todo - display chat history  */}</List>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, display: "flex", gap: "10px" }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
        />
        {waitingForServer ? (
          <Button variant="contained" type="reset" onClick={handleCancel}>
            <StopIcon />
          </Button>
        ) : (
          <Button
            disabled={!userText || waitingForServer}
            variant="contained"
            type="submit"
          >
            <SendIcon />
          </Button>
        )}
      </Box>
    </>
  );
}
