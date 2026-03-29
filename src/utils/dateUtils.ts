const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function _dateForGameDay(startDate: string, gameDay: number): Date {
  // Parse as local time (not UTC) by splitting the string manually,
  // avoiding the off-by-one-day timezone issue with new Date("YYYY-MM-DD")
  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + gameDay - 1);
  return date;
}

/** 0=Sun, 1=Mon, ..., 6=Sat */
export function getDayOfWeek(startDate: string, gameDay: number): number {
  return _dateForGameDay(startDate, gameDay).getDay();
}

/** True if gameDay falls on Saturday or Sunday */
export function isWeekend(startDate: string, gameDay: number): boolean {
  const dow = getDayOfWeek(startDate, gameDay);
  return dow === 0 || dow === 6;
}

export function getDayName(startDate: string, gameDay: number): string {
  return DAY_NAMES[getDayOfWeek(startDate, gameDay)];
}

export function getShortDayName(startDate: string, gameDay: number): string {
  return SHORT_DAY_NAMES[getDayOfWeek(startDate, gameDay)];
}

/** Ordinal week number within the trading career (1-indexed, each Sunday ends a week) */
export function getWeekNumber(startDate: string, gameDay: number): number {
  const startDow = getDayOfWeek(startDate, 1);
  const daysUntilFirstSunday = startDow === 0 ? 0 : 7 - startDow;
  const firstSundayDay = 1 + daysUntilFirstSunday;
  if (gameDay >= firstSundayDay) {
    return 1 + Math.floor((gameDay - firstSundayDay) / 7);
  }
  return 1;
}

/** Format a game day as a short date string, e.g. "Mon Mar 23" */
export function formatGameDate(startDate: string, gameDay: number): string {
  return _dateForGameDay(startDate, gameDay).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
