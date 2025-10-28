// App.tsx
import React, { useState } from "react";
import { View } from "react-native";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";
import TimeAttackGameScreen from "./src/screens/TimeAttackGameScreen";
import CustomConfigScreen from "./src/screens/CustomConfigScreen";
import CustomModeGameScreen from "./src/screens/CustomModeGameScreen";

type GameOptions = {
  mode: "free" | "timed" | "levels" | "custom";
  difficulty?: number;
  duration: number;
  customOptions?: any;
};

export default function App() {
  const [screen, setScreen] = useState<"menu" | "customConfig" | "game">("menu");
  const [options, setOptions] = useState<GameOptions | null>(null);

  const handleStartGame = (opts: GameOptions) => {
    // Si el usuario elige "custom", primero vamos a la pantalla de configuración
    if (opts.mode === "custom") {
      setScreen("customConfig");
    } else {
      setOptions(opts);
      setScreen("game");
    }
  };

  const handleCustomConfigDone = (opts: GameOptions) => {
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

      {screen === "customConfig" && (
        <CustomConfigScreen onStart={handleCustomConfigDone} />
      )}

      {screen === "game" && options?.mode === "free" && (
        <FreeModeGameScreen
          onExit={handleExit}
          duration={options.duration}
          difficulty={options.difficulty}
        />
      )}

      {screen === "game" && options?.mode === "timed" && (
        <TimeAttackGameScreen onExit={handleExit} duration={options.duration} />
      )}

      {screen === "game" && options?.mode === "custom" && (
        <CustomModeGameScreen
          onExit={handleExit}
          duration={options.duration}
          customOptions={options.customOptions}
        />
      )}
    </View>
  );
}
