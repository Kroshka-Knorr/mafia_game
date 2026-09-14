export interface TtsOptions {
  rate?: number;
  pitch?: number;
}

let voicesCache: SpeechSynthesisVoice[] = [];
let listenerAttached = false;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  try {
    return window.speechSynthesis ?? null;
  } catch {
    return null;
  }
}

function ensureVoicesListener(synth: SpeechSynthesis): void {
  if (listenerAttached) return;
  listenerAttached = true;

  try {
    voicesCache = synth.getVoices();
  } catch {
    voicesCache = [];
  }

  try {
    synth.addEventListener("voiceschanged", () => {
      try {
        voicesCache = synth.getVoices();
      } catch {
        voicesCache = [];
      }
    });
  } catch {
    // Браузер без поддержки события — просто останемся с текущим кэшем.
  }
}

export function isTtsSupported(): boolean {
  return getSynth() !== null;
}

export function speak(text: string, options?: TtsOptions): void {
  const synth = getSynth();
  if (!synth) return;

  try {
    ensureVoicesListener(synth);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;

    const russianVoice = voicesCache.find((voice) => voice.lang.startsWith("ru"));
    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    synth.speak(utterance);
  } catch {
    // TTS недоступен или упал — молча игнорируем.
  }
}

export function cancelSpeech(): void {
  const synth = getSynth();
  if (!synth) return;

  try {
    synth.cancel();
  } catch {
    // no-op
  }
}
