import React from "react";

const TranscriptList = ({ transcripts }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-600">Saved Transcripts</h2>
      {transcripts.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {transcripts.map((transcript, index) => (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded-lg border border-gray-300 text-gray-700 whitespace-pre-wrap"
            >
              {transcript}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2">No saved transcripts yet...</p>
      )}
    </div>
  );
};

export default TranscriptList;
