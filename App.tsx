// App.tsx
import React, { useState } from "react";
import { View } from "react-native";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";
import TimeAttackGameScreen from "./src/screens/TimeAttackGameScreen";
import CustomModeGameScreen from "./src/screens/CustomModeGameScreen";
import RecordsScreen from "./src/screens/RecordsScreen";

type GameOptions = {
  mode: "free" | "timed" | "levels" | "custom" | "records";
  difficulty?: number;
  duration: number;
  customOptions?: any;
};

export default function App() {
  const [screen, setScreen] = useState<"menu" | "game" | "records">("menu");
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
      {/* 🏠 Menú principal */}
      {screen === "menu" && (
        <MenuScreen
          onStartGame={handleStartGame}   // ✅ guardamos las opciones correctamente
          onShowRecords={() => setScreen("records")}
        />
      )}

      {/* 🏆 Pantalla de récords */}
      {screen === "records" && (
        <RecordsScreen onBack={() => setScreen("menu")} />
      )}

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
        <TimeAttackGameScreen
          onExit={handleExit}
          difficulty={options.difficulty}
        />
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
