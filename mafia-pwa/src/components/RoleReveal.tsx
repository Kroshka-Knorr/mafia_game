"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardBack from "@/components/icons/CardBack";
import RoleIcon from "@/components/icons/RoleIcon";
import { phrases } from "@/lib/phrases";
import type { Role } from "@/lib/roles";

interface RoleRevealProps {
  roles: Role[];
  names: string[];
  onComplete: () => void;
  initialIndex?: number;
  initialRevealed?: boolean;
  onProgress?: (index: number, hasRevealed: boolean) => void;
}

type Phase = "handoff" | "reveal";

const ROLE_ACCENT: Record<Role, string> = {
  mafia: "var(--primary)",
  sheriff: "var(--gold)",
  doctor: "#4A7A9D",
  civilian: "var(--muted-foreground)",
};

export default function RoleReveal({
  roles,
  names,
  onComplete,
  initialIndex = 0,
  initialRevealed = false,
  onProgress,
}: RoleRevealProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(initialIndex);
  const [phase, setPhase] = useState<Phase>(initialRevealed ? "reveal" : "handoff");
  const [hasRevealed, setHasRevealed] = useState(initialRevealed);
  const [cardOpen, setCardOpen] = useState(initialRevealed);

  const role = roles[currentPlayerIndex];
  const name = names[currentPlayerIndex];
  const info = phrases.roleReveal[role];
  const accent = ROLE_ACCENT[role];
  const isLastPlayer = currentPlayerIndex === roles.length - 1;

  function handleReady() {
    setPhase("reveal");
  }

  function handlePress() {
    setCardOpen(true);
    setHasRevealed(true);
    onProgress?.(currentPlayerIndex, true);
  }

  function handleRelease() {
    setCardOpen(false);
  }

  function handleNext() {
    if (isLastPlayer) {
      onComplete();
      return;
    }
    const nextIndex = currentPlayerIndex + 1;
    setCurrentPlayerIndex(nextIndex);
    setPhase("handoff");
    setHasRevealed(false);
    setCardOpen(false);
    onProgress?.(nextIndex, false);
  }

  const isOpen = phase === "reveal" && cardOpen;
  const pressHandlers =
    phase === "reveal"
      ? {
          onPointerDown: handlePress,
          onPointerUp: handleRelease,
          onPointerLeave: handleRelease,
          onPointerCancel: handleRelease,
        }
      : {};

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-10 text-foreground">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-foreground/50">
          Игрок {currentPlayerIndex + 1} из {roles.length}
        </p>
        <p className="max-w-sm text-center text-lg">
          {name}, {phase === "handoff" ? "забери устройство" : "твоя очередь"}
        </p>
      </div>

      <div
        {...pressHandlers}
        style={{ touchAction: "none" }}
        className="flex flex-col items-center gap-3 select-none"
      >
        <div style={{ perspective: "1000px" }} className="h-72 w-48">
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 350ms ease",
            }}
            className="relative h-full w-full"
          >
            {/* Рубашка карты */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-gold"
            >
              <CardBack className="h-full w-full" />
            </div>

            {/* Лицо карты — роль */}
            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderColor: accent,
              }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 bg-card p-4 text-center"
            >
              <RoleIcon role={role} size={40} style={{ color: accent }} />
              <h2 className="font-serif text-2xl" style={{ color: accent }}>
                {info.title}
              </h2>
              <p className="text-sm text-foreground/80">{info.description}</p>
            </div>
          </div>
        </div>

        {phase === "reveal" && (
          <p className="text-sm text-foreground/60">Зажми и посмотри свою роль</p>
        )}
      </div>

      {phase === "handoff" && (
        <Button type="button" onClick={handleReady} className="min-h-11 w-full max-w-sm">
          Я готов
        </Button>
      )}

      {phase === "reveal" && (
        <Button
          type="button"
          onClick={handleNext}
          disabled={!hasRevealed}
          className="min-h-11 w-full max-w-sm"
        >
          Дальше
        </Button>
      )}
    </div>
  );
}
