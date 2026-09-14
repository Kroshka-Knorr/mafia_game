"use client";

import { useEffect, useState } from "react";
import GameDashboard from "@/components/GameDashboard";
import NamesScreen from "@/components/NamesScreen";
import ReadyScreen from "@/components/ReadyScreen";
import ResultsScreen from "@/components/ResultsScreen";
import RoleReveal from "@/components/RoleReveal";
import SetupScreen from "@/components/SetupScreen";
import { createInitialGameState, type GameState } from "@/lib/gameState";
import {
  clearPersistedGame,
  loadPersistedGame,
  savePersistedGame,
  type PersistedScreen,
} from "@/lib/persistence";
import {
  getDefaultRoleCounts,
  MIN_PLAYERS,
  type ManualRoleCounts,
  type Role,
} from "@/lib/roles";
import { releaseWakeLock } from "@/lib/wakeLock";

type Phase = "setup" | "names" | "reveal" | "ready" | "dashboard";

function initialRoleCounts(): ManualRoleCounts {
  const defaults = getDefaultRoleCounts(MIN_PLAYERS);
  return { mafia: defaults.mafia, sheriff: defaults.sheriff, doctor: defaults.doctor };
}

export default function Home() {
  const [persisted] = useState(() => loadPersistedGame());
  const restored = persisted && persisted.screen !== "setup" ? persisted : null;

  const [phase, setPhase] = useState<Phase>(
    restored ? (restored.screen === "results" ? "dashboard" : restored.screen) : "setup"
  );
  const [setupPlayers, setSetupPlayers] = useState(restored?.playerCount ?? MIN_PLAYERS);
  const [setupRoleCounts, setSetupRoleCounts] = useState<ManualRoleCounts>(
    restored?.roleCounts ?? initialRoleCounts()
  );
  const [roles, setRoles] = useState<Role[]>(restored?.roles ?? []);
  const [names, setNames] = useState<string[]>(restored?.names ?? []);
  const [gameState, setGameState] = useState<GameState | null>(restored?.gameState ?? null);
  const [revealIndex, setRevealIndex] = useState(restored?.revealIndex ?? 0);
  const [hasRevealedCurrent, setHasRevealedCurrent] = useState(
    restored?.hasRevealedCurrent ?? false
  );

  useEffect(() => {
    const screen: PersistedScreen = phase === "dashboard" && gameState?.winner ? "results" : phase;
    savePersistedGame({
      version: 1,
      screen,
      playerCount: setupPlayers,
      roleCounts: setupRoleCounts,
      names,
      roles,
      revealIndex,
      hasRevealedCurrent,
      gameState: gameState ?? undefined,
    });
  }, [phase, setupPlayers, setupRoleCounts, names, roles, gameState, revealIndex, hasRevealedCurrent]);

  function handleSetupConfirm(assignedRoles: Role[]) {
    setRoles(assignedRoles);
    setPhase("names");
  }

  function handleNamesConfirm(enteredNames: string[]) {
    setNames(enteredNames);
    setRevealIndex(0);
    setHasRevealedCurrent(false);
    setPhase("reveal");
  }

  function handleNamesBack() {
    setPhase("setup");
  }

  function handleRevealProgress(index: number, hasRevealed: boolean) {
    setRevealIndex(index);
    setHasRevealedCurrent(hasRevealed);
  }

  function handleRevealComplete() {
    setPhase("ready");
  }

  function handleReadyStart() {
    setGameState(createInitialGameState(roles, names));
    setPhase("dashboard");
  }

  function handleRestart() {
    void releaseWakeLock();
    clearPersistedGame();
    setRoles([]);
    setNames([]);
    setGameState(null);
    setSetupPlayers(MIN_PLAYERS);
    setSetupRoleCounts(initialRoleCounts());
    setPhase("setup");
  }

  if (phase === "names") {
    return (
      <NamesScreen
        playerCount={roles.length}
        initialNames={names}
        onConfirm={handleNamesConfirm}
        onBack={handleNamesBack}
      />
    );
  }

  if (phase === "reveal") {
    return (
      <RoleReveal
        roles={roles}
        names={names}
        initialIndex={revealIndex}
        initialRevealed={hasRevealedCurrent}
        onProgress={handleRevealProgress}
        onComplete={handleRevealComplete}
      />
    );
  }

  if (phase === "ready") {
    return <ReadyScreen onStart={handleReadyStart} />;
  }

  if (phase === "dashboard" && gameState) {
    if (gameState.winner) {
      return (
        <ResultsScreen
          winner={gameState.winner}
          players={gameState.players}
          onRestart={handleRestart}
        />
      );
    }
    return <GameDashboard state={gameState} onStateChange={setGameState} />;
  }

  return (
    <SetupScreen
      players={setupPlayers}
      roleCounts={setupRoleCounts}
      onPlayersChange={setSetupPlayers}
      onRoleCountsChange={setSetupRoleCounts}
      onConfirm={handleSetupConfirm}
    />
  );
}
