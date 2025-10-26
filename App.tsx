import React, { useState } from "react";
import { View } from "react-native";
import GameScreen from "./src/screens/GameScreen";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";

export default function App() {
  const [screen, setScreen] = useState<"menu" | "game">("menu");

  return (
    <View style={{ flex: 1 }}>
      {screen === "menu" ? (
        <MenuScreen onStartGame={() => setScreen("game")} />
      ) : (
        <FreeModeGameScreen onExit={() => setScreen("menu")} />
      )}
    </View>
  );
}
