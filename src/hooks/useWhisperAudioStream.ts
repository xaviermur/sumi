import { useEffect } from "react";
import { mediaDevices, MediaStreamTrack } from "react-native-webrtc";

type Options = {
  onFrame: (f: Float32Array) => void;
};

export function useWhisperAudioStream({ onFrame }: Options) {
  useEffect(() => {
    let stopped = false;
    let track: MediaStreamTrack | null = null;

    async function init() {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 16000,
            channelCount: 1,
          },
          video: false,
        });

        track = stream.getAudioTracks()[0];

        const ctx = new AudioContext({ sampleRate: 16000 });
        const source = ctx.createMediaStreamSource(stream);

        const blob = new Blob([
          `
            class PCMWorklet extends AudioWorkletProcessor {
              process(inputs) {
                const input = inputs[0][0];
                if (input) {
                  this.port.postMessage(input.slice(0));
                }
                return true;
              }
            }
            registerProcessor('pcm-worklet', PCMWorklet);
          `,
        ]);

        const workletUrl = URL.createObjectURL(blob);
        await ctx.audioWorklet.addModule(workletUrl);

        const node = new AudioWorkletNode(ctx, "pcm-worklet");

        node.port.onmessage = (ev) => {
          if (!stopped) onFrame(ev.data);
        };

        source.connect(node).connect(ctx.destination);
      } catch (err) {
        console.error("useWhisperAudioStream error", err);
      }
    }

    init();

    return () => {
      stopped = true;
      try {
        track?.stop();
      } catch {}
    };
  }, [onFrame]);
}
