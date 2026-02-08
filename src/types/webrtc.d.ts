declare namespace ReactNativeWebRTC {
  interface AudioConstraints {
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    autoGainControl?: boolean;
    sampleRate?: number;
    channelCount?: number;
  }

  interface MediaTrackConstraints {
    audio?: AudioConstraints | boolean;
    video?: boolean;
  }
}

declare module "react-native-webrtc" {
  export const mediaDevices: {
    getUserMedia(
      constraints: ReactNativeWebRTC.MediaTrackConstraints
    ): Promise<MediaStream>;
  };
}
