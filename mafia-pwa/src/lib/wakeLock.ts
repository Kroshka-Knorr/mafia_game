let wakeLock: WakeLockSentinel | null = null;
let shouldHold = false;
let listenerAttached = false;

export function isWakeLockSupported(): boolean {
  return typeof navigator !== "undefined" && "wakeLock" in navigator;
}

function ensureVisibilityListener(): void {
  if (listenerAttached || typeof document === "undefined") return;
  listenerAttached = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && shouldHold) {
      void requestWakeLock();
    }
  });
}

export async function requestWakeLock(): Promise<void> {
  shouldHold = true;
  ensureVisibilityListener();

  if (!isWakeLockSupported()) {
    console.log("Wake Lock API не поддерживается этим браузером — экран может погаснуть.");
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (error) {
    console.log("Не удалось получить Wake Lock:", error);
  }
}

export async function releaseWakeLock(): Promise<void> {
  shouldHold = false;

  if (!wakeLock) return;

  try {
    await wakeLock.release();
  } catch (error) {
    console.log("Не удалось освободить Wake Lock:", error);
  } finally {
    wakeLock = null;
  }
}
