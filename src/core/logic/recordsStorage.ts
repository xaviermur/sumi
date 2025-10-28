// src/core/logic/recordsStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ScoreRecord {
  score: number;
  correct: number;
  wrong: number;
  date: string;
}

type ModeKey = string; // ejemplo: "free_d1_t60" o "timeattack_d3"

const STORAGE_KEY = "sumi_records_v1";

/** Genera la clave para este modo/configuración */
export function getModeKey(
  mode: "free" | "timeattack",
  difficulty: number,
  duration?: number
): ModeKey {
  if (mode === "free") return `free_d${difficulty}_t${duration ?? 60}`;
  if (mode === "timeattack") return `timeattack_d${difficulty}`;
  return "unknown";
}

/** Devuelve los top5 actuales */
export async function getRecords(modeKey: ModeKey): Promise<ScoreRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const data = JSON.parse(raw) as Record<ModeKey, ScoreRecord[]>;
  return data[modeKey] ?? [];
}

/** Guarda una nueva puntuación y devuelve si entra en el top5 */
export async function saveRecord(
  modeKey: ModeKey,
  record: Omit<ScoreRecord, "date">
): Promise<{ top: ScoreRecord[]; isTop5: boolean }> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: Record<ModeKey, ScoreRecord[]> = raw ? JSON.parse(raw) : {};

  const list = data[modeKey] ?? [];
  const newRecord: ScoreRecord = { ...record, date: new Date().toISOString() };

  const updated = [...list, newRecord]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  data[modeKey] = updated;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  const isTop5 = updated.some(
    (r) =>
      r.score === newRecord.score &&
      r.date === newRecord.date // exact match
  );

  return { top: updated, isTop5 };
}
