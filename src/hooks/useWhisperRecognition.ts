import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { useWhisper } from "../speech/WhisperProvider";
import type { MicState } from "@/core/types/audio";
import type { GameLanguage } from "@/core/types/game";

const SAMPLE_RATE = 16000;
const BUFFER_SIZE = 2048;
const SILENCE_THRESHOLD = 0.002;
const SILENCE_FRAMES = 12;

export function useWhisperRecognition(
  onText: (t: string) => void,
  language: GameLanguage = "es"
) {
  const { transcribe, ready } = useWhisper();

  const [micState, setMicState] = useState<MicState>("idle");
  const [listening, setListening] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const pcmQueue = useRef<Float32Array[]>([]);
  const silenceFrames = useRef(0);
  const running = useRef(false);

  // ----------------------------------------------
  // Convert Expo PCM -> Float32
  // ----------------------------------------------
  function onAudioFrame(data: Int16Array) {
    if (!running.current) return;

    const floats = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      floats[i] = data[i] / 32768;
    }

    pcmQueue.current.push(floats);

    // RMS
    const rms =
      Math.sqrt(floats.reduce((s, v) => s + v * v, 0) / floats.length) || 0;

    if (rms < SILENCE_THRESHOLD) silenceFrames.current++;
    else silenceFrames.current = 0;

    // Fin de frase
    if (silenceFrames.current >= SILENCE_FRAMES) {
      stopListening();
      const audio = mergeBuffers(pcmQueue.current);
      pcmQueue.current = [];

      if (audio.length > 4000) {
        transcribe(audio, SAMPLE_RATE, { language }).then(onText);
      }
    }
  }

  function mergeBuffers(chunks: Float32Array[]) {
    const total = chunks.reduce((s, c) => s + c.length, 0);
    const out = new Float32Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.length;
    }
    return out;
  }

  // ----------------------------------------------
  // Start listening
  // ----------------------------------------------
  async function startListening() {
    if (!ready) return;
    if (running.current) return;

    setMicState("listening");
    setListening(true);
    running.current = true;

    pcmQueue.current = [];
    silenceFrames.current = 0;

    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      console.warn("No permission for microphone");
      return;
    }

    const rec = new Audio.Recording();

    await rec.prepareToRecordAsync({
      isMeteringEnabled: false,
      android: {
        extension: ".wav",
        sampleRate: SAMPLE_RATE,
        numberOfChannels: 1,
        bitRate: 16,
        outputFormat: Audio.AndroidOutputFormat.DEFAULT,
        audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
      },
      ios: {
        extension: ".wav",
        sampleRate: SAMPLE_RATE,
        numberOfChannels: 1,
        bitDepthHint: 16,
        outputFormat: Audio.IOSOutputFormat.LINEARPCM,
        audioQuality: Audio.IOSAudioQuality.HIGH,
      },
    });

    rec.setOnRecordingStatusUpdate((status: any) => {
      if (!status || !status.isRecording || !status.frameBuffer) return;

      const buffer = new Int16Array(status.frameBuffer);
      onAudioFrame(buffer);
    });

    await rec.startAsync();
    recordingRef.current = rec;
  }

  // ----------------------------------------------
  // Stop listening
  // ----------------------------------------------
  async function stopListening() {
    if (!running.current) return;

    running.current = false;
    setListening(false);
    setMicState("idle");

    const rec = recordingRef.current;
    if (!rec) return;

    try {
      await rec.stopAndUnloadAsync();
    } catch {
      /* ignore */
    }
    recordingRef.current = null;
  }

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    ready,
    micState,
    listening,
    startListening,
    stopListening,
  };
}
