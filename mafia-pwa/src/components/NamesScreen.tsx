"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NamesScreenProps {
  playerCount: number;
  onConfirm: (names: string[]) => void;
}

export default function NamesScreen({ playerCount, onConfirm }: NamesScreenProps) {
  const [names, setNames] = useState<string[]>(() => Array(playerCount).fill(""));

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
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-foreground">
      <h1 className="font-serif text-3xl">Имена игроков</h1>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {names.map((name, index) => (
          <Input
            key={index}
            value={name}
            placeholder={`Игрок ${index + 1}`}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={handleConfirm}
        disabled={!allFilled}
        className="w-full max-w-sm"
      >
        Дальше
      </Button>
    </div>
  );
}
