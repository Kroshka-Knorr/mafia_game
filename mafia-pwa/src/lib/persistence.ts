import type { GameState } from "./gameState";
import type { ManualRoleCounts, Role } from "./roles";

export type PersistedScreen = "setup" | "names" | "reveal" | "ready" | "dashboard" | "results";

export interface PersistedGame {
  version: 1;
  screen: PersistedScreen;
  playerCount: number;
  roleCounts: ManualRoleCounts;
  names: string[];
  roles: Role[];
  revealIndex?: number;
  hasRevealedCurrent?: boolean;
  gameState?: GameState;
}

const STORAGE_KEY = "mafia-pwa:game";

function isStorageAvailable(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function savePersistedGame(state: PersistedGame): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.log("Не удалось сохранить состояние игры:", error);
  }
}

export function loadPersistedGame(): PersistedGame | null {
  if (!isStorageAvailable()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedGame;
    if (parsed.version !== 1) return null;

    return parsed;
  } catch (error) {
    console.log("Не удалось загрузить состояние игры:", error);
    return null;
  }
}

export function clearPersistedGame(): void {
  if (!isStorageAvailable()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log("Не удалось очистить состояние игры:", error);
  }
}
