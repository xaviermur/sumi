import React from "react";
import { Text, View } from "react-native";
import type { MicState } from "@/core/types/audio";
import { useI18n } from "@/i18n/I18nProvider";

export default function MicIndicator({ micState }: { micState: MicState }) {
  const { strings } = useI18n();
  let text = "";

  switch (micState) {
    case "idle":
      text = strings.mic.idle;
      break;
    case "listening":
      text = strings.mic.listening;
      break;
    case "recognizing":
      text = strings.mic.recognizing;
      break;
    case "processing":
      text = strings.mic.processing;
      break;
    case "error":
      text = strings.mic.error;
      break;
    default:
      text = strings.mic.idle;
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, textAlign: "center" }}>{text}</Text>
    </View>
  );
}
