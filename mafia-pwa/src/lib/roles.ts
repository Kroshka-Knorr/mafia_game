export type Role = "mafia" | "sheriff" | "doctor" | "civilian";

export interface RoleCounts {
  mafia: number;
  sheriff: number;
  doctor: number;
  civilian: number;
}

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 12;

export function getDefaultRoleCounts(players: number): RoleCounts {
  const mafia = Math.max(1, Math.floor(players / 3));
  const sheriff = players >= 5 ? 1 : 0;
  const doctor = players >= 7 ? 1 : 0;
  const civilian = players - mafia - sheriff - doctor;

  return { mafia, sheriff, doctor, civilian };
}

export function validateRoleCounts(
  players: number,
  counts: RoleCounts
): { valid: boolean; error?: string } {
  const { mafia, sheriff, doctor, civilian } = counts;

  if (mafia < 0 || sheriff < 0 || doctor < 0 || civilian < 0) {
    return { valid: false, error: "Значения ролей не могут быть отрицательными" };
  }

  if (mafia < 1) {
    return { valid: false, error: "Должен быть хотя бы один мафиози" };
  }

  if (mafia + sheriff + doctor > players - 1) {
    return { valid: false, error: "Нужен хотя бы один мирный житель" };
  }

  const total = mafia + sheriff + doctor + civilian;
  if (total !== players) {
    return {
      valid: false,
      error: `Сумма ролей (${total}) должна равняться числу игроков (${players})`,
    };
  }

  return { valid: true };
}

export function shuffleRoles(counts: RoleCounts): Role[] {
  const roles: Role[] = [
    ...Array<Role>(counts.mafia).fill("mafia"),
    ...Array<Role>(counts.sheriff).fill("sheriff"),
    ...Array<Role>(counts.doctor).fill("doctor"),
    ...Array<Role>(counts.civilian).fill("civilian"),
  ];

  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return roles;
}

export function assignRoles(counts: RoleCounts): Role[] {
  return shuffleRoles(counts);
}
