export const phrases = {
  roleReveal: {
    mafia: {
      title: "Мафия",
      description: "Каждую ночь вы выбираете жертву. Ваша цель — остаться незамеченными.",
    },
    sheriff: {
      title: "Шериф",
      description: "Каждую ночь вы можете проверить одного игрока на причастность к мафии.",
    },
    doctor: {
      title: "Доктор",
      description: "Каждую ночь вы можете спасти одного игрока от расправы.",
    },
    civilian: {
      title: "Мирный житель",
      description: "У вас нет способностей. Ваше оружие — внимание и голос на голосовании.",
    },
  },

  night: {
    intro: "Город засыпает. Все закрывают глаза.",
    mafiaWake: "Мафия открывает глаза и выбирает жертву.",
    mafiaSleep: "Мафия закрывает глаза.",
    sheriffWake: "Шериф открывает глаза и указывает на подозреваемого.",
    sheriffSleep: "Шериф закрывает глаза.",
    doctorWake: "Доктор открывает глаза и выбирает, кого спасти этой ночью.",
    doctorSleep: "Доктор закрывает глаза.",
  },

  day: {
    intro: "Город просыпается.",
    victimAnnouncement: (name: string) => `Этой ночью город потерял ${name}.`,
    noVictim: "Этой ночью никто не пострадал. Доктор оказался расторопнее мафии.",
    discussionStart: "Городу пять минут на обсуждение.",
  },

  voting: {
    intro: "Время голосования. Укажите, кого подозревает город.",
    result: (name: string) => `Город изгоняет ${name}.`,
    tie: "Голоса разделились поровну. Город никого не изгоняет.",
  },

  results: {
    mafiaWin: "Мафия захватила город. Игра окончена.",
    civiliansWin: "Мафия обнаружена и обезврежена. Город победил.",
  },

  dashboard: {
    banners: {
      nightTransition: "Город засыпает.",
      mafiaSelect: "Мафия выбирает жертву.",
      doctorSelect: "Доктор выбирает, кого спасти.",
      sheriffSelect: "Шериф проверяет игрока.",
      discussion: "Город обсуждает.",
    },
    actions: {
      continue: "Дальше",
      mafiaSleep: "Мафия засыпает",
      doctorSleep: "Доктор засыпает",
      sheriffSleep: "Шериф засыпает",
      startDiscussion: "Начать обсуждение",
      tie: "Ничья, никого не изгонять",
    },
    eliminate: (name: string | null) => (name ? `Изгнать ${name}` : "Изгнать"),
    sheriffResult: (name: string, isMafia: boolean) =>
      `${name} — ${isMafia ? "мафия" : "не мафия"}.`,
    status: {
      killed: "Убит",
      eliminated: "Изгнан",
      saved: "Спасён",
    },
    checkedLabel: (isMafia: boolean) => (isMafia ? "Мафия" : "Не мафия"),
  },
} as const;
