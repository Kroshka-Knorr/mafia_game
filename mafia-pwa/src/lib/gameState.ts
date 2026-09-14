import type { Role } from "./roles";

export type PlayerStatus = "alive" | "killed" | "eliminated";

export interface PlayerState {
  name: string;
  role: Role;
  status: PlayerStatus;
  savedThisRound: boolean;
}

export interface SheriffCheck {
  round: number;
  playerIndex: number;
  isMafia: boolean;
}

export type StepId =
  | "night-transition"
  | "mafia-select"
  | "doctor-select"
  | "sheriff-select"
  | "day-announce"
  | "discussion";

export type Winner = "mafia" | "civilians" | null;

export interface NightSelections {
  mafiaTarget: number | null;
  doctorTarget: number | null;
  sheriffTarget: number | null;
}

export interface GameState {
  players: PlayerState[];
  round: number;
  step: StepId;
  nightSelections: NightSelections;
  sheriffChecks: SheriffCheck[];
  winner: Winner;
}

export function createInitialGameState(roles: Role[], names: string[]): GameState {
  return {
    players: roles.map((role, index) => ({
      name: names[index] ?? `Игрок ${index + 1}`,
      role,
      status: "alive",
      savedThisRound: false,
    })),
    round: 1,
    step: "mafia-select",
    nightSelections: { mafiaTarget: null, doctorTarget: null, sheriffTarget: null },
    sheriffChecks: [],
    winner: null,
  };
}

function hasAliveRole(players: PlayerState[], role: Role): boolean {
  return players.some((player) => player.role === role && player.status === "alive");
}

export function getNextStep(current: StepId, players: PlayerState[]): StepId {
  switch (current) {
    case "night-transition":
      return "mafia-select";
    case "mafia-select":
      if (hasAliveRole(players, "doctor")) return "doctor-select";
      if (hasAliveRole(players, "sheriff")) return "sheriff-select";
      return "day-announce";
    case "doctor-select":
      if (hasAliveRole(players, "sheriff")) return "sheriff-select";
      return "day-announce";
    case "sheriff-select":
      return "day-announce";
    case "day-announce":
      return "discussion";
    case "discussion":
      return "night-transition";
  }
}

export function checkWinCondition(players: PlayerState[]): Winner {
  const aliveMafia = players.filter((p) => p.status === "alive" && p.role === "mafia").length;
  const aliveOthers = players.filter((p) => p.status === "alive" && p.role !== "mafia").length;

  if (aliveMafia === 0) return "civilians";
  if (aliveMafia >= aliveOthers) return "mafia";
  return null;
}

export function resolveNight(state: GameState): GameState {
  const { mafiaTarget, doctorTarget } = state.nightSelections;
  const victim = mafiaTarget !== null && mafiaTarget !== doctorTarget ? mafiaTarget : null;

  const players = state.players.map((player, index) => ({
    ...player,
    status: index === victim ? "killed" : player.status,
    savedThisRound: doctorTarget !== null && index === doctorTarget,
  }));

  return { ...state, players };
}

export function resolveVoting(state: GameState, eliminatedIndex: number | null): GameState {
  const players = state.players.map((player, index) =>
    index === eliminatedIndex ? { ...player, status: "eliminated" as PlayerStatus } : player
  );

  return {
    ...state,
    players,
    round: state.round + 1,
    step: "night-transition",
    nightSelections: { mafiaTarget: null, doctorTarget: null, sheriffTarget: null },
  };
}
