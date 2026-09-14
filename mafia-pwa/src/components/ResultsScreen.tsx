"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { phrases } from "@/lib/phrases";
import { releaseWakeLock } from "@/lib/wakeLock";
import type { PlayerState } from "@/lib/gameState";
import type { Role } from "@/lib/roles";

interface ResultsScreenProps {
  winner: "mafia" | "civilians";
  players: PlayerState[];
  onRestart: () => void;
}

const ROLE_LABELS: Record<Role, string> = {
  mafia: "Мафия",
  sheriff: "Шериф",
  doctor: "Доктор",
  civilian: "Мирный житель",
};

export default function ResultsScreen({ winner, players, onRestart }: ResultsScreenProps) {
  useEffect(() => {
    void releaseWakeLock();
  }, []);

  const winnerText = winner === "mafia" ? phrases.results.mafiaWin : phrases.results.civiliansWin;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center text-foreground">
      <h1 className="max-w-sm font-serif text-3xl">{winnerText}</h1>

      <ul className="flex w-full max-w-sm flex-col gap-2 text-left">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
          >
            <span>{player.name}</span>
            <span className="text-sm text-foreground/70">{ROLE_LABELS[player.role]}</span>
          </li>
        ))}
      </ul>

      <Button type="button" onClick={onRestart} className="w-full max-w-sm">
        Начать новую игру
      </Button>
    </div>
  );
}
