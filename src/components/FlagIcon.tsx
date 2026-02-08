import React from "react";
import { View, Text } from "react-native";
import type { GameLanguage } from "@/core/types/game";

type FlagIconProps = {
  lang: GameLanguage;
  size?: number;
};

export default function FlagIcon({ lang, size = 20 }: FlagIconProps) {
  if (lang === "ca") {
    const height = size;
    const width = Math.round(size * 1.4);
    const stripeHeight = height / 9;
    const stripes = [1, 3, 5, 7];
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: "#FCDC04",
          borderRadius: 2,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
        {stripes.map((i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              top: i * stripeHeight,
              height: stripeHeight,
              width: "100%",
              backgroundColor: "#DA121A",
            }}
          />
        ))}
      </View>
    );
  }

  const emoji = lang === "es" ? "🇪🇸" : "🇬🇧";
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: size, lineHeight: size }}>{emoji}</Text>
    </View>
  );
}
