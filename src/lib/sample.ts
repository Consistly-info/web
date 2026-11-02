/**
 * Deterministic sample data behind every graph and chart on the site.
 * It is illustrative only: Consistly has not launched and has no real users.
 */

export const HABITS = ["Morning walk", "Read", "Meditate", "Drink water"];

export interface Day {
  /** ISO date, e.g. 2026-03-14 */
  date: string;
  /** Bitmask of completed habits, one bit per entry in HABITS */
  mask: number;
}

export const WEEKS = 52;
const START = Date.UTC(2025, 10, 2); // A Sunday, so columns start on Sunday
const DAY_MS = 86_400_000;

const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function build(): Day[] {
  const next = random(20260);
  const breaks = [
    [33, 39],
    [126, 130],
    [214, 222],
  ];
  const days: Day[] = [];
  const total = WEEKS * 7;

  for (let i = 0; i < total; i++) {
    const growth = i / total;
    const weekday = new Date(START + i * DAY_MS).getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    const onBreak = breaks.some(([from, to]) => i >= from && i <= to);
    // Ends on a believable 47-day streak after one rest day.
    const streakRun = i > total - 48;
    const restDay = i === total - 48;

    let mask = 0;
    HABITS.forEach((_, habit) => {
      const ease = [0.14, 0.04, -0.08, 0.1][habit];
      let chance = 0.2 + growth * 0.56 + ease - (weekend ? 0.1 : 0);
      if (onBreak) chance *= 0.12;
      if (next() < chance) mask |= 1 << habit;
    });
    if (restDay) mask = 0;
    if (streakRun && mask === 0) mask = 1;

    days.push({
      date: new Date(START + i * DAY_MS).toISOString().slice(0, 10),
      mask,
    });
  }
  return days;
}

export const DAYS = build();

const bits = (mask: number) =>
  HABITS.reduce((n, _, i) => n + ((mask >> i) & 1), 0);

/** 0 to 4 intensity for one day; a single-habit filter is simply on or off. */
export function levelOf(mask: number, filter = -1): number {
  if (filter >= 0) return (mask >> filter) & 1 ? 3 : 0;
  return bits(mask);
}

export function statsOf(days: Day[], filter = -1) {
  const active = (d: Day) => levelOf(d.mask, filter) > 0;
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = active(day) ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  return {
    activeDays: days.filter(active).length,
    current: run,
    longest,
    completions: days.reduce(
      (n, d) => n + (filter >= 0 ? (d.mask >> filter) & 1 : bits(d.mask)),
      0,
    ),
  };
}

export interface Month {
  key: string;
  label: string;
  rate: number;
}

/** Share of possible check-ins completed in each calendar month. */
export function monthsOf(days: Day[], filter = -1): Month[] {
  const slots = filter >= 0 ? 1 : HABITS.length;
  const groups = new Map<string, Day[]>();
  for (const day of days) {
    const key = day.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), day]);
  }
  return [...groups].map(([key, list]) => {
    const done = list.reduce(
      (n, d) => n + (filter >= 0 ? (d.mask >> filter) & 1 : bits(d.mask)),
      0,
    );
    return {
      key,
      label: new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      rate: Math.round((done / (list.length * slots)) * 100),
    };
  });
}

/** Completion rate per habit across the most recent `lastDays` days. */
export function habitRates(lastDays = 30) {
  const recent = DAYS.slice(-lastDays);
  return HABITS.map((name, i) => ({
    name,
    rate: Math.round(
      (recent.filter((d) => (d.mask >> i) & 1).length / recent.length) * 100,
    ),
  })).sort((a, b) => b.rate - a.rate);
}
