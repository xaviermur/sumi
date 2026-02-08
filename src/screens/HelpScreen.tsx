import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { MotiImage, MotiView, AnimatePresence } from "moti";
import { useI18n } from "@/i18n/I18nProvider";

const { width } = Dimensions.get("window");

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

const helpIcons: Record<HelpSectionId, string> = {
  intro: "👋",
  modes: "🎮",
  levels: "📈",
  howToAnswer: "🎙️",
  summary: "🏁",
};

export default function HelpScreen({ onBack, startSection = "intro" }: HelpScreenProps) {
  const { strings } = useI18n();

  const helpSections: HelpSection[] = [
    {
      id: "intro",
      title: strings.help.sections.intro.title,
      icon: helpIcons.intro,
      text: strings.help.sections.intro.text,
    },
    {
      id: "modes",
      title: strings.help.sections.modes.title,
      icon: helpIcons.modes,
      text: strings.help.sections.modes.text,
    },
    {
      id: "levels",
      title: strings.help.sections.levels.title,
      icon: helpIcons.levels,
      text: strings.help.sections.levels.text,
    },
    {
      id: "howToAnswer",
      title: strings.help.sections.howToAnswer.title,
      icon: helpIcons.howToAnswer,
      text: strings.help.sections.howToAnswer.text,
    },
    {
      id: "summary",
      title: strings.help.sections.summary.title,
      icon: helpIcons.summary,
      text: strings.help.sections.summary.text,
    },
  ];

  const [currentSection, setCurrentSection] = useState<HelpSection>(
    helpSections.find((s) => s.id === startSection) ?? helpSections[0]
  );

  useEffect(() => {
    const section = helpSections.find((s) => s.id === startSection);
    if (section) setCurrentSection(section);
  }, [startSection, strings]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f5e7", padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 20,
            color: "#333",
          }}
        >
          {strings.help.title}
        </Text>

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
                width: width * 0.35,
                height: undefined,
                aspectRatio: 533 / 800,
                resizeMode: "contain",
                borderRadius: 16,
              }}
            />
          </View>

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
          {strings.records.back}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
