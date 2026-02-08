import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import type { MicState } from "@/core/types/audio";
import type { GameLanguage } from "@/core/types/game";

const RESTART_DELAY_MS = 300;
const FINALIZE_DEBOUNCE_MS = 600;

function mapLanguage(lang: GameLanguage) {
  switch (lang) {
    case "ca":
      return "ca-ES";
    case "en":
      return "en-US";
    case "es":
    default:
      return "es-ES";
  }
}

export function useWhisperRecognition(
  onText: (t: string) => void,
  language: GameLanguage = "es"
) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [listening, setListening] = useState(false);
  const [ready, setReady] = useState(true);

  const runningRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const lastHandledRef = useRef<string>("");
  const lastTranscriptRef = useRef<string>("");
  const debounceTimeoutRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);

  const clearTranscript = () => {
    lastTranscriptRef.current = "";
    lastHandledRef.current = "";
    if (debounceTimeoutRef.current != null) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  };

  const startListening = useCallback(async () => {
    shouldRestartRef.current = true;
    if (runningRef.current) return;

    const available = ExpoSpeechRecognitionModule.isRecognitionAvailable();
    if (!available) {
      setMicState("error");
      setReady(false);
      return;
    }

    const { granted } =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      setMicState("error");
      setReady(false);
      return;
    }

    runningRef.current = true;
    setMicState("listening");
    setListening(true);

    ExpoSpeechRecognitionModule.start({
      lang: mapLanguage(language),
      interimResults: true,
      continuous: true,
      maxAlternatives: 1,
    });
  }, [language]);

  const stopListening = useCallback(async () => {
    shouldRestartRef.current = false;
    if (!runningRef.current) return;

    if (restartTimeoutRef.current != null) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    runningRef.current = false;
    setListening(false);
    setMicState((prev) => (prev === "processing" ? "processing" : "idle"));
    clearTranscript();

    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch {
      // ignore
    }
  }, []);

  const abortListening = useCallback(async () => {
    shouldRestartRef.current = false;
    if (!runningRef.current) return;

    if (restartTimeoutRef.current != null) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    runningRef.current = false;
    setListening(false);
    setMicState((prev) => (prev === "processing" ? "processing" : "idle"));
    clearTranscript();

    try {
      await ExpoSpeechRecognitionModule.abort();
    } catch {
      // ignore
    }
  }, []);

  useSpeechRecognitionEvent("start", () => {
    runningRef.current = true;
    setMicState("listening");
    setListening(true);
  });

  useSpeechRecognitionEvent("speechstart", () => {
    clearTranscript();
    setMicState("recognizing");
  });

  useSpeechRecognitionEvent("end", () => {
    runningRef.current = false;
    if (shouldRestartRef.current) {
      if (restartTimeoutRef.current == null) {
        restartTimeoutRef.current = setTimeout(() => {
          restartTimeoutRef.current = null;
          startListening();
        }, RESTART_DELAY_MS) as unknown as number;
      }
      return;
    }

    setListening(false);
    setMicState("idle");
  });

  useSpeechRecognitionEvent("error", (event: any) => {
    if (event?.error === "aborted") {
      runningRef.current = false;
      setListening(false);
      setMicState((prev) => (prev === "processing" ? "processing" : "idle"));
      return;
    }

    runningRef.current = false;
    if (shouldRestartRef.current) {
      if (restartTimeoutRef.current == null) {
        restartTimeoutRef.current = setTimeout(() => {
          restartTimeoutRef.current = null;
          startListening();
        }, RESTART_DELAY_MS) as unknown as number;
      }
      return;
    }

    setListening(false);
    setMicState("error");
  });

  useSpeechRecognitionEvent("result", (event: any) => {
    const first = event?.results?.[0];
    const transcript = (first?.transcript ?? event?.transcript ?? "").trim();
    const isFinal = event?.isFinal ?? first?.isFinal ?? false;

    if (!transcript) return;

    if (transcript === lastHandledRef.current) return;
    lastTranscriptRef.current = transcript;

    if (debounceTimeoutRef.current != null) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    const emit = () => {
      if (lastTranscriptRef.current !== transcript) return;
      if (lastHandledRef.current === transcript) return;
      lastHandledRef.current = transcript;
      setMicState("processing");
      onText(transcript);
    };

    if (isFinal) {
      emit();
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      debounceTimeoutRef.current = null;
      emit();
    }, FINALIZE_DEBOUNCE_MS) as unknown as number;
  });

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current != null) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      clearTranscript();
      if (runningRef.current) {
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    ready,
    micState,
    listening,
    startListening,
    stopListening,
    abortListening,
  };
}
