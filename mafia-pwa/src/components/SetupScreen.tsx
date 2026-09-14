"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackgroundPattern from "@/components/icons/BackgroundPattern";
import SetupEmblem from "@/components/icons/SetupEmblem";
import {
  assignRoles,
  getDefaultRoleCounts,
  MAX_PLAYERS,
  MIN_PLAYERS,
  validateRoleCounts,
  type Role,
} from "@/lib/roles";

const PLAYERS_RANGE_ERROR = `Введите число от ${MIN_PLAYERS} до ${MAX_PLAYERS}`;

const ROLE_LABELS: Record<"mafia" | "sheriff" | "doctor", string> = {
  mafia: "Мафия",
  sheriff: "Шериф",
  doctor: "Доктор",
};

const ROLE_MIN: Record<"mafia" | "sheriff" | "doctor", number> = {
  mafia: 1,
  sheriff: 0,
  doctor: 0,
};

interface ManualRoleCounts {
  mafia: number;
  sheriff: number;
  doctor: number;
}

// Подрезает состав до валидного: мафия >= 1, мирных >= 1. Сначала урезаются
// необязательные роли (доктор, затем шериф), и только потом — мафия.
function clampRoleCounts(players: number, roles: ManualRoleCounts): ManualRoleCounts {
  let { mafia, sheriff, doctor } = roles;
  mafia = Math.max(1, mafia);

  while (mafia + sheriff + doctor > players - 1 && (doctor > 0 || sheriff > 0)) {
    if (doctor > 0) doctor -= 1;
    else sheriff -= 1;
  }

  while (mafia + sheriff + doctor > players - 1 && mafia > 1) {
    mafia -= 1;
  }

  return { mafia, sheriff, doctor };
}

interface SetupScreenProps {
  onConfirm: (roles: Role[]) => void;
}

function parsePlayers(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "") return null;

  const value = Number(trimmed);
  if (!Number.isInteger(value)) return null;
  if (value < MIN_PLAYERS || value > MAX_PLAYERS) return null;

  return value;
}

export default function SetupScreen({ onConfirm }: SetupScreenProps) {
  const [playersInput, setPlayersInput] = useState(String(MIN_PLAYERS));
  const [playersError, setPlayersError] = useState(false);
  const [players, setPlayers] = useState(MIN_PLAYERS);
  const [manual, setManual] = useState(() => {
    const defaults = getDefaultRoleCounts(MIN_PLAYERS);
    return { mafia: defaults.mafia, sheriff: defaults.sheriff, doctor: defaults.doctor };
  });

  const civilian = players - manual.mafia - manual.sheriff - manual.doctor;
  const counts = { ...manual, civilian };
  const validation = validateRoleCounts(players, counts);
  const playersValid = parsePlayers(playersInput) !== null;

  function applyPlayers(value: number) {
    const defaults = getDefaultRoleCounts(value);
    const clamped = clampRoleCounts(value, {
      mafia: defaults.mafia,
      sheriff: defaults.sheriff,
      doctor: defaults.doctor,
    });
    setPlayers(value);
    setManual(clamped);
  }

  function handlePlayersInputChange(text: string) {
    setPlayersInput(text);
    setPlayersError(false);

    const parsed = parsePlayers(text);
    if (parsed !== null) {
      applyPlayers(parsed);
    }
  }

  function handlePlayersBlur() {
    const parsed = parsePlayers(playersInput);
    if (parsed === null) {
      setPlayersError(true);
      return;
    }

    setPlayersError(false);
    setPlayersInput(String(parsed));
    applyPlayers(parsed);
  }

  function handleStep(role: "mafia" | "sheriff" | "doctor", delta: number) {
    setManual((prev) => {
      const next = { ...prev, [role]: Math.max(ROLE_MIN[role], prev[role] + delta) };
      const sum = next.mafia + next.sheriff + next.doctor;
      if (sum > players - 1) return prev;
      return next;
    });
  }

  function handleStart() {
    if (!playersValid || !validation.valid) return;
    onConfirm(assignRoles(counts));
  }

  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-background px-6 py-10 text-foreground">
      <BackgroundPattern />

      <SetupEmblem className="h-20 w-20" />
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
          value={playersInput}
          aria-invalid={playersError}
          onChange={(e) => handlePlayersInputChange(e.target.value)}
          onBlur={handlePlayersBlur}
          className="min-h-11 text-base"
        />
        {playersError && <p className="text-sm text-primary">{PLAYERS_RANGE_ERROR}</p>}
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {(["mafia", "sheriff", "doctor"] as const).map((role) => {
          const roleSum = manual.mafia + manual.sheriff + manual.doctor;
          const increaseDisabled = roleSum >= players - 1;

          return (
            <div key={role} className="flex items-center justify-between">
              <span>{ROLE_LABELS[role]}</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleStep(role, -1)}
                  disabled={manual[role] <= ROLE_MIN[role]}
                  aria-label={`Уменьшить: ${ROLE_LABELS[role]}`}
                  className="min-h-11 min-w-11"
                >
                  −
                </Button>
                <span className="w-6 text-center tabular-nums">{manual[role]}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleStep(role, 1)}
                  disabled={increaseDisabled}
                  aria-label={`Увеличить: ${ROLE_LABELS[role]}`}
                  className="min-h-11 min-w-11"
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}

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
        disabled={!playersValid || !validation.valid}
        className="min-h-11 w-full max-w-sm"
      >
        Начать игру
      </Button>
    </div>
  );
}
