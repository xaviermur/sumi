import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MotiImage, MotiView, AnimatePresence } from "moti";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export type HelpSectionId = "intro" | "modes" | "levels" | "howToAnswer" | "summary";

interface HelpScreenProps {
  onBack: () => void;
  startSection?: HelpSectionId;
}

interface HelpSection {
  id: HelpSectionId;
  title: string;
  icon: string;
  text: string;
}

const helpSections: HelpSection[] = [
  {
    id: "intro",
    title: "Introducción",
    icon: "👋",
    text:
      "Soy Osiris y te enseñaré cómo jugar. Resolverás operaciones de matemáticas usando tu voz. ¡Es fácil y divertido!",
  },
  {
    id: "modes",
    title: "Modos de juego",
    icon: "🎮",
    text:
      "🧮 Modo libre: Elige la dificultad y el tiempo.\n⏱️ Contrarreloj: Tienes 1 minuto para resolver el mayor número de operaciones.\n🎯 Personalizado: Crea tu propio reto.",
  },
  {
    id: "levels",
    title: "Niveles de dificultad",
    icon: "📈",
    text:
      "Dificultad 1️⃣: Sumas y restas fáciles con números del 0 al 9. Algunas operaciones con llevar o prestar.\n\n" +
      "Dificultad 2️⃣: Operaciones con dos cifras pequeñas (hasta 25). Puede aparecer algún acarreo.\n\n" +
      "Dificultad 3️⃣: Sumas y restas con múltiplos de 5 o 10 (hasta 50). Mejora tu velocidad mental.\n\n" +
      "Dificultad 4️⃣: Sumas y restas de dos cifras completas, con resultados hasta 99. Más acarreos.\n\n" +
      "Dificultad 5️⃣: Operaciones de dos y tres cifras, con varios acarreos o préstamos. ¡El reto final!",
  },
  {
    id: "howToAnswer",
    title: "Cómo responder",
    icon: "🎙️",
    text:
      "Di primero la palabra mágica 'RESULTADO' y luego el número.\nEjemplo: “Resultado 25”.\nSi el juego no te entiende, repítelo despacito 🗣️.",
  },
  {
    id: "summary",
    title: "Fin del juego",
    icon: "🏁",
    text:
      "Al final del juego verás un resumen con tus aciertos, errores y puntuación total. ¡Así podrás mejorar tus récords! 🏆",
  },
];

export default function HelpScreen({ onBack, startSection = "intro" }: HelpScreenProps) {
  const [currentSection, setCurrentSection] = useState<HelpSection>(
    helpSections.find((s) => s.id === startSection) ?? helpSections[0]
  );

  useEffect(() => {
    const section = helpSections.find((s) => s.id === startSection);
    if (section) setCurrentSection(section);
  }, [startSection]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f5e7", padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🧠 Título */}
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 20,
            color: "#333",
          }}
        >
          📘 Ayuda
        </Text>

        {/* 📚 Botones de secciones */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 25,
          }}
        >
          {helpSections.map((s) => {
            const isActive = s.id === currentSection.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setCurrentSection(s)}
                style={{
                  backgroundColor: isActive ? "#2196f3" : "#fff",
                  borderRadius: 14,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  margin: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  borderWidth: isActive ? 0 : 1,
                  borderColor: "#ddd",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: isActive ? "#fff" : "#333",
                    fontWeight: "600",
                  }}
                >
                  {s.icon} {s.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🐾 Osiris + texto */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
          }}
        >
          {/* Columna izquierda - Osiris */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <MotiImage
              source={require("../../assets/osiris.png")}
              from={{ scale: 0.97, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "timing",
                duration: 2500,
                loop: true,
                repeatReverse: true,
              }}
              style={{
                width: width * 0.35,       // ocupa aprox. 35% del ancho de pantalla
                height: undefined,
                aspectRatio: 533 / 800,    // mantiene proporción original
                resizeMode: "contain",
                borderRadius: 16,
              }}
            />
          </View>

          {/* Columna derecha - texto */}
          <View style={{ flex: 2, paddingLeft: 15 }}>
            <AnimatePresence exitBeforeEnter>
              <MotiView
                key={currentSection.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -10 }}
                transition={{ type: "timing", duration: 400 }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    marginBottom: 10,
                    color: "#333",
                  }}
                >
                  {currentSection.icon} {currentSection.title}
                </Text>
                <Text style={{ fontSize: 18, color: "#444", lineHeight: 26 }}>
                  {currentSection.text}
                </Text>
              </MotiView>
            </AnimatePresence>
          </View>
        </View>
      </ScrollView>

      {/* 🔙 Botón volver */}
      <TouchableOpacity
        onPress={onBack}
        style={{
          marginTop: 20,
          alignSelf: "center",
          backgroundColor: "#2196f3",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          ⬅️ Volver
        </Text>
      </TouchableOpacity>
    </View>
  );
}
