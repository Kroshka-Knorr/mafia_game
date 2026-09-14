"use client";

import { useState } from "react";
import GameDashboard from "@/components/GameDashboard";
import NamesScreen from "@/components/NamesScreen";
import ReadyScreen from "@/components/ReadyScreen";
import ResultsScreen from "@/components/ResultsScreen";
import RoleReveal from "@/components/RoleReveal";
import SetupScreen from "@/components/SetupScreen";
import { createInitialGameState, type GameState } from "@/lib/gameState";
import type { Role } from "@/lib/roles";
import { releaseWakeLock } from "@/lib/wakeLock";

type Phase = "setup" | "names" | "reveal" | "ready" | "dashboard";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [roles, setRoles] = useState<Role[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);

  function handleSetupConfirm(assignedRoles: Role[]) {
    setRoles(assignedRoles);
    setPhase("names");
  }

  function handleNamesConfirm(enteredNames: string[]) {
    setNames(enteredNames);
    setPhase("reveal");
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
    setRoles([]);
    setNames([]);
    setGameState(null);
    setPhase("setup");
  }

  if (phase === "names") {
    return <NamesScreen playerCount={roles.length} onConfirm={handleNamesConfirm} />;
  }

  if (phase === "reveal") {
    return <RoleReveal roles={roles} names={names} onComplete={handleRevealComplete} />;
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

  return <SetupScreen onConfirm={handleSetupConfirm} />;
}
