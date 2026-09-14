"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { phrases } from "@/lib/phrases";
import type { Role } from "@/lib/roles";

interface RoleRevealProps {
  roles: Role[];
  names: string[];
  onComplete: () => void;
}

type Phase = "handoff" | "reveal";

const ROLE_ACCENT: Record<Role, string> = {
  mafia: "var(--primary)",
  sheriff: "var(--gold)",
  doctor: "var(--gold)",
  civilian: "var(--muted-foreground)",
};

export default function RoleReveal({ roles, names, onComplete }: RoleRevealProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("handoff");
  const [hasRevealed, setHasRevealed] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

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
  }

  function handleRelease() {
    setCardOpen(false);
  }

  function handleNext() {
    if (isLastPlayer) {
      onComplete();
      return;
    }
    setCurrentPlayerIndex((i) => i + 1);
    setPhase("handoff");
    setHasRevealed(false);
    setCardOpen(false);
  }

  const isOpen = phase === "reveal" && cardOpen;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-10 text-foreground">
      {phase === "handoff" && (
        <div className="flex flex-col items-center gap-2">
          <p className="max-w-sm text-center text-lg">{name}, забери устройство</p>
          <p className="text-sm text-foreground/50">
            Игрок {currentPlayerIndex + 1} из {roles.length}
          </p>
        </div>
      )}

      <div style={{ perspective: "1000px" }} className="h-72 w-48 select-none">
        <div
          onPointerDown={phase === "reveal" ? handlePress : undefined}
          onPointerUp={phase === "reveal" ? handleRelease : undefined}
          onPointerLeave={phase === "reveal" ? handleRelease : undefined}
          onPointerCancel={phase === "reveal" ? handleRelease : undefined}
          style={{
            transformStyle: "preserve-3d",
            transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 350ms ease",
            touchAction: "none",
          }}
          className="relative h-full w-full"
        >
          {/* Рубашка карты */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-gold bg-card"
          >
            <span className="font-serif text-3xl text-gold">M</span>
            {phase === "reveal" && (
              <p className="max-w-[9rem] text-center text-xs text-foreground/60">
                Зажми и держи, чтобы посмотреть роль
              </p>
            )}
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
            <h2 className="font-serif text-2xl" style={{ color: accent }}>
              {info.title}
            </h2>
            <p className="text-sm text-foreground/80">{info.description}</p>
          </div>
        </div>
      </div>

      {phase === "handoff" && (
        <Button type="button" onClick={handleReady} className="w-full max-w-sm">
          Я готов
        </Button>
      )}

      {phase === "reveal" && (
        <Button
          type="button"
          onClick={handleNext}
          disabled={!hasRevealed}
          className="w-full max-w-sm"
        >
          Дальше
        </Button>
      )}
    </div>
  );
}
