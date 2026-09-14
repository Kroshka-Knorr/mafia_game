"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NamesScreenProps {
  playerCount: number;
  initialNames?: string[];
  onConfirm: (names: string[]) => void;
  onBack: () => void;
}

export default function NamesScreen({
  playerCount,
  initialNames,
  onConfirm,
  onBack,
}: NamesScreenProps) {
  const [names, setNames] = useState<string[]>(() =>
    initialNames && initialNames.length === playerCount
      ? initialNames
      : Array(playerCount).fill("")
  );

  const allFilled = names.every((name) => name.trim().length > 0);

  function handleChange(index: number, value: string) {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleConfirm() {
    if (!allFilled) return;
    onConfirm(names.map((name) => name.trim()));
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-foreground">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onBack}
        aria-label="Назад"
        className="absolute top-4 left-4 min-h-11 min-w-11"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
      </Button>

      <h1 className="font-serif text-3xl">Имена игроков</h1>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {names.map((name, index) => (
          <Input
            key={index}
            value={name}
            placeholder={`Игрок ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
            className="min-h-11 text-base"
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={handleConfirm}
        disabled={!allFilled}
        className="min-h-11 w-full max-w-sm"
      >
        Дальше
      </Button>
    </div>
  );
}
