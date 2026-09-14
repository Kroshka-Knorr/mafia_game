"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignRoles,
  getDefaultRoleCounts,
  MAX_PLAYERS,
  MIN_PLAYERS,
  validateRoleCounts,
  type Role,
} from "@/lib/roles";

const PLAYERS_RANGE_HINT = `От ${MIN_PLAYERS} до ${MAX_PLAYERS} игроков`;

const ROLE_LABELS: Record<"mafia" | "sheriff" | "doctor", string> = {
  mafia: "Мафия",
  sheriff: "Шериф",
  doctor: "Доктор",
};

interface SetupScreenProps {
  onConfirm: (roles: Role[]) => void;
}

export default function SetupScreen({ onConfirm }: SetupScreenProps) {
  const [players, setPlayers] = useState(MIN_PLAYERS);
  const [manual, setManual] = useState(() => {
    const defaults = getDefaultRoleCounts(MIN_PLAYERS);
    return { mafia: defaults.mafia, sheriff: defaults.sheriff, doctor: defaults.doctor };
  });
  const [playersOutOfRange, setPlayersOutOfRange] = useState(false);

  const civilian = players - manual.mafia - manual.sheriff - manual.doctor;
  const counts = { ...manual, civilian };
  const validation = validateRoleCounts(players, counts);

  function handlePlayersChange(value: number) {
    setPlayersOutOfRange(value < MIN_PLAYERS || value > MAX_PLAYERS);

    const nextPlayers = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));
    const defaults = getDefaultRoleCounts(nextPlayers);
    setPlayers(nextPlayers);
    setManual({ mafia: defaults.mafia, sheriff: defaults.sheriff, doctor: defaults.doctor });
  }

  function handleStep(role: "mafia" | "sheriff" | "doctor", delta: number) {
    setManual((prev) => ({
      ...prev,
      [role]: Math.max(0, prev[role] + delta),
    }));
  }

  function handleStart() {
    if (!validation.valid) return;
    onConfirm(assignRoles(counts));
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-foreground">
      <h1 className="font-serif text-4xl">Мафия</h1>

      <div className="flex w-full max-w-sm flex-col gap-2">
        <label htmlFor="players" className="text-sm text-foreground/70">
          Количество игроков
        </label>
        <Input
          id="players"
          type="number"
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          value={players}
          onChange={(e) => handlePlayersChange(Number(e.target.value) || MIN_PLAYERS)}
          onBlur={(e) => handlePlayersChange(Number(e.target.value) || MIN_PLAYERS)}
        />
        {playersOutOfRange && (
          <p className="text-sm text-primary">{PLAYERS_RANGE_HINT}</p>
        )}
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {(["mafia", "sheriff", "doctor"] as const).map((role) => (
          <div key={role} className="flex items-center justify-between">
            <span>{ROLE_LABELS[role]}</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleStep(role, -1)}
                disabled={manual[role] <= 0}
                aria-label={`Уменьшить: ${ROLE_LABELS[role]}`}
              >
                −
              </Button>
              <span className="w-6 text-center tabular-nums">{manual[role]}</span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleStep(role, 1)}
                aria-label={`Увеличить: ${ROLE_LABELS[role]}`}
              >
                +
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between text-foreground/70">
          <span>Мирные</span>
          <span className="w-6 text-center tabular-nums">{civilian}</span>
        </div>
      </div>

      {!validation.valid && (
        <p className="max-w-sm text-center text-sm text-primary">{validation.error}</p>
      )}

      <Button
        type="button"
        onClick={handleStart}
        disabled={!validation.valid}
        className="w-full max-w-sm"
      >
        Начать игру
      </Button>
    </div>
  );
}
