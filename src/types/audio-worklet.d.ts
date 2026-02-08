declare class AudioContext {
  constructor(options?: any);
  sampleRate: number;
  audioWorklet: {
    addModule(url: string): Promise<void>;
  };
  createMediaStreamSource(stream: MediaStream): any;
}

declare class AudioWorkletNode {
  constructor(context: AudioContext, name: string);
  port: {
    postMessage(msg: any): void;
    onmessage: (ev: any) => void;
  };
}
