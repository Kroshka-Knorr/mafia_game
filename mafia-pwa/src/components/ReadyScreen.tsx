"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { requestWakeLock } from "@/lib/wakeLock";

interface ReadyScreenProps {
  onStart: () => void;
}

export default function ReadyScreen({ onStart }: ReadyScreenProps) {
  useEffect(() => {
    void requestWakeLock();
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center text-foreground">
      <h1 className="max-w-sm font-serif text-2xl">
        Все роли розданы. Устройство переходит к ведущему.
      </h1>
      <p className="max-w-sm text-sm text-foreground/70">
        Дальше телефон не передаётся по кругу. Игра идёт в руках ведущего.
      </p>
      <Button type="button" onClick={onStart} className="w-full max-w-sm">
        Ведущий готов, город засыпает
      </Button>
    </div>
  );
}
