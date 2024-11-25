import React from "react";

const Controls = ({ isRecording, onStartRecording, onStopRecording }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onStartRecording}
        disabled={isRecording}
        className={`px-4 py-2 rounded-lg font-medium text-white ${
          isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Record
      </button>
      <button
        onClick={onStopRecording}
        disabled={!isRecording}
        className={`px-4 py-2 rounded-lg font-medium text-white ${
          !isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        Stop
      </button>
    </div>
  );
};

export default Controls;
