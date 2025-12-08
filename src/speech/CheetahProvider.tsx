import React, { createContext, useContext, useEffect, useState } from "react";
import { Cheetah } from "@picovoice/cheetah-react-native";
import { PvFile } from "@picovoice/react-native-voice-processor";
import { PICOVOICE_KEY } from "../../env";

interface CheetahContextType {
  cheetah: Cheetah | null;
}

const CheetahCtx = createContext<CheetahContextType>({
  cheetah: null,
});

export function CheetahProvider({ children }: { children: React.ReactNode }) {
  const [cheetah, setCheetah] = useState<Cheetah | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // 1) extraer el modelo al filesystem
        const modelPath = await PvFile.extractFileFromBundle(
          "cheetah_es.pv",
          require("../../assets/models/cheetah_params_es.pv")
        );

        // 2) crear instancia
        const instance = await Cheetah.create(PICOVOICE_KEY, modelPath, {
          endpointDuration: 0.4,
          enableAutomaticPunctuation: false,
        });

        if (mounted) {
          setCheetah(instance);
        }

        console.log("🎉 Cheetah listo en:", modelPath);
      } catch (err) {
        console.error("❌ Error init Cheetah", err);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CheetahCtx.Provider value={{ cheetah }}>
      {children}
    </CheetahCtx.Provider>
  );
}

export function useCheetah() {
  return useContext(CheetahCtx).cheetah;
}
