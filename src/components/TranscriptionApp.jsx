import React, { useState } from "react";
import Controls from "./Controls";
import TranscriptList from "./TranscriptList";


const TranscriptionApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [transcripts, setTranscripts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const newMediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const newSocket = new WebSocket("wss://api.deepgram.com/v1/listen", [
        "token",
        process.env.DEEPGRAM_KEY,
      ]);

      setMediaRecorder(newMediaRecorder);
      setSocket(newSocket);

      newSocket.onopen = () => {
        newMediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(event.data);
          }
        });
        newMediaRecorder.start(250);
      };

      newSocket.onmessage = (message) => {
        try {
          const received = JSON.parse(message.data);
          if (received.channel?.alternatives[0]?.transcript) {
            const transcript = received.channel.alternatives[0].transcript;
            setCurrentTranscript((prev) => prev + transcript + " ");
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        stopRecordingCleanup(newMediaRecorder, stream, newSocket);
      };

      newSocket.onclose = () => {
        
        stopRecordingCleanup(newMediaRecorder, stream, newSocket);
      };

      setIsRecording(true);
    });
  };

  const handleStopRecording = () => {
    if (mediaRecorder && socket) {
      stopRecordingCleanup(mediaRecorder, null, socket);
      setTranscripts((prev) => [...prev, currentTranscript]);
      setCurrentTranscript("");
      setIsRecording(false);
    }
  };

  const stopRecordingCleanup = (recorder, stream, ws) => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }

    setMediaRecorder(null);
    setSocket(null);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Audio Transcription</h1>
      <Controls
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-600">Current Transcript</h2>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
          {currentTranscript || "No transcription yet..."}
        </p>
      </div>
      <TranscriptList transcripts={transcripts} />
    </div>
  );
};

export default TranscriptionApp;
