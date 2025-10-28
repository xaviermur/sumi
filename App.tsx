// App.tsx
import React, { useState } from "react";
import { View } from "react-native";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";
import TimeAttackGameScreen from "./src/screens/TimeAttackGameScreen";
import CustomModeGameScreen from "./src/screens/CustomModeGameScreen";

type GameOptions = {
  mode: "free" | "timed" | "levels" | "custom";
  difficulty?: number;
  duration: number;
  customOptions?: any;
};

export default function App() {
  const [screen, setScreen] = useState<"menu" | "game">("menu");
  const [options, setOptions] = useState<GameOptions | null>(null);

  const handleStartGame = (opts: GameOptions) => {
    setOptions(opts);
    setScreen("game");
  };

  const handleExit = () => {
    setScreen("menu");
    setOptions(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {screen === "menu" && <MenuScreen onStartGame={handleStartGame} />}

      {/* 🧩 Modo libre */}
      {screen === "game" && options?.mode === "free" && (
        <FreeModeGameScreen
          onExit={handleExit}
          duration={options.duration}
          difficulty={options.difficulty}
        />
      )}

      {/* ⏱️ Contrarreloj */}
      {screen === "game" && options?.mode === "timed" && (
        <TimeAttackGameScreen onExit={handleExit} duration={options.duration} />
      )}

      {/* 🧮 Personalizado */}
      {screen === "game" && options?.mode === "custom" && (
        <CustomModeGameScreen
          onExit={handleExit}
          duration={options.duration}
          customOptions={options.customOptions}
        />
      )}

      {/* 🔜 Futuro: niveles */}
      {/* {screen === "game" && options?.mode === "levels" && (
        <LevelsGameScreen onExit={handleExit} />
      )} */}
    </View>
  );
}
