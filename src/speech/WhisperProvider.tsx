import React, { createContext, useContext, useEffect, useState } from "react";
import { pipeline, env } from "@xenova/transformers";

// Runtime optimizations
env.allowLocalModels = true;
env.backends.onnx.wasm.numThreads = 1;

interface WhisperContextType {
  transcribe: (audio: Float32Array) => Promise<string>;
  ready: boolean;
}

const WhisperCtx = createContext<WhisperContextType>({
  transcribe: async () => "",
  ready: false,
});

export function WhisperProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [asr, setAsr] = useState<any>(null);

  useEffect(() => {
    async function load() {
      console.log("📥 Cargando modelo Whisper tiny int8...");
      
      const pipelineASR = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en", // o ".es" si prefieres modelo español
        {
          quantized: true,
        }
      );

      setAsr(pipelineASR);
      setReady(true);
      console.log("🎉 Whisper listo");
    }

    load();
  }, []);

  async function transcribe(audio: Float32Array) {
    if (!asr) return "";

    const result = await asr(audio, {
      chunk_length_s: 30,
    });

    // result.text contiene toda la transcripción
    return result.text.trim();
  }

  return (
    <WhisperCtx.Provider value={{ transcribe, ready }}>
      {children}
    </WhisperCtx.Provider>
  );
}

export function useWhisper() {
  return useContext(WhisperCtx);
}
