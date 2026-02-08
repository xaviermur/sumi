import React, { useState } from "react";
import { View } from "react-native";
import MenuScreen from "./src/screens/MenuScreen";
import FreeModeGameScreen from "./src/screens/FreeModeGameScreen";
import TimeAttackGameScreen from "./src/screens/TimeAttackGameScreen";
import RecordsScreen from "./src/screens/RecordsScreen";
import HelpScreen, { HelpSectionId } from "./src/screens/HelpScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GameMode, GameLanguage } from "@/core/types/game";
import type { OperationType } from "@/core/types/operation";
import { WhisperProvider } from "@/speech/WhisperProvider"; // 👈 NUEVO

type GameOptions = {
  mode: GameMode;
  difficulty: number;
  operationTypes: OperationType[];
  language: GameLanguage;
};

export default function App() {
  const [screen, setScreen] = useState<"menu" | "game" | "records" | "help">("menu");
  const [previousScreen, setPreviousScreen] = useState<"menu" | "game" | "records" | null>(null); // 🆕 recordar de dónde viene
  const [options, setOptions] = useState<GameOptions | null>(null);
  const [helpSection, setHelpSection] = useState<HelpSectionId>("intro"); // 🧭 sección actual de ayuda

  // 🚀 Iniciar partida
  const handleStartGame = (opts: GameOptions) => {
    setOptions(opts);
    setScreen("game");
  };

  // 🏁 Salir del juego
  const handleExitGame = () => {
    setOptions(null);
    setScreen("menu");
  };

  // 🏆 Mostrar récords
  const handleShowRecords = () => setScreen("records");

  // 🆘 Abrir ayuda (guarda la pantalla anterior)
  const handleOpenHelp = (section?: HelpSectionId) => {
    setHelpSection(section ?? "intro");
    setPreviousScreen(screen); // recordamos desde dónde se abrió
    setScreen("help");
  };

  // 🔙 Volver desde la ayuda
  const handleBackFromHelp = () => {
    setScreen(previousScreen ?? "menu");
  };

  return (

    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <WhisperProvider>
          <View style={{ flex: 1 }}>
            {/* 🏠 MENÚ PRINCIPAL */}
            {screen === "menu" && (
              <MenuScreen
                onStartGame={handleStartGame}
                onShowRecords={handleShowRecords}
                onOpenHelp={() => handleOpenHelp("intro")}
              />
            )}

            {/* 🏆 RÉCORDS */}
            {screen === "records" && <RecordsScreen onBack={() => setScreen("menu")} />}

            {/* 🆘 AYUDA */}
            {screen === "help" && (
              <HelpScreen
                onBack={handleBackFromHelp} // 🔙 vuelve a la anterior
                startSection={helpSection}
              />
            )}

            {/* 🎮 JUEGO */}
            {screen === "game" && options && (
              <>
                {options.mode === "free" && (
                  <FreeModeGameScreen
                    onExit={handleExitGame}
                    difficulty={options.difficulty}
                    operationTypes={options.operationTypes}
                    language={options.language}
                    onOpenHelp={handleOpenHelp}
                  />
                )}

                {options.mode === "timeattack" && (
                  <TimeAttackGameScreen
                    onExit={handleExitGame}
                    difficulty={options.difficulty}
                    operationTypes={options.operationTypes}
                    language={options.language}
                    onOpenHelp={handleOpenHelp}
                  />
                )}
              </>
            )}
          </View>
        </WhisperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
