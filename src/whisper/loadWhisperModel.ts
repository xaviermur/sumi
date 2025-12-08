import { Asset } from "expo-asset";

export async function loadWhisperModel() {
  const asset = Asset.fromModule(
    require("../../assets/models/whisper-tiny-q5_1.bin")
  );

  await asset.downloadAsync();
  return asset.localUri!;
}
