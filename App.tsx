// App.tsx
import React, { useState } from "react";
import { View } from "react-native";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";
import TimeAttackGameScreen from "./src/screens/TimeAttackGameScreen";
// import LevelsGameScreen from "./src/screens/LevelsGameScreen"; // futuro

type GameOptions = {
  mode: "free" | "timed" | "levels";
  difficulty: "easy" | "medium" | "hard";
  duration: number;
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

      {screen === "game" && options?.mode === "free" && (
        <FreeModeGameScreen
          onExit={handleExit}
          // en el futuro podríamos usar options.difficulty o options.duration
        />
      )}

      {screen === "game" && options?.mode === "timed" && (
        <TimeAttackGameScreen
          onExit={handleExit}
          // podrías pasar también la dificultad:
          // difficulty={options.difficulty}
          // y la duración si quieres permitir variar el minuto:
          // duration={options.duration}
        />
      )}

      {/* FUTURO */}
      {/* {screen === "game" && options?.mode === "levels" && (
        <LevelsGameScreen onExit={handleExit} />
      )} */}
    </View>
  );
}
