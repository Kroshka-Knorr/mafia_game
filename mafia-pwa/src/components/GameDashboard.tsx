"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { phrases } from "@/lib/phrases";
import {
  checkWinCondition,
  getNextStep,
  resolveNight,
  resolveVoting,
  type GameState,
  type PlayerState,
} from "@/lib/gameState";
import type { Role } from "@/lib/roles";

interface GameDashboardProps {
  state: GameState;
  onStateChange: (state: GameState) => void;
}

const ROLE_GROUP_ORDER: Role[] = ["mafia", "sheriff", "doctor", "civilian"];

const ROLE_GROUP_LABELS: Record<Role, string> = {
  mafia: "Мафия",
  sheriff: "Шериф",
  doctor: "Доктор",
  civilian: "Мирные",
};

function statusBadge(player: PlayerState): string | null {
  if (player.status === "killed") return phrases.dashboard.status.killed;
  if (player.status === "eliminated") return phrases.dashboard.status.eliminated;
  if (player.status === "alive" && player.savedThisRound) return phrases.dashboard.status.saved;
  return null;
}

export default function GameDashboard({ state, onStateChange }: GameDashboardProps) {
  const [votingSelection, setVotingSelection] = useState<number | null>(null);
  const [lastVictimIndex, setLastVictimIndex] = useState<number | null>(null);

  const { players, step, nightSelections, sheriffChecks, round } = state;
  const sheriffIndex = players.findIndex((player) => player.role === "sheriff");

  function handleMafiaSelect(index: number) {
    onStateChange({
      ...state,
      nightSelections: { ...nightSelections, mafiaTarget: index },
    });
  }

  function handleDoctorSelect(index: number) {
    onStateChange({
      ...state,
      nightSelections: { ...nightSelections, doctorTarget: index },
    });
  }

  function handleSheriffSelect(index: number) {
    const isMafia = players[index].role === "mafia";
    onStateChange({
      ...state,
      nightSelections: { ...nightSelections, sheriffTarget: index },
      sheriffChecks: [...sheriffChecks, { round, playerIndex: index, isMafia }],
    });
  }

  function handleAdvance() {
    const next = getNextStep(step, players);

    if (next === "day-announce") {
      const victim =
        nightSelections.mafiaTarget !== null &&
        nightSelections.mafiaTarget !== nightSelections.doctorTarget
          ? nightSelections.mafiaTarget
          : null;
      const resolved = resolveNight(state);
      const winner = checkWinCondition(resolved.players);
      setLastVictimIndex(victim);
      onStateChange(winner !== null ? { ...resolved, winner } : { ...resolved, step: "day-announce" });
      return;
    }

    onStateChange({ ...state, step: next });
  }

  function handleEliminate(index: number | null) {
    const resolved = resolveVoting(state, index);
    const winner = checkWinCondition(resolved.players);
    setVotingSelection(null);
    onStateChange(winner !== null ? { ...resolved, winner } : resolved);
  }

  const bannerText = getBannerText();

  function getBannerText(): string {
    switch (step) {
      case "night-transition":
        return phrases.dashboard.banners.nightTransition;
      case "mafia-select":
        return phrases.dashboard.banners.mafiaSelect;
      case "doctor-select":
        return phrases.dashboard.banners.doctorSelect;
      case "sheriff-select":
        return phrases.dashboard.banners.sheriffSelect;
      case "day-announce":
        return lastVictimIndex !== null
          ? phrases.day.victimAnnouncement(players[lastVictimIndex].name)
          : phrases.day.noVictim;
      case "discussion":
        return phrases.dashboard.banners.discussion;
    }
  }

  function isRowClickable(index: number, player: PlayerState): boolean {
    if (player.status !== "alive") return false;
    switch (step) {
      case "mafia-select":
        return player.role !== "mafia";
      case "doctor-select":
        return true;
      case "sheriff-select":
        return index !== sheriffIndex;
      case "discussion":
        return true;
      default:
        return false;
    }
  }

  function isRowSelected(index: number): boolean {
    switch (step) {
      case "mafia-select":
        return nightSelections.mafiaTarget === index;
      case "doctor-select":
        return nightSelections.doctorTarget === index;
      case "sheriff-select":
        return nightSelections.sheriffTarget === index;
      case "discussion":
        return votingSelection === index;
      default:
        return false;
    }
  }

  function handleRowClick(index: number) {
    switch (step) {
      case "mafia-select":
        handleMafiaSelect(index);
        return;
      case "doctor-select":
        handleDoctorSelect(index);
        return;
      case "sheriff-select":
        handleSheriffSelect(index);
        return;
      case "discussion":
        setVotingSelection(index);
        return;
      default:
        return;
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background text-foreground">
      <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background px-6 py-5">
        <h1 className="font-serif text-xl">{bannerText}</h1>

        {step === "sheriff-select" && nightSelections.sheriffTarget !== null && (
          <p className="text-sm text-gold">
            {phrases.dashboard.sheriffResult(
              players[nightSelections.sheriffTarget].name,
              players[nightSelections.sheriffTarget].role === "mafia"
            )}
          </p>
        )}

        {step === "night-transition" && (
          <Button type="button" onClick={handleAdvance} className="w-full max-w-sm">
            {phrases.dashboard.actions.continue}
          </Button>
        )}

        {step === "mafia-select" && (
          <Button
            type="button"
            onClick={handleAdvance}
            disabled={nightSelections.mafiaTarget === null}
            className="w-full max-w-sm"
          >
            {phrases.dashboard.actions.mafiaSleep}
          </Button>
        )}

        {step === "doctor-select" && (
          <Button type="button" onClick={handleAdvance} className="w-full max-w-sm">
            {phrases.dashboard.actions.doctorSleep}
          </Button>
        )}

        {step === "sheriff-select" && (
          <Button type="button" onClick={handleAdvance} className="w-full max-w-sm">
            {phrases.dashboard.actions.sheriffSleep}
          </Button>
        )}

        {step === "day-announce" && (
          <Button type="button" onClick={handleAdvance} className="w-full max-w-sm">
            {phrases.dashboard.actions.startDiscussion}
          </Button>
        )}

        {step === "discussion" && (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={() => handleEliminate(votingSelection)}
              disabled={votingSelection === null}
              className="w-full max-w-sm"
            >
              {phrases.dashboard.eliminate(
                votingSelection !== null ? players[votingSelection].name : null
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleEliminate(null)}
              className="w-full max-w-sm"
            >
              {phrases.dashboard.actions.tie}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {ROLE_GROUP_ORDER.map((role) => {
          const rows = players
            .map((player, index) => ({ player, index }))
            .filter(({ player }) => player.role === role);

          if (rows.length === 0) return null;

          return (
            <section key={role} className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-foreground/60">
                {ROLE_GROUP_LABELS[role]}
              </h2>

              <ul className="flex flex-col gap-2">
                {rows.map(({ player, index }) => {
                  const clickable = isRowClickable(index, player);
                  const selected = isRowSelected(index);
                  const badge = statusBadge(player);

                  return (
                    <li key={index}>
                      <button
                        type="button"
                        disabled={!clickable}
                        onClick={() => handleRowClick(index)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                          selected
                            ? "border-gold bg-gold/10"
                            : "border-border bg-card"
                        } ${
                          clickable
                            ? "cursor-pointer hover:border-gold/60"
                            : "cursor-default"
                        } ${player.status !== "alive" ? "opacity-60" : ""}`}
                      >
                        <span>{player.name}</span>
                        {badge && (
                          <span className="text-xs text-foreground/60">{badge}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {role === "sheriff" && sheriffChecks.length > 0 && (
                <ul className="flex flex-col gap-1 pl-1 text-xs text-foreground/50">
                  {sheriffChecks.map((check, i) => (
                    <li key={i}>
                      Раунд {check.round}: {players[check.playerIndex].name} —{" "}
                      {check.isMafia ? "мафия" : "не мафия"}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
