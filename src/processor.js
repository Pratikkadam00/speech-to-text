class AudioProcessor extends AudioWorkletProcessor {
    process(inputs) {
      const input = inputs[0];
      if (input && input[0]) {
        const rawAudio = input[0]; // First channel's audio data
        this.port.postMessage(rawAudio.buffer); // Send data to main thread
      }
      return true; // Keep the processor alive
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
  